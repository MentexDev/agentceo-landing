// Isla de la sección S10 (se hidrata al hacerse visible). Estado compartido: ../store.js
import S from '../gen/S10.jsx'
import { useLanding } from '../store.js'

export default function I10({ t, L }) {
  const v = useLanding(L)
  return <S v={v} t={t} />
}
