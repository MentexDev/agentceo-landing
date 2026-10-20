// ─────────────────────────────────────────────────────────────────────────────
// SEO/GEO generado desde las MISMAS fuentes que las páginas (rutas.js + content):
// sitemap con hreflang, robots.txt y /llms.txt · /llms-full.txt.
// ─────────────────────────────────────────────────────────────────────────────
import { allStaticRoutes, alternatesFor, RUTAS, href, hasRoute } from '../i18n/rutas.js'
import { allContentRoutes, section, itemUrl, KINDS } from './content.js'
import { LOCALE_META, t, LOCALES } from '../i18n/config.js'
import { FAQ } from '../../content/faq.js'
import { ORIGIN } from './jsonld.js'
import homeEs from '../i18n/sections/es.json'
import homeEn from '../i18n/sections/en.json'
import * as PRECIOS from '../../content/precios.js'

const abs = (p) => new URL(p, ORIGIN).href
const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Fecha de la última modificación de la web (para páginas sin fecha propia). */
export const SITE_LASTMOD = '2026-10-20'

/** Entradas del sitemap: indexables, con sus alternativas de idioma. */
export function sitemapEntries() {
  const out = []
  for (const r of allStaticRoutes()) {
    if (r.noindex) continue
    const doc = RUTAS[r.id]
    out.push({ url: r.url, lastmod: doc.updated || SITE_LASTMOD, alternates: alternatesFor(r.id) })
  }
  for (const c of allContentRoutes()) out.push({ url: c.url, lastmod: c.lastmod, alternates: c.alternates })
  return out
}

