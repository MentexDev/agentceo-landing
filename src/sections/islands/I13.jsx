// Isla de la sección S13 (se hidrata al hacerse visible). Estado compartido: ../store.js
// Los textos se importan aquí (van en el JS de la isla, que solo se descarga al verse) en vez
// de viajar como props serializadas en el HTML: medido, ~7 KB gz menos de documento en la portada.
import S from '../gen/S13.jsx'
import ForjaPreview from '../forja/ForjaPreview.jsx'
import { useLanding } from '../store.js'
import { byLang } from './textos.js'

// Todos los idiomas, sin tocar la isla al añadir uno (./textos.js · tests/site/i18n-registros.test.js).
const TEXTS = byLang(import.meta.glob('../../i18n/sections/*.json', { eager: true, import: 'S13' }))
const LOGIC = byLang(import.meta.glob('../../i18n/logic/*.js', { eager: true, import: 'default' }))

export default function I13({ lang }) {
  const v = useLanding(LOGIC[lang] || LOGIC.es)
  const t = TEXTS[lang] || TEXTS.es
  // Vista previa REAL de lo que construye la Forja (T35 adenda, punto 3), en el hueco que abre el
  // compilador en S13 (children(k)). «¡Nueva oferta!» (t.k51) es el aviso de la app móvil.
  return <S v={v} t={t}>{(k) => <ForjaPreview kind={k} lang={lang} deal={t.k51} />}</S>
}
