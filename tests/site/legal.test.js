// Legal (brief §7): borradores marcados, datos de una sola fuente, nada sin sustituir.
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { html, tags } from './helpers.js'
import { legalDocs } from '../../src/lib/legal.js'
import { RUTAS } from '../../src/i18n/rutas.js'
import { SUBPROCESSORS } from '../../content/subprocesadores.js'
import { STORAGE } from '../../src/data/storage.js'

const REQUIRED = ['terminos', 'privacidad', 'cookies', 'seguridad', 'gdpr', 'california', 'estados', 'uso-aceptable', 'ia', 'subprocesadores', 'dpa', 'reembolsos', 'accesibilidad', 'dmca']
const es = legalDocs().filter((d) => d.lang === 'es')

describe('documentos legales', () => {
  it('existen los 14 del brief', () => expect(es.map((d) => d.id).sort()).toEqual([...REQUIRED].sort()))

  it.each(es.map((d) => [d.id, d]))('%s: borrador visible, versión, sin marcadores sin sustituir y solo buzones @klinworks.com', (id, d) => {
    const src = html(RUTAS[`legal:${id}`].es)
    expect(d.estado).toBe('borrador')
    expect(src).toContain('requiere revisión de abogado')
    expect(src).toMatch(/v\d+\.\d+/)
    expect(src).not.toMatch(/\{\{\w+\}\}/)
    for (const m of d.body.matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g)) expect(m[0], id).toMatch(/@klinworks\.com$/)
  })

  it('la tabla de subprocesadores es la misma en Privacidad, GDPR y Subprocesadores', () => {
    for (const id of ['privacidad', 'gdpr', 'subprocesadores']) {
      const src = html(RUTAS[`legal:${id}`].es)
      for (const s of SUBPROCESSORS) expect(src, `${id}: ${s.name}`).toContain(s.name.replace(/&/g, '&amp;'))
    }
  })

  it('reembolsos lleva los datos de Diego y marca lo que llegó cortado', () => {
    const d = es.find((x) => x.id === 'reembolsos').body.replace(/\s+/g, ' ')
    expect(d).toMatch(/30 días/)
    expect(d).toMatch(/errores de facturación/i)
    expect(d).toMatch(/valor en efectivo/i)
    expect(d).toMatch(/\[PENDIENTE/)
  })

  it('DMCA marca el registro pendiente del agente', () => {
    expect(es.find((x) => x.id === 'dmca').body).toContain('[PENDIENTE registro dmca.copyright.gov]')
  })

  it('el pie enlaza los 14 documentos y «No vender ni compartir»', () => {
    const links = tags(html('/'), 'a').map((a) => a.href)
    for (const id of REQUIRED) expect(links, id).toContain(RUTAS[`legal:${id}`].es)
    expect(links).toContain('/no-vender-ni-compartir/')
  })
})

describe('inventario de almacenamiento (Cookies)', () => {
  // Claves que el código escribe (literal o constante) → todas deben estar en STORAGE.
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))
  const code = walk('src').filter((f) => /\.(js|astro|jsx)$/.test(f) && !f.includes('/sections/gen/')).map((f) => readFileSync(f, 'utf8')).join('\n')
  const used = new Set([...code.matchAll(/['"`](ac_[a-z]+)['"`]/g)].map((m) => m[1]))
  const listed = STORAGE.map((s) => s.name).join(' ')
  it.each([...used])('%s está documentada', (k) => expect(listed).toContain(k))
  it('también la cookie de idioma, la de consentimiento y los recursos', () => {
    for (const k of ['lang', 'consent', 'agentceo_lead_']) expect(listed).toContain(k)
  })
})
