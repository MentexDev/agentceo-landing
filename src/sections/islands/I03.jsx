// Isla de la sección S03 (se hidrata al hacerse visible). Estado compartido: ../store.js
import S from '../gen/S03.jsx'
import { useLanding } from '../store.js'

export default function I03({ t, L }) {
  const v = useLanding(L)
  return <S v={v} t={t} />
}
