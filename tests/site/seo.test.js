// SEO + GEO sobre el sitio construido (dist/): sitemap, robots, llms.txt, OG y metadatos.
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { DIST, allPages, html, tags, fileFor } from './helpers.js'
import { allStaticRoutes } from '../../src/i18n/rutas.js'
import { AI_BOTS } from '../../src/lib/seo.js'

const read = (p) => readFileSync(join(DIST, p), 'utf8')
const ORIGIN = 'https://agentceo.io'
const local = (u) => u.replace(ORIGIN, '')
const isNoindex = (src) => /<meta name="robots" content="noindex/.test(src)
const pages = allPages().filter((u) => !/\/404$/.test(u))
const indexable = pages.filter((u) => !isNoindex(html(u)))

describe('sitemap.xml', () => {
  const xml = read('sitemap.xml')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

  it('es XML con el namespace de hreflang', () => {
    expect(xml.startsWith('<?xml')).toBe(true)
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
  })
  it('cada <loc> existe en dist/ y es absoluta a agentceo.io', () => {
    for (const l of locs) {
      expect(l.startsWith(`${ORIGIN}/`), l).toBe(true)
      expect(existsSync(fileFor(local(l))), l).toBe(true)
    }
  })
  it('incluye TODAS las páginas indexables y ninguna noindex', () => {
    const set = new Set(locs.map(local))
    for (const u of indexable) expect(set.has(u), u).toBe(true)
    expect(set.has('/gracias/')).toBe(false)
  })
  it('hreflang recíproco con x-default en las URL con traducción', () => {
    const blocks = xml.split('<url>').slice(1)
    for (const b of blocks) {
      const loc = /<loc>([^<]+)/.exec(b)[1]
      const alts = [...b.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], url: m[2] }))
      if (!alts.length) continue
      expect(alts.some((a) => a.lang === 'x-default'), loc).toBe(true)
      expect(alts.some((a) => a.url === loc), `${loc} se incluye a sí misma`).toBe(true)
    }
  })
  it('lastmod en formato fecha', () => {
    for (const m of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) expect(m[1]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('robots.txt', () => {
  const txt = read('robots.txt')
  it.each(AI_BOTS)('permite %s', (bot) => expect(txt).toMatch(new RegExp(`User-agent: ${bot}\\nAllow: /`)))
  it('apunta al sitemap y protege /api/', () => {
    expect(txt).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`)
    expect(txt).toContain('Disallow: /api/')
    expect(txt).not.toMatch(/Disallow: \/\s*$/m)
  })
})

describe('llms.txt', () => {
  for (const [p, lang] of [['llms.txt', 'es'], ['en/llms.txt', 'en'], ['llms-full.txt', 'es'], ['en/llms-full.txt', 'en']]) {
    it(`${p}: entidad, FAQ y enlaces que existen`, () => {
      const txt = read(p)
      expect(txt.startsWith('# Agent CEO')).toBe(true)
      expect(txt).toContain('Klinworks, LLC')
      for (const m of txt.matchAll(/\]\((https:\/\/agentceo\.io[^)]*)\)/g)) expect(existsSync(fileFor(local(m[1]))), m[1]).toBe(true)
    })
  }
  it('llms-full incluye la portada y los precios reales', () => {
    const txt = read('llms-full.txt')
    expect(txt).toContain('Empleados de IA')
    expect(txt).toMatch(/Impulso: \$29/)
  })
})

/** Ancho y alto de un PNG (cabecera IHDR). */
const pngSize = (file) => { const b = readFileSync(file); return [b.readUInt32BE(16), b.readUInt32BE(20)] }

describe('metadatos de cada página', () => {
  const titles = new Map()
  it.each(pages)('%s', (u) => {
    const src = html(u)
    const meta = tags(src, 'meta')
    const get = (k) => meta.find((m) => m.property === k || m.name === k)?.content
    // OG propia de 1200×630 que existe
    const og = get('og:image')
    expect(og, 'og:image').toBeTruthy()
    const ogFile = join(DIST, local(og))
    expect(existsSync(ogFile), og).toBe(true)
    expect(pngSize(ogFile)).toEqual([1200, 630])
    expect(get('twitter:card')).toBe('summary_large_image')
    // Título y descripción
    const title = /<title>([^<]+)<\/title>/.exec(src)[1]
    expect(title.length).toBeGreaterThan(10)
    if (!isNoindex(src)) {
      expect(titles.has(title), `título repetido: ${title} (${titles.get(title)})`).toBe(false)
      titles.set(title, u)
    }
    const desc = get('description')
    expect(desc.length, desc).toBeGreaterThanOrEqual(50)
    expect(desc.length, desc).toBeLessThanOrEqual(200)
    // Un solo <h1>
    expect((src.match(/<h1[\s>]/g) || []).length).toBe(1)
    // JSON-LD válido con @context
    for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const j = JSON.parse(m[1])
      expect(j['@context']).toBe('https://schema.org')
    }
  })
})

it('todas las rutas estáticas indexables tienen JSON-LD', () => {
  for (const r of allStaticRoutes().filter((x) => !x.noindex)) expect(html(r.url), r.url).toContain('application/ld+json')
})
