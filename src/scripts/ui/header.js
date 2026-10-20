// Header: sombra al hacer scroll y menú móvil (<details>): Escape, clic fuera, etiqueta accesible.
export function initHeader() {
  const header = document.querySelector('[data-header]')
  if (header) {
    const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 8)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
  }
  for (const d of document.querySelectorAll('[data-mobile-menu]')) {
    const sum = d.querySelector('summary')
    const sync = () => {
      sum.setAttribute('aria-label', d.open ? sum.dataset.labelClose : sum.dataset.labelOpen)
      document.documentElement.toggleAttribute('data-menu-open', d.open)
    }
    d.addEventListener('toggle', sync)
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && d.open) { d.open = false; sum.focus() } })
    document.addEventListener('click', (e) => { if (d.open && !d.contains(e.target)) d.open = false })
    // Un enlace a un ancla de la misma página cierra el menú.
    for (const a of d.querySelectorAll('a')) a.addEventListener('click', () => { d.open = false })
  }
}
