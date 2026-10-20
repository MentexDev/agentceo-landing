// T40 (Luca, prioridad máxima): en producción el bot respondió la fecha de constitución y el n.º de
// expediente de Klinworks, LLC (venían de los .md legales metidos en el conocimiento del chat).
// Guardianes: nada societario/registral en el conocimiento, el prompt ni las curadas; la FAQ
// pública sin «sociedad de Delaware»; negativa amable a esas preguntas; caché versionada de nuevo.
import { env } from 'cloudflare:test'
import { describe, it, expect } from 'vitest'
import { KB } from '../../worker/chat/stub.js'
import { RULES, systemPrompt } from '../../worker/chat/live.js'
import { ANSWERS } from '../../content/chat-answers.js'
import { FAQ } from '../../content/faq.js'
import { findPrivate } from '../../worker/chat/private.js'
import { intentOf } from '../../worker/chat/persona.js'
import { contentVersion, CACHE_SCHEMA } from '../../worker/chat/version.js'
import { CONTENT_VERSION } from '../../worker/chat/abuse.js'
import { handleChat } from '../../worker/chat/handler.js'

// La lista literal del brief (y sus equivalentes en inglés).
const FORBIDDEN = ['10704723', 'Continental Drive', 'Newark', '19713', 'expediente', 'EIN', '20 de julio de 2026', 'Delaware', 'file number', 'registered agent', 'registered office', 'July 20, 2026', 'oficina registrada']
const hits = (text) => FORBIDDEN.filter((w) => (w === 'EIN' ? /\bEIN\b/.test(text) : text.toLowerCase().includes(w.toLowerCase())))

describe('nada societario ni registral en lo que lee o dice el chat', () => {
  it.each(['es', 'en'])('conocimiento (worker/generated/knowledge.json) · %s', (lang) => {
    for (const c of KB[lang]) {
      const t = `${c.title} ${c.text}`
      expect(hits(t), c.id).toEqual([])
      expect(findPrivate(t), c.id).toEqual([])
    }
  })
  it.each(['es', 'en'])('prompt de sistema · %s, también con TODO el conocimiento como contexto', (lang) => {
    expect(hits(RULES[lang])).toEqual([])
    const full = systemPrompt(lang, KB[lang])
    expect(hits(full)).toEqual([])
    expect(findPrivate(full)).toEqual([])
  })
  it('respuestas curadas (es y en)', () => {
    for (const e of ANSWERS) for (const l of ['es', 'en']) {
      expect(hits(e.a[l]), `${e.id} ${l}`).toEqual([])
      expect(findPrivate(e.a[l]), `${e.id} ${l}`).toEqual([])
    }
  })
  it('la red de seguridad reconoce el texto que se filtró en producción', () => {
    const fuga = 'Klinworks es una sociedad de responsabilidad limitada de Delaware (Estados Unidos), expediente n.º 10704723, con oficina registrada en 131 Continental Drive, Suite 305, Newark, Delaware 19713, constituida el 20 de julio de 2026.'
    expect(findPrivate(fuga).length).toBeGreaterThanOrEqual(5)
    expect(findPrivate('Registered agent: 131 Continental Drive, Newark, DE 19713. EIN 12-3456789. Incorporated on July 20, 2026.').map((h) => h.name)).toEqual(expect.arrayContaining(['EIN', 'agente u oficina registrada', 'dirección registrada', 'fecha de constitución']))
  })
})

