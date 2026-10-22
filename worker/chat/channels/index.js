// ─────────────────────────────────────────────────────────────────────────────
// BACKEND DEL CHAT AGNÓSTICO DE CANAL (adenda T32). Hoy: web (widget). Después: WhatsApp
// (NO se construye ahora: aquí solo queda el contrato que tendrá que cumplir).
//
// CONTRATO de un canal — un objeto con:
//   name                       'web' | 'whatsapp' | …
//   who(input)                 → { ip?, userKey }   identidad para los límites, ANTES de parsear
//                                 (userKey = hash: nunca el identificador en claro)
//   parse(input, env)          → { msg } | { error, status, headers? }
//      msg = MENSAJE NORMALIZADO:
//        { channel, sessionId|null, userKey, lang: 'es'|'en', userText, turns, chip?: id curado,
//          history: [{ role: 'user'|'assistant', content }],
//          signals: { ip?, ua?, acceptLanguage?, turnstileToken?, suspicious: [] } }
//   open(env)                  → { send(evento, datos), close(), response, delay }
//      eventos: 'meta' (procedencia, CTA, chips) · 'delta' (trozo de texto) · 'error' · 'done'.
//      Web los emite como SSE; un canal sin streaming (WhatsApp) junta los 'delta' y envía al
//      recibir 'done'.
//   reject({ error, status, retryAfter? }) → respuesta del canal a un rechazo (web: JSON 4xx)
//
// El núcleo (runChannel) aplica a TODOS los canales lo mismo: límites por usuario y sesión,
// la decisión stub/live (respond.js, que no sabe de HTTP ni de SSE) y los contadores sin PII.
// ─────────────────────────────────────────────────────────────────────────────
import { respond, curatedFor } from '../respond.js'
import { intentOf } from '../persona.js'
import { today, hourOf, minuteOf, sessionKey } from '../guard.js'
import { verifyTurnstile, counter, srcOf } from '../abuse.js'
import { turnstileConfig } from '../../lib/turnstile.js'

// Los límites viven en un módulo puro (sin runtime de Workers) para que también los lean las
// evals en Node (scripts/chat-evals.mjs).
import { LIMITS } from '../limits.js'
export { LIMITS }

const guardOf = (env, name) => env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName(name))

/** Ráfaga por usuario (binding nativo, ventana de 60 s). Va ANTES de parsear: frena también floods de basura. */
export async function checkBurst(who, env) {
  if (!env.RL_CHAT || typeof env.RL_CHAT.limit !== 'function') return { ok: true }
  const { success } = await env.RL_CHAT.limit({ key: `chat:${who.userKey}` })
  return success ? { ok: true } : { ok: false, error: 'rate_limited', limit: 'ip_burst', retryAfter: 60 }
}

/** Hora y día por usuario; minuto, hora y día por sesión. { ok } | { ok: false, error, limit, retryAfter } */
export async function checkLimits(who, sessionId, env) {
  if (!env.CHAT_GUARD) return { ok: true }
  const d = new Date()
  const ip = await guardOf(env, who.userKey).hitAll([[`hr:${hourOf(d)}`, LIMITS.ipHour], [`day:${today(d)}`, LIMITS.ipDay]])
  if (!ip.allowed) return ip.key.startsWith('day') ? { ok: false, error: 'daily_limit', limit: 'ip_day', retryAfter: 3600 } : { ok: false, error: 'rate_limited', limit: 'ip_hour', retryAfter: 600 }
  if (sessionId) {
    const s = await guardOf(env, await sessionKey(sessionId)).hitAll([[`mn:${minuteOf(d)}`, LIMITS.sessionMinute], [`hr:${hourOf(d)}`, LIMITS.sessionHour], [`day:${today(d)}`, LIMITS.sessionDay]])
    if (!s.allowed) {
      const limit = { mn: 'session_minute', hr: 'session_hour', day: 'session_day' }[s.key.split(':')[0]]
      return { ok: false, error: limit === 'session_day' ? 'daily_limit' : 'rate_limited', limit, retryAfter: limit === 'session_minute' ? 60 : 600 }
    }
  }
  return { ok: true }
}

