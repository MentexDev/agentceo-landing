// Panel de preferencias de cookies: lo abren los botones [data-cookie-prefs] (pie, «No vender»).
import { readConsent, writeConsent } from '../consent.js'

export function initCookiePanel() {
  const dlg = document.querySelector('[data-cookie-panel]')
  if (!dlg) return
  const form = dlg.querySelector('[data-cookie-form]')
  const el = (n) => form.elements.namedItem(n)
  const sync = () => {
    const c = readConsent()
    el('f').checked = c.f === 1
    el('d').checked = c.d === 1
    el('d').disabled = Boolean(c.gpc)
    dlg.querySelector('[data-gpc]').hidden = !c.gpc
  }
  for (const b of document.querySelectorAll('[data-cookie-prefs]')) {
    b.hidden = false
    b.addEventListener('click', () => { sync(); dlg.showModal() })
  }
  dlg.addEventListener('close', () => {
    if (dlg.returnValue !== 'save') return
    writeConsent({ f: el('f').checked, a: false, d: el('d').checked })
  })
}
