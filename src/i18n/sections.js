// Diccionarios de las secciones de la portada (generados por el compilador del prototipo
// en español; el inglés con las MISMAS claves). Un test exige la paridad.
import es from './sections/es.json'
import en from './sections/en.json'
import pt from './sections/pt.json'

// Idioma nuevo: su JSON aquí (tests/site/i18n-registros.test.js exige que estén todos los de LOCALES).
export const SECTIONS = { es, en, pt }
const D = SECTIONS
export function sectionDict(lang, id) {
  const d = D[lang]?.[id]
  if (!d) throw new Error(`[i18n] faltan los textos de la sección ${id} en "${lang}"`)
  return d
}
