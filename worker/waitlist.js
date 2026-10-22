// POST /api/waitlist · lista de espera (pre-lanzamiento) en D1 `agentceo-waitlist`.
//
// Acepta DOS formas de envío:
//  · JSON (fetch desde el front con JS)        → responde JSON { ok, error? }.
//  · formulario HTML normal (sin JS)           → responde 303 a /gracias/ (o #error).
//
// Una segunda llamada con el MISMO correo y `business` completa el tipo de negocio
// (paso 2 del modal) sin tocar la atribución del primer toque. La respuesta es la
// misma exista o no el correo: nadie puede averiguar quién está en la lista.
//
// Compatibilidad de esquema: si la migración 0002 aún no se aplicó en producción,
// el INSERT v2 falla por columna inexistente y se reintenta con el esquema v1.
import { json } from './lib/http.js'
import { str, cleanEmail, isBot } from './lib/validate.js'
import { limited, foreignOrigin } from './lib/ratelimit.js'
import { BUSINESS_TYPES, UTM_KEYS } from '../src/data/waitlist.js'
import { enqueueWelcome, holdWelcome } from './email/welcome.js'
import { turnstileConfig, tokenFrom, siteverify } from './lib/turnstile.js'
import { scrub, logEvent } from './email/mask.js'

const LOCALES = ['es', 'en']
const THANKS = { es: '/gracias/', en: '/en/thanks/' }
// Un humano no rellena y envía un formulario en menos de esto (ms desde que se pintó).
const MIN_HUMAN_MS = 1200

/** Lee el cuerpo sea JSON o formulario. Devuelve { body, isForm } o null. */
async function readBody(request) {
  const ct = request.headers.get('content-type') || ''
  try {
    if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const fd = await request.formData()
      return { body: Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === 'string')), isForm: true }
    }
    const b = await request.json()
    return b && typeof b === 'object' && !Array.isArray(b) ? { body: b, isForm: false } : null
  } catch {
    return null
  }
}

/** Normaliza el cuerpo a una fila. Exportado para los tests. */
export function toRow(body, request) {
  const locale = LOCALES.includes(body.locale) ? body.locale : 'es'
  const business = BUSINESS_TYPES.includes(body.business) ? body.business : null
  const row = {
    email: cleanEmail(body.email),
    name: str(body.name, 120) || null,
    source: str(body.source, 60) || 'landing',
    referrer: str(body.referrer, 300) || null,
    user_agent: str(request.headers.get('user-agent') || '', 300) || null,
    locale,
    business_type: business,
    click_id: str(body.click_id, 200) || null,
    ref: str(body.ref, 100) || null,
    landing_path: str(body.landing_path, 300) || null,
    notice_version: str(body.notice_version, 20) || null,
  }
  for (const k of UTM_KEYS) row[k] = str(body[k], 150) || null
  return row
}

const V2_COLS = ['email', 'name', 'source', 'referrer', 'user_agent', 'locale', 'business_type',
  ...UTM_KEYS, 'click_id', 'ref', 'landing_path', 'notice_version']

/** Guarda la fila. Devuelve 'v2' o 'v1' según el esquema que haya aceptado. */
export async function saveSignup(db, row) {
  const sqlV2 =
    `INSERT INTO signups (${V2_COLS.join(', ')}) VALUES (${V2_COLS.map(() => '?').join(', ')})
     ON CONFLICT(email) DO UPDATE SET
       business_type = COALESCE(signups.business_type, excluded.business_type),
       updated_at = CASE WHEN signups.business_type IS NULL AND excluded.business_type IS NOT NULL
                         THEN datetime('now') ELSE signups.updated_at END`
  try {
    await db.prepare(sqlV2).bind(...V2_COLS.map((c) => row[c])).run()
    return 'v2'
  } catch (e) {
    if (!/no (such )?column|has no column/i.test(String(e?.message || e))) throw e
    // Esquema v1 (migración 0002 sin aplicar): se guarda lo que cabe; nada se pierde del correo.
    await db.prepare('INSERT OR IGNORE INTO signups (email, name, source, referrer, user_agent) VALUES (?, ?, ?, ?, ?)')
      .bind(row.email, row.name, row.source, row.referrer, row.user_agent)
      .run()
    return 'v1'
  }
}

