// Utilidades HTTP compartidas por el Worker.

/** Respuesta JSON (sin caché: son respuestas de API). */
export function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  })
}

// CSP del HTML. Todo es 'self': fuentes autoalojadas (sin Google Fonts desde v2).
// 'unsafe-inline' en script/style: Astro inyecta <script>/<style> en línea y el
// JSON-LD; el escape del contenido (src/lib/escape.js) es la primera defensa.
export const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
].join('; ')

/**
 * Añade las cabeceras de seguridad a una respuesta HTML.
 * `upgrade-insecure-requests` y HSTS SOLO bajo https: en http (wrangler dev local)
 * Safari subía a https cada recurso y la página se quedaba sin CSS ni navegación
 * (medido con WebKit el 2026-10-20; Chrome lo tapaba al eximir a localhost).
 */
// Turnstile (adenda T32): SOLO si Diego configura TURNSTILE_SITE_KEY se permite su origen
// (script + iframe del reto). Sin clave, la CSP sigue siendo todo 'self'.
export const TURNSTILE_ORIGIN = 'https://challenges.cloudflare.com'
export function cspFor({ turnstile = false } = {}) {
  if (!turnstile) return CSP
  return CSP.replace("script-src 'self' 'unsafe-inline'", `script-src 'self' 'unsafe-inline' ${TURNSTILE_ORIGIN}`) + `; frame-src ${TURNSTILE_ORIGIN}`
}

export function withSecurityHeaders(res, secure = true, { turnstile = false } = {}) {
  const h = new Headers(res.headers)
  const csp = cspFor({ turnstile })
  h.set('Content-Security-Policy', secure ? `${csp}; upgrade-insecure-requests` : csp)
  if (secure) h.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  h.set('X-Content-Type-Options', 'nosniff')
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  h.set('X-Frame-Options', 'SAMEORIGIN')
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()')
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h })
}

/**
 * Caché de assets: los de Astro (/_a/) y el CSS no crítico (/_s/) llevan hash → inmutables un año.
 * Fuentes: 30 días (nombre fijo). Imágenes OG y marca: 1 día. El resto, lo que diga ASSETS.
 * (Medido: sin esto todo salía con max-age=0 y cada visita revalidaba el JS y el CSS.)
 */
export function withCache(res, path) {
  let cc = null
  if (path.startsWith('/_a/') || path.startsWith('/_s/')) cc = 'public, max-age=31536000, immutable'
  else if (path.startsWith('/fonts/')) cc = 'public, max-age=2592000'
  else if (path.startsWith('/og/') || path.startsWith('/brand/')) cc = 'public, max-age=86400'
  if (!cc || res.status !== 200) return res
  const h = new Headers(res.headers)
  h.set('Cache-Control', cc)
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h })
}
