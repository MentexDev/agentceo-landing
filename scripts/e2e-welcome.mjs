// E2E LOCAL de la bienvenida por correo (T57): wrangler dev --local con una D1 LOCAL y TEMPORAL (su propia
// carpeta --persist-to, que se borra al terminar: nunca la .wrangler/state del repo ni la D1 de producción).
//
//   node scripts/e2e-welcome.mjs            → Resend SIMULADO (servidor en 127.0.0.1): signup → fila 'sent'
//   node scripts/e2e-welcome.mjs --real     → UN correo REAL vía Resend a ceo@agentceo.io (clave de .dev.vars)
//
// Requisitos: `npm run build` hecho (dist/ y worker/generated/). Puertos (libres en esta Mac, fuera de la
// lista prohibida): Worker 8797, Resend simulado 8796, inspector 9241. Cámbialos con E2E_PORT, E2E_MOCK_PORT
// y E2E_INSPECTOR_PORT.
// ⛔ La clave NUNCA se imprime: el simulador solo comprueba que llega una cabecera «Bearer …».
// ⛔ --real envía UNO solo: deja una marca en el directorio temporal del sistema y se niega a repetir.
import { spawn, execFileSync } from 'node:child_process'
import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REAL = process.argv.includes('--real')
const PORT = Number(process.env.E2E_PORT || 8797)
const MOCK_PORT = Number(process.env.E2E_MOCK_PORT || 8796)
const INSPECTOR = Number(process.env.E2E_INSPECTOR_PORT || 9241)
const FORBIDDEN = new Set([3000, 4000, 3100, 4100, 4101, 5433, 6380, 9333, 9334])
for (const p of [PORT, MOCK_PORT, INSPECTOR]) if (FORBIDDEN.has(p)) throw new Error(`Puerto ${p} prohibido`)
const REAL_TO = 'ceo@agentceo.io'
const REAL_MARK = path.join(os.tmpdir(), 'agentceo-t57-real-send.json')
const BASE = `http://127.0.0.1:${PORT}`
const WRANGLER = path.join(ROOT, 'node_modules/.bin/wrangler')
const ENV = { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: '1', NO_COLOR: '1' }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const results = []
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`) }

// ── Resend simulado ────────────────────────────────────────────────────────────────────────────────────
// Por destinatario: «fail2-…» falla 2 veces con 503 y luego acepta; «bad-…» devuelve 422; el resto, 200.
function startMock() {
  const calls = []
  const seen = new Map()
  const server = http.createServer((req, res) => {
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      let payload = {}
      try { payload = JSON.parse(body) } catch {}
      const to = payload.to?.[0] || ''
      const n = (seen.get(to) || 0) + 1
      seen.set(to, n)
      // Solo se guarda SI hay clave, nunca cuál.
      calls.push({ to, n, subject: payload.subject, html: payload.html || '', text: payload.text || '', headers: payload.headers || {}, idem: req.headers['idempotency-key'], bearer: /^Bearer \S{8,}/.test(req.headers.authorization || '') })
      const reply = (status, obj) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)) }
      if (to.startsWith('bad-')) return reply(422, { name: 'validation_error', message: 'simulado' })
      if (to.startsWith('fail2-') && n <= 2) return reply(503, { name: 'internal_server_error', message: 'simulado' })
      reply(200, { id: `re_mock_${calls.length}` })
    })
  })
  return new Promise((resolve, reject) => server.on('error', reject).listen(MOCK_PORT, '127.0.0.1', () => resolve({ server, calls })))
}

// ── wrangler dev + D1 local temporal ──────────────────────────────────────────────────────────────────
function d1(persist, sql) {
  const out = execFileSync(WRANGLER, ['d1', 'execute', 'agentceo-waitlist', '--local', '--persist-to', persist, '--json', '--command', sql], { cwd: ROOT, env: ENV, stdio: ['ignore', 'pipe', 'pipe'] }).toString()
  return JSON.parse(out)[0]?.results || []
}

async function startWorker(persist, vars) {
  execFileSync(WRANGLER, ['d1', 'migrations', 'apply', 'agentceo-waitlist', '--local', '--persist-to', persist], { cwd: ROOT, env: ENV, stdio: ['ignore', 'pipe', 'pipe'] })
  const args = ['dev', '--local', '--port', String(PORT), '--ip', '127.0.0.1', '--inspector-port', String(INSPECTOR), '--persist-to', persist, '--test-scheduled', '--show-interactive-dev-session=false']
  for (const [k, v] of Object.entries(vars)) args.push('--var', `${k}:${v}`)
  const child = spawn(WRANGLER, args, { cwd: ROOT, env: ENV, detached: true, stdio: ['ignore', 'pipe', 'pipe'] })
  let log = ''
  child.stdout.on('data', (d) => (log += d))
  child.stderr.on('data', (d) => (log += d))
  for (let i = 0; i < 120; i++) {
    try { if ((await fetch(`${BASE}/`)).status < 500) return { child, log: () => log } } catch {}
    if (child.exitCode != null) break
    await sleep(500)
  }
  stop(child)
  // El log de wrangler no lleva secretos (no imprime los valores de .dev.vars), pero se recorta igualmente.
  throw new Error(`wrangler dev no arrancó en ${BASE}:\n${log.slice(-1500)}`)
}
const stop = (child) => { try { process.kill(-child.pid, 'SIGTERM') } catch {} }

let ip = 0
const signup = (body) => fetch(`${BASE}/api/waitlist`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'cf-connecting-ip': `10.77.0.${++ip}` },
  body: JSON.stringify(body),
})
async function waitRow(persist, email, until = (r) => r && ['sent', 'failed'].includes(r.status), ms = 30_000) {
  const t = Date.now()
  let row
  while (Date.now() - t < ms) {
    row = d1(persist, `SELECT status, attempts, resend_id, last_error, locale FROM email_send_log WHERE email = '${email}'`)[0]
    if (until(row)) return row
    await sleep(700)
  }
  return row
}

// ── Escenarios ────────────────────────────────────────────────────────────────────────────────────────
async function mockRun() {
  const persist = fs.mkdtempSync(path.join(os.tmpdir(), 'agentceo-e2e-welcome-'))
  const { server, calls } = await startMock()
  let w
  try {
    w = await startWorker(persist, { WELCOME_EMAIL_ENABLED: 'true', RESEND_API_URL: `http://127.0.0.1:${MOCK_PORT}/emails`, RESEND_API_KEY: 're_FALSA_e2e_0123456789', WELCOME_EMAIL_DELAY_S: '0' })
    const to = (e) => calls.filter((c) => c.to === e)

    // 1. es con negocio → sent, en español, con su regalo y la mascota https.
    const a = 'e2e-es@example.com'
    const t0 = Date.now()
    const r1 = await signup({ email: a, locale: 'es', business: 'moda' })
    check('signup responde 200 sin esperar al correo', r1.status === 200, `${Date.now() - t0} ms`)
    const rowA = await waitRow(persist, a)
    check('es: fila en email_send_log con status sent', rowA?.status === 'sent' && /^re_mock_/.test(rowA.resend_id), JSON.stringify(rowA))
    const ca = to(a)[0]
    check('es: asunto y texto en español, regalo de moda', /Ya tienes tu lugar/.test(ca?.subject) && /asesora de estilo/.test(ca?.text), ca?.subject)
    check('es: mascota por defecto con URL https absoluta', ca?.html.includes('https://agentceo.io/email-assets/v1/ceo.png'))
    check('la clave viaja como Bearer (no se imprime)', ca?.bearer === true)
    check('List-Unsubscribe one-click', /^<https?:\/\/[^>]+\/api\/unsubscribe\?t=[a-f0-9]{48}>$/.test(ca?.headers['List-Unsubscribe'] || '') && ca?.headers['List-Unsubscribe-Post'] === 'List-Unsubscribe=One-Click')

    // 2. Re-inscripción → no duplica.
    await signup({ email: a, locale: 'es', business: 'comida' })
    await sleep(2500)
    check('re-inscripción: 1 fila, 1 envío', d1(persist, `SELECT COUNT(*) AS n FROM email_send_log WHERE email = '${a}'`)[0].n === 1 && to(a).length === 1, `${to(a).length} envío(s)`)

    // 3. en → en inglés.
    const b = 'e2e-en@example.com'
    await signup({ email: b, locale: 'en', business: 'servicios' })
    const rowB = await waitRow(persist, b)
    check('en: sent, asunto en inglés', rowB?.status === 'sent' && /Your spot in Agent CEO is saved/.test(to(b)[0]?.subject), to(b)[0]?.subject)

    // 4. 503 dos veces → reintenta en la misma entrega y sale.
    const c = 'fail2-e2e@example.com'
    await signup({ email: c, locale: 'es', business: 'tienda' })
    const rowC = await waitRow(persist, c)
    check('503×2 → reintentos con backoff → sent al 3.º', rowC?.status === 'sent' && rowC.attempts === 3 && to(c).length === 3 && new Set(to(c).map((x) => x.idem)).size === 1, JSON.stringify(rowC))

    // 5. 422 → failed sin reintentar.
    const d = 'bad-e2e@example.com'
    await signup({ email: d, locale: 'es', business: 'tienda' })
    const rowD = await waitRow(persist, d)
    check('422 → failed al 1.er intento, sin reintentos', rowD?.status === 'failed' && rowD.attempts === 1 && to(d).length === 1, JSON.stringify(rowD))

    // 6. Paso 1 sin negocio → espera; el Cron Trigger (/__scheduled) la manda.
    const e = 'e2e-cron@example.com'
    await signup({ email: e, locale: 'en' })
    await sleep(1500)
    const before = d1(persist, `SELECT status FROM email_send_log WHERE email = '${e}'`)[0]
    const cron = await fetch(`${BASE}/__scheduled?cron=*/2+*+*+*+*`)
    const rowE = await waitRow(persist, e)
    check('sin negocio: pending hasta el cron; el barrido la envía', before?.status === 'pending' && cron.status === 200 && rowE?.status === 'sent', `antes ${before?.status} → ${rowE?.status}`)

    // 7. Baja: GET no da de baja; POST one-click sí.
    const unsub = (ca?.headers['List-Unsubscribe'] || '').slice(1, -1).replace(/^https?:\/\/[^/]+/, BASE)
    const g = await fetch(unsub)
    const after = d1(persist, `SELECT unsubscribed_at FROM email_preferences WHERE email = '${a}'`)[0]
    const p = await fetch(unsub, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'List-Unsubscribe=One-Click' })
    const done = d1(persist, `SELECT unsubscribed_at FROM email_preferences WHERE email = '${a}'`)[0]
    check('baja: GET muestra el botón sin dar de baja; POST da de baja', g.status === 200 && after?.unsubscribed_at == null && p.status === 200 && !!done?.unsubscribed_at)
  } finally {
    if (w) stop(w.child)
    server.close()
    await sleep(500)
    fs.rmSync(persist, { recursive: true, force: true })
  }
}

