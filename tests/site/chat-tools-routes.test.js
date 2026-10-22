// T58b · Las secciones que el chat enlaza (worker/chat/tools.js) son las rutas REALES del sitio
// (src/i18n/rutas.js). Si una ruta cambia allí y no aquí, el chat enlazaría a un 404: este test lo impide.
import { describe, it, expect } from 'vitest'
import { RUTAS } from '../../src/i18n/rutas.js'
import { SECTIONS } from '../../worker/chat/tools.js'

const MAP = { pricing: 'precios', blog: 'blog', resources: 'recursos', home: 'home' }
describe('rutas de las herramientas del chat', () => {
  it.each(Object.entries(MAP))('%s = RUTAS.%s (es y en)', (section, id) => {
    expect(SECTIONS[section].es).toBe(RUTAS[id].es)
    expect(SECTIONS[section].en).toBe(RUTAS[id].en)
  })
  it('faq = ancla #faq de la portada en cada idioma', () => {
    expect(SECTIONS.faq.es).toBe(`${RUTAS.home.es}#faq`)
    expect(SECTIONS.faq.en).toBe(`${RUTAS.home.en}#faq`)
  })
})
