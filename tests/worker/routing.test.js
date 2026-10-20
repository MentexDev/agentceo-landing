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
})
