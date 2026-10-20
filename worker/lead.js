// POST /api/lead · leads de los recursos (lead magnet). Un correo puede pedir varios recursos.
import { json } from './lib/http.js'
import { readJson, str, cleanEmail, isBot } from './lib/validate.js'

export async function handleLead(request, env) {
  const body = await readJson(request)
  if (!body) return json({ ok: false, error: 'Cuerpo inválido' }, 400)

  // Honeypot: se responde OK a propósito, sin guardar (no le avisamos al bot).
  if (isBot(body)) return json({ ok: true, received: true })

  const email = cleanEmail(body.email)
  if (!email) return json({ ok: false, error: 'Escribe un correo válido.' }, 400)

  const resource = str(body.resource, 120)
  if (!resource) return json({ ok: false, error: 'Falta el recurso solicitado.' }, 400)

  const name = str(body.name, 120)
  const source = str(body.source, 60) || 'recursos'
  const referrer = str(body.referrer, 300)
  const ua = str(request.headers.get('user-agent') || '', 300)

  try {
    // INSERT OR IGNORE + índice único (email, resource) → reenviar no duplica.
    await env.DB.prepare(
      'INSERT OR IGNORE INTO leads (email, name, resource, source, referrer, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
    )
      .bind(email, name || null, resource, source, referrer || null, ua || null)
      .run()
    return json({ ok: true, received: true })
  } catch {
    return json({ ok: false, error: 'No pudimos guardarlo. Intenta de nuevo.' }, 500)
  }
}