/** Topes y memorias del modo live sobre el Durable Object (ver guard.js y abuse.js). */
export function guardsFor(msg, env, { verifyFetch } = {}) {
  if (!env.CHAT_GUARD) return {} // sin DO: respond.js elige siempre la opción segura (no gastar)
  const day = today()
  const user = () => guardOf(env, msg.userKey)
  const budget = () => guardOf(env, 'budget')
  const cache = () => guardOf(env, 'cache')
  // La memoria de la sesión (dedupe, verificación) vive en su instancia; sin sesión, en la del usuario.
  const mem = async () => (msg.sessionId ? guardOf(env, await sessionKey(msg.sessionId)) : user())
  const turnstileOn = turnstileConfig(env).enabled
  return {
    liveIp: async () => (await user().bump(`live:${day}`, 1, turnstileOn ? LIMITS.livePerDay : LIMITS.livePerDayOpen)).allowed,
    reserve: (usd, cap) => budget().bump(`usd:${day}`, usd, cap),
    settle: async (delta) => { if (delta) await budget().adjust(`usd:${day}`, delta) },
    dedupe: async (qk) => (await mem()).seen(`d:${qk}`, LIMITS.dedupeMs),
    cacheGet: (qk) => cache().tget(`c:${qk}`),
    cachePut: (qk, text) => cache().tput(`c:${qk}`, text, LIMITS.cacheMs),
    human: async () => {
      // Sin Turnstile configurado: live permitido (T33), con el cupo estricto de liveIp.
      if (!turnstileOn) return { ok: true, open: true }
      const m = await mem()
      if (await m.tget('human')) return { ok: true }
      const token = msg.signals?.turnstileToken
      if (token && (await verifyTurnstile({ secret: env.TURNSTILE_SECRET_KEY, token, ip: msg.signals?.ip, fetchImpl: verifyFetch }))) {
        await m.tput('human', '1', LIMITS.humanMs)
        return { ok: true }
      }
      return { ok: false, reason: 'challenge', siteKey: env.TURNSTILE_SITE_KEY }
    },
  }
}

/**
 * Atiende un mensaje de CUALQUIER canal: modo → identidad y límites → parseo → respuesta.
 * `fetchImpl` (OpenRouter) y `verifyFetch` (Turnstile) se inyectan en tests: nunca red real.
 */
export async function runChannel(channel, input, env, ctx, { fetchImpl, verifyFetch, log } = {}) {
  const mode = env.CHAT_MODE || 'off'
  if (mode === 'off') return channel.reject({ error: 'disabled', status: 404 })

  const pre = channel.precheck?.(input)
  if (pre?.error) return channel.reject(pre)

  const who = await channel.who(input)
  const burst = await checkBurst(who, env)
  if (!burst.ok) {
    counter('limit', { channel: channel.name, limit: burst.limit }, log)
    return channel.reject({ error: burst.error, status: 429, retryAfter: burst.retryAfter })
  }
  const parsed = await channel.parse(input, env, who)
  if (parsed.error) return channel.reject(parsed)
  const msg = parsed.msg

  // Respuestas GRATIS (T35 · adenda, Diego): saludo y demás intenciones de la persona, y fichas
  // curadas, no gastan el cupo por IP ni por sesión (hora/día): cuestan 0 y no tocan el modelo. La
  // ráfaga (RL_CHAT, 10/min por IP) sí aplica a todo: frena el abuso por volumen.
  const free = msg.turns <= LIMITS.maxTurns && Boolean(intentOf(msg.userText) || curatedFor(msg))
  const lim = free ? { ok: true } : await checkLimits(who, msg.sessionId, env)
  if (!lim.ok) {
    counter('limit', { channel: channel.name, limit: lim.limit }, log)
    return channel.reject({ error: lim.error, status: 429, retryAfter: lim.retryAfter })
  }

  const { send, close, response, delay } = channel.open(env)
  const run = async () => {
    try {
      const r = await respond({ p: msg, mode, env, guards: guardsFor(msg, env, { verifyFetch }), send, delay, fetchImpl, capTurns: LIMITS.maxTurns })
      counter('answer', { channel: channel.name, path: r.path, src: srcOf(r.path), reason: r.reason || 'ok', lang: msg.lang }, log)
    } catch {
      counter('error', { channel: channel.name }, log)
      await send('error', { error: 'server_error' })
    } finally {
      await send('done', {})
      await close()
    }
  }
  if (ctx?.waitUntil) ctx.waitUntil(run())
  else run()
  return response
}
