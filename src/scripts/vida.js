// ─────────────────────────────────────────────────────────────────────────────
// VIDA del sitio (portado de LandingLogic.jsx del prototipo, sin React):
//  · ojos que siguen al puntero ([data-eye] → mueve la pupila hermana) y, en reposo,
//    «vagan» solos; · inclinación hacia el puntero ([data-tilt]).
// Con prefers-reduced-motion no se mueve nada. Coste: un rAF por movimiento y
// solo sobre los elementos visibles en pantalla.
// ─────────────────────────────────────────────────────────────────────────────
const reduce = matchMedia('(prefers-reduced-motion: reduce)')

export function initVida(root = document) {
  if (reduce.matches) return
  let px = null, py = null, last = 0, raf = 0
  const html = document.documentElement

  const aim = () => {
    raf = 0
    if (px === null) return
    const vh = innerHeight
    for (const el of root.querySelectorAll('[data-eye]')) {
      const p = el.nextElementSibling
      if (!p) continue
      const r = el.getBoundingClientRect()
      if (r.bottom < -40 || r.top > vh + 40 || r.width === 0) continue
      const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1
      const mx = parseFloat(el.getAttribute('data-eye')) || 3
      const f = Math.min(1, d / 240)
      p.style.transform = `translate(${((dx / d) * mx * f).toFixed(2)}px,${((dy / d) * mx * f * 0.9).toFixed(2)}px)`
    }
    for (const g of root.querySelectorAll('[data-tilt]')) {
      const r = g.getBoundingClientRect()
      if (r.bottom < -40 || r.top > vh + 40 || r.width === 0) continue
      const rot = Math.max(-7, Math.min(7, (px - (r.left + r.width / 2)) / 60))
      const ty = Math.max(-2, Math.min(2, (py - (r.top + r.height / 2)) / 120))
      g.style.transform = `rotate(${rot.toFixed(2)}deg) translateY(${ty.toFixed(2)}px)`
    }
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(aim) }
  const onMove = (e) => {
    px = e.clientX; py = e.clientY; last = Date.now()
    if (html.hasAttribute('data-idle')) html.removeAttribute('data-idle')
    queue()
  }
  addEventListener('pointermove', onMove, { passive: true })
  addEventListener('pointerdown', onMove, { passive: true })
  addEventListener('scroll', queue, { passive: true })
  // En reposo los ojos miran a puntos al azar (como en el prototipo), solo con la pestaña visible.
  setInterval(() => {
    if (document.hidden || Date.now() - last < 2600) return
    html.setAttribute('data-idle', '')
    px = innerWidth * (0.1 + Math.random() * 0.8)
    py = innerHeight * (0.1 + Math.random() * 0.8)
    queue()
  }, 1700)
}
