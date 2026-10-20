// Utilidades para leer el sitio construido (dist/). Requiere `npm run build` antes.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

export const DIST = join(import.meta.dirname, '..', '..', 'dist')

/** URL pública → fichero de dist (misma resolución que Cloudflare con auto-trailing-slash). */
export function fileFor(url) {
  const p = url.split('#')[0].split('?')[0]
  if (p.endsWith('/')) return join(DIST, p, 'index.html')
  const direct = join(DIST, p)
  if (existsSync(direct) && statSync(direct).isFile()) return direct
  return join(DIST, `${p}.html`)
}

export const exists = (url) => existsSync(fileFor(url))
export const html = (url) => readFileSync(fileFor(url), 'utf8')

/** Todas las páginas HTML de dist como URLs públicas. */
export function allPages(dir = DIST, base = '') {
  const out = []
  for (const f of readdirSync(dir)) {
    const full = join(dir, f)
    if (statSync(full).isDirectory()) out.push(...allPages(full, `${base}/${f}`))
    else if (f.endsWith('.html')) out.push(f === 'index.html' ? `${base}/` : `${base}/${f.slice(0, -5)}`)
  }
  return out
}

/** Atributos de todas las etiquetas <tag ...> que casan con un filtro simple. */
export function tags(src, tag) {
  const re = new RegExp(`<${tag}\\b([^>]*)>`, 'gi')
  const out = []
  let m
  while ((m = re.exec(src))) {
    const attrs = {}
    for (const a of m[1].matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) attrs[a[1]] = a[2] ?? ''
    out.push(attrs)
  }
  return out
}
