// T35 · adenda, punto 0 (Diego escribió «hola amigo» en producción y el widget se quedó callado).
// Reproducido con el JS de producción: una respuesta que no termina dejaba «escribiendo…» para
// siempre y los mensajes siguientes se ignoraban. Aquí, en navegador real y con /api/chat simulado
// (page.route: ninguna petición sale de la máquina), el widget NUNCA se queda en silencio.
import { test, expect } from './fixtures.js'

const sse = (evs) => evs.map(([e, d]) => `event: ${e}\ndata: ${JSON.stringify(d)}\n\n`).join('')

async function abrir(page, handler) {
  const calls = []
  if (handler) await page.route('**/api/chat', (r) => { calls.push(r.request().postDataJSON()); return handler(r, calls.length) })
  await page.goto('/')
  await page.locator('[data-chat-launch]').click()
  const panel = page.locator('#cw-panel')
  await expect(page.locator('[data-chat-input]')).toBeFocused()
  return { panel, calls }
}
const escribir = async (page, t) => { await page.locator('[data-chat-input]').fill(t); await page.keyboard.press('Enter') }
// Última burbuja del asistente (la 1.ª es el saludo fijo del panel).
const ultima = (panel) => panel.locator('.cw-bot').last()

test('saludo («hola amigo»): respuesta al instante, sin petición al servidor', async ({ page }) => {
  const { panel, calls } = await abrir(page, (r) => r.fulfill({ status: 500 }))
  const t0 = Date.now()
  await escribir(page, 'hola amigo')
  await expect(panel.locator('.cw-bot')).toHaveCount(2, { timeout: 2000 })
  expect(Date.now() - t0).toBeLessThan(2000)
  await expect(ultima(panel)).toContainText('inteligencia artificial')
  await expect(ultima(panel)).toContainText('no una persona')
  expect(calls).toHaveLength(0)
})

test('429 (límite): mensaje amable + respuesta curada, y el siguiente mensaje sí sale', async ({ page }) => {
  const { panel, calls } = await abrir(page, (r, n) => n === 1
    ? r.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'rate_limited' }) })
    : r.fulfill({ status: 200, contentType: 'text/event-stream', body: sse([['meta', { mode: 'stub', kind: 'faq' }], ['delta', { t: 'Respuesta del servidor.' }], ['done', {}]]) }))
  await escribir(page, '¿Cuánto cuesta?')
  await expect(ultima(panel)).toContainText('mucha gente', { timeout: 5000 })
  await expect(ultima(panel)).toContainText('Arranque') // la ficha curada de precios, sin servidor
  await expect(panel.locator('.cw-retry')).toBeVisible()
  await escribir(page, '¿Funciona con WhatsApp?')
  await expect(ultima(panel)).toContainText('Respuesta del servidor.', { timeout: 5000 })
  expect(calls).toHaveLength(2)
})

test('stream vacío (solo «done»): nunca en silencio', async ({ page }) => {
  const { panel } = await abrir(page, (r) => r.fulfill({ status: 200, contentType: 'text/event-stream', body: sse([['meta', { mode: 'live', kind: 'live' }], ['done', {}]]) }))
  await escribir(page, '¿Qué es Agent CEO?')
  await expect(ultima(panel)).toContainText('Se me cortó la conexión', { timeout: 5000 })
  await expect(ultima(panel)).not.toBeEmpty()
  await expect(panel.locator('.cw-typing')).toHaveCount(0)
})

test('servidor colgado (timeout): responde a los ~15 s y no bloquea el siguiente mensaje', async ({ page }) => {
  test.setTimeout(60_000)
  const { panel, calls } = await abrir(page, (r, n) => n === 1 ? undefined /* nunca responde */ : r.fulfill({ status: 200, contentType: 'text/event-stream', body: sse([['meta', { mode: 'stub', kind: 'faq' }], ['delta', { t: 'Ya volví.' }], ['done', {}]]) }))
  await escribir(page, 'Tengo una tienda de ropa, ¿me sirve?')
  await expect(panel.locator('.cw-typing')).toBeVisible()
  await expect(ultima(panel)).toContainText('Se me cortó la conexión', { timeout: 20_000 })
  await expect(panel.locator('.cw-typing')).toHaveCount(0)
  await escribir(page, 'otra pregunta')
  await expect(ultima(panel)).toContainText('Ya volví.', { timeout: 5000 })
  expect(calls).toHaveLength(2)
})
