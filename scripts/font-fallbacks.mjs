#!/usr/bin/env node
// FUENTES DE RESPALDO CON LAS MÉTRICAS DE LAS REALES (CLS 0 al cambiar de fuente).
// Con `font-display: swap` el texto se pinta primero con la fuente del sistema y salta al
// llegar la buena. Medido con Lighthouse 13 (20-oct): el titular del hero en la serif
// cursiva movía la columna entera (CLS 0,18 en escritorio). Estas caras `local()` ajustan
// tamaño, ascendente y descendente para que el respaldo ocupe lo mismo (técnica de next/font).
// Se ejecuta a mano (lee las fuentes del sistema de macOS) y su salida se versiona:
//   node scripts/font-fallbacks.mjs  →  src/styles/fonts-fallback.css
import { fromFile } from '@capsizecss/unpack/fs'
import { writeFileSync } from 'node:fs'

const SYS = '/System/Library/Fonts/Supplemental'
const FACES = [
  { family: 'Instrument Serif Fallback', style: 'normal', font: 'public/fonts/instrument-serif-latin-400-normal.woff2', local: ['Georgia', 'Times New Roman'], ref: `${SYS}/Georgia.ttf` },
  { family: 'Instrument Serif Fallback', style: 'italic', font: 'public/fonts/instrument-serif-latin-400-italic.woff2', local: ['Georgia Italic', 'Georgia-Italic', 'Times New Roman Italic'], ref: `${SYS}/Georgia Italic.ttf` },
  { family: 'Geist Fallback', style: 'normal', font: 'public/fonts/geist-latin-wght-normal.woff2', local: ['Arial', 'ArialMT', 'Helvetica'], ref: `${SYS}/Arial.ttf` },
]
const pct = (n) => `${(n * 100).toFixed(2)}%`
let css = '/* GENERADO por scripts/font-fallbacks.mjs · no editar a mano */\n'
for (const f of FACES) {
  const m = await fromFile(f.font), r = await fromFile(f.ref)
  const size = (m.xWidthAvg / m.unitsPerEm) / (r.xWidthAvg / r.unitsPerEm)
  css += `@font-face {
  font-family: '${f.family}';
  font-style: ${f.style};
  src: ${f.local.map((l) => `local('${l}')`).join(', ')};
  size-adjust: ${pct(size)};
  ascent-override: ${pct(m.ascent / m.unitsPerEm / size)};
  descent-override: ${pct(Math.abs(m.descent) / m.unitsPerEm / size)};
  line-gap-override: ${pct(m.lineGap / m.unitsPerEm / size)};
}
`
}
writeFileSync('src/styles/fonts-fallback.css', css)
console.log(css)
