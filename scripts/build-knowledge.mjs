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
import { RULES } from '../worker/chat/live.js'
import { findPrivate } from '../worker/chat/private.js'

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'worker', 'generated')
mkdirSync(out, { recursive: true })
// El asistente cita como contacto general info@agentceo.io (T35 · adenda, Diego). La web y los
// documentos legales conservan los suyos: el cambio se hace SOLO en lo que lee el chat.
const chatContact = (c) => ({ ...c, text: c.text.replaceAll('info@klinworks.com', 'info@agentceo.io'), title: c.title.replaceAll('info@klinworks.com', 'info@agentceo.io') })
const data = Object.fromEntries(LOCALES.map((l) => [l, [...buildKnowledge(l), ...curatedChunks(l)].map(chatContact)]))
// T40 · RED DE SEGURIDAD: si un dato societario/registral (constitución, expediente, oficina
// registrada, EIN, direcciones…) se cuela en lo que lee o dice el chat, el build FALLA aquí.
const leaks = []
for (const l of LOCALES) for (const c of data[l]) for (const f of ['title', 'text']) for (const h of findPrivate(c[f])) leaks.push(`knowledge ${l} · ${c.id}.${f}: ${h.name} «${h.match}»`)
for (const e of ANSWERS) for (const l of LOCALES) for (const h of findPrivate(e.a[l])) leaks.push(`respuesta curada ${e.id} · ${l}: ${h.name} «${h.match}»`)
for (const l of LOCALES) for (const h of findPrivate(RULES[l])) leaks.push(`prompt de sistema ${l}: ${h.name} «${h.match}»`)
if (leaks.length) {
  console.error(`✗ Datos societarios/registrales en el conocimiento del chat (worker/chat/private.js):\n  ${leaks.join('\n  ')}`)
  process.exit(1)
}
writeFileSync(join(out, 'knowledge.json'), JSON.stringify(data))
const version = await contentVersion({ knowledge: data, answers: ANSWERS, prompt: RULES })
writeFileSync(join(out, 'content-version.json'), `${JSON.stringify({ version })}\n`)
const kb = (s) => `${(s / 1024).toFixed(1)} KB`
console.log(`✓ knowledge.json · ${LOCALES.map((l) => `${l}: ${data[l].length} fragmentos`).join(' · ')} · ${kb(JSON.stringify(data).length)} · versión de contenido ${version} · ${ANSWERS.length} respuestas curadas`)