export function sitemapXml() {
  const urls = sitemapEntries().map((e) => {
    const alts = e.alternates.length > 1
      ? [...e.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_META[a.lang].bcp47}" href="${xml(abs(a.url))}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${xml(abs((e.alternates.find((a) => a.lang === 'es') || e.alternates[0]).url))}"/>`].join('\n')
      : ''
    return `  <url>\n    <loc>${xml(abs(e.url))}</loc>\n    <lastmod>${e.lastmod}</lastmod>${alts ? `\n${alts}` : ''}\n  </url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
}

// Rastreadores de buscadores y de asistentes de IA, PERMITIDOS de forma explícita (brief §6).
// Lista según la documentación de cada proveedor conocida a junio de 2026 [verificar antes de
// desplegar: ver docs/DUDAS.md]. `User-agent: *` ya lo permite todo; ser explícito evita que
// una regla futura los bloquee por accidente y deja clara la intención.
export const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',            // OpenAI
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot',       // Anthropic
  'PerplexityBot', 'Perplexity-User',                   // Perplexity
  'Google-Extended', 'Googlebot',                       // Google (Gemini / búsqueda)
  'Bingbot',                                            // Microsoft (Copilot / Bing)
  'Applebot', 'Applebot-Extended',                      // Apple
  'CCBot',                                              // Common Crawl
]

export function robotsTxt() {
  const blocks = AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /api/`).join('\n\n')
  return `# agentceo.io · robots.txt\n# Queremos que buscadores y asistentes de IA lean y citen este sitio.\n\n${blocks}\n\nUser-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`
}

// ── llms.txt (https://llmstxt.org): índice para LLM, factual y citable ───────
const L = {
  es: { pages: 'Páginas principales', faq: 'Preguntas frecuentes', content: 'Contenido', legal: 'Legal', other: 'Otros idiomas', full: 'Texto completo del sitio para modelos de lenguaje' },
  en: { pages: 'Main pages', faq: 'Frequently asked questions', content: 'Content', legal: 'Legal', other: 'Other languages', full: 'Full site text for language models' },
}
const PAGE_IDS = ['home', 'precios', 'empresa', 'contacto', 'prensa', 'recursos', 'blog', 'noticias']
const PAGE_LABEL = { home: 'site.name', precios: 'nav.precios', empresa: 'footer.sobre', contacto: 'footer.contacto', prensa: 'footer.prensa', recursos: 'nav.recursos', blog: 'nav.blog', noticias: 'nav.noticias' }

export function llmsTxt(lang) {
  const tr = L[lang]
  const line = (url, title, desc) => `- [${title}](${abs(url)})${desc ? `: ${desc}` : ''}`
  const pages = PAGE_IDS.filter((id) => hasRoute(id, lang)).map((id) => line(href(id, lang), t(lang, PAGE_LABEL[id])))
  const faq = FAQ.filter((f) => f.q[lang]).map((f) => `- **${f.q[lang]}** ${f.a[lang]}`)
  const content = []
  for (const k of KINDS) {
    const s = section(k, lang)
    if (!s) continue
    for (const it of s.ITEMS) content.push(line(itemUrl(k, lang, it.slug), it.title, it.excerpt))
  }
  const legal = Object.keys(RUTAS).filter((id) => id.startsWith('legal:') && hasRoute(id, lang)).map((id) => line(href(id, lang), RUTAS[id].label[lang]))
  const others = LOCALES.filter((l) => l !== lang).map((l) => line(l === 'es' ? '/llms.txt' : `/${l}/llms.txt`, LOCALE_META[l].name))
  return [
    `# Agent CEO`,
    '',
    `> ${t(lang, 'site.entity')}`,
    '',
    t(lang, 'site.description'),
    '',
    `## ${tr.pages}`, ...pages, '',
    `## ${tr.faq}`, ...faq, '',
    ...(content.length ? [`## ${tr.content}`, ...content, ''] : []),
    ...(legal.length ? [`## ${tr.legal}`, ...legal, ''] : []),
    `## Optional`,
    line(lang === 'es' ? '/llms-full.txt' : `/${lang}/llms-full.txt`, tr.full),
    ...others,
    '',
  ].join('\n')
}

/** Texto de la portada (los fragmentos de cada sección, en orden, forman sus frases). */
function homeText(lang) {
  const d = lang === 'es' ? homeEs : homeEn
  return Object.values(d).map((sec) => Object.values(sec).join('').replace(/\s+/g, ' ').trim())
}

/** Texto plano completo (entidad, FAQ, portada, precios, contenido). */
export function llmsFullTxt(lang, extra = []) {
  const parts = [llmsTxt(lang), '---', '', `# ${lang === 'es' ? 'Portada' : 'Home page'} (${abs(href('home', lang))})`, '', ...homeText(lang).map((p) => `${p}\n`), '']
  if (lang === 'es') {
    parts.push(`# ${PRECIOS.META.title} (${abs('/precios/')})`, '', PRECIOS.META.sub, '')
    for (const p of PRECIOS.PLANS) parts.push(`- ${p.name}: $${p.price}/mes · ${p.credits} créditos por semana · ${p.seats === null ? 'personas sin límite' : `${p.seats} persona(s)`}`)
    parts.push(`- Todos los planes: ${PRECIOS.ALL_PLANS.join('; ')}`)
    for (const k of PRECIOS.PACKS) parts.push(`- Paquete ${k.name}: ${k.credits} créditos por $${k.price}${k.noExpiry ? ' (no caduca)' : ''}`)
    parts.push('', 'Precios en USD.', '')
  }
  for (const k of KINDS) {
    const s = section(k, lang)
    if (!s) continue
    for (const it of s.ITEMS) {
      parts.push(`# ${it.title}`, `URL: ${abs(itemUrl(k, lang, it.slug))}`, `${it.dateISO ? `Fecha/Date: ${it.dateISO}` : ''}`, '', it.excerpt, '')
      for (const b of it.body || []) {
        if (b.type === 'h') parts.push(`## ${b.text}`)
        else if (b.type === 'ul') parts.push(...b.items.map((i) => `- ${i}`))
        else if (b.text) parts.push(b.text)
        parts.push('')
      }
      const src = it.sources?.length ? it.sources : it.source ? [it.source] : []
      if (src.length) parts.push(...src.map((x) => `Fuente/Source: ${x.name} — ${x.url}`), '')
    }
  }
  parts.push(...extra)
  return parts.join('\n').replace(/\*\*(.+?)\*\*/g, '$1')
}
