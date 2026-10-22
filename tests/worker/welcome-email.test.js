// Bienvenida automática por correo (T57) contra D1 LOCAL efímera. Resend SIEMPRE simulado (fetch falso):
// ningún test sale a la red. Solo correos @example.com y una clave de mentira.
import { env } from 'cloudflare:test'
import { exports } from 'cloudflare:workers'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { enqueueWelcome, deliver, sweepEmails, retryDelayMs, inlineDelayMs, emailConfig, idempotencyKey, MAX_ATTEMPTS, INLINE_TRIES } from '../../worker/email/welcome.js'
import { fillTemplate, displayName } from '../../worker/email/fill.js'
import { maskEmail, scrub } from '../../worker/email/mask.js'
import { isRetryable } from '../../worker/email/resend.js'
import { handleWaitlist, saveSignup, toRow } from '../../worker/waitlist.js'
import { BUSINESS_PROMPTS } from '../../emails/src/gifts.js'

const FAKE_KEY = 're_FALSA_de_mentira_0123456789'
const ON = { ...env, WELCOME_EMAIL_ENABLED: 'true', RESEND_API_KEY: FAKE_KEY }
const T0 = new Date('2026-10-22T12:00:00Z')
const at = (ms) => () => new Date(T0.getTime() + ms)
const noSleep = async () => {}

let n = 0
const mail = (tag) => `${tag}-${++n}@example.com`

/** Resend falso: responde por turnos lo que se le pida y guarda cada llamada. */
function fakeResend(...replies) {
  const calls = []
  const fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body), headers: init.headers })
    const r = replies.length > 1 ? replies.shift() : replies[0] ?? { status: 200, body: { id: 're_test_1' } }
    if (r === 'network') throw new TypeError('fetch failed')
    return new Response(JSON.stringify(r.body ?? {}), { status: r.status })
  }
  return { fetch, calls }
}
// El barrido es GLOBAL (recoge filas de otros tests de este fichero): se cuentan solo las llamadas a cada persona.
const callsTo = (r, email) => r.calls.filter((c) => c.body.to[0] === email)
const logRow = (email) => env.DB.prepare('SELECT * FROM email_send_log WHERE email = ?').bind(email).first()
const logCount = async (email) => (await env.DB.prepare('SELECT COUNT(*) AS n FROM email_send_log WHERE email = ?').bind(email).first()).n
const signup = async (email, extra = {}) => {
  const row = { ...toRow({ email, ...extra }, new Request('https://agentceo.io/api/waitlist')), ...extra.row }
  await saveSignup(env.DB, row)
  return row
}

afterEach(() => vi.restoreAllMocks())

describe('flag WELCOME_EMAIL_ENABLED', () => {
  it('apagado (binding de test) → no encola, no envía, no barre', async () => {
    expect(env.WELCOME_EMAIL_ENABLED).toBe('false')
    const email = mail('apagado')
    const row = await signup(email, { business: 'moda' })
    const r = fakeResend()
    expect(await enqueueWelcome({ ...env, RESEND_API_KEY: FAKE_KEY }, row, { fetch: r.fetch })).toEqual({ status: 'disabled' })
    expect(await sweepEmails({ ...env, RESEND_API_KEY: FAKE_KEY }, { fetch: r.fetch })).toMatchObject({ status: 'disabled' })
    expect(await logCount(email)).toBe(0)
    expect(r.calls).toHaveLength(0)
  })
  it('solo el string "true" lo enciende', () => {
    for (const v of ['false', 'TRUE', '1', 'yes', '', undefined]) expect(emailConfig({ WELCOME_EMAIL_ENABLED: v }).enabled, String(v)).toBe(false)
    expect(emailConfig({ WELCOME_EMAIL_ENABLED: 'true' }).enabled).toBe(true)
  })
  it('signup real por /api/waitlist con el flag apagado → ni una fila de correo', async () => {
    const email = mail('signup-apagado')
    const res = await exports.default.fetch(new Request('https://agentceo.io/api/waitlist', {
      method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '10.9.0.1' }, body: JSON.stringify({ email, business: 'tienda' }),
    }))
    expect(res.status).toBe(200)
    expect(await logCount(email)).toBe(0)
  })
})

