// ─────────────────────────────────────────────────────────────────────────────
// CAPA DE CONTENIDO editorial (noticias, blog, recursos) por idioma.
//
// · Español: content/{kind}.js (la fuente de siempre; no cambia de forma).
// · Inglés:  content/en/{kind}.js con la MISMA forma. Cada pieza lleva `es: '<slug-es>'`
//   para emparejarse con su original (hreflang). Una pieza sin traducir NO existe en
//   inglés (sin páginas a medias, sin hreflang roto).
// ─────────────────────────────────────────────────────────────────────────────
import * as noticiasEs from '../../content/noticias.js'
import * as blogEs from '../../content/blog.js'
import * as recursosEs from '../../content/recursos.js'

// El inglés se carga si existe (import.meta.glob no falla si no hay ficheros).
const EN = import.meta.glob('../../content/en/*.js', { eager: true })
const en = (kind) => EN[`../../content/en/${kind}.js`] || null

export const KINDS = ['noticias', 'blog', 'recursos']

/** Base de URL de cada sección por idioma (mismas que rutas.js). */
export const BASE = {
  noticias: { es: '/noticias/', en: '/en/news/' },
  blog: { es: '/blog/', en: '/en/blog/' },
  recursos: { es: '/recursos/', en: '/en/resources/' },
}

/** schema.org de cada sección (como la v1). */
export const SCHEMA = { noticias: 'NewsArticle', blog: 'BlogPosting', recursos: 'Article' }

const SRC = {
  es: { noticias: noticiasEs, blog: blogEs, recursos: recursosEs },
}

/** Normaliza un slug (misma regla que la v1: blinda href y nombres de fichero). */
export function slugify(s = '') {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 70)
}

/** { META, CATEGORIES, ITEMS } de una sección en un idioma, o null si no existe. */
export function section(kind, lang) {
  const mod = lang === 'es' ? SRC.es[kind] : en(kind)
  if (!mod) return null
  const items = [...mod.ITEMS]
    .map((it) => ({ ...it, slug: slugify(it.slug || it.title) }))
    .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
  return { META: mod.META, CATEGORIES: mod.CATEGORIES || [], ITEMS: items }
}

export const itemUrl = (kind, lang, slug) => `${BASE[kind][lang]}${slug}`

/** Alternativas de idioma de una pieza: [{ lang, url }] solo donde existe. */
export function itemAlternates(kind, esSlug) {
  const out = [{ lang: 'es', url: itemUrl(kind, 'es', esSlug) }]
  const e = section(kind, 'en')
  const twin = e?.ITEMS.find((i) => i.es === esSlug)
  if (twin) out.push({ lang: 'en', url: itemUrl(kind, 'en', twin.slug) })
  return out
}

/** Slug español de una pieza (en inglés, el de su original). */
export const esSlugOf = (item, lang) => (lang === 'es' ? item.slug : item.es)

/** Todas las URLs de contenido (sitemap, tests): [{ kind, lang, url, lastmod, alternates }]. */
export function allContentRoutes() {
  const out = []
  for (const kind of KINDS) for (const lang of ['es', 'en']) {
    const s = section(kind, lang)
    if (!s) continue
    for (const it of s.ITEMS) {
      out.push({ kind, lang, url: itemUrl(kind, lang, it.slug), lastmod: it.updatedISO || it.dateISO, alternates: itemAlternates(kind, esSlugOf(it, lang)) })
    }
  }
  return out
}
