// Herramientas del chat (T58b): deterministas (sin modelo) y expuestas al modelo vía function calling.
// OpenRouter SIEMPRE falso: ningún test sale a la red.
import { describe, it, expect } from 'vitest'
import { applyTools, TOOLS, TOOLS_TOKENS, SECTIONS } from '../../worker/chat/tools.js'
import { respond } from '../../worker/chat/respond.js'
import { stubReply } from '../../worker/chat/stub.js'
import { intentOf, say } from '../../worker/chat/persona.js'

/** Stream SSE de OpenRouter con texto y/o tool_calls troceados (como llegan de verdad). */
const orStream = ({ text = '', calls = [] }) => new Response(new ReadableStream({
  start(c) {
    const e = new TextEncoder(), send = (o) => c.enqueue(e.encode(`data: ${JSON.stringify(o)}\n\n`))
    if (text) send({ choices: [{ index: 0, delta: { role: 'assistant', content: text } }] })
    calls.forEach((k, i) => {
      send({ choices: [{ index: 0, delta: { tool_calls: [{ index: i, id: `c${i}`, type: 'function', function: { name: k.name, arguments: '' } }] } }] })
      const a = k.args ?? '{}'
      send({ choices: [{ index: 0, delta: { tool_calls: [{ index: i, function: { arguments: a.slice(0, 5) } }] } }] })
      send({ choices: [{ index: 0, delta: { tool_calls: [{ index: i, function: { arguments: a.slice(5) } }] } }] })
    })
    send({ choices: [{ index: 0, delta: {}, finish_reason: calls.length ? 'tool_calls' : 'stop' }], usage: { prompt_tokens: 2500, completion_tokens: 40, total_tokens: 2540 } })
    c.enqueue(e.encode('data: [DONE]\n\n')); c.close()
  },
}), { headers: { 'content-type': 'text/event-stream' } })

async function live(userText, model, { lang = 'es', env = {} } = {}) {
  const ev = []
  let body
  const r = await respond({
    p: { lang, userText, turns: 1, history: [{ role: 'user', content: userText }], signals: { suspicious: [] } },
    mode: 'live', env: { OPENROUTER_API_KEY: 'k', ...env }, delay: 0, capTurns: 12,
    guards: { liveIp: async () => true, liveGlobal: async () => true, human: async () => ({ ok: true }), reserve: async () => ({ allowed: true }) },
    send: async (e, d) => ev.push({ e, d }),
    fetchImpl: async (u, init) => { body = JSON.parse(init.body); return orStream(model) },
  })
  return { r, body, meta: ev.find((x) => x.e === 'meta')?.d, text: ev.filter((x) => x.e === 'delta').map((x) => x.d.t).join('') }
}
// Preguntas que NO caen en intención ni ficha curada (para llegar al modelo).
const Q = 'cuéntame cómo me ayudaría con mi floristería de barrio'

describe('deterministas, sin modelo', () => {
  it.each([
    ['llévame a precios', 'goPricing', '](/precios/)'], ['dónde veo los planes', 'goPricing', '](/precios/)'],
    ['preguntas frecuentes', 'goFaq', '](/#faq)'], ['quiero hablar con una persona', 'contact', 'mailto:info@agentceo.io'],
  ])('«%s» → %s con su enlace', (t, id, link) => {
    expect(intentOf(t)).toBe(id)
    expect(stubReply('es', t).text).toContain(link)
  })
  it.each([['show me pricing', '](/en/pricing/)'], ['FAQ', '](/en/#faq)']])('en · «%s» → enlace en inglés', (t, link) => {
    expect(stubReply('en', t).text).toContain(link)
  })
  it('registro → tarjeta de la lista (cta waitlist) sin chips', () => {
    const r = stubReply('es', 'Ok me quiero registrar amigo')
    expect(r.meta).toMatchObject({ kind: 'intent:join', cta: 'waitlist', chips: [] })
    expect(r.text).toBe(say('es', 'join'))
  })
})

