// render(template, locale, data, opts) → { subject, preheader, html, text, headers }
// Función pura: no envía, no lee red ni disco, no guarda nada. Lista para Resend el día que haga falta:
//   resend.emails.send({ from, to, subject, html, text, headers })
import { render as toHtml } from '@react-email/render'
import { SITE, LOCALES, EMAIL_ASSET_BASE, EMAIL_IMAGE_URL, POSTAL_PLACEHOLDER, DEFAULT_POSTAL_ADDRESS } from './brand.js'

const trimSlash = (s) => String(s).replace(/\/+$/, '')

/**
 * @param {object} template  una plantilla del registro (o su id, si se pasa `registry`)
 * @param {'es'|'en'} locale
 * @param {object} data      los datos del destinatario (nunca se inventan: lo que falte, falla).
 *                           Opcionales en toda plantilla: ceo.avatarUrl y agents[i].avatarUrl (ver emails/README.md).
 * @param {object} [opts]
 * @param {string} [opts.postalAddress] la del pie (CAN-SPAM). Sin pasarla, DEFAULT_POSTAL_ADDRESS; vacía a
 *                                      propósito → falla (salvo en vista previa, que pinta el aviso).
 * @param {string} [opts.assetBase]     base de los PNG (EMAIL_ASSET_BASE_URL). En producción, https absoluta.
 * @param {string} [opts.fontBase]      de dónde salen las woff2 (por defecto, el sitio).
 * @param {boolean} [opts.preview]      galería local: admite rutas relativas y pinta el aviso de dirección.
 */
export async function render(template, locale, data = {}, opts = {}) {
  if (!template || typeof template.Email !== 'function') throw new Error('render: plantilla inválida')
  if (!LOCALES.includes(locale)) throw new Error(`render: idioma no soportado «${locale}»`)
  // Un correo con un enlace vacío es peor que no enviarlo: lo obligatorio falla en voz alta.
  const required = [...(template.required || []), ...(template.kind === 'marketing' ? ['unsubscribeUrl'] : [])]
  const missing = required.filter((k) => data[k] == null || data[k] === '')
  if (missing.length) throw new Error(`render(${template.id}): faltan datos: ${missing.join(', ')}`)

  const preview = opts.preview === true
  const postalAddress = String(opts.postalAddress ?? DEFAULT_POSTAL_ADDRESS).trim()
  if (!postalAddress && !preview) throw new Error('render: la dirección postal (POSTAL_ADDRESS) está vacía. Sin ella no se envía nada.')

  // Gmail no pinta rutas relativas ni locales: fuera de la galería, la base de los PNG es https o nada.
  const assetBase = trimSlash(opts.assetBase ?? EMAIL_ASSET_BASE)
  if (!preview && !/^https:\/\/[^\s/]+/.test(assetBase)) throw new Error(`render: la base de imágenes debe ser https absoluta (EMAIL_ASSET_BASE_URL), no «${assetBase}»`)

  // Avatares que llegan por datos (foto del CEO o de un agente): mismas reglas que los nuestros.
  const avatar = (url, field) => {
    if (url == null || url === '') return null
    if (!EMAIL_IMAGE_URL.test(url)) throw new Error(`render(${template.id}): ${field} debe ser una URL https que acabe en .png, .jpg o .gif`)
    return url
  }
  const avatars = {
    ceo: avatar(data.ceo?.avatarUrl, 'ceo.avatarUrl'),
    agents: Array.isArray(data.agents) ? data.agents.map((a, i) => avatar(a?.avatarUrl, `agents[${i}].avatarUrl`)) : [],
  }

  const site = opts.site ?? SITE
  const ctx = { locale, site, assetBase, fontBase: trimSlash(opts.fontBase ?? site), avatars, preview, postalAddress: postalAddress || POSTAL_PLACEHOLDER }
  const c = template.copy[locale](data, ctx)
  const { Email } = template
  const element = <Email c={c} d={data} ctx={ctx} />
  const html = await toHtml(element)
  // Texto plano: el titular sin MAYÚSCULAS (html-to-text las pone por defecto) y sin huecos de 3+ líneas.
  const text = (await toHtml(element, { plainText: true, htmlToTextOptions: { selectors: [{ selector: 'h1', options: { uppercase: false } }, { selector: 'img', format: 'skip' }] } }))
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  // Gmail y Yahoo exigen la baja en un clic (RFC 8058) a quien envía en volumen: va en las cabeceras.
  // List-Unsubscribe-Post solo vale con una URL https (con mailto: no hay POST que hacer).
  const headers = template.kind === 'marketing'
    ? { 'List-Unsubscribe': `<${data.unsubscribeUrl}>`, ...(/^https:/i.test(data.unsubscribeUrl) ? { 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } : {}) }
    : {}
  return { subject: c.subject, preheader: c.preheader, html, text, headers }
}
