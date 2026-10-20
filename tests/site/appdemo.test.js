// S03 · recreación de la app: paridad es/en y datos SIEMPRE inventados.
import { describe, it, expect } from 'vitest'
import { DICT, ORDERS, CLIENTS, VIEWS } from '../../src/sections/appdemo/data.js'

const shape = (o) => (Array.isArray(o) ? o.map(shape) : o && typeof o === 'object' ? Object.fromEntries(Object.keys(o).sort().map((k) => [k, shape(o[k])])) : typeof o)

describe('S03 · datos de la demo', () => {
  it('es y en tienen exactamente la misma forma', () => expect(shape(DICT.en)).toEqual(shape(DICT.es)))
  it('las 6 vistas tienen etiqueta en los dos idiomas', () => {
    for (const l of ['es', 'en']) for (const v of VIEWS) expect(DICT[l].tabs[v], `${l}:${v}`).toBeTruthy()
  })
  it('ningún dato real: correos de ejemplo y clientas con nombre + inicial', () => {
    for (const c of CLIENTS) expect(c.email).toMatch(/@example\.com$/)
    for (const o of [...ORDERS, ...CLIENTS]) expect(o.who).toMatch(/^(\S+ [A-ZÁÉÍÓÚ]\.|Boutique \S+)$/)
  })
  it('la demo lo declara: datos inventados de una marca de ejemplo', () => {
    expect(DICT.es.note).toMatch(/datos inventados/)
    expect(DICT.en.note).toMatch(/made-up data/)
  })
})
