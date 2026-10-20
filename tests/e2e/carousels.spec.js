// PAUSA DE LOS CARRUSELES AUTOMÁTICOS (WCAG 2.2.2), en navegador real y con clic real.
//  · Móvil: S05 «El equipo» (autoplay de vida.js, cada 3,4 s).
//  · Escritorio: S11 «Automatizaciones» (autoplay de store.js, cada 2,6 s).
// Cada test comprueba primero que el carrusel AVANZA SOLO (si no, la pausa no probaría nada),
// luego que con la pausa se queda quieto más de dos ciclos, y que «reproducir» lo reanuda.
import { test, expect } from './fixtures.js'

const movil = (info) => info.project.name.startsWith('movil')

async function open(page, url, sectionId, track) {
  await page.goto(url)
  const sec = page.locator(`#${sectionId}`)
  // Hidratada de verdad (Astro quita `ssr` de la isla al hidratar): S11 escritorio monta su
  // autoplay en el ref de la isla.
  await sec.evaluate((el) => el.scrollIntoView({ block: 'start' }))
  await expect(page.locator(`astro-island:has(#${sectionId})`)).not.toHaveAttribute('ssr', '', { timeout: 10_000 })
  const hs = sec.locator(track)
  await hs.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  return { sec, hs }
}

const wait = (loc, ms) => loc.page().waitForTimeout(ms)
const x = (hs) => hs.evaluate((el) => Math.round(el.scrollLeft))

async function pausaYReanuda({ sec, hs }, labels, ciclo) {
  const btn = sec.getByRole('button', { name: labels.pause })
  await expect(btn).toBeVisible()
  await expect(btn).toHaveAttribute('aria-pressed', 'false')
  // 1) Sin pausa, avanza solo.
  const x0 = await x(hs)
  await expect.poll(() => x(hs), { timeout: ciclo * 3 }).not.toBe(x0)
  // 2) Pausa: el mismo botón pasa a «reproducir» y el carrusel no se mueve en > 2 ciclos.
  await btn.click()
  const play = sec.getByRole('button', { name: labels.play })
  await expect(play).toHaveAttribute('aria-pressed', 'true')
  await wait(hs, 900) // deja terminar el desplazamiento suave en curso
  const quieto = await x(hs)
  await wait(hs, ciclo * 2 + 1500)
  expect(await x(hs)).toBe(quieto)
  // 3) Reproducir: vuelve a avanzar.
  await play.click()
  await expect(sec.getByRole('button', { name: labels.pause })).toHaveAttribute('aria-pressed', 'false')
  await expect.poll(() => x(hs), { timeout: ciclo * 3 }).not.toBe(quieto)
}
const page_wait = (loc, ms) => loc.page().waitForTimeout(ms)

const ES = { pause: 'Pausar el carrusel', play: 'Reproducir el carrusel' }
const EN = { pause: 'Pause the carousel', play: 'Play the carousel' }

test('móvil · S05: el carrusel avanza solo y el botón lo pausa y lo reanuda', async ({ page }, info) => {
  test.skip(!movil(info), 'el carrusel automático de S05 solo existe en móvil')
  test.setTimeout(60_000)
  await pausaYReanuda(await open(page, '/', 'equipo', '.hs.only-m'), ES, 3400)
})

test('móvil · S05 en inglés: el botón habla inglés', async ({ page }, info) => {
  test.skip(!movil(info), 'el carrusel automático de S05 solo existe en móvil')
  test.setTimeout(60_000)
  await pausaYReanuda(await open(page, '/en/', 'equipo', '.hs.only-m'), EN, 3400)
})

test('escritorio · S11: el carrusel de automatizaciones se pausa y se reanuda', async ({ page }, info) => {
  test.skip(movil(info), 'el autoplay de S11 con su pausa propia es el de escritorio')
  test.setTimeout(60_000)
  await pausaYReanuda(await open(page, '/', 'automatizaciones', '.hs-d'), ES, 2600)
})

test('escritorio · S11 en inglés', async ({ page }, info) => {
  test.skip(movil(info), 'el autoplay de S11 con su pausa propia es el de escritorio')
  test.setTimeout(60_000)
  await pausaYReanuda(await open(page, '/en/', 'automatizaciones', '.hs-d'), EN, 2600)
})

test('móvil · S11: su carrusel también tiene pausa', async ({ page }, info) => {
  test.skip(!movil(info), 'carrusel móvil')
  test.setTimeout(60_000)
  await pausaYReanuda(await open(page, '/', 'automatizaciones', '.hs.only-m'), ES, 3400)
})

test('todo carrusel automático de la portada lleva su botón de pausa', async ({ page }, info) => {
  await page.goto('/')
  // Móvil: cada barra de flechas visible (.hsctl, una por carrusel de vida.js).
  // Escritorio: cada carrusel con autoplay (.hs-d) tiene su botón en la misma sección.
  const r = await page.evaluate((m) => {
    const vis = (e) => !!e.offsetParent
    if (m) { const bars = [...document.querySelectorAll('.hsctl')].filter(vis); return [bars.length, bars.filter((b) => b.querySelector('[data-hs-play="m"]')).length] }
    const tracks = [...document.querySelectorAll('.hs-d')].filter(vis); return [tracks.length, tracks.filter((t) => [...t.closest('section').querySelectorAll('[data-hs-play="d"]')].some(vis)).length]
  }, movil(info))
  expect(r[0]).toBeGreaterThan(0)
  expect(r[1]).toBe(r[0])
})

test('motion reducido: sin autoplay, así que sin botón de pausa', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('http://127.0.0.1:8787/')
  await page.waitForFunction(() => [...document.styleSheets].some((s) => /\/_s\/rest\./.test(s.href || '')))
  await expect(page.locator('.hs-play').first()).toBeHidden()
  await ctx.close()
})
