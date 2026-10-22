// Cloudflare Turnstile en el servidor (siteverify). Una sola pieza para todos los canales: la lista de
// espera (worker/waitlist.js) y el chat (worker/chat/abuse.js → verifyTurnstile).
//
// Turnstile está ACTIVO solo si existen las dos claves: TURNSTILE_SITE_KEY (var pública, wrangler.jsonc) y
// TURNSTILE_SECRET_KEY (secreto). Con una sola, todo sigue como antes: la página no carga el widget y el
// servidor no exige token. Así un deploy antes de crear el widget no rompe la lista.
//
// Resultado de siteverify, con tres desenlaces distintos (cada canal decide qué hacer con cada uno):
//   ok           → persona verificada
//   invalid      → token ausente, falso, caducado o ya usado: la respuesta de Turnstile es «no»
//   unavailable  → no hubo veredicto: red caída, timeout, 5xx, o un fallo NUESTRO de configuración
//                  (secreto inválido). No es culpa de quien rellena el formulario.

export const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const SITE_KEY = /^[\w-]{1,100}$/
// Códigos de siteverify que dicen «tu configuración está mal» o «Cloudflare falló», no «el token es malo».
const OUR_FAULT = new Set(['missing-input-secret', 'invalid-input-secret', 'internal-error'])

/** ¿Turnstile activo? Las dos claves, y la pública con forma de site key (va dentro del HTML). */
export function turnstileConfig(env = {}) {
  const siteKey = String(env.TURNSTILE_SITE_KEY || '').trim()
  const secret = String(env.TURNSTILE_SECRET_KEY || '').trim()
  return { enabled: Boolean(secret && SITE_KEY.test(siteKey)), siteKey, secret }
}

/** El token del cuerpo: `turnstile` (fetch del front) o `cf-turnstile-response` (formulario del widget). */
export function tokenFrom(body = {}) {
  const t = body.turnstile ?? body['cf-turnstile-response']
  return typeof t === 'string' ? t.trim() : ''
}

/**
 * @param {{ secret: string, token: string, ip?: string|null, fetchImpl?: typeof fetch, timeoutMs?: number }} p
 * @returns {Promise<{ ok: true } | { ok: false, reason: 'invalid'|'unavailable', codes: string[] }>}
 */
export async function siteverify({ secret, token, ip, fetchImpl = fetch, timeoutMs = 3000 }) {
  if (!secret) return { ok: false, reason: 'unavailable', codes: ['missing-input-secret'] }
  if (!token || typeof token !== 'string' || token.length > 2048) return { ok: false, reason: 'invalid', codes: ['missing-input-response'] }
  let r
  try {
    const body = new FormData()
    body.append('secret', secret)
    body.append('response', token)
    if (ip) body.append('remoteip', ip)
    r = await fetchImpl(TURNSTILE_VERIFY, { method: 'POST', body, signal: AbortSignal.timeout(timeoutMs) })
  } catch (e) {
    return { ok: false, reason: 'unavailable', codes: [e?.name === 'TimeoutError' ? 'timeout' : 'network'] }
  }
  if (!r.ok) return { ok: false, reason: 'unavailable', codes: [`http-${r.status}`] }
  let d
  try { d = await r.json() } catch { return { ok: false, reason: 'unavailable', codes: ['bad-json'] } }
  if (d?.success === true) return { ok: true }
  const codes = Array.isArray(d?.['error-codes']) ? d['error-codes'].map(String).slice(0, 5) : []
  return { ok: false, reason: codes.some((c) => OUR_FAULT.has(c)) ? 'unavailable' : 'invalid', codes }
}
