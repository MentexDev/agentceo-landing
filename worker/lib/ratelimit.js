// Límite de tasa por IP + ruta con el binding nativo de Workers (RL_FORMS).
// Si el binding no existe (entorno sin configurar) se deja pasar: es preferible
// perder el límite a tumbar la lista de espera. El honeypot y la trampa de tiempo
// siguen protegiendo.
import { json } from './http.js'

export async function limited(request, env, binding = 'RL_FORMS') {
  const rl = env[binding]
  if (!rl || typeof rl.limit !== 'function') return null
  const ip = request.headers.get('cf-connecting-ip') || 'local'
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
