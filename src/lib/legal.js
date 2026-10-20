// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTOS LEGALES · content/legal/{es,en}/*.md → páginas /legal/<slug> y /en/legal/<slug>.
// Conversor portado de design/legacy/build-legal.mjs (v2.0, 2026-08-11): escapa ANTES de
// interpretar el markdown, solo enlaces con esquema seguro, tablas envueltas para móvil.
// Añadidos de la v2: ids en los h2 (índice), marcas [PENDIENTE …] visibles y bloques de
// DATOS compartidos ({{subprocesadores}}, {{almacenamiento}}): una sola fuente para
// Privacidad, Cookies y Subprocesadores.
// ─────────────────────────────────────────────────────────────────────────────
import { inlineMd, esc } from './escape.js'
import { slugify } from './slug.js'
import { SUBPROCESSORS } from '../../content/subprocesadores.js'
import { STORAGE } from '../data/storage.js'

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Se lee con fs (no import.meta.glob): este módulo lo usan el build de Astro, los tests y
// scripts de Node puro (base del widget), y glob solo existe dentro de Vite.
const DIR = join(process.cwd(), 'content', 'legal')
function readAll() {
  const out = {}
  for (const lang of existsSync(DIR) ? readdirSync(DIR) : []) {
    const d = join(DIR, lang)
    if (!/^[a-z]{2}$/.test(lang)) continue
    for (const f of readdirSync(d)) if (f.endsWith('.md')) out[`${lang}/${f}`] = readFileSync(join(d, f), 'utf8')
  }
  return out
}
let RAW = null

/** Separa y valida el frontmatter (contrato: sin estos campos, el build rompe). */
export function parseFront(md, file) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) throw new Error(`${file}: no tiene frontmatter`)
  const meta = {}
  for (const line of m[1].split('\n')) {
    const p = line.match(/^(\w+):\s*(.+)$/)
    if (p) meta[p[1]] = p[2].trim()
  }
  for (const k of ['id', 'titulo', 'slug', 'actualizado', 'version', 'estado']) if (!meta[k]) throw new Error(`${file}: falta '${k}' en el frontmatter`)
  return { meta, body: m[2] }
}

/** Texto en línea seguro + marcas [PENDIENTE …] resaltadas. */
const inline = (t) => inlineMd(t).replace(/\[PENDIENTE([^\]]*)\]/g, '<mark class="pend">[PENDIENTE$1]</mark>')

const cells = (l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
const isSep = (l) => /^\|[\s:|-]+\|?$/.test(l.trim())

function table(head, rows) {
  const th = head.map((c) => `<th scope="col">${inline(c)}</th>`).join('')
  const tr = rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('\n')
  return `<div class="tbl-wrap" tabindex="0" role="region" aria-label="${esc(head.join(' · '))}"><table class="tbl"><thead><tr>${th}</tr></thead><tbody>\n${tr}\n</tbody></table></div>`
}

/** Bloques de datos compartidos (marcadores en el markdown). */
function dataBlock(name, lang) {
  if (name === 'subprocesadores') {
    const H = lang === 'en' ? ['Provider', 'Purpose', 'Data location'] : ['Proveedor', 'Para qué', 'Dónde trata los datos']
    return table(H, SUBPROCESSORS.map((s) => [`**${s.name}**`, s.purpose[lang], s.location[lang]]))
  }
  if (name === 'almacenamiento') {
    const H = lang === 'en' ? ['Name', 'Type', 'Purpose', 'Duration', 'Category'] : ['Nombre', 'Tipo', 'Para qué', 'Duración', 'Categoría']
    return table(H, STORAGE.map((s) => [`\`${s.name}\``, s.type[lang], s.purpose[lang], s.duration[lang], s.category[lang]]))
  }
  throw new Error(`[legal] bloque de datos desconocido: {{${name}}}`)
}

/** Markdown → { html, toc } */
export function renderLegal(body, lang) {
  const L = body.split('\n')
  const out = [], toc = []
  let i = 0, seenTitle = false
  while (i < L.length) {
    const line = L[i]
    if (!line.trim()) { i++; continue }
    const data = line.trim().match(/^\{\{(\w+)\}\}$/)
    if (data) { out.push(dataBlock(data[1], lang)); i++; continue }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { out.push('<hr/>'); i++; continue }
    const h = line.match(/^(#{1,4})\s+(.+)$/)
    if (h) {
      const lvl = h[1].length, text = h[2].trim()
      if (lvl === 1 && !seenTitle) { seenTitle = true; i++; continue } // el título lo pinta la plantilla
      if (lvl === 1 || lvl === 2) {
        const id = slugify(text)
        toc.push({ id, text: text.replace(/\*\*/g, '') })
        out.push(`<h2 id="${id}">${inline(text)}</h2>`)
      } else out.push(`<h${lvl}>${inline(text)}</h${lvl}>`)
      i++
      continue
    }
    if (line.trim().startsWith('|') && isSep(L[i + 1] ?? '')) {
      const head = cells(line)
      i += 2
      const rows = []
      while (i < L.length && L[i].trim().startsWith('|')) { rows.push(cells(L[i])); i++ }
      out.push(table(head, rows))
      continue
    }
    for (const [re, tag] of [[/^\s*[-*]\s+/, 'ul'], [/^\s*\d+\.\s+/, 'ol']]) {
      if (re.test(line)) {
        const items = []
        while (i < L.length && (re.test(L[i]) || /^\s{2,}\S/.test(L[i]))) {
          if (re.test(L[i])) items.push(L[i].replace(re, ''))
          else items[items.length - 1] += ` ${L[i].trim()}`
          i++
        }
        out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</${tag}>`)
        break
      }
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) continue
    const chunk = []
    while (i < L.length && L[i].trim() && !/^#{1,4}\s/.test(L[i]) && !/^\s*([-*]|\d+\.)\s+/.test(L[i]) && !L[i].trim().startsWith('|') && !/^\{\{\w+\}\}$/.test(L[i].trim()) && !/^(-{3,})$/.test(L[i].trim())) {
      chunk.push(L[i].trim()); i++
    }
    const text = chunk.join(' ')
    if (/^\*\*(Última actualización|Last updated):/.test(text)) continue // la fecha la pinta la plantilla
    out.push(`<p>${inline(text)}</p>`)
  }
  return { html: out.join('\n'), toc }
}

/** Todos los documentos: [{ id, lang, slug, titulo, actualizado, version, estado, body }]. */
export function legalDocs() {
  RAW ||= readAll()
  return Object.entries(RAW).map(([file, md]) => {
    const lang = file.split('/')[0]
    const { meta, body } = parseFront(md, file)
    return { ...meta, lang, body, file }
  })
}

export const legalDoc = (id, lang) => legalDocs().find((d) => d.id === id && d.lang === lang)
