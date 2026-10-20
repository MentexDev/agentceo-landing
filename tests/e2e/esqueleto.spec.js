// FASE 1 · esqueleto: idioma, menú móvil, 404, sin errores de consola.
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => { throw e })
})

test('el selector de idioma lleva a la página equivalente y vuelve', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  const sw = page.locator('header [data-lang-switch] summary')
  await sw.click()
  await page.locator('header [data-lang-switch] a[hreflang="en"]').click()
  await expect(page).toHaveURL(/\/en\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  // La preferencia queda en una cookie funcional.
  const cookies = await page.context().cookies()
  expect(cookies.find((c) => c.name === 'lang')?.value).toBe('en')
  await page.locator('header [data-lang-switch] summary').click()
  await page.locator('header [data-lang-switch] a[hreflang="es"]').click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
})

test('el selector se cierra con Escape y devuelve el foco', async ({ page }) => {
  await page.goto('/')
  const det = page.locator('header [data-lang-switch]')
  await det.locator('summary').click()
  await expect(det).toHaveAttribute('open', '')
  await page.keyboard.press('Escape')
  await expect(det).not.toHaveAttribute('open', '')
  await expect(det.locator('summary')).toBeFocused()
})

test('el skip-link lleva al contenido con el teclado', async ({ page, isMobile }) => {
  test.skip(isMobile, 'tabulación: solo escritorio')
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.locator('.skip-link')
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#contenido$/)
})

test('404 en el idioma de la ruta', async ({ page }) => {
  const r = await page.goto('/en/esto-no-existe')
  expect(r.status()).toBe(404)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('h1')).toContainText('got away')
})

test('sin scroll horizontal', async ({ page }) => {
  await page.goto('/')
  const sw = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(sw).toBeLessThanOrEqual(0)
})
