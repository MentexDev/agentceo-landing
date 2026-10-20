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
}
