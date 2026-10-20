// ─────────────────────────────────────────────────────────────────────────────
// BASE DE CONOCIMIENTO del widget de soporte, generada SOLO con contenido del sitio
// (brief §8: «basado SOLO en el contenido del sitio»). Un fragmento por pieza:
//   { id, kind, title, text, url, cta? }
// La consumen: el modo stub (búsqueda BM25 en el Worker) y el modo live (prefijo
// cacheado del prompt). Se regenera en cada build: si cambia la web, cambia el widget.
// Las noticias NO entran: hablan de terceros y el widget responde sobre Agent CEO.
// ─────────────────────────────────────────────────────────────────────────────
import { FAQ } from '../../content/faq.js'
import * as PRECIOS from '../../content/precios.js'
import * as BLOG from '../../content/blog.js'
import * as RECURSOS from '../../content/recursos.js'
import { t } from '../i18n/config.js'
import { RUTAS } from '../i18n/rutas.js'
import { legalDocs } from './legal.js'

const MAX = 1400
const plain = (s = '') => String(s).replace(/\*\*(.+?)\*\*/g, '$1').replace(/\s+/g, ' ').trim()
const clip = (s) => (s.length > MAX ? `${s.slice(0, MAX - 1).replace(/\s+\S*$/, '')}…` : s)
const routeUrl = (id, lang) => RUTAS[id]?.[lang] ?? null

function bodyText(blocks = []) {
  return blocks
    .map((b) => (b.type === 'ul' ? b.items.map((i) => `• ${plain(i)}`).join(' ') : plain(b.text)))
    .join(' ')
}

/** Fragmentos extra que otras fases registran (secciones de la home, legales…). */
const extra = { es: [], en: [] }
export function registerChunks(lang, chunks) {
  extra[lang].push(...chunks)
}

export function buildKnowledge(lang) {
  const home = routeUrl('home', lang) || '/'
  const out = [
    { id: 'entity', kind: 'entity', title: 'Agent CEO', text: t(lang, 'site.entity'), url: home },
  ]
  for (const f of FAQ) {
    if (!f.q[lang] || !f.a[lang]) continue
    out.push({
      id: `faq:${f.id}`,
      kind: 'faq',
      title: f.q[lang],
      text: f.a[lang],
      url: (f.more && routeUrl(f.more, lang)) || `${home}#faq`,
      ...(f.cta ? { cta: f.cta } : {}),
    })
  }
  // El contenido editorial existe hoy solo en español (la Fase 6 añade content/en).
  if (lang === 'es') {
    const fmt = (n) => n.toLocaleString('es-ES')
    const plans = PRECIOS.PLANS.map((p) => `${p.name}: $${p.price} al mes, ${fmt(p.credits)} créditos por semana, ${p.seats === null ? 'personas sin límite' : `${p.seats} ${p.seats === 1 ? 'usuario' : 'personas'}`}.`).join(' ')
    const packs = PRECIOS.PACKS.map((k) => `${k.name}: ${fmt(k.credits)} créditos por $${k.price}${k.noExpiry ? ' (no caduca)' : ''}`).join('; ')
    out.push({ id: 'pricing', kind: 'pricing', title: PRECIOS.META.h1, text: clip(`${PRECIOS.META.sub} ${plans} Todos los planes: ${PRECIOS.ALL_PLANS.join(', ').toLowerCase()}. Paquetes de créditos (pago único): ${packs}. Precios en USD.`), url: routeUrl('precios', lang) || `${home}#faq` })
    for (const f of PRECIOS.FAQ) out.push({ id: `pricing-faq:${f.q}`, kind: 'faq', title: f.q, text: f.a, url: routeUrl('precios', lang) || `${home}#faq` })
    for (const it of BLOG.ITEMS) out.push({ id: `blog:${it.slug}`, kind: 'blog', title: it.title, text: clip(`${it.excerpt} ${bodyText(it.body)}`), url: `/blog/${it.slug}` })
    for (const it of RECURSOS.ITEMS) out.push({ id: `recurso:${it.slug}`, kind: 'recurso', title: it.title, text: clip(`${it.excerpt} ${(it.whatYouGet || []).map(plain).join(' ')}`), url: `/recursos/${it.slug}` })
  }
  // Documentos legales: título + introducción + títulos de sección, con su URL.
  for (const d of legalDocs().filter((x) => x.lang === lang)) {
    const intro = d.body.split(/\n---\n/)[0].replace(/^#.*$/m, '').replace(/\*\*Última actualización:[^*]*\*\*|\*\*Last updated:[^*]*\*\*/, '')
    const heads = [...d.body.matchAll(/^## (.+)$/gm)].map((m) => m[1].replace(/^\d+(\s?bis)?\.\s*/, '')).join(' · ')
    out.push({ id: `legal:${d.id}`, kind: 'legal', title: d.titulo, text: clip(plain(`${intro} ${heads}`).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')), url: RUTAS[`legal:${d.id}`]?.[lang] || `/legal/${d.slug}` })
  }
  out.push(...extra[lang])
  return out
}
