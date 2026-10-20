// FASE 4 · páginas internas en navegador real.
import { test, expect } from './fixtures.js'
import { queryLocal, testEmail } from './db.js'

test('noticias: filtrar por categoría con los chips (radios, sin JS ni salto de diseño)', async ({ page }) => {
  await page.goto('/noticias/')
  const chips = page.locator('[data-filters] input[type=radio]')
  await expect(chips.first()).toBeChecked()
  const total = await page.locator('[data-cat]:visible').count()
  await page.locator('[data-filters] .chip').nth(1).click()
  await expect(chips.nth(1)).toBeChecked()
  const cat = await chips.nth(1).getAttribute('value')
  const visible = page.locator('[data-cat]:visible')
  const n = await visible.count()
  expect(n).toBeGreaterThan(0)
  expect(n).toBeLessThanOrEqual(total)
  for (let i = 0; i < n; i++) await expect(visible.nth(i)).toHaveAttribute('data-cat', cat)
  // Con el teclado: flechas entre radios.
  await chips.nth(1).focus()
  await page.keyboard.press('ArrowLeft')
  await expect(chips.first()).toBeChecked()
  await expect(page.locator('[data-cat]:visible')).toHaveCount(total)
})

test('noticia: fuentes verificadas que abren en otra pestaña y migas de pan', async ({ page }) => {
  await page.goto('/noticias/')
  await page.locator('a.card').first().click()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('nav[aria-label] .crumbs')).toContainText('Noticias')
  const src = page.locator('aside.box a[target=_blank]').first()
  await expect(src).toHaveAttribute('rel', /noopener/)
})

test('recurso: el gate guarda el lead en D1 y revela la guía', async ({ page }, info) => {
  const email = testEmail('lead', info)
  await page.goto('/recursos/')
  await page.locator('a.card').first().click()
  const gate = page.locator('[data-gate]')
  await expect(gate).toBeVisible()
  await expect(page.locator('[data-gated]')).toBeHidden()
  await gate.locator('input[type=email]').fill(email)
  await gate.locator('button[type=submit]').click()
  await expect(page.locator('[data-gated]')).toBeVisible()
  await expect(gate).toBeHidden()
  const slug = page.url().split('/').pop()
  const [row] = queryLocal(`SELECT resource FROM leads WHERE email = '${email}'`)
  expect(row.resource).toBe(slug)
  // Recordado al volver (sin guardar el correo en el navegador).
  await page.reload()
  await expect(page.locator('[data-gated]')).toBeVisible()
})

test('precios: los 4 planes y los 4 paquetes con los precios reales de la app', async ({ page }) => {
  await page.goto('/precios/')
  await expect(page.locator('[data-pendiente]')).toHaveCount(0)
  const plans = page.locator('[data-plan]')
  await expect(plans).toHaveCount(4)
  for (const [id, price] of [['arranque', '$0'], ['impulso', '$29'], ['motor', '$99'], ['imperio', '$249']]) {
    await expect(page.locator(`[data-plan="${id}"] .plan-amount`)).toHaveText(price)
  }
  await expect(page.locator('[data-plan="impulso"]')).toHaveClass(/plan-feat/)
  await expect(page.locator('.pack')).toHaveCount(4)
  await expect(page.locator('.pack', { hasText: 'Reserva' })).toContainText('No caduca')
  await page.locator('.pfaq-i summary').first().click()
  await expect(page.locator('.pfaq-i[open] p')).toBeVisible()
})

test('empresa: datos verificables de Klinworks, LLC', async ({ page }) => {
  await page.goto('/empresa/')
  await expect(page.locator('main')).toContainText('Klinworks, LLC')
  await expect(page.locator('main')).toContainText('10704723')
  await expect(page.locator('main')).toContainText('Newark, Delaware 19713')
})

test('contacto: el botón abre el asistente de IA', async ({ page }) => {
  await page.goto('/contacto/')
  await expect(page.locator('main a[href="mailto:privacidad@klinworks.com"]')).toBeVisible()
  await page.locator('[data-open-chat]').click()
  await expect(page.locator('[data-chat-panel]')).toBeVisible()
})

test('prensa: los SVG de la mascota se descargan', async ({ page, request }) => {
  await page.goto('/prensa/')
  for (const href of ['/brand/agentceo-mascota.svg', '/brand/agentceo-mascota-clara.svg']) {
    const r = await request.get(href)
    expect(r.status()).toBe(200)
    expect(await r.text()).toContain('<svg')
  }
})

test('header: los enlaces del brief (Recursos, Blog, Noticias, Precios) funcionan', async ({ page, isMobile }) => {
  await page.goto('/')
  if (isMobile) await page.locator('[data-mobile-menu] summary').click()
  const nav = page.locator(isMobile ? '.hdr-sheet' : '.hdr-nav')
  for (const name of ['Recursos', 'Blog', 'Noticias', 'Precios']) await expect(nav.getByRole('link', { name })).toBeVisible()
  await nav.getByRole('link', { name: 'Precios' }).click()
  await expect(page).toHaveURL(/\/precios\/$/)
  await expect(page.locator('.hdr-nav a[aria-current="page"], .hdr-sheet a[aria-current="page"]').first()).toHaveText('Precios')
})
