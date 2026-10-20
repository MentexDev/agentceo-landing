// Selector de idioma: Escape (devolviendo el foco), clic fuera y cookie `lang` (solo con consentimiento funcional).
import { functionalAllowed } from '../consent.js'

export function initLangSwitch() {
  for (const d of document.querySelectorAll('[data-lang-switch]')) {
    const sum = d.querySelector('summary')
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && d.open) { d.open = false; sum.focus() } })
    document.addEventListener('click', (e) => { if (d.open && !d.contains(e.target)) d.open = false })
    for (const a of d.querySelectorAll('[data-set-lang]')) {
      a.addEventListener('click', () => {
        if (!functionalAllowed()) return
        const secure = location.protocol === 'https:' ? '; Secure' : ''
        document.cookie = `lang=${a.dataset.setLang}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
      })
    }
  }
}
