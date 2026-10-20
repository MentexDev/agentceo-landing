// Registro de plantillas de Agent CEO. Cada una: { id, phase, kind, tone, title, when, required, sample, copy, Email }.
//   kind: 'transactional' (servicio: sin baja, sin publicidad) | 'marketing' (siempre con baja, CAN-SPAM)
//   phase: 'A' (la landing de hoy: lista de espera) | 'B' (llega con la app)
import waitlist from './templates/waitlist.jsx'
import account from './templates/account.jsx'
import team from './templates/team.jsx'
import billing from './templates/billing.jsx'
import lifecycle from './templates/lifecycle.jsx'
import { render as renderTemplate } from './render.jsx'

export { LOCALES } from './brand.js'

export const TEMPLATES = [...waitlist, ...account, ...team, ...billing, ...lifecycle]
export const byId = (id) => TEMPLATES.find((t) => t.id === id)

/**
 * render(template | id, locale, data, opts?) → Promise<{ subject, preheader, html, text, headers }>
 * Pura: no envía nada. El envío (Resend) se cableará aparte, cuando Diego lo apruebe.
 */
export function render(template, locale, data, opts) {
  const tpl = typeof template === 'string' ? byId(template) : template
  if (!tpl) return Promise.reject(new Error(`render: plantilla desconocida «${template}»`))
  return renderTemplate(tpl, locale, data, opts)
}
