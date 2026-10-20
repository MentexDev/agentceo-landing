// render(template, locale, data) → { subject, preheader, html, text, headers }
// Función pura: no envía, no lee red ni disco, no guarda nada. Lista para Resend el día que haga falta:
//   resend.emails.send({ from, to, subject, html, text, headers })
import { render as toHtml } from '@react-email/render'
import { SITE, LOCALES } from './brand.js'

/**
 * @param {object} template  una plantilla del registro (o su id, si se pasa `registry`)
 * @param {'es'|'en'} locale
 * @param {object} data      los datos del destinatario (nunca se inventan: lo que falte, falla)
 * @param {{ assetBase?: string, site?: string }} [opts] assetBase = de dónde salen PNG y fuentes
 */
export async function render(template, locale, data = {}, opts = {}) {
  if (!template || typeof template.Email !== 'function') throw new Error('render: plantilla inválida')
  if (!LOCALES.includes(locale)) throw new Error(`render: idioma no soportado «${locale}»`)
  // Un correo con un enlace vacío es peor que no enviarlo: lo obligatorio falla en voz alta.
  const required = [...(template.required || []), ...(template.kind === 'marketing' ? ['unsubscribeUrl'] : [])]
  const missing = required.filter((k) => data[k] == null || data[k] === '')
  if (missing.length) throw new Error(`render(${template.id}): faltan datos: ${missing.join(', ')}`)

  const ctx = { locale, site: opts.site ?? SITE, assetBase: opts.assetBase ?? SITE }
  const c = template.copy[locale](data, ctx)
  const { Email } = template
  const element = <Email c={c} d={data} ctx={ctx} />
  const html = await toHtml(element)
  // Texto plano: el titular sin MAYÚSCULAS (html-to-text las pone por defecto) y sin huecos de 3+ líneas.
  const text = (await toHtml(element, { plainText: true, htmlToTextOptions: { selectors: [{ selector: 'h1', options: { uppercase: false } }] } }))
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  // Gmail y Yahoo exigen la baja en un clic (RFC 8058) a quien envía en volumen: va en las cabeceras.
  const headers = template.kind === 'marketing'
    ? { 'List-Unsubscribe': `<${data.unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' }
    : {}
  return { subject: c.subject, preheader: c.preheader, html, text, headers }
}
