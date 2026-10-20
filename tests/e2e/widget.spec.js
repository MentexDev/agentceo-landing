// FASE W · widget «Tu CEO» en navegador real contra /api/chat (modo stub, sin LLM).
import { test, expect } from './fixtures.js'
import { queryLocal, testEmail } from './db.js'

const openChat = async (page) => {
  await page.locator('[data-chat-launch]').click()
  const panel = page.locator('[data-chat-panel]')
  await expect(panel).toBeVisible()
  // Espera a que termine la animación de entrada (la hoja móvil sube desde abajo).
  await panel.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)))
  return panel
}

test('el lanzador dice que es IA y abre el panel con el foco en la pregunta', async ({ page }) => {
  await page.goto('/')
  const launch = page.locator('[data-chat-launch]')
  await expect(launch.locator('.cw-ai-badge')).toHaveText('IA')
  // T32: el subtítulo del lanzador es UNA línea (en móvil el texto va oculto para lectores).
  const oneLine = (loc) => loc.evaluate((e) => { const cs = getComputedStyle(e); return e.getBoundingClientRect().height <= parseFloat(cs.lineHeight || '0') * 1.4 || e.getBoundingClientRect().height <= parseFloat(cs.fontSize) * 1.6 })
  await expect(launch.locator('.cw-launch-s')).toHaveText('Asistente de IA')
  if (await launch.locator('.cw-launch-s').isVisible()) expect(await oneLine(launch.locator('.cw-launch-s'))).toBe(true)
  const panel = await openChat(page)
  await expect(launch).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-chat-input]')).toBeFocused()
  // SB 1001: la cabecera y el primer mensaje dicen que es una IA.
  await expect(panel.locator('#cw-title')).toContainText('IA')
  await expect(panel.locator('.cw-sub')).toHaveText('Asistente de IA')
  expect(await oneLine(panel.locator('.cw-sub'))).toBe(true)
  await expect(panel.locator('.cw-bot').first()).toContainText('no una persona')
})

test('pregunta sugerida → respuesta del sitio en streaming, con su procedencia y chips', async ({ page }) => {
  await page.goto('/')
  const panel = await openChat(page)
  await panel.locator('[data-chat-suggest] .cw-chip', { hasText: '¿Cuánto cuesta?' }).click()
  const answer = panel.locator('.cw-bot').last()
  await expect(answer).toContainText('Arranque es gratis')
  await expect(answer.locator('.cw-matched')).toContainText('¿Cuánto cuesta?')
  await expect(panel.locator('.cw-chips-row .cw-chip').first()).toBeVisible()
  // El precio lleva a la lista dentro del chat.
  await expect(panel.locator('.cw-card form')).toBeVisible()
})

test('escribir con el teclado: «¿eres humano?» → dice que es una IA', async ({ page }) => {
  await page.goto('/')
  const panel = await openChat(page)
  await page.keyboard.type('¿eres humano?', { delay: 10 })
  await page.keyboard.press('Enter')
  await expect(panel.locator('.cw-bot').last()).toContainText('inteligencia artificial')
  await expect(panel.locator('[data-chat-announce]')).toContainText('inteligencia artificial')
})

test('lo que no está en la web → lo admite y ofrece la lista; apuntarse desde el chat guarda en D1', async ({ page }, info) => {
  const email = testEmail('widget', info)
  await page.goto('/')
  await page.waitForTimeout(1300)
  const panel = await openChat(page)
  await page.locator('[data-chat-input]').fill('¿cuál es la capital de Francia?')
  await page.locator('[data-chat-send]').click()
  await expect(panel.locator('.cw-bot').last()).toContainText('prefiero no inventarme')
  const card = panel.locator('.cw-card form')
  await card.locator('input[type=email]').fill(email)
  await card.locator('button[type=submit]').click()
  await expect(card.locator('[data-wl-ok]')).toBeVisible()
  await expect(panel.locator('.cw-bot').last()).toContainText('Te guardé el lugar')
  // El modal NO se abre encima del chat.
  await expect(page.locator('dialog[data-wl-modal]')).toBeHidden()
  const [row] = queryLocal(`SELECT source FROM signups WHERE email = '${email}'`)
  expect(row.source).toBe('widget')
})

