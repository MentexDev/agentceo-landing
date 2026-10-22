// Pre-render de los correos que ENVÍA el Worker (T57) → worker/generated/emails.js (ignorado por git).
//   node emails/scripts/worker-templates.mjs      (lo corren `prebuild` y `pretest` del repo)
//
// Por qué pre-render y no React Email dentro del Worker (medido el 2026-10-22):
//   · bundle: el Worker pesa 157 KiB (53 KiB gzip); React Email + react-dom/server añaden ~715 KiB (223 KiB gzip).
//   · CPU: un render de waitlist-welcome cuesta 13 ms de mediana y 39 ms en p95 (89 ms el primero, más 425 ms de
//     import en frío), por encima de los 10 ms de CPU por invocación del plan Free.
// Aquí se pinta la MISMA plantilla (emails/src) con MARCAS en lugar de los datos de cada persona; el Worker
// solo sustituye marcas por valores escapados (< 1 ms). Cero HTML duplicado: si la plantilla cambia, esto cambia.
//
// Variantes: idioma (es/en/pt) × con nombre / sin nombre («¡Estás dentro, Ana!» / «¡Estás dentro!») × con posición /
// sin posición (T60b: «Tu lugar en la lista · #N», la real de D1; si no se puede calcular, sin el bloque).
// Las ideas de prompts (3 por tipo de negocio, T60c), la fecha, la posición, la baja y la base de los PNG son marcas.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadEmails } from './build.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'worker/generated/emails.js')

// Marcas: solo letras (sobreviven intactas al escape de React y a html-to-text) y únicas.
export const TOKENS = {
  name: 'zzacnamezz',
  date: 'zzacdatezz',
  idea1: 'zzacideaunozz', use1: 'zzacusounozz',
  idea2: 'zzacideadoszz', use2: 'zzacusodoszz',
  idea3: 'zzacideatreszz', use3: 'zzacusotreszz',
  position: 'zzacposicionzz',
  unsubscribeUrl: 'https://zzacunsubzz.invalid/u',
  assetBase: 'https://zzacassetszz.invalid/v1',
}
const WORKER_TEMPLATES = ['waitlist-welcome']

export async function buildWorkerTemplates() {
  const { render, byId, LOCALES } = await loadEmails()
  const out = {}
  for (const id of WORKER_TEMPLATES) {
    const t = byId(id)
    out[id] = { kind: t.kind, locales: {} }
    for (const locale of LOCALES) {
      out[id].locales[locale] = {}
      for (const variant of ['named', 'anon', 'named+pos', 'anon+pos']) {
        const named = variant.startsWith('named')
        const withPos = variant.endsWith('+pos')
        const data = {
          ...(named ? { name: TOKENS.name } : {}),
          ...(withPos ? { positionLabel: TOKENS.position } : {}),
          dateLabel: TOKENS.date,
          ideas: [1, 2, 3].map((n) => ({ prompt: TOKENS[`idea${n}`], use: TOKENS[`use${n}`] })),
          unsubscribeUrl: TOKENS.unsubscribeUrl,
        }
        const r = await render(t, locale, data, { assetBase: TOKENS.assetBase })
        // Cada marca tiene que estar donde se espera; si una plantilla deja de usarla, el build falla en voz alta.
        const ideaKeys = ['idea1', 'use1', 'idea2', 'use2', 'idea3', 'use3']
        const need = { html: ['date', ...ideaKeys, 'unsubscribeUrl', 'assetBase'], text: [...ideaKeys, 'unsubscribeUrl'] }
        if (named) { need.html.push('name'); need.text.push('name') }
        if (withPos) { need.html.push('position'); need.text.push('position') }
        for (const [part, keys] of Object.entries(need)) for (const k of keys) {
          if (!r[part].includes(TOKENS[k])) throw new Error(`worker-templates: ${id}.${locale}.${variant} sin la marca ${k} en ${part}`)
        }
        out[id].locales[locale][variant] = { subject: r.subject, preheader: r.preheader, html: r.html, text: r.text }
      }
    }
  }
  return out
}

async function main() {
  const templates = await buildWorkerTemplates()
  const src = `// GENERADO por emails/scripts/worker-templates.mjs — no editar a mano (T57).\n` +
    `export const TOKENS = ${JSON.stringify(TOKENS)}\n` +
    `export const TEMPLATES = ${JSON.stringify(templates)}\n`
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, src)
  console.log(`✓ worker/generated/emails.js (${(Buffer.byteLength(src) / 1024).toFixed(0)} KB · ${Object.keys(templates).join(', ')})`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
