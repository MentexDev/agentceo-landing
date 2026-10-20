// FASE L · consentimiento, GPC y «No vender ni compartir» en navegador real.
import { test, expect } from './fixtures.js'

test('documento legal: banda de borrador e índice navegable', async ({ page }) => {
  await page.goto('/legal/privacidad')
  await expect(page.locator('.draft')).toContainText('requiere revisión de abogado')
  const first = page.locator('.toc a').first()
  const target = await first.getAttribute('href')
  await first.click()
  await expect(page).toHaveURL(new RegExp(`${target}$`))
  await expect(page.locator('.legal-body .tbl-wrap').first()).toBeVisible()
})

test('preferencias de cookies: desactivar lo funcional borra lo que la web guardó', async ({ page }) => {
  await page.goto('/')
  // La web guarda algo funcional: el idioma elegido.
  await page.locator('header [data-lang-switch] summary').click()
  await page.locator('header [data-lang-switch] a[hreflang="es"]').click()
  expect((await page.context().cookies()).some((c) => c.name === 'lang')).toBe(true)
  await page.evaluate(() => localStorage.setItem('ac_chat', '{}'))
  const btn = page.locator('footer [data-cookie-prefs]')
  await btn.scrollIntoViewIfNeeded()
  await btn.click()
  const dlg = page.locator('[data-cookie-panel]')
  await expect(dlg).toBeVisible()
  await expect(dlg.locator('input[name=a]')).toBeDisabled()
  await dlg.locator('input[name=f]').uncheck()
  await dlg.getByRole('button', { name: 'Guardar preferencias' }).click()
  await expect(dlg).toBeHidden()
  const cookies = await page.context().cookies()
  expect(cookies.find((c) => c.name === 'consent')?.value).toBe('v1.f0.a0.d0')
  expect(cookies.some((c) => c.name === 'lang')).toBe(false)
  expect(await page.evaluate(() => localStorage.getItem('ac_chat'))).toBeNull()
  // Y a partir de aquí no vuelve a guardar: elegir idioma ya no deja cookie.
  await page.locator('header [data-lang-switch] summary').click()
  await page.locator('header [data-lang-switch] a[hreflang="es"]').click()
  expect((await page.context().cookies()).some((c) => c.name === 'lang')).toBe(false)
})

test('«No vender ni compartir»: registrar la solicitud', async ({ page }) => {
  await page.goto('/no-vender-ni-compartir/')
  await page.locator('[data-dns-btn]').click()
  await expect(page.locator('[data-dns-msg]')).toContainText('quedó registrada')
  expect((await page.context().cookies()).find((c) => c.name === 'consent')?.value).toMatch(/\.d1$/)
})

test.describe('con la señal GPC del navegador', () => {
  // Simula un navegador que envía GPC (Brave, Firefox con la opción, extensiones).
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', { get: () => true }))
  })
  test('la página lo detecta y el panel bloquea «no vender» activado', async ({ page }) => {
    await page.goto('/no-vender-ni-compartir/')
    await expect(page.locator('[data-dns-gpc]')).toBeVisible()
    await page.locator('main [data-cookie-prefs]').click()
    const dlg = page.locator('[data-cookie-panel]')
    await expect(dlg.locator('[data-gpc]')).toBeVisible()
    await expect(dlg.locator('input[name=d]')).toBeChecked()
    await expect(dlg.locator('input[name=d]')).toBeDisabled()
  })
})
