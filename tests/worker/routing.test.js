// Enrutado del Worker: redirecciones, métodos y cabeceras de seguridad.
import { exports } from 'cloudflare:workers'
import { describe, it, expect } from 'vitest'

const get = (path, init) => exports.default.fetch(new Request(`https://agentceo.io${path}`, { redirect: 'manual', ...init }))

describe('enrutado', () => {
  it('www → apex con 301 conservando ruta y query', async () => {
    const r = await exports.default.fetch(new Request('https://www.agentceo.io/precios/?a=1', { redirect: 'manual' }))
    expect(r.status).toBe(301)
    expect(r.headers.get('location')).toBe('https://agentceo.io/precios/?a=1')
  })

  it('/legal/x.html (URL de la v1) → 301 a la URL limpia', async () => {
    const r = await get('/legal/privacidad.html')
    expect(r.status).toBe(301)
    expect(r.headers.get('location')).toBe('https://agentceo.io/legal/privacidad')
  })

  it('/login → 302 al login de la app', async () => {
    const r = await get('/login')
    expect(r.status).toBe(302)
    expect(r.headers.get('location')).toBe('https://app.agentceo.io/login')
  })

  it('GET /api/waitlist → 405 con Allow: POST', async () => {
    const r = await get('/api/waitlist')
    expect(r.status).toBe(405)
    expect(r.headers.get('allow')).toBe('POST')
  })

  it('la portada se sirve con CSP cerrada a self (sin Google Fonts)', async () => {
    const r = await get('/')
    expect(r.status).toBe(200)
    const csp = r.headers.get('content-security-policy')
    expect(csp).toContain("font-src 'self'")
    expect(csp).not.toContain('googleapis')
    expect(r.headers.get('x-content-type-options')).toBe('nosniff')
    expect(csp).toContain('upgrade-insecure-requests')
    expect(r.headers.get('strict-transport-security')).toContain('max-age=')
  })

  it('en http (dev local) NO se fuerza https: Safari rompía CSS y enlaces', async () => {
    const r = await exports.default.fetch(new Request('http://127.0.0.1:8787/'))
    expect(r.headers.get('content-security-policy')).not.toContain('upgrade-insecure-requests')
    expect(r.headers.get('strict-transport-security')).toBeNull()
  })

  it('los assets con hash (/_a/) se cachean un año como inmutables', async () => {
    const html = await (await get('/')).text()
    const asset = /\/_a\/[^"]+\.(css|js)/.exec(html)[0]
    const r = await get(asset)
    expect(r.status).toBe(200)
    expect(r.headers.get('cache-control')).toBe('public, max-age=31536000, immutable')
  })

  it('/en/ se sirve en inglés', async () => {
    const r = await get('/en/')
    expect(r.status).toBe(200)
    expect(await r.text()).toContain('<html lang="en"')
  })

  it('una ruta inexistente en /en/ devuelve 404 con la página EN INGLÉS', async () => {
    const r = await get('/en/no-existe-esto')
    expect(r.status).toBe(404)
    expect(await r.text()).toContain('<html lang="en"')
  })

  it('una ruta inexistente en español devuelve 404 en español', async () => {
    const r = await get('/no-existe-esto')
    expect(r.status).toBe(404)
    expect(await r.text()).toContain('<html lang="es"')
  })

  // ── T62 · autodetección del idioma en la raíz (worker/lib/locale.js) ───────────────────────────────
  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
  const root = (headers, path = '/') => get(path, { headers: { 'user-agent': UA, ...headers } })

  it('navegador en portugués llega a «/» → 302 a /pt/ conservando la query, con Vary y sin caché', async () => {
    const r = await root({ 'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8' }, '/?utm_source=x')
    expect(r.status).toBe(302)
    expect(r.headers.get('location')).toBe('https://agentceo.io/pt/?utm_source=x')
    expect(r.headers.get('vary')).toContain('Accept-Language')
    expect(r.headers.get('cache-control')).toContain('no-store')
  })

  it('navegador en inglés → /en/; en español → «/» sin redirigir (y con Vary)', async () => {
    expect((await root({ 'accept-language': 'en-GB,en;q=0.9' })).headers.get('location')).toBe('https://agentceo.io/en/')
    const es = await root({ 'accept-language': 'es-CO,es;q=0.9,en;q=0.8' })
    expect(es.status).toBe(200)
    expect(es.headers.get('vary')).toContain('Accept-Language')
  })

  it('respeta la elección: cookie lang=es no redirige; cookie lang=pt lleva a /pt/ aunque el navegador diga inglés', async () => {
    expect((await root({ 'accept-language': 'pt-BR', cookie: 'consent=v1.f1.a0.d0; lang=es' })).status).toBe(200)
    expect((await root({ 'accept-language': 'en-US', cookie: 'lang=pt' })).headers.get('location')).toBe('https://agentceo.io/pt/')
  })

  it('respeta la elección SIN cookie: quien ya navega por el sitio y pulsa «Español» se queda en «/»', async () => {
    expect((await root({ 'accept-language': 'pt-BR', 'sec-fetch-site': 'same-origin' })).status).toBe(200)
    expect((await root({ 'accept-language': 'pt-BR', referer: 'https://agentceo.io/pt/precos/' })).status).toBe(200)
    // Desde fuera (Google) sí se detecta.
    expect((await root({ 'accept-language': 'pt-BR', 'sec-fetch-site': 'cross-site', referer: 'https://www.google.com/' })).status).toBe(302)
  })

  it('SEO: bots y peticiones sin Accept-Language reciben «/» (nunca una redirección)', async () => {
    expect((await get('/')).status).toBe(200)
    // Aunque Cloudflare diga Brasil: sin Accept-Language no se redirige (así rastrea Google).
    expect((await get('/', { cf: { country: 'BR' }, headers: { 'user-agent': UA } })).status).toBe(200)
    expect((await get('/', { headers: { 'accept-language': 'pt-BR', 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } })).status).toBe(200)
  })

  it('solo la raíz: /precios/ con navegador en portugués no se toca', async () => {
    expect((await root({ 'accept-language': 'pt-BR' }, '/precios/')).status).toBe(200)
  })

  it('país como pista: sin idioma nuestro en el navegador, Portugal → pt; otro idioma sin país nuestro → en', async () => {
    const { detectLocale } = await import('../../worker/lib/locale.js')
    expect(detectLocale({ acceptLanguage: 'fr-FR,fr;q=0.9', country: 'PT' })).toBe('pt')
    expect(detectLocale({ acceptLanguage: 'de-DE', country: 'DE' })).toBe('en')
    expect(detectLocale({ acceptLanguage: 'de;q=1,es;q=0.5' })).toBe('es')
    expect(detectLocale({ acceptLanguage: 'en;q=0.4,pt-PT;q=0.8' })).toBe('pt')
    expect(detectLocale({ acceptLanguage: '', country: 'BR' })).toBe('pt')
    expect(detectLocale({ acceptLanguage: '', country: 'CO' })).toBeNull()
  })
})
