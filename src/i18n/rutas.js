// ─────────────────────────────────────────────────────────────────────────────
// MAPA ÚNICO DE RUTAS por idioma.
//
// De aquí salen, sin posibilidad de desajuste: el selector de idioma, los
// hreflang, los canonicals, el sitemap y los enlaces de header/footer.
// Una ruta se añade AQUÍ cuando su página existe (no antes): así ningún enlace
// del sitio apunta a una página que todavía no se ha construido.
// Un test (tests/site/rutas.test.js) exige que cada ruta exista en dist/.
// ─────────────────────────────────────────────────────────────────────────────
import { LOCALES } from './config.js'

/** id → { es, en }: rutas estáticas (las de contenido se generan desde content/). */
export const RUTAS = {
  home: { es: '/', en: '/en/' },
  // noindex: páginas de servicio (no van al sitemap ni llevan canonical).
  gracias: { es: '/gracias/', en: '/en/thanks/', noindex: true },
  // Contenido editorial: el inglés se añade en la FASE 6 (cuando exista la traducción).
  noticias: { es: '/noticias/' },
  blog: { es: '/blog/' },
  recursos: { es: '/recursos/' },
  precios: { es: '/precios/' },
  empresa: { es: '/empresa/' },
  contacto: { es: '/contacto/' },
  prensa: { es: '/prensa/' },
  'no-vender': { es: '/no-vender-ni-compartir/' },
}

// Documentos legales: rutas generadas desde el frontmatter de content/legal/{es,en}/*.md
// (id, slug, titulo). Un documento sin traducir no tiene ruta en ese idioma.
import { legalDocs } from '../lib/legal.js'
for (const d of legalDocs()) {
  const key = `legal:${d.id}`
  RUTAS[key] ||= { label: {} }
  RUTAS[key][d.lang] = d.lang === 'es' ? `/legal/${d.slug}` : `/${d.lang}/legal/${d.slug}`
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
