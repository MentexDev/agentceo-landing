// Markdown SEGURO para las respuestas del widget: párrafos, listas (- • *), **negrita**,
// *cursiva*, `código` y enlaces con esquema seguro (/interno, https, mailto).
// Todo se ESCAPA antes de interpretar (src/lib/escape.js): un modelo o un texto con
// <script> nunca llega al DOM como HTML.
import { inlineMd } from '../../lib/escape.js'

export function renderMd(text = '') {
  const out = []
  let list = null
  for (const raw of String(text).split('\n')) {
    const line = raw.trimEnd()
    const li = /^\s*(?:[-•*]|\d+\.)\s+(.*)$/.exec(line)
    if (li) {
      if (!list) { list = []; out.push(list) }
      list.push(`<li>${inlineMd(li[1])}</li>`)
      continue
    }
    list = null
    if (line.trim()) out.push(`<p>${inlineMd(line.trim())}</p>`)
  }
  return out.map((b) => (Array.isArray(b) ? `<ul>${b.join('')}</ul>` : b)).join('')
}
