// ─────────────────────────────────────────────────────────────────────────────
// CANAL WEB · el widget «Tu CEO» (POST /api/chat, respuesta en SSE). Cumple el contrato de
// channels/index.js: traduce HTTP ⇄ mensaje normalizado y nada más. Las decisiones (límites,
// stub/live, Turnstile, caché) son del núcleo, iguales para cualquier canal.
// Privacidad: el contenido de los chats NO se guarda ni se registra; la IP solo viaja en
// memoria (para siteverify de Turnstile) y como HASH en los límites.
// ─────────────────────────────────────────────────────────────────────────────
import { json } from '../../lib/http.js'
import { foreignOrigin } from '../../lib/ratelimit.js'
import { sseStream, sseHeaders } from '../sse.js'
import { ipKey } from '../guard.js'
import { suspicion } from '../abuse.js'
import { LIMITS } from './index.js'

const SID = /^[A-Za-z0-9_-]{16,64}$/
const MASKED = /^[a-z0-9]\*{3}@[a-z0-9]?\*{3}(\.[a-z0-9-]{1,12}){0,3}$/i

/** Valida y normaliza el cuerpo del widget. Devuelve { lang, history, userText, turns } o { error }. */
export function parseChat(body) {
  if (!body || typeof body !== 'object' || !Array.isArray(body.messages)) return { error: 'invalid_body' }
  const lang = body.locale === 'en' ? 'en' : 'es'
  // Turnos contados ANTES de recortar. Ojo: el historial lo envía el cliente, así que esto es
  // un tope de experiencia/tamaño; los límites que protegen de verdad son los del servidor.
  const turns = body.messages.filter((m) => m?.role === 'user').length
  const msgs = body.messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-24)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, m.role === 'user' ? LIMITS.maxChars : 2000) }))
    .filter((m) => m.content)
  const last = msgs[msgs.length - 1]
  if (!last || last.role !== 'user') return { error: 'invalid_body' }
  if (body.messages[body.messages.length - 1]?.content?.length > LIMITS.maxChars) return { error: 'too_long' }
  return { lang, userText: last.content, turns, history: msgs.slice(-(LIMITS.maxHistory * 2)) }
}

export const web = {
  name: 'web',

  precheck(request) {
    if (request.method !== 'POST') return { error: 'method', status: 405, headers: { allow: 'POST' } }
    if (foreignOrigin(request)) return { error: 'forbidden', status: 403 }
    return null
  },

  async who(request) {
    const ip = request.headers.get('cf-connecting-ip') || 'local'
    return { ip, userKey: await ipKey(ip) }
  },

  async parse(request, env, who) {
    let body
    try { body = await request.json() } catch { body = null }
    const p = parseChat(body)
    if (p.error) return { error: p.error, status: 400 }
    const ua = request.headers.get('user-agent') || ''
    const acceptLanguage = request.headers.get('accept-language') || ''
    return {
      msg: {
        channel: 'web',
        sessionId: typeof body.session === 'string' && SID.test(body.session) ? body.session : null,
        // Chip pulsado (T35): id de una respuesta curada (content/chat-answers.js). Solo un id con
        // forma válida; si no existe, se ignora y se responde al texto.
        chip: typeof body.chip === 'string' && /^[a-z0-9-]{1,40}$/.test(body.chip) ? body.chip : null,
        userKey: who.userKey,
        ...p,
        // T60: «ya me apunté» que manda el navegador. NO se confía en él para nada sensible: solo evita volver a
        // pedir el correo. El correo llega ENMASCARADO y solo se acepta con esa forma (se le devuelve a la misma
        // persona; nunca revela nada de otros).
        signedUp: body.signedUp === true,
        signedUpEmail: body.signedUp === true && typeof body.signedUpEmail === 'string' && MASKED.test(body.signedUpEmail) ? body.signedUpEmail : null,
        signals: {
          ip: who.ip,
          ua,
          acceptLanguage,
          turnstileToken: typeof body.turnstile === 'string' ? body.turnstile : null,
          suspicious: suspicion({ ua, acceptLanguage }),
        },
      },
    }
  },

  open(env) {
    const { readable, send, close } = sseStream()
    return { send, close, response: new Response(readable, { headers: sseHeaders }), delay: Number(env.CHAT_STUB_DELAY_MS ?? 18) }
  },

  reject({ error, status, headers = {}, retryAfter }) {
    return json({ ok: false, error }, status, retryAfter ? { ...headers, 'retry-after': String(retryAfter) } : headers)
  },
}