describe('idempotencia por correo', () => {
  it('inscribirse dos veces (y el paso 2) → UNA fila y UN envío; Idempotency-Key estable y sin el correo', async () => {
    const email = mail('dos-veces')
    const r = fakeResend({ status: 200, body: { id: 're_ok_1' } })
    const row = await signup(email, { business: 'comida' })
    await enqueueWelcome(ON, row, { fetch: r.fetch, now: at(0) })
    await enqueueWelcome(ON, row, { fetch: r.fetch, now: at(1000) })
    await enqueueWelcome(ON, { ...row, email }, { fetch: r.fetch, now: at(2000) })
    await sweepEmails(ON, { fetch: r.fetch, now: at(3 * 3600_000) })
    expect(await logCount(email)).toBe(1)
    expect(callsTo(r, email)).toHaveLength(1)
    const key = r.calls[0].headers['Idempotency-Key']
    expect(key).toBe(await idempotencyKey(email))
    expect(key).not.toContain(email.split('@')[0])
    expect(await logRow(email)).toMatchObject({ status: 'sent', resend_id: 're_ok_1', attempts: 1, last_error: null })
    expect((await logRow(email)).sent_at).toBeTruthy()
  })
  it('dos entregas a la vez de la misma fila → solo una gana el reclamo', async () => {
    const email = mail('carrera')
    const row = await signup(email, { business: 'tienda' })
    await env.DB.prepare(`INSERT INTO email_send_log (email, template, locale, status, next_attempt_at) VALUES (?, 'waitlist-welcome', 'es', 'pending', '2026-01-01 00:00:00')`).bind(row.email).run()
    const { id } = await logRow(email)
    const r = fakeResend()
    const out = await Promise.all([deliver(ON, id, { fetch: r.fetch, now: at(0) }), deliver(ON, id, { fetch: r.fetch, now: at(0) })])
    expect(out.map((o) => o.status).sort()).toEqual(['not-claimed', 'sent'])
    expect(r.calls).toHaveLength(1)
  })
  it('la UNIQUE(email, template) existe en el esquema (no solo en el código)', async () => {
    const email = mail('unique')
    await env.DB.prepare(`INSERT INTO email_send_log (email, template) VALUES (?, 'waitlist-welcome')`).bind(email).run()
    await expect(env.DB.prepare(`INSERT INTO email_send_log (email, template) VALUES (?, 'waitlist-welcome')`).bind(email).run()).rejects.toThrow(/UNIQUE/)
    await expect(env.DB.prepare(`INSERT INTO email_send_log (email, template, status) VALUES (?, 'otra', 'enviado')`).bind(email).run()).rejects.toThrow(/CHECK/)
  })
})

describe('backoff exponencial', () => {
  it('reintentos: entre d/2 y d, d = 1 min × 2^(n-1), tope 6 h', () => {
    expect(retryDelayMs(1, () => 0)).toBe(30_000)
    expect(retryDelayMs(1, () => 1)).toBe(60_000)
    expect(retryDelayMs(2, () => 1)).toBe(120_000)
    expect(retryDelayMs(5, () => 1)).toBe(16 * 60_000)
    expect(retryDelayMs(30, () => 1)).toBe(6 * 3600_000)
    for (let a = 1; a < 12; a++) expect(retryDelayMs(a + 1, () => 1)).toBeGreaterThanOrEqual(retryDelayMs(a, () => 1))
  })
  it('dentro de una entrega: 0,5 s y 1,5 s', () => {
    expect([0, 1].map(inlineDelayMs)).toEqual([500, 1500])
  })
})

