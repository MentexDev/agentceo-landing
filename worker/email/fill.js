// Rellena el pre-render de la plantilla (worker/generated/emails.js, de emails/scripts/worker-templates.mjs)
// con los datos de una persona. Solo sustitución de marcas: < 1 ms de CPU, sin React en el Worker.
import { TOKENS, TEMPLATES } from '../generated/emails.js'
import { businessPrompt } from '../../emails/src/gifts.js'
import { fmtShort } from '../../emails/src/format.js'

/** @typedef {{ subject: string, html: string, text: string, headers: Record<string, string> }} RenderedEmail */

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' })[c])
const oneLine = (s) => String(s).replace(/[\r\n\t\u0000-\u001f\u007f]+/g, ' ').trim()

/**
 * El nombre que se muestra, o '' (y entonces «Hola» a secas). El campo nombre es libre: un bot puede meter
 * un enlace o un correo para usar NUESTRA bienvenida como spam. Si lo parece, se ignora.
 * @param {unknown} raw
 */
export function displayName(raw) {
  const s = oneLine(typeof raw === 'string' ? raw.normalize('NFC') : '').replace(/\s+/g, ' ').slice(0, 40).trim()
  if (!s) return ''
  if (/[<>@{}[\]\\/]|:\/\/|www\.|\.(com|net|org|io|co|ru|cn|xyz|info|biz|top|link)\b/i.test(s)) return ''
  return s
}

/**
 * @param {{ template?: string, locale: 'es'|'en', name?: string|null, business?: string|null,
 *           unsubscribeUrl: string, assetBase: string, now?: Date }} input
 * @returns {RenderedEmail}
 */
export function fillTemplate({ template = 'waitlist-welcome', locale, name, business, unsubscribeUrl, assetBase, now = new Date() }) {
  const t = TEMPLATES[template]
  if (!t) throw new Error(`fill: plantilla sin pre-render «${template}»`)
  const loc = t.locales[locale] ? locale : 'es'
  const who = displayName(name)
  const v = t.locales[loc][who ? 'named' : 'anon']
  const gift = businessPrompt(loc, business)
  const values = {
    name: who,
    date: fmtShort(loc, now.toISOString()),
    giftTitle: gift.title,
    giftPrompt: gift.prompt,
    unsubscribeUrl,
    assetBase: assetBase.replace(/\/+$/, ''),
  }
  const fill = (s, esc) => Object.entries(TOKENS).reduce((acc, [k, tok]) => acc.split(tok).join(esc(values[k])), s)
  const out = {
    subject: oneLine(fill(v.subject, (x) => x)),
    html: fill(v.html, escapeHtml),
    text: fill(v.text, (x) => x),
    headers: t.kind === 'marketing'
      ? { 'List-Unsubscribe': `<${unsubscribeUrl}>`, ...(/^https:/i.test(unsubscribeUrl) ? { 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } : {}) }
      : {},
  }
  // Una marca sin rellenar es un correo roto: mejor no enviarlo.
  for (const part of ['subject', 'html', 'text']) if (/zzac[a-z]+zz/.test(out[part])) throw new Error(`fill: quedó una marca sin rellenar en ${part}`)
  return out
}
