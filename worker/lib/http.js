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
export function withSecurityHeaders(res, secure = true) {
  const h = new Headers(res.headers)
  h.set('Content-Security-Policy', secure ? `${CSP}; upgrade-insecure-requests` : CSP)
  if (secure) h.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  h.set('X-Content-Type-Options', 'nosniff')
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  h.set('X-Frame-Options', 'SAMEORIGIN')
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()')
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h })
}
