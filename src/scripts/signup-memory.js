// ─────────────────────────────────────────────────────────────────────────────
// RECORDAR A QUIEN YA SE APUNTÓ (T60). Tras un alta con éxito (cualquier formulario, incluida la tarjeta del
// chat) se guarda:
//   · localStorage `ac_wl` = '1'  y  `ac_wlm` = correo ENMASCARADO («j***@g***.com», nunca el correo entero);
//   · cookie propia `ac_wl` = '1.<enmascarado>' (12 meses, SameSite=Lax), por si se limpia el almacenamiento.
// Categoría FUNCIONAL (no «estrictamente necesaria»): recuerda algo a petición de la persona para no volver a
// pedirle el correo. Respeta el consentimiento existente: con lo funcional apagado no se escribe nada, y
// consent.js lo borra al apagarlo. Inventario legal: src/data/storage.js (→ /legal/cookies).
// ─────────────────────────────────────────────────────────────────────────────
import { ls } from './storage.js'
import { functionalAllowed } from './consent.js'
import { maskEmail } from '../../worker/email/mask.js'

const KEY = 'ac_wl'
const MASK = 'ac_wlm'
const MASKED = /^[a-z0-9]\*{3}@[a-z0-9]?\*{3}(\.[a-z0-9-]{1,12}){0,3}$/i

const readCookie = () => {
  try {
    const m = /(?:^|;\s*)ac_wl=1(?:\.([^;]*))?/.exec(document.cookie)
    return m ? { on: true, masked: m[1] ? decodeURIComponent(m[1]) : '' } : { on: false, masked: '' }
  } catch { return { on: false, masked: '' } }
}

/** Tras un alta con éxito. */
export function rememberSignup(email) {
  if (!functionalAllowed()) return
  const masked = maskEmail(email)
  ls.set(KEY, '1')
  ls.set(MASK, masked)
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `ac_wl=1.${encodeURIComponent(masked)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
  } catch {}
}

/** { signedUp, masked } desde localStorage o, si se limpió, la cookie. `masked` solo si tiene la forma esperada. */
export function signupState() {
  const c = readCookie()
  const signedUp = ls.get(KEY) === '1' || c.on
  const m = ls.get(MASK) || c.masked || ''
  return { signedUp, masked: signedUp && MASKED.test(m) ? m : '' }
}
