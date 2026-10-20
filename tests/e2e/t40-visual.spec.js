// T40 · ajustes visuales (Diego, 20-oct): el chat no tapa el pie y el header no tapa S07.
import { test, expect } from './fixtures.js'

test('al final de la página, ni el lanzador ni la burbuja tapan ningún enlace del pie', async ({ page }) => {
  test.setTimeout(40_000)
  await page.goto('/')
  await page.waitForTimeout(9000) // la burbuja «¿Tienes una pregunta?» aparece a los 8 s
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await expect.poll(() => page.evaluate(() => {
    const vis = (e) => e && !e.hidden && getComputedStyle(e).display !== 'none'
    const area = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
    const tapas = ['.cw-launch', '.cw-tease'].map((s) => document.querySelector(s)).filter(vis).map((e) => e.getBoundingClientRect())
    const links = [...document.querySelectorAll('footer a, footer button, footer summary')].filter((e) => e.offsetParent)
    return links.reduce((n, l) => n + tapas.reduce((m, t) => m + area(l.getBoundingClientRect(), t), 0), 0)
  }), { timeout: 3000 }).toBe(0)
})

for (const url of ['/#reunion', '/en/#reunion']) {
  test(`navegar a ${url}: la etiqueta de S07 queda por debajo del header sticky`, async ({ page }) => {
    await page.goto(url)
    await page.waitForTimeout(3200) // el CSS no crítico llega tras load y re-ancla durante 2,5 s
    const r = await page.evaluate(() => {
      const eyebrow = document.querySelector('#reunion [data-rv] span, #reunion span')
      return { header: document.querySelector('header').getBoundingClientRect().bottom, eyebrow: eyebrow.getBoundingClientRect().top }
    })
    expect(r.eyebrow).toBeGreaterThanOrEqual(r.header)
  })
}

test('S03: la línea de tipeo («Entendiendo lo que pediste…») va en sans, no en serif', async ({ page }) => {
  await page.goto('/')
  const demo = page.locator('[data-appdemo]')
  await demo.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await expect(page.locator('astro-island:has([data-appdemo])')).not.toHaveAttribute('ssr', '', { timeout: 10_000 })
  // La primera vista ya sale completa (T40 · 2: nunca vacía); la línea de tipeo aparece cuando la
  // escena del chat se REPRODUCE: se va a otra vista y se vuelve al chat.
  await demo.getByRole('tab').nth(1).click()
  await demo.getByRole('tab').first().click()
  const thinking = demo.locator('.ad-thinking')
  await expect(thinking).toBeVisible({ timeout: 8000 })
  expect(await thinking.evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/^"?Geist/)
})
