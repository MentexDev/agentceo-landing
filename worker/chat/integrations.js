// «¿Se integra con X?» (T60) · respuesta DETERMINISTA, sin modelo, desde content/integraciones.js.
//   · X conocida (con alias y faltas: «woo», «mercadopago», «hub spot», «guasap»…) → «¡Sí!» con su categoría.
//   · X desconocida → nunca un «no» seco: «estamos sumando muchas», la lista de espera e info@agentceo.io.
// Solo actúa si hay una PISTA de integración («se integra», «se conecta», «funciona con», «works with»…) y la
// marca va en el OBJETO de la frase: «¿funciona con mi negocio de comida?» no es una pregunta de integración.
// WhatsApp y Shopify tienen ficha curada propia (más rica): esas las responde la ficha.
import { INTEGRATIONS, TOTAL, fold } from '../../content/integraciones.js'

const CURATED_OWN = new Set(['WhatsApp Business', 'Shopify'])
const CUE = /\b(se integra[n]?|integra[sn]?|integracion(es)?|integrar(se|lo|la)?|integrado|se conecta[n]?|conecta[sn]?|conectar(se|lo|la)?|conexion|funciona[n]? con|sirve[n]? con|trabaja[n]? con|compatible[s]? con|se lleva[n]? con|sincroniza[n]?|soporta[n]?|integrates?|integration[s]?|connects?|connect(ed|ing)?|works? with|compatible with|supports?|syncs?)\b/
// Lo que va detrás de la pista y NO es una marca (posesivos, artículos, cosas genéricas).
const NOT_BRAND = /^(to|with|herramientas|tools|apps|aplicaciones|plataformas|platforms|servicios|services|tienen|tiene|tienes|hay|existen|disponibles|ofrecen|manejan|soportan|have|has|are|is|do|does|you|they|available|offer|support|mi|mis|tu|tus|su|sus|el|la|los|las|un|una|unos|unas|lo|my|your|their|the|a|an|our|nuestro|nuestra|nuestros|nuestras|todo|todos|cualquier|any|all|otras?|otros?|other|mas|more|que|what|cuales?|which|algun[oa]?|some|esto|eso|this|that|it|ello|ia|ai|negocio|empresa|tienda|business|store|company)\b/

// Índice alias → integración, con los alias más largos primero (para «google calendar» antes que «calendar»).
const INDEX = INTEGRATIONS.flatMap((it) => it.aliases.map((a) => [a, it])).sort((a, b) => b[0].length - a[0].length)
const norm = (s) => ` ${fold(s).replace(/[^a-z0-9]+/g, ' ').trim()} `

/**
 * @returns {null | { known: object[], unknown: string|null }} null si no es una pregunta de integración.
 */
export function integrationQuery(text = '') {
  const s = fold(text)
  const m = CUE.exec(s)
  if (!m) return null
  const after = s.slice(m.index + m[0].length).replace(/[?¿!¡.,;:]+/g, ' ').replace(/^\s*(con|a|al|with|to|de|del|en|in|into)(\s+|$)/, '').trim()
  if (!after) return null
  // Marcas conocidas en el objeto (puede haber varias: «con Shopify, Gmail y HubSpot»).
  let rest = norm(after)
  const known = []
  for (const [a, it] of INDEX) {
    const k = ` ${a} `
    if (rest.includes(k) && !known.includes(it)) { known.push(it); rest = rest.split(k).join(' ') }
  }
  if (known.length) {
    if (known.every((it) => CURATED_OWN.has(it.name))) return null // la ficha curada responde mejor
    return { known, unknown: null }
  }
  // Desconocida: el primer «nombre» del objeto, si parece una marca (no un posesivo ni algo genérico).
  const words = after.replace(/[?¿!¡.,;:]+/g, ' ').trim().split(/\s+/).slice(0, 3)
  if (!words.length || NOT_BRAND.test(words.join(' '))) return null
  const name = words.join(' ').replace(/[^\p{L}\p{N} .&+-]/gu, '').trim().slice(0, 30)
  // Solo la integración explícita («se integra», «se conecta», «integration») cuenta con una marca desconocida;
  // «funciona con algo» sin marca reconocible no es una pregunta de integración.
  if (!/integr|conect|connect|sincroniz|sync|compatible/.test(m[0])) return null
  return name ? { known: [], unknown: name } : null
}

const join = (xs, lang) => (xs.length < 2 ? xs[0] : `${xs.slice(0, -1).join(', ')} ${lang === 'en' ? 'and' : 'y'} ${xs.at(-1)}`)
const CAT_ES = (it) => it.label.es.toLowerCase()
const lowerFirst = (t) => (/^[A-Z]{2}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1))

/** Texto de la respuesta (Markdown simple) y si va con la tarjeta de la lista. */
export function integrationReply(lang, q) {
  const en = lang === 'en'
  if (q.known.length) {
    const names = q.known.map((it) => `**${it.name}**`)
    const cats = [...new Set(q.known.map((it) => (en ? lowerFirst(it.label.en) : lowerFirst(it.label.es))))]
    const text = en
      ? `Yes! Agent CEO integrates with ${join(names, 'en')} (${cats.join(' · ')}). Your agents work right inside it, no copy-pasting, and they ask you before anything important.`
      : `¡Sí! Agent CEO se integra con ${join(names, 'es')} (${cats.join(' · ')}). Tus agentes trabajan directamente ahí, sin copiar y pegar, y lo importante te lo preguntan antes.`
    return { text, cta: null, known: q.known.map((it) => it.name) }
  }
  const x = q.unknown.charAt(0).toUpperCase() + q.unknown.slice(1)
  const text = en
    ? `I can't confirm ${x} just yet, but we're adding integrations all the time: there are already ${TOTAL}, from stores and payments to CRMs, socials and accounting. Join the waitlist and tell us what you use, or email [info@agentceo.io](mailto:info@agentceo.io).`
    : `Con ${x} todavía no te lo puedo confirmar, pero estamos sumando integraciones todo el tiempo: ya son ${TOTAL}, entre tiendas, pagos, CRM, redes y contabilidad. Apúntate a la lista y cuéntanos qué usas, o escríbenos a [info@agentceo.io](mailto:info@agentceo.io).`
  return { text, cta: 'waitlist', known: [] }
}
