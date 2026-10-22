// AJUSTES T33 (Diego, 20-oct) en navegador real: divisores, titulares, widget sobre el acta y
// widget expandido por encima del header. (El proveedor del chat lo vigilan tests/worker.)
import { test, expect, restCss } from './fixtures.js'

const movil = (info) => info.project.name.startsWith('movil')

test('1 · ningún divisor de sección es un filete negro a todo el ancho', async ({ page }) => {
  await page.goto('/')
  await restCss(page)
  const malos = await page.evaluate(() => {
    const out = []
    for (const s of document.querySelectorAll('main section')) {
      const cs = getComputedStyle(s)
      if (parseFloat(cs.borderTopWidth) >= 1 && cs.borderTopStyle !== 'none') out.push(`${s.id || s.className}: border-top ${cs.borderTopWidth} ${cs.borderTopColor}`)
      const b = getComputedStyle(s, '::before')
      if (b.content !== 'none' && parseFloat(b.height) <= 2 && b.backgroundImage === 'none' && parseFloat(b.width) >= innerWidth - 2) out.push(`${s.id || s.className}: ::before a todo el ancho`)
    }
    return out
  })
  expect(malos).toEqual([])
  // El de bajo el hero (S03) es la línea sutil: 1 px, degradado y metido en el contenedor.
  const d = await page.locator('.adsec').evaluate((s) => { const b = getComputedStyle(s, '::before'); return { h: b.height, img: b.backgroundImage, left: parseFloat(b.left) } })
  expect(d.h).toBe('1px')
  expect(d.img).toContain('linear-gradient')
  expect(d.left).toBeGreaterThan(0)
})

test('2 · titulares (T35): Instrument Serif a 400, sin negrita sintética, con trazo bajo el relleno', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const r = await page.evaluate(() => {
    const el = document.querySelector('section#top h1'), h1 = getComputedStyle(el)
    const fs = parseFloat(h1.fontSize)
    return { fam: h1.fontFamily, w: +h1.fontWeight, synth: h1.fontSynthesisWeight || h1.fontSynthesis, stroke: parseFloat(h1.webkitTextStrokeWidth || '0') / fs, order: h1.paintOrder, track: parseFloat(h1.letterSpacing) / fs, loaded: document.fonts.check(`italic 400 40px "Instrument Serif"`) && document.fonts.check(`400 40px "Instrument Serif"`) }
  })
  expect(r.fam).toMatch(/^"?Instrument Serif/)
  expect(r.w).toBe(400)
  expect(r.synth).toMatch(/none/)
  // Trazo medido (≈ 0,035 em) pintado DEBAJO del relleno, y el interletrado lo compensa (−0,02 + 0,035 em).
  expect(r.stroke).toBeGreaterThan(0.03)
  expect(r.stroke).toBeLessThan(0.04)
  expect(r.order).toMatch(/^stroke/)
  expect(r.track).toBeGreaterThan(0.01)
  expect(r.loaded).toBe(true)
})

test('4 · el lanzador y su burbuja no tapan la tarjeta del acta', async ({ page }, info) => {
  test.skip(movil(info), 'escritorio: en móvil el acta ocupa todo el ancho')
  test.setTimeout(30_000)
  await page.goto('/')
  await restCss(page)
  await page.waitForTimeout(9000) // la burbuja «¿Tienes una pregunta?» aparece a los 8 s
  for (const block of ['center', 'end']) {
    await page.locator('.minutes').evaluate((m, b) => m.parentElement.scrollIntoView({ block: b, behavior: 'instant' }), block)
    await expect.poll(() => page.evaluate(() => {
      const c = document.querySelector('.minutes').parentElement.getBoundingClientRect()
      const area = (e) => { if (!e || getComputedStyle(e).display === 'none' || e.hidden) return 0; const r = e.getBoundingClientRect(); return Math.max(0, Math.min(c.right, r.right) - Math.max(c.left, r.left)) * Math.max(0, Math.min(c.bottom, r.bottom) - Math.max(c.top, r.top)) }
      return area(document.querySelector('.cw-launch')) + area(document.querySelector('.cw-tease'))
    }), { timeout: 3000 }).toBe(0)
  }
})

test.describe('5 · widget expandido por encima del header', () => {
  // El botón de cerrar se ve y recibe el clic de verdad (nada encima).
  const cerrarLibre = (page) => page.evaluate(() => {
    const c = document.querySelector('[data-chat-close]'); const b = c.getBoundingClientRect()
    return b.top >= 0 && c.contains(document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2))
  })
  const abrirExpandido = async (page, info) => {
    await page.evaluate(() => scrollTo(0, 700)) // header sticky visible encima
    await page.locator('[data-chat-launch]').click()
    const panel = page.locator('#cw-panel')
    await expect(panel).toBeVisible()
    // Escritorio: pantalla completa (el caso del bug). Móvil: la hoja ya es el tamaño expandido.
    // (El panel recuerda su tamaño al reabrirse: solo se pulsa si aún no está a pantalla completa.)
    if (!movil(info)) {
      if ((await panel.getAttribute('data-size')) !== 'full') await page.locator('[data-chat-full]').click()
      await expect(panel).toHaveAttribute('data-size', 'full')
    }
    // Tras la animación de entrada (la hoja móvil sube desde abajo), el cerrar queda libre.
    await expect.poll(() => cerrarLibre(page), { timeout: 3000 }).toBe(true)
    return panel
  }

  test('expandir y cerrar con el botón; expandir y cerrar con Esc', async ({ page }, info) => {
    await page.goto('/')
    let panel = await abrirExpandido(page, info)
    await page.locator('[data-chat-close]').click()
    await expect(panel).toBeHidden()
    panel = await abrirExpandido(page, info)
    await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()
  })

  test('móvil en horizontal: la hoja cubre el header y se cierra', async ({ browser }, info) => {
    test.skip(!movil(info), 'caso móvil')
    const ctx = await browser.newContext({ baseURL: test.info().project.use.baseURL, locale: 'es-ES', viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true })
    const page = await ctx.newPage()
    await page.goto('/')
    await page.evaluate(() => scrollTo(0, 700))
    await page.locator('[data-chat-launch]').click()
    await expect(page.locator('#cw-panel')).toBeVisible()
    await expect.poll(() => cerrarLibre(page), { timeout: 3000 }).toBe(true)
    await page.locator('[data-chat-close]').click()
    await expect(page.locator('#cw-panel')).toBeHidden()
    await ctx.close()
  })
})
