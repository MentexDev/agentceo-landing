// FASE 3 · portada portada del prototipo: interacción real (clics, teclado), sin errores,
// con las islas hidratadas y el contenido disponible sin JS.
import { test, expect } from './fixtures.js'

const sec = (page, id) => page.locator(`section#${id}`)
// Desplaza la página por tramos (WebKit móvil no tiene rueda): es preparación, no la interacción bajo prueba.
// Desplazamiento INSTANTÁNEO: con scroll-behavior: smooth, un scrollTo cada 50 ms interrumpía al
// anterior y el recorrido se saltaba secciones (islas sin hidratar en ~20 % de las pasadas en WebKit).
const scrollAll = (page) => page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 90)) } })
// Centra el elemento antes de pulsarlo (que no quede bajo la barra fija de la lista ni el lanzador del chat).
const tap = async (loc) => { await loc.evaluate((el) => el.scrollIntoView({ block: 'center' })); await loc.click() }

test('todas las islas se hidratan sin errores al recorrer la página', async ({ page }) => {
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto('/')
  await scrollAll(page)
  await expect.poll(() => page.locator('astro-island[ssr]').count(), { timeout: 10_000 }).toBe(0)
  expect(errors).toEqual([])
})

test('S04 · elegir «Ya tengo negocio» abre ese camino de la entrevista', async ({ page }) => {
  await page.goto('/#empieza')
  const s = sec(page, 'empieza')
  await s.scrollIntoViewIfNeeded()
  await tap(s.getByRole('button', { name: 'Ya tengo negocio' }).first())
  await expect(s.getByText('Pásame tu web y la reviso mientras hablamos.').first()).toBeVisible()
})

test('S09 · aprobar y rechazar permisos actualiza los contadores', async ({ page }) => {
  await page.goto('/#permiso')
  const s = sec(page, 'permiso')
  await s.scrollIntoViewIfNeeded()
  const before = await s.innerText()
  expect(before).toMatch(/Aprobados:\s*0/)
  await tap(s.getByRole('button', { name: /Sí, hazlo/ }).first())
  await expect(s).toContainText(/Aprobados:\s*1/)
  await tap(s.getByRole('button', { name: /Ahora no/ }).first())
  await expect(s).toContainText(/Rechazados:\s*1/)
})

test('S11 · encender una automatización mueve el medidor', async ({ page }) => {
  await page.goto('/#automatizaciones')
  const s = sec(page, 'automatizaciones')
  await s.scrollIntoViewIfNeeded()
  await expect(s).toContainText(/1\s*de 9 automatizaciones/)
  await tap(s.getByRole('switch').nth(1))
  await expect(s).toContainText(/2\s*de 9 automatizaciones/)
})

test('S18 · FAQ: una respuesta a la vez, con aria-expanded y todas en el HTML', async ({ page }) => {
  await page.goto('/#faq')
  const s = page.locator('section#faq')
  await s.scrollIntoViewIfNeeded()
  const q = s.getByRole('button', { name: '¿Cuánto cuesta?' })
  await tap(q)
  await expect(q).toHaveAttribute('aria-expanded', 'true')
  await expect(s.locator(`#${await q.getAttribute('aria-controls')}`)).toBeVisible()
  await expect(s.locator('.ansb:visible')).toHaveCount(1)
  // Todas las respuestas existen en el DOM (SEO/LLM), aunque solo una se vea.
  expect(await s.locator('.ansb').count()).toBeGreaterThanOrEqual(15)
})

test('S02 · tocar a la mascota cambia su mensaje (sin hidratar el hero)', async ({ page }) => {
  await page.goto('/')
  const msg = page.locator('section#top [data-ceo-msg]:visible').first()
  const t0 = await msg.innerText()
  await tap(page.locator('section#top [data-ceo-tap]:visible').first())
  await expect(msg).not.toHaveText(t0)
})

test('la portada declara FAQPage, Organization y SoftwareApplication en JSON-LD', async ({ page }) => {
  await page.goto('/')
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent())
  const types = ld['@graph'].map((n) => n['@type'])
  expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage']))
  const faq = ld['@graph'].find((n) => n['@type'] === 'FAQPage')
  expect(faq.mainEntity.length).toBeGreaterThanOrEqual(15)
})

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('el contenido se ve (nada queda en opacidad 0) y todas las respuestas del FAQ se leen', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    // La entrada del hero es una animación CSS (también sin JS): se mira el estado FINAL.
    await page.waitForTimeout(1800)
    const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-rv], .in')].filter((e) => e.getClientRects().length && getComputedStyle(e).opacity === '0').length)
    expect(hidden).toBe(0)
    await expect(page.locator('section#faq .ansb').nth(5)).toBeVisible()
  })
})

test('con motion reducido no hay animaciones en marcha', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('http://127.0.0.1:8787/')
  await page.waitForTimeout(500)
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)
  expect(running).toBe(0)
  await ctx.close()
})

test('sin scroll horizontal en ningún ancho', async ({ page }) => {
  await page.goto('/')
  await scrollAll(page)
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(over).toBeLessThanOrEqual(0)
})
