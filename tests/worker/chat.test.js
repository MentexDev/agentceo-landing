// /api/chat en el runtime real de Workers: flag, validación, anti-abuso, stub y live (con fetch FALSO).
import { env, runInDurableObject } from 'cloudflare:test'
import { exports } from 'cloudflare:workers'
import { describe, it, expect } from 'vitest'
import { handleChat, parseChat, LIMITS } from '../../worker/chat/handler.js'
import { costUSD, systemPrompt, PRICE } from '../../worker/chat/live.js'
import { KB } from '../../worker/chat/stub.js'

let ipN = 0
const ip = () => `198.18.${Math.floor(++ipN / 250)}.${ipN % 250}`
const req = (body, headers = {}) =>
  new Request('https://agentceo.io/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip(), ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
const ask = (text, extra = {}) => ({ locale: 'es', messages: [{ role: 'user', content: text }], ...extra })

/** Lee el stream SSE completo → { meta, text, events }. */
async function readSSE(res) {
  const raw = await res.text()
  const events = raw.trim().split('\n\n').map((b) => {
    const ev = /event: (\w+)/.exec(b)?.[1]
    const data = JSON.parse(/data: (.*)/.exec(b)?.[1] || '{}')
    return { ev, data }
  })
  return { meta: events.find((e) => e.ev === 'meta')?.data, text: events.filter((e) => e.ev === 'delta').map((e) => e.data.t).join(''), events }
}
const fast = { ...env, CHAT_STUB_DELAY_MS: '0' }

describe('flag CHAT_MODE', () => {
  it('off → 404', async () => {
    const r = await handleChat(req(ask('hola')), { ...fast, CHAT_MODE: 'off' })
    expect(r.status).toBe(404)
  })
  it('la configuración desplegable es «stub» (decisión de Diego), no live', () => {
    expect(env.CHAT_MODE).toBe('stub')
    expect(env.OPENROUTER_API_KEY).toBeUndefined()
  })
})

describe('stub', () => {
  it('responde con el texto del sitio, su procedencia y un CTA a la lista en el precio', async () => {
    const r = await exports.default.fetch(req(ask('¿Cuánto cuesta?')))
    expect(r.headers.get('content-type')).toContain('text/event-stream')
    const { meta, text, events } = await readSSE(r)
    expect(meta.mode).toBe('stub')
    expect(meta.matched.title).toBe('¿Cuánto cuesta?')
    expect(meta.cta).toBe('waitlist')
    expect(text).toContain('plan gratis')
    expect(events.at(-1).ev).toBe('done')
  })

  it('dice que es una IA cuando se le pregunta (SB 1001)', async () => {
    const { text, meta } = await readSSE(await handleChat(req(ask('¿eres humano?')), fast))
    expect(meta.kind).toBe('intent:human')
    expect(text).toMatch(/inteligencia artificial/)
    expect(text).toMatch(/no una persona/)
  })

  it('en inglés también', async () => {
    const { text } = await readSSE(await handleChat(req({ ...ask('are you a real person?'), locale: 'en' }), fast))
    expect(text).toMatch(/artificial intelligence/)
  })

  it('lo que no está en la web → lo dice, no inventa, y ofrece la lista', async () => {
    const { meta, text } = await readSSE(await handleChat(req(ask('¿cuál es la capital de Francia?')), fast))
    expect(meta.kind).toBe('fallback')
    expect(meta.cta).toBe('waitlist')
    expect(text).toMatch(/no lo encuentro|prefiero no inventarme/i)
  })

  it('un clic en una pregunta sugerida (título exacto del FAQ) siempre acierta', async () => {
    for (const c of KB.es.filter((x) => x.kind === 'faq' && x.id.startsWith('faq:'))) {
      const { meta } = await readSSE(await handleChat(req(ask(c.title)), fast))
      expect(meta.matched?.title, c.title).toBe(c.title)
    }
  })
})

describe('validación y anti-abuso', () => {
  it.each([[{}], [{ messages: 'x' }], [{ messages: [] }], [{ messages: [{ role: 'assistant', content: 'hola' }] }], ['{roto']])('cuerpo inválido %j → 400', async (b) => {
    const r = await handleChat(req(b), fast)
    expect(r.status).toBe(400)
  })

  it('mensaje de más de 500 caracteres → 400 too_long', async () => {
    const r = await handleChat(req(ask('a'.repeat(LIMITS.maxChars + 1))), fast)
    expect(r.status).toBe(400)
    expect((await r.json()).error).toBe('too_long')
  })

  it('desde otro origen → 403', async () => {
    const r = await handleChat(req(ask('hola'), { origin: 'https://evil.example' }), fast)
    expect(r.status).toBe(403)
  })

  it('más de 12 turnos → cierre amable con la lista (sin seguir respondiendo)', async () => {
    const messages = []
    for (let i = 0; i < 13; i++) messages.push({ role: 'user', content: `pregunta ${i}` }, { role: 'assistant', content: 'r' })
    messages.pop()
    const { meta } = await readSSE(await handleChat(req({ locale: 'es', messages }), fast))
    expect(meta.kind).toBe('cap')
    expect(meta.cta).toBe('waitlist')
  })

  it('rate limit: el 11.º mensaje en un minuto desde la misma IP → 429', async () => {
    const h = { 'cf-connecting-ip': '192.0.2.200' }
    const codes = []
    for (let i = 0; i < 11; i++) {
      const r = await exports.default.fetch(req(ask('hola'), h))
      codes.push(r.status)
      await r.text()
    }
    expect(codes.slice(0, 10).every((c) => c === 200)).toBe(true)
    expect(codes[10]).toBe(429)
  })

  it('tope diario por IP (60) sin guardar la IP en claro', async () => {
    const stub = env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName('ip:prueba'))
    for (let i = 0; i < 60; i++) expect((await stub.bump('day:2026-10-20', 1, 60)).allowed).toBe(true)
    expect((await stub.bump('day:2026-10-20', 1, 60)).allowed).toBe(false)
    await runInDurableObject(stub, (_, state) => {
      const rows = state.storage.sql.exec('SELECT k FROM c').toArray()
      expect(JSON.stringify(rows)).not.toMatch(/\d+\.\d+\.\d+\.\d+/)
    })
  })

  it('parseChat recorta el historial enviado al modelo', () => {
    const messages = []
    for (let i = 0; i < 20; i++) messages.push({ role: 'user', content: `u${i}` }, { role: 'assistant', content: `a${i}` })
    messages.push({ role: 'user', content: 'última' })
    const p = parseChat({ locale: 'es', messages })
    expect(p.history.length).toBe(LIMITS.maxHistory * 2)
    expect(p.history.at(-1).content).toBe('última')
  })
})

