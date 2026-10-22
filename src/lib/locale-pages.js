// ─────────────────────────────────────────────────────────────────────────────
// Páginas de los idiomas que NO son el predeterminado (/en/…, /pt/…), generadas desde los registros (T62):
// rutas.js (estáticas y legales), content/locales.js (noticias, blog, recursos) y legal.js. Un idioma nuevo no
// necesita ficheros de página: ver docs/I18N.md.
// Una ruta dinámica por VISTA en src/pages/[lang]/ (la forma del fichero decide la salida con build.format
// 'preserve': las URLs con barra final salen como carpeta/index.html, como siempre).
// ─────────────────────────────────────────────────────────────────────────────
import { LOCALES, DEFAULT_LOCALE } from '../i18n/meta.js'
import { RUTAS } from '../i18n/rutas.js'
import { section, KINDS } from './content.js'
import { legalDocs } from './legal.js'

// id de rutas.js → vista (las de contenido, listado de su sección).
const STATIC = {
  home: 'home', gracias: 'thanks', noticias: 'listing', blog: 'listing', recursos: 'listing', precios: 'pricing',
  empresa: 'company', contacto: 'contact', prensa: 'press', 'no-vender': 'donotsell', legal: 'legalIndex',
}

/** [{ url, props }] de todas las páginas de los idiomas no predeterminados. */
export function localePages() {
  const out = []
  for (const lang of LOCALES.filter((l) => l !== DEFAULT_LOCALE)) {
    for (const [id, view] of Object.entries(STATIC)) {
      const url = RUTAS[id]?.[lang]
      if (url) out.push({ url, props: { view, lang, kind: KINDS.includes(id) ? id : null } })
    }
    for (const kind of KINDS) for (const item of section(kind, lang)?.ITEMS || []) {
      out.push({ url: `${RUTAS[kind][lang]}${item.slug}`, props: { view: 'article', lang, kind, item } })
    }
    for (const doc of legalDocs().filter((d) => d.lang === lang)) {
      out.push({ url: RUTAS[`legal:${doc.id}`][lang], props: { view: 'legal', lang, doc } })
    }
    out.push({ url: `/${lang}/404`, props: { view: 'notFound', lang } })
  }
  return out
}

/**
 * getStaticPaths de la ruta de UNA vista. Cada vista tiene su propio fichero de ruta en src/pages/[lang]/ para
 * que cada página cargue solo SU CSS (con un único selector de vistas, cada página arrastraba la CSS de todas:
 * medido, +6,7 KB por página). `param` = nombre del parámetro del segmento dinámico de ese fichero.
 */
export function pathsFor(view, param = null) {
  return localePages()
    .filter((p) => p.props.view === view)
    .map(({ url, props }) => {
      const [, lang, ...rest] = url.replace(/\/$/, '').split('/')
      const params = { lang }
      if (view === 'article') { params.seccion = rest[0]; params.slug = rest[1] }
      else if (view === 'legal') params.doc = rest[1]
      else if (param) params[param] = rest.join('/')
      return { params, props }
    })
}
