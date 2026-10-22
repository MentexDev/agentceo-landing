// ─────────────────────────────────────────────────────────────────────────────
// IDIOMA DEL VISITANTE (T62) · una sola detección para la raíz y para el correo de bienvenida.
// Los idiomas y sus pistas (prefijos de Accept-Language, países de Cloudflare) viven en src/i18n/meta.js:
// añadir un idioma allí lo añade aquí sin tocar este fichero.
//
// Raíz «/» (localeRedirect): solo se redirige cuando NADIE ha elegido todavía:
//   · solo GET/HEAD de «/» exacta (con o sin query: se conserva, p. ej. utm_*);
//   · cookie `lang` = elección guardada (solo existe con consentimiento funcional): manda SIEMPRE;
//   · navegación DENTRO del sitio (Sec-Fetch-Site same-origin, o Referer de este host) = la persona ya
//     está aquí y pulsó «Español» o el logo: no se la devuelve a otro idioma (respeta la elección
//     aunque no haya cookie);
//   · bots y peticiones sin Accept-Language: NUNCA (Google rastrea sin Accept-Language; el x-default
//     de los hreflang apunta a «/», que para ellos sirve el español de siempre);
//   · 302 (no 301: depende de quién pregunta) con `Vary` y sin caché compartida.
// ─────────────────────────────────────────────────────────────────────────────
import { LOCALES, LOCALE_META, DEFAULT_LOCALE, prefix } from '../../src/i18n/meta.js'

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|lighthouse|headless/i

/** Accept-Language → [{ tag, q }] ordenado por preferencia (q desc; empate = orden de aparición). */
export function parseAcceptLanguage(header = '') {
  return String(header)
    .split(',')
    .map((part, i) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';')
      const q = params.map((p) => /^\s*q=([0-9.]+)\s*$/.exec(p)).find(Boolean)
      return { tag: tag.trim(), q: q ? Number(q[1]) : 1, i }
    })
    .filter((x) => x.tag && x.tag !== '*' && x.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i)
}

const byPrefix = (tag) => LOCALES.find((l) => LOCALE_META[l].accept.some((p) => tag === p || tag.startsWith(`${p}-`)))
const byCountry = (cc) => LOCALES.find((l) => LOCALE_META[l].countries.includes(String(cc || '').toUpperCase()))

/**
 * Idioma más probable del visitante, o null si no hay pistas.
 *   1. el primer idioma de Accept-Language que el sitio tiene (pt-BR → pt, en-GB → en, es-CO → es);
 *   2. si el navegador pide idiomas que no tenemos (fr, de…): el país si es de un idioma nuestro (Portugal → pt)
 *      y si no, inglés (más útil que el español para quien no lo pidió);
 *   3. sin Accept-Language: solo el país (Brasil → pt); si no dice nada, null.
 */
export function detectLocale({ acceptLanguage = '', country = '' } = {}) {
  const langs = parseAcceptLanguage(acceptLanguage)
  for (const { tag } of langs) {
    const l = byPrefix(tag)
    if (l) return l
  }
  const fromCountry = byCountry(country)
  if (fromCountry) return fromCountry
  return langs.length ? (LOCALES.includes('en') ? 'en' : DEFAULT_LOCALE) : null
}

/** Idioma de una Request de Cloudflare (cabecera + request.cf.country). */
export const requestLocale = (request) =>
  detectLocale({ acceptLanguage: request?.headers?.get('accept-language') || '', country: request?.cf?.country || '' })

/** Valor de una cookie. */
export function cookie(request, name) {
  const raw = request.headers.get('cookie') || ''
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return null
}

function sameSite(request, url) {
  if (request.headers.get('sec-fetch-site') === 'same-origin') return true
  try { return new URL(request.headers.get('referer') || '').host === url.host } catch { return false }
}

/** Respuesta 302 al idioma del visitante desde «/», o null si hay que servir la raíz tal cual. */
export function localeRedirect(request, url = new URL(request.url)) {
  if (url.pathname !== '/' || (request.method !== 'GET' && request.method !== 'HEAD')) return null
  const saved = cookie(request, 'lang')
  let target = null
  if (saved && LOCALES.includes(saved)) target = saved // elección guardada: manda siempre
  else {
    if (sameSite(request, url)) return null
    const al = request.headers.get('accept-language')
    if (!al || BOT.test(request.headers.get('user-agent') || '')) return null
    target = requestLocale(request)
  }
  if (!target || target === DEFAULT_LOCALE) return null
  const to = new URL(`${prefix(target)}/${url.search}`, url)
  return new Response(null, {
    status: 302,
    headers: { location: to.toString(), vary: 'Accept-Language, Cookie', 'cache-control': 'private, no-store' },
  })
}

/** Código de idioma del sitio a partir de lo que mande la página ('pt', 'pt-BR', 'EN'…), o null. */
export function normLocale(v) {
  const p = String(v || '').trim().toLowerCase().split(/[-_]/)[0]
  return LOCALES.includes(p) ? p : null
}

/**
 * Idioma de quien se apunta (fila de D1, página de gracias y correo): MANDA LA PÁGINA donde se apuntó
 * (/pt/ → pt); el navegador y el país solo cuando la página no lo dice (cliente viejo, petición a mano).
 */
export const signupLocale = (request, pageLocale) => normLocale(pageLocale) || requestLocale(request) || DEFAULT_LOCALE
