// T60 · La KB pública (docs/kb-publica-borrador.md) está CABLEADA en el conocimiento del chat (kind 'kb'), y lo
// que el bot puede afirmar NO incluye nada marcado [VERIFICAR]/[VERIFY], ni los bloques de «complementos del
// producto», ni la nota interna (§15), ni la convención. Con la misma guarda de datos societarios.
import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { kbChunks, KB_DOC } from '../../src/lib/kb-publica.js'
import { findPrivate } from '../../worker/chat/private.js'

const KB = JSON.parse(readFileSync(new URL('../../worker/generated/knowledge.json', import.meta.url)))
const DOC = readFileSync(KB_DOC, 'utf8')
const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()

describe('KB pública cableada al chat', () => {
  const chunks = { es: KB.es.filter((c) => c.kind === 'kb'), en: KB.en.filter((c) => c.kind === 'kb') }
  const all = fold([...chunks.es, ...chunks.en].map((c) => `${c.title} ${c.text}`).join(' \n '))

  it('está en el knowledge.json del chat, es y en (secciones + FAQ)', () => {
    for (const l of ['es', 'en']) {
      expect(chunks[l].length).toBeGreaterThan(30)
      expect(chunks[l].filter((c) => c.id.startsWith('kb:faq:')).length).toBeGreaterThanOrEqual(30)
      expect(chunks[l]).toEqual(kbChunks(l)) // lo generado = lo que produce el parser hoy
    }
  })
  it('sin marcas, ni etiquetas de fuente, ni nota interna, ni convención', () => {
    const raw = JSON.stringify(chunks)
    expect(raw).not.toMatch(/VERIFICAR|VERIFY|\[web/)
    for (const s of ['nota interna', 'resuelto', 'manda la landing', 'convencion', 'excluido siempre', 'fuente de verdad', 'contradiccion']) expect(all, s).not.toContain(s)
  })
  it('ninguna línea marcada del documento llega al bot (comprobado línea a línea contra el documento)', () => {
    const marked = DOC.split('\n').filter((l) => /\[(VERIFICAR|VERIFY)\]/.test(l))
      .map((l) => fold(l.replace(/\[(VERIFICAR|VERIFY)\]/g, '').replace(/\[web[^\]]*\]/g, '')))
      .filter((t) => t.split(' ').length >= 6)
    expect(marked.length).toBeGreaterThan(10)
    for (const t of marked) expect(all.includes(t), t).toBe(false)
  })
  it('tampoco los BLOQUES de complementos (sus viñetas no llevan marca propia)', () => {
    for (const s of ['piloto automatico', 'autopilot', 'ficha', 'profile card', 'cambiarle el nombre', 'rename', 'tesis', 'thesis', 'cualquier api', 'any api', 'configura tu empresa', 'set up your company', 'nunca ven tus credenciales', 'never see your credentials', 'una sola pregunta', 'one question', 'saltarte la entrevista', 'skip the interview'])
      expect(all, s).not.toContain(s)
  })
  it('sí lleva lo que promete la web (manda la landing, T59)', () => {
    for (const s of ['codigo qr', 'numero oficial', 'mas de 70', '7 00', 'director general', 'vendedor de whatsapp', 'info agentceo io', 'agentes sin limite']) expect(all, s).toContain(s)
  })
  it('misma guarda societaria que el resto del conocimiento: limpio, y un documento envenenado se detecta', () => {
    for (const l of ['es', 'en']) for (const c of chunks[l]) expect(findPrivate(`${c.title} ${c.text}`), c.id).toEqual([])
    const poisoned = kbChunks('es', `${DOC}\n## 1. Veneno · Poison\n**ES**\n- Klinworks se constituyó en Delaware, expediente 10704723.\n`)
    expect(poisoned.flatMap((c) => findPrivate(c.text)).length).toBeGreaterThan(0)
  })
})
