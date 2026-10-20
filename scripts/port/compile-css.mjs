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
// Entrada del hero (.in): en el prototipo esperaba a que el JS marcara [data-ready] y luego
// hacía la transición. Medido con Lighthouse: retrasaba el LCP 1,56 s en móvil. Ahora es una
// ANIMACIÓN CSS que arranca con el primer pintado (mismo escalonado, misma curva, mismo
// recorrido), no depende del JS y también funciona sin él.
css = css.replace(
  '.in{opacity:0;transform:translateY(26px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1);transition-delay:calc(var(--i)*110ms + 150ms)}',
  '.in{animation:inrise .9s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i)*110ms + 150ms)}@keyframes inrise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}' +
  // En móvil (red y CPU más lentas) el mismo escalonado, algo más corto: el texto llega antes.
  '@media (max-width:1023px){.in{animation-duration:.7s;animation-delay:calc(var(--i)*80ms + 100ms)}}',
)
css = css.replace('[data-ready] .in{opacity:1;transform:none}', '')
const fix = (s) => s.replace(/\[style\*="--i: (\d+)"\]/g, '[data-i="$1"]')

// ── CSS CRÍTICO (medido con Lighthouse: el CSS de la portada bloqueaba el render ≈ 760 ms en
// móvil). Solo bloquean las reglas cuyas clases aparecen en el HERO (S02) o son genéricas
// (sin clase: [data-rv], html.js…), y los @keyframes que esas reglas usan. El resto va a
// gen/prototype-rest.css, que se carga sin bloquear (scripts/build-rest-css.mjs).
const hero = readFileSync(join(ROOT, 'src', 'sections', 'gen', 'S02.jsx'), 'utf8')
const heroClasses = new Set(['js', 'happy', 'ceo-happy', 'dc', 'only-d', 'only-m'])
for (const m of hero.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) for (const c of (m[1] || m[2]).replace(/\$\{[^}]*\}/g, ' ').split(/\s+/)) if (c) heroClasses.add(c)
const classesOf = (sel) => [...sel.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((x) => x[1])
const isCritical = (rule) => {
  const sel = rule.slice(0, rule.indexOf('{'))
  return sel.split(',').some((one) => classesOf(one).every((c) => heroClasses.has(c)))
}
const split = (list) => {
  const kf = list.filter((r) => r.startsWith('@keyframes'))
  const plain = list.filter((r) => !r.startsWith('@keyframes'))
  const crit = plain.filter(isCritical), rest = plain.filter((r) => !isCritical(r))
  return { kf, crit, rest }
}
// Las reglas de primer nivel: algunas son @media (min-width:1024px){…} envolviendo una regla.
const unwrap = (r) => (r.startsWith('@media') ? r.slice(r.indexOf('{') + 1, r.lastIndexOf('}')) : r)
const top = rules(fix(css)).map((r) => ({ r, inner: unwrap(r) }))
const kfAll = top.filter((x) => x.r.startsWith('@keyframes')).map((x) => x.r)
const plainTop = top.filter((x) => !x.r.startsWith('@keyframes'))
const critTop = plainTop.filter((x) => isCritical(x.inner)).map((x) => x.r)
const restTop = plainTop.filter((x) => !isCritical(x.inner)).map((x) => x.r)
const mobS = split(rules(fix(mobile.join('\n'))))
const red = split(rules(fix(reduce.filter((r) => !r.startsWith('*{')).join('\n'))))
const usedAnim = new Set([...[...critTop, ...mobS.crit, ...red.crit].join('\n').matchAll(/animation(?:-name)?:\s*([\w-]+)/g)].map((m) => m[1]))
const kfName = (k) => /@keyframes\s+([\w-]+)/.exec(k)[1]
const kfCrit = kfAll.filter((k) => usedAnim.has(kfName(k)))
const kfRest = kfAll.filter((k) => !usedAnim.has(kfName(k)))

// La órbita de mascotas gira en un escenario de 620×620: su caja rotada asomaba ~20 px sobre el
// divisor de la sección siguiente (T32). overflow:clip la contiene sin crear contexto de scroll.
// TITULAR Y ENTRADILLA DEL HERO (los dos candidatos a LCP): conservan la SUBIDA de entrada (mismo recorrido, curva y
// escalonado) pero se ve desde el primer fotograma, sin fundido desde opacidad 0. Medido con
// Lighthouse 13 móvil: con el fundido, Chrome no podía contar el titular hasta que aparecía y el
// LCP caía en un elemento tardío (2,1 s); con el titular arreglado, la entradilla (más grande y
// con el fundido) pasaba a ser el LCP a 1,96 s. Etiqueta y botones siguen con el fundido completo.
// El texto se pinta de verdad al instante: no es un truco.
const HERO_H1 = `section#top{overflow:clip}
section#top h1 .in,section#top p.in{animation-name:inrise-solid}
@keyframes inrise-solid{from{transform:translateY(26px)}to{transform:none}}`

const wrap = (body) => `@layer reset, proto, sections;\n@layer proto {\n${body}\n}\n`
const HEAD = '/* GENERADO por scripts/port/compile-css.mjs desde design/prototype/src/styles · no editar a mano */\n'
const critical = HEAD + wrap(`/* El prototipo no tenía reset: su modelo de caja es content-box. Especificidad 0 (:where)
   para que cualquier regla suya (p. ej. .hs>*{box-sizing:border-box}) siga ganando. */
${HERO_H1}
:where(.home section, .home section *, .home section *::before, .home section *::after){box-sizing:content-box}
${[...kfCrit, ...critTop].join('\n')}
@media (max-width:1023px){
${mobS.crit.join('\n')}
}
@media (prefers-reduced-motion: reduce){
*{animation:none !important;transition:none !important}
${red.crit.join('\n')}
}`)
const restOut = HEAD + wrap(`${[...kfRest, ...restTop].join('\n')}
@media (max-width:1023px){
${[...mobS.rest, ...mobS.kf].join('\n')}
}
@media (prefers-reduced-motion: reduce){
${red.rest.join('\n')}
}`)
writeFileSync(join(ROOT, 'src', 'sections', 'gen', 'prototype.css'), critical)
writeFileSync(join(ROOT, 'src', 'sections', 'gen', 'prototype-rest.css'), restOut)
console.log(`✓ prototype.css crítico ${(critical.length / 1024).toFixed(1)} KB (${critTop.length} reglas, ${kfCrit.length} keyframes) · resto ${(restOut.length / 1024).toFixed(1)} KB · clases del hero: ${heroClasses.size}`)
