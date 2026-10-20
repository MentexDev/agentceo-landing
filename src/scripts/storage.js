// Almacenamiento del navegador que RESPETA el consentimiento funcional (consent.js).
// Todo lo que la web guarda pasa por aquí (un test lo comprueba).
import { functionalAllowed } from './consent.js'

const safe = (fn, fallback = null) => { try { return fn() } catch { return fallback } }
export const ls = {
  get: (k) => safe(() => localStorage.getItem(k)),
  set: (k, v) => functionalAllowed() && safe(() => localStorage.setItem(k, v)),
  del: (k) => safe(() => localStorage.removeItem(k)),
}
export const ss = {
  get: (k) => safe(() => sessionStorage.getItem(k)),
  set: (k, v) => functionalAllowed() && safe(() => sessionStorage.setItem(k, v)),
}
