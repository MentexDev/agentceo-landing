// BUS DE EVENTOS de conversión. Hoy NO hay analítica cargada (decisión de Diego:
// no se carga hasta confirmarla). El bus solo reenvía eventos si hay consentimiento
// de analítica Y un proveedor registrado; si no, los descarta. Nunca lleva el texto
// de un mensaje ni el correo: solo nombres de evento y propiedades de bajo riesgo.
const sinks = []

/** Registra un proveedor (lo hará el cargador de analítica tras el consentimiento). */
export function addSink(fn) {
  sinks.push(fn)
}

import { analyticsAllowed } from './consent.js'
const consented = analyticsAllowed

export function track(name, props = {}) {
  const safe = {}
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'number' || typeof v === 'boolean') safe[k] = v
    else if (typeof v === 'string' && !v.includes('@')) safe[k] = v.slice(0, 80)
  }
  // Para depurar en local y para los tests e2e (no sale del navegador).
  window.dispatchEvent(new CustomEvent('ac:track', { detail: { name, props: safe } }))
  if (!consented()) return
  for (const s of sinks) {
    try { s(name, safe) } catch {}
  }
}
