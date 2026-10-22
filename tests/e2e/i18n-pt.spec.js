// T62 · portugués (pt-BR) en navegador real: páginas gemelas, autodetección de la raíz que respeta la elección,
// lista de espera con locale pt y el chat respondiendo en pt.
import { test, expect } from './fixtures.js'
import { queryLocal, testEmail } from './db.js'

const switchTo = async (page, lang) => {
  await page.locator('header [data-lang-switch] summary').click()
  await page.locator(`header [data-lang-switch] a[hreflang="${lang}"]`).click()
}
const re = (path) => new RegExp(`${path.replace(/[/.]/g, '\\$&')}$`)

for (const [es, pt] of [
  ['/blog/que-es-un-agente-de-ia', '/pt/blog/o-que-e-de-verdade-um-agente-de-ia-e-por-que-nao-e-um-chatbot'],
  ['/legal/privacidad', '/pt/legal/privacidade'],
  ['/precios/', '/pt/precos/'],
  ['/no-vender-ni-compartir/', '/pt/nao-vender-nem-compartilhar/'],
]) {
  test(`${es} ⇄ ${pt}`, async ({ page }) => {
    await page.goto(es)
    await switchTo(page, 'pt-BR')
    await expect(page).toHaveURL(re(pt))
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
    await switchTo(page, 'es')
    await expect(page).toHaveURL(re(es))
  })
}

test('precios en pt: precios reales y números en formato brasileño', async ({ page }) => {
  await page.goto('/pt/precos/')
  await expect(page.locator('[data-plan="impulso"] .plan-amount')).toHaveText('$29')
  await expect(page.locator('main')).toContainText('2.300')
})

test('legal en pt: nota de traducción como cita (sin «>» suelto) y tabla de subprocesadores en pt', async ({ page }) => {
  await page.goto('/pt/legal/subprocessadores')
  await expect(page.locator('.legal-body blockquote').first()).toContainText('revisão jurídica')
  await expect(page.locator('.legal-body')).not.toContainText('> ')
  await expect(page.locator('.legal-body table')).toContainText('Fornecedor')
})

test.describe('raíz: el idioma del navegador, sin pisar la elección', () => {
  test.use({ locale: 'pt-BR' })

  test('navegador en pt → «/» lleva a /pt/; pulsar «Español» deja en «/»', async ({ page }) => {
    await page.goto('/?utm_source=t62')
    await expect(page).toHaveURL(/\/pt\/\?utm_source=t62$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
    await switchTo(page, 'es')
    await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  })

  test('con lo funcional aceptado, la elección se guarda: volver a entrar a «/» ya no redirige', async ({ page }) => {
    await page.goto('/pt/')
    await page.context().addCookies([{ name: 'consent', value: 'v1.f1.a0.d0', url: new URL(page.url()).origin }])
    await switchTo(page, 'es')
    await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/)
    const lang = (await page.context().cookies()).find((c) => c.name === 'lang')
    expect(lang?.value).toBe('es')
    await page.goto('/') // entrada «desde fuera» (barra de direcciones)
    await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/)
  })
})

test('lista de espera desde /pt/: se guarda con locale pt', async ({ page }, info) => {
  const email = testEmail('modal-pt', info)
  await page.goto('/pt/')
  await page.waitForTimeout(1300)
  await page.locator('header .hdr-cta').click()
  const modal = page.locator('dialog[data-wl-modal]')
  await modal.locator('input[type=email]').fill(email)
  await modal.locator('[data-step-panel="form"] button[type=submit]').click()
  await expect(modal.locator('[data-step-panel="biz"]')).toBeVisible()
  await modal.locator('[data-wl-skip]').click()
  await expect(modal.locator('[data-step-panel="done"]')).toBeVisible()
  const [row] = queryLocal(`SELECT locale, source FROM signups WHERE email = '${email}'`)
  expect(row).toEqual({ locale: 'pt', source: 'modal' })
})

test('chat en pt: dice que es una IA, responde en pt y enlaza a /pt/', async ({ page }) => {
  await page.goto('/pt/')
  await expect(page.locator('[data-chat-launch] .cw-ai-badge')).toHaveText('IA')
  await page.locator('[data-chat-launch]').click()
  const panel = page.locator('[data-chat-panel]')
  await expect(panel).toBeVisible()
  await panel.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)))
  await expect(panel.locator('.cw-bot').first()).toContainText('não uma pessoa')
  // Cada pregunta espera a SU burbuja (la anterior también es «.cw-bot»).
  const ask = async (q) => {
    const n = await panel.locator('.cw-bot').count()
    await page.locator('[data-chat-input]').fill(q)
    await page.keyboard.press('Enter')
    await expect(panel.locator('.cw-bot')).toHaveCount(n + 1)
    // Hasta que termina el streaming el widget no acepta otra pregunta (el botón de enviar vuelve a habilitarse).
    await expect(page.locator('[data-chat-send]')).toBeEnabled()
    return panel.locator('.cw-bot').nth(n)
  }
  const price = await ask('quanto custa?')
  await expect(price).toContainText('Arranque')
  await expect(price).toContainText('grátis')
  const refusal = await ask('qual é o CNPJ de vocês?')
  await expect(refusal).toContainText('prefiro não compartilhar')
  await expect(refusal.locator('a[href="/pt/legal/"]')).toBeVisible()
})
