// Límites del widget (topes por IP, sesión, longitud, turnos y memorias). Módulo PURO: lo usan
// el núcleo del chat (channels/index.js) y las evals en Node (scripts/chat-evals.mjs).
export const LIMITS = {
  maxChars: 500, maxTurns: 12, maxHistory: 6,
  // Por usuario (IP con hash). La ráfaga de 10/min la pone el binding nativo RL_CHAT.
  ipHour: 30, ipDay: 60,
  // Respuestas LIVE por IP y día: 25 con Turnstile configurado (persona verificada); 10 sin él
  // (T33: con solo el secreto de OpenRouter el modelo queda encendido, así que sin la prueba de
  // persona el cupo por IP es más estricto; el tráfico sospechoso nunca va live).
  livePerDay: 25, livePerDayOpen: 10,
  // Respuestas LIVE en TOTAL por día UTC, todas las IP juntas (T58b). Por defecto 2000; se cambia con
  // CHAT_DAILY_GLOBAL_CAP (ver globalLiveCap en respond.js). Va junto al tope de gasto en USD: el que
  // llegue antes manda.
  liveGlobalPerDay: 2000,
  // Por sesión (id aleatorio del cliente: NO es fiable por sí solo, el límite por IP manda;
  // sirve para que una pestaña no se coma el cupo de toda una oficina detrás de la misma IP).
  sessionMinute: 6, sessionHour: 20, sessionDay: 40,
  dedupeMs: 10 * 60 * 1000, // misma pregunta de la misma sesión en 10 min → no gasta
  cacheMs: 6 * 3600 * 1000, // respuesta live a una pregunta idéntica: 6 h
  humanMs: 30 * 60 * 1000, // sesión verificada por Turnstile: 30 min
}
