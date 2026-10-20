// /api/chat en el runtime real de Workers: flag, validación, anti-abuso, stub y live (con fetch FALSO).
import { env, runInDurableObject } from 'cloudflare:test'
import { exports } from 'cloudflare:workers'
import { describe, it, expect } from 'vitest'
import { handleChat, parseChat, LIMITS } from '../../worker/chat/handler.js'
import { costUSD, settledUSD, systemPrompt, pickContext, estimateUSD, priceFor, historyForModel, OPENROUTER_URL, PRICES, DEFAULT_MODEL, HISTORY_CHARS, CANARY } from '../../worker/chat/live.js'
import { KB, INDEX } from '../../worker/chat/stub.js'

// El rate limit nativo cuenta por ventanas de 60 s: si el test cae en el cambio de minuto el
// contador se reinicia a mitad (fallo intermitente medido). Se espera a una ventana limpia.
const freshWindow = async () => {
  const s = new Date().getSeconds()
  if (s > 48) await new Promise((r) => setTimeout(r, (61 - s) * 1000))
}

let ipN = 0
const ip = () => `198.18.${Math.floor(++ipN / 250)}.${ipN % 250}`
// Cabeceras de un navegador real (sin ellas, el tráfico cuenta como automático: nunca live).
export const BROWSER = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', 'accept-language': 'es-ES,es;q=0.9' }
const req = (body, headers = {}) =>
  new Request('https://agentceo.io/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip(), ...BROWSER, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
const ask = (text, extra = {}) => ({ locale: 'es', turnstile: 'token-de-prueba', messages: [{ role: 'user', content: text }], ...extra })

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
  it('la configuración desplegable es LIVE con OpenRouter (T33) y en local no hay clave', () => {
    expect(env.CHAT_MODE).toBe('live')
    expect(env.OPENROUTER_API_KEY).toBeUndefined()
    expect(env.GEMINI_API_KEY).toBeUndefined()
    expect(env.CHAT_MODEL).toBe('google/gemini-2.5-flash-lite')
    expect(priceFor(env.CHAT_MODEL)).toEqual({ in: 0.1, out: 0.4, cacheRead: 0.01 })
  })
  it('sin clave, la configuración desplegable responde el stub (no llama a nadie)', async () => {
    let called = false
    const { meta } = await readSSE(await handleChat(req(ask('cuéntame algo de mi panadería sin clave')), fast, null, { fetchImpl: async () => { called = true } }))
    expect(called).toBe(false)
    expect(meta.mode).toBe('stub')
  })
})

