// T58b · tope GLOBAL de respuestas live del chat, en navegador real. Solo con playwright.chatcap.config.js
// (Worker con CHAT_DAILY_GLOBAL_CAP:0); en la suite normal se salta.
import { test, expect } from './fixtures.js'

test.skip(!process.env.E2E_CHATCAP, 'solo con playwright.chatcap.config.js')

const openChat = async (page) => {
  await page.locator('[data-chat-launch]').click()
  const panel = page.locator('[data-chat-panel]')
  await expect(panel).toBeVisible()
  await panel.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)))
  return panel
}

for (const [lang, path, q, expected] of [
  ['es', '/', 'cuéntame cómo me ayudaría con mi taller de motos en Medellín', 'llegué a mi límite de respuestas del día'],
  ['en', '/en/', 'tell me how you would help my bike repair shop in Austin', 'hit my answer limit for the day'],
]) {
  test(`${lang} · tope alcanzado → mensaje fijo con info@agentceo.io, sin modelo`, async ({ page }) => {
    await page.goto(path)
    const panel = await openChat(page)
    await page.locator('[data-chat-input]').fill(q)
    await page.locator('[data-chat-send]').click()
    const answer = panel.locator('.cw-bot').last()
    await expect(answer).toContainText(expected)
    await expect(answer.locator('a[href="mailto:info@agentceo.io"]')).toBeVisible()
    // (El kind 'global_cap' del meta lo prueban los tests del Worker: leer un SSE desde page.on('response')
    // no es fiable en Chromium. Aquí manda lo que VE la persona.)
  })
}

test('las respuestas curadas siguen saliendo con el tope agotado', async ({ page }) => {
  await page.goto('/')
  const panel = await openChat(page)
  await panel.locator('[data-chat-suggest] .cw-chip', { hasText: '¿Cuánto cuesta?' }).click()
  await expect(panel.locator('.cw-bot').last()).not.toContainText('límite de respuestas')
  await expect(panel.locator('.cw-bot').last()).toContainText('$')
})