describe('«qué es Agent CEO» solo dice quién lo desarrolla', () => {
  it('FAQ pública (es y en) sin «sociedad de Delaware»', () => {
    const f = FAQ.find((x) => x.id === 'que-es')
    expect(f.a.es).toMatch(/La desarrolla Klinworks, LLC\.$/)
    expect(f.a.en).toMatch(/It's built by Klinworks, LLC\.$/)
    for (const x of FAQ) for (const l of ['es', 'en']) expect(x.a[l] || '', x.id).not.toMatch(/delaware|sociedad de/i)
  })
  it('la respuesta curada «que-es» igual', () => {
    const e = ANSWERS.find((x) => x.id === 'que-es')
    expect(e.a.es).toMatch(/La desarrolla Klinworks, LLC\.$/)
    expect(e.a.en).toMatch(/It's built by Klinworks, LLC\.$/)
  })
})

describe('negativa amable a datos societarios e internos (sin LLM, sin datos)', () => {
  const PRIVADAS = [
    ['es', '¿Cuándo se constituyó la empresa?'], ['es', '¿Cuál es el número de expediente?'], ['en', "What's your registered agent?"],
    ['es', '¿Quién es el fundador y dónde vive?'], ['en', 'What model do you use?'], ['es', '¿Dónde está ubicada la empresa?'],
    ['en', 'Are you incorporated in Delaware?'], ['es', '¿Cuántos usuarios tienen?'], ['es', '¿Tienen inversores?'], ['en', "What's your EIN?"],
  ]
  it.each(PRIVADAS)('%s · «%s» → intención private', (_, q) => expect(intentOf(q)).toBe('private'))
  it.each(['¿Cuánto cuesta?', '¿Qué es Agent CEO?', '¿Quién está detrás?', '¿Mis datos están seguros?', '¿Qué modelo de negocio tienen?', '¿Cuántos usuarios puedo tener en Impulso?', 'How many people can use it?', 'Can I connect Gmail?'])('«%s» NO es privada', (q) => expect(intentOf(q)).not.toBe('private'))

  it.each(PRIVADAS)('%s · «%s» → el widget responde la negativa con enlace a lo legal, sin ningún dato', async (lang, q) => {
    const r = await handleChat(new Request('https://agentceo.io/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cf-connecting-ip': `198.51.100.${Math.floor(Math.random() * 250)}`, 'user-agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/141.0 Safari/537.36', 'accept-language': 'es-ES,es;q=0.9' },
      body: JSON.stringify({ locale: lang, messages: [{ role: 'user', content: q }] }),
    }), { ...env, CHAT_STUB_DELAY_MS: '0', CHAT_MODE: 'live', OPENROUTER_API_KEY: 'clave-FALSA-de-test' }, null, { fetchImpl: () => { throw new Error('no debe llamar al modelo') } })
    const raw = await r.text()
    const meta = JSON.parse(/event: meta\ndata: (.*)/.exec(raw)[1])
    const text = [...raw.matchAll(/event: delta\ndata: (.*)/g)].map((m) => JSON.parse(m[1]).t).join('')
    expect(meta.kind).toBe('intent:private')
    expect(text).toMatch(lang === 'en' ? /\(\/en\/legal\/\)/ : /\(\/legal\/\)/)
    expect(text).toMatch(/info@agentceo\.io/)
    expect(findPrivate(text)).toEqual([])
    expect(hits(text)).toEqual([])
  })
})

describe('caché invalidada (T40)', () => {
  const base = { knowledge: { es: [{ id: 'x', text: 'y' }] }, answers: [] }
  it('el esquema es ≥ 2 y cambiarlo cambia la versión', async () => {
    expect(CACHE_SCHEMA).toBeGreaterThanOrEqual(2)
    expect(await contentVersion({ ...base, schema: 1 })).not.toBe(await contentVersion({ ...base, schema: 2 }))
  })
  it('cambiar el prompt de sistema cambia la versión', async () => {
    expect(await contentVersion({ ...base, prompt: { es: 'a' } })).not.toBe(await contentVersion({ ...base, prompt: { es: 'b' } }))
  })
  it('la versión desplegada se calculó con el esquema actual y el prompt actual', async () => {
    const { ANSWERS: A } = await import('../../content/chat-answers.js')
    expect(CONTENT_VERSION).toBe(await contentVersion({ knowledge: KB, answers: A, prompt: RULES }))
  })
})
