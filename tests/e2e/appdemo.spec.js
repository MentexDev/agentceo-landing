// FASE S03 · la app recreada, en navegador real.
import { test, expect } from './fixtures.js'

const open = async (page, url = '/') => {
  await page.goto(url)
  const demo = page.locator('[data-appdemo]')
  await demo.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await expect(demo.locator('.ad-tab').first()).toBeVisible()
  // Hidratada de verdad: Astro quita el atributo `ssr` de la isla al hidratar (el HTML del
  // servidor ya trae el panel: esperar a que se vea NO basta; medido: clic sobre HTML inerte).
  await expect(page.locator('astro-island:has([data-appdemo])')).not.toHaveAttribute('ssr', '', { timeout: 10_000 })
  return demo
}

test('chat: el CEO piensa, usa herramientas (con créditos) y responde en streaming', async ({ page }) => {
  const demo = await open(page)
  await demo.getByRole('tab', { name: 'Chat con tu CEO' }).click()
  await expect(demo.locator('.ad-bubble-user')).toBeVisible({ timeout: 6000 })
  await expect(demo.locator('.ad-steps li')).toHaveCount(3, { timeout: 8000 })
  await expect(demo.locator('.ad-cost').first()).toContainText('créditos')
  await expect(demo.locator('.ad-bubble-agent')).toContainText('Necesita tu firma', { timeout: 10000 })
  await expect(demo.locator('.ad-chips .ad-chip')).toHaveCount(2)
})

test('aprobaciones: una solicitud se firma y bajan las pendientes', async ({ page }) => {
  const demo = await open(page)
  await demo.getByRole('tab', { name: 'Aprobaciones' }).click()
  await expect(demo.locator('.ad-count')).toHaveText('3 pendientes')
  await expect(demo.locator('.ad-signed')).toContainText('Firmada', { timeout: 5000 })
  await expect(demo.locator('.ad-count')).toHaveText('2 pendientes')
})

test('ventas: entra un pedido nuevo y las métricas suben', async ({ page }) => {
  const demo = await open(page)
  await demo.getByRole('tab', { name: 'Ventas' }).click()
  await expect(demo.locator('.ad-tbl tbody tr')).toHaveCount(5, { timeout: 5000 })
  await expect(demo.locator('.ad-kpi').nth(1).locator('strong')).toHaveText('74', { timeout: 5000 })
})

test('teclado: las flechas mueven entre pestañas (patrón tablist)', async ({ page, isMobile }) => {
  test.skip(isMobile, 'teclado: escritorio')
  const demo = await open(page)
  const first = demo.getByRole('tab', { name: 'Chat con tu CEO' })
  await first.click()
  await page.keyboard.press('ArrowRight')
  const second = demo.getByRole('tab', { name: 'Aprobaciones' })
  await expect(second).toBeFocused()
  await expect(second).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('End')
  await expect(demo.getByRole('tab', { name: 'Clientes' })).toHaveAttribute('aria-selected', 'true')
})

test('el interruptor Empresa lleva al Panel de Comando y el selector de marca se despliega', async ({ page }) => {
  const demo = await open(page)
  await demo.locator('.ad-switch button').nth(1).click()
  await expect(demo.getByRole('tab', { name: 'Panel de Comando' })).toHaveAttribute('aria-selected', 'true')
  await expect(demo.locator('.ad-url')).toContainText('/admin/company')
  await demo.locator('.ad-brandbtn').click()
  await expect(demo.getByRole('listbox')).toBeVisible()
  await expect(demo.getByRole('option', { name: /Lúa Casa/ })).toBeVisible()
})

test('pausa: el recorrido automático avanza solo y el botón lo detiene', async ({ page }) => {
  test.setTimeout(60_000)
  const demo = await open(page)
  const btn = demo.locator('.ad-play')
  // 1) Sin pausa, avanza solo (si no, este test no probaría nada).
  const first = await demo.locator('[role=tab][aria-selected=true]').innerText()
  await expect(demo.locator('[role=tab][aria-selected=true]')).not.toHaveText(first, { timeout: 14_000 })
  // 2) Con pausa, se queda quieto más que la escena más larga.
  await expect(btn).toHaveAttribute('aria-pressed', 'false')
  await btn.click()
  await expect(btn).toHaveAttribute('aria-pressed', 'true')
  const sel = await demo.locator('[role=tab][aria-selected=true]').innerText()
  await page.waitForTimeout(12_500)
  await expect(demo.locator('[role=tab][aria-selected=true]')).toHaveText(sel)
})

test('motion reducido: estados finales al instante y sin recorrido automático', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('http://127.0.0.1:8787/')
  const demo = page.locator('[data-appdemo]')
  await demo.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await expect(demo.locator('.ad-bubble-agent')).toContainText('Necesita tu firma')
  await expect(demo.locator('.ad-play')).toHaveCount(0)
  await demo.getByRole('tab', { name: 'Aprobaciones' }).click()
  await expect(demo.locator('.ad-signed')).toBeVisible()
  await ctx.close()
})

test('en inglés, sin llamar a nada externo', async ({ page }) => {
  const external = []
  page.on('request', (r) => { const h = new URL(r.url()).hostname; if (!['127.0.0.1', 'localhost'].includes(h)) external.push(r.url()) })
  const demo = await open(page, '/en/')
  await demo.getByRole('tab', { name: 'Approvals' }).click()
  await expect(demo.locator('.ad-ph1 h3')).toHaveText('Waiting for your sign-off')
  await expect(demo.locator('.ad-signed')).toContainText('Signed', { timeout: 5000 })
  expect(external).toEqual([])
})
