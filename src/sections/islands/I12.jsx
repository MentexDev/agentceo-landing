// Isla de la sección S12 (se hidrata al hacerse visible). Estado compartido: ../store.js
import S from '../gen/S12.jsx'
import { useLanding } from '../store.js'

export default function I12({ t, L }) {
  const v = useLanding(L)
  return <S v={v} t={t} />
}
