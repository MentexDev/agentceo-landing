// ─────────────────────────────────────────────────────────────────────────────
// IMÁGENES OPEN GRAPH 1200×630 por página, generadas en el build con resvg (sin
// navegador y sin servicios externos), con las MISMAS fuentes del sitio (los woff2
// de public/fonts se descomprimen a TTF con wawoff2). Sustituyen al apple-touch-icon
// que la v1 usaba como og:image.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { decompress } from 'wawoff2'
import { allStaticRoutes, RUTAS } from '../i18n/rutas.js'
import { section, itemUrl, KINDS } from './content.js'
import { t } from '../i18n/config.js'

const FONTS = ['geist-latin-wght-normal', 'geist-mono-latin-wght-normal', 'instrument-serif-latin-400-normal', 'instrument-serif-latin-400-italic']
// resvg-js 2.6 IGNORA `fontBuffers` (medido: misma imagen con cualquier familia) y solo
// acepta rutas (`fontFiles`): los TTF descomprimidos se dejan en una caché local.
let fontFiles = null
async function fonts() {
  if (fontFiles) return fontFiles
  const dir = join(process.cwd(), 'node_modules', '.cache', 'og-fonts')
  mkdirSync(dir, { recursive: true })
  fontFiles = await Promise.all(FONTS.map(async (f) => {
    const out = join(dir, `${f}.ttf`)
    if (!existsSync(out)) writeFileSync(out, Buffer.from(await decompress(readFileSync(join(process.cwd(), 'public', 'fonts', `${f}.woff2`)))))
    return out
  }))
  return fontFiles
}

/** Ruta de la imagen OG de una URL: '/' → '/og/home.png', '/noticias/x' → '/og/noticias/x.png'. */
export function ogPathFor(url) {
  const clean = url.replace(/\/$/, '')
  if (clean === '' ) return '/og/home.png'
  if (/^\/[a-z]{2}$/.test(clean)) return `/og${clean}/home.png`
  return `/og${clean}.png`
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Parte un título en líneas por ancho aproximado (Instrument Serif ≈ 0,41 em por carácter, medido en las OG). */
function wrap(text, size, maxW, maxLines) {
  const per = Math.floor(maxW / (size * 0.41))
  const words = String(text).split(/\s+/)
  const lines = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > per && cur) { lines.push(cur); cur = w } else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur)
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…' }
  return lines
}

export function ogSvg({ title, eyebrow }) {
  let size = 76
  let lines = wrap(title, size, 760, 3)
  if (lines.length === 3) { size = 64; lines = wrap(title, size, 760, 4) }
  const lh = size * 1.06
  const top = 300 - ((lines.length - 1) * lh) / 2
  const tspans = lines.map((l, i) => `<tspan x="80" y="${(top + i * lh).toFixed(1)}">${esc(l)}</tspan>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F4F2ED"/>
  <rect x="24" y="24" width="1152" height="582" rx="34" fill="none" stroke="#111113" stroke-width="3"/>
  <text x="80" y="118" font-family="Geist Mono" font-size="22" letter-spacing="4" fill="#5E5C56">${esc(String(eyebrow).toUpperCase())}</text>
  <text font-family="Instrument Serif" font-size="${size}" fill="#111113">${tspans}</text>
  <g transform="translate(80 520)"><text font-family="Geist" font-weight="600" font-size="34" fill="#111113">agent<tspan fill="#B8923A">.</tspan>ceo</text></g>
  <g transform="translate(905 175) scale(2.6)">
    <line x1="50" y1="19" x2="50" y2="7" stroke="#111113" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="6" r="4.5" fill="#B8923A"/>
    <rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"/>
    <ellipse cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"/><circle cx="40" cy="52" r="4.4" fill="#111113"/>
    <ellipse cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"/><circle cx="64" cy="52" r="4.4" fill="#111113"/>
    <path d="M44 69q6 5 12 0" stroke="#F4F2ED" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M45 87h10l-2 5h-6z" fill="#7A5C17"/><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"/>
  </g>
</svg>`
}

export async function ogPng(spec) {
  const r = new Resvg(ogSvg(spec), { font: { fontFiles: await fonts(), loadSystemFonts: false, defaultFontFamily: 'Geist' } })
  return r.render().asPng()
}

/** Todas las imágenes OG a generar: [{ path, title, eyebrow }]. */
export function ogPages() {
  const out = []
  const label = (id, lang) => {
    if (id === 'home') return { title: t(lang, 'site.tagline'), eyebrow: 'Agent CEO' }
    if (id.startsWith('legal:')) return { title: RUTAS[id].label[lang], eyebrow: t(lang, 'footer.legal') }
    const map = { precios: 'nav.precios', noticias: 'nav.noticias', blog: 'nav.blog', recursos: 'nav.recursos', empresa: 'empresa.h1a', contacto: 'contacto.h1a', prensa: 'prensa.eyebrow' }
    const titleKey = { empresa: 'empresa.title', contacto: 'contacto.title', prensa: 'prensa.title' }[id]
    return { title: titleKey ? t(lang, titleKey).replace(/ · Agent CEO$/, '') : t(lang, map[id] || 'site.name'), eyebrow: 'Agent CEO' }
  }
  for (const r of allStaticRoutes()) {
    if (r.noindex) continue
    out.push({ path: ogPathFor(r.url), ...label(r.id, r.lang) })
  }
  for (const kind of KINDS) for (const lang of ['es', 'en']) {
    const s = section(kind, lang)
    if (!s) continue
    for (const it of s.ITEMS) out.push({ path: ogPathFor(itemUrl(kind, lang, it.slug)), title: it.title, eyebrow: `Agent CEO · ${s.META.eyebrow}` })
  }
  return out
}
