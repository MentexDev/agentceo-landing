// ─────────────────────────────────────────────────────────────────────────────
// NÚCLEO del widget, NEUTRO DE CANAL: decide y emite la respuesta (stub BM25 gratis o live
// por OpenRouter), con caída a stub ante CUALQUIER problema. No sabe de HTTP, SSE ni del runtime
// de Workers: recibe un mensaje normalizado (`p`, ver channels/index.js) y emite eventos por
// `send(evento, datos)` — 'meta' | 'delta' (y el canal cierra con 'done'). Lo usan el canal
// web (channels/web.js, topes en el Durable Object) y scripts/chat-evals.mjs (topes en
// memoria): las evals prueban EXACTAMENTE el mismo camino que producción.
//
// `guards` (los pone quien llama; si falta uno, gana la opción SEGURA = no gastar):
//   liveIp()            → ¿le quedan respuestas live hoy a esta IP?               (bool)
//   reserve(usd, cap)   → reserva atómica de gasto contra el tope del día         ({ allowed })
//   settle(deltaUsd)    → ajuste al coste real (o devolución)                     (void)
//   dedupe(qk)          → ¿esta sesión/IP ya hizo esta misma pregunta hace poco?  (bool)
//   cacheGet(qk)        → respuesta live cacheada para la pregunta idéntica       (texto | null)
//   cachePut(qk, texto) → guarda una respuesta live limpia                        (void)
//   human()             → ¿persona verificada (Turnstile)?  { ok, open?, siteKey?, reason? }
//                         (open: Turnstile sin configurar → se permite live con el tope por IP
//                          estricto; lo decide guardsFor en channels/index.js)
//
// ORDEN de las capas (de la más barata a la que gasta):
//   turnos → CURADA (chip o texto con alta confianza, T35: coste 0 en cualquier modo)
//   → modo/clave/modelo con precio → intención o FAQ exacta (gratis) → señales de bot → pregunta repetida
//   → caché → Turnstile → tope live por IP → reserva del tope global → modelo.
// ─────────────────────────────────────────────────────────────────────────────
import { streamText } from './text.js'
import { stubReply, KB, INDEX } from './stub.js'
import { liveReply, pickContext, systemPrompt, estimateUSD, historyForModel, priceFor, DEFAULT_MODEL } from './live.js'
import { say, intentOf } from './persona.js'
import { textKey, hasPII } from './abuse.js'
import { matchCurated, curatedReply, chipIdsFor, langOf } from './curated.js'
import { answerById } from '../../content/chat-answers.js'

// Salida máxima: 400 tokens es TECHO DURO. CHAT_MAX_TOKENS solo puede bajarlo.
export const LIVE = { maxTokens: 400, timeoutMs: 15000 }
export const maxTokensFor = (env) => Math.max(1, Math.min(LIVE.maxTokens, Number(env.CHAT_MAX_TOKENS) || LIVE.maxTokens))

// Tope de gasto diario: $5 es TECHO DURO (Diego). CHAT_DAILY_BUDGET_USD solo puede bajarlo; un
// valor no numérico, negativo o ausente vale 5. (Auditoría T33: con `Number('5$')` = NaN la
// comparación `gastado + reserva > NaN` es siempre falsa y la reserva no frenaba NADA.)
export const BUDGET_MAX_USD = 5
export function budgetCap(env) {
  const v = Number(env.CHAT_DAILY_BUDGET_USD)
  return Number.isFinite(v) && v >= 0 && String(env.CHAT_DAILY_BUDGET_USD ?? '').trim() !== '' ? Math.min(BUDGET_MAX_USD, v) : BUDGET_MAX_USD
}

async function sendStub(send, lang, userText, delay, fallback = null, extra = {}) {
  const s = stubReply(lang, userText)
  await send('meta', { ...s.meta, ...(fallback ? { fallback } : {}), ...extra })
  await streamText(send, s.text, delay)
}