describe('stub', () => {
  it('responde con el texto del sitio, su procedencia y un CTA a la lista en el precio', async () => {
    const r = await exports.default.fetch(req(ask('¿Cuánto cuesta?')))
    expect(r.headers.get('content-type')).toContain('text/event-stream')
    const { meta, text, events } = await readSSE(r)
    // T35: las preguntas comunes las responde la capa CURADA (coste 0), no el stub BM25.
    expect(meta.mode).toBe('curated')
    expect(meta.matched.title).toBe('¿Cuánto cuesta?')
    expect(meta.cta).toBe('waitlist')
    expect(text).toContain('Arranque es gratis')
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

  it('rate limit: el 11.º mensaje en un minuto desde la misma IP → 429', { timeout: 20_000 }, async () => {
    await freshWindow()
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

const okTs = async () => Response.json({ success: true })

describe('live con OpenRouter (fetch FALSO: nunca se llama a OpenRouter en tests)', () => {
  const day = () => new Date().toISOString().slice(0, 10)
  const budget = () => env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName('budget'))
  /** Respuesta SSE con el formato de OpenRouter (chat/completions, stream: true). */
  const orStream = (chunks, { delayMs = 0, done = true } = {}) => new Response(new ReadableStream({
    async start(c) {
      const e = new TextEncoder()
      c.enqueue(e.encode(': OPENROUTER PROCESSING\n\n'))
      for (const ch of chunks) {
        if (delayMs) await new Promise((r) => setTimeout(r, delayMs))
        c.enqueue(e.encode(`data: ${JSON.stringify(ch)}\n\n`))
      }
      if (done) c.enqueue(e.encode('data: [DONE]\n\n'))
      c.close()
    },
  }), { headers: { 'content-type': 'text/event-stream' } })
  const part = (t) => ({ choices: [{ index: 0, delta: { role: 'assistant', content: t } }] })
  const usage = (u) => ({ choices: [{ index: 0, delta: {}, finish_reason: 'stop' }], usage: u })
  const USAGE = { prompt_tokens: 3000, completion_tokens: 120, total_tokens: 3120 }
  // Claves de PRUEBA públicas de Turnstile (documentadas por Cloudflare: siempre pasan) y un
  // siteverify FALSO: nunca hay red en los tests.
  const liveEnv = { ...fast, CHAT_MODE: 'live', OPENROUTER_API_KEY: 'clave-FALSA-de-test', CHAT_DAILY_BUDGET_USD: '5', TURNSTILE_SITE_KEY: '1x00000000000000000000AA', TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' }
  const P = PRICES[DEFAULT_MODEL]
  // Pregunta DISTINTA en cada llamada: las respuestas live limpias se cachean (adenda T32) y una
  // pregunta repetida no volvería a llamar al modelo.
  let qn = 0
  const q = () => `cuéntame cómo me ayudaría con mi panadería número ${++qn}`

  it('sin clave → stub (y no llama a nadie), aunque CHAT_MODE sea live', async () => {
    let called = false
    const { meta } = await readSSE(await handleChat(req(ask(q())), { ...liveEnv, OPENROUTER_API_KEY: undefined }, null, { verifyFetch: okTs, fetchImpl: async () => { called = true } }))
    expect(called).toBe(false)
    expect(meta.mode).toBe('stub')
  })

  it('con clave → reenvía el streaming de OpenRouter y anota el coste REAL del día', async () => {
    let sent
    const fakeFetch = async (url, init) => {
      sent = { url, init, body: JSON.parse(init.body) }
      return orStream([part('Hola, '), part('soy tu CEO.'), usage(USAGE)])
    }
    const before = await budget().get(`usd:${day()}`)
    const { meta, text, events } = await readSSE(await handleChat(req(ask(q())), liveEnv, null, { verifyFetch: okTs, fetchImpl: fakeFetch }))
    expect(meta.mode).toBe('live')
    expect(text).toBe('Hola, soy tu CEO.')
    expect(events.at(-1).ev).toBe('done')
    expect(sent.url).toBe(OPENROUTER_URL)
    expect(sent.url).not.toContain('clave-FALSA') // la clave va en cabecera, nunca en la URL
    expect(sent.init.headers.authorization).toBe('Bearer clave-FALSA-de-test')
    expect(sent.body.model).toBe('google/gemini-2.5-flash-lite')
    expect(sent.body.stream).toBe(true)
    expect(sent.body.max_tokens).toBe(400)
    expect(sent.body.usage).toEqual({ include: true })
    expect(sent.body.messages[0].role).toBe('system')
    expect(sent.body.messages[0].content).toMatch(/eres una IA, no una persona/)
    expect(sent.body.messages.at(-1)).toEqual({ role: 'user', content: `cuéntame cómo me ayudaría con mi panadería número ${qn}` })
    const after = await budget().get(`usd:${day()}`)
    expect(after - before).toBeCloseTo(costUSD(USAGE, DEFAULT_MODEL), 10) // la reserva se ajustó al coste real
  })

  it.each([
    ['un modelo SIN precio conocido', 'openai/gpt-5'],
    ['una variante :batch', 'google/gemini-2.5-flash-lite:batch'],
    ['un modelo vacío', ' '],
  ])('%s → stub, sin llamar ni reservar', async (_, model) => {
    let called = false
    const before = await budget().get(`usd:${day()}`)
    const { meta } = await readSSE(await handleChat(req(ask(q())), { ...liveEnv, CHAT_MODEL: model }, null, { verifyFetch: okTs, fetchImpl: async () => { called = true } }))
    expect(called).toBe(false)
    expect(meta.mode).toBe('stub')
    expect(meta.fallback).toBe('model_price')
    expect(await budget().get(`usd:${day()}`)).toBe(before)
  })

  it('el coste va POR MODELO (mismos tokens, precios distintos)', async () => {
    const u = { prompt_tokens: 10000, completion_tokens: 400 }
    expect(costUSD(u, 'google/gemini-2.5-flash-lite')).toBeCloseTo((10000 * 0.1 + 400 * 0.4) / 1e6, 12)
    expect(costUSD(u, 'google/gemini-3.1-flash-lite')).toBeCloseTo((10000 * 0.25 + 400 * 1.5) / 1e6, 12)
    expect(costUSD(u, 'google/gemini-3.5-flash-lite')).toBeCloseTo((10000 * 0.3 + 400 * 2.5) / 1e6, 12)
    // Con gemini-3.1 configurado, el streaming factura a SU precio.
    const fakeFetch = async () => orStream([part('ok 3.1'), usage(USAGE)])
    const before = await budget().get(`usd:${day()}`)
    await readSSE(await handleChat(req(ask(q())), { ...liveEnv, CHAT_MODEL: 'google/gemini-3.1-flash-lite' }, null, { verifyFetch: okTs, fetchImpl: fakeFetch }))
    expect((await budget().get(`usd:${day()}`)) - before).toBeCloseTo(costUSD(USAGE, 'google/gemini-3.1-flash-lite'), 10)
  })

  it('si OpenRouter informa un coste MAYOR que el calculado, se asienta el suyo', async () => {
    const reported = { ...USAGE, cost: 0.01 }
    expect(settledUSD(reported, DEFAULT_MODEL)).toBe(0.01)
    expect(settledUSD({ ...USAGE, cost: 0 }, DEFAULT_MODEL)).toBeCloseTo(costUSD(USAGE, DEFAULT_MODEL), 12)
    const before = await budget().get(`usd:${day()}`)
    await readSSE(await handleChat(req(ask(q())), liveEnv, null, { verifyFetch: okTs, fetchImpl: async () => orStream([part('ok'), usage(reported)]) }))
    expect((await budget().get(`usd:${day()}`)) - before).toBeCloseTo(0.01, 10)
  })

  it('el contexto son los fragmentos RELEVANTES (BM25), no la base entera', () => {
    const ctx = pickContext(INDEX.es, KB.es, '¿funciona con whatsapp?')
    expect(ctx.length).toBeLessThan(KB.es.length / 3)
    expect(ctx.map((c) => c.id)).toEqual(expect.arrayContaining(['entity', 'pricing', 'guia:lista', 'guia:asistente', 'faq:whatsapp']))
    const sys = systemPrompt('es', ctx)
    expect(sys).toMatch(/Nunca inventas precios/)
    expect(sys).toContain(CANARY)
  })

  it('tope del día superado → stub, sin llamar al modelo', async () => {
    await budget().bump(`usd:${day()}`, 100)
    let called = false
    const { meta } = await readSSE(await handleChat(req(ask(q())), liveEnv, null, { verifyFetch: okTs, fetchImpl: async () => { called = true } }))
    expect(called).toBe(false)
    expect(meta.mode).toBe('stub')
    expect(meta.fallback).toBe('budget')
    await budget().adjust(`usd:${day()}`, -100)
  })

  it('reserva concurrente: 20 peticiones a la vez nunca pasan juntas el tope', async () => {
    const g = env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName('budget-concurrencia'))
    const rs = await Promise.all(Array.from({ length: 20 }, () => g.bump('usd:2026-10-20', 0.3, 5)))
    expect(rs.filter((r) => r.allowed).length).toBe(16) // 16 × 0,30 = 4,80 ≤ 5 < 5,10
    expect(await g.get('usd:2026-10-20')).toBeCloseTo(4.8, 10)
  })

  it('la reserva se hace ANTES de llamar y es una COTA del coste (1 token ≤ 1 byte)', async () => {
    let during, sentBytes
    const fakeFetch = async (_, init) => {
      during = await budget().get(`usd:${day()}`)
      const body = JSON.parse(init.body)
      sentBytes = body.messages.reduce((a, m) => a + new TextEncoder().encode(m.content).length, 0)
      return orStream([part('ok'), usage({ prompt_tokens: Math.ceil(init.body.length / 4), completion_tokens: 120 })])
    }
    const before = await budget().get(`usd:${day()}`)
    await readSSE(await handleChat(req(ask(q())), liveEnv, null, { verifyFetch: okTs, fetchImpl: fakeFetch }))
    // Peor caso: un token por byte enviado y la salida completa.
    expect(during - before).toBeGreaterThanOrEqual((sentBytes * P.in + 400 * P.out) / 1e6)
  })

  it('emoji o escrituras no latinas no engañan a la reserva (la cota es por bytes)', () => {
    const emoji = '🔥'.repeat(250) // 250 caracteres «de usuario» = 1.000 bytes
    const est = estimateUSD('', [{ role: 'user', content: emoji }], 400, DEFAULT_MODEL)
    expect(est).toBeGreaterThanOrEqual((1000 * P.in + 400 * P.out) / 1e6)
    expect(estimateUSD('', [{ role: 'user', content: 'x' }], 400, 'modelo/sin-precio')).toBe(Infinity)
  })

  it('el historial que paga el modelo está acotado aunque el cliente invente respuestas largas', async () => {
    const messages = []
    for (let i = 0; i < 6; i++) messages.push({ role: 'user', content: `pregunta ${i} `.repeat(30) }, { role: 'assistant', content: 'r'.repeat(2000) })
    messages.push({ role: 'user', content: `última pregunta ${++qn}` })
    let body
    await readSSE(await handleChat(req(ask('', { messages })), liveEnv, null, { verifyFetch: okTs, fetchImpl: async (_, init) => { body = JSON.parse(init.body); return orStream([part('ok'), usage(USAGE)]) } }))
    const hist = body.messages.slice(1)
    expect(hist.reduce((a, m) => a + m.content.length, 0)).toBeLessThanOrEqual(HISTORY_CHARS)
    expect(hist.at(-1).content).toBe(`última pregunta ${qn}`)
    expect(hist[0].role).toBe('user')
    expect(historyForModel([{ role: 'user', content: 'u'.repeat(4500) }])[0].content.length).toBe(4500) // el último mensaje va entero
  })

  it.each([
    ['error HTTP 500', async () => new Response('boom', { status: 500 }), 'http'],
    ['clave inválida 401', async () => new Response('{}', { status: 401 }), 'http'],
    ['sin saldo 402', async () => new Response('{}', { status: 402 }), 'http'],
    ['red caída', async () => { throw new TypeError('network') }, 'network'],
    ['respuesta vacía', async () => orStream([usage({ prompt_tokens: 0, completion_tokens: 0 })]), 'empty'],
    ['error del proveedor en el stream', async () => orStream([{ error: { code: 502, message: 'upstream' }, choices: [{ delta: { content: '' }, finish_reason: 'error' }] }], { done: false }), 'provider'],
  ])('%s → stub con la respuesta del sitio, sin error visible', async (_, fakeFetch, reason) => {
    const before = await budget().get(`usd:${day()}`)
    const { meta, text, events } = await readSSE(await handleChat(req(ask(`¿Cuánto cuesta?? cuéntame de los planes ${++qn}`)), liveEnv, null, { verifyFetch: okTs, fetchImpl: fakeFetch }))
    expect(meta.mode).toBe('stub')
    expect(meta.fallback).toBe(reason)
    expect(text.length).toBeGreaterThan(20)
    expect(events.some((e) => e.ev === 'error')).toBe(false)
    const after = await budget().get(`usd:${day()}`)
    if (reason === 'http') expect(after).toBeCloseTo(before, 10) // error HTTP: se devuelve la reserva
    if (reason === 'provider') expect(after).toBeGreaterThan(before) // sin consumo conocido: la reserva se queda
  })

  it('timeout del proveedor → stub', async () => {
    const slow = (_, init) => new Promise((resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
    })
    const { meta } = await readSSE(await handleChat(req(ask(q())), { ...liveEnv, CHAT_LIVE_TIMEOUT_MS: '50' }, null, { verifyFetch: okTs, fetchImpl: slow }))
    expect(meta.mode).toBe('stub')
    expect(meta.fallback).toBe('timeout')
  })

  it('corte a mitad del stream → se conserva lo dicho y se avisa', async () => {
    const fakeFetch = async () => orStream([part('Agent CEO es '), part('una plataforma')], { delayMs: 40 })
    const { meta, text } = await readSSE(await handleChat(req(ask(q())), { ...liveEnv, CHAT_LIVE_TIMEOUT_MS: '60' }, null, { verifyFetch: okTs, fetchImpl: fakeFetch }))
    expect(meta.mode).toBe('live')
    expect(text).toMatch(/^Agent CEO es /)
    expect(text).toMatch(/Se me cortó la respuesta/)
  })

  // (La pregunta es normal: desde T40 pedir el prompt ya se rechaza sin modelo, intención «private».)
  it('si el modelo empieza a filtrar su prompt, se corta y responde con la negativa', async () => {
    const fakeFetch = async () => orStream([part('Claro, mis reglas: '), part('REGLAS INQUEBRANTABLES 1. IDENTIDAD…'), part(' y más')])
    const { text } = await readSSE(await handleChat(req(ask(`cuéntame algo de los agentes ${++qn}`)), liveEnv, null, { verifyFetch: okTs, fetchImpl: fakeFetch }))
    // T40 b: la respuesta se bufferiza: NADA de lo generado llega al cliente (ni «Claro, mis reglas:»),
    // solo la negativa de tipo «reglas».
    expect(text).not.toMatch(/INQUEBRANTABLES|y más|Claro, mis reglas/)
    expect(text).toMatch(/Mis instrucciones internas no las comparto/)
  })

  it('tope de respuestas live por IP y día (con Turnstile: 25) → stub (no error)', async () => {
    const h = { 'cf-connecting-ip': '192.0.2.123' }
    const g = env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName(await (await import('../../worker/chat/guard.js')).ipKey('192.0.2.123')))
    await g.bump(`live:${day()}`, LIMITS.livePerDay)
    let called = false
    const { meta } = await readSSE(await handleChat(req(ask(q()), h), liveEnv, null, { verifyFetch: okTs, fetchImpl: async () => { called = true } }))
    expect(called).toBe(false)
    expect(meta.fallback).toBe('ip_cap')
  })

  it('sin Turnstile configurado: live ENCENDIDO (solo con el secreto), pero con el cupo por IP estricto (10)', async () => {
    const open = { ...liveEnv, TURNSTILE_SITE_KEY: undefined, TURNSTILE_SECRET_KEY: undefined }
    const h = { 'cf-connecting-ip': '192.0.2.124' }
    const fakeFetch = async () => orStream([part('Encendido.'), usage(USAGE)])
    const first = await readSSE(await handleChat(req(ask(q()), h), open, null, { fetchImpl: fakeFetch }))
    expect(first.meta.mode).toBe('live')
    const g = env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName(await (await import('../../worker/chat/guard.js')).ipKey('192.0.2.124')))
    expect(LIMITS.livePerDayOpen).toBe(10)
    await g.bump(`live:${day()}`, LIMITS.livePerDayOpen - 1) // ya gastó 1: llega a 10
    let called = false
    const { meta } = await readSSE(await handleChat(req(ask(q()), h), open, null, { fetchImpl: async () => { called = true } }))
    expect(called).toBe(false)
    expect(meta.fallback).toBe('ip_cap')
  })

  it('las intenciones claras y los clics del FAQ no gastan (stub exacto)', async () => {
    let called = false
    const { meta } = await readSSE(await handleChat(req(ask('¿eres humano?')), liveEnv, null, { verifyFetch: okTs, fetchImpl: async () => { called = true } }))
    expect(called).toBe(false)
    expect(meta.kind).toBe('intent:human')
  })

  it('coste: tokens de entrada, caché leída y salida (incluye razonamiento)', () => {
    const c = costUSD({ prompt_tokens: 15000, prompt_tokens_details: { cached_tokens: 14000 }, completion_tokens: 260, completion_tokens_details: { reasoning_tokens: 60 } }, DEFAULT_MODEL)
    expect(c).toBeCloseTo((1000 * P.in + 14000 * P.cacheRead + 260 * P.out) / 1e6, 12)
  })
})