async function realRun() {
  if (fs.existsSync(REAL_MARK)) {
    console.error(`✗ Ya se hizo la prueba real (${REAL_MARK}). No se repite: un solo correo.`)
    process.exit(1)
  }
  const persist = fs.mkdtempSync(path.join(os.tmpdir(), 'agentceo-e2e-welcome-real-'))
  let w
  try {
    // Sin RESEND_API_URL → api.resend.com. RESEND_API_KEY sale de .dev.vars (wrangler dev lo carga solo).
    w = await startWorker(persist, { WELCOME_EMAIL_ENABLED: 'true' })
    const r = await signup({ email: REAL_TO, locale: 'es', business: 'servicios', source: 'e2e-t57' })
    check('signup real → 200', r.status === 200)
    const row = await waitRow(persist, REAL_TO, undefined, 60_000)
    check('fila real en email_send_log', row?.status === 'sent', `status=${row?.status} attempts=${row?.attempts}${row?.last_error ? ` error=${row.last_error}` : ''}`)
    if (row?.resend_id) {
      fs.writeFileSync(REAL_MARK, JSON.stringify({ to: REAL_TO, resend_id: row.resend_id, at: new Date().toISOString() }))
      console.log(`RESEND_ID ${row.resend_id}`)
    }
  } finally {
    if (w) stop(w.child)
    await sleep(500)
    fs.rmSync(persist, { recursive: true, force: true })
  }
}

await (REAL ? realRun() : mockRun())
const bad = results.filter((r) => !r.ok)
console.log(`\n${results.length - bad.length}/${results.length} comprobaciones OK${REAL ? ' (prueba REAL)' : ' (Resend simulado)'}`)
process.exit(bad.length ? 1 : 0)
