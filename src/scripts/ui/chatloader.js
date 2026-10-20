// Cargador mínimo del widget: el panel (y su código) se descargan en el primer uso.
import { ss } from '../storage.js'

export function initChatLoader() {
  const root = document.querySelector('[data-chat-root]')
  if (!root) return
  let loading = null
  const load = () => (loading ||= import('../chat/panel.js').then((m) => m.initPanel(root)))
  root.addEventListener('click', async (e) => {
    const opener = e.target.closest('[data-chat-open]')
    if (!opener) return
    const api = await load()
    api.open(opener.dataset.chatSource || 'launcher')
  })
  // Precarga en reposo para que el primer clic sea instantáneo.
  window.requestIdleCallback?.(() => setTimeout(() => import('../chat/panel.js'), 2500))
  // Burbuja de invitación: una vez por sesión, a los 8 s, si nadie abrió el chat.
  const tease = root.querySelector('[data-chat-tease]')
  if (!ss.get('ac_tease')) {
    setTimeout(() => {
      if (root.querySelector('[data-chat-launch]')?.getAttribute('aria-expanded') === 'true') return
      tease.hidden = false
      ss.set('ac_tease', '1')
    }, 8000)
  }
  root.querySelector('[data-chat-tease-close]')?.addEventListener('click', () => { tease.hidden = true })
  initAvoid(root)
}

// NO TAPAR CONTENIDO (T33, Diego: el lanzador tapaba la esquina del acta). Cuando un bloque marcado
// con [data-chat-avoid] pasa por la franja inferior de la pantalla (donde vive el lanzador), el
// lanzador se compacta a su círculo (con la insignia IA: sigue diciendo que es una IA) y la burbuja
// de invitación se esconde. Al salir de la franja, vuelve. Sin JS no hay lanzador que compactar.
function initAvoid(root) {
  const els = document.querySelectorAll('[data-chat-avoid]')
  if (!els.length || !('IntersectionObserver' in window)) return
  const hits = new Set()
  let io = null
  // La franja va desde lo más alto que ocupe el widget (lanzador o burbuja visible) hasta abajo,
  // con 16 px de margen. Medida a tamaño completo: se calcula antes de compactar.
  const bandTop = () => {
    const wasCompact = root.hasAttribute('data-compact')
    root.removeAttribute('data-compact')
    const tops = [...root.querySelectorAll('.cw-launch, .cw-tease:not([hidden])')].map((e) => e.getBoundingClientRect().top).filter((t) => t > 0)
    if (wasCompact) root.setAttribute('data-compact', '')
    return Math.max(0, (tops.length ? Math.min(...tops) : innerHeight - 150) - 16)
  }
  const watch = () => {
    io?.disconnect()
    hits.clear()
    io = new IntersectionObserver((entries) => {
      for (const en of entries) en.isIntersecting ? hits.add(en.target) : hits.delete(en.target)
      if (hits.size) root.setAttribute('data-compact', '')
      else root.removeAttribute('data-compact')
    }, { rootMargin: `-${Math.round(bandTop())}px 0px 0px 0px` })
    els.forEach((e) => io.observe(e))
  }
  watch()
  let t = 0
  const later = () => { clearTimeout(t); t = setTimeout(watch, 200) }
  addEventListener('resize', later)
  // La burbuja aparece a los 8 s y es más alta que el lanzador: la franja crece con ella. Se mide
  // al ACABAR su animación de entrada (medido el 20-oct: medir al aparecer daba una franja corta y la
  // burbuja tapaba el acta a 1920×1080). Lo mismo con la entrada del lanzador.
  new MutationObserver(later).observe(root.querySelector('[data-chat-tease]'), { attributes: true, attributeFilter: ['hidden'] })
  root.addEventListener('animationend', later)
  // Con la barra fija de la lista visible, el widget SUBE para no taparla (ChatWidget.astro): la
  // franja se vuelve a medir cuando la barra aparece o se va, y al acabar la transición de subida.
  const sticky = document.querySelector('[data-wl-sticky]')
  if (sticky) new MutationObserver(later).observe(sticky, { attributes: true, attributeFilter: ['hidden'] })
  root.addEventListener('transitionend', later)
}
