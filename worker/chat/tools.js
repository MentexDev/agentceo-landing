// ─────────────────────────────────────────────────────────────────────────────
// HERRAMIENTAS del chat (T58b). Las mismas tres acciones por dos caminos:
//   · DETERMINISTA, sin modelo y gratis: persona.js → intentOf (join, goPricing, goFaq, contact) → stub.
//   · MODELO (modo live): se exponen como `tools` de OpenRouter (function calling, que Gemini 2.5 Flash Lite
//     soporta). El modelo decide; aquí se VALIDA y se APLICA. Argumentos solo de listas cerradas: nada de
//     URLs ni texto libre, así que una inyección no puede abrir enlaces arbitrarios ni escribir en la tarjeta.
// Coste: el esquema añade ~180 tokens de entrada por respuesta live (medido abajo, TOOLS_TOKENS), unos
// $0,000018 con Flash Lite ($0,10/M): con el tope de 2000 respuestas/día, como mucho ~$0,04/día.
// ─────────────────────────────────────────────────────────────────────────────

// Rutas públicas (las de src/i18n/rutas.js; un test las compara).
export const SECTIONS = {
  pricing: { es: '/precios/', en: '/en/pricing/', pt: '/pt/precos/', label: { es: 'ver precios', en: 'see pricing', pt: 'ver preços' } },
  faq: { es: '/#faq', en: '/en/#faq', pt: '/pt/#faq', label: { es: 'ver preguntas frecuentes', en: 'see the FAQ', pt: 'ver perguntas frequentes' } },
  blog: { es: '/blog/', en: '/en/blog/', pt: '/pt/blog/', label: { es: 'ir al blog', en: 'go to the blog', pt: 'ir para o blog' } },
  resources: { es: '/recursos/', en: '/en/resources/', pt: '/pt/recursos/', label: { es: 'ver recursos', en: 'see resources', pt: 'ver recursos' } },
  home: { es: '/', en: '/en/', pt: '/pt/', label: { es: 'ir al inicio', en: 'go to the home page', pt: 'ir para o início' } },
}

/** Esquema OpenAI/OpenRouter de las herramientas que ve el modelo. */
export const TOOLS = [
  { type: 'function', function: { name: 'show_waitlist_card', description: 'Show the inline "save my spot" waitlist form in the chat. Use when the user wants to sign up, register, join, get access or be notified.', parameters: { type: 'object', properties: {}, additionalProperties: false } } },
  { type: 'function', function: { name: 'open_section', description: 'Give the user a direct link to a public section of the website.', parameters: { type: 'object', properties: { section: { type: 'string', enum: Object.keys(SECTIONS) } }, required: ['section'], additionalProperties: false } } },
  { type: 'function', function: { name: 'contact_team', description: 'Give the user the human contact email (info@agentceo.io) when they want to talk to a person.', parameters: { type: 'object', properties: {}, additionalProperties: false } } },
]
export const TOOLS_JSON = JSON.stringify(TOOLS)
export const TOOLS_TOKENS = Math.ceil(TOOLS_JSON.length / 4)
const NAMES = new Set(TOOLS.map((t) => t.function.name))
export const CONTACT_EMAIL = 'info@agentceo.io'

/**
 * Valida y aplica las llamadas del modelo. Ignora lo desconocido o mal formado. Como mucho 3.
 * @param {{ name: string, args?: string }[]} calls
 * @param {string} lang  idioma del sitio (es/en/pt…)
 * @param {string} text  la respuesta del modelo (ya filtrada)
 * @returns {{ cta: 'waitlist'|null, append: string[], used: string[] }}
 */
export function applyTools(calls = [], lang = 'es', text = '') {
  const L = SECTIONS.home[lang] ? lang : 'es'
  const out = { cta: null, append: [], used: [] }
  for (const c of calls.slice(0, 3)) {
    if (!c || !NAMES.has(c.name)) continue
    let args = {}
    try { args = c.args ? JSON.parse(c.args) : {} } catch { continue }
    if (c.name === 'show_waitlist_card') { out.cta = 'waitlist'; out.used.push(c.name) }
    if (c.name === 'open_section') {
      const s = SECTIONS[args?.section]
      if (!s) continue
      if (!text.includes(`](${s[L]})`)) out.append.push(`[${s.label[L]}](${s[L]})`)
      out.used.push(`${c.name}:${args.section}`)
    }
    if (c.name === 'contact_team') {
      if (!text.includes(CONTACT_EMAIL)) out.append.push(`[${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL})`)
      out.used.push(c.name)
    }
  }
  out.append = [...new Set(out.append)]
  return out
}