describe('4xx vs 5xx', () => {
  it('clasificación: 2xx ok; 408/429/5xx/red y 409 concurrente reintentables; el resto de 4xx, no', () => {
    for (const s of [0, 408, 429, 500, 502, 503]) expect(isRetryable(s), String(s)).toBe(true)
    for (const s of [400, 401, 403, 404, 409, 422]) expect(isRetryable(s), String(s)).toBe(false)
    expect(isRetryable(409, 'concurrent_idempotent_requests')).toBe(true)
    expect(isRetryable(409, 'invalid_idempotent_request')).toBe(false)
  })
  it('422 de Resend → failed al PRIMER intento, sin reintentos, error sin el correo ni la clave', async () => {
    const email = mail('cuatro22')
    const r = fakeResend({ status: 422, body: { name: 'validation_error', message: `Invalid to: ${email} (key ${FAKE_KEY})` } })
    const sleeps = []
    await enqueueWelcome(ON, await signup(email, { business: 'moda' }), { fetch: r.fetch, now: at(0), sleep: async (ms) => sleeps.push(ms) })
    expect(r.calls).toHaveLength(1)
    expect(sleeps).toEqual([])
    const row = await logRow(email)
    expect(row).toMatchObject({ status: 'failed', attempts: 1, next_attempt_at: null })
    expect(row.last_error).toMatch(/http 422: validation_error/)
    expect(row.last_error).not.toContain(email)
    expect(row.last_error).not.toContain(FAKE_KEY)
  })
  it('503 → 3 intentos con su pausa, y queda pending con next_attempt_at según el backoff', async () => {
    const email = mail('cinco03')
    const r = fakeResend({ status: 503, body: { name: 'internal_server_error' } })
    const sleeps = []
    await enqueueWelcome(ON, await signup(email, { business: 'moda' }), { fetch: r.fetch, now: at(0), sleep: async (ms) => sleeps.push(ms), random: () => 1 })
    expect(r.calls).toHaveLength(INLINE_TRIES)
    expect(sleeps).toEqual([500, 1500])
    const row = await logRow(email)
    expect(row).toMatchObject({ status: 'pending', attempts: 3 })
    // 3 intentos → 4 min (con random = 1) desde T0.
    expect(row.next_attempt_at).toBe('2026-10-22 12:04:00')
    // El barrido antes de tiempo no lo toca; después sí, y entonces sale.
    const ok = fakeResend({ status: 200, body: { id: 're_tras_503' } })
    await sweepEmails(ON, { fetch: ok.fetch, now: at(60_000) })
    expect(callsTo(ok, email)).toHaveLength(0)
    expect(await logRow(email)).toMatchObject({ status: 'pending', attempts: 3 })
    await sweepEmails(ON, { fetch: ok.fetch, now: at(5 * 60_000) })
    expect(callsTo(ok, email)).toHaveLength(1)
    expect(await logRow(email)).toMatchObject({ status: 'sent', resend_id: 're_tras_503', attempts: 4 })
  })
  it('429 y caída de red también se reintentan; el siguiente intento en la misma entrega sale bien', async () => {
    const email = mail('red')
    const r = fakeResend('network', { status: 429, body: {} }, { status: 200, body: { id: 're_3' } })
    await enqueueWelcome(ON, await signup(email, { business: 'moda' }), { fetch: r.fetch, now: at(0), sleep: noSleep })
    expect(r.calls).toHaveLength(3)
    expect(await logRow(email)).toMatchObject({ status: 'sent', attempts: 3, resend_id: 're_3' })
  })
  it(`al llegar a ${MAX_ATTEMPTS} intentos → failed (max_attempts), y el barrido ya no lo toca`, async () => {
    const email = mail('agota')
    const r = fakeResend({ status: 500, body: {} })
    await enqueueWelcome(ON, await signup(email, { business: 'moda' }), { fetch: r.fetch, now: at(0), sleep: noSleep })
    for (let h = 1; h < 40 && (await logRow(email)).status === 'pending'; h++) await sweepEmails(ON, { fetch: r.fetch, now: at(h * 7 * 3600_000), sleep: noSleep })
    const row = await logRow(email)
    expect(row).toMatchObject({ status: 'failed', attempts: MAX_ATTEMPTS })
    expect(row.last_error).toMatch(/^max_attempts/)
    expect(callsTo(r, email)).toHaveLength(MAX_ATTEMPTS)
  })
})

