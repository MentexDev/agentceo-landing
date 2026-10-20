#!/usr/bin/env node
// Genera worker/generated/knowledge.json (base del widget) desde el contenido PÚBLICO del sitio
// (FAQ, precios, blog, recursos, legales: src/lib/knowledge.js) + el conocimiento curado y no
// confidencial de content/chat-knowledge.js (T32). Lo corre `npm run build` (prebuild) y `npm test`.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildKnowledge } from '../src/lib/knowledge.js'
import { LOCALES } from '../src/i18n/config.js'
import { curatedChunks } from '../content/chat-knowledge.js'

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'worker', 'generated')
mkdirSync(out, { recursive: true })
const data = Object.fromEntries(LOCALES.map((l) => [l, [...buildKnowledge(l), ...curatedChunks(l)]]))
writeFileSync(join(out, 'knowledge.json'), JSON.stringify(data))
const kb = (s) => `${(s / 1024).toFixed(1)} KB`
console.log(`✓ knowledge.json · ${LOCALES.map((l) => `${l}: ${data[l].length} fragmentos`).join(' · ')} · ${kb(JSON.stringify(data).length)}`)
