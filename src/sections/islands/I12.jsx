// Isla de la sección S12 (se hidrata al hacerse visible). Estado compartido: ../store.js
// Los textos se importan aquí (van en el JS de la isla, que solo se descarga al verse) en vez
// de viajar como props serializadas en el HTML: medido, ~7 KB gz menos de documento en la portada.
import S from '../gen/S12.jsx'
import { useLanding } from '../store.js'
import { S12 as es } from '../../i18n/sections/es.json'
import { S12 as en } from '../../i18n/sections/en.json'
import { S12 as pt } from '../../i18n/sections/pt.json'
import logicEs from '../../i18n/logic/es.js'
import logicEn from '../../i18n/logic/en.js'
import logicPt from '../../i18n/logic/pt.js'

// Un idioma nuevo = una línea más en cada import y en estos dos mapas (lo vigila tests/site/i18n-registros.test.js).
const TEXTS = { es, en, pt }
const LOGIC = { es: logicEs, en: logicEn, pt: logicPt }

export default function I12({ lang }) {
  const v = useLanding(LOGIC[lang] || LOGIC.es)
  return <S v={v} t={TEXTS[lang] || TEXTS.es} />
}
