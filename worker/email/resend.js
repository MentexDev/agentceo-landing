// Cliente mínimo de Resend (POST /emails). Sin SDK: un fetch, con timeout y clasificación del error.
// La clave viaja SOLO en la cabecera Authorization: nunca en logs, errores ni D1.

export const RESEND_API_URL = 'https://api.resend.com/emails'

/**
 * @typedef {{ ok: true, id: string, status: number }} SendOk
 * @typedef {{ ok: false, retryable: boolean, status: number, error: string }} SendErr
 */

/**
 * 2xx = enviado · 408/429/5xx y red = reintentable · el resto de 4xx = definitivo.
 * 409 de Resend: solo `concurrent_idempotent_requests` (otra petición con la misma clave en curso) se reintenta;
 * `invalid_idempotent_request` (misma clave, otro payload) es definitivo.
 */
export function isRetryable(status, name = '') {
  if (status === 409) return name === 'concurrent_idempotent_requests'
  return status === 0 || status === 408 || status === 429 || status >= 500
}

/**
 * @param {{ apiKey: string, apiUrl?: string, payload: object, idempotencyKey: string,
 *           fetch?: typeof fetch, timeoutMs?: number }} p
 * @returns {Promise<SendOk|SendErr>}
 */
export async function sendEmail({ apiKey, apiUrl = RESEND_API_URL, payload, idempotencyKey, fetch: doFetch = fetch, timeoutMs = 10_000 }) {
  let res
  try {
    res = await doFetch(apiUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (e) {
    return { ok: false, retryable: true, status: 0, error: `network: ${e?.name || 'Error'}` }
  }
  let body = ''
  try { body = await res.text() } catch {}
  if (res.ok) {
    let id = ''
    try { id = JSON.parse(body).id || '' } catch {}
    return { ok: true, id, status: res.status }
  }
  let error = `http ${res.status}`
  let name = ''
  try {
    const j = JSON.parse(body)
    name = String(j.name || '')
    error += `: ${name} ${j.message || ''}`.trimEnd()
  } catch {}
  return { ok: false, retryable: isRetryable(res.status, name), status: res.status, error }
}