describe('applyTools: solo listas cerradas', () => {
  it('waitlist → cta; open_section → enlace de la sección; contact → correo', () => {
    const t = applyTools([{ name: 'show_waitlist_card', args: '{}' }, { name: 'open_section', args: '{"section":"pricing"}' }, { name: 'contact_team', args: '' }], 'es', 'Hola.')
    expect(t).toEqual({ cta: 'waitlist', append: ['[ver precios](/precios/)', '[info@agentceo.io](mailto:info@agentceo.io)'], used: ['show_waitlist_card', 'open_section:pricing', 'contact_team'] })
  })
  it('lo inventado o malicioso se ignora (URL, sección inexistente, otra herramienta, JSON roto)', () => {
    const t = applyTools([
      { name: 'open_section', args: '{"section":"https://evil.test"}' }, { name: 'open_section', args: '{"section":"../admin"}' },
      { name: 'delete_database', args: '{}' }, { name: 'open_section', args: '{rot' },
    ], 'en', '')
    expect(t).toEqual({ cta: null, append: [], used: [] })
  })
  it('no repite un enlace que el texto ya trae; como mucho 3 llamadas', () => {
    expect(applyTools([{ name: 'open_section', args: '{"section":"faq"}' }], 'es', 'Mira [aquí](/#faq).').append).toEqual([])
    expect(applyTools(Array(6).fill({ name: 'contact_team', args: '{}' }), 'es', '').used).toHaveLength(3)
  })
  it('las secciones son rutas públicas reales y el esquema es pequeño', () => {
    for (const s of Object.values(SECTIONS)) for (const l of ['es', 'en']) expect(s[l]).toMatch(/^\/(en\/)?([a-z#-]+\/?)?$/)
    expect(TOOLS.map((t) => t.function.name)).toEqual(['show_waitlist_card', 'open_section', 'contact_team'])
    expect(TOOLS_TOKENS).toBeLessThan(250)
  })
})

describe('el modelo usa las herramientas (function calling, stream troceado)', () => {
  it('manda las tools en la petición, con tool_choice auto', async () => {
    const { body } = await live(Q, { text: 'Claro.' })
    expect(body.tools.map((t) => t.function.name)).toEqual(['show_waitlist_card', 'open_section', 'contact_team'])
    expect(body.tool_choice).toBe('auto')
  })
  it('show_waitlist_card → la meta lleva cta waitlist (el panel pinta la tarjeta de siempre)', async () => {
    const { meta, text, r } = await live(Q, { text: 'Con gusto te guardo un lugar.', calls: [{ name: 'show_waitlist_card' }] })
    expect(meta).toMatchObject({ mode: 'live', cta: 'waitlist', tools: ['show_waitlist_card'] })
    expect(text).toBe('Con gusto te guardo un lugar.')
    expect(r.tools).toEqual(['show_waitlist_card'])
  })
  it('solo herramienta, sin texto → la frase de la lista (no queda en blanco)', async () => {
    const { text, meta } = await live(Q, { calls: [{ name: 'show_waitlist_card' }] })
    expect(meta.cta).toBe('waitlist')
    expect(text).toBe(say('es', 'join'))
  })
  it('open_section y contact_team → enlace y correo al final; en inglés, rutas en inglés', async () => {
    const { text } = await live('tell me how you would help my flower shop', { text: 'Sure.', calls: [{ name: 'open_section', args: '{"section":"pricing"}' }, { name: 'contact_team' }] }, { lang: 'en' })
    expect(text).toBe('Sure.\n\n[see pricing](/en/pricing/)\n\n[info@agentceo.io](mailto:info@agentceo.io)')
  })
  it('una herramienta inyectada con argumentos maliciosos no cambia nada', async () => {
    const { meta, text } = await live(Q, { text: 'Te cuento.', calls: [{ name: 'open_section', args: '{"section":"javascript:alert(1)"}' }, { name: 'run_shell', args: '{"cmd":"rm -rf /"}' }] })
    expect(meta.cta ?? null).toBeNull()
    expect(meta.tools).toBeUndefined()
    expect(text).toBe('Te cuento.')
  })
  it('CHAT_TOOLS=off → sin tools en la petición', async () => {
    const { body } = await live(Q, { text: 'Hola.' }, { env: { CHAT_TOOLS: 'off' } })
    expect(body.tools).toBeUndefined()
  })
})
