// Isla de la sección S13 (se hidrata al hacerse visible). Estado compartido: ../store.js
// Los textos se importan aquí (van en el JS de la isla, que solo se descarga al verse) en vez
// de viajar como props serializadas en el HTML: medido, ~7 KB gz menos de documento en la portada.
import S from '../gen/S13.jsx'
import { useLanding } from '../store.js'
import { S13 as es } from '../../i18n/sections/es.json'
import { S13 as en } from '../../i18n/sections/en.json'
import uiEs from '../../i18n/ui/es.js'
import uiEn from '../../i18n/ui/en.js'

export default function I13({ lang }) {
  const v = useLanding(lang === 'en' ? uiEn.logic : uiEs.logic)
  return <S v={v} t={lang === 'en' ? en : es} />
}
