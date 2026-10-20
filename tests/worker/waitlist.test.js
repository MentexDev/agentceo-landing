// /api/waitlist y /api/lead contra una D1 LOCAL efímera. Solo correos @example.com.
import { env } from 'cloudflare:test'
import { exports } from 'cloudflare:workers'
import { describe, it, expect } from 'vitest'

const post = (path, body, headers = {}) =>
  exports.default.fetch(new Request(`https://agentceo.io${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }))
const count = async (table, email) =>
  (await env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE email = ?`).bind(email).first()).n

describe('POST /api/waitlist', () => {
  it('guarda un correo válido en minúsculas', async () => {
    const r = await post('/api/waitlist', { email: '  Ana@Example.com ' })
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, received: true })
    expect(await count('signups', 'ana@example.com')).toBe(1)
  })

  it('reenviar el mismo correo no duplica', async () => {
    await post('/api/waitlist', { email: 'dup@example.com' })
    await post('/api/waitlist', { email: 'DUP@example.com' })
    expect(await count('signups', 'dup@example.com')).toBe(1)
  })

  it('rechaza un correo inválido con 400 y no guarda nada', async () => {
    const r = await post('/api/waitlist', { email: 'no-es-correo' })
    expect(r.status).toBe(400)
    expect((await r.json()).ok).toBe(false)
    expect(await count('signups', 'no-es-correo')).toBe(0)
  })

  it('honeypot lleno → 200 OK pero NO guarda', async () => {
    const r = await post('/api/waitlist', { email: 'bot@example.com', company: 'ACME' })
    expect(r.status).toBe(200)
    expect(await count('signups', 'bot@example.com')).toBe(0)
  })

  it.each([['null'], ['[]'], ['"texto"'], ['{roto']])('cuerpo %s → 400 (no 500)', async (raw) => {
    const r = await post('/api/waitlist', raw)
    expect(r.status).toBe(400)
  })
})

describe('POST /api/lead', () => {
  it('guarda (correo, recurso) una sola vez', async () => {
    await post('/api/lead', { email: 'lead@example.com', resource: 'checklist' })
    await post('/api/lead', { email: 'lead@example.com', resource: 'checklist' })
    expect(await count('leads', 'lead@example.com')).toBe(1)
  })

  it('sin recurso → 400', async () => {
    const r = await post('/api/lead', { email: 'lead2@example.com' })
    expect(r.status).toBe(400)
  })
})
