// T60 · «¿Se integra con X?»: datos únicos (content/integraciones.js) → base de conocimiento y respuesta
// determinista del chat (worker/chat/integrations.js). Sin modelo, sin red.
import { describe, it, expect } from 'vitest'
import { INTEGRATIONS, CATEGORIES, TOTAL, COUNTS, INTERNAL_EXCLUDED, integrationChunks } from '../../content/integraciones.js'
import { integrationQuery, integrationReply } from '../../worker/chat/integrations.js'
import { intentOf } from '../../worker/chat/persona.js'
import { stubReply, KB } from '../../worker/chat/stub.js'
import { respond } from '../../worker/chat/respond.js'
import { findPrivate } from '../../worker/chat/private.js'

describe('el catálogo', () => {
  it('cuadra con «70+» de la web y no repite marcas', () => {
    expect(TOTAL).toBeGreaterThanOrEqual(70)
    expect(new Set(INTEGRATIONS.map((i) => i.name)).size).toBe(TOTAL)
    expect(Object.values(COUNTS).reduce((a, c) => a + c.n, 0)).toBe(TOTAL)
    for (const [, label] of CATEGORIES) { expect(label.es).toBeTruthy(); expect(label.en).toBeTruthy() }
  })
  it('incluye TODAS las marcas que nombra la landing', () => {
    const guia = KB.es.find((c) => c.id === 'guia:integraciones').text
    const landing = ['Shopify', 'WooCommerce', 'Wix', 'Squarespace', 'PrestaShop', 'MercadoLibre', 'Amazon', 'Etsy', 'eBay', 'Alegra', 'Siigo', 'Factus', 'QuickBooks', 'HubSpot', 'Kommo', 'Bitrix24', 'Gmail', 'Drive', 'Sheets', 'Calendar', 'WhatsApp', 'Telegram', 'TikTok', 'YouTube']
    for (const b of landing) {
      expect(guia, b).toContain(b)
      expect(integrationQuery(`¿se integra con ${b}?`) ?? (/whatsapp|shopify/i.test(b) ? 'curada' : null), b).not.toBeNull()
    }
  })
  it('sin nombres de nuestra infraestructura ni datos privados', () => {
    for (const n of INTERNAL_EXCLUDED) expect(INTEGRATIONS.some((i) => i.name.toLowerCase() === n.toLowerCase()), n).toBe(false)
    for (const l of ['es', 'en']) for (const c of integrationChunks(l)) expect(findPrivate(`${c.title} ${c.text}`)).toEqual([])
  })
  it('las integraciones entran en la base de conocimiento del chat (una por categoría, es/en)', () => {
    for (const l of ['es', 'en']) expect(KB[l].filter((c) => c.kind === 'integracion')).toHaveLength(CATEGORIES.length)
  })
})

describe('«¿se integra con X?» (determinista, con alias y faltas)', () => {
  it.each([
    ['¿se integra con shopify y con woo?', ['Shopify', 'WooCommerce']], ['funciona con mercadopago?', ['Mercado Pago']], ['¿tienen integración con hub spot?', ['HubSpot']],
    ['¿se conecta con gmail y google calendar?', ['Google Calendar', 'Gmail']], ['¿se integra con meli?', ['Mercado Libre']], ['¿conecta con insta?', ['Instagram']],
    ['does it integrate with Xero?', ['Xero']], ['works with quickbooks?', ['QuickBooks']], ['integration with salesforce and stripe', ['Salesforce', 'Stripe']], ['¿se integra con Canva?', ['Canva']],
  ])('«%s» → %j', (t, names) => {
    const q = integrationQuery(t)
    expect(q.known.map((i) => i.name).sort()).toEqual([...names].sort())
    expect(intentOf(t)).toBe('integration')
  })
  it('respuesta: «¡Sí!» con la marca y su categoría, en su idioma', () => {
    const es = stubReply('es', '¿se integra con HubSpot?')
    expect(es.meta.kind).toBe('intent:integration')
    expect(es.text).toMatch(/^¡Sí! Agent CEO se integra con \*\*HubSpot\*\* \(CRM y ventas\)/)
    expect(stubReply('en', 'does it work with Stripe?').text).toMatch(/^Yes! Agent CEO integrates with \*\*Stripe\*\* \(payments\)/)
  })
  it.each([['¿se integra con Trello?', 'es'], ['does it connect to Pipefy?', 'en']])('desconocida («%s») → nunca un «no» seco: «estamos sumando», lista e info@', (t, l) => {
    const r = stubReply(l, t)
    expect(r.meta).toMatchObject({ kind: 'intent:integration', cta: 'waitlist' })
    expect(r.text).toContain('info@agentceo.io')
    expect(r.text).toMatch(l === 'es' ? /estamos sumando/ : /adding integrations/)
    expect(r.text).not.toMatch(/^(no|no se integra|doesn't|does not|we don't)/i)
    expect(r.text).toContain(String(TOTAL))
  })
  it.each(['¿funciona con mi negocio de comida?', '¿se conecta con mis redes?', '¿qué integraciones tienen?', 'Which tools does it connect to?', '¿funciona con WhatsApp?', '¿sirve con mi tienda Shopify?'])
  ('«%s» NO es una integración concreta (otra respuesta, o la ficha curada)', (t) => expect(intentOf(t)).not.toBe('integration'))
  it('en modo live se responde SIN llamar al modelo', async () => {
    let called = 0
    const ev = []
    const r = await respond({ p: { lang: 'es', userText: '¿se integra con Alegra?', turns: 1, history: [{ role: 'user', content: 'x' }], signals: { suspicious: [] } },
      mode: 'live', env: { OPENROUTER_API_KEY: 'k' }, delay: 0, capTurns: 12, guards: { liveIp: async () => true, liveGlobal: async () => true, human: async () => ({ ok: true }), reserve: async () => ({ allowed: true }) },
      send: async (e, d) => ev.push({ e, d }), fetchImpl: async () => { called++ } })
    expect(called).toBe(0)
    expect(r.path).toBe('stub')
    expect(ev.find((x) => x.e === 'meta').d.integrations).toEqual(['Alegra'])
  })
  it('el nombre desconocido que se repite está saneado (sin Markdown ni HTML)', () => {
    const q = integrationQuery('¿se integra con [x](javascript:alert(1))?')
    if (q) expect(integrationReply('es', q).text).not.toMatch(/\]\(|<|javascript:/)
  })
})
