// T40 · 2 — S03 «Así se ve tu empresa por dentro» salía NEGRA en producción (8cec919): el HTML del
// servidor traía el chat vacío (`.ad-log` sin nada) y cada cambio de vista arrancaba desde `{}`.
// Sin JS, o con JS lento o fallido, la ventana se quedaba negra. Guardianes: SSR poblado y ningún
// fotograma sin contenido al hidratar ni al cambiar de vista.
import { test, expect } from './fixtures.js'

// Texto visible en el panel principal de la demo.
const texto = (page) => page.evaluate(() => (document.querySelector('[data-appdemo] #ad-panel')?.innerText || '').trim().length)
// Mínimo de texto visible durante ~1,5 s (un muestreo por fotograma): detecta cualquier hueco vacío.
const minimo = (page) => page.evaluate(async () => {
  let min = 1e9
  for (let i = 0; i < 45; i++) {
    min = Math.min(min, (document.querySelector('[data-appdemo] #ad-panel')?.innerText || '').trim().length)
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 30)))
  }
  return min
})

test('sin JS (HTML del servidor): el chat de la demo ya trae la conversación completa', async ({ browser }, info) => {
  const ctx = await browser.newContext({ locale: 'es-ES', javaScriptEnabled: false, baseURL: info.project.use.baseURL })
  const page = await ctx.newPage()
  await page.goto('/')
  const demo = page.locator('[data-appdemo]')
  await expect(demo.locator('.ad-bubble-user')).toContainText('pijama')
  await expect(demo.locator('.ad-steps li')).toHaveCount(3)
  await expect(demo.locator('.ad-bubble-agent:not(.ad-earlier)')).toContainText('Necesita tu firma')
  expect(await texto(page)).toBeGreaterThan(300)
  await ctx.close()
})

test('al hidratar y al cambiar de vista, nunca hay un fotograma sin contenido', async ({ page }) => {
  test.setTimeout(60_000)
  await page.goto('/')
  const demo = page.locator('[data-appdemo]')
  await demo.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await expect(page.locator('astro-island:has([data-appdemo])')).not.toHaveAttribute('ssr', '', { timeout: 15_000 })
  // La hidratación NO reinicia la vista inicial: sigue la conversación completa (~660 caracteres; si
  // se reiniciara quedaría solo el mensaje anterior, ~190).
  expect(await minimo(page)).toBeGreaterThan(400)
  const tabs = demo.getByRole('tab')
  const n = await tabs.count()
  for (let i = 1; i <= n; i++) {
    await tabs.nth(i % n).click() // recorre todas y vuelve al chat
    expect(await minimo(page), `vista ${i % n}`).toBeGreaterThan(100)
  }
})
