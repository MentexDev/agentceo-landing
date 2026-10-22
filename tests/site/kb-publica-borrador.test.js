// T58b · El borrador de la KB pública del chat (docs/kb-publica-borrador.md) no puede llevar datos reservados:
// ni societarios/registrales (los mismos detectores que el build del chat, worker/chat/private.js), ni
// infraestructura, proveedores o modelos, ni secretos. Si algún día se cablea, ya entra limpio.
import fs from 'node:fs'
import { describe, it, expect } from 'vitest'
import { findPrivate } from '../../worker/chat/private.js'

const DOC = fs.readFileSync(new URL('../../docs/kb-publica-borrador.md', import.meta.url), 'utf8')
const INFRA = /\b(openrouter|gemini|cloudflare|wrangler|supabase|anthropic|openai|gpt-?\d|claude|workers? kv|durable objects?|postgres|vertex)\b/i
const SECRET = /\b(sk-(or-)?[a-z0-9-]{6,}|re_[A-Za-z0-9]{10,}|api[_ -]?key\s*[:=])/i

describe('KB pública · borrador', () => {
  it('sin datos societarios ni registrales (detectores del chat)', () => {
    const hits = DOC.split('\n').flatMap((l, i) => findPrivate(l).map((h) => `${i + 1}: ${h.name} «${h.match}»`))
    expect(hits).toEqual([])
    expect(DOC).not.toMatch(/delaware|\bEIN\b|continental dr|newark/i)
  })
  it('sin infraestructura, proveedores, modelos ni secretos', () => {
    expect(DOC).not.toMatch(INFRA)
    expect(DOC).not.toMatch(SECRET)
  })
  it('bilingüe, con 30+ FAQs por idioma, contacto y lo no publicado marcado', () => {
    const es = DOC.slice(DOC.indexOf('### ES ('), DOC.indexOf('### EN ('))
    const en = DOC.slice(DOC.indexOf('### EN ('), DOC.indexOf('## 14.'))
    expect((es.match(/^\d+\. \*\*/gm) || []).length).toBeGreaterThanOrEqual(30)
    expect((en.match(/^\d+\. \*\*/gm) || []).length).toBeGreaterThanOrEqual(30)
    expect(DOC).toContain('info@agentceo.io')
    expect((DOC.match(/\[VERIFICAR\]/g) || []).length).toBeGreaterThan(10)
    expect((DOC.match(/\[VERIFY\]/g) || []).length).toBeGreaterThan(10)
  })
  it('solo precios publicados (los de content/precios.js)', async () => {
    const { PLANS, PACKS } = await import('../../content/precios.js')
    for (const p of PLANS) if (p.price) expect(DOC, p.name).toContain(`$${p.price}`)
    for (const k of PACKS) expect(DOC, k.name).toContain(`$${k.price}`)
    const dollars = [...DOC.matchAll(/\$(\d+)/g)].map((m) => Number(m[1]))
    const allowed = new Set([0, ...PLANS.map((p) => p.price), ...PACKS.map((k) => k.price)])
    expect(dollars.filter((d) => !allowed.has(d))).toEqual([])
  })
})
