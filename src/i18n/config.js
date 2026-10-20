// ─────────────────────────────────────────────────────────────────────────────
// i18n · configuración de idiomas.
//
// Añadir un idioma (p. ej. 'pt') = añadirlo a LOCALES + un diccionario en
// ui/<lang>.js + sus slugs en rutas.js. No hay que tocar componentes.
// El idioma por defecto vive en la RAÍZ (sin prefijo): no cambia ninguna URL
// que ya está en producción. Los demás viven bajo /<lang>/.
// ─────────────────────────────────────────────────────────────────────────────
import es from './ui/es.js'
import en from './ui/en.js'

export const DEFAULT_LOCALE = 'es'
export const LOCALES = ['es', 'en']

/** Metadatos por idioma: nombre en SU propio idioma, etiqueta BCP 47 y og:locale. */
export const LOCALE_META = {
  es: { name: 'Español', short: 'ES', bcp47: 'es', og: 'es_ES', dateLocale: 'es-ES' },
  en: { name: 'English', short: 'EN', bcp47: 'en', og: 'en_US', dateLocale: 'en-US' },
}

const DICTS = { es, en }

/** Prefijo de URL del idioma ('' para el idioma por defecto). */
export const prefix = (lang) => (lang === DEFAULT_LOCALE ? '' : `/${lang}`)

/** Devuelve el diccionario completo (para pasar a islas un subárbol). */
export function dict(lang) {
  const d = DICTS[lang]
  if (!d) throw new Error(`[i18n] idioma desconocido: ${lang}`)
  return d
}

/**
 * Traduce una clave 'a.b.c'. Una clave que falta ROMPE EL BUILD a propósito:
 * es mejor un build rojo que una página con 'nav.precios' a la vista.
 * Interpola {nombre} con `vars`.
 */
export function t(lang, key, vars) {
  let v = dict(lang)
  for (const part of key.split('.')) {
    v = v?.[part]
    if (v === undefined) throw new Error(`[i18n] falta la clave "${key}" en "${lang}"`)
  }
  if (typeof v !== 'string') return v
  return vars ? v.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`)) : v
}

/** Atajo: const tr = useT(lang); tr('nav.precios') */
export const useT = (lang) => (key, vars) => t(lang, key, vars)

/** Fecha legible en el idioma ('2026-08-07' → '7 ago 2026' / 'Aug 7, 2026'). */
export function fmtDate(lang, iso = '') {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return ''
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
  return new Intl.DateTimeFormat(LOCALE_META[lang].dateLocale, {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(d).replace('.', '')
}
