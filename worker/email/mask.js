// Logs sin PII completa ni secretos. Todo lo que va a console.* o a last_error pasa por aquí.

/** «ana.perez@gmail.com» → «a***@g***.com». Nunca devuelve el correo entero. */
export function maskEmail(email) {
  const s = String(email || '')
  const at = s.lastIndexOf('@')
  if (at < 1) return '***'
  const domain = s.slice(at + 1)
  const dot = domain.lastIndexOf('.')
  const host = dot > 0 ? domain.slice(0, dot) : domain
  const tld = dot > 0 ? domain.slice(dot) : ''
  return `${s[0]}***@${host[0] || ''}***${tld}`
}

const EMAILS = /[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+\.[a-z]{2,}/gi

/**
 * Texto apto para logs: enmascara los correos, tapa los secretos y recorta.
 * @param {unknown} text
 * @param {{ secrets?: (string|undefined)[], max?: number }} [opts]
 */
export function scrub(text, { secrets = [], max = 300 } = {}) {
  let s = String(text ?? '')
  for (const secret of secrets) if (secret && secret.length >= 8) s = s.split(secret).join('***')
  return s.replace(EMAILS, (m) => maskEmail(m)).replace(/\s+/g, ' ').trim().slice(0, max)
}

/** Una línea JSON por evento (Workers Logs la indexa). */
export function logEvent(level, evt, fields = {}) {
  const line = JSON.stringify({ evt, ...fields })
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}
