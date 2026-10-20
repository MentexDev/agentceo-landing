// Fixture común: cada test sale de una IP de documentación PROPIA (IPv6 2001:db8::/32, RFC 3849).
// Así el rate limit real del Worker (8/min por IP) y el tope diario del chat no mezclan tests.
// Antes eran 254 IPv4 al azar: medido el 20-oct, el test del 429 agotaba su IP y otro test que
// caía en la misma durante ese minuto recibía #error (fallo intermitente en la suite completa).
// En producción Cloudflare SOBRESCRIBE cf-connecting-ip: el cliente no puede falsearla.
import { test as base, expect } from '@playwright/test'
import { randomBytes } from 'node:crypto'

const hex4 = () => randomBytes(2).toString('hex')
export const test = base.extend({
  page: async ({ page }, use) => {
    const ip = `2001:db8:${hex4()}:${hex4()}:${hex4()}:${hex4()}:${hex4()}:${hex4()}`
    await page.context().setExtraHTTPHeaders({ 'cf-connecting-ip': ip })
    page.on('pageerror', (e) => { throw e })
    await use(page)
  },
})
export { expect }
