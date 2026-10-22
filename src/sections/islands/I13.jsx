// Isla de la sección S13 (se hidrata al hacerse visible). Estado compartido: ../store.js
// Los textos se importan aquí (van en el JS de la isla, que solo se descarga al verse) en vez
// de viajar como props serializadas en el HTML: medido, ~7 KB gz menos de documento en la portada.
import S from '../gen/S13.jsx'
import ForjaPreview from '../forja/ForjaPreview.jsx'
import { useLanding } from '../store.js'
import { S13 as es } from '../../i18n/sections/es.json'
import { S13 as en } from '../../i18n/sections/en.json'
import { S13 as pt } from '../../i18n/sections/pt.json'
import logicEs from '../../i18n/logic/es.js'
import logicEn from '../../i18n/logic/en.js'
import logicPt from '../../i18n/logic/pt.js'

// Un idioma nuevo = una línea más en cada import y en estos dos mapas (lo vigila tests/site/i18n-registros.test.js).
const TEXTS = { es, en, pt }
const LOGIC = { es: logicEs, en: logicEn, pt: logicPt }

export default function I13({ lang }) {
  const v = useLanding(LOGIC[lang] || LOGIC.es)
  const t = TEXTS[lang] || TEXTS.es
  // Vista previa REAL de lo que construye la Forja (T35 adenda, punto 3), en el hueco que abre el
  // compilador en S13 (children(k)). «¡Nueva oferta!» (t.k51) es el aviso de la app móvil.
  return <S v={v} t={t}>{(k) => <ForjaPreview kind={k} lang={lang} deal={t.k51} />}</S>
}
