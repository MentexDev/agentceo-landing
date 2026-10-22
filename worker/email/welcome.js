// Bienvenida automática a la lista de espera (T57). Ver docs/EMAILS-ENVIO.md.
//
//   POST /api/waitlist ──► responde YA ──► ctx.waitUntil(enqueueWelcome)
//                                             │ INSERT OR IGNORE en email_send_log (UNIQUE email+template)
//                                             │ ¿ya eligió negocio? → deliver() ahora
//                                             └ si no → se espera WELCOME_EMAIL_DELAY_S al paso 2 del modal
//   Cron (cada 2 min) ──► sweepEmails ──► deliver() de los pendientes que ya tocan y de los colgados
//
// deliver(): RECLAMA la fila (UPDATE … RETURNING, atómico en D1) → rellena el pre-render → POST a Resend con
// Idempotency-Key → sent | pending con backoff exponencial | failed (4xx, o agotó los intentos).
// Dos reclamos a la vez no pueden enviar dos veces: solo uno gana el UPDATE; y si un Worker muere a medias,
// el barrido lo reclama a los 10 min y la Idempotency-Key (24 h en Resend) evita el duplicado.
import { fillTemplate } from './fill.js'
import { sendEmail, RESEND_API_URL } from './resend.js'
import { maskEmail, scrub, logEvent } from './mask.js'

export const TEMPLATE = 'waitlist-welcome'
export const MAX_ATTEMPTS = 8
export const INLINE_TRIES = 3 // intentos HTTP dentro de una misma entrega (antes de dejarlo al barrido)
export const STUCK_MINUTES = 10 // un «sending» más viejo que esto se considera huérfano
export const SWEEP_BATCH = 25
const DEFAULT_SITE = 'https://agentceo.io'
// T60b: v2 (cada agente con su cara). v1 sigue publicada para los correos ya enviados.
const DEFAULT_ASSETS = 'https://agentceo.io/email-assets/v2'
const DEFAULT_FROM = 'Agent CEO <info@agentceo.io>'
const DEFAULT_DELAY_S = 120

/**
 * @typedef {object} EmailEnv
 * @property {D1Database} DB
 * @property {string} [WELCOME_EMAIL_ENABLED]  "true" enciende el envío; cualquier otra cosa, apagado
 * @property {string} [RESEND_API_KEY]         secreto (wrangler secret / .dev.vars)
 * @property {string} [RESEND_API_URL]         solo https://api.resend.com/… o localhost (e2e con mock)
 * @property {string} [EMAIL_FROM]
 * @property {string} [EMAIL_ASSET_BASE_URL]
 * @property {string} [SITE_URL]
 * @property {string} [WELCOME_EMAIL_DELAY_S]  espera al paso 2 (tipo de negocio) si aún no llegó
 * @typedef {{ fetch?: typeof fetch, sleep?: (ms: number) => Promise<void>, random?: () => number, now?: () => Date }} Deps
 */

const LOCAL = /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//
const safeUrl = (v, fallback, { allowLocal = false } = {}) => {
  const s = String(v || '').trim()
  if (!s) return fallback
  if (/^https:\/\/[^\s/]+/.test(s) || (allowLocal && LOCAL.test(s))) return s.replace(/\/+$/, '')
  return fallback
}

/** La configuración efectiva. Lo mal configurado cae al valor seguro, nunca a algo inventado. */
export function emailConfig(env) {
  const apiUrl = String(env.RESEND_API_URL || '').trim()
  return {
    enabled: env.WELCOME_EMAIL_ENABLED === 'true',
    apiKey: env.RESEND_API_KEY || '',
    // La clave solo viaja a Resend (o a un mock en localhost para el e2e): nunca a otro host.
    apiUrl: /^https:\/\/api\.resend\.com\//.test(apiUrl) || LOCAL.test(apiUrl) ? apiUrl : RESEND_API_URL,
    from: env.EMAIL_FROM || DEFAULT_FROM,
    site: safeUrl(env.SITE_URL, DEFAULT_SITE, { allowLocal: true }),
    assetBase: safeUrl(env.EMAIL_ASSET_BASE_URL, DEFAULT_ASSETS),
    delayS: Number.isFinite(Number(env.WELCOME_EMAIL_DELAY_S)) && env.WELCOME_EMAIL_DELAY_S !== '' && env.WELCOME_EMAIL_DELAY_S != null
      ? Math.max(0, Math.min(3600, Number(env.WELCOME_EMAIL_DELAY_S))) : DEFAULT_DELAY_S,
  }
}