/**
 * La bienvenida por correo (T57), FUERA de la respuesta: ctx.waitUntil. Un fallo aquí jamás tumba el signup.
 * Con el flag WELCOME_EMAIL_ENABLED distinto de "true", enqueueWelcome no toca nada.
 */
export function scheduleWelcome(env, ctx, row, { hold = null } = {}) {
  const p = (hold ? holdWelcome(env, row, hold) : enqueueWelcome(env, row)).catch((e) => logEvent('error', 'email.enqueue_failed', { error: scrub(e?.message || e, { secrets: [env.RESEND_API_KEY] }) }))
  if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(p)
  return p
}

export async function handleWaitlist(request, env, ctx) {
  const url = new URL(request.url)
  const parsed = await readBody(request)
  const isForm = parsed?.isForm ?? false
  const body = parsed?.body ?? {}
  const locale = LOCALES.includes(body.locale) ? body.locale : 'es'

  // Respuesta según el canal: JSON para fetch, 303 para el formulario sin JS.
  const reply = (ok, error, status) =>
    isForm
      ? Response.redirect(new URL(THANKS[locale] + (ok ? '' : '#error'), url).toString(), 303)
      : json(ok ? { ok: true, received: true } : { ok: false, error }, status)

  if (foreignOrigin(request)) return reply(false, 'forbidden', 403)
  const rl = await limited(request, env)
  if (rl) return isForm ? reply(false, 'rate_limited', 429) : rl
  if (!parsed) return reply(false, 'invalid_body', 400)

  // Honeypot y trampa de tiempo: OK a propósito, sin guardar (no le avisamos al bot).
  const elapsed = Number(body.t)
  if (isBot(body) || (Number.isFinite(elapsed) && elapsed > 0 && elapsed < MIN_HUMAN_MS)) return reply(true)

  const row = toRow(body, request)
  if (!row.email) return reply(false, 'invalid_email', 400)

  // Turnstile (T58), ANTES de guardar y de encolar el correo. Solo si están las dos claves.
  //  · token ausente / falso / caducado / ya usado → 403 'verification_failed' (el front lo traduce).
  //  · siteverify sin veredicto (red, timeout, 5xx, secreto mal puesto) → FAIL-OPEN DEGRADADO: se guarda el
  //    alta (tráfico pagado: una caída de Cloudflare no puede costarnos leads reales), pero la bienvenida
  //    queda RETENIDA, sin enviarse (un bot no verificado no estropea la reputación del dominio).
  //    Ver docs/TURNSTILE.md.
  let hold = null
  const ts = turnstileConfig(env)
  if (ts.enabled) {
    const v = await siteverify({ secret: ts.secret, token: tokenFrom(body), ip: request.headers.get('cf-connecting-ip') })
    if (!v.ok && v.reason === 'invalid') {
      logEvent('info', 'waitlist.turnstile_rejected', { codes: v.codes.join(',') })
      return reply(false, 'verification_failed', 403)
    }
    if (!v.ok) {
      hold = `turnstile_unavailable:${v.codes.join(',')}`
      logEvent('warn', 'waitlist.turnstile_unavailable', { codes: v.codes.join(',') })
    }
  }

  try {
    await saveSignup(env.DB, row)
  } catch {
    return reply(false, 'server_error', 500)
  }
  // El tipo de negocio guardado (el del paso 2, o el primero si ya estaba): el regalo del correo lo sigue.
  scheduleWelcome(env, ctx, { email: row.email, locale: row.locale, business_type: row.business_type }, { hold })
  return reply(true)
}
