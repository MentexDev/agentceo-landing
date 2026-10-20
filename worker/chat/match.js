// ─────────────────────────────────────────────────────────────────────────────
// EMPAREJADO CURADO, puro (T35 · adenda): sin base de conocimiento ni APIs de Workers, para que lo
// use tanto el Worker (curated.js) como el widget en el navegador (src/scripts/chat/offline.js),
// que con él responde aunque el servidor falle, tarde o limite. Diseño y calibración: curated.js.
// ─────────────────────────────────────────────────────────────────────────────
import { ANSWERS } from '../../content/chat-answers.js'
import { tokens, norm } from './search.js'

/** Texto normalizado: minúsculas, sin tildes ni signos, espacios simples. */
export function normQ(text = '') {
  return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()
}

export const UMBRAL = 0.75
export const MAX_TERMS = 6

// Relleno que no dice de QUÉ va la pregunta (no cuenta para la cobertura). Medido en la
// calibración: sin esta lista, «¿es seguro usarlo?» no casaba y «¿mis datos de Facebook están
// seguros?» sí (los verbos de relleno diluían la cobertura y escondían el término que importa).
const FILLER = new Set(('esta estan estara estaria sirve sirven servir usarlo usarla usar uso sale salir llevar venden vender exactamente realmente bien mucho ' +
  'much many per own its get back really exactly actually just still yet please porfa favor ' +
  // T40c: «Mis datos que tanto se protegen?» (la pregunta exacta de Diego) no casaba por «tanto».
  'tanto tan tanta muy bastante so much how well').split(' '))
// Frases que equivalen a un término (antes de tokenizar).
const PHRASES = [
  [/\bagent ?ceo\b/g, ' agentceo '], [/\bhow much\b/g, ' precio '], [/\b(al|por|a|per|each|a) (mes|month)\b/g, ' precio '],
  [/\bmoney back\b/g, ' reembolso '], [/\bdevolver el dinero|devuelven el dinero\b/g, ' reembolso '],
]
const terms = (text) => {
  let q = ` ${normQ(text)} `
  for (const [re, to] of PHRASES) q = q.replace(re, to)
  return [...new Set(tokens(q))].filter((t) => !FILLER.has(t))
}

// Lo que NUNCA se responde con una ficha curada (aunque contenga «precio» o «datos»).
const DENY = /\b(ignor\w*|instrucciones|instructions|prompt|system prompt|prompt de sistema|reglas ocultas|hidden rules|tus reglas|your rules|jailbreak|modo desarrollador|developer mode|you are now|ahora eres|a partir de ahora eres|now you are|traduc\w*|translat\w*|repite|repeat|roadmap|hoja de ruta|api key|apikey|clave de api|password|contrasena|lista de clientes|clientes que (ya )?usan|customer list|customers who|correos de|base de datos|database|modelo de ia|ai model|which model|que modelo|chatgpt|openai|hubspot|zapier|competencia|competid\w*|competitor\w*|mejor que|better than|peor que|worse than|versus|vs|estafa|scam|descuento|discount|cupon|coupon|codigo promo|promo code|cuant[oa]s (usuarios|clientes|empleados|personas) (tienen|hay|usan)|how many (users|customers|clients|employees) (do you|have|use)|ganan|facturan|facturacion de la empresa|revenue|ingresos|inversores|investors)\b/

const ES = /\b(el|la|los|las|que|para|con|tu|tus|es|una|puedo|tengo|cuanto|como|donde|cuando|hay|mis|mi)\b/g
const EN = /\b(the|you|your|and|to|is|with|can|for|it|are|do|does|how|what|when|my|i)\b/g

/** Idioma de la pregunta: el que tenga claramente más palabras vacías; si no, el de la página. */
export function langOf(text, fallback = 'es') {
  const s = norm(text)
  const es = (s.match(ES) || []).length, en = (s.match(EN) || []).length
  if (en >= 2 && en > es * 2) return 'en'
  if (es >= 2 && es > en * 2) return 'es'
  return fallback === 'en' ? 'en' : 'es'
}

// Índice: por respuesta, el vocabulario (términos de todas sus formas de preguntar, en ambos
// idiomas, + anclas) y las anclas (palabras sueltas → término canónico; frases → texto normalizado).
const IDX = ANSWERS.map((e) => {
  const forms = [...e.ask.es, ...e.ask.en]
  const exact = new Set(forms.map(normQ))
  const vocab = new Set(forms.flatMap((f) => terms(f)))
  const anchorTerms = new Set(), anchorPhrases = []
  for (const k of e.keys) {
    if (k.includes(' ')) anchorPhrases.push(normQ(k))
    else for (const t of terms(k)) anchorTerms.add(t)
  }
  for (const t of anchorTerms) vocab.add(t)
  return { e, exact, vocab, anchorTerms, anchorPhrases }
})

/**
 * ¿Hay respuesta curada para este texto? → { id, how: 'exact'|'match', confidence } | null
 * Pura y determinista (la usan respond.js, los tests y las evals).
 */
export function matchCurated(text, { umbral = UMBRAL } = {}) {
  const q = normQ(text)
  if (!q || q.length > 160) return null
  if (DENY.test(q)) return null
  for (const r of IDX) if (r.exact.has(q)) return { id: r.e.id, how: 'exact', confidence: 1 }
  const qt = terms(text)
  if (!qt.length || qt.length > MAX_TERMS) return null
  const scored = []
  for (const r of IDX) {
    // Una frase ancla («money back», «que es») es más específica que una palabra: vale doble.
    const anchors = qt.filter((t) => r.anchorTerms.has(t)).length + 2 * r.anchorPhrases.filter((p) => ` ${q} `.includes(` ${p} `)).length
    if (!anchors) continue
    const known = qt.filter((t) => r.vocab.has(t)).length
    const coverage = known / qt.length
    if (coverage >= umbral) scored.push({ id: r.e.id, coverage, anchors })
  }
  if (!scored.length) return null
  scored.sort((a, b) => b.coverage - a.coverage || b.anchors - a.anchors)
  const [best, second] = scored
  // Empate exacto entre dos respuestas: no hay confianza para elegir → al modelo/stub.
  if (second && second.coverage === best.coverage && second.anchors === best.anchors) return null
  return { id: best.id, how: 'match', confidence: Number(best.coverage.toFixed(2)) }
}

