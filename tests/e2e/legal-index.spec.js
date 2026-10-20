// Índice de los documentos legales (T35 · adenda, punto 4): /legal/ y /en/legal/ listan los 14
// documentos con su enlace, con hreflang recíproco; el «Ver todo» del footer lleva aquí; axe sin
// violaciones WCAG 2.2 AA en el índice y en el footer.
import { test, expect } from './fixtures.js'
import AxeBuilder from '@axe-core/playwright'

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

for (const [url, other, prefix] of [['/legal/', '/en/legal/', '/legal/'], ['/en/legal/', '/legal/', '/en/legal/']]) {
  test(`${url} lista los 14 documentos, todos enlazados y vivos, con hreflang recíproco`, async ({ page, request }) => {
    const res = await page.goto(url)
    expect(res.status()).toBe(200)
    const links = await page.locator('[data-legal-doc]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    expect(links).toHaveLength(14)
    expect(new Set(links).size).toBe(14)
    for (const h of links) {
      expect(h.startsWith(prefix)).toBe(true)
      expect((await request.get(h)).status(), h).toBe(200)
    }
    const alt = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((ls) => ls.map((l) => new URL(l.href).pathname))
    expect(alt).toContain(other)
    expect(alt).toContain(url)
    await expect(page.locator('h1')).toHaveCount(1)
  })
}

test('el «Ver todo» del footer lleva al índice legal', async ({ page }) => {
  await page.goto('/')
  const more = page.locator('footer a.ft-more')
  await expect(more).toHaveAccessibleName(/^Ver todo/)
  await more.click()
  await expect(page).toHaveURL(/\/legal\/$/)
  await expect(page.locator('[data-legal-doc]')).toHaveCount(14)
})

for (const url of ['/legal/', '/en/legal/']) {
  test(`axe WCAG 2.2 AA sin violaciones en ${url} (incluido el footer)`, async ({ page }) => {
    await page.goto(url)
    const r = await new AxeBuilder({ page }).withTags(WCAG).analyze()
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([])
  })
}