test('la conversación sobrevive a recargar; «Nueva conversación» la borra', async ({ page }) => {
  await page.goto('/')
  let panel = await openChat(page)
  await panel.locator('[data-chat-suggest] .cw-chip').first().click()
  await expect(panel.locator('.cw-user')).toHaveCount(1)
  await expect(panel.locator('.cw-chips-row')).toBeVisible() // respuesta completa
  await page.reload()
  panel = await openChat(page)
  await expect(panel.locator('.cw-user')).toHaveCount(1)
  await panel.locator('[data-chat-reset]').click()
  await expect(panel.locator('.cw-user')).toHaveCount(0)
  await expect(panel.locator('[data-chat-suggest]')).toBeVisible()
})

test('recargar A MITAD de una respuesta no borra la pregunta del historial', async ({ page }) => {
  await page.goto('/')
  let panel = await openChat(page)
  await panel.locator('[data-chat-suggest] .cw-chip').first().click()
  await expect(panel.locator('.cw-user')).toHaveCount(1)
  await page.reload() // sin esperar a que termine el stream
  panel = await openChat(page)
  await expect(panel.locator('.cw-user')).toHaveCount(1)
  // Si la respuesta se perdió, «Reintentar» la recupera sin duplicar la pregunta.
  const retry = panel.locator('.cw-retry')
  if (await retry.count()) {
    await retry.click()
    await expect(panel.locator('.cw-chips-row')).toBeVisible()
  }
  await expect(panel.locator('.cw-user')).toHaveCount(1)
})

test('Escape cierra y devuelve el foco al lanzador', async ({ page }) => {
  await page.goto('/')
  await openChat(page)
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-chat-panel]')).toBeHidden()
  await expect(page.locator('[data-chat-launch]')).toBeFocused()
})

test('escritorio: compacto → grande → pantalla completa', async ({ page, isMobile }) => {
  test.skip(isMobile, 'en móvil es una hoja inferior')
  await page.goto('/')
  const panel = await openChat(page)
  const w0 = (await panel.boundingBox()).width
  await panel.locator('[data-chat-size]').click()
  await expect(panel).toHaveAttribute('data-size', 'large')
  await expect.poll(async () => (await panel.boundingBox()).width).toBeGreaterThan(w0 + 200)
  await panel.locator('[data-chat-full]').click()
  await expect(panel).toHaveAttribute('data-size', 'full')
  await expect.poll(async () => (await panel.boundingBox()).width).toBe(1440)
})

test('móvil: hoja inferior que se cierra arrastrando hacia abajo', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'solo móvil')
  await page.goto('/')
  const panel = await openChat(page)
  const box = await panel.boundingBox()
  const vp = page.viewportSize()
  expect(Math.round(box.x)).toBe(0)
  expect(Math.round(box.width)).toBe(vp.width)
  expect(Math.round(box.y + box.height)).toBeGreaterThanOrEqual(vp.height - 2)
  const g = await page.locator('[data-chat-grab]').boundingBox()
  await page.mouse.move(g.x + g.width / 2, g.y + g.height / 2)
  await page.mouse.down()
  await page.mouse.move(g.x + g.width / 2, g.y + 220, { steps: 8 })
  await page.mouse.up()
  await expect(panel).toBeHidden()
})

test('en inglés todo el widget está en inglés y dice que es una IA', async ({ page }) => {
  await page.goto('/en/')
  await expect(page.locator('[data-chat-launch] .cw-ai-badge')).toHaveText('AI')
  await expect(page.locator('[data-chat-launch] .cw-launch-s')).toHaveText('AI assistant')
  const panel = await openChat(page)
  await expect(panel.locator('.cw-sub')).toHaveText('AI assistant')
  await panel.locator('[data-chat-suggest] .cw-chip').first().click()
  await expect(panel.locator('.cw-bot').last()).not.toBeEmpty()
  await expect(panel.locator('.cw-bot').first()).toContainText('not a person')
})

test('el widget no llama a ningún tercero (ni LLM ni analítica)', async ({ page }) => {
  const external = []
  page.on('request', (r) => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname)) external.push(r.url()) })
  const events = []
  await page.exposeFunction('__ev', (e) => events.push(e))
  await page.addInitScript(() => addEventListener('ac:track', (e) => window.__ev(e.detail.name)))
  await page.goto('/')
  const panel = await openChat(page)
  await panel.locator('[data-chat-suggest] .cw-chip').first().click()
  await expect(panel.locator('.cw-chips-row')).toBeVisible() // fin del stream
  expect(external).toEqual([])
  await expect.poll(() => events).toEqual(expect.arrayContaining(['chat_open', 'chat_message', 'chat_answer']))
})
