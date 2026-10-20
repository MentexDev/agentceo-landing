#!/usr/bin/env node
// Genera worker/generated/knowledge.json (base del widget) desde el contenido PÚBLICO del sitio
// (FAQ, precios, blog, recursos, legales: src/lib/knowledge.js) + el conocimiento curado y no
// confidencial de content/chat-knowledge.js (T32). Lo corre `npm run build` (prebuild) y `npm test`.
// T35: escribe además worker/generated/content-version.json (hash de conocimiento + respuestas
// curadas de content/chat-answers.js): versiona la caché de respuestas del widget.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildKnowledge } from '../src/lib/knowledge.js'
import { LOCALES } from '../src/i18n/config.js'
import { curatedChunks } from '../content/chat-knowledge.js'
import { ANSWERS } from '../content/chat-answers.js'
import { contentVersion } from '../worker/chat/version.js'

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'worker', 'generated')
mkdirSync(out, { recursive: true })
// El asistente cita como contacto general info@agentceo.io (T35 · adenda, Diego). La web y los
// documentos legales conservan los suyos: el cambio se hace SOLO en lo que lee el chat.
const chatContact = (c) => ({ ...c, text: c.text.replaceAll('info@klinworks.com', 'info@agentceo.io'), title: c.title.replaceAll('info@klinworks.com', 'info@agentceo.io') })
const data = Object.fromEntries(LOCALES.map((l) => [l, [...buildKnowledge(l), ...curatedChunks(l)].map(chatContact)]))
writeFileSync(join(out, 'knowledge.json'), JSON.stringify(data))
const version = await contentVersion({ knowledge: data, answers: ANSWERS })
writeFileSync(join(out, 'content-version.json'), `${JSON.stringify({ version })}\n`)
const kb = (s) => `${(s / 1024).toFixed(1)} KB`
console.log(`✓ knowledge.json · ${LOCALES.map((l) => `${l}: ${data[l].length} fragmentos`).join(' · ')} · ${kb(JSON.stringify(data).length)} · versión de contenido ${version} · ${ANSWERS.length} respuestas curadas`)
