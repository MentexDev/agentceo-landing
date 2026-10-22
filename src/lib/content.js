// ─────────────────────────────────────────────────────────────────────────────
// CAPA DE CONTENIDO editorial (noticias, blog, recursos) por idioma.
//
// · Español: content/{kind}.js · otros idiomas: content/<lang>/{kind}.js, con la MISMA forma (registro:
//   content/locales.js). Cada pieza lleva `es: '<slug-es>'`
//   para emparejarse con su original (hreflang). Una pieza sin traducir NO existe en
//   inglés (sin páginas a medias, sin hreflang roto).
// ─────────────────────────────────────────────────────────────────────────────
import { contentOf } from '../../content/locales.js'
import { RUTAS } from '../i18n/rutas.js'
import { LOCALES, DEFAULT_LOCALE } from '../i18n/meta.js'

export const KINDS = ['noticias', 'blog', 'recursos']

/** Base de URL de cada sección por idioma: la de rutas.js (una sola fuente). */
export const BASE = Object.fromEntries(KINDS.map((k) => [k, RUTAS[k]]))

/** schema.org de cada sección (como la v1). */
export const SCHEMA = { noticias: 'NewsArticle', blog: 'BlogPosting', recursos: 'Article' }

import { slugify } from './slug.js'
export { slugify }

/** { META, CATEGORIES, ITEMS } de una sección en un idioma, o null si no existe. */
export function section(kind, lang) {
  const mod = contentOf(lang, kind)
  if (!mod) return null
  const items = [...mod.ITEMS]
    .map((it) => ({ ...it, slug: slugify(it.slug || it.title) }))
    .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
  return { META: mod.META, CATEGORIES: mod.CATEGORIES || [], ITEMS: items }
}

export const itemUrl = (kind, lang, slug) => `${BASE[kind][lang]}${slug}`

/** Alternativas de idioma de una pieza: [{ lang, url }] solo donde existe (emparejadas por su slug español). */
export function itemAlternates(kind, esSlug) {
  const out = []
  for (const lang of LOCALES) {
    if (lang === DEFAULT_LOCALE) { out.push({ lang, url: itemUrl(kind, lang, esSlug) }); continue }
    const twin = section(kind, lang)?.ITEMS.find((i) => i.es === esSlug)
    if (twin) out.push({ lang, url: itemUrl(kind, lang, twin.slug) })
  }
  return out
}

/** Slug español de una pieza (en otro idioma, el de su original). */
export const esSlugOf = (item, lang) => (lang === DEFAULT_LOCALE ? item.slug : item.es)

/** Todas las URLs de contenido (sitemap, tests): [{ kind, lang, url, lastmod, alternates }]. */
export function allContentRoutes() {
  const out = []
  for (const kind of KINDS) for (const lang of LOCALES) {
    const s = section(kind, lang)
    if (!s) continue
    for (const it of s.ITEMS) {
      out.push({ kind, lang, url: itemUrl(kind, lang, it.slug), lastmod: it.updatedISO || it.dateISO, alternates: itemAlternates(kind, esSlugOf(it, lang)) })
    }
  }
  return out
}