describe('idioma y contenido', () => {
  it.each([
    ['es', 'ya tienes tu lugar en Agent CEO', 'lang="es"', 'Tu equipo te está esperando'],
    ['en', 'your spot in Agent CEO is saved', 'lang="en"', 'Your team is waiting for you'],
  ])('%s: asunto, html y texto en su idioma, con el regalo de su negocio', async (locale, subject, lang, team) => {
    const email = mail(`idioma-${locale}`)
    const r = fakeResend()
    await enqueueWelcome(ON, await signup(email, { locale, name: 'Ana', business: 'servicios' }), { fetch: r.fetch, now: at(0) })
    const { body } = r.calls[0]
    expect(body.subject).toBe(`Ana, ${subject} 🎉`)
    expect(body.html).toContain(lang)
    expect(body.text).toContain(team)
    expect(body.text).toContain(BUSINESS_PROMPTS[locale].servicios.prompt.slice(0, 50))
    expect(body.from).toBe('Agent CEO <info@agentceo.io>')
    expect(body.to).toEqual([email])
    expect(body.tags).toEqual([{ name: 'template', value: 'waitlist-welcome' }])
    expect(body.headers['List-Unsubscribe']).toMatch(/^<https:\/\/agentceo\.io\/api\/unsubscribe\?t=[a-f0-9]{48}>$/)
    expect(body.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click')
    // Mascota por defecto, PNG https absolutos, nada sin rellenar.
    const imgs = [...body.html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1])
    expect(imgs).toContain('https://agentceo.io/email-assets/v1/ceo.png')
    for (const src of imgs) expect(src).toMatch(/^https:\/\/agentceo\.io\/email-assets\/v1\/[a-z0-9-]+\.png$/)
    expect(JSON.stringify(body)).not.toMatch(/zzac[a-z]+zz/)
    expect(body.html).toContain('131 Continental Dr, Suite 305, Newark, DE 19713, USA')
  })
  it('paso 1 sin negocio → espera al paso 2; el paso 2 la adelanta y lleva SU regalo', async () => {
    const email = mail('pasos')
    const r = fakeResend()
    await enqueueWelcome(ON, await signup(email), { fetch: r.fetch, now: at(0) })
    expect(r.calls).toHaveLength(0)
    expect(await logRow(email)).toMatchObject({ status: 'pending', attempts: 0, next_attempt_at: '2026-10-22 12:02:00' })
    await saveSignup(env.DB, toRow({ email, business: 'moda' }, new Request('https://agentceo.io/')))
    await enqueueWelcome(ON, { email, locale: 'es', business_type: 'moda' }, { fetch: r.fetch, now: at(20_000) })
    expect(r.calls).toHaveLength(1)
    expect(r.calls[0].body.text).toContain(BUSINESS_PROMPTS.es.moda.prompt.slice(0, 50))
  })
  it('si nunca hace el paso 2, el barrido la manda tras la espera con el regalo por defecto', async () => {
    const email = mail('sin-paso2')
    const r = fakeResend()
    await enqueueWelcome(ON, await signup(email, { locale: 'en' }), { fetch: r.fetch, now: at(0) })
    await sweepEmails(ON, { fetch: r.fetch, now: at(60_000) })
    expect(callsTo(r, email)).toHaveLength(0)
    await sweepEmails(ON, { fetch: r.fetch, now: at(150_000) })
    expect(callsTo(r, email)).toHaveLength(1)
    expect(callsTo(r, email)[0].body.text).toContain(BUSINESS_PROMPTS.en.tienda.prompt.slice(0, 50))
  })
  it('un «sending» huérfano (Worker caído) lo reclama el barrido a los 10 min, no antes', async () => {
    const email = mail('huerfano')
    await signup(email, { business: 'moda' })
    await env.DB.prepare(`INSERT INTO email_send_log (email, template, locale, status, attempts, updated_at) VALUES (?, 'waitlist-welcome', 'es', 'sending', 1, '2026-10-22 12:00:00')`).bind(email).run()
    const r = fakeResend()
    await sweepEmails(ON, { fetch: r.fetch, now: at(5 * 60_000) })
    expect(callsTo(r, email)).toHaveLength(0)
    await sweepEmails(ON, { fetch: r.fetch, now: at(11 * 60_000) })
    expect(callsTo(r, email)).toHaveLength(1)
    expect(await logRow(email)).toMatchObject({ status: 'sent', attempts: 2 })
  })
})

