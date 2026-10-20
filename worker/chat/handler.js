// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chat · widget de soporte = el CANAL WEB del backend de chat (channels/).
//
// FLAG `CHAT_MODE` (wrangler.jsonc → vars):
//   off  → 404 (el widget no se pinta)
//   stub → respuestas del sitio sin LLM
//   live → OpenRouter (live.js), POR DEFECTO desde T33, SOLO si además: existe el secreto
//          OPENROUTER_API_KEY, CHAT_MODEL tiene precio conocido, la sesión superó Turnstile (si
//          está configurado; sin él, cupo por IP estricto), el tráfico no parece automático, a
//          la IP le quedan respuestas live hoy y la reserva cabe en el tope del día ($5). Si no,
//          o ante error/tiempo/respuesta vacía, cae a stub sin mostrar ningún error (respond.js).
//
// Anti-abuso por capas (adenda T32): mapa completo en worker/chat/abuse.js y docs/DUDAS.md.
// Privacidad: el contenido de los chats NO se guarda ni se registra; los logs son contadores.
// ─────────────────────────────────────────────────────────────────────────────
import { runChannel, LIMITS } from './channels/index.js'
import { web, parseChat } from './channels/web.js'

export { LIMITS, parseChat }

export function handleChat(request, env, ctx, opts = {}) {
  return runChannel(web, request, env, ctx, opts)
}
