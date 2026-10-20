// ─────────────────────────────────────────────────────────────────────────────
// ANTI-ABUSO del widget (adenda T32, Diego: «nadie, usuario o competidor, debe poder quemar
// tokens»). Piezas puras, sin estado: el estado (contadores, caché, sesiones verificadas) vive
// en el Durable Object ChatGuard (guard.js). Mapa completo de capas en docs/DUDAS.md (T32).
//
//   capa                         dónde                                 efecto
//   ráfaga por IP (10/min)       RL_CHAT nativo (channels/core.js)     429
//   hora / día por IP (30 · 60)  ChatGuard.hitAll (core.js)            429
//   minuto/hora/día por sesión   ChatGuard.hitAll (core.js)            429
//   longitud (500) y turnos (12) channels/web.js · respond.js          400 · cierre amable
//   salida máxima (400 tokens)   respond.js (techo duro: env solo baja) —
//   tope global $5/día           ChatGuard «budget» (reserva atómica)  stub
//   tope live por IP (25/día; 10 sin Turnstile) ChatGuard por IP          stub
//   bot / UA sospechoso          suspicion() → respond.js              stub, nunca live
//   pregunta repetida            ChatGuard.seen (dedupe 10 min)        caché o stub, no gasta
//   preguntas idénticas          ChatGuard.tget/tput (caché 6 h)       respuesta cacheada, no gasta
//   Turnstile (si configurado)   verifyTurnstile() → respond.js        sin verificar: stub + reto
//   historial al modelo (4.000)  live.js historyForModel               recorta lo que se paga
//   logs                         counter(): solo contadores, sin PII   —
// ─────────────────────────────────────────────────────────────────────────────

export const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

// Clientes automáticos conocidos (no son navegadores de una persona).
const TOOL_UA = /\b(curl|wget|python|httpie|go-http|java\/|okhttp|node-fetch|undici|axios|aiohttp|libwww|postman|insomnia|scrapy|headless|phantomjs|selenium|puppeteer|playwright|crawler|spider|bot\b|bot\/)/i

/**
 * Señales de tráfico automático. Devuelve la lista de motivos ([] = parece una persona).
 * Un motivo NO bloquea el chat (el stub es gratis): solo impide el modo live.
 */
export function suspicion({ ua = '', acceptLanguage = '' } = {}) {
  const why = []
  if (!ua.trim()) why.push('no_ua')
  else if (TOOL_UA.test(ua)) why.push('tool_ua')
  if (!acceptLanguage.trim()) why.push('no_lang')
  return why
}

/** Normaliza una pregunta para compararla (minúsculas, sin tildes, sin signos, espacios simples). */
export function normQ(text = '') {
  return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()
}

/** Hash de una pregunta normalizada (caché y dedupe): nunca se guarda ni se registra el texto. */
export async function textKey(lang, text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`agentceo-chat-q:${lang}:${normQ(text)}`))
  return `q:${[...new Uint8Array(buf)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('')}`
}

/** ¿Lleva datos personales? (correo, teléfono o 7+ dígitos, URL). Esas preguntas no se cachean. */
export function hasPII(text = '') {
  return /[\w.+-]+@[\w-]+\.[\w.]+|https?:\/\/|www\.|(\d[\s.-]?){7,}/i.test(text)
}

/**
 * Verifica un token de Cloudflare Turnstile en el servidor (siteverify). `fetchImpl` se inyecta
 * en tests. Cualquier fallo (red, token vacío, respuesta rara) = NO verificado.
 */
export async function verifyTurnstile({ secret, token, ip, fetchImpl = fetch }) {
  if (!secret || !token || typeof token !== 'string' || token.length > 4096) return false
  try {
    const body = new FormData()
    body.append('secret', secret)
    body.append('response', token)
    if (ip) body.append('remoteip', ip)
    const r = await fetchImpl(TURNSTILE_VERIFY, { method: 'POST', body })
    if (!r.ok) return false
    const d = await r.json()
    return d?.success === true
  } catch {
    return false
  }
}

// Campos que PUEDEN ir a los logs: solo etiquetas de un conjunto cerrado. Nada de IP, texto,
// correo, sesión ni hash (un hash de IP sigue siendo un identificador).
const SAFE = new Set(['ev', 'channel', 'path', 'reason', 'limit', 'mode', 'lang'])
const LABEL = /^[a-z0-9_:-]{1,40}$/

/** Registro de CONTADORES (adenda T32): una línea JSON por evento, sin datos personales. */
export function counter(ev, data = {}, log = console.log) {
  const out = { t: 'chat', ev }
  for (const [k, v] of Object.entries(data)) {
    if (SAFE.has(k) && typeof v === 'string' && LABEL.test(v)) out[k] = v
  }
  log(JSON.stringify(out))
  return out
}
