// LA FORJA (S13 · T35 adenda, punto 3, Diego: «un prototipo real, pulido y bonito, no un
// placeholder»). Para cada tipo, la vista previa final muestra un producto de verdad de la marca de
// ejemplo «Lúa» (no bloques grises), se construye con la animación del prototipo y, con movimiento
// reducido, aparece completa al instante.
import { test, expect, restCss } from './fixtures.js'

// [botón del tipo, textos que el producto final DEBE mostrar]
const ES = [
  ['Landing page', ['Ver la colección', 'Suéter Brisa', '$42']],
  ['Sitio web', ['Quiénes somos', 'Conócenos', 'Asesoría de estilo']],
  ['Tienda', ['Carrito', 'Añadir', 'Pagar']],
  ['Aplicación web', ['Reserva tu asesoría', '11:30', 'Confirmar cita']],
  ['App móvil', ['¡Nueva oferta!', 'Hola, Ana', '$34']],
  ['Herramienta interna', ['Pedidos de hoy', '#1048', 'Turnos']],
]
const EN = [
  ['Landing page', ['Shop the collection', 'Brisa Sweater']],
  ['Store', ['Cart', 'Checkout']],
  ['Mobile app', ['New deal!', 'Hi, Ana']],
]

async function abrir(page, url) {
  await page.goto(url)
  await restCss(page)
  const sec = page.locator('#forja')
  await sec.evaluate((el) => el.scrollIntoView({ block: 'start' }))
  await expect(page.locator('astro-island:has(#forja)')).not.toHaveAttribute('ssr', '', { timeout: 20_000 })
  return sec
}
const vista = (sec) => sec.locator('[data-forja]').filter({ visible: true }).first()

test('movimiento reducido: los 6 tipos muestran su producto real al instante (es)', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  const sec = await abrir(page, 'http://127.0.0.1:8787/')
  for (const [k, [tipo, textos]] of ES.entries()) {
    await sec.getByRole('button', { name: tipo, exact: true }).click()
    const v = vista(sec)
    await expect(v).toHaveAttribute('data-forja', String(k))
    await expect(v).toHaveAttribute('role', 'img')
    await expect(v).toContainText(/lúa/i)
    for (const t of textos) await expect(v).toContainText(t)
    // Estado final directo: ningún bloque animándose ni transparente.
    const fb = await v.locator('.fb').evaluateAll((els) => els.map((e) => `${getComputedStyle(e).animationName}|${getComputedStyle(e).opacity}`))
    expect(fb.length).toBeGreaterThan(0) // la app móvil se construye como un solo bloque (el teléfono)
    expect(new Set(fb)).toEqual(new Set(['none|1']))
  }
  await ctx.close()
})

test('en inglés, el producto final habla inglés', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  const sec = await abrir(page, 'http://127.0.0.1:8787/en/')
  for (const [tipo, textos] of EN) {
    await sec.getByRole('button', { name: tipo, exact: true }).click()
    for (const t of textos) await expect(vista(sec)).toContainText(t)
  }
  await ctx.close()
})

test('se construye con la animación del prototipo y queda completo', async ({ page }) => {
  test.setTimeout(45_000)
  const sec = await abrir(page, '/')
  await sec.getByRole('button', { name: 'Tienda', exact: true }).click()
  const v = vista(sec)
  await expect(v).toHaveAttribute('data-forja', '2')
  // Al empezar, los bloques aún no están (se van construyendo)…
  const al0 = await v.locator('.fb').evaluateAll((els) => els.filter((e) => +getComputedStyle(e).opacity > 0.99).length)
  expect(al0).toBe(0)
  // …y al terminar están todos, con el producto real a la vista.
  await expect.poll(() => v.locator('.fb').evaluateAll((els) => els.every((e) => +getComputedStyle(e).opacity > 0.99)), { timeout: 15_000 }).toBe(true)
  await expect(v).toContainText('Pagar')
  // Nunca se desborda de su ventana.
  const ov = await v.locator('.fj').evaluate((e) => [e.scrollHeight - e.clientHeight, e.scrollWidth - e.clientWidth])
  expect(ov).toEqual([0, 0])
})
