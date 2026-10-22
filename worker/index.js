// Worker de la landing de AgentCEO.
// - Sirve el sitio estático que genera Astro en ./dist (binding ASSETS).
// - Captura la LISTA DE ESPERA (pre-lanzamiento) en D1 vía POST /api/waitlist.
// - Captura los leads de los recursos vía POST /api/lead.
// - Widget de soporte vía POST /api/chat (flag CHAT_MODE; hoy «stub», sin LLM). Es el canal
//   web del backend de chat agnóstico de canal (worker/chat/channels/).
// - Bienvenida por correo a la lista de espera (T57, flag WELCOME_EMAIL_ENABLED): se encola en el signup y
//   un Cron Trigger barre los pendientes (scheduled). Baja de un clic en /api/unsubscribe.
import { json, withSecurityHeaders, withCache } from './lib/http.js'
import { handleWaitlist } from './waitlist.js'
import { handleLead } from './lead.js'
import { handleChat } from './chat/handler.js'
import { handleUnsubscribe } from './unsubscribe.js'
import { sweepEmails } from './email/welcome.js'
import { turnstileConfig } from './lib/turnstile.js'
import { localeRedirect } from './lib/locale.js'

// Durable Object de los topes del widget (lo exige wrangler: se exporta desde el main).
export { ChatGuard } from './chat/guard.js'

// Las legales se enlazaban con .html hasta la v1: redirección PERMANENTE a la URL limpia.
const LEGACY_HTML = /^\/legal\/([a-z-]+)\.html$/

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // www → apex (una sola URL canónica por página).
    if (url.hostname === 'www.agentceo.io') {
      url.hostname = 'agentceo.io'
      return Response.redirect(url.toString(), 301)
    }

    // La landing no tiene login propio: /login lleva al login de la app CRM.
    if (url.pathname === '/login' || url.pathname === '/login/') {
      return Response.redirect('https://app.agentceo.io/login', 302)
    }

    const legacy = LEGACY_HTML.exec(url.pathname)
    if (legacy) {
      url.pathname = `/legal/${legacy[1]}`
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/api/waitlist') {
      if (request.method === 'POST') return handleWaitlist(request, env, ctx)
      return json({ ok: false, error: 'Método no permitido' }, 405, { allow: 'POST' })
    }

    if (url.pathname === '/api/chat') return handleChat(request, env, ctx)

    if (url.pathname === '/api/unsubscribe') return handleUnsubscribe(request, env)

    if (url.pathname === '/api/lead') {
      if (request.method === 'POST') return handleLead(request, env, ctx)
      return json({ ok: false, error: 'Método no permitido' }, 405, { allow: 'POST' })
    }

    // T62 · «/» sin idioma elegido → el del navegador (/en/, /pt/). Reglas y excepciones: worker/lib/locale.js.
    const toLocale = localeRedirect(request, url)
    if (toLocale) return toLocale

    // Todo lo demás → los assets estáticos (con cabeceras de seguridad en el HTML).
    const res = await env.ASSETS.fetch(request)
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('text/html')) return withCache(res, url.pathname)
    // Turnstile (T58): la web es estática, así que la site key (pública) se inyecta aquí, en el <head>, solo
    // cuando está activo. src/scripts/turnstile.js la lee; sin ella, la página no carga nada de terceros.
    const ts = turnstileConfig(env)
    const page = ts.enabled
      ? new HTMLRewriter().on('head', { element: (el) => el.append(`<meta name="ac-turnstile" content="${ts.siteKey}">`, { html: true }) }).transform(res)
      : res
    const out = withSecurityHeaders(page, url.protocol === 'https:', { turnstile: ts.enabled })
    // La raíz depende del idioma y de la cookie (puede redirigir): ninguna caché debe mezclar respuestas.
    if (url.pathname === '/') out.headers.append('vary', 'Accept-Language, Cookie')
    return out
  },

  // Cron Trigger (wrangler.jsonc → triggers.crons): reintentos y bienvenidas que esperaban al paso 2.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(sweepEmails(env).catch((e) => console.error(JSON.stringify({ evt: 'email.sweep_failed', error: String(e?.message || e).slice(0, 200) }))))
  },
}
