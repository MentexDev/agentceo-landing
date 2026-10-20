#!/usr/bin/env node
// Convierte el CSS del prototipo (design/prototype/src/styles/{desktop,mobile}.css)
// en src/sections/gen/prototype.css, dentro de la capa «proto»:
//  · [data-reduce] (motion reducido por JS) → @media (prefers-reduced-motion: reduce)
//  · los estados ocultos de aparición ([data-rv], .in) solo con JS (html.js)
//  · [style*="--i: N"] → [data-i="N"] (independiente del motor que serialice el style)
//  · .hs (carrusel): la regla móvil va en @media (max-width: 1023px)
//  · los colores de texto dorado/gris sobre crema → tonos con contraste AA
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const S = join(ROOT, 'design', 'prototype', 'src', 'styles')
const desk = readFileSync(join(S, 'desktop.css'), 'utf8')
const mob = readFileSync(join(S, 'mobile.css'), 'utf8')

// Divide en reglas de primer nivel respetando llaves anidadas (@keyframes, @media).
function rules(css) {
  const out = []
  let depth = 0, start = 0
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') { depth--; if (depth === 0) { out.push(css.slice(start, i + 1).trim()); start = i + 1 } }
  }
  return out.filter(Boolean)
}
const dR = rules(desk), mR = rules(mob)
const mobileOnly = mR.filter((r) => !dR.includes(r))
const deskOnly = dR.filter((r) => !mR.includes(r))
console.log(`reglas: ${dR.length} · solo escritorio: ${deskOnly.length} · solo móvil: ${mobileOnly.length}`)

const base = [], reduce = [], mobile = []
for (const r of dR) {
  const sel = r.slice(0, r.indexOf('{'))
  if (/^(body|a|a:hover|::selection|\.sc)\b/.test(sel)) continue // ya en base.css / no aplica
  if (deskOnly.includes(r)) { base.push(`@media (min-width:1024px){${r}}`); continue }
  if (sel.includes('[data-reduce]')) { reduce.push(r.replaceAll('[data-reduce] ', '')); continue }
  base.push(r)
}
for (const r of mobileOnly) mobile.push(r)

let css = base.join('\n')
// Aparición: oculto SOLO con JS; visible al entrar en pantalla.
css = css.replace('[data-rv]{opacity:0', 'html.js [data-rv]{opacity:0')
css = css.replace('[data-rv][data-in]{opacity:1', 'html.js [data-rv][data-in]{opacity:1')
css = css.replace('button.agent[data-rv][data-in]:hover', 'html.js button.agent[data-rv][data-in]:hover')
css = css.replace(/(^|\n)\.in\{opacity:0/, '$1html.js .in{opacity:0')
css = css.replace('[data-ready] .in{opacity:1', 'html.js[data-ready] .in{opacity:1')
const fix = (s) => s.replace(/\[style\*="--i: (\d+)"\]/g, '[data-i="$1"]')

const out = `/* GENERADO por scripts/port/compile-css.mjs desde design/prototype/src/styles · no editar a mano */
@layer reset, proto, sections;
@layer proto {
/* El prototipo no tenía reset: su modelo de caja es content-box. Especificidad 0 (:where)
   para que cualquier regla suya (p. ej. .hs>*{box-sizing:border-box}) siga ganando. */
:where(.home section, .home section *, .home section *::before, .home section *::after){box-sizing:content-box}
${fix(css)}
@media (max-width:1023px){
${fix(mobile.join('\n'))}
}
@media (prefers-reduced-motion: reduce){
*{animation:none !important;transition:none !important}
${fix(reduce.filter((r) => !r.startsWith('*{')).join('\n'))}
}
}
`
writeFileSync(join(ROOT, 'src', 'sections', 'gen', 'prototype.css'), out)
console.log(`✓ prototype.css · ${(out.length / 1024).toFixed(1)} KB · reduce: ${reduce.length} reglas · móvil: ${mobile.length}`)
