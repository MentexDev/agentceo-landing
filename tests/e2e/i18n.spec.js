// FASE 6 · inglés: el selector lleva a la página GEMELA y vuelve.
import { test, expect } from './fixtures.js'

const switchTo = async (page, lang) => {
  await page.locator('header [data-lang-switch] summary').click()
  await page.locator(`header [data-lang-switch] a[hreflang="${lang}"]`).click()
}

for (const [es, en] of [
  ['/blog/que-es-un-agente-de-ia', '/en/blog/what-an-ai-agent-really-is-and-why-its-not-a-chatbot'],
  ['/legal/reembolsos', '/en/legal/refunds'],
  ['/precios/', '/en/pricing/'],
  ['/no-vender-ni-compartir/', '/en/do-not-sell-or-share/'],
]) {
  test(`${es} ⇄ ${en}`, async ({ page }) => {
    await page.goto(es)
    await switchTo(page, 'en')
    await expect(page).toHaveURL(new RegExp(`${en.replace(/[/.]/g, '\\$&')}$`))
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await switchTo(page, 'es')
    await expect(page).toHaveURL(new RegExp(`${es.replace(/[/.]/g, '\\$&')}$`))
  })
}

test('pricing en inglés con los precios reales y formato inglés', async ({ page }) => {
  await page.goto('/en/pricing/')
  await expect(page.locator('[data-plan="impulso"] .plan-amount')).toHaveText('$29')
  await expect(page.locator('main')).toContainText('2,300')
  await expect(page.locator('h1')).not.toContainText('Empieza')
})

test('legal en inglés: borrador visible y tabla viva de subprocesadores', async ({ page }) => {
  await page.goto('/en/legal/subprocessors')
  await expect(page.locator('.draft')).toContainText('requires attorney review')
  await expect(page.locator('.legal-body table')).toContainText('Cloudflare')
  await expect(page.locator('.legal-body')).not.toContainText('Sentry')
})
