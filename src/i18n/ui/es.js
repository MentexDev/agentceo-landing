// Diccionario de INTERFAZ · español (idioma por defecto).
// Las claves deben existir también en en.js: tests/site/i18n.test.js lo exige.
export default {
  site: {
    name: 'Agent CEO',
    title: 'Agent CEO · Empleados de IA que venden por ti',
    description:
      'Agent CEO es tu equipo de empleados de IA: venden por WhatsApp, cuidan tu tienda y crean contenido. Lo importante, siempre te lo preguntan. Apúntate a la lista de espera.',
    // Párrafo de ENTIDAD: idéntico en llms.txt, JSON-LD Organization, /empresa y el footer.
    // Factual y verificable: los LLM recomiendan lo que pueden citar.
    entity:
      'Agent CEO es un producto de Klinworks, LLC, una sociedad de Delaware (EE. UU.). Es una plataforma donde un dueño de negocio arma un equipo de agentes de IA que venden por WhatsApp, cuidan su tienda y crean contenido, y que le piden permiso antes de cualquier acción importante.',
    tagline: 'Tu equipo de IA trabaja. Tú decides.',
  },
  a11y: {
    skip: 'Saltar al contenido',
    home: 'Agent CEO, inicio',
    menuOpen: 'Abrir menú',
    menuClose: 'Cerrar menú',
    mainNav: 'Principal',
    footerNav: 'Pie de página',
    langLabel: 'Idioma',
    langCurrent: 'Idioma actual: {name}',
    close: 'Cerrar',
    newTab: '(se abre en una pestaña nueva)',
  },
  nav: {
    recursos: 'Recursos',
    blog: 'Blog',
    noticias: 'Noticias',
    precios: 'Precios',
    join: 'Unirme a la lista',
  },
  footer: {
    producto: 'Producto',
    comoFunciona: 'Cómo funciona',
    agentes: 'Agentes',
    precios: 'Precios',
    recursos: 'Recursos',
    contenido: 'Recursos',
    blog: 'Blog',
    noticias: 'Noticias',
    preguntas: 'Preguntas',
    empresa: 'Empresa',
    sobre: 'Sobre Klinworks',
    contacto: 'Contacto',
    prensa: 'Prensa y marca',
    unirse: 'Únete a la lista',
    legal: 'Legal',
    rights: '© {year} Klinworks, LLC. Todos los derechos reservados.',
    cookiePrefs: 'Preferencias de cookies',
    doNotSell: 'No vender ni compartir mi información personal',
    made: 'Hecho para dueños de negocio, no para programadores.',
  },
  lang: {
    switchTo: 'Cambiar idioma',
    notTranslated: 'Esta página todavía no está traducida; te llevamos a la portada en {name}.',
    suggest: '¿Prefieres leer en español?',
  },
  notFound: {
    title: 'Página no encontrada',
    h1: 'Esta página se nos escapó.',
    body: 'El enlace puede estar roto o la página cambió de sitio. Tu CEO ya está buscándola.',
    home: 'Volver al inicio',
  },
  draft: {
    banner: 'BORRADOR — requiere revisión de abogado. Este texto no es definitivo.',
  },
}
