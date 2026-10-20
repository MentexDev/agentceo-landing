// T35 · adenda (Diego, 20-oct) en navegador real: acta S07 que no se corta y S03 nunca vacía.
import { test, expect, restCss } from './fixtures.js'

const movil = (info) => info.project.name.startsWith('movil')

test.describe('1 · acta (S07): alineada con el título y entera en pantalla', () => {
  for (const [w, h] of [[1280, 800], [1440, 900]]) {
    test(`${w}×${h}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } })
      const page = await ctx.newPage()
      await page.goto('http://127.0.0.1:8787/')
      await restCss(page)
      const r = await page.evaluate(() => {
        const card = document.querySelector('.minutes').parentElement, sec = card.closest('section')
        const t = sec.querySelector('h2').getBoundingClientRect(), c = card.getBoundingClientRect()
        const stage = sec.querySelector('[aria-hidden="true"][data-rv]').getBoundingClientRect()
        const header = document.querySelector('header').getBoundingClientRect().height
        return { dTop: Math.abs(c.top - t.top), cardH: c.height, cabe: innerHeight - header, oficinaBajoTexto: stage.top >= sec.querySelector('h2 + p, p').getBoundingClientRect().bottom - 2, oficinaIzq: stage.right <= c.left }
      })
      expect(r.dTop).toBeLessThanOrEqual(2) // borde superior de la tarjeta = el del título
      expect(r.cardH).toBeLessThan(r.cabe) // el acta entera cabe bajo el header
      expect(r.oficinaBajoTexto).toBe(true)
      expect(r.oficinaIzq).toBe(true)
      await ctx.close()
    })
  }
})

test.describe('2 · S03 «Así se ve tu empresa por dentro» nunca se ve vacía', () => {
  test('el HTML del servidor ya trae conversación (sin JS)', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false })
    const page = await ctx.newPage()
    await page.goto('http://127.0.0.1:8787/')
    await expect(page.locator('[data-appdemo] .ad-earlier')).toContainText('12 ventas')
    await ctx.close()
  })

  test('al hacer scroll hay contenido visible al instante (antes de que arranque la escena)', async ({ page }, info) => {
    await page.goto(info.project.name.startsWith('movil') ? '/en/' : '/')
    await restCss(page)
    const demo = page.locator('[data-appdemo]')
    await demo.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    const earlier = demo.locator('.ad-earlier')
    await expect(earlier).toBeVisible({ timeout: 500 })
    expect((await earlier.innerText()).trim().length).toBeGreaterThan(40)
    // Y la escena animada se añade DEBAJO, sin vaciar la ventana.
    await expect(demo.locator('.ad-bubble-user')).toBeVisible({ timeout: 6000 })
    await expect(earlier).toBeVisible()
  })
})
