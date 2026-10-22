// ─────────────────────────────────────────────────────────────────────────────
// REGISTRO ÚNICO DEL CONTENIDO por idioma (T62). Lo usan las páginas (src/lib/content.js), el conocimiento
// del chat (src/lib/knowledge.js), /llms*.txt (src/lib/seo.js) y la página de precios. Importable desde
// Node puro (no usa import.meta.glob).
// Añadir un idioma = su carpeta content/<lang>/ (misma forma que content/en/) + UNA línea aquí. docs/I18N.md.
// Una pieza editorial sin traducir no existe en ese idioma (sin páginas a medias ni hreflang roto).
// ─────────────────────────────────────────────────────────────────────────────
import * as noticiasEs from './noticias.js'
import * as blogEs from './blog.js'
import * as recursosEs from './recursos.js'
import * as preciosEs from './precios.js'
import * as noticiasEn from './en/noticias.js'
import * as blogEn from './en/blog.js'
import * as recursosEn from './en/recursos.js'
import * as preciosEn from './en/precios.js'

export const CONTENT = {
  es: { noticias: noticiasEs, blog: blogEs, recursos: recursosEs, precios: preciosEs },
  en: { noticias: noticiasEn, blog: blogEn, recursos: recursosEn, precios: preciosEn },
}

/** El módulo de contenido `kind` en `lang`, o null si ese idioma no lo tiene. */
export const contentOf = (lang, kind) => CONTENT[lang]?.[kind] || null
