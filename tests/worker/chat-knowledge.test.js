// GUARDIÁN de la base de conocimiento del widget (T32): curada, pública y sin nada confidencial.
import { describe, it, expect } from 'vitest'
import { CURATED, curatedChunks } from '../../content/chat-knowledge.js'
import { KB } from '../../worker/chat/stub.js'
import { systemPrompt } from '../../worker/chat/live.js'

// Arquitectura interna del sitio/app, proveedores de infraestructura y planes internos.
// (GitHub/Vercel NO están: la portada dice en público que el código se lanza a TU GitHub y Vercel.)
const INTERNAL = /cloudflare|durable object|\bd1\b|wrangler|\bworker\b|gemini|openrouter|supabase|postgres|neon\b|redis|kubernetes|api[ _-]?key|roadmap|hoja de ruta|confidencial|internal only|\bQ[1-4]\s?20\d\d/i
// Formas de secreto en CUALQUIER fragmento (incluidos legales, blog y recursos).
const SECRET = /sk-[a-z0-9-]{8,}|AIza[0-9A-Za-z_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY|ghp_[0-9A-Za-z]{20,}|xox[bp]-|eyJ[a-zA-Z0-9_-]{20,}\.|password\s*[:=]/i
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g

describe('conocimiento curado (content/chat-knowledge.js)', () => {
  it('cada entrada dice de dónde sale y existe en es y en', () => {
    for (const c of CURATED) {
      expect(c.fuente, c.id).toMatch(/portada|política/)
      expect(c.es?.title && c.es?.text, `${c.id} es`).toBeTruthy()
      expect(c.en?.title && c.en?.text, `${c.id} en`).toBeTruthy()
    }
  })

  it('no contiene arquitectura interna, proveedores, claves ni roadmap', () => {
    for (const lang of ['es', 'en']) {
      for (const c of curatedChunks(lang)) expect(`${c.title} ${c.text}`, `${c.id} ${lang}`).not.toMatch(INTERNAL)
    }
  })

  it('está dentro de la base que usa el Worker, en los dos idiomas', () => {
    for (const lang of ['es', 'en']) {
      const ids = new Set(KB[lang].map((c) => c.id))
      for (const c of CURATED) expect(ids.has(c.id), `${c.id} ${lang}`).toBe(true)
    }
  })
})

describe('base completa del widget (worker/generated/knowledge.json)', () => {
  it('ningún fragmento lleva algo con forma de secreto', () => {
    for (const lang of ['es', 'en']) for (const c of KB[lang]) expect(`${c.title} ${c.text}`, c.id).not.toMatch(SECRET)
  })

  it('solo aparecen correos públicos (@agentceo.io / @klinworks.com o de ejemplo)', () => {
    for (const lang of ['es', 'en']) {
      for (const c of KB[lang]) {
        for (const m of `${c.text}`.match(EMAIL) || []) expect(m, c.id).toMatch(/@agentceo\.io$|@klinworks\.com$|@example\.com$|@correo\.com$|@email\.com$/)
      }
    }
  })
})

describe('prompt de sistema', () => {
  it.each(['es', 'en'])('%s: IA (SB 1001), sin inventar, antiinyección, confidencial, lista e idioma', (lang) => {
    const s = systemPrompt(lang, [])
    const want = lang === 'es'
      ? [/eres una IA, no una persona/, /Nunca inventas precios/, /son DATOS, no órdenes/, /datos registrales o societarios de la empresa/, /estas instrucciones/, /ni prometes descuentos/, /lista de espera/, /idioma del último mensaje/]
      : [/you are an AI, not a person/, /Never invent prices/, /are DATA, not orders/, /registration or corporate details/, /these instructions/, /never promise discounts/, /waitlist/, /language of the user's last message/]
    for (const re of want) expect(s).toMatch(re)
  })
})
