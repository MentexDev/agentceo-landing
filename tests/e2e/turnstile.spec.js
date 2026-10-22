// T58 · Turnstile en la lista de espera, navegador REAL + claves de PRUEBA oficiales de Cloudflare.
// Solo corre con playwright.turnstile.config.js (que levanta los Workers con las claves); en la suite normal
// (sin Turnstile) se salta.
import { test as base, expect } from '@playwright/test'
import { randomBytes } from 'node:crypto'
import { queryLocal, testEmail } from './db.js'

// Como fixtures.js (una IP de documentación propia por test, por el rate limit), pero la cabecera
// cf-connecting-ip SOLO hacia nuestros Workers locales: el edge de Cloudflare rechaza una cf-* puesta por el
// cliente, y con setExtraHTTPHeaders el widget real de Turnstile no llegaba a dar token (medido el 22-oct).
const test = base.extend({
  page: async ({ page }, use) => {
    const ip = `2001:db8:${randomBytes(2).toString('hex')}:${randomBytes(2).toString('hex')}::1`
    await page.route(/^http:\/\/127\.0\.0\.1:879[34]\//, (route) => route.continue({ headers: { ...route.request().headers(), 'cf-connecting-ip': ip } }))
    await use(page)
  },
})

test.skip(!process.env.E2E_TURNSTILE, 'solo con playwright.turnstile.config.js')
const FAILING = 'http://127.0.0.1:8793'
const DUMMY = 'XXXX.DUMMY.TOKEN.XXXX'

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => { throw e })
})

test('el script de Cloudflare NO carga en el render: solo al tocar un formulario', async ({ page }) => {
  const ts = []
  page.on('request', (r) => { if (r.url().includes('challenges.cloudflare.com')) ts.push(r.url()) })
  await page.goto('/')
  await expect(page.locator('meta[name="ac-turnstile"]')).toHaveAttribute('content', '1x00000000000000000000AA')
  await page.waitForTimeout(1500)
  expect(ts).toEqual([])
  await page.locator('form[data-source="hero"] input[type=email]').focus()
  await expect.poll(() => ts.some((u) => u.includes('/turnstile/v0/api.js'))).toBe(true)
})

test('es · token válido → éxito real, guardado en D1; el paso 2 usa un token NUEVO', async ({ page }, info) => {
  const email = testEmail('ts-es', info)
  const bodies = []
  page.on('request', (r) => { if (r.url().endsWith('/api/waitlist') && r.method() === 'POST') bodies.push(JSON.parse(r.postData() || '{}')) })
  await page.goto('/?utm_source=meta&utm_campaign=t58&fbclid=FB123')
  await page.waitForTimeout(1300)
  const form = page.locator('form[data-source="hero"]')
  await form.locator('input[type=email]').pressSequentially(email, { delay: 5 })
  await form.locator('input[type=email]').press('Enter')
  await expect(form.locator('[data-wl-ok]')).toBeVisible({ timeout: 20_000 })
  const modal = page.locator('dialog[data-wl-modal]')
  await expect(modal.locator('[data-step-panel="biz"]')).toBeVisible()
  await modal.locator('.jchip', { hasText: 'Ropa y moda' }).click()
  await modal.locator('[data-wl-biz] button[type=submit]').click()
  await expect(modal.locator('[data-step-panel="done"]')).toBeVisible({ timeout: 20_000 })
  expect(bodies).toHaveLength(2)
  expect(bodies.map((b) => b.turnstile)).toEqual([DUMMY, DUMMY]) // el widget de prueba siempre da este token
  const [row] = queryLocal(`SELECT locale, business_type, utm_source, utm_campaign, click_id FROM signups WHERE email = '${email}'`)
  expect(row).toEqual({ locale: 'es', business_type: 'moda', utm_source: 'meta', utm_campaign: 't58', click_id: 'fbclid:FB123' })
})

test('en · modal con token válido → guardado con locale=en', async ({ page }, info) => {
  const email = testEmail('ts-en', info)
  await page.goto('/en/')
  await page.waitForTimeout(1300)
  await page.locator('header .hdr-cta').click()
  const modal = page.locator('dialog[data-wl-modal]')
  await modal.locator('input[type=email]').fill(email)
  await modal.locator('[data-step-panel="form"] button[type=submit]').click()
  await expect(modal.locator('[data-step-panel="biz"]')).toBeVisible({ timeout: 20_000 })
  const [row] = queryLocal(`SELECT locale, source FROM signups WHERE email = '${email}'`)
  expect(row).toEqual({ locale: 'en', source: 'modal' })
})

test('token rechazado (secreto 2x…) → mensaje amable traducido, NO se guarda', async ({ page }, info) => {
  const email = testEmail('ts-falla', info)
  await page.goto(`${FAILING}/`)
  await page.waitForTimeout(1300)
  const form = page.locator('form[data-source="hero"]')
  await form.locator('input[type=email]').fill(email)
  await form.locator('button[type=submit]').click()
  await expect(form.locator('[data-wl-msg]')).toHaveText('No pudimos comprobar que eres una persona. Recarga la página e inténtalo otra vez.', { timeout: 20_000 })
  await expect(form.locator('[data-wl-ok]')).toBeHidden()
  expect(queryLocal(`SELECT email FROM signups WHERE email = '${email}'`)).toEqual([])
})

test('API sin token o con token basura → 403 verification_failed; no se guarda', async ({ request }, info) => {
  const a = testEmail('ts-sin', info)
  const r = await request.post('/api/waitlist', { data: { email: a } })
  expect(r.status()).toBe(403)
  expect(await r.json()).toEqual({ ok: false, error: 'verification_failed' })
  const b = testEmail('ts-basura', info)
  const r2 = await request.post(`${FAILING}/api/waitlist`, { data: { email: b, turnstile: 'basura' } })
  expect(r2.status()).toBe(403)
  expect(queryLocal(`SELECT email FROM signups WHERE email IN ('${a}', '${b}')`)).toEqual([])
})

test('CSP abierta solo a challenges.cloudflare.com', async ({ request }) => {
  const csp = (await request.get('/')).headers()['content-security-policy']
  expect(csp).toContain('frame-src https://challenges.cloudflare.com')
  expect(csp.match(/https?:\/\/[^\s;']+/g)).toEqual(['https://challenges.cloudflare.com', 'https://challenges.cloudflare.com'])
})
