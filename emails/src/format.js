// Formatos por idioma. Deterministas (zona UTC salvo que el dato traiga la suya): mismo dato → mismo correo.
const TAG = { es: 'es-CO', en: 'en-US', pt: 'pt-BR' }

export function fmtDate(locale, iso, opts = { day: 'numeric', month: 'long' }, timeZone = 'UTC') {
  if (!iso) return ''
  return new Intl.DateTimeFormat(TAG[locale], { timeZone, ...opts }).format(new Date(iso))
}

export function fmtDateTime(locale, iso, timeZone) {
  timeZone ||= 'UTC'
  return fmtDate(locale, iso, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }, timeZone)
}

/** Etiqueta corta de la cabecera: «20 oct» / «Oct 20». */
export function fmtShort(locale, iso, timeZone = 'UTC') {
  return fmtDate(locale, iso, { day: 'numeric', month: 'short' }, timeZone).replace('.', '')
}

/** Importe en USD como en la landing: «$29» si es entero, «$29,50» / «$29.50» si no. */
export function money(locale, n) {
  const whole = Number.isInteger(n)
  const s = new Intl.NumberFormat(TAG[locale], { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 }).format(n)
  return `$${s} USD`
}

export function num(locale, n) {
  return new Intl.NumberFormat(TAG[locale]).format(n)
}

/** Saludo sin nombre → «Hola» a secas; nunca «Hola, ,» (regla de NeuralOS). */
export const hi = (locale, name) => (locale === 'es' ? (name ? `Hola, ${name}.` : 'Hola.') : locale === 'pt' ? (name ? `Olá, ${name}.` : 'Olá.') : name ? `Hi ${name},` : 'Hi there,')
/** «Ana, …» o nada. */
export const lead = (name, rest) => (name ? `${name}, ${rest.charAt(0).toLowerCase()}${rest.slice(1)}` : rest)

/** Texto fijo por idioma (es/en/pt): pt cae a en si falta. */
export const tr = (locale, es, en, pt) => (locale === 'es' ? es : locale === 'pt' ? (pt ?? en) : en)
