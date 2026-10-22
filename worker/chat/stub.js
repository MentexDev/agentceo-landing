// ─────────────────────────────────────────────────────────────────────────────
// Respuesta STUB (sin LLM, coste cero): intención → texto de la persona;
// pregunta → mejor fragmento del sitio (BM25) con su procedencia visible;
// sin confianza → lo dice y ofrece la lista. Nunca genera texto nuevo: solo cita la web.
// ─────────────────────────────────────────────────────────────────────────────
import KB from '../generated/knowledge.json' with { type: 'json' }
import { integrationQuery, integrationReply } from './integrations.js'
import { makeIndex, search, confident } from './search.js'
import { intentOf, say, privateReply } from './persona.js'

export const INDEX = Object.fromEntries(Object.keys(KB).map((l) => [l, makeIndex(KB[l])]))
// T60: la búsqueda del STUB no mira las listas de integraciones (las responde integrations.js de forma
// determinista) ni la KB pública (duplica las FAQ de la web con otros ids); son contexto para el MODELO
// (pickContext usa INDEX, completo).
export const stubSearchable = (chunks) => chunks.filter((c) => c.kind !== 'integracion' && c.kind !== 'kb')
export const SEARCH = Object.fromEntries(Object.keys(KB).map((l) => [l, makeIndex(stubSearchable(KB[l]))]))
// Sugerencias por defecto (las preguntas más útiles para decidir apuntarse).
const DEFAULT_CHIPS = ['faq:precio', 'faq:cuando', 'faq:whatsapp', 'faq:solos']

const byId = (lang, id) => KB[lang].find((c) => c.id === id)
const chipsFrom = (lang, ids, exclude = []) =>
  ids.filter((id) => !exclude.includes(id)).map((id) => byId(lang, id)?.title).filter(Boolean)

/** Preguntas exactas del FAQ (clics en chips): respuesta directa garantizada. */
export function exactFaq(lang, text) {
  const n = text.trim().toLowerCase()
  return KB[lang].find((c) => c.kind === 'faq' && c.title.toLowerCase() === n)
}

/** Devuelve { text, meta } para el último mensaje del usuario. */
export function stubReply(lang, userText) {
  const L = INDEX[lang] ? lang : 'es'
  const intent = intentOf(userText)
  const join = say(L, 'chipJoin')
  if (intent) {
    const cta = intent === 'join' || intent === 'thanks' ? 'waitlist' : null
    const chips = intent === 'join' ? [] : [...chipsFrom(L, DEFAULT_CHIPS).slice(0, 3), join]
    if (intent === 'integration') {
      const r = integrationReply(L, integrationQuery(userText))
      return { text: r.text, meta: { mode: 'stub', kind: 'intent:integration', cta: r.cta, integrations: r.known, chips: r.cta ? [] : chipsFrom(L, DEFAULT_CHIPS).slice(0, 3), matched: null, sources: [] } }
    }
    if (intent === 'private') {
      const r = privateReply(userText, L)
      return { text: r.text, meta: { mode: 'stub', kind: 'intent:private', privateKind: r.kind, cta: null, chips, matched: null, sources: [] } }
    }
    return { text: say(L, intent), meta: { mode: 'stub', kind: `intent:${intent}`, cta, chips, matched: null, sources: [] } }
  }

  const exact = exactFaq(L, userText)
  const results = exact ? [{ chunk: exact, score: 99, coverage: 1, titleHit: 1 }] : search(SEARCH[L], userText)
  const top = results[0]
  if (!confident(top)) {
    return {
      text: say(L, 'fallback'),
      meta: { mode: 'stub', kind: 'fallback', cta: 'waitlist', chips: [...chipsFrom(L, DEFAULT_CHIPS).slice(0, 3), say(L, 'chipHuman')], matched: null, sources: [] },
    }
  }
  const c = top.chunk
  // Sugerencias: otras FAQ relacionadas (de la misma búsqueda) + las de siempre.
  const related = results.slice(1).filter((r) => r.chunk.kind === 'faq').map((r) => r.chunk.id)
  const chips = chipsFrom(L, [...related, ...DEFAULT_CHIPS], [c.id]).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3)
  return {
    text: c.text,
    meta: {
      mode: 'stub',
      kind: c.kind,
      cta: c.cta || (c.id === 'faq:precio' ? 'waitlist' : null),
      chips: [...chips, join],
      // Procedencia visible: a qué pregunta/página del sitio corresponde la respuesta.
      matched: { title: c.title, url: c.url },
      sources: [{ title: c.title, url: c.url }],
    },
  }
}

export { KB }
