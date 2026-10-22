// ─────────────────────────────────────────────────────────────────────────────
// CONSENTIMIENTO y señal GPC. Cookie propia `consent` (12 meses):
//   consent=v1.f1.a0.d0   → f: funcional · a: analítica · d: no vender ni compartir
// · Analítica: NO HAY proveedor (decisión de Diego 2026-10-20). `a` siempre 0 mientras
//   ANALYTICS_PROVIDERS esté vacío; el panel lo explica.
// · GPC (navigator.globalPrivacyControl): fuerza d=1 y a=0, sin preguntar.
// · Funcional desactivado → la web deja de guardar en el navegador (ver storage.js).
// ─────────────────────────────────────────────────────────────────────────────
export const ANALYTICS_PROVIDERS = []
const NAME = 'consent'
const DEFAULT = { f: 1, a: 0, d: 0 }

export const gpc = () => {
  try { return navigator.globalPrivacyControl === true } catch { return false }
}

export function readConsent() {
  let v = { ...DEFAULT, set: false }
  try {
    const m = /(?:^|;\s*)consent=v1\.f(\d)\.a(\d)\.d(\d)/.exec(document.cookie)
    if (m) v = { f: +m[1], a: +m[2], d: +m[3], set: true }
  } catch {}
  if (gpc()) { v.d = 1; v.a = 0; v.gpc = true }
  if (!ANALYTICS_PROVIDERS.length) v.a = 0
  return v
}

export function writeConsent({ f, a, d }) {
  const v = { f: f ? 1 : 0, a: a && ANALYTICS_PROVIDERS.length && !gpc() ? 1 : 0, d: d || gpc() ? 1 : 0 }
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${NAME}=v1.f${v.f}.a${v.a}.d${v.d}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
  if (!v.f) {
    // Funcional desactivado: se borra lo que la web había guardado.
    try {
      for (const k of Object.keys(localStorage)) if (k.startsWith('ac_') || k.startsWith('agentceo_lead_')) localStorage.removeItem(k)
      for (const k of Object.keys(sessionStorage)) if (k.startsWith('ac_')) sessionStorage.removeItem(k)
    } catch {}
    document.cookie = `lang=; Path=/; Max-Age=0; SameSite=Lax${secure}`
    document.cookie = `ac_wl=; Path=/; Max-Age=0; SameSite=Lax${secure}` // T60: «ya me apunté» (funcional)
  }
  window.dispatchEvent(new CustomEvent('ac:consent', { detail: v }))
  return v
}

export const functionalAllowed = () => readConsent().f === 1
export const analyticsAllowed = () => readConsent().a === 1