describe('bajas, configuración y privacidad', () => {
  it('dado de baja → no se envía (failed: suppressed)', async () => {
    const email = mail('baja')
    await signup(email, { business: 'moda' })
    await env.DB.prepare(`INSERT INTO email_preferences (email, unsub_token, unsubscribed_at) VALUES (?, ?, datetime('now'))`).bind(email, 'a'.repeat(48)).run()
    const r = fakeResend()
    await enqueueWelcome(ON, { email, locale: 'es', business_type: 'moda' }, { fetch: r.fetch, now: at(0) })
    expect(r.calls).toHaveLength(0)
    expect(await logRow(email)).toMatchObject({ status: 'failed', last_error: 'suppressed: se dio de baja' })
  })
  it('sin RESEND_API_KEY → no reclama nada: la fila sigue pending intacta', async () => {
    const email = mail('sinclave')
    const r = fakeResend()
    const out = await enqueueWelcome({ ...ON, RESEND_API_KEY: '' }, await signup(email, { business: 'moda' }), { fetch: r.fetch, now: at(0) })
    expect(out.status).toBe('misconfigured')
    expect(await logRow(email)).toMatchObject({ status: 'pending', attempts: 0 })
    expect(r.calls).toHaveLength(0)
  })
  it('la clave nunca viaja a otro host: RESEND_API_URL ajena cae a api.resend.com', () => {
    expect(emailConfig({ RESEND_API_URL: 'https://evil.test/emails' }).apiUrl).toBe('https://api.resend.com/emails')
    expect(emailConfig({ RESEND_API_URL: 'http://evil.test/' }).apiUrl).toBe('https://api.resend.com/emails')
    expect(emailConfig({ RESEND_API_URL: 'http://127.0.0.1:8798/emails' }).apiUrl).toBe('http://127.0.0.1:8798/emails')
    expect(emailConfig({ EMAIL_ASSET_BASE_URL: 'http://x.test/v1' }).assetBase).toBe('https://agentceo.io/email-assets/v1')
  })
  it('logs: ni el correo completo ni la clave', async () => {
    const lines = []
    for (const m of ['log', 'warn', 'error']) vi.spyOn(console, m).mockImplementation((...a) => lines.push(a.join(' ')))
    const email = mail('logs')
    const r = fakeResend({ status: 503, body: { message: `boom ${email} ${FAKE_KEY}` } }, { status: 200, body: { id: 're_l' } })
    await enqueueWelcome(ON, await signup(email, { business: 'moda' }), { fetch: r.fetch, now: at(0), sleep: noSleep })
    const all = lines.join('\n')
    expect(all).toContain('email.sent')
    expect(all).toContain(maskEmail(email))
    expect(all).not.toContain(email)
    expect(all).not.toContain(FAKE_KEY)
  })
  it('maskEmail y scrub', () => {
    expect(maskEmail('ana.perez@gmail.com')).toBe('a***@g***.com')
    expect(maskEmail('raro')).toBe('***')
    expect(scrub(`x ana@gmail.com y ${FAKE_KEY}`, { secrets: [FAKE_KEY] })).toBe('x a***@g***.com y ***')
  })
})

describe('relleno del pre-render', () => {
  it('el nombre se escapa en el HTML y no rompe el asunto', () => {
    const m = fillTemplate({ locale: 'es', name: 'Ana "la" O\'Neil & co', unsubscribeUrl: 'https://agentceo.io/api/unsubscribe?t=x', assetBase: 'https://agentceo.io/email-assets/v1', now: T0 })
    expect(m.html).toContain('Ana &quot;la&quot; O&#x27;Neil &amp; co')
    expect(m.subject.startsWith('Ana "la" O\'Neil & co, ')).toBe(true)
  })
  it('un «nombre» con enlace, correo o HTML se ignora (nadie usa la bienvenida para hacer spam)', () => {
    for (const bad of ['Gana $$$ en spam.ru', 'visita https://x.test', 'www.casino.co', 'a@b.co', '<b>hola</b>', 'x/y']) expect(displayName(bad), bad).toBe('')
    expect(displayName('  Ana   María \n')).toBe('Ana María')
    const m = fillTemplate({ locale: 'es', name: 'visita https://spam.test', unsubscribeUrl: 'https://agentceo.io/u', assetBase: 'https://agentceo.io/email-assets/v1', now: T0 })
    expect(m.subject).toBe('Ya tienes tu lugar en Agent CEO 🎉')
    expect(m.html).not.toContain('spam.test')
  })
  it('la fecha de la cabecera es la del envío, en su idioma', () => {
    const es = fillTemplate({ locale: 'es', unsubscribeUrl: 'https://agentceo.io/u', assetBase: 'https://agentceo.io/email-assets/v1', now: T0 })
    const en = fillTemplate({ locale: 'en', unsubscribeUrl: 'https://agentceo.io/u', assetBase: 'https://agentceo.io/email-assets/v1', now: T0 })
    expect(es.html).toMatch(/22 de oct/)
    expect(en.html).toMatch(/Oct 22/)
  })
})

