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

  it('Diego quitó PostHog, Sentry y Plausible: no aparecen en ningún documento', () => {
    for (const d of es) expect(d.body, d.id).not.toMatch(/PostHog|Sentry|Plausible/)
    for (const id of ['privacidad', 'gdpr', 'subprocesadores', 'dpa']) expect(html(RUTAS[`legal:${id}`].es)).not.toMatch(/PostHog|Sentry|Plausible/)
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
    // «Datos reales» (2026-10-20): expiración semanal, 7 días / 10 %, paquetes 14 días, autorrenovación.
    expect(d).toMatch(/expiran ese lunes/)
    expect(d).toMatch(/7 días/)
    expect(d).toMatch(/menos del 10 %/)
    expect(d).toMatch(/14 días/)
    expect(d).toMatch(/renuevan automáticamente/)
    for (const x of ['300', '2.300', '40.000', '200.000', '1.000', '3.000', '8.000', '20.000']) expect(d).toContain(x)
    expect(d).not.toMatch(/se acumulan o se pierden/)
    expect(d).not.toMatch(/confirmar primera cláusula/)
  })

  it('DMCA marca el registro pendiente del agente', () => {
    expect(es.find((x) => x.id === 'dmca').body).toContain('[PENDIENTE registro dmca.copyright.gov]')
  })

  // T35 · adenda: el pie lleva 5 documentos clave + «Ver todo» → índice /legal/, que enlaza los 14.
  // Ningún documento queda a más de dos clics de cualquier página.
  it('el pie enlaza el índice legal y «No vender ni compartir»', () => {
    const links = tags(html('/'), 'a').map((a) => a.href)
    expect(links).toContain(RUTAS.legal.es)
    expect(links).toContain('/no-vender-ni-compartir/')
  })
  it.each(['es', 'en'])('el índice legal (%s) enlaza los 14 documentos', (lang) => {
    const links = tags(html(RUTAS.legal[lang]), 'a').map((a) => a.href)
    for (const id of REQUIRED) expect(links, id).toContain(RUTAS[`legal:${id}`][lang])
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
