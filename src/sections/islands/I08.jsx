// Isla de la sección S08 (se hidrata al hacerse visible). Estado compartido: ../store.js
import S from '../gen/S08.jsx'
import { useLanding } from '../store.js'

export default function I08({ t, L }) {
  const v = useLanding(L)
  return <S v={v} t={t} />
}