/**
 * Espera antes del reintento n.º `attempts` (backoff exponencial con jitter «igual»: entre d/2 y d).
 * 1 → 30–60 s · 2 → 1–2 min · 3 → 2–4 min … tope 6 h.
 */
export function retryDelayMs(attempts, random = Math.random) {
  const d = Math.min(6 * 3600_000, 60_000 * 2 ** Math.max(0, attempts - 1))
  return Math.round(d / 2 + random() * (d / 2))
}
/** Pausa entre intentos HTTP dentro de una misma entrega: 0,5 s, 1,5 s. */
export const inlineDelayMs = (i) => 500 * 3 ** i

const sqlTime = (date) => date.toISOString().slice(0, 19).replace('T', ' ') // formato de datetime('now')

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
/** Idempotency-Key de Resend: estable por correo + plantilla, sin el correo en claro. */
export const idempotencyKey = async (email, template = TEMPLATE) => `${template}/${(await sha256Hex(`${template}:${email}`)).slice(0, 40)}`

const newToken = () => [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, '0')).join('')

/** Token de baja de este correo (lo crea la primera vez). */
export async function unsubscribeToken(db, email) {
  await db.prepare('INSERT OR IGNORE INTO email_preferences (email, unsub_token) VALUES (?, ?)').bind(email, newToken()).run()
  return db.prepare('SELECT unsub_token, unsubscribed_at FROM email_preferences WHERE email = ?').bind(email).first()
}

/**
 * Encola la bienvenida (idempotente) y, si ya se sabe el negocio, la entrega ya. Va SIEMPRE dentro de
 * ctx.waitUntil: la respuesta del signup no espera a nada de esto.
 * @param {EmailEnv} env
 * @param {{ email: string, locale?: string, business_type?: string|null }} row  la fila del signup
 * @param {Deps} [deps]
 */
export async function enqueueWelcome(env, row, deps = {}) {
  const cfg = emailConfig(env)
  if (!cfg.enabled) return { status: 'disabled' }
  if (!env.DB || !row?.email) return { status: 'skipped' }
  const now = (deps.now || (() => new Date()))()
  const locale = row.locale === 'en' ? 'en' : 'es'
  const due = row.business_type ? now : new Date(now.getTime() + cfg.delayS * 1000)
  const ins = await env.DB.prepare(
    `INSERT OR IGNORE INTO email_send_log (email, template, locale, status, next_attempt_at) VALUES (?, ?, ?, 'pending', ?)`,
  ).bind(row.email, TEMPLATE, locale, sqlTime(due)).run()
  const created = (ins.meta?.changes ?? 0) > 0
  await unsubscribeToken(env.DB, row.email)
  if (created) logEvent('info', 'email.queued', { template: TEMPLATE, to: maskEmail(row.email), locale, waitsForBusiness: !row.business_type })
  if (!row.business_type) return { status: created ? 'queued' : 'exists' }
  // Paso 2 del modal (o el negocio vino de entrada): adelanta la que esperaba, si aún no se intentó.
  await env.DB.prepare(
    `UPDATE email_send_log SET next_attempt_at = ? WHERE email = ? AND template = ? AND status = 'pending' AND attempts = 0`,
  ).bind(sqlTime(now), row.email, TEMPLATE).run()
  const log = await env.DB.prepare('SELECT id FROM email_send_log WHERE email = ? AND template = ?').bind(row.email, TEMPLATE).first()
  return log ? deliver(env, log.id, deps) : { status: 'skipped' }
}

