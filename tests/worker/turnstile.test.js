// Turnstile en la lista de espera y rate limit por IP (T58), contra D1 LOCAL efímera.
// siteverify y Resend SIEMPRE simulados (fetch espiado): ningún test sale a la red. Solo @example.com.
// Claves: las de PRUEBA oficiales de Cloudflare (públicas; https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
import { env } from 'cloudflare:test'
import { exports } from 'cloudflare:workers'
import { describe, it, expect, vi, afterEach } from 'vitest'
import worker from '../../worker/index.js'
import { handleWaitlist } from '../../worker/waitlist.js'
import { siteverify, turnstileConfig, tokenFrom, TURNSTILE_VERIFY } from '../../worker/lib/turnstile.js'
import { verifyTurnstile } from '../../worker/chat/abuse.js'
import { ipKey, limited } from '../../worker/lib/ratelimit.js'

const SITE_PASS = '1x00000000000000000000AA'
const SECRET_PASS = '1x0000000000000000000000000000000AA'
const SECRET_FAIL = '2x0000000000000000000000000000000AA'
const TS = { ...env, TURNSTILE_SITE_KEY: SITE_PASS, TURNSTILE_SECRET_KEY: SECRET_PASS }
const DUMMY = 'XXXX.DUMMY.TOKEN.XXXX' // el token que da el widget con la site key de prueba

let n = 0
const mail = (tag) => `${tag}-${++n}@example.com`
const signupRow = (email) => env.DB.prepare('SELECT * FROM signups WHERE email = ?').bind(email).first()
const mailRow = (email) => env.DB.prepare('SELECT * FROM email_send_log WHERE email = ?').bind(email).first()

/** siteverify falso: imita a Cloudflare con sus claves de prueba (1x… pasa, 2x… falla), o lo que se pida. */
function fakeSiteverify(override) {
  const calls = []
  const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url, init) => {
    if (String(url) !== TURNSTILE_VERIFY) return new Response(JSON.stringify({ id: 're_fake' }), { status: 200 })
    const f = init.body
    calls.push({ secret: f.get('secret'), response: f.get('response'), remoteip: f.get('remoteip') })
    if (override) return override(f)
    const ok = f.get('secret') === SECRET_PASS && Boolean(f.get('response'))
    return Response.json(ok ? { success: true, 'error-codes': [] } : { success: false, 'error-codes': ['invalid-input-response'] })
  })
  return { calls, spy }
}
const post = (envX, body, { ip = `10.58.0.${++n % 250}`, form = false } = {}) => {
  const waits = []
  const req = new Request('https://agentceo.io/api/waitlist', {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': form ? 'application/x-www-form-urlencoded' : 'application/json', 'cf-connecting-ip': ip },
    body: form ? new URLSearchParams(body).toString() : JSON.stringify(body),
  })
  return handleWaitlist(req, envX, { waitUntil: (p) => waits.push(p) }).then(async (res) => { await Promise.all(waits); return res })
}

afterEach(() => vi.restoreAllMocks())

