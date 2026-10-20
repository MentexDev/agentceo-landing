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

// ── Aparición al hacer scroll ([data-rv] → data-in) y arranque ([data-ready]) ───────
// Sustituye al cálculo por scroll del prototipo con IntersectionObserver (sin trabajo
// en cada scroll). Con motion reducido todo aparece ya visible.
export function initReveal(root = document) {
  const html = document.documentElement
  const els = root.querySelectorAll('[data-rv]:not([data-in])')
  if (reduce.matches || !('IntersectionObserver' in window)) {
    els.forEach((e) => e.setAttribute('data-in', ''))
    html.setAttribute('data-ready', '')
    return
  }
  // Dentro de un carrusel horizontal el contenedor RECORTA la intersección (overflow): se
  // observa el carrusel y, al entrar en pantalla, aparecen todas sus tarjetas (como en el
  // prototipo, que solo miraba la posición vertical).
  const groups = new Map()
  for (const e of els) {
    const target = e.closest('.hs, .hs-d, .faqstrip') || e
    if (!groups.has(target)) groups.set(target, [])
    groups.get(target).push(e)
  }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue
      for (const e of groups.get(en.target) || []) e.setAttribute('data-in', '')
      io.unobserve(en.target)
    }
  }, { rootMargin: '0px 0px -10% 0px' })
  groups.forEach((_, target) => io.observe(target))
  setTimeout(() => html.setAttribute('data-ready', ''), 80)
}

// ── Carruseles horizontales .hs del prototipo (flechas [data-hs] + avance solo) ──
export function initCarousels(root = document) {
  const hold = (el) => { el.__hold = true; clearTimeout(el.__ht); el.__ht = setTimeout(() => { el.__hold = false }, 7000) }
  const step = (el, dir) => {
    const w = el.clientWidth + 12
    if (dir > 0 && el.scrollLeft >= el.scrollWidth - el.clientWidth - 8) el.scrollTo({ left: 0, behavior: 'smooth' })
    else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' })
    else el.scrollBy({ left: dir * w, behavior: 'smooth' })
  }
  for (const el of root.querySelectorAll('.hs:not(.hs-d)')) {
    el.addEventListener('touchstart', () => hold(el), { passive: true })
    el.addEventListener('pointerdown', () => hold(el))
    el.addEventListener('focusin', () => hold(el))
  }
  // Pausa/reproducir (WCAG 2.2.2): el botón [data-hs-play] de cada barra de flechas. Móvil ('m'):
  // su carrusel es el hermano siguiente de la barra; escritorio ('d', S11): el .hs-d de la sección,
  // cuyo autoplay (store.js) también mira __paused. La pausa es firme: solo la quita el botón.
  root.addEventListener('click', (e) => {
    const b = e.target.closest?.('[data-hs-play]')
    if (!b) return
    const el = b.getAttribute('data-hs-play') === 'd' ? b.closest('section')?.querySelector('.hs-d') : b.closest('.hsctl')?.nextElementSibling
    if (!el) return
    el.__paused = !el.__paused
    const label = b.getAttribute(el.__paused ? 'data-l-play' : 'data-l-pause')
    b.setAttribute('aria-pressed', String(el.__paused))
    b.setAttribute('aria-label', label)
    b.setAttribute('title', label)
  })
  root.addEventListener('click', (e) => {
    const b = e.target.closest?.('[data-hs]')
    if (!b) return
    const el = b.parentElement?.nextElementSibling
    if (!el?.classList.contains('hs')) return
    hold(el)
    step(el, parseInt(b.getAttribute('data-hs'), 10) || 1)
  })
  if (reduce.matches) return
  setInterval(() => {
    if (document.hidden) return
    for (const el of root.querySelectorAll('.hs:not(.hs-d)')) {
      if (el.__hold || el.__paused || el.scrollWidth <= el.clientWidth + 4) continue
      const r = el.getBoundingClientRect()
      if (r.bottom < 80 || r.top > innerHeight - 80) continue
      step(el, 1)
    }
  }, 3400)
}

// ── Toque a la mascota en las secciones estáticas (S02, S19) ───────────────────
export function initCeoTap(root = document) {
  let msgs = []
  try { msgs = JSON.parse(document.getElementById('ceo-msgs')?.textContent || '[]') } catch {}
  let n = 0, timer = 0
  root.addEventListener('click', (e) => {
    const b = e.target.closest?.('[data-ceo-tap]')
    if (!b) return
    n++
    const sec = b.closest('section') || document
    const msg = sec.querySelector('[data-ceo-msg]')
    if (msg && msgs.length) msg.textContent = msgs[n % msgs.length]
    const masc = b.querySelector('.mascot') || b
    masc.classList.remove('happy', 'ceo-happy')
    void masc.getBoundingClientRect()
    masc.classList.add('happy', 'ceo-happy')
    clearTimeout(timer)
    timer = setTimeout(() => masc.classList.remove('happy', 'ceo-happy'), 900)
  })
}
