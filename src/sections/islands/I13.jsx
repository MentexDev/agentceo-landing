// Isla de la sección S13 (se hidrata al hacerse visible). Estado compartido: ../store.js
import S from '../gen/S13.jsx'
import { useLanding } from '../store.js'

export default function I13({ t, L }) {
  const v = useLanding(L)
  return <S v={v} t={t} />
}
