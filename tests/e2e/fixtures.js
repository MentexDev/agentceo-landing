// Fixture común: cada test sale de una IP de documentación distinta (RFC 5737).
// Así el rate limit real del Worker (8/min por IP) no mezcla tests entre sí.
// En producción Cloudflare SOBRESCRIBE cf-connecting-ip: el cliente no puede falsearla.
import { test as base, expect } from '@playwright/test'

let n = 0
export const test = base.extend({
  page: async ({ page }, use, info) => {
    const ip = `203.0.113.${(info.workerIndex * 37 + ++n + Math.floor(Math.random() * 200)) % 254 + 1}`
    await page.context().setExtraHTTPHeaders({ 'cf-connecting-ip': ip })
    page.on('pageerror', (e) => { throw e })
    await use(page)
  },
})
export { expect }