describe('live (con un fetch FALSO: nunca se llama a OpenRouter en tests)', () => {
  const sse = (chunks) => new Response(new ReadableStream({
    start(c) {
      const e = new TextEncoder()
      for (const ch of chunks) c.enqueue(e.encode(`data: ${JSON.stringify(ch)}\n\n`))
      c.enqueue(e.encode('data: [DONE]\n\n'))
      c.close()
    },
  }), { headers: { 'content-type': 'text/event-stream' } })
  const liveEnv = { ...fast, CHAT_MODE: 'live', OPENROUTER_API_KEY: 'sk-or-FALSA-de-test', CHAT_DAILY_BUDGET_USD: '5' }

  it('reenvía el streaming del modelo y anota el gasto del día', async () => {
    let sent
    const fakeFetch = async (url, init) => {
      sent = { url, body: JSON.parse(init.body), auth: init.headers.authorization }
      return sse([
        { choices: [{ delta: { content: 'Hola, ' } }] },
        { choices: [{ delta: { content: 'soy tu CEO.' } }] },
        { choices: [{ delta: {} }], usage: { prompt_tokens: 15000, completion_tokens: 260, prompt_tokens_details: { cached_tokens: 14000 } } },
      ])
    }
    const before = await env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName('budget')).get(`usd:${new Date().toISOString().slice(0, 10)}`)
    const { meta, text } = await readSSE(await handleChat(req(ask('cuéntame algo de la plataforma para mi panadería')), liveEnv, null, { fetchImpl: fakeFetch }))
    expect(meta.mode).toBe('live')
    expect(text).toBe('Hola, soy tu CEO.')
    expect(sent.url).toBe('https://openrouter.ai/api/v1/chat/completions')
    expect(sent.body.model).toBe('google/gemini-3.1-flash-lite')
    expect(sent.body.max_tokens).toBe(400)
    expect(sent.body.messages[0].content[0].cache_control).toEqual({ type: 'ephemeral' })
    const after = await env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName('budget')).get(`usd:${new Date().toISOString().slice(0, 10)}`)
    expect(after - before).toBeCloseTo(costUSD({ prompt_tokens: 15000, completion_tokens: 260, prompt_tokens_details: { cached_tokens: 14000 } }), 10)
  })

  it('sin presupuesto del día → cae a stub y NO llama al modelo', async () => {
    const day = new Date().toISOString().slice(0, 10)
    await env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName('budget')).bump(`usd:${day}`, 100)
    let called = false
    const { meta } = await readSSE(await handleChat(req(ask('¿Cuánto cuesta?')), liveEnv, null, { fetchImpl: async () => { called = true } }))
    expect(called).toBe(false)
    expect(meta.mode).toBe('stub')
  })

  it('el prefijo del prompt es estable (misma entrada → mismos bytes, para la caché)', () => {
    expect(systemPrompt('es', KB.es)).toBe(systemPrompt('es', KB.es))
    expect(systemPrompt('es', KB.es)).toMatch(/Nunca inventas precios/)
  })

  it('coste: 15k entrada (14k en caché) + 260 salida = lo calculado en el PLAN', () => {
    const c = costUSD({ prompt_tokens: 15000, completion_tokens: 260, prompt_tokens_details: { cached_tokens: 14000 } })
    expect(c).toBeCloseTo((1000 * PRICE.in + 14000 * PRICE.cacheRead + 260 * PRICE.out) / 1e6, 12)
  })
})
