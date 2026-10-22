// ─────────────────────────────────────────────────────────────────────────────
// MAPA ÚNICO DE RUTAS por idioma.
//
// De aquí salen, sin posibilidad de desajuste: el selector de idioma, los
// hreflang, los canonicals, el sitemap y los enlaces de header/footer.
// Una ruta se añade AQUÍ cuando su página existe (no antes): así ningún enlace
// del sitio apunta a una página que todavía no se ha construido.
// Un test (tests/site/rutas.test.js) exige que cada ruta exista en dist/.
// ─────────────────────────────────────────────────────────────────────────────
import { LOCALES, prefix } from './meta.js'

/** id → { <lang>: url }: rutas estáticas (las de contenido se generan desde content/). */
export const RUTAS = {
  home: { es: '/', en: '/en/', pt: '/pt/' },
  // noindex: páginas de servicio (no van al sitemap ni llevan canonical).
  gracias: { es: '/gracias/', en: '/en/thanks/', pt: '/pt/obrigado/', noindex: true },
  // Contenido editorial e institucional en los dos idiomas (FASE 6).
  noticias: { es: '/noticias/', en: '/en/news/', pt: '/pt/noticias/' },
  blog: { es: '/blog/', en: '/en/blog/', pt: '/pt/blog/' },
  recursos: { es: '/recursos/', en: '/en/resources/', pt: '/pt/recursos/' },
  precios: { es: '/precios/', en: '/en/pricing/', pt: '/pt/precos/' },
  empresa: { es: '/empresa/', en: '/en/company/', pt: '/pt/empresa/' },
  contacto: { es: '/contacto/', en: '/en/contact/', pt: '/pt/contato/' },
  prensa: { es: '/prensa/', en: '/en/press/', pt: '/pt/imprensa/' },
  'no-vender': { es: '/no-vender-ni-compartir/', en: '/en/do-not-sell-or-share/', pt: '/pt/nao-vender-nem-compartilhar/' },
  // Índice de los documentos legales (T35 · adenda, punto 4: «Ver todo» del footer).
  legal: { es: '/legal/', en: '/en/legal/', pt: '/pt/legal/' },
}

// Documentos legales: rutas generadas desde el frontmatter de content/legal/<lang>/*.md
// (id, slug, titulo). Un documento sin traducir no tiene ruta en ese idioma.
import { legalDocs } from '../lib/legal.js'
for (const d of legalDocs()) {
  const key = `legal:${d.id}`
  RUTAS[key] ||= { label: {} }
  RUTAS[key][d.lang] = `${prefix(d.lang)}/legal/${d.slug}`
  RUTAS[key].label[d.lang] = d.titulo
  RUTAS[key].updated = d.actualizado
}

/** ¿Existe esta ruta (en este idioma)? */
export const hasRoute = (id, lang = 'es') => Boolean(RUTAS[id]?.[lang])

/** URL de una ruta. Un id desconocido ROMPE EL BUILD (enlace roto = error, no aviso). */
export function href(id, lang, hash = '') {
  const r = RUTAS[id]?.[lang]
  if (!r) throw new Error(`[rutas] no existe la ruta "${id}" en "${lang}"`)
  return hash ? `${r}#${hash}` : r
}

/**
 * Alternativas de idioma de una página: [{ lang, url }] SOLO para los idiomas en
 * los que la página existe. Una página sin traducir no emite hreflang a ese idioma.
 * `alternates` puede venir dado (páginas de contenido) o se calcula desde un id.
 */
export function alternatesFor(id) {
  const r = RUTAS[id]
  if (!r) return []
  return LOCALES.filter((l) => r[l]).map((l) => ({ lang: l, url: r[l] }))
}

/** Todas las URLs estáticas (para sitemap y tests): [{ id, lang, url, noindex }]. */
export function allStaticRoutes() {
  const out = []
  for (const [id, r] of Object.entries(RUTAS)) for (const l of LOCALES) if (r[l]) out.push({ id, lang: l, url: r[l], noindex: Boolean(r.noindex) })
  return out
}
