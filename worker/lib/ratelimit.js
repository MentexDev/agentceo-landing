// Límite de tasa por IP + ruta con el binding nativo de Workers (RL_FORMS).
// Si el binding no existe (entorno sin configurar) se deja pasar: es preferible
// perder el límite a tumbar la lista de espera. El honeypot y la trampa de tiempo
// siguen protegiendo.
import { json } from './http.js'

/**
 * La clave de quien pide. IPv4 tal cual; IPv6 por su /64 (T58): un proveedor da a cada cliente un /64
 * entero, así que rotar dentro de él (2^64 direcciones) saltaba el límite por IP.
 */
export function ipKey(ip) {
  const s = String(ip || '').trim().toLowerCase()
  if (!s) return 'local'
  if (!s.includes(':')) return s
  // Expande «::» para quedarse con los 4 primeros grupos (el /64).
  const [head, tail = ''] = s.split('::')
  const h = head ? head.split(':') : []
  const t = s.includes('::') ? (tail ? tail.split(':') : []) : []
  const groups = s.includes('::') ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t] : h
  return `${groups.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, '') || '0').join(':')}::/64`
}

export async function limited(request, env, binding = 'RL_FORMS') {
  const rl = env[binding]
  if (!rl || typeof rl.limit !== 'function') return null
  const ip = ipKey(request.headers.get('cf-connecting-ip'))
  const key = `${ip}:${new URL(request.url).pathname}`
  const { success } = await rl.limit({ key })
  if (success) return null
  return json({ ok: false, error: 'rate_limited' }, 429, { 'retry-after': '60' })
}

/** Rechaza POST desde otro origen (formularios embebidos en sitios ajenos). */
export function foreignOrigin(request) {
  const origin = request.headers.get('origin')
  if (!origin) return false // navegadores antiguos / sin JS: lo cubren honeypot y rate limit
  try {
    return new URL(origin).host !== new URL(request.url).host
  } catch {
    return true
  }
}