describe('siteverify (worker/lib/turnstile.js)', () => {
  const reply = (status, body) => async () => new Response(typeof body === 'string' ? body : JSON.stringify(body), { status })
  it('éxito → ok; manda secret, response y remoteip', async () => {
    let sent
    const r = await siteverify({ secret: 's', token: 't', ip: '1.2.3.4', fetchImpl: async (u, i) => { sent = i.body; return Response.json({ success: true }) } })
    expect(r).toEqual({ ok: true })
    expect([sent.get('secret'), sent.get('response'), sent.get('remoteip')]).toEqual(['s', 't', '1.2.3.4'])
  })
  it('veredicto «no» (token falso, caducado o repetido) → invalid', async () => {
    for (const code of ['invalid-input-response', 'timeout-or-duplicate', 'bad-request'])
      expect(await siteverify({ secret: 's', token: 't', fetchImpl: reply(200, { success: false, 'error-codes': [code] }) })).toMatchObject({ ok: false, reason: 'invalid', codes: [code] })
  })
  it('token ausente o enorme → invalid SIN llamar a Cloudflare', async () => {
    const f = vi.fn()
    for (const token of ['', null, undefined, 'x'.repeat(3000)]) expect(await siteverify({ secret: 's', token, fetchImpl: f })).toMatchObject({ reason: 'invalid' })
    expect(f).not.toHaveBeenCalled()
  })
  it('sin veredicto → unavailable: red, timeout, 5xx, JSON roto, o un fallo NUESTRO (secreto)', async () => {
    const cases = [
      [async () => { throw new TypeError('red') }, 'network'],
      [async (u, i) => new Promise((_, rej) => i.signal.addEventListener('abort', () => rej(Object.assign(new Error('t'), { name: 'TimeoutError' })))), 'timeout'],
      [reply(503, 'x'), 'http-503'],
      [reply(200, 'no es json'), 'bad-json'],
      [reply(200, { success: false, 'error-codes': ['invalid-input-secret'] }), 'invalid-input-secret'],
      [reply(200, { success: false, 'error-codes': ['internal-error'] }), 'internal-error'],
    ]
    for (const [fetchImpl, code] of cases) expect(await siteverify({ secret: 's', token: 't', fetchImpl, timeoutMs: 20 }), code).toMatchObject({ ok: false, reason: 'unavailable', codes: [code] })
  })
  it('el chat reutiliza la misma pieza (y en el chat, sin veredicto = no verificado)', async () => {
    expect(await verifyTurnstile({ secret: 's', token: 't', fetchImpl: async () => Response.json({ success: true }) })).toBe(true)
    expect(await verifyTurnstile({ secret: 's', token: 't', fetchImpl: async () => { throw new Error('red') } })).toBe(false)
  })
  it('activo solo con las DOS claves, y la pública con forma de site key', () => {
    expect(turnstileConfig({}).enabled).toBe(false)
    expect(turnstileConfig({ TURNSTILE_SITE_KEY: SITE_PASS }).enabled).toBe(false)
    expect(turnstileConfig({ TURNSTILE_SECRET_KEY: SECRET_PASS }).enabled).toBe(false)
    expect(turnstileConfig({ TURNSTILE_SITE_KEY: '"><script>', TURNSTILE_SECRET_KEY: SECRET_PASS }).enabled).toBe(false)
    expect(turnstileConfig({ TURNSTILE_SITE_KEY: SITE_PASS, TURNSTILE_SECRET_KEY: SECRET_PASS }).enabled).toBe(true)
    expect(env.TURNSTILE_SITE_KEY).toBe('') // wrangler.jsonc: placeholder vacío hasta tener la real
  })
  it('el token llega como turnstile (fetch) o cf-turnstile-response (formulario)', () => {
    expect(tokenFrom({ turnstile: ' a ' })).toBe('a')
    expect(tokenFrom({ 'cf-turnstile-response': 'b' })).toBe('b')
    expect(tokenFrom({ turnstile: 5 })).toBe('')
  })
})

