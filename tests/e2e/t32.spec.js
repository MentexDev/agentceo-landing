// AJUSTES T32 (Diego, 20-oct) en navegador real: hero, tipografía, footer, expertos, acta y Forja.
// (El subtítulo del widget en una línea lo vigila widget.spec.js; el modo live, tests/worker.)
import { test, expect, restCss } from './fixtures.js'

const movil = (info) => info.project.name.startsWith('movil')

test.describe('1 · hero', () => {
  for (const [url, note] of [['/', 'Abrimos por grupos'], ['/en/', 'We open in waves']]) {
    test(`la nota de la lista sale UNA vez bajo el formulario (${url})`, async ({ page }) => {
      await page.goto(url)
      await expect(page.locator('section#top').getByText(note)).toHaveCount(1)
    })
  }

  test('la órbita no cruza el divisor: el hero recorta y el divisor es fino y alineado', async ({ page }) => {
    await page.goto('/')
    const r = await page.evaluate(() => {
      const top = document.querySelector('section#top'), sec = document.querySelector('.adsec')
      const before = getComputedStyle(sec, '::before')
      return { clip: getComputedStyle(top).overflowY, border: getComputedStyle(sec).borderTopWidth, h: before.height, left: parseFloat(before.left) }
    })
    expect(r.clip).toBe('clip')
    expect(r.border).toBe('0px')
    expect(r.h).toBe('1px')
    expect(r.left).toBeGreaterThan(0)
  })
})

test('4 · tipografía: cuerpo a 450 en gris más oscuro (la serif la vigila t33.spec.js)', async ({ page }) => {
  await page.goto('/')
  const r = await page.evaluate(() => {
    const p = getComputedStyle(document.querySelector('section#top p.in'))
    return { weight: p.fontWeight, color: p.color }
  })
  expect(r.weight).toBe('450')
  expect(r.color).toBe('rgb(78, 76, 71)')
})

test('5 · footer (T35 · adenda): 5 columnas equilibradas; Legal = 5 clave + «Ver todo» al índice; nada de torres', async ({ page }, info) => {
  await page.goto('/')
  const r = await page.locator('footer nav.ft-cols').evaluate((nav) => {
    const cols = [...nav.querySelectorAll('[data-ft-col]')]
    const legal = nav.querySelector('[data-ft-col="legal"]')
    return {
      keys: cols.map((c) => c.dataset.ftCol),
      tops: new Set(cols.map((c) => Math.round(c.getBoundingClientRect().top))).size,
      maxH: Math.max(...cols.map((c) => c.querySelector('ul').getBoundingClientRect().height)),
      legalDocs: [...legal.querySelectorAll('a:not(.ft-more)')].map((a) => a.getAttribute('href')),
      verTodo: legal.querySelector('a.ft-more')?.getAttribute('href'),
    }
  })
  expect(r.keys).toEqual(['producto', 'recursos', 'empresa', 'legal', 'confianza'])
  expect(r.legalDocs).toHaveLength(5)
  for (const h of r.legalDocs) expect(h).toMatch(/^\/legal\/[a-z-]+$/)
  expect(r.verTodo).toBe('/legal/')
  // Antes (T32): una columna de 14 enlaces (~500 px). Ahora ninguna pasa de 6 enlaces.
  expect(r.maxH).toBeLessThan(movil(info) ? 300 : 260)
  // Escritorio: las 5 columnas en UNA fila. Móvil: como mucho 3 filas (2 + 2 + Confianza a lo ancho).
  expect(r.tops).toBeLessThanOrEqual(movil(info) ? 3 : 1)
})

test.describe('6 · expertos', () => {
  for (const [url, first] of [['/', '¡Hola, jefe! Ya conté todo el almacén.'], ['/en/', "Hi, boss! I've counted the whole stockroom."]]) {
    test(`clics repetidos rotan frases propias y se anuncian (${url})`, async ({ page }) => {
      await page.goto(url)
      await restCss(page)
      const sec = page.locator('#equipo')
      await sec.evaluate((el) => el.scrollIntoView({ block: 'start' }))
      await expect(page.locator('astro-island:has(#equipo)')).not.toHaveAttribute('ssr', '', { timeout: 20_000 })
      const card = sec.locator('button.agent').filter({ visible: true }).first()
      const bubble = card.locator('.hi')
      const live = sec.locator('[aria-live="polite"]')
      const said = []
      for (let i = 0; i < 3; i++) {
        await card.click()
        await expect(card).toHaveClass(/poked/)
        said.push(await bubble.innerText())
        await expect(live).toHaveText(said.at(-1))
      }
      expect(said[0]).toBe(first)
      expect(new Set(said).size).toBe(3)
      expect(said.join(' ')).not.toMatch(/^(¡Hola, jefe!|Hi, boss!)$/)
    })
  }
})

test.describe('7 · acta de la reunión', () => {
  test('al final aparece animada, con tareas por agente, SIN mover la página', async ({ page }) => {
    test.setTimeout(30_000)
    await page.goto('/')
    await restCss(page)
    const rows = page.locator('.minutes-row')
    const say = page.locator('.minutes-say')
    await rows.first().evaluate((el) => el.closest('[data-rv]').scrollIntoView({ block: 'center' }))
    // El final de la sección (y con él todo lo de debajo) no puede moverse cuando el acta se rellena (medido: crecer en altura la
    // empujaba ~300 px y sacaba de la vista el carrusel de S11).
    const nextTop = () => page.evaluate(() => Math.round(document.querySelector('.minutes').closest('section').getBoundingClientRect().bottom + scrollY))
    const antes = await nextTop()
    await page.waitForTimeout(600)
    expect(await say.first().evaluate((e) => +getComputedStyle(e).opacity)).toBeLessThan(0.5)
    await expect(rows).toHaveCount(4)
    await expect.poll(() => say.last().evaluate((e) => +getComputedStyle(e).opacity), { timeout: 10_000 }).toBe(1)
    expect(await nextTop()).toBe(antes)
    await expect(rows.first()).toContainText('Yo me encargo de')
    await expect(rows.first()).toContainText('Encargado de inventario')
  })

  test('con motion reducido aparece sin animación', async ({ browser }) => {
    const ctx = await browser.newContext({ baseURL: test.info().project.use.baseURL, locale: 'es-ES', reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.goto('/en/')
    await page.waitForFunction(() => [...document.styleSheets].some((s) => /\/_s\/rest\./.test(s.href || '')))
    const rows = page.locator('.minutes-row')
    expect(await page.locator('.minutes-say').evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName + '|' + getComputedStyle(e).opacity))).toEqual(Array(4).fill('none|1'))
    await expect(rows.first()).toContainText("I'll take care of")
    await ctx.close()
  })
})

test('8 · La Forja: la pantalla del computador es más alta', async ({ page }, info) => {
  await page.goto('/')
  await restCss(page)
  const h = await page.locator('#forja .fwin').filter({ visible: true }).first().evaluate((e) => e.getBoundingClientRect().height)
  // Medido el 20-oct: antes 388 px (escritorio 1440) y 615 px (Pixel 7); ahora 548 y 735.
  expect(h).toBeGreaterThan(movil(info) ? 640 : 520)
})
