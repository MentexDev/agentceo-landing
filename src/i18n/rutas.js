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

/** Todas las URLs estáticas (para sitemap y tests): [{ id, lang, url }]. */
export function allStaticRoutes() {
  const out = []
  for (const [id, r] of Object.entries(RUTAS)) for (const l of LOCALES) if (r[l]) out.push({ id, lang: l, url: r[l] })
  return out
}
