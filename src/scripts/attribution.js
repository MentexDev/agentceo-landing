// ATRIBUCIÓN de primer toque (UTM, click id, ref, página de entrada).
// Vive en sessionStorage: dura lo que la pestaña y SOLO sale del navegador si la
// persona envía el formulario de la lista. No es seguimiento entre sesiones ni
// entre sitios (por eso no necesita consentimiento previo de cookies).
import { UTM_KEYS, CLICK_KEYS } from '../data/waitlist.js'

const KEY = 'ac_attr'

/** Función PURA (testeada): extrae la atribución de una URL. */
export function parseAttribution(search = '', path = '/', referrer = '') {
  const q = new URLSearchParams(search)
  const out = {}
  for (const k of UTM_KEYS) {
    const v = q.get(k)
    if (v) out[k] = v.slice(0, 150)
  }
  for (const k of CLICK_KEYS) {
    const v = q.get(k)
    if (v && !out.click_id) out.click_id = `${k}:${v}`.slice(0, 200)
  }
  const ref = q.get('ref')
  if (ref) out.ref = ref.slice(0, 100)
  out.landing_path = String(path).slice(0, 300)
  // El referrer externo solo como origen (sin ruta ni query: pueden llevar datos personales).
  try {
    if (referrer) out.referrer = new URL(referrer).origin
  } catch {}
  return out
}

/** Guarda el primer toque de la sesión (no lo pisa si ya existe). */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return
    const a = parseAttribution(location.search, location.pathname, document.referrer)
    // Un referrer del propio sitio no es una fuente.
    if (a.referrer === location.origin) delete a.referrer
    sessionStorage.setItem(KEY, JSON.stringify(a))
  } catch {}
}

export function getAttribution() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}
