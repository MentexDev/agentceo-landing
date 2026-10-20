// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat · widget de soporte.
//
// FLAG `CHAT_MODE` (wrangler.jsonc → vars):
//   off  → 404 (el widget no se pinta)
//   stub → respuestas del sitio sin LLM (DECISIÓN DE DIEGO: se queda aquí)
//   live → OpenRouter, SOLO si además existe el secreto OPENROUTER_API_KEY y queda
//          presupuesto del día (CHAT_DAILY_BUDGET_USD, $5). Si no, cae a stub.
//
// Anti-abuso: origen, 10 mensajes/min por IP (RL_CHAT), 60/día por IP y 12 turnos
// por conversación (ChatGuard), 500 caracteres por mensaje, historial recortado.
// Privacidad: el contenido de los chats NO se guarda ni se registra en ningún sitio.
// ─────────────────────────────────────────────────────────────────────────────
import { json } from '../lib/http.js'
import { limited, foreignOrigin } from '../lib/ratelimit.js'
import { sseStream, sseHeaders, streamText } from './sse.js'
import { stubReply, KB } from './stub.js'
import { liveReply } from './live.js'
import { say } from './persona.js'
import { today, ipKey } from './guard.js'

export const LIMITS = { maxChars: 500, maxTurns: 12, maxHistory: 6, perDay: 60 }

/** Valida y normaliza el cuerpo. Devuelve { lang, history, userText, turns } o { error }. */
export function parseChat(body) {
  if (!body || typeof body !== 'object' || !Array.isArray(body.messages)) return { error: 'invalid_body' }
  const lang = body.locale === 'en' ? 'en' : 'es'
  // Turnos contados ANTES de recortar. Ojo: el historial lo envía el cliente, así que esto es
  // un tope de experiencia/tamaño; el límite que protege de verdad es el diario por IP (servidor).
  const turns = body.messages.filter((m) => m?.role === 'user').length
  const msgs = body.messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-24)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, m.role === 'user' ? LIMITS.maxChars : 2000) }))
    .filter((m) => m.content)
  const last = msgs[msgs.length - 1]
  if (!last || last.role !== 'user') return { error: 'invalid_body' }
  if (body.messages[body.messages.length - 1]?.content?.length > LIMITS.maxChars) return { error: 'too_long' }
  return {
    lang,
    userText: last.content,
    turns,
    history: msgs.slice(-(LIMITS.maxHistory * 2)),
  }
}

async function dailyAllowed(env, request) {
  if (!env.CHAT_GUARD) return true
  const ip = request.headers.get('cf-connecting-ip') || 'local'
  const stub = env.CHAT_GUARD.get(env.CHAT_GUARD.idFromName(await ipKey(ip)))
  const r = await stub.bump(`day:${today()}`, 1, LIMITS.perDay)
  return r.allowed
}

const budgetStub = (env) => env.CHAT_GUARD?.get(env.CHAT_GUARD.idFromName('budget'))

export async function handleChat(request, env, ctx, { fetchImpl } = {}) {
  const mode = env.CHAT_MODE || 'off'
  if (mode === 'off') return json({ ok: false, error: 'disabled' }, 404)
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, { allow: 'POST' })
  if (foreignOrigin(request)) return json({ ok: false, error: 'forbidden' }, 403)
  const rl = await limited(request, env, 'RL_CHAT')
  if (rl) return rl

  let body
  try { body = await request.json() } catch { body = null }
  const p = parseChat(body)
  if (p.error) return json({ ok: false, error: p.error }, 400)
  if (!(await dailyAllowed(env, request))) return json({ ok: false, error: 'daily_limit' }, 429, { 'retry-after': '3600' })

  const { readable, send, close } = sseStream()
  const delay = Number(env.CHAT_STUB_DELAY_MS ?? 18)

  const run = async () => {
    try {
      // Tope de turnos: se cierra con amabilidad y se ofrece la lista.
      if (p.turns > LIMITS.maxTurns) {
        await send('meta', { mode: 'stub', kind: 'cap', cta: 'waitlist', chips: [], matched: null, sources: [] })
        await streamText(send, say(p.lang, 'cap'), delay)
        return
      }

      const wantsLive = mode === 'live' && env.OPENROUTER_API_KEY
      const budget = wantsLive ? budgetStub(env) : null
      const cap = Number(env.CHAT_DAILY_BUDGET_USD || 5)
      const canSpend = budget ? (await budget.get(`usd:${today()}`)) < cap : Boolean(wantsLive)

      if (wantsLive && canSpend) {
        const stub = stubReply(p.lang, p.userText)
        // Clic en una pregunta del FAQ o intención clara → respuesta exacta del sitio, gratis.
        if (stub.meta.kind.startsWith('intent:') || stub.meta.matched?.title?.toLowerCase() === p.userText.toLowerCase()) {
          await send('meta', stub.meta)
          await streamText(send, stub.text, delay)
          return
        }
        await send('meta', { mode: 'live', kind: 'live', cta: null, chips: stub.meta.chips, matched: null, sources: [] })
        const r = await liveReply({
          lang: p.lang,
          kb: KB[p.lang],
          history: p.history,
          apiKey: env.OPENROUTER_API_KEY,
          model: env.CHAT_MODEL || 'google/gemini-3.1-flash-lite',
          fetchImpl,
          onDelta: (t) => send('delta', { t }),
        })
        if (r.ok) {
          if (budget && r.cost > 0) await budget.bump(`usd:${today()}`, r.cost)
          return
        }
        // Fallo del proveedor: respuesta del sitio, nunca un error en blanco.
        await streamText(send, stubReply(p.lang, p.userText).text, delay)
        return
      }

      const s = stubReply(p.lang, p.userText)
      await send('meta', s.meta)
      await streamText(send, s.text, delay)
    } catch {
      await send('error', { error: 'server_error' })
    } finally {
      await send('done', {})
      await close()
    }
  }
  if (ctx?.waitUntil) ctx.waitUntil(run())
  else run()
  return new Response(readable, { headers: sseHeaders })
}
