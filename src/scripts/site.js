// ─────────────────────────────────────────────────────────────────────────────
// PUNTO DE ENTRADA ÚNICO del JS del sitio (lo carga Base.astro en todas las páginas).
// Antes cada componente tenía su <script> → 11 módulos sueltos pedidos antes del primer
// pintado, cada uno con la latencia de una red 4G lenta (medido con Lighthouse 13 móvil).
// Cada init es idempotente y no hace nada si su pieza no está en la página.
// ─────────────────────────────────────────────────────────────────────────────
import { initVida, initReveal, initCarousels, initCeoTap } from './vida.js'
import { initHeader } from './ui/header.js'
import { initLangSwitch } from './ui/langswitch.js'
import { initWaitlist } from './waitlist.js'
import { initChatLoader } from './ui/chatloader.js'
import { initCookiePanel } from './ui/cookiepanel.js'
import { initFaq } from './ui/faq.js'

initHeader()
initLangSwitch()
initWaitlist()
initChatLoader()
initCookiePanel()
initFaq()
initVida()
initReveal()
initCarousels()
initCeoTap()
