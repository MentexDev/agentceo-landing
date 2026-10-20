// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD (schema.org) del sitio. SOLO datos verificables (brief §6: «copy de entidad
// claro y factual»): nada de valoraciones, premios ni perfiles sociales que no existan.
// Fuente de la entidad: content/legal/privacidad.md (Klinworks, LLC, Delaware, n.º 10704723).
// ─────────────────────────────────────────────────────────────────────────────
import { FAQ } from '../../content/faq.js'
import { t, LOCALE_META } from '../i18n/config.js'
import { href } from '../i18n/rutas.js'

export const ORIGIN = 'https://agentceo.io'
const abs = (p) => new URL(p, ORIGIN).href

export const ORG_ID = `${ORIGIN}/#organization`
export const SITE_ID = `${ORIGIN}/#website`
export const APP_ID = `${ORIGIN}/#software`

export function organization(lang) {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Klinworks, LLC',
    legalName: 'Klinworks, LLC',
    url: ORIGIN,
    logo: { '@type': 'ImageObject', url: abs('/apple-touch-icon.png'), width: 180, height: 180 },
    description: t(lang, 'site.entity'),
    brand: { '@type': 'Brand', name: 'Agent CEO' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '131 Continental Drive, Suite 305',
      addressLocality: 'Newark',
      addressRegion: 'DE',
      postalCode: '19713',
      addressCountry: 'US',
    },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', email: 'info@klinworks.com', availableLanguage: ['es', 'en'] },
      { '@type': 'ContactPoint', contactType: 'privacy', email: 'privacidad@klinworks.com' },
      { '@type': 'ContactPoint', contactType: 'security', email: 'security@klinworks.com' },
    ],
  }
}

export function website(lang) {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: 'Agent CEO',
    url: abs(href('home', lang)),
    inLanguage: LOCALE_META[lang].bcp47,
    publisher: { '@id': ORG_ID },
  }
}

export function softwareApplication(lang) {
  return {
    '@type': 'SoftwareApplication',
    '@id': APP_ID,
    name: 'Agent CEO',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: abs(href('home', lang)),
    description: t(lang, 'site.description'),
    inLanguage: LOCALE_META[lang].bcp47,
    publisher: { '@id': ORG_ID },
    // Solo lo confirmado: hay un plan gratis para empezar. Precios de pago: pendientes (Diego).
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: t(lang, 'jsonld.freeOffer') },
  }
}

export function faqPage(lang, items = FAQ) {
  return {
    '@type': 'FAQPage',
    mainEntity: items
      .filter((f) => f.q[lang] && f.a[lang])
      .map((f) => ({ '@type': 'Question', name: f.q[lang], acceptedAnswer: { '@type': 'Answer', text: f.a[lang] } })),
  }
}

export function breadcrumbs(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.url) })),
  }
}

/** Grafo de la portada: Organization + WebSite + SoftwareApplication + FAQPage. */
export function homeJsonLd(lang) {
  return {
    '@context': 'https://schema.org',
    '@graph': [organization(lang), website(lang), softwareApplication(lang), faqPage(lang)],
  }
}