describe('POST /api/waitlist con Turnstile', () => {
  it('token válido → 200, se guarda; siteverify recibe la IP del visitante', async () => {
    const sv = fakeSiteverify()
    const email = mail('ts-ok')
    const r = await post(TS, { email, turnstile: DUMMY }, { ip: '203.0.113.7' })
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, received: true })
    expect(await signupRow(email)).toBeTruthy()
    expect(sv.calls).toEqual([{ secret: SECRET_PASS, response: DUMMY, remoteip: '203.0.113.7' }])
  })
  it('token inválido (clave 2x… de prueba) → 403 verification_failed; ni se guarda ni se encola el correo', async () => {
    fakeSiteverify()
    const email = mail('ts-mal')
    const r = await post({ ...TS, TURNSTILE_SECRET_KEY: SECRET_FAIL, WELCOME_EMAIL_ENABLED: 'true', RESEND_API_KEY: 're_FALSA_0123456789' }, { email, turnstile: DUMMY, business: 'moda' })
    expect(r.status).toBe(403)
    expect(await r.json()).toEqual({ ok: false, error: 'verification_failed' })
    expect(await signupRow(email)).toBeNull()
    expect(await mailRow(email)).toBeNull()
  })
  it('token ausente → 403 sin llamar a siteverify', async () => {
    const sv = fakeSiteverify()
    const email = mail('ts-sin')
    expect((await post(TS, { email })).status).toBe(403)
    expect(sv.calls).toHaveLength(0)
    expect(await signupRow(email)).toBeNull()
  })
  it('sin TURNSTILE_SECRET_KEY → comportamiento de antes: 200 sin token y sin llamar a siteverify', async () => {
    const sv = fakeSiteverify()
    const email = mail('ts-apagado')
    const r = await post({ ...env, TURNSTILE_SITE_KEY: SITE_PASS }, { email })
    expect(r.status).toBe(200)
    expect(await signupRow(email)).toBeTruthy()
    expect(sv.calls).toHaveLength(0)
  })
  it('siteverify caído → FAIL-OPEN degradado: se guarda el alta pero la bienvenida queda retenida (sin enviar)', async () => {
    const sv = fakeSiteverify(() => new Response('caído', { status: 503 }))
    const email = mail('ts-caido')
    const r = await post({ ...TS, WELCOME_EMAIL_ENABLED: 'true', RESEND_API_KEY: 're_FALSA_0123456789' }, { email, turnstile: DUMMY, business: 'moda' })
    expect(r.status).toBe(200)
    expect(await signupRow(email)).toBeTruthy()
    expect(await mailRow(email)).toMatchObject({ status: 'failed', attempts: 0, last_error: 'held: turnstile_unavailable:http-503' })
    // Ninguna llamada a Resend: solo la de siteverify.
    expect(sv.spy.mock.calls.map(([u]) => String(u))).toEqual([TURNSTILE_VERIFY])
  })
  it('con token válido y el correo encendido, la bienvenida sí sale', async () => {
    const sv = fakeSiteverify()
    const email = mail('ts-correo')
    await post({ ...TS, WELCOME_EMAIL_ENABLED: 'true', RESEND_API_KEY: 're_FALSA_0123456789' }, { email, turnstile: DUMMY, business: 'moda' })
    expect(await mailRow(email)).toMatchObject({ status: 'sent' })
    expect(sv.spy.mock.calls.map(([u]) => String(u))).toEqual([TURNSTILE_VERIFY, 'https://api.resend.com/emails'])
  })
  it('formulario sin JS: cf-turnstile-response válido → 303 a /gracias/; sin token → 303 a /gracias/#error', async () => {
    fakeSiteverify()
    const ok = await post(TS, { email: mail('ts-form'), locale: 'es', 'cf-turnstile-response': DUMMY }, { form: true })
    expect(ok.status).toBe(303)
    expect(ok.headers.get('location')).toBe('https://agentceo.io/gracias/')
    const bad = await post(TS, { email: mail('ts-form-mal'), locale: 'en' }, { form: true })
    expect(bad.status).toBe(303)
    expect(bad.headers.get('location')).toBe('https://agentceo.io/en/thanks/#error')
  })
  it('honeypot y correo inválido se resuelven ANTES de gastar una llamada a siteverify', async () => {
    const sv = fakeSiteverify()
    expect((await post(TS, { email: mail('hp'), company: 'bot', turnstile: DUMMY })).status).toBe(200)
    expect((await post(TS, { email: 'no-es-correo', turnstile: DUMMY })).status).toBe(400)
    expect(sv.calls).toHaveLength(0)
  })
})