/**
 * Deja la bienvenida RETENIDA (failed + motivo) sin enviarla: alta guardada pero no verificada (siteverify
 * caído, T58). La UNIQUE impide que un reintento la mande sola; para enviarla luego, a mano:
 *   UPDATE email_send_log SET status='pending', next_attempt_at=NULL, attempts=0 WHERE id=…
 * @param {EmailEnv} env
 * @param {{ email: string, locale?: string }} row
 * @param {string} reason
 */
export async function holdWelcome(env, row, reason) {
  if (!emailConfig(env).enabled || !env.DB || !row?.email) return { status: 'disabled' }
  const ins = await env.DB.prepare(
    `INSERT OR IGNORE INTO email_send_log (email, template, locale, status, last_error) VALUES (?, ?, ?, 'failed', ?)`,
  ).bind(row.email, TEMPLATE, row.locale === 'en' ? 'en' : 'es', `held: ${reason}`.slice(0, 200)).run()
  if ((ins.meta?.changes ?? 0) > 0) logEvent('warn', 'email.held', { template: TEMPLATE, to: maskEmail(row.email), reason })
  return { status: 'held' }
}

/**
 * Reclama y entrega UNA fila del log. Nunca lanza: todo resultado queda en D1 y en el log.
 * @param {EmailEnv} env
 * @param {number} id
 * @param {Deps} [deps]
 */
