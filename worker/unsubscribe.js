// /api/unsubscribe?t=<token> · baja de los correos de marketing (CAN-SPAM; RFC 8058 one-click).
//   GET  → página con un botón «Confirmar baja» (los escáneres de enlaces de los correos hacen GET: si el GET
//          diera de baja, un antivirus daría de baja a la gente sin querer).
//   POST → da de baja. Es el «one-click» de Gmail/Yahoo (List-Unsubscribe-Post: List-Unsubscribe=One-Click),
//          que llega SIN Origin desde sus servidores: aquí el token es la credencial, no el origen.
// El token es aleatorio (48 hex, email_preferences): no revela el correo ni se puede adivinar.
// Nunca dice si un token existe más allá de «enlace no válido», y no expone el correo.
import { withSecurityHeaders } from './lib/http.js'
import { limited } from './lib/ratelimit.js'
import { maskEmail, logEvent } from './email/mask.js'

const TOKEN = /^[a-f0-9]{32,64}$/

const COPY = {
  es: {
    title: 'Darte de baja', ask: '¿Dejar de recibir los correos de novedades de Agent CEO?', button: 'Sí, darme de baja',
    done: 'Listo: no te volveremos a escribir con novedades.', note: 'Si algún día tienes cuenta, los avisos de servicio (seguridad, pagos) siguen llegando.',
    already: 'Ya estabas dado de baja. No te escribiremos con novedades.', invalid: 'Este enlace no es válido o ya caducó.', home: 'Volver a agentceo.io',
  },
  pt: {
    title: 'Cancelar inscrição', ask: 'Deixar de receber os e-mails de novidades do Agent CEO?', button: 'Sim, cancelar minha inscrição',
    done: 'Pronto: não vamos mais te escrever com novidades.', note: 'Se um dia você tiver conta, os avisos de serviço (segurança, pagamentos) continuam chegando.',
    already: 'Você já tinha cancelado. Não vamos te escrever com novidades.', invalid: 'Este link não é válido ou já expirou.', home: 'Voltar para agentceo.io',
  },
  en: {
    title: 'Unsubscribe', ask: 'Stop getting Agent CEO update emails?', button: 'Yes, unsubscribe me',
    done: 'Done: we won’t send you updates again.', note: 'If you ever have an account, service notices (security, billing) still arrive.',
    already: 'You were already unsubscribed. We won’t send you updates.', invalid: 'This link isn’t valid or has expired.', home: 'Back to agentceo.io',
  },
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' })[c])

function page(locale, body, status = 200, https = true) {
  const c = COPY[locale]
  const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(c.title)} · Agent CEO</title>
<style>:root{color-scheme:light dark}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F4F2ED;color:#111113;font:16px/1.6 Geist,'Helvetica Neue',Helvetica,Arial,sans-serif;padding:16px}
main{max-width:460px;width:100%;background:#FBFAF7;border:1px solid #E2DED4;border-radius:20px;padding:32px 28px}
h1{margin:0 0 12px;font:400 34px/1.1 'Instrument Serif',Georgia,serif}p{margin:0 0 14px}.m{color:#4E4C47;font-size:14px}
button{font:inherit;font-weight:600;background:#111113;color:#F4F2ED;border:0;border-radius:999px;padding:13px 24px;cursor:pointer}
a{color:#7A5C17}@media (prefers-color-scheme:dark){body{background:#111113;color:#F4F2ED}main{background:#1D1D20;border-color:#34343A}.m{color:#A9A7A0}button{background:#D9B866;color:#111113}a{color:#D9B866}}</style>
</head><body><main><h1>${esc(c.title)}</h1>${body}<p class="m"><a href="${locale === 'es' ? '/' : '/en/'}">${esc(c.home)}</a></p></main></body></html>`
  const res = new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } })
  return withSecurityHeaders(res, https)
}

/** @param {Request} request @param {{ DB: D1Database }} env */
export async function handleUnsubscribe(request, env) {
  const url = new URL(request.url)
  const https = url.protocol === 'https:'
  const token = url.searchParams.get('t') || ''
  if (request.method !== 'GET' && request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET, POST' } })
  }
  if (request.method === 'POST') {
    const rl = await limited(request, env)
    if (rl) return rl
  }
  const pref = TOKEN.test(token) && env.DB
    ? await env.DB.prepare(
      `SELECT p.email, p.unsubscribed_at, COALESCE(l.locale, s.locale, 'es') AS locale FROM email_preferences p
         LEFT JOIN signups s ON s.email = p.email
         LEFT JOIN email_send_log l ON l.email = p.email
        WHERE p.unsub_token = ? LIMIT 1`,
    ).bind(token).first().catch(() => null)
    : null
  const want = pref?.locale || url.searchParams.get('l')
  const locale = want === 'en' || want === 'pt' ? want : 'es'
  const c = COPY[locale]
  if (!pref) return page(locale, `<p>${esc(c.invalid)}</p>`, 404, https)

  if (request.method === 'GET') {
    if (pref.unsubscribed_at) return page(locale, `<p>${esc(c.already)}</p>`, 200, https)
    return page(locale, `<p>${esc(c.ask)}</p><form method="post" action="/api/unsubscribe?t=${esc(token)}"><p><button type="submit">${esc(c.button)}</button></p></form>`, 200, https)
  }
  await env.DB.prepare(`UPDATE email_preferences SET unsubscribed_at = COALESCE(unsubscribed_at, datetime('now')) WHERE unsub_token = ?`).bind(token).run()
  if (!pref.unsubscribed_at) logEvent('info', 'email.unsubscribed', { to: maskEmail(pref.email) })
  return page(locale, `<p>${esc(c.done)}</p><p class="m">${esc(c.note)}</p>`, 200, https)
}
