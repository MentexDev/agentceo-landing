#!/usr/bin/env node
// Genera worker/generated/knowledge.json (base del widget) desde el contenido del sitio.
// Lo corre `npm run build` (prebuild) y `npm test` (pretest).
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildKnowledge } from '../src/lib/knowledge.js'
import { LOCALES } from '../src/i18n/config.js'

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'worker', 'generated')
mkdirSync(out, { recursive: true })
const data = Object.fromEntries(LOCALES.map((l) => [l, buildKnowledge(l)]))
writeFileSync(join(out, 'knowledge.json'), JSON.stringify(data))
const kb = (s) => `${(s / 1024).toFixed(1)} KB`
console.log(`✓ knowledge.json · ${LOCALES.map((l) => `${l}: ${data[l].length} fragmentos`).join(' · ')} · ${kb(JSON.stringify(data).length)}`)
