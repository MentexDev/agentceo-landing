// Isla de la sección S10 (se hidrata al hacerse visible). Estado compartido: ../store.js
// Los textos se importan aquí (van en el JS de la isla, que solo se descarga al verse) en vez
// de viajar como props serializadas en el HTML: medido, ~7 KB gz menos de documento en la portada.
import S from '../gen/S10.jsx'
import { useLanding } from '../store.js'
import { byLang } from './textos.js'

// Todos los idiomas, sin tocar la isla al añadir uno (./textos.js · tests/site/i18n-registros.test.js).
const TEXTS = byLang(import.meta.glob('../../i18n/sections/*.json', { eager: true, import: 'S10' }))
const LOGIC = byLang(import.meta.glob('../../i18n/logic/*.js', { eager: true, import: 'default' }))

export default function I10({ lang }) {
  const v = useLanding(LOGIC[lang] || LOGIC.es)
  return <S v={v} t={TEXTS[lang] || TEXTS.es} />
}
