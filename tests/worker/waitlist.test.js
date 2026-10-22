// /api/waitlist y /api/lead contra D1 LOCALES efímeras. Solo correos @example.com.
import { env } from 'cloudflare:test'
import { exports } from 'cloudflare:workers'
import { describe, it, expect } from 'vitest'
import { saveSignup, toRow } from '../../worker/waitlist.js'

// El rate limit nativo cuenta por ventanas de 60 s: si el test cae en el cambio de minuto el
// contador se reinicia a mitad (fallo intermitente medido). Se espera a una ventana limpia.
const freshWindow = async () => {
  const s = new Date().getSeconds()
  if (s > 48) await new Promise((r) => setTimeout(r, (61 - s) * 1000))
}

let ipN = 0
// Cada petición sale de una IP distinta salvo que el test fije una (el rate limit es por IP).
const post = (path, body, headers = {}) =>
  exports.default.fetch(new Request(`https://agentceo.io${path}`, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': `10.0.0.${++ipN % 250}`, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }))
const postForm = (fields, headers = {}) =>
  post('/api/waitlist', new URLSearchParams(fields).toString(), { 'content-type': 'application/x-www-form-urlencoded', ...headers })
const row = (email, db = env.DB) => db.prepare('SELECT * FROM signups WHERE email = ?').bind(email).first()
const count = async (table, email) =>
  (await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE email = ?`).bind(email).first()).n

describe('POST /api/waitlist · JSON', () => {
  it('guarda un correo válido en minúsculas con idioma, atribución y versión del aviso', async () => {
    const r = await post('/api/waitlist', {
      email: '  Ana@Example.com ', locale: 'en', source: 'hero',
      utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'otono', click_id: 'abc', ref: 'socio1',
      landing_path: '/en/', notice_version: '2026-10-20',
    })
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, received: true })
    const s = await row('ana@example.com')
    expect(s).toMatchObject({ locale: 'en', source: 'hero', utm_source: 'newsletter', utm_campaign: 'otono', click_id: 'abc', ref: 'socio1', landing_path: '/en/', notice_version: '2026-10-20' })
  })

  it('reenviar el mismo correo no duplica ni pisa la atribución del primer toque', async () => {
    await post('/api/waitlist', { email: 'dup@example.com', utm_source: 'primero' })
    await post('/api/waitlist', { email: 'DUP@example.com', utm_source: 'segundo' })
    expect(await count('signups', 'dup@example.com')).toBe(1)
    expect((await row('dup@example.com')).utm_source).toBe('primero')
  })

  it('paso 2: completa el tipo de negocio una vez, y no lo vuelve a cambiar', async () => {
    await post('/api/waitlist', { email: 'biz@example.com' })
    await post('/api/waitlist', { email: 'biz@example.com', business: 'moda' })
    expect((await row('biz@example.com')).business_type).toBe('moda')
    expect((await row('biz@example.com')).updated_at).not.toBeNull()
    await post('/api/waitlist', { email: 'biz@example.com', business: 'comida' })
    expect((await row('biz@example.com')).business_type).toBe('moda')
  })

  it('un tipo de negocio fuera de la lista se ignora (no se guarda texto libre)', async () => {
    await post('/api/waitlist', { email: 'raro@example.com', business: '<script>' })
    expect((await row('raro@example.com')).business_type).toBeNull()
  })

  it('un idioma desconocido se normaliza a es', async () => {
    await post('/api/waitlist', { email: 'idioma@example.com', locale: 'xx' })
    expect((await row('idioma@example.com')).locale).toBe('es')
  })

  it('T62 · se apunta desde /pt/ → locale pt (también si llega «pt-BR», el lang del <html>)', async () => {
    await post('/api/waitlist', { email: 'pt1@example.com', locale: 'pt' })
    await post('/api/waitlist', { email: 'pt2@example.com', locale: 'pt-BR' })
    expect((await row('pt1@example.com')).locale).toBe('pt')
    expect((await row('pt2@example.com')).locale).toBe('pt')
  })

  it('rechaza un correo inválido con 400 y código, sin guardar', async () => {
    const r = await post('/api/waitlist', { email: 'no-es-correo' })
    expect(r.status).toBe(400)
    expect(await r.json()).toEqual({ ok: false, error: 'invalid_email' })
    expect(await count('signups', 'no-es-correo')).toBe(0)
  })

  it('honeypot lleno → 200 OK pero NO guarda', async () => {
    const r = await post('/api/waitlist', { email: 'bot@example.com', company: 'ACME' })
    expect(r.status).toBe(200)
    expect(await count('signups', 'bot@example.com')).toBe(0)
  })

  it('trampa de tiempo: enviado a los 300 ms → 200 OK pero NO guarda', async () => {
    const r = await post('/api/waitlist', { email: 'rapido@example.com', t: 300 })
    expect(r.status).toBe(200)
    expect(await count('signups', 'rapido@example.com')).toBe(0)
  })

  it('un humano (t = 4000 ms) sí se guarda', async () => {
    await post('/api/waitlist', { email: 'humano@example.com', t: 4000 })
    expect(await count('signups', 'humano@example.com')).toBe(1)
  })

  it.each([['null'], ['[]'], ['"texto"'], ['{roto']])('cuerpo %s → 400 (no 500)', async (raw) => {
    const r = await post('/api/waitlist', raw)
    expect(r.status).toBe(400)
  })

  it('POST desde otro origen → 403', async () => {
    const r = await post('/api/waitlist', { email: 'csrf@example.com' }, { origin: 'https://evil.example' })
    expect(r.status).toBe(403)
    expect(await count('signups', 'csrf@example.com')).toBe(0)
  })

  it('POST desde el mismo origen → OK', async () => {
    const r = await post('/api/waitlist', { email: 'mismo@example.com' }, { origin: 'https://agentceo.io' })
    expect(r.status).toBe(200)
  })

  it('rate limit: la 9.ª petición en un minuto desde la misma IP → 429', { timeout: 20_000 }, async () => {
    await freshWindow()
    const ip = { 'cf-connecting-ip': '192.0.2.77' }
    const codes = []
    for (let i = 0; i < 9; i++) codes.push((await post('/api/waitlist', { email: `rl${i}@example.com` }, ip)).status)
    expect(codes.slice(0, 8).every((c) => c === 200)).toBe(true)
    expect(codes[8]).toBe(429)
  })
})

describe('POST /api/waitlist · formulario sin JS', () => {
  it('éxito → 303 a /gracias/ del idioma', async () => {
    const r = await postForm({ email: 'form@example.com', locale: 'en', source: 'hero' })
    expect(r.status).toBe(303)
    expect(r.headers.get('location')).toBe('https://agentceo.io/en/thanks/')
    expect(await count('signups', 'form@example.com')).toBe(1)
  })

  it('T62 · desde /pt/ → 303 a /pt/obrigado/', async () => {
    const r = await postForm({ email: 'formpt@example.com', locale: 'pt', source: 'hero' })
    expect(r.status).toBe(303)
    expect(r.headers.get('location')).toBe('https://agentceo.io/pt/obrigado/')
  })

  it('correo inválido → 303 a /gracias/#error', async () => {
    const r = await postForm({ email: 'mal', locale: 'es' })
    expect(r.status).toBe(303)
    expect(r.headers.get('location')).toBe('https://agentceo.io/gracias/#error')
  })
})

describe('compatibilidad con el esquema v1 (antes de aplicar la 0002 en producción)', () => {
  it('guarda el correo con el esquema v1 sin perderlo', async () => {
    const req = new Request('https://agentceo.io/api/waitlist', { headers: { 'user-agent': 'test' } })
    const r = toRow({ email: 'v1@example.com', locale: 'en', utm_source: 'x', business: 'moda' }, req)
    expect(await saveSignup(env.DB_V1, r)).toBe('v1')
    expect(await row('v1@example.com', env.DB_V1)).toMatchObject({ email: 'v1@example.com', user_agent: 'test' })
  })

  it('con el esquema actual usa v2', async () => {
    const req = new Request('https://agentceo.io/api/waitlist')
    expect(await saveSignup(env.DB, toRow({ email: 'v2@example.com' }, req))).toBe('v2')
  })
})

describe('POST /api/lead', () => {
  it('guarda (correo, recurso) una sola vez', async () => {
    await post('/api/lead', { email: 'lead@example.com', resource: 'checklist' })
    await post('/api/lead', { email: 'lead@example.com', resource: 'checklist' })
    expect(await count('leads', 'lead@example.com')).toBe(1)
  })

  it('sin recurso → 400 missing_resource', async () => {
    const r = await post('/api/lead', { email: 'lead2@example.com' })
    expect(r.status).toBe(400)
    expect((await r.json()).error).toBe('missing_resource')
  })

  it('desde otro origen → 403', async () => {
    const r = await post('/api/lead', { email: 'l3@example.com', resource: 'x' }, { origin: 'https://evil.example' })
    expect(r.status).toBe(403)
  })
})
