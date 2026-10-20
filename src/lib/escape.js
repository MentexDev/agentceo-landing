// ─────────────────────────────────────────────────────────────────────────────
// Escapes de seguridad (portados de design/legacy/build-content.mjs, auditados
// el 2026-08-10). Astro ya escapa {expresiones} en el HTML; estos cubren los
// casos donde se inserta texto en contextos que Astro NO escapa por nosotros:
// JSON-LD dentro de <script>, URLs de datos curados y markdown en línea.
// Tests: tests/site/escape.test.js (con casos de ataque).
// ─────────────────────────────────────────────────────────────────────────────

/** Escapa texto para HTML (texto y atributos). */
export function esc(s = '') {
  return String(s)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

/**
 * Solo deja pasar URLs http(s) SIN caracteres que rompan un atributo HTML.
 * Cualquier otra cosa (javascript:, data:, comillas, espacios) → '#'.
 */
export function safeUrl(u = '') {
  const s = String(u)
  if (!/^https?:\/\//i.test(s)) return '#'
  if (/["'<>\s]/.test(s)) return '#'
  return s
}

/**
 * Enlace de contenido curado: rutas internas absolutas ('/x'), http(s) o mailto.
 * Rechaza '//' (protocolo relativo → otro dominio) y cualquier esquema peligroso.
 */
export function safeHref(u = '') {
  const s = String(u)
  if (/["'<>\s]/.test(s)) return '#'
  if (/^\/(?!\/)/.test(s)) return s
  if (/^https?:\/\//i.test(s)) return s
  if (/^mailto:[^@\s]+@[^@\s]+$/i.test(s)) return s
  return '#'
}

/**
 * JSON serializado para <script type="application/ld+json">. JSON.stringify NO
 * neutraliza `</script>` ni `<!--`: escapamos < > & a \uXXXX (sigue siendo JSON).
 */
export function jsonForScript(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

/** Marcado inline mínimo y seguro: **negrita** dentro de texto ya escapado. */
export function inlineBold(text = '') {
  return esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

/**
 * Markdown en línea seguro (legales, widget): escapa PRIMERO y luego aplica
 * enlaces (solo esquemas seguros), **negrita**, *cursiva* y `código`.
 */
export function inlineMd(texto = '') {
  let t = esc(texto)
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, url) => {
    // La URL llega escapada (&amp;); se des-escapa solo para validarla.
    const raw = url.replaceAll('&amp;', '&')
    const ok = safeHref(raw)
    return ok === '#' ? txt : `<a href="${esc(ok)}">${txt}</a>`
  })
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  t = t.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
  return t
}
