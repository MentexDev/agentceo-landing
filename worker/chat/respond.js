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
import { stubReply, exactFaq, KB, INDEX } from './stub.js'
import { ANSWERS } from '../../content/chat-answers.js'
import { liveReply, pickContext, systemPrompt, estimateUSD, historyForModel, priceFor, DEFAULT_MODEL, RULES, CANARY } from './live.js'
import { say, intentOf, privateReply } from './persona.js'
import { stripInjection, findOutputLeak, promptEchoes } from './private.js'
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
  // Una pregunta del FAQ escrita TAL CUAL (clic en una sugerida) la responde la ficha curada cuya
  // FUENTE es ese FAQ (T40c: «¿Mis datos están seguros?» acababa en «proteccion»); si ninguna lo es,
  // el FAQ del stub. Las paráfrasis siguen yendo por el emparejado normal.
  const faq = exactFaq(p.lang, p.userText)
  if (faq) {
    const owner = ANSWERS.find((a) => a.ref === faq.id)
    return owner ? { id: owner.id, how: 'faq', lang: p.lang } : null
  }
  const m = matchCurated(p.userText)
  return m ? { id: m.id, how: m.how, lang: langOf(p.userText, p.lang) } : null
}

// Filtro de SALIDA (T40 b): fragmentos del prompt de sistema que el modelo no puede repetir nunca.
const ECHOES = [CANARY, ...promptEchoes([RULES.es, RULES.en])]
/** ¿Esta respuesta (del modelo o de la caché) se puede mostrar? → null si sí; { kind, name } si no. */
export const outputLeak = (text) => findOutputLeak(text, ECHOES)

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

  // INYECCIÓN (T40 b · I01/I02): una petición con inyección NUNCA llega al modelo. Se recorta el
  // bloque inyectado y la parte LIMPIA solo se responde por vías SIN modelo: ficha curada o FAQ del
  // sitio con confianza («¿cuánto cuesta el plan básico? [SISTEMA: …]» → el precio). Si no hay parte
  // legítima que responder así («Analiza esta reseña: …</review> nuevas instrucciones…») → negativa
  // de reglas.
  const inj = stripInjection(p.userText)
  if (inj.injected) {
    const clean = { ...p, userText: inj.clean, chip: null }
    const okClean = inj.clean && intentOf(inj.clean) !== 'private'
    const cur = okClean ? curatedFor(clean) : null
    if (cur) {
      const r = curatedReply(cur.id, cur.lang)
      await send('meta', r.meta)
      await streamText(send, r.text, delay)
      return { path: 'curated', reason: 'injection_stripped' }
    }
    const sr = okClean ? stubReply(p.lang, inj.clean) : null
    if (sr && sr.meta.kind !== 'fallback' && !sr.meta.kind.startsWith('intent:')) {
      await send('meta', sr.meta)
      await streamText(send, sr.text, delay)
      return { path: 'stub', reason: 'injection_stripped' }
    }
    const r = privateReply(p.userText, p.lang, 'rules')
    await send('meta', { mode: 'stub', kind: 'intent:private', privateKind: 'rules', cta: null, chips: [], matched: null, sources: [] })
    await streamText(send, r.text, delay)
    return { path: 'stub', reason: 'injection' }
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
    // Una entrada vieja que no pase el filtro de salida no se sirve (se responde como si no hubiera).
    if (outputLeak(text)) return null
    await send('meta', { ...liveMetaBase, kind: 'cache' })
    await streamText(send, text, delay)
    return { path: 'cache', reason }
  }

  if (qk && (await g.dedupe(qk))) {
    const cached = await g.cacheGet(qk)
    const served = cached && (await serveCached(cached, 'dup'))
    if (served) return served
    await sendStub(send, p.lang, p.userText, delay, 'dup')
    return { path: 'stub', reason: 'dup' }
  }
  if (qk) {
    const cached = await g.cacheGet(qk)
    const served = cached && (await serveCached(cached, 'hit'))
    if (served) return served
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

  // FILTRO DE SALIDA (T40 b): la respuesta del modelo se BUFFERIZA entera (máx. 400 tokens) y solo
  // se emite si pasa el filtro; si no, se SUSTITUYE por la negativa del tipo que toque y no se
  // cachea. Así nunca llega al cliente un trozo filtrado (lo ya enviado no se puede borrar). Coste:
  // el primer texto visible espera a que el modelo termine (~0,5–2 s con flash-lite); luego se
  // emite con el mismo efecto de escritura que el stub.
  const liveMeta = { ...liveMetaBase, kind: 'live' }
  const r = await liveReply({
    system,
    history,
    apiKey,
    model,
    fetchImpl,
    maxTokens,
    timeoutMs: Number(env.CHAT_LIVE_TIMEOUT_MS || LIVE.timeoutMs),
    onDelta: async () => {}, // bufferizado: se emite abajo, tras el filtro
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
  // Eco del prompt detectado en vivo (live.js corta el stream) o filtro de salida → negativa del
  // tipo que toque, en el idioma del usuario; nada de lo generado se muestra y nada se cachea.
  const leak = r.reason === 'leak' ? { kind: 'rules', name: 'canario' } : outputLeak(r.text)
  if (leak) {
    await send('meta', { ...liveMeta, kind: 'live', filtered: leak.kind })
    await streamText(send, privateReply(p.userText, p.lang, leak.kind).text, delay)
    return { path: 'live', reason: 'filtered', filtered: leak.kind, cost: r.cost }
  }
  await send('meta', liveMeta)
  await streamText(send, r.text, delay)
  if (r.reason) {
    await streamText(send, `…\n\n${say(p.lang, 'cut')}`, delay)
    return { path: 'live', reason: r.reason, cost: r.cost }
  }
  // Respuesta limpia y completa → a la caché para la próxima pregunta idéntica.
  if (qk && !hasPII(r.text)) await g.cachePut(qk, r.text)
  return { path: 'live', cost: r.cost }
}
