// VERSIÓN DE CONTENIDO del widget (T35): hash del conocimiento del sitio (incluye precios) + las
// respuestas curadas. La caché de 6 h de respuestas idénticas la lleva en su clave (abuse.js →
// textKey): si cambian los precios o una respuesta, la versión cambia y lo cacheado deja de
// servirse solo, sin purgas a mano. La calcula scripts/build-knowledge.mjs en cada build →
// worker/generated/content-version.json. Función pura (Node y workerd).
// ESQUEMA de la caché: se sube a mano cuando cambia lo que puede decir el chat sin que cambie su
// contenido (T40: datos societarios fuera, prompt nuevo) → toda respuesta cacheada vieja deja de
// servirse. Historial: 1 = T35 · 2 = T40.
export const CACHE_SCHEMA = 2

export async function contentVersion({ knowledge, answers, prompt = null, schema = CACHE_SCHEMA }) {
  // T40: entran también el prompt de sistema (cambiar las reglas invalida lo cacheado) y el esquema.
  const body = JSON.stringify({ schema, prompt, knowledge, answers: answers.map(({ id, ref, cta, keys, ask, a }) => ({ id, ref, cta, keys, ask, a })) })
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body))
  return [...new Uint8Array(buf)].slice(0, 6).map((b) => b.toString(16).padStart(2, '0')).join('')
}