export async function deliver(env, id, deps = {}) {
  const cfg = emailConfig(env)
  if (!cfg.enabled) return { status: 'disabled' }
  // Sin clave no se reclama nada: la fila sigue «pending» intacta y sale sola cuando se configure.
  if (!cfg.apiKey) {
    logEvent('error', 'email.misconfigured', { reason: 'RESEND_API_KEY ausente' })
    return { status: 'misconfigured' }
  }
  const now = deps.now || (() => new Date())
  const sleep = deps.sleep || ((ms) => new Promise((r) => setTimeout(r, ms)))
  const db = env.DB
  // Reclamo atómico: solo una entrega gana. «pending» que ya toca, o «sending» huérfano.
  const job = await db.prepare(
    `UPDATE email_send_log SET status = 'sending', updated_at = ?
      WHERE id = ? AND ((status = 'pending' AND (next_attempt_at IS NULL OR next_attempt_at <= ?))
                     OR (status = 'sending' AND updated_at <= ?))
      RETURNING id, email, template, locale, attempts`,
  ).bind(sqlTime(now()), id, sqlTime(now()), sqlTime(new Date(now().getTime() - STUCK_MINUTES * 60_000))).first()
  if (!job) return { status: 'not-claimed' }
  const to = maskEmail(job.email)
  const finish = async (status, fields = {}) => {
    const f = { resend_id: null, last_error: null, next_attempt_at: null, sent_at: null, ...fields }
    await db.prepare(
      `UPDATE email_send_log SET status = ?, attempts = ?, resend_id = COALESCE(?, resend_id), last_error = ?,
              next_attempt_at = ?, sent_at = COALESCE(?, sent_at), updated_at = ? WHERE id = ?`,
    ).bind(status, f.attempts ?? job.attempts, f.resend_id, f.last_error, f.next_attempt_at, f.sent_at, sqlTime(now()), job.id).run()
    return { status, ...f }
  }

  try {
    const signup = await db.prepare('SELECT name, business_type FROM signups WHERE email = ?').bind(job.email).first()
    const pref = await unsubscribeToken(db, job.email)
    if (pref?.unsubscribed_at) {
      logEvent('info', 'email.suppressed', { template: job.template, to })
      return await finish('failed', { last_error: 'suppressed: se dio de baja' })
    }
    const unsubscribeUrl = `${cfg.site}/api/unsubscribe?t=${pref.unsub_token}`
    const msg = fillTemplate({ template: job.template, locale: job.locale, name: signup?.name, business: signup?.business_type, unsubscribeUrl, assetBase: cfg.assetBase, now: now() })
    const payload = { from: cfg.from, to: [job.email], subject: msg.subject, html: msg.html, text: msg.text, headers: msg.headers, tags: [{ name: 'template', value: job.template }] }
    const key = await idempotencyKey(job.email, job.template)

    let attempts = job.attempts
    let res
    for (let i = 0; i < INLINE_TRIES && attempts < MAX_ATTEMPTS; i++) {
      if (i > 0) await sleep(inlineDelayMs(i - 1))
      attempts++
      res = await sendEmail({ apiKey: cfg.apiKey, apiUrl: cfg.apiUrl, payload, idempotencyKey: key, fetch: deps.fetch })
      if (res.ok || !res.retryable) break
    }
    if (res?.ok) {
      logEvent('info', 'email.sent', { template: job.template, to, resend_id: res.id, attempts })
      return await finish('sent', { attempts, resend_id: res.id || null, sent_at: sqlTime(now()) })
    }
    const error = scrub(res?.error || 'sin respuesta', { secrets: [cfg.apiKey] })
    if (res && !res.retryable) {
      logEvent('error', 'email.failed', { template: job.template, to, attempts, status: res.status, error })
      return await finish('failed', { attempts, last_error: error })
    }
    if (attempts >= MAX_ATTEMPTS) {
      logEvent('error', 'email.failed', { template: job.template, to, attempts, error, reason: 'max_attempts' })
      return await finish('failed', { attempts, last_error: `max_attempts: ${error}` })
    }
    const next = new Date(now().getTime() + retryDelayMs(attempts, deps.random))
    logEvent('warn', 'email.retry', { template: job.template, to, attempts, error, next: next.toISOString() })
    return await finish('pending', { attempts, last_error: error, next_attempt_at: sqlTime(next) })
  } catch (e) {
    // Un fallo nuestro (render, D1…): se reintenta con backoff; nunca deja la fila en «sending» para siempre.
    const error = scrub(`internal: ${e?.message || e}`, { secrets: [cfg.apiKey] })
    logEvent('error', 'email.error', { template: job.template, to, error })
    const attempts = job.attempts + 1
    return finish(attempts >= MAX_ATTEMPTS ? 'failed' : 'pending', { attempts, last_error: error, next_attempt_at: attempts >= MAX_ATTEMPTS ? null : sqlTime(new Date(now().getTime() + retryDelayMs(attempts, deps.random))) }).catch(() => ({ status: 'error' }))
  }
}

/**
 * Barrido del Cron Trigger: entrega los pendientes que ya tocan y reclama los «sending» huérfanos.
 * @param {EmailEnv} env
 * @param {Deps} [deps]
 */
export async function sweepEmails(env, deps = {}) {
  const cfg = emailConfig(env)
  if (!cfg.enabled || !env.DB) return { status: 'disabled', processed: 0 }
  if (!cfg.apiKey) {
    logEvent('error', 'email.misconfigured', { reason: 'RESEND_API_KEY ausente' })
    return { status: 'misconfigured', processed: 0 }
  }
  const now = (deps.now || (() => new Date()))()
  const { results = [] } = await env.DB.prepare(
    `SELECT id FROM email_send_log
      WHERE (status = 'pending' AND (next_attempt_at IS NULL OR next_attempt_at <= ?))
         OR (status = 'sending' AND updated_at <= ?)
      ORDER BY id LIMIT ?`,
  ).bind(sqlTime(now), sqlTime(new Date(now.getTime() - STUCK_MINUTES * 60_000)), SWEEP_BATCH).all()
  const out = []
  for (const r of results) out.push(await deliver(env, r.id, deps))
  if (results.length) logEvent('info', 'email.sweep', { processed: results.length, sent: out.filter((o) => o.status === 'sent').length })
  return { status: 'ok', processed: results.length, results: out }
}
