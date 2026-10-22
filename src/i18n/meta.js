// ─────────────────────────────────────────────────────────────────────────────
// REGISTRO DE IDIOMAS (ligero: sin diccionarios). Lo importan el servidor, las islas del navegador y Node
// puro. Añadir un idioma empieza aquí: ver docs/I18N.md.
//   · DEFAULT_LOCALE vive en la RAÍZ (sin prefijo); los demás, bajo /<lang>/.
//   · LOCALE_META: nombre en su propio idioma, BCP 47, og:locale, formatos de fecha/número y la
//     detección automática (prefijos de Accept-Language y países de Cloudflare).
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_LOCALE = 'es'
export const LOCALES = ['es', 'en', 'pt']

export const LOCALE_META = {
  es: { name: 'Español', short: 'ES', bcp47: 'es', og: 'es_ES', dateLocale: 'es-ES', numberLocale: 'es-CO', accept: ['es'], countries: [] },
  en: { name: 'English', short: 'EN', bcp47: 'en', og: 'en_US', dateLocale: 'en-US', numberLocale: 'en-US', accept: ['en'], countries: [] },
  // pt-BR (T62). `countries`: solo para el FALLBACK de detección (sin Accept-Language útil); manda el idioma del navegador.
  pt: { name: 'Português', short: 'PT', bcp47: 'pt-BR', og: 'pt_BR', dateLocale: 'pt-BR', numberLocale: 'pt-BR', accept: ['pt'], countries: ['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'] },
}

/** Prefijo de URL del idioma ('' para el idioma por defecto). */
export const prefix = (lang) => (lang === DEFAULT_LOCALE ? '' : `/${lang}`)
/** Idioma válido o el predeterminado. */
export const asLocale = (lang) => (LOCALES.includes(lang) ? lang : DEFAULT_LOCALE)
