// ─────────────────────────────────────────────────────────────────────────────
// KB PÚBLICA curada (docs/kb-publica-borrador.md, versión «manda la landing» · T59) → fragmentos del chat
// `kind: 'kb'` (T60). La consume scripts/build-knowledge.mjs, con la MISMA guarda de datos societarios.
//
// Lo que el bot puede AFIRMAR sale solo de aquí, así que se EXCLUYE:
//   · toda línea o fila con [VERIFICAR] / [VERIFY], y el BLOQUE entero que cuelga de un encabezado marcado
//     («**ES · complementos del producto** **[VERIFICAR]**»: sus viñetas no llevan marca propia);
//   · la nota interna (§15), las exclusiones (§16), la cabecera de convención y el índice.
// Las etiquetas de fuente («[web]», «[web: …]») y el Markdown se quitan. Un fragmento por sección e idioma;
// las FAQ, uno por pregunta (mejor para la búsqueda).
// T62 · Idiomas: es y en salen del borrador BILINGÜE; cualquier otro idioma, de su propio documento de UN solo
// idioma, docs/kb-publica.<lang>.md (misma estructura, tablas «concepto | texto»). Sin documento = sin KB.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, existsSync } from 'node:fs'
import { prefix } from '../i18n/meta.js'

export const KB_DOC = new URL('../../docs/kb-publica-borrador.md', import.meta.url)
const BILINGUAL = ['es', 'en']
/** Documento propio de un idioma que no está en el borrador bilingüe. */
export const kbDocOf = (lang) => new URL(`../../docs/kb-publica.${lang}.md`, import.meta.url)
const MARK = /\[(VERIFICAR|VERIFY)\]/
const KEEP_SECTIONS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

const clean = (s) => s
  .replace(/\[web(:[^\]]*)?\]/g, '')
  .replace(/\*\*|__|`/g, '')
  .replace(/^\s*(?:[-*]|\d+\.)\s+/, '')
  .replace(/\s+([.,;:)])/g, '$1')
  .replace(/\s+/g, ' ')
  .trim()

/** Parte el documento en { n, title: {es, en}, lines } por sección «## N. Título ES · Title EN». */
function sections(md, single = false) {
  const out = []
  let cur = null
  for (const line of md.split('\n')) {
    const h = /^## (\d+)\. (.+)$/.exec(line)
    if (h) {
      const [es, en = es] = single ? [h[2], h[2]] : h[2].split(' · ')
      cur = { n: Number(h[1]), title: { es: es.trim(), en: en.trim() }, lines: [] }
      out.push(cur)
      continue
    }
    if (/^## /.test(line)) { cur = null; continue } // «## Índice» y similares
    if (cur) cur.lines.push(line)
  }
  return out.filter((s) => KEEP_SECTIONS.has(s.n))
}

/** Reparte las líneas de una sección entre es y en, saltando lo marcado (línea, fila o bloque). */
function split(sec, single = false) {
  const by = { es: [], en: [] }
  const faq = { es: [], en: [] }
  let lang = 'es' // documento de un solo idioma: todo cae en «es» y kbChunks lo da como el idioma pedido
  let skip = false
  let childOf = -1 // sangría de una viñeta marcada que abre una lista («- **Al entrar** **[VERIFICAR]**:»)
  for (const raw of sec.lines) {
    const line = raw.trimEnd()
    if (!line.trim() || /^---+$/.test(line) || /^>/.test(line)) continue
    const indent = line.length - line.trimStart().length
    if (childOf >= 0) { if (indent > childOf) continue; childOf = -1 }
    if (MARK.test(line) && /:\s*$/.test(line.replace(/\*\*\[(VERIFICAR|VERIFY)\]\*\*/g, '').replace(/\*\*/g, ''))) { childOf = indent; continue }
    // Cambio de idioma o de bloque: «**ES**», «**EN · published**», «### ES (34)».
    const head = single ? null : /^(\*\*|### )(ES|EN)\b/.exec(line)
    if (head) { lang = head[2].toLowerCase(); skip = MARK.test(line); continue }
    if (/^\*\*/.test(line) && !/^\*\*[^*]+\*\*\s+\S/.test(line.replace(/\*\*\[(VERIFICAR|VERIFY)\]\*\*/g, ''))) { skip = MARK.test(line); continue }
    if (skip) continue
    // Tabla: | concepto | ES | EN |
    if (/^\|/.test(line)) {
      if (/^\|\s*-/.test(line)) continue
      const cells = line.split('|').slice(1, -1).map((c) => c.trim())
      if (MARK.test(line) || cells.length < (single ? 2 : 3)) continue
      if (/^(Tipo|Objeción|Objeção|Término|Termo|Plan|Plano|Tema)$/.test(cells[0].replace(/\*\*/g, ''))) continue // cabecera
      // Documento de un idioma: «concepto | texto».
      if (single && cells.length === 2) { by.es.push(`${clean(cells[0])}: ${clean(cells[1])}`); continue }
      // 3 columnas = concepto | ES | EN. Otras (la tabla de precios, en español): solo al bloque del idioma en curso.
      if (cells.length === 3) { by.es.push(`${clean(cells[0])}: ${clean(cells[1])}`); by.en.push(`${clean(cells[0])}: ${clean(cells[2])}`) } else by[lang].push(cells.map(clean).join(' · '))
      continue
    }
    if (MARK.test(line)) continue
    // Viñetas con el idioma delante («- **ES:** …» / «- **EN:** …», §14).
    const inline = single ? null : /^\s*-\s*\*\*(ES|EN):\*\*\s*(.+)$/.exec(line)
    if (inline) { by[inline[1].toLowerCase()].push(clean(inline[2])); continue }
    const t = clean(line)
    if (!t) continue
    if (sec.n === 13 && /^\d+\. \*\*/.test(line.trim())) faq[lang].push(t)
    else by[lang].push(t)
  }
  return { by, faq }
}

/** Fragmentos { id, kind: 'kb', title, text, url } para un idioma (`md`: el documento, para los tests). */
export function kbChunks(lang, md = null) {
  const single = !BILINGUAL.includes(lang)
  if (md == null) {
    const doc = single ? kbDocOf(lang) : KB_DOC
    if (!existsSync(doc)) return []
    md = readFileSync(doc, 'utf8')
  }
  const L = single ? 'es' : lang
  const url = `${prefix(lang)}/`
  const out = []
  for (const sec of sections(md, single)) {
    const { by, faq } = split(sec, single)
    if (by[L].length) out.push({ id: `kb:${sec.n}`, kind: 'kb', title: sec.title[L], text: by[L].join(' ').slice(0, 1400), url })
    faq[L].forEach((qa, i) => out.push({ id: `kb:faq:${i + 1}`, kind: 'kb', title: qa.split('?')[0] + '?', text: qa, url }))
  }
  return out
}
