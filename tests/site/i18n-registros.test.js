// T62 · Los REGISTROS de idioma están completos para cada idioma de LOCALES (src/i18n/meta.js).
// Añadir un idioma sin rellenar alguno de estos sitios pone este fichero en rojo, con el sitio que falta.
// Procedimiento: docs/I18N.md.
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { LOCALES, LOCALE_META, DEFAULT_LOCALE, prefix } from '../../src/i18n/meta.js'
import { RUTAS } from '../../src/i18n/rutas.js'
import { SECTIONS } from '../../src/i18n/sections.js'
import { CONTENT } from '../../content/locales.js'
import { DICT } from '../../src/sections/appdemo/data.js'
import { FORJA } from '../../src/sections/forja/texts.js'
import { STORAGE } from '../../src/data/storage.js'
import { SUBPROCESSORS } from '../../content/subprocesadores.js'
import { legalDocs } from '../../src/lib/legal.js'

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8')
const keys = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]))
const others = LOCALES.filter((l) => l !== DEFAULT_LOCALE)

describe('registro de idiomas (meta.js)', () => {
  it.each(LOCALES)('%s tiene todos los metadatos', (l) => {
    const m = LOCALE_META[l]
    for (const k of ['name', 'short', 'bcp47', 'og', 'dateLocale', 'numberLocale']) expect(m?.[k], `${l}.${k}`).toBeTruthy()
    expect(Array.isArray(m.accept) && m.accept.length, `${l}.accept`).toBeTruthy()
    expect(Array.isArray(m.countries), `${l}.countries`).toBe(true)
  })
  it('ningún país apunta a dos idiomas', () => {
    const all = LOCALES.flatMap((l) => LOCALE_META[l].countries)
    expect(new Set(all).size).toBe(all.length)
  })
})

describe('rutas: cada página estática existe en cada idioma, bajo su prefijo', () => {
  const ids = Object.keys(RUTAS).filter((id) => !id.startsWith('legal:'))
  it.each(ids)('%s', (id) => {
    for (const l of LOCALES) {
      expect(RUTAS[id][l], `${id} en ${l}`).toBeTruthy()
      if (l !== DEFAULT_LOCALE) expect(RUTAS[id][l].startsWith(`${prefix(l)}/`), RUTAS[id][l]).toBe(true)
    }
  })
  it.each(LOCALES)('%s: todos los documentos legales del idioma por defecto están traducidos', (l) => {
    const base = legalDocs().filter((d) => d.lang === DEFAULT_LOCALE).map((d) => d.id).sort()
    expect(legalDocs().filter((d) => d.lang === l).map((d) => d.id).sort()).toEqual(base)
  })
})

describe('textos y contenido de cada idioma', () => {
  it.each(LOCALES)('%s: secciones de la portada, contenido editorial, AppDemo y Forja', (l) => {
    expect(SECTIONS[l], 'src/i18n/sections.js').toBeTruthy()
    for (const kind of ['noticias', 'blog', 'recursos', 'precios']) expect(CONTENT[l]?.[kind], `content/locales.js · ${kind}`).toBeTruthy()
    expect(keys(DICT[l] || {}).sort(), 'appdemo/data.js DICT').toEqual(keys(DICT[DEFAULT_LOCALE]).sort())
    expect(keys(FORJA[l] || {}).sort(), 'forja/texts.js FORJA').toEqual(keys(FORJA[DEFAULT_LOCALE]).sort())
    expect(existsSync(new URL(`../../src/i18n/logic/${l}.js`, import.meta.url)), `src/i18n/logic/${l}.js`).toBe(true)
  })

  it.each(LOCALES)('%s: tablas legales (almacenamiento y subprocesadores) traducidas', (l) => {
    for (const s of STORAGE) for (const f of ['type', 'category', 'duration', 'purpose']) expect(s[f][l], `${s.name}.${f}`).toBeTruthy()
    for (const s of SUBPROCESSORS) for (const f of ['purpose', 'location']) expect(s[f][l], `${s.name}.${f}`).toBeTruthy()
  })

  it('el contenido editorial de cada idioma enlaza con su original (campo `es`) y no repite slugs', () => {
    for (const l of others) for (const kind of ['noticias', 'blog', 'recursos']) {
      const items = CONTENT[l][kind].ITEMS
      const base = new Set(CONTENT[DEFAULT_LOCALE][kind].ITEMS.map((i) => i.slug))
      for (const it of items) expect(base.has(it.es), `${l}/${kind}/${it.slug} → es '${it.es}'`).toBe(true)
      expect(new Set(items.map((i) => i.slug)).size).toBe(items.length)
    }
  })
})

describe('islas: cada isla lleva los textos de TODOS los idiomas, sin imports por idioma', () => {
  const dir = new URL('../../src/sections/islands/', import.meta.url)
  const files = readdirSync(dir).filter((f) => /^I\d+\.jsx$/.test(f))
  it.each(files)('%s', (f) => {
    const src = readFileSync(new URL(f, dir), 'utf8')
    const S = /from '\.\.\/gen\/(S\d+)\.jsx'/.exec(src)[1]
    // Los textos y la lógica salen de import.meta.glob (todos los idiomas): añadir uno no toca la isla.
    expect(src).toContain(`import.meta.glob('../../i18n/sections/*.json', { eager: true, import: '${S}' })`)
    expect(src).toContain("import.meta.glob('../../i18n/logic/*.js', { eager: true, import: 'default' })")
    expect(src).not.toMatch(/i18n\/(sections|logic|ui)\/(es|en|pt)\./)
    expect(src).not.toMatch(/lang === '(es|en|pt)'/)
  })
  it.each(LOCALES)('%s: cada sección de las islas existe en su JSON', (l) => {
    for (const f of files) {
      const S = /from '\.\.\/gen\/(S\d+)\.jsx'/.exec(readFileSync(new URL(f, dir), 'utf8'))[1]
      expect(SECTIONS[l][S], `${l}.${S}`).toBeTruthy()
    }
  })
})

describe('Worker: idiomas en el servidor', () => {
  it('los enlaces de los correos (emails/src/brand.js · ROUTES) = las rutas del sitio en cada idioma', async () => {
    const { ROUTES, LOCALES: EMAIL_LOCALES } = await import('../../emails/src/brand.js')
    expect([...EMAIL_LOCALES].sort()).toEqual([...LOCALES].sort())
    for (const l of LOCALES) {
      expect(ROUTES.home[l], `home ${l}`).toBe(RUTAS.home[l])
      expect(ROUTES.pricing[l], `pricing ${l}`).toBe(RUTAS.precios[l])
      expect(ROUTES.privacy[l], `privacy ${l}`).toBe(RUTAS['legal:privacidad'][l])
    }
  })
  it('la página de gracias por idioma del formulario sin JS = RUTAS.gracias', () => {
    const src = read('worker/waitlist.js')
    const THANKS = Function(`return (${/const THANKS = (\{[^}]*\})/.exec(src)[1]})`)()
    expect(THANKS).toEqual(Object.fromEntries(LOCALES.map((l) => [l, RUTAS.gracias[l]])))
  })
})
