// Isla de la sección S09 (se hidrata al hacerse visible). Estado compartido: ../store.js
import S from '../gen/S09.jsx'
import { useLanding } from '../store.js'

export default function I09({ t, L }) {
  const v = useLanding(L)
  return <S v={v} t={t} />
}
