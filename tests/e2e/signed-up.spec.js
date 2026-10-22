// T60 · Recordar a quien ya se apuntó, en navegador real: bandera + correo ENMASCARADO (localStorage y cookie
// propia, categoría funcional) → el chat no vuelve a pedir el correo ni a mostrar la tarjeta.
import { test, expect } from './fixtures.js'
import { testEmail } from './db.js'

const openChat = async (page) => {
  await page.locator('[data-chat-launch]').click()
  const panel = page.locator('[data-chat-panel]')
  await expect(panel).toBeVisible()
  await panel.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)))
  return panel
}

test('alta → bandera + correo enmascarado; el chat dice «ya estás en la lista con …» y nunca la tarjeta', async ({ page }, info) => {
  const email = testEmail('recuerda', info)
  await page.goto('/')
  await page.waitForTimeout(1300)
  const form = page.locator('form[data-source="hero"]')
  await form.locator('input[type=email]').fill(email)
  await form.locator('button[type=submit]').click()
  await expect(form.locator('[data-wl-ok]')).toBeVisible()
  await page.keyboard.press('Escape') // cierra el modal del paso 2

  const masked = await page.evaluate(() => localStorage.getItem('ac_wlm'))
  expect(masked).toBe('e***@e***.com')
  expect(await page.evaluate(() => localStorage.getItem('ac_wl'))).toBe('1')
  const cookie = (await page.context().cookies()).find((c) => c.name === 'ac_wl')
  expect(decodeURIComponent(cookie.value)).toBe('1.e***@e***.com')
  // Nunca el correo entero en el navegador.
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }) + document.cookie)
  expect(stored).not.toContain(email)

  const panel = await openChat(page)
  const sent = page.waitForRequest((r) => r.url().endsWith('/api/chat'))
  await page.locator('[data-chat-input]').fill('me quiero registrar')
  await page.locator('[data-chat-send]').click()
  const body = JSON.parse((await sent).postData())
  expect(body).toMatchObject({ signedUp: true, signedUpEmail: 'e***@e***.com' })
  await expect(panel.locator('.cw-bot').last()).toContainText('Ya estás en la lista con tu correo e∗∗∗@e∗∗∗.com')
  await expect(panel.locator('.cw-card form')).toHaveCount(0)
})

test('con lo funcional apagado no se guarda nada (respeta el consentimiento)', async ({ page }, info) => {
  await page.context().addCookies([{ name: 'consent', value: 'v1.f0.a0.d0', url: page.url() === 'about:blank' ? 'http://127.0.0.1' : page.url() }])
  await page.goto('/')
  await page.context().addCookies([{ name: 'consent', value: 'v1.f0.a0.d0', url: new URL(page.url()).origin }])
  await page.reload()
  await page.waitForTimeout(1300)
  const form = page.locator('form[data-source="hero"]')
  await form.locator('input[type=email]').fill(testEmail('sin-funcional', info))
  await form.locator('button[type=submit]').click()
  await expect(form.locator('[data-wl-ok]')).toBeVisible()
  expect(await page.evaluate(() => [localStorage.getItem('ac_wl'), localStorage.getItem('ac_wlm')])).toEqual([null, null])
  expect((await page.context().cookies()).find((c) => c.name === 'ac_wl')).toBeUndefined()
})

test('apagar lo funcional DESPUÉS de apuntarse borra la bandera, el enmascarado y la cookie', async ({ page }, info) => {
  await page.goto('/')
  await page.waitForTimeout(1300)
  const form = page.locator('form[data-source="hero"]')
  await form.locator('input[type=email]').fill(testEmail('apaga', info))
  await form.locator('button[type=submit]').click()
  await expect(form.locator('[data-wl-ok]')).toBeVisible()
  await page.keyboard.press('Escape')
  expect((await page.context().cookies()).some((c) => c.name === 'ac_wl')).toBe(true)
  const btn = page.locator('footer [data-cookie-prefs]')
  await btn.scrollIntoViewIfNeeded()
  await btn.click()
  const dlg = page.locator('[data-cookie-panel]')
  await expect(dlg).toBeVisible()
  await dlg.locator('input[name=f]').uncheck()
  await dlg.getByRole('button', { name: 'Guardar preferencias' }).click()
  await expect(dlg).toBeHidden()
  expect((await page.context().cookies()).some((c) => c.name === 'ac_wl')).toBe(false)
  expect(await page.evaluate(() => [localStorage.getItem('ac_wl'), localStorage.getItem('ac_wlm')])).toEqual([null, null])
})
