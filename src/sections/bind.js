// Ayudas para las vistas generadas.
// s(x): convierte un valor a texto para el DOM (null/undefined/false → '').
export const s = (x) => (x === null || x === undefined || x === false ? '' : x)

// css('a: b; c: d') → { a: 'b', c: 'd' } para estilos que calcula la lógica.
const cache = new Map()
export function css(str) {
  if (!str) return undefined
  if (typeof str === 'object') return str
  let o = cache.get(str)
  if (o) return o
  o = {}
  for (const decl of String(str).split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const k = decl.slice(0, i).trim()
    const val = decl.slice(i + 1).trim()
    if (!k) continue
    const key = k.startsWith('--') ? k : k.replace(/^-/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^(webkit|moz|ms)(?=[A-Z])/, (p) => p[0].toUpperCase() + p.slice(1))
    o[key] = val
  }
  if (cache.size > 500) cache.clear()
  cache.set(str, o)
  return o
}
