// Isla de la sección S05 (se hidrata al hacerse visible). Estado compartido: ../store.js
import S from '../gen/S05.jsx'
import { useLanding } from '../store.js'

export default function I05({ t, L }) {
  const v = useLanding(L)
  return <S v={v} t={t} />
}
