// Los 4 agentes de «Tu equipo te está esperando» (T60b): cada uno con SU cara y SU accesorio, mismo estilo de
// marca que la mascota (public/brand/agentceo-mascota.svg: cuerpo de tinta, ojos crema, acentos dorados).
// Antes los 4 eran la misma mascota y solo cambiaba el fondo. Devuelve el SVG interior en el lienzo de la
// mascota (viewBox 0 0 100 118) para emails/scripts/assets.mjs. `mode`: 'light' (tinta) | 'dark' (crema).
const GOLD = '#B8923A'
const GOLD_INK = '#7A5C17'

export const AGENT_KINDS = ['director', 'vendedor', 'inventario', 'creador']

export function agentSvg(kind, mode = 'light') {
  const ink = mode === 'dark' ? '#F4F2ED' : '#111113'   // cuerpo
  const paper = mode === 'dark' ? '#111113' : '#F4F2ED' // ojos / detalles sobre el cuerpo
  const eye = (cx, cy, rx = 8.5, ry = 10.5) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${paper}"/><circle cx="${cx}" cy="${cy + 1}" r="${Math.min(rx, ry) * 0.52}" fill="${ink}"/>`
  switch (kind) {
    // Director General: la mascota clásica (antena con bola dorada + corbata), la cara del equipo.
    case 'director':
      return `<line x1="50" y1="19" x2="50" y2="7" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="6" r="4.5" fill="${GOLD}"/>
        <rect x="12" y="18" width="76" height="70" rx="26" fill="${ink}"/>${eye(38, 51)}${eye(62, 51)}
        <path d="M44 69q6 5 12 0" stroke="${paper}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M45 87h10l-2 5h-6z" fill="${GOLD_INK}"/><path d="M47 92h6l5 15-8 8-8-8z" fill="${GOLD}"/>`
    // Vendedor de WhatsApp: cabeza REDONDA, auriculares con micrófono, sonrisa amplia y un bocadillo de chat.
    case 'vendedor':
      return `<circle cx="50" cy="56" r="36" fill="${ink}"/>
        <path d="M17 54a33 33 0 0 1 66 0" stroke="${GOLD}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <rect x="9" y="47" width="11" height="20" rx="5" fill="${GOLD}"/><rect x="80" y="47" width="11" height="20" rx="5" fill="${GOLD}"/>
        <path d="M86 66q2 18-16 20" stroke="${GOLD}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="68" cy="86" r="3.5" fill="${GOLD}"/>
        ${eye(39, 52, 7.5, 8.5)}${eye(61, 52, 7.5, 8.5)}
        <path d="M38 68q12 12 24 0" stroke="${paper}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M70 98h22a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6h-14l-6 5v-5a6 6 0 0 1-6-6v-6a6 6 0 0 1 6-6z" fill="${GOLD}"/>
        <circle cx="79" cy="107" r="1.8" fill="${ink}"/><circle cx="85" cy="107" r="1.8" fill="${ink}"/><circle cx="91" cy="107" r="1.8" fill="${ink}"/>`
    // Encargado de inventario: cabeza CUADRADA, gafas, gorra con visera y una caja de inventario.
    case 'inventario':
      return `<rect x="14" y="24" width="72" height="62" rx="10" fill="${ink}"/>
        <path d="M18 26q32-22 64 0z" fill="${GOLD}"/><rect x="16" y="24" width="68" height="6" rx="3" fill="${GOLD_INK}"/><rect x="60" y="24" width="30" height="5" rx="2.5" fill="${GOLD_INK}"/>
        <rect x="27" y="44" width="19" height="16" rx="4" fill="${paper}"/><rect x="54" y="44" width="19" height="16" rx="4" fill="${paper}"/>
        <rect x="46" y="50" width="8" height="3" fill="${paper}"/>
        <circle cx="36.5" cy="52.5" r="3.8" fill="${ink}"/><circle cx="63.5" cy="52.5" r="3.8" fill="${ink}"/>
        <path d="M42 72h16" stroke="${paper}" stroke-width="3.5" stroke-linecap="round"/>
        <rect x="34" y="92" width="32" height="22" rx="3" fill="${GOLD}"/><path d="M34 100h32M50 92v8" stroke="${GOLD_INK}" stroke-width="2.5"/>`
    // Creador de contenido: cabeza OVALADA, boina, un ojo guiñando y un destello creativo.
    case 'creador':
      return `<ellipse cx="50" cy="56" rx="34" ry="32" fill="${ink}"/>
        <ellipse cx="44" cy="25" rx="27" ry="9" transform="rotate(-10 44 25)" fill="${GOLD}"/><circle cx="62" cy="15" r="3.5" fill="${GOLD}"/>
        ${eye(38, 54, 7.5, 9)}
        <path d="M55 55q7-6 14 0" stroke="${paper}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M41 71q9 8 18 0" stroke="${paper}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M85 88l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="${GOLD}"/><path d="M14 92l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="${GOLD}"/>`
    default:
      throw new Error(`agentSvg: agente desconocido «${kind}»`)
  }
}
