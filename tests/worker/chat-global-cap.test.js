// Tope GLOBAL diario de respuestas live del chat (T58b): CHAT_DAILY_GLOBAL_CAP sobre el DO ChatGuard.
// OpenRouter y siteverify SIEMPRE falsos (fetch inyectado): ningún test sale a la red ni gasta.
import { env } from 'cloudflare:test'
import { describe, it, expect } from 'vitest'
import { handleChat } from '../../worker/chat/handler.js'
import { respond, globalLiveCap } from '../../worker/chat/respond.js'
import { say } from '../../worker/chat/persona.js'
import { LIMITS } from '../../worker/chat/limits.js'

const BROWSER = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', 'accept-language': 'es-ES,es;q=0.9' }
let ipN = 0
const req = (body) => new Request('https://agentceo.io/api/chat', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'cf-connecting-ip': `198.51.100.${++ipN % 250}`, ...BROWSER },
  body: JSON.stringify(body),
})
let qn = 0
const ask = (locale = 'es') => ({ locale, turnstile: 'token-de-prueba', messages: [{ role: 'user', content: locale === 'es' ? `cuéntame cómo me ayudaría con mi taller de motos número ${++qn}` : `tell me how you would help my bike repair shop number ${++qn}` }] })
async function readSSE(res) {
  const raw = await res.text()
  const events = raw.trim().split('\n\n').map((b) => ({ ev: /event: (\w+)/.exec(b)?.[1], data: JSON.parse(/data: (.*)/.exec(b)?.[1] || '{}') }))
  return { meta: events.find((e) => e.ev === 'meta')?.data, text: events.filter((e) => e.ev === 'delta').map((e) => e.data.t).join('') }
}
const orStream = (text) => new Response(new ReadableStream({
  start(c) {
    const e = new TextEncoder()
    c.enqueue(e.encode(`data: ${JSON.stringify({ choices: [{ index: 0, delta: { role: 'assistant', content: text } }] })}\n\n`))
    c.enqueue(e.encode(`data: ${JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 3000, completion_tokens: 50, total_tokens: 3050 } })}\n\n`))
    c.enqueue(e.encode('data: [DONE]\n\n'))
    c.close()
  },
}), { headers: { 'content-type': 'text/event-stream' } })
const okTs = async () => Response.json({ success: true })
const day = () => new Date().toISOString().slice(0, 10)
const budget = () => env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName('budget'))
const liveEnv = { ...env, CHAT_STUB_DELAY_MS: '0', CHAT_MODE: 'live', OPENROUTER_API_KEY: 'clave-FALSA-de-test', CHAT_DAILY_BUDGET_USD: '5', TURNSTILE_SITE_KEY: '1x00000000000000000000AA', TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' }

describe('CHAT_DAILY_GLOBAL_CAP', () => {
  it.each([
    [undefined, 2000], ['', 2000], ['  ', 2000], ['abc', 2000], ['-1', 2000], ['2000', 2000], ['50', 50], ['0', 0], ['7.9', 7],
  ])('%s → %s (un valor raro nunca deja el tope abierto)', (v, cap) => {
    expect(globalLiveCap({ CHAT_DAILY_GLOBAL_CAP: v })).toBe(cap)
  })
  it('wrangler.jsonc lo trae explícito: 2000/día', () => {
    expect(env.CHAT_DAILY_GLOBAL_CAP).toBe('2000')
    expect(globalLiveCap(env)).toBe(LIMITS.liveGlobalPerDay)
  })
})

describe('respond(): el tope global, antes de gastar', () => {
  const run = async (guards, lang = 'es') => {
    const ev = []
    let called = 0
    const r = await respond({
      p: { lang, userText: lang === 'es' ? 'cuéntame cómo me ayudaría con mi floristería' : 'tell me how you would help my flower shop', turns: 1, history: [{ role: 'user', content: 'x' }], signals: { suspicious: [] } },
      mode: 'live', env: { OPENROUTER_API_KEY: 'k', CHAT_DAILY_BUDGET_USD: '5' }, delay: 0, capTurns: 12,
      guards: { liveIp: async () => true, human: async () => ({ ok: true }), reserve: async () => ({ allowed: true }), ...guards },
      send: async (e, d) => ev.push({ e, d }),
      fetchImpl: async () => { called++; return orStream('Respuesta del modelo.') },
    })
    return { r, called, meta: ev.find((x) => x.e === 'meta')?.d, text: ev.filter((x) => x.e === 'delta').map((x) => x.d.t).join('') }
  }
  it.each(['es', 'en'])('%s · tope alcanzado → mensaje FIJO con info@agentceo.io, sin llamar al modelo', async (lang) => {
    const { r, called, meta, text } = await run({ liveGlobal: async () => false }, lang)
    expect(called).toBe(0)
    expect(r).toEqual({ path: 'stub', reason: 'global_cap' })
    expect(meta).toMatchObject({ mode: 'stub', kind: 'global_cap', fallback: 'global_cap' })
    expect(text).toBe(say(lang, 'globalCap'))
    expect(text).toContain('[info@agentceo.io](mailto:info@agentceo.io)')
  })
  it('sin el guarda (un canal que no lo pase) → opción segura: no gasta', async () => {
    const { called, r } = await run({ liveGlobal: undefined })
    expect(called).toBe(0)
    expect(r.reason).toBe('global_cap')
  })
  it('recibe el tope configurado y, con cupo, sigue al modelo', async () => {
    let got
    const { called, r } = await run({ liveGlobal: async (cap) => { got = cap; return true } })
    expect(got).toBe(2000)
    expect(called).toBe(1)
    expect(r.path).toBe('live')
  })
  it('si luego falla la reserva de gasto (o el proveedor da error HTTP), la unidad se devuelve', async () => {
    let refunds = 0
    await run({ liveGlobal: async () => true, liveGlobalRefund: async () => { refunds++ }, reserve: async () => ({ allowed: false }) })
    expect(refunds).toBe(1)
  })
})

describe('extremo a extremo por /api/chat con el DO real', () => {
  it('con CHAT_DAILY_GLOBAL_CAP = usadas + 2: dos respuestas live y la tercera, el mensaje fijo sin modelo', async () => {
    const used = await budget().get(`glive:${day()}`)
    const capEnv = { ...liveEnv, CHAT_DAILY_GLOBAL_CAP: String(used + 2) }
    let calls = 0
    const fetchImpl = async () => { calls++; return orStream('Te ayudo con eso.') }
    const a = await readSSE(await handleChat(req(ask()), capEnv, null, { verifyFetch: okTs, fetchImpl }))
    const b = await readSSE(await handleChat(req(ask('en')), capEnv, null, { verifyFetch: okTs, fetchImpl }))
    expect([a.meta.mode, b.meta.mode]).toEqual(['live', 'live'])
    const c = await readSSE(await handleChat(req(ask()), capEnv, null, { verifyFetch: okTs, fetchImpl }))
    expect(calls).toBe(2)
    expect(c.meta).toMatchObject({ kind: 'global_cap', fallback: 'global_cap' })
    expect(c.text).toBe(say('es', 'globalCap'))
    const d = await readSSE(await handleChat(req(ask('en')), capEnv, null, { verifyFetch: okTs, fetchImpl }))
    expect(d.text).toBe(say('en', 'globalCap'))
    expect(await budget().get(`glive:${day()}`)).toBe(used + 2)
  })
  it('las respuestas curadas siguen saliendo con el tope agotado (no gastan)', async () => {
    const r = await readSSE(await handleChat(req({ locale: 'es', messages: [{ role: 'user', content: '¿cuánto cuesta?' }] }), { ...liveEnv, CHAT_DAILY_GLOBAL_CAP: '0' }, null, { verifyFetch: okTs, fetchImpl: async () => { throw new Error('no debía llamar') } }))
    expect(r.meta.kind).not.toBe('global_cap')
    expect(r.text.length).toBeGreaterThan(20)
  })
  it('atómico: 30 peticiones a la vez contra un tope de 7 → exactamente 7 pasan', async () => {
    const g = env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName('budget-glive-concurrencia'))
    const rs = await Promise.all(Array.from({ length: 30 }, () => g.bump('glive:2026-10-22', 1, 7)))
    expect(rs.filter((r) => r.allowed)).toHaveLength(7)
    expect(await g.get('glive:2026-10-22')).toBe(7)
  })
  it('por día UTC: el primer conteo de un día nuevo borra el de ayer (y no toca el gasto en USD)', async () => {
    const g = env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName('budget-glive-dias'))
    await g.bump('usd:2026-10-21', 1.5, 5)
    await g.bump('glive:2026-10-21', 1, 10)
    await g.bump('glive:2026-10-22', 1, 10)
    expect(await g.get('glive:2026-10-21')).toBe(0)
    expect(await g.get('glive:2026-10-22')).toBe(1)
    expect(await g.get('usd:2026-10-21')).toBe(1.5)
  })
})
