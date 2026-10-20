// Isla de la sección S04 (se hidrata al hacerse visible). Estado compartido: ../store.js
import S from '../gen/S04.jsx'
import { useLanding } from '../store.js'

export default function I04({ t, L }) {
  const v = useLanding(L)
  return <S v={v} t={t} />
}