const no = async () => false
const none = async () => null

/**
 * p = mensaje normalizado { lang, userText, turns, history, signals? { suspicious: [] } }
 * mode = CHAT_MODE · env (OPENROUTER_API_KEY, CHAT_MODEL, CHAT_DAILY_BUDGET_USD…)
 * Devuelve un resumen para tests/evals/contadores: { path, reason?, cost? }.
 */
/**
 * ¿Respuesta curada? Chip con id curado → siempre; si no, texto libre sin intención de la persona
 * (saludo, «¿eres humano?», gracias, unirse, contacto: esas las responde la persona) que case con
 * alta confianza (curated.js). Devuelve { id, how, lang } | null.
 */
export function curatedFor(p) {
  if (p.chip && answerById(p.chip)) return { id: p.chip, how: 'chip', lang: p.lang }
  if (intentOf(p.userText)) return null
  const m = matchCurated(p.userText)
  return m ? { id: m.id, how: m.how, lang: langOf(p.userText, p.lang) } : null
}

export async function respond({ p, mode, env, guards = {}, send: rawSend, delay = 18, fetchImpl, capTurns }) {
  // Toda meta con chips lleva sus ids curados (el cliente los devuelve en `chip` al pulsarlos).
  const send = (ev, d) => rawSend(ev, ev === 'meta' && d?.chips && !d.chipIds ? { ...d, chipIds: chipIdsFor(d.chips) } : d)
  const g = {
    liveIp: guards.liveIp || no,
    reserve: guards.reserve || (async () => ({ allowed: false })),
    settle: guards.settle || (async () => {}),
    dedupe: guards.dedupe || no,
    cacheGet: guards.cacheGet || none,
    cachePut: guards.cachePut || (async () => {}),
    human: guards.human || (async () => ({ ok: false, reason: 'no_turnstile' })),
  }

  if (p.turns > capTurns) {
    await send('meta', { mode: 'stub', kind: 'cap', cta: 'waitlist', chips: [], matched: null, sources: [] })
    await streamText(send, say(p.lang, 'cap'), delay)
    return { path: 'cap' }
  }

  // CAPA CURADA (T35): las preguntas comunes nunca llegan al modelo. Coste 0, al instante.
  const cur = curatedFor(p)
  if (cur) {
    const r = curatedReply(cur.id, cur.lang)
    await send('meta', r.meta)
    await streamText(send, r.text, delay)
    return { path: 'curated', reason: cur.how }
  }

  const apiKey = env.OPENROUTER_API_KEY
  if (mode !== 'live' || !apiKey) {
    await sendStub(send, p.lang, p.userText, delay)
    return { path: 'stub', reason: mode === 'live' ? 'no_key' : 'mode' }
  }
  // Un modelo sin precio conocido (o una variante :batch) NUNCA va live: no se puede gastar sin
  // poder contar.
  const model = env.CHAT_MODEL || DEFAULT_MODEL
  if (!priceFor(model)) {
    await sendStub(send, p.lang, p.userText, delay, 'model_price')
    return { path: 'stub', reason: 'model_price' }
  }

  // Intención clara o clic en una pregunta del FAQ → la respuesta exacta del sitio, gratis.
  const stub = stubReply(p.lang, p.userText)
  if (stub.meta.kind.startsWith('intent:') || stub.meta.matched?.title?.toLowerCase() === p.userText.toLowerCase()) {
    await send('meta', stub.meta)
    await streamText(send, stub.text, delay)
    return { path: 'stub', reason: 'exact' }
  }

  // Tráfico automático (UA de herramienta, sin idioma…): nunca live.
  if (p.signals?.suspicious?.length) {
    await sendStub(send, p.lang, p.userText, delay, 'suspicious')
    return { path: 'stub', reason: 'suspicious' }
  }

  // Caché y dedupe SOLO para preguntas sin contexto previo (primer turno) y sin datos personales:
  // con historial, la misma frase puede significar otra cosa.
  const cacheable = p.history.length <= 1 && !hasPII(p.userText)
  const qk = cacheable ? await textKey(p.lang, p.userText) : null
  const liveMetaBase = { mode: 'live', cta: null, chips: stub.meta.chips, matched: null, sources: [] }
  const serveCached = async (text, reason) => {
    await send('meta', { ...liveMetaBase, kind: 'cache' })
    await streamText(send, text, delay)
    return { path: 'cache', reason }
  }

  if (qk && (await g.dedupe(qk))) {
    const cached = await g.cacheGet(qk)
    if (cached) return serveCached(cached, 'dup')
    await sendStub(send, p.lang, p.userText, delay, 'dup')
    return { path: 'stub', reason: 'dup' }
  }
  if (qk) {
    const cached = await g.cacheGet(qk)
    if (cached) return serveCached(cached, 'hit')
  }

  // Persona verificada con Turnstile ANTES de gastar (si está configurado; sin configurar, el canal
  // decide: hoy se permite con el tope por IP estricto, ver guardsFor).
  const h = await g.human()
  if (!h.ok) {
    await sendStub(send, p.lang, p.userText, delay, h.reason || 'challenge', h.siteKey ? { challenge: { turnstile: h.siteKey } } : {})
    return { path: 'stub', reason: h.reason || 'challenge' }
  }

  if (!(await g.liveIp())) {
    await sendStub(send, p.lang, p.userText, delay, 'ip_cap')
    return { path: 'stub', reason: 'ip_cap' }
  }

  const L = INDEX[p.lang] ? p.lang : 'es'
  const system = systemPrompt(L, pickContext(INDEX[L], KB[L], p.userText))
  const history = historyForModel(p.history) // lo que viaja al modelo Y lo que se reserva
  const maxTokens = maxTokensFor(env)
  const est = estimateUSD(system, history, maxTokens, model)
  const cap = budgetCap(env)
  if (!(await g.reserve(est, cap)).allowed) {
    await sendStub(send, p.lang, p.userText, delay, 'budget')
    return { path: 'stub', reason: 'budget' }
  }

  let started = false
  const liveMeta = { ...liveMetaBase, kind: 'live' }
  const r = await liveReply({
    system,
    history,
    apiKey,
    model,
    fetchImpl,
    maxTokens,
    timeoutMs: Number(env.CHAT_LIVE_TIMEOUT_MS || LIVE.timeoutMs),
    onDelta: async (t) => {
      if (!started) { started = true; await send('meta', liveMeta) }
      await send('delta', { t })
    },
  })

  // Contabilidad: error HTTP sin texto → no factura, se devuelve la reserva; con consumo
  // conocido → coste real (el mayor entre tokens × precio y el que informa OpenRouter); corte de
  // red/tiempo o error a mitad sin consumo conocido → la reserva se queda (pesimista).
  if (!r.ok && r.reason === 'http') await g.settle(-est)
  else if (r.usage) await g.settle(r.cost - est)

  if (!r.ok) {
    await sendStub(send, p.lang, p.userText, delay, r.reason)
    return { path: 'stub', reason: r.reason }
  }
  if (r.reason === 'leak') {
    if (!started) await send('meta', liveMeta)
    await streamText(send, `${r.text ? '\n\n' : ''}${say(p.lang, 'guard')}`, delay)
    return { path: 'live', reason: 'leak', cost: r.cost }
  }
  if (r.reason) {
    await streamText(send, `…\n\n${say(p.lang, 'cut')}`, delay)
    return { path: 'live', reason: r.reason, cost: r.cost }
  }
  // Respuesta limpia y completa → a la caché para la próxima pregunta idéntica.
  if (qk && !hasPII(r.text)) await g.cachePut(qk, r.text)
  return { path: 'live', cost: r.cost }
}