describe('el signup no espera al correo', () => {
  it('handleWaitlist responde aunque Resend no conteste nunca; el envío va a ctx.waitUntil', async () => {
    let release
    const hang = new Promise((r) => { release = r })
    const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => { await hang; return new Response('{"id":"re_tarde"}', { status: 200 }) })
    const waits = []
    const ctx = { waitUntil: (p) => waits.push(p), passThroughOnException() {} }
    const email = mail('no-espera')
    const res = await handleWaitlist(new Request('https://agentceo.io/api/waitlist', {
      method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '10.9.0.2' }, body: JSON.stringify({ email, business: 'moda' }),
    }), ON, ctx)
    expect(res.status).toBe(200)
    expect(waits).toHaveLength(1)
    release()
    await Promise.all(waits)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(await logRow(email)).toMatchObject({ status: 'sent', resend_id: 're_tarde' })
  })
  it('si el correo falla por dentro, el signup sigue siendo 200 y la persona queda guardada', async () => {
    const waits = []
    const email = mail('db-rota')
    const broken = { ...ON, DB: new Proxy(env.DB, { get: (t, k) => (k === 'prepare' ? (sql) => (/email_send_log/.test(sql) ? { bind: () => ({ run: async () => { throw new Error('D1 caída') } }) } : t.prepare(sql)) : t[k]) }) }
    const res = await handleWaitlist(new Request('https://agentceo.io/api/waitlist', {
      method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '10.9.0.3' }, body: JSON.stringify({ email }),
    }), broken, { waitUntil: (p) => waits.push(p) })
    expect(res.status).toBe(200)
    await Promise.all(waits)
    expect(await env.DB.prepare('SELECT email FROM signups WHERE email = ?').bind(email).first()).toBeTruthy()
  })
})

describe('/api/unsubscribe', () => {
  const tok = (c) => c.repeat(48)
  const call = (method, t, headers = {}) => exports.default.fetch(new Request(`https://agentceo.io/api/unsubscribe?t=${t}`, { method, headers: { 'cf-connecting-ip': '10.9.1.1', ...headers } }))
  it('GET muestra el botón y NO da de baja (los escáneres de enlaces hacen GET)', async () => {
    const email = mail('unsub-get')
    await env.DB.prepare('INSERT INTO email_preferences (email, unsub_token) VALUES (?, ?)').bind(email, tok('b')).run()
    const r = await call('GET', tok('b'))
    expect(r.status).toBe(200)
    const html = await r.text()
    expect(html).toContain('<form method="post"')
    expect(html).not.toContain(email)
    expect((await env.DB.prepare('SELECT unsubscribed_at FROM email_preferences WHERE email = ?').bind(email).first()).unsubscribed_at).toBeNull()
  })
  it('POST one-click (RFC 8058, sin Origin, como Gmail) da de baja; repetirlo no cambia la fecha', async () => {
    const email = mail('unsub-post')
    await env.DB.prepare('INSERT INTO email_preferences (email, unsub_token) VALUES (?, ?)').bind(email, tok('c')).run()
    const r = await call('POST', tok('c'), { 'content-type': 'application/x-www-form-urlencoded' })
    expect(r.status).toBe(200)
    const first = (await env.DB.prepare('SELECT unsubscribed_at FROM email_preferences WHERE email = ?').bind(email).first()).unsubscribed_at
    expect(first).toBeTruthy()
    await call('POST', tok('c'))
    expect((await env.DB.prepare('SELECT unsubscribed_at FROM email_preferences WHERE email = ?').bind(email).first()).unsubscribed_at).toBe(first)
    expect(await (await call('GET', tok('c'))).text()).toMatch(/Ya estabas dado de baja/)
  })
  it('token inválido o desconocido → 404 sin pistas; otros métodos → 405', async () => {
    for (const t of ['', 'xyz', tok('d'), "aaaa' OR 1=1 --"]) expect((await call('GET', encodeURIComponent(t))).status).toBe(404)
    expect((await call('PUT', tok('b'))).status).toBe(405)
  })
})
