// PRUEBA REAL de envío: UN correo, waitlist-welcome en español, a ceo@agentceo.io por Resend.
// ⛔ Lo ejecuta una persona a mano, nunca un test ni un agente. No se cablea a nada.
//
//   node emails/scripts/send-test.mjs     (EMAIL_ASSET_BASE_URL por defecto: https://agentceo.io/email-assets/v1)
//   (añade --dry-run para hacerlo todo MENOS el envío)
//
// Qué hace, en orden, y se para en el primer fallo:
//   1. Lee RESEND_API_KEY de .dev.vars (raíz del repo). La clave NUNCA se imprime: ni en errores.
//   2. EMAIL_ASSET_BASE_URL (https; por defecto la de producción, EMAIL_ASSET_BASE). POSTAL_ADDRESS: entorno, o .dev.vars, o la de por defecto (brand.js);
//      si está definida pero vacía, no envía.
//   3. Pinta waitlist-welcome.es con los datos de ejemplo (ficticios) y el asunto de la prueba.
//   4. Comprueba que CADA <img> del HTML es https, acaba en .png/.jpg/.gif y responde 200 con image/*.
//      Si una sola falla, NO envía (la Prueba 1 llegó con imágenes rotas: los PNG no estaban publicados).
//   5. Un único POST a Resend, sin reintentos y con Idempotency-Key fija: repetirlo en 24 h no duplica.
// Opcionales: UNSUBSCRIBE_URL (por defecto mailto:info@agentceo.io?subject=Baja) y TEST_NAME (por defecto, sin nombre).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { EMAIL_IMAGE_URL, DEFAULT_POSTAL_ADDRESS, EMAIL_ASSET_BASE } from '../src/brand.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

export const SEND = {
  template: 'waitlist-welcome',
  locale: 'es',
  from: 'Agent CEO <info@agentceo.io>',
  to: 'ceo@agentceo.io',
  subject: '[Prueba 2] Bienvenido a la lista de espera de Agent CEO',
  idempotencyKey: 'agentceo-prueba-2-waitlist-welcome-es',
}

/** Lee UNA variable de un fichero .dev.vars (KEY=valor, admite comillas). null si no está; '' si está vacía. */
export function readDevVar(file, name) {
  if (!fs.existsSync(file)) return null
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m && m[1] === name) return m[2].replace(/^(['"])(.*)\1$/, '$2').trim()
  }
  return null
}

/** Tapa la clave en cualquier texto que vaya a la pantalla (cinturón y tirantes). */
export const redact = (text, secret) => (secret ? String(text).split(secret).join('***') : String(text))

/** Todas las URL de <img src> de un HTML. */
export const imageSources = (html) => [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')))]

/** Comprueba que cada imagen es https .png/.jpg/.gif y responde 200 con image/*. Devuelve los problemas. */
export async function checkImages(html, fetchImpl = fetch) {
  const problems = []
  for (const src of imageSources(html)) {
    if (!EMAIL_IMAGE_URL.test(src)) { problems.push(`${src} → no es https .png/.jpg/.gif`); continue }
    try {
      const res = await fetchImpl(src, { method: 'GET', redirect: 'follow' })
      const type = res.headers.get('content-type') || ''
      if (res.status !== 200 || !/^image\/(png|jpeg|gif)/.test(type)) problems.push(`${src} → ${res.status} ${type || 'sin content-type'}`)
    } catch (e) {
      problems.push(`${src} → sin respuesta (${e.cause?.code || e.message})`)
    }
  }
  return problems
}

/** El correo de la prueba, listo para Resend (sin la clave). */
export async function buildTestEmail({ render, byId, assetBase, postalAddress, unsubscribeUrl, name }) {
  const t = byId(SEND.template)
  const { name: _sampleName, ...sample } = t.sample(SEND.locale)
  const data = { ...sample, ...(name ? { name } : {}), unsubscribeUrl }
  const r = await render(t, SEND.locale, data, { assetBase, postalAddress })
  return { from: SEND.from, to: [SEND.to], subject: SEND.subject, html: r.html, text: r.text, headers: r.headers }
}

export function config(env = process.env, devVars = path.join(ROOT, '.dev.vars')) {
  const errors = []
  const assetBase = (env.EMAIL_ASSET_BASE_URL || EMAIL_ASSET_BASE).trim()
  if (!/^https:\/\/\S+/.test(assetBase)) errors.push(`EMAIL_ASSET_BASE_URL debe ser https (llegó «${assetBase}»)`)
  const postalAddress = (env.POSTAL_ADDRESS ?? readDevVar(devVars, 'POSTAL_ADDRESS') ?? DEFAULT_POSTAL_ADDRESS).trim()
  if (!postalAddress) errors.push('POSTAL_ADDRESS está vacía: el pie no sale sin dirección postal (quítala para usar la de por defecto)')
  const apiKey = readDevVar(devVars, 'RESEND_API_KEY')
  if (!apiKey) errors.push('RESEND_API_KEY en .dev.vars')
  return { errors, assetBase, postalAddress, apiKey, unsubscribeUrl: env.UNSUBSCRIBE_URL || 'mailto:info@agentceo.io?subject=Baja', name: env.TEST_NAME || '' }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const cfg = config()
  if (cfg.errors.length) { console.error(`✗ Falta configuración (no se envía nada):\n  - ${cfg.errors.join('\n  - ')}`); process.exit(1) }
  const say = (s) => console.log(redact(s, cfg.apiKey))
  const { loadEmails } = await import('./build.mjs')
  const { render, byId } = await loadEmails()
  const email = await buildTestEmail({ render, byId, ...cfg })

  say(`Plantilla ${SEND.template}.${SEND.locale} · de ${SEND.from} · para ${SEND.to}\nAsunto: ${email.subject}\nImágenes desde ${cfg.assetBase}:`)
  const srcs = imageSources(email.html)
  const problems = await checkImages(email.html)
  for (const s of srcs) say(`  ${problems.some((p) => p.startsWith(`${s} `)) ? '✗' : '✓'} ${s}`)
  if (problems.length) {
    console.error(redact(`✗ ${problems.length} imagen(es) no se verían en Gmail. NO se envía:\n  - ${problems.join('\n  - ')}`, cfg.apiKey))
    process.exit(1)
  }
  if (dryRun) { say('✓ --dry-run: todo listo; no se envió nada.'); return }

  // Un único POST. Sin reintentos: si falla, lo decide una persona.
  let res, body
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': SEND.idempotencyKey },
      body: JSON.stringify(email),
    })
    body = await res.text()
  } catch (e) {
    console.error(redact(`✗ No hubo respuesta de Resend (${e.cause?.code || e.message}). No se reintenta.`, cfg.apiKey))
    process.exit(1)
  }
  if (!res.ok) { console.error(redact(`✗ Resend respondió ${res.status}: ${body.slice(0, 400)}`, cfg.apiKey)); process.exit(1) }
  let id = ''
  try { id = JSON.parse(body).id || '' } catch {}
  say(`✓ Enviado UN correo a ${SEND.to}${id ? ` · id ${id}` : ''}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
