// FASE 2 · lista de espera en navegador real contra el Worker y la D1 LOCALES.
import { test, expect } from './fixtures.js'
import { queryLocal, testEmail } from './db.js'

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => { throw e })
})

test('hero: correo inválido → error accesible, no envía', async ({ page }) => {
  await page.goto('/')
  const form = page.locator('form[data-source="hero"]')
  await form.locator('input[type=email]').fill('esto-no-es-correo')
  await form.locator('button[type=submit]').click()
  await expect(form.locator('[data-wl-msg]')).toHaveText(/correo válido/)
  await expect(form.locator('input[type=email]')).toHaveAttribute('aria-invalid', 'true')
  await expect(form.locator('input[type=email]')).toBeFocused()
})

test('hero → éxito real en D1 con atribución → paso 2 (negocio) → dentro', async ({ page }, info) => {
  const email = testEmail('hero', info)
  await page.goto('/?utm_source=boletin&utm_campaign=otono&gclid=XYZ')
  // Un humano tarda > 1,2 s (trampa de tiempo del Worker).
  await page.waitForTimeout(1300)
  const form = page.locator('form[data-source="hero"]')
  await form.locator('input[type=email]').pressSequentially(email, { delay: 5 })
  await form.locator('input[type=email]').press('Enter')

  // El éxito inline aparece SOLO tras la respuesta del Worker.
  await expect(form.locator('[data-wl-ok]')).toBeVisible()
  // El modal se abre en el paso 2.
  const modal = page.locator('dialog[data-wl-modal]')
  await expect(modal).toBeVisible()
  await expect(modal.locator('[data-step-panel="biz"]')).toBeVisible()
  await modal.locator('.jchip', { hasText: 'Ropa y moda' }).click()
  await modal.locator('[data-wl-biz] button[type=submit]').click()
  await expect(modal.locator('[data-step-panel="done"]')).toBeVisible()
  await expect(modal.locator('[data-wl-mail-text]')).toHaveText(email)

  const [row] = queryLocal(`SELECT * FROM signups WHERE email = '${email}'`)
  expect(row).toMatchObject({ source: 'hero', locale: 'es', utm_source: 'boletin', utm_campaign: 'otono', click_id: 'gclid:XYZ', business_type: 'moda', landing_path: '/', notice_version: '2026-10-20' })

  // Cerrar y recargar: el formulario recuerda que ya te apuntaste (sin guardar el correo).
  await modal.locator('[data-wl-close]').last().click()
  await expect(modal).toBeHidden()
  await page.reload()
  await expect(page.locator('form[data-source="hero"] [data-wl-ok]')).toContainText('Ya estás en la lista')
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }))
  expect(stored).not.toContain('@')
})

test('CTA del header abre el modal; Escape lo cierra y el foco vuelve', async ({ page, isMobile }) => {
  await page.goto('/en/')
  const cta = page.locator('header .hdr-cta')
  await cta.click()
  const modal = page.locator('dialog[data-wl-modal]')
  await expect(modal).toBeVisible()
  await expect(modal.locator('h2#wl-modal-title')).toContainText('waiting for you')
  await expect(modal.locator('[data-step-panel="form"] input[type=email]')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(modal).toBeHidden()
  if (!isMobile) await expect(cta).toBeFocused()
})

test('modal en inglés: guarda con locale=en', async ({ page }, info) => {
  const email = testEmail('modal-en', info)
  await page.goto('/en/')
  await page.waitForTimeout(1300)
  await page.locator('header .hdr-cta').click()
  const modal = page.locator('dialog[data-wl-modal]')
  await modal.locator('input[type=email]').fill(email)
  await modal.locator('[data-step-panel="form"] button[type=submit]').click()
  await expect(modal.locator('[data-step-panel="biz"]')).toBeVisible()
  await modal.locator('[data-wl-skip]').click()
  await expect(modal.locator('[data-step-panel="done"]')).toBeVisible()
  const [row] = queryLocal(`SELECT locale, source, business_type FROM signups WHERE email = '${email}'`)
  expect(row).toEqual({ locale: 'en', source: 'modal', business_type: null })
})

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('el formulario funciona igual: POST → /gracias/ y queda en D1', async ({ page }, info) => {
    const email = testEmail('nojs', info)
    await page.goto('/')
    const form = page.locator('form[data-source="hero"]')
    await form.locator('input[type=email]').fill(email)
    await form.locator('button[type=submit]').click()
    await expect(page).toHaveURL(/\/gracias\/$/)
    await expect(page.locator('.ty-ok h1')).toBeVisible()
    expect(queryLocal(`SELECT COUNT(*) AS n FROM signups WHERE email = '${email}'`)[0].n).toBe(1)
  })

  test('correo inválido → /gracias/#error muestra el error y un formulario para reintentar', async ({ page }) => {
    await page.goto('/en/')
    const form = page.locator('form[data-source="hero"]')
    await form.locator('input[type=email]').fill('mal')
    await form.locator('button[type=submit]').click()
    await expect(page).toHaveURL(/\/en\/thanks\/#error$/)
    await expect(page.locator('.ty-err h1')).toBeVisible()
    await expect(page.locator('.ty-ok h1')).toBeHidden()
  })

  test('el CTA del header lleva al formulario (#acceso)', async ({ page }) => {
    await page.goto('/')
    await page.locator('header .hdr-cta').click()
    await expect(page).toHaveURL(/#acceso$/)
  })
})

test('exit-intent: al sacar el ratón por arriba se ofrece guardar el lugar (una vez)', async ({ page, isMobile }) => {
  test.skip(isMobile, 'solo escritorio con ratón')
  await page.goto('/')
  await page.mouse.move(700, 400)
  await page.waitForTimeout(6200)
  await page.mouse.move(700, 5)
  await page.mouse.move(700, -40)
  const modal = page.locator('dialog[data-wl-modal]')
  await expect(modal).toBeVisible()
  await expect(modal.locator('[data-copy="exit"]').first()).toBeVisible()
  await page.keyboard.press('Escape')
  await page.mouse.move(700, 400)
  await page.mouse.move(700, -40)
  await page.waitForTimeout(400)
  await expect(modal).toBeHidden()
})

test('si el servidor rechaza (429 real), la interfaz muestra el error y NUNCA un éxito falso', async ({ page }, info) => {
  test.setTimeout(45_000)
  // Ventana de 60 s limpia (el contador se reinicia al cambiar de minuto).
  const sec = new Date().getSeconds()
  if (sec > 45) await page.waitForTimeout((61 - sec) * 1000)
  await page.goto('/')
  await page.waitForTimeout(1300)
  // Agota el límite real del Worker desde la MISMA IP del test (8/min).
  const headers = { 'content-type': 'application/json', origin: new URL(page.url()).origin }
  for (let i = 0; i < 8; i++) await page.request.post('/api/waitlist', { headers, data: { email: `relleno${i}-${Date.now()}@example.com` } })
  const email = testEmail('rl', info)
  const form = page.locator('form[data-source="hero"]')
  await form.locator('input[type=email]').fill(email)
  await form.locator('button[type=submit]').click()
  await expect(form.locator('[data-wl-msg]')).toHaveText(/Demasiados intentos/)
  await expect(form.locator('[data-wl-ok]')).toBeHidden()
  await expect(page.locator('dialog[data-wl-modal]')).toBeHidden()
  expect(queryLocal(`SELECT COUNT(*) AS n FROM signups WHERE email = '${email}'`)[0].n).toBe(0)
})
