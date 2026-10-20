// ─────────────────────────────────────────────────────────────────────────────
// CAPA CURADA del widget (T35, Diego: «las preguntas comunes nunca llegan al LLM»).
// Va ANTES de cualquier modelo y en cualquier modo (stub o live): coste 0, al instante.
//   1. Chip con id curado (el cliente lo manda en `chip`) → su respuesta, siempre.
//   2. Texto libre → se normaliza (minúsculas, sin tildes ni signos; sinónimos y plurales de
//      search.js) y se compara con las formas de preguntar de content/chat-answers.js:
//        · idéntica a una de ellas (normalizada)                 → curada
//        · si no: confianza = fracción de los términos de la pregunta que conoce la respuesta;
//          exige ≥ 1 término ANCLA, cobertura ≥ UMBRAL, pregunta corta (≤ MAX_TERMS) y que no
//          haya empate con otra respuesta.
//      Nunca casa si la pregunta huele a jailbreak, a petición de datos internos o a comparación
//      con competidores (DENY): eso lo atiende el modelo con sus reglas o el stub.
//   UMBRAL calibrado en tests/worker/chat-curated.test.js con preguntas que SÍ deben casar
//   (paráfrasis que no están en `ask`) y que NO deben (jailbreaks, fuera de tema, confidenciales,
//   casi-iguales como «¿cuánto cuesta un iPhone?»): 0 falsos positivos exigidos.
//   3. Idioma: el de la pregunta si está claro (palabras vacías de cada idioma); si no, el de la página.
// Workers AI (embeddings): NO se usan; ver docs/DUDAS.md (T35 · chat).
// ─────────────────────────────────────────────────────────────────────────────
import { ANSWERS, answerById } from '../../content/chat-answers.js'
import { KB } from './stub.js'

// El EMPAREJADO (umbral, relleno, exclusiones, idioma y matchCurated) vive en match.js, módulo
// PURO sin la base de conocimiento: lo reutiliza el widget en el navegador para responder aunque
// falle el servidor (T35 · adenda, punto 0). Aquí se reexporta: la interfaz no cambia.
import { UMBRAL, MAX_TERMS, langOf, matchCurated } from './match.js'
export { UMBRAL, MAX_TERMS, langOf, matchCurated }

const byKb = (lang, id) => KB[lang]?.find((c) => c.id === id)
const CHIP_JOIN = { es: 'Unirme a la lista', en: 'Join the waitlist' }
// Sugerencias tras una curada: dos relacionadas (las siguientes de la lista) + unirse a la lista.
const RELATED = { precio: ['planes', 'paquetes'], planes: ['paquetes', 'cuando'], paquetes: ['planes', 'reembolso'], cuando: ['precio', 'que-es'], 'que-es': ['precio', 'whatsapp'] }

/** Título visible (la pregunta canónica del sitio) de una respuesta curada en un idioma. */
export function questionOf(id, lang) {
  const e = answerById(id)
  if (!e) return null
  return byKb(lang, e.ref)?.kind === 'faq' ? byKb(lang, e.ref).title : e.ask[lang][0]
}

/** Para unos chips (textos), los ids curados que les corresponden (o null). */
export function chipIdsFor(chips = []) {
  return chips.map((c) => matchCurated(c)?.how === 'exact' ? matchCurated(c).id : null)
}

/** { text, meta } de una respuesta curada. */
export function curatedReply(id, lang) {
  const e = answerById(id)
  const L = lang === 'en' ? 'en' : 'es'
  const ref = byKb(L, e.ref)
  const related = (RELATED[e.id] || ['precio', 'cuando']).filter((x) => x !== e.id).slice(0, 2).map((x) => questionOf(x, L))
  const chips = [...related, CHIP_JOIN[L]]
  return {
    text: e.a[L],
    meta: {
      mode: 'curated',
      kind: 'curated',
      curated: e.id,
      cta: e.cta || null,
      chips,
      chipIds: chipIdsFor(chips),
      // Procedencia visible: a qué pregunta/página del sitio corresponde.
      matched: ref ? { title: questionOf(e.id, L), url: ref.url } : null,
      sources: ref ? [{ title: ref.title, url: ref.url }] : [],
    },
  }
}

export { ANSWERS }
