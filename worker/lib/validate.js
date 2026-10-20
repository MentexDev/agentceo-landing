// Validación y lectura del cuerpo de los formularios (compartida por /api/*).

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Lee JSON sin lanzar. Devuelve null si el cuerpo no es un objeto JSON. */
export async function readJson(request) {
  try {
    const body = await request.json()
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null
  } catch {
    return null
  }
}

/** Texto recortado y truncado; '' si no es texto. */
export const str = (v, max) => (typeof v === 'string' || typeof v === 'number' ? String(v).trim().slice(0, max) : '')

/** Correo normalizado (minúsculas) o '' si no es válido. */
export function cleanEmail(v) {
  const e = str(v, 160).toLowerCase()
  return EMAIL_RE.test(e) ? e : ''
}

/** Honeypot: el campo oculto `company` viene lleno → es un bot. */
export const isBot = (body) => typeof body.company === 'string' && body.company.trim() !== ''
