#!/usr/bin/env node
// Ensambla el CSS NO CRÍTICO de la portada en un único fichero con hash (caché inmutable):
//   gen/sections-rest.css (secciones fuera del hero) + gen/prototype-rest.css (reglas del
//   prototipo que el hero no usa) + sections/appdemo/appdemo.css (demo de S03, bajo el pliegue) +
//   sections/carousel.css (botón de pausa de los carruseles) + sections/overrides.css (ajustes T32) + sections/forja/forja.css (vistas previas de La Forja).
// La portada lo carga sin bloquear el primer pintado (medido con Lighthouse 13 móvil).
// Lo corre `npm run build` (prebuild) y `npm test` (pretest).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const parts = ['src/sections/gen/sections-rest.css', 'src/sections/gen/prototype-rest.css', 'src/sections/appdemo/appdemo.css', 'src/sections/carousel.css', 'src/sections/overrides.css', 'src/sections/forja/forja.css']
const css = parts.map((p) => `/* ${p} */\n${readFileSync(join(ROOT, p), 'utf8')}`).join('\n')
const hash = createHash('sha1').update(css).digest('hex').slice(0, 10)
const dir = join(ROOT, 'public', '_s')
mkdirSync(dir, { recursive: true })
for (const f of readdirSync(dir)) if (f.startsWith('sections-rest.') || f.startsWith('rest.')) unlinkSync(join(dir, f))
writeFileSync(join(dir, `rest.${hash}.css`), css)
writeFileSync(join(ROOT, 'src', 'sections', 'gen', 'rest-css.js'), `// GENERADO por scripts/build-rest-css.mjs · CSS no crítico de la portada (con hash: caché inmutable)\nexport const REST_CSS = '/_s/rest.${hash}.css'\n`)
console.log(`✓ CSS no crítico: /_s/rest.${hash}.css · ${(css.length / 1024).toFixed(1)} KB`)
