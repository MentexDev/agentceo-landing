// i18n: paridad de diccionarios, rutas en ambos idiomas, hreflang recíproco y
// ausencia de español en las páginas /en/.
import { describe, it, expect } from 'vitest'
import es from '../../src/i18n/ui/es.js'
import en from '../../src/i18n/ui/en.js'
import { LOCALES, t } from '../../src/i18n/config.js'
import { allStaticRoutes } from '../../src/i18n/rutas.js'
import { html, tags, allPages } from './helpers.js'

/** Lista de claves hoja 'a.b.c' de un diccionario. */
const keys = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]))

describe('diccionarios', () => {
  it('es y en tienen EXACTAMENTE las mismas claves', () => {
    const a = keys(es).sort(), b = keys(en).sort()
    expect(b.filter((k) => !a.includes(k)), 'sobran en en').toEqual([])
    expect(a.filter((k) => !b.includes(k)), 'faltan en en').toEqual([])
  })

  it('ningún valor está vacío', () => {
    for (const [lang, d] of [['es', es], ['en', en]]) {
      for (const k of keys(d)) expect(String(t(lang, k)).trim(), `${lang}:${k}`).not.toBe('')
    }
  })

  it('una clave que falta rompe (no devuelve la clave en crudo)', () => {
    expect(() => t('es', 'no.existe')).toThrow(/falta la clave/)
  })

  it('interpola variables', () => {
    expect(t('en', 'footer.rights', { year: 2026 })).toContain('2026')
  })
})

describe('rutas construidas', () => {
  const routes = allStaticRoutes()
  it.each(routes.map((r) => [r.url, r.lang]))('%s existe en dist con lang=%s', (url, lang) => {
    expect(html(url)).toContain(`<html lang="${lang}"`)
  })

  it('hreflang es recíproco: si A apunta a B, B apunta a A', () => {
    for (const r of routes.filter((x) => !x.noindex)) {
      const links = tags(html(r.url), 'link').filter((l) => l.rel === 'alternate' && l.hreflang && l.hreflang !== 'x-default')
      for (const l of links) {
        const other = new URL(l.href).pathname
        const back = tags(html(other), 'link').filter((x) => x.rel === 'alternate' && x.hreflang === r.lang)
        expect(back.map((x) => new URL(x.href).pathname), `${other} → ${r.url}`).toContain(r.url)
      }
    }
  })

  it('cada página indexable tiene canonical absoluto a agentceo.io', () => {
    for (const r of routes.filter((x) => !x.noindex)) {
      const c = tags(html(r.url), 'link').find((l) => l.rel === 'canonical')
      expect(c?.href, r.url).toBe(`https://agentceo.io${r.url}`)
    }
  })
})

it('las páginas noindex lo declaran y no llevan canonical', () => {
  for (const r of allStaticRoutes().filter((x) => x.noindex)) {
    const src = html(r.url)
    expect(src, r.url).toContain('name="robots" content="noindex')
    expect(tags(src, 'link').find((l) => l.rel === 'canonical'), r.url).toBeUndefined()
  }
})

describe('páginas en inglés', () => {
  // Heurística: palabras muy frecuentes del español que no existen en inglés.
  const ES = /\b(que|para|con|los|las|una|por|del|tu|sus|más|está|también|aquí|cómo)\b/gi
  const visibleText = (src) =>
    src.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
  const enPages = allPages().filter((u) => u.startsWith('/en/'))

  it('hay páginas en inglés', () => expect(enPages.length).toBeGreaterThan(0))

  it.each(enPages)('%s no tiene texto en español (salvo el nombre del idioma)', (u) => {
    const words = (visibleText(html(u)).match(ES) || [])
    // El selector muestra «Español» y algún nombre propio; más de 3 coincidencias = página a medias.
    expect(words.length, words.join(' ')).toBeLessThanOrEqual(3)
  })

  it.each(enPages)('%s declara lang="en"', (u) => expect(html(u)).toContain('<html lang="en"'))
})

it('LOCALES incluye es (por defecto) y en', () => expect(LOCALES).toEqual(['es', 'en']))
