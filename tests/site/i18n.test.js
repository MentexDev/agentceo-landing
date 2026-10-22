// i18n: paridad de diccionarios (TODOS los idiomas de LOCALES contra es), rutas en cada idioma,
// hreflang recíproco y ausencia de español en las páginas /en/ y /pt/.
import { describe, it, expect } from 'vitest'
import { LOCALES, LOCALE_META, DEFAULT_LOCALE, t, dict } from '../../src/i18n/config.js'
import { allStaticRoutes } from '../../src/i18n/rutas.js'
import { html, tags, allPages } from './helpers.js'
import { readFileSync } from 'node:fs'

/** Lista de claves hoja 'a.b.c' de un diccionario. */
const keys = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]))

describe('diccionarios', () => {
  const a = keys(dict(DEFAULT_LOCALE)).sort()
  it.each(LOCALES.filter((l) => l !== DEFAULT_LOCALE))('%s tiene EXACTAMENTE las mismas claves que es', (lang) => {
    const b = keys(dict(lang)).sort()
    expect(b.filter((k) => !a.includes(k)), `sobran en ${lang}`).toEqual([])
    expect(a.filter((k) => !b.includes(k)), `faltan en ${lang}`).toEqual([])
  })

  it('ningún valor está vacío', () => {
    for (const lang of LOCALES) {
      for (const k of keys(dict(lang))) expect(String(t(lang, k)).trim(), `${lang}:${k}`).not.toBe('')
    }
  })

  it('una clave que falta rompe (no devuelve la clave en crudo)', () => {
    expect(() => t('es', 'no.existe')).toThrow(/falta la clave/)
  })

  it('interpola variables', () => {
    expect(t('en', 'footer.rights', { year: 2026 })).toContain('2026')
  })
})

describe('textos de las secciones de la portada', () => {
  const load = (l) => JSON.parse(readFileSync(new URL(`../../src/i18n/sections/${l}.json`, import.meta.url)))
  const ses = load(DEFAULT_LOCALE)
  const others = LOCALES.filter((l) => l !== DEFAULT_LOCALE)
  it.each(others)('%s tiene las mismas secciones y claves que es', (l) => {
    const sen = load(l)
    expect(Object.keys(sen).sort()).toEqual(Object.keys(ses).sort())
    for (const s of Object.keys(ses)) expect(Object.keys(sen[s]).sort(), s).toEqual(Object.keys(ses[s]).sort())
  })
  it.each(others)('%s: los espacios de los bordes coinciden (en JSX separan palabras)', (l) => {
    const sen = load(l)
    for (const [s, d] of Object.entries(ses)) for (const [k, v] of Object.entries(d)) {
      const w = sen[s][k]
      expect([w.startsWith(' '), w.endsWith(' ')], `${s}.${k}`).toEqual([v.startsWith(' '), v.endsWith(' ')])
    }
  })
})

describe('rutas construidas', () => {
  const routes = allStaticRoutes()
  it.each(routes.map((r) => [r.url, LOCALE_META[r.lang].bcp47]))('%s existe en dist con lang=%s', (url, bcp47) => {
    expect(html(url)).toContain(`<html lang="${bcp47}"`)
  })

  it('hreflang es recíproco: si A apunta a B, B apunta a A', () => {
    for (const r of routes.filter((x) => !x.noindex)) {
      const links = tags(html(r.url), 'link').filter((l) => l.rel === 'alternate' && l.hreflang && l.hreflang !== 'x-default')
      for (const l of links) {
        const other = new URL(l.href).pathname
        const back = tags(html(other), 'link').filter((x) => x.rel === 'alternate' && x.hreflang === LOCALE_META[r.lang].bcp47)
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

describe('páginas en portugués', () => {
  // Palabras del español que NO existen en portugués («que», «para», «está»… sí existen: no sirven).
  // Sin letra ni guion delante: «exercê-los», «controlá-los» son portugués (pronombre enclítico).
  const ES = /(?<![\p{L}-])(los|las|una|del|también|aquí|cómo|nuestro|nuestra|puedes|ahora|cuando|muy|pero|equipo|usted)(?!\p{L})/giu
  const visibleText = (src) =>
    src.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
  const ptPages = allPages().filter((u) => u.startsWith('/pt/'))

  it('hay páginas en portugués', () => expect(ptPages.length).toBeGreaterThan(20))

  it.each(ptPages)('%s no tiene texto en español (salvo nombres y marcas [PENDIENTE])', (u) => {
    const words = (visibleText(html(u)).replace(/\[PENDIENTE[^\]]*\]/g, ' ').match(ES) || [])
    expect(words.length, words.join(' ')).toBeLessThanOrEqual(3)
  })

  it.each(ptPages)('%s declara lang="pt-BR"', (u) => expect(html(u)).toContain('<html lang="pt-BR"'))
})

it('LOCALES: es (por defecto, en la raíz), en y pt', () => {
  expect(LOCALES).toEqual(['es', 'en', 'pt'])
  expect(DEFAULT_LOCALE).toBe('es')
})
