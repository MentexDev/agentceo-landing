// ANTI-ABUSO del widget (adenda T32): UN test por cada límite o capa, en el runtime real de
// Workers con el Durable Object real. Nunca hay red: Gemini y siteverify son fetch FALSOS.
// (Ráfaga por IP, longitud, turnos y tope global $5 + concurrencia: en chat.test.js.)
import { env } from 'cloudflare:test'
import { describe, it, expect } from 'vitest'
import { handleChat, LIMITS } from '../../worker/chat/handler.js'
import { runChannel } from '../../worker/chat/channels/index.js'
import { ipKey, sessionKey, today, hourOf, minuteOf } from '../../worker/chat/guard.js'
import { suspicion, verifyTurnstile, counter, normQ, hasPII } from '../../worker/chat/abuse.js'
import { maxTokensFor } from '../../worker/chat/respond.js'

const BROWSER = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36', 'accept-language': 'es-ES,es;q=0.9' }
let n = 0
const uniq = () => ++n
const ipOf = () => `198.51.100.${uniq() % 250}`
const sid = () => `sesion-de-prueba-${uniq()}-abcdefgh`
const req = (body, { ip = ipOf(), headers = {} } = {}) => new Request('https://agentceo.io/api/chat', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip, ...BROWSER, ...headers },
  body: JSON.stringify(body),
})
const ask = (text, extra = {}) => ({ locale: 'es', messages: [{ role: 'user', content: text }], ...extra })
async function readSSE(res) {
  const raw = await res.text()
  const events = raw.trim().split('\n\n').map((b) => ({ ev: /event: (\w+)/.exec(b)?.[1], data: JSON.parse(/data: (.*)/.exec(b)?.[1] || '{}') }))
  return { meta: events.find((e) => e.ev === 'meta')?.data, text: events.filter((e) => e.ev === 'delta').map((e) => e.data.t).join(''), events }
}
const guard = (name) => env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName(name))
const fast = { ...env, CHAT_STUB_DELAY_MS: '0' }
const TS = { TURNSTILE_SITE_KEY: '1x00000000000000000000AA', TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' }
const live = { ...fast, CHAT_MODE: 'live', GEMINI_API_KEY: 'clave-FALSA-de-test', ...TS }
const okTs = async () => Response.json({ success: true })
const badTs = async () => Response.json({ success: false, 'error-codes': ['invalid-input-response'] })
const part = (t) => ({ candidates: [{ content: { role: 'model', parts: [{ text: t }] } }] })
const gemini = (text, usage = { promptTokenCount: 2000, candidatesTokenCount: 50 }) => new Response(new ReadableStream({
  start(c) { const e = new TextEncoder(); c.enqueue(e.encode(`data: ${JSON.stringify(part(text))}\r\n\r\n`)); c.enqueue(e.encode(`data: ${JSON.stringify({ ...part(''), usageMetadata: usage })}\r\n\r\n`)); c.close() },
}), { headers: { 'content-type': 'text/event-stream' } })
/** fetch falso de Gemini que cuenta las llamadas. */
const counting = (text = 'Respuesta del modelo.') => { const f = async () => { f.calls++; return gemini(text) }; f.calls = 0; return f }
const Qn = () => `explícame cómo ayudaría a mi tienda de bicicletas, caso ${uniq()}`

describe('límites por IP (hora y día, en el Durable Object)', () => {
  it('hora: la 31.ª petición de la misma IP en la hora → 429 rate_limited', async () => {
    const ip = ipOf()
    await guard(await ipKey(ip)).bump(`hr:${hourOf()}`, LIMITS.ipHour)
    const r = await handleChat(req(ask('hola'), { ip }), fast)
    expect(r.status).toBe(429)
    expect((await r.json()).error).toBe('rate_limited')
  })
  it('día: la 61.ª petición de la misma IP en el día → 429 daily_limit', async () => {
    const ip = ipOf()
    await guard(await ipKey(ip)).bump(`day:${today()}`, LIMITS.ipDay)
    const r = await handleChat(req(ask('hola'), { ip }), fast)
    expect(r.status).toBe(429)
    expect((await r.json()).error).toBe('daily_limit')
  })
})

describe('límites por sesión (minuto, hora y día)', () => {
  it.each([
    ['minuto', () => `mn:${minuteOf()}`, LIMITS.sessionMinute, 'rate_limited'],
    ['hora', () => `hr:${hourOf()}`, LIMITS.sessionHour, 'rate_limited'],
    ['día', () => `day:${today()}`, LIMITS.sessionDay, 'daily_limit'],
  ])('%s: la sesión llena → 429, y otra sesión de la misma IP sigue', async (_, key, max, error) => {
    const ip = ipOf(), s = sid()
    await guard(await sessionKey(s)).bump(key(), max)
    const r = await handleChat(req(ask('hola', { session: s }), { ip }), fast)
    expect(r.status).toBe(429)
    expect((await r.json()).error).toBe(error)
    const otra = await handleChat(req(ask('hola', { session: sid() }), { ip }), fast)
    expect(otra.status).toBe(200)
    await otra.text()
  })
  it('un id de sesión con formato raro se ignora (manda el límite por IP)', async () => {
    const r = await handleChat(req(ask('hola', { session: '../../x' })), fast)
    expect(r.status).toBe(200)
    await r.text()
  })
})

describe('salida máxima de tokens', () => {
  it('400 es techo duro: la variable de entorno solo puede bajarlo', () => {
    expect(maxTokensFor({})).toBe(400)
    expect(maxTokensFor({ CHAT_MAX_TOKENS: '5000' })).toBe(400)
    expect(maxTokensFor({ CHAT_MAX_TOKENS: '120' })).toBe(120)
  })
  it('lo que se envía al modelo respeta el techo aunque el entorno pida más', async () => {
    let sent
    const f = async (_, init) => { sent = JSON.parse(init.body); return gemini('ok') }
    await readSSE(await handleChat(req(ask(Qn(), { turnstile: 't' })), { ...live, CHAT_MAX_TOKENS: '9999' }, null, { fetchImpl: f, verifyFetch: okTs }))
    expect(sent.generationConfig.maxOutputTokens).toBe(400)
  })
})

describe('Turnstile antes de gastar', () => {
  it('sin claves de Turnstile configuradas → live no arranca, ni se pide reto', async () => {
    const f = counting()
    const { meta } = await readSSE(await handleChat(req(ask(Qn(), { turnstile: 't' })), { ...live, TURNSTILE_SITE_KEY: undefined, TURNSTILE_SECRET_KEY: undefined }, null, { fetchImpl: f, verifyFetch: okTs }))
    expect(f.calls).toBe(0)
    expect(meta.mode).toBe('stub')
    expect(meta.fallback).toBe('no_turnstile')
    expect(meta.challenge).toBeUndefined()
  })
  it('sin token → stub y el reto (site key) para el cliente; no llama al modelo', async () => {
    const f = counting()
    const { meta } = await readSSE(await handleChat(req(ask(Qn())), live, null, { fetchImpl: f, verifyFetch: okTs }))
    expect(f.calls).toBe(0)
    expect(meta.fallback).toBe('challenge')
    expect(meta.challenge).toEqual({ turnstile: TS.TURNSTILE_SITE_KEY })
  })
  it('token rechazado por siteverify → no gasta', async () => {
    const f = counting()
    const { meta } = await readSSE(await handleChat(req(ask(Qn(), { turnstile: 'malo' })), live, null, { fetchImpl: f, verifyFetch: badTs }))
    expect(f.calls).toBe(0)
    expect(meta.fallback).toBe('challenge')
  })
  it('token válido → live, y la sesión queda verificada (el siguiente mensaje no necesita token)', async () => {
    const f = counting(), s = sid(), ip = ipOf()
    let verifies = 0
    const v = async (...a) => { verifies++; return okTs(...a) }
    const a = await readSSE(await handleChat(req(ask(Qn(), { session: s, turnstile: 'bueno' }), { ip }), live, null, { fetchImpl: f, verifyFetch: v }))
    const b = await readSSE(await handleChat(req(ask(Qn(), { session: s }), { ip }), live, null, { fetchImpl: f, verifyFetch: v }))
    expect([a.meta.mode, b.meta.mode]).toEqual(['live', 'live'])
    expect(f.calls).toBe(2)
    expect(verifies).toBe(1)
  })
  it('verifyTurnstile: red caída, token vacío o enorme → no verificado', async () => {
    expect(await verifyTurnstile({ secret: 's', token: 't', fetchImpl: async () => { throw new TypeError('red') } })).toBe(false)
    expect(await verifyTurnstile({ secret: 's', token: '', fetchImpl: okTs })).toBe(false)
    expect(await verifyTurnstile({ secret: 's', token: 'x'.repeat(5000), fetchImpl: okTs })).toBe(false)
    expect(await verifyTurnstile({ secret: '', token: 't', fetchImpl: okTs })).toBe(false)
  })
})

describe('heurísticas de bot / UA', () => {
  it.each([
    ['UA vacío', { 'user-agent': '' }],
    ['curl', { 'user-agent': 'curl/8.4.0' }],
    ['python', { 'user-agent': 'python-requests/2.32' }],
    ['navegador headless', { 'user-agent': 'Mozilla/5.0 HeadlessChrome/141.0' }],
    ['sin Accept-Language', { 'accept-language': '' }],
  ])('%s → responde (stub, gratis) pero NUNCA live', async (_, headers) => {
    const f = counting()
    const r = await handleChat(req(ask(Qn(), { turnstile: 't' }), { headers }), live, null, { fetchImpl: f, verifyFetch: okTs })
    expect(r.status).toBe(200)
    const { meta } = await readSSE(r)
    expect(f.calls).toBe(0)
    expect(meta.fallback).toBe('suspicious')
  })
  it('un navegador normal no es sospechoso', () => {
    expect(suspicion({ ua: BROWSER['user-agent'], acceptLanguage: 'es' })).toEqual([])
  })
})

describe('dedupe y caché (no gastar dos veces en lo mismo)', () => {
  it('dedupe: la misma pregunta de la misma sesión en 10 min no vuelve a llamar al modelo', async () => {
    const s = sid(), ip = ipOf(), q = Qn()
    const f = async () => { f.calls++; return new Response('boom', { status: 500 }) } // sin respuesta que cachear
    f.calls = 0
    await readSSE(await handleChat(req(ask(q, { session: s, turnstile: 't' }), { ip }), live, null, { fetchImpl: f, verifyFetch: okTs }))
    const b = await readSSE(await handleChat(req(ask(`  ${q.toUpperCase()}!! `, { session: s }), { ip }), live, null, { fetchImpl: f, verifyFetch: okTs }))
    expect(f.calls).toBe(1)
    expect(b.meta.fallback).toBe('dup')
  })
  it('caché: la pregunta idéntica de OTRA persona se sirve de la caché, sin llamar al modelo', async () => {
    const q = Qn(), f = counting('Te ayudaría con el inventario y WhatsApp.')
    const a = await readSSE(await handleChat(req(ask(q, { turnstile: 't' })), live, null, { fetchImpl: f, verifyFetch: okTs }))
    const b = await readSSE(await handleChat(req(ask(q, { turnstile: 't' })), live, null, { fetchImpl: f, verifyFetch: okTs }))
    expect(f.calls).toBe(1)
    expect(a.meta.kind).toBe('live')
    expect(b.meta.kind).toBe('cache')
    expect(b.text).toBe(a.text)
  })
  it('caché: lo que lleva datos personales nunca se cachea', async () => {
    const q = `mi correo es ana${uniq()}@example.com, ¿me ayudas con mi tienda?`
    const f = counting()
    await readSSE(await handleChat(req(ask(q, { turnstile: 't' })), live, null, { fetchImpl: f, verifyFetch: okTs }))
    await readSSE(await handleChat(req(ask(q, { turnstile: 't' })), live, null, { fetchImpl: f, verifyFetch: okTs }))
    expect(f.calls).toBe(2)
    expect(hasPII(q)).toBe(true)
    expect(normQ('¡Hola,  QUÉ tal!')).toBe('hola que tal')
  })
})

describe('logs: solo contadores, sin datos personales', () => {
  it('ni IP, ni texto, ni correo, ni sesión llegan al log', async () => {
    const lines = []
    const log = (l) => lines.push(l)
    const ip = '203.0.113.77', s = sid()
    const text = 'soy ana@example.com y quiero saber el precio'
    await readSSE(await handleChat(req(ask(text, { session: s }), { ip }), fast, null, { log }))
    expect(lines.length).toBeGreaterThan(0)
    const all = lines.join('\n')
    for (const bad of [ip, 'ana@example.com', 'precio', s, (await ipKey(ip)).slice(3)]) expect(all).not.toContain(bad)
    for (const l of lines) expect(Object.keys(JSON.parse(l)).every((k) => ['t', 'ev', 'channel', 'path', 'reason', 'limit', 'mode', 'lang'].includes(k))).toBe(true)
  })
  it('counter descarta cualquier campo o valor fuera de la lista cerrada', () => {
    const out = counter('x', { path: 'stub', ip: '1.2.3.4', reason: 'tiene espacios y @', text: 'hola' }, () => {})
    expect(out).toEqual({ t: 'chat', ev: 'x', path: 'stub' })
  })
})

describe('backend agnóstico de canal', () => {
  it('un canal FALSO (tipo WhatsApp, sin streaming) se enchufa sin tocar respond.js', async () => {
    const delivered = []
    const fake = {
      name: 'fake',
      who: async (m) => ({ userKey: await ipKey(`fake:${m.from}`) }),
      parse: async (m, _env, who) => ({ msg: { channel: 'fake', sessionId: null, userKey: who.userKey, lang: 'es', userText: m.text, turns: 1, history: [{ role: 'user', content: m.text }], signals: { suspicious: [] } } }),
      open: () => {
        let buf = ''
        let done
        const finished = new Promise((r) => { done = r })
        return {
          delay: 0,
          send: async (ev, d) => { if (ev === 'delta') buf += d.t; if (ev === 'done') { delivered.push(buf); done() } },
          close: async () => {},
          response: finished,
        }
      },
      reject: (e) => ({ rejected: e.error }),
    }
    await runChannel(fake, { from: '+34600000000', text: '¿Cuánto cuesta?' }, fast, null, { log: () => {} })
    expect(delivered).toHaveLength(1)
    expect(delivered[0]).toContain('Arranque es gratis')
    expect(await runChannel(fake, { from: 'x', text: 'hola' }, { ...fast, CHAT_MODE: 'off' }, null)).toEqual({ rejected: 'disabled' })
  })
})

describe('CSP y Turnstile', () => {
  it('sin Turnstile configurado la CSP no abre ningún origen de terceros; con él, solo challenges.cloudflare.com', async () => {
    const { cspFor } = await import('../../worker/lib/http.js')
    expect(cspFor()).not.toContain('challenges.cloudflare.com')
    const on = cspFor({ turnstile: true })
    expect(on).toMatch(/script-src 'self' 'unsafe-inline' https:\/\/challenges\.cloudflare\.com/)
    expect(on).toMatch(/frame-src https:\/\/challenges\.cloudflare\.com/)
    expect(on.match(/https?:\/\/[^\s;']+/g)).toEqual(['https://challenges.cloudflare.com', 'https://challenges.cloudflare.com'])
  })
  it('la configuración desplegable no trae Turnstile: la portada sale con la CSP cerrada', async () => {
    expect(env.TURNSTILE_SITE_KEY).toBeUndefined()
    expect(env.TURNSTILE_SECRET_KEY).toBeUndefined()
  })
})