describe('HTML y CSP', () => {
  const page = (envX) => worker.fetch(new Request('https://agentceo.io/'), envX, { waitUntil() {}, passThroughOnException() {} })
  it('apagado (wrangler.jsonc): sin meta, sin challenges.cloudflare.com en la CSP', async () => {
    const r = await exports.default.fetch(new Request('https://agentceo.io/'))
    const html = await r.text()
    expect(html).not.toContain('ac-turnstile')
    expect(r.headers.get('content-security-policy')).not.toContain('challenges.cloudflare.com')
  })
  it('activo: meta con la site key en el <head> y la CSP abre script-src y frame-src SOLO a Cloudflare', async () => {
    const r = await page(TS)
    const html = await r.text()
    expect(html).toMatch(new RegExp(`<meta name="ac-turnstile" content="${SITE_PASS}"></head>`))
    const csp = r.headers.get('content-security-policy')
    expect(csp).toMatch(/script-src 'self' 'unsafe-inline' https:\/\/challenges\.cloudflare\.com/)
    expect(csp).toContain('frame-src https://challenges.cloudflare.com')
  })
  it('solo la site key (sin secreto) no activa nada', async () => {
    const html = await (await page({ ...env, TURNSTILE_SITE_KEY: SITE_PASS })).text()
    expect(html).not.toContain('ac-turnstile')
  })
  it('el formulario trae su hueco para el reto y la página, el texto del error traducido', async () => {
    const es = await (await exports.default.fetch(new Request('https://agentceo.io/'))).text()
    const en = await (await exports.default.fetch(new Request('https://agentceo.io/en/'))).text()
    expect(es).toContain('data-wl-ts')
    expect(es).toContain('No pudimos comprobar que eres una persona')
    expect(en).toContain('couldn\'t check that you\'re a person')
  })
})

describe('rate limit por IP del signup (RL_FORMS: 8 por minuto por IP y ruta)', () => {
  it('IPv4 tal cual; IPv6 por su /64 (rotar dentro del /64 ya no salta el límite)', () => {
    expect(ipKey('203.0.113.9')).toBe('203.0.113.9')
    expect(ipKey('2001:db8:abcd:12:1::5')).toBe(ipKey('2001:0db8:abcd:0012:ffff:ffff:ffff:1'))
    expect(ipKey('2001:db8:abcd:12::1')).not.toBe(ipKey('2001:db8:abcd:13::1'))
    expect(ipKey(null)).toBe('local')
  })
  it('limited() cuenta con esa clave: dos IPv6 del mismo /64 comparten cupo', async () => {
    const keys = []
    const rl = { limit: async ({ key }) => { keys.push(key); return { success: keys.filter((k) => k === key).length <= 1 } } }
    const req = (ip) => new Request('https://agentceo.io/api/waitlist', { method: 'POST', headers: { 'cf-connecting-ip': ip } })
    expect(await limited(req('2001:db8:1:2::a'), { RL_FORMS: rl })).toBeNull()
    const second = await limited(req('2001:db8:1:2:ffff::b'), { RL_FORMS: rl })
    expect(second.status).toBe(429)
    expect(keys).toEqual(['2001:db8:1:2::/64:/api/waitlist', '2001:db8:1:2::/64:/api/waitlist'])
  })
  it('el binding real: la 9.ª petición de la misma IP en el minuto → 429 rate_limited (otra IP sigue)', async () => {
    const s = new Date().getSeconds()
    if (s > 45) await new Promise((r) => setTimeout(r, (61 - s) * 1000))
    const hit = (ip, i) => exports.default.fetch(new Request('https://agentceo.io/api/waitlist', {
      method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip }, body: JSON.stringify({ email: `rl-${i}-${n}@example.com` }),
    }))
    const codes = []
    for (let i = 0; i < 9; i++) codes.push((await hit('198.51.100.58', i)).status)
    expect(codes.slice(0, 8).every((c) => c === 200)).toBe(true)
    expect(codes[8]).toBe(429)
    expect((await hit('198.51.100.59', 99)).status).toBe(200)
  }, 70_000)
})
