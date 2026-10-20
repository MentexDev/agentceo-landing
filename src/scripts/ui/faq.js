// S18 · FAQ: una respuesta a la vez (aria-expanded) y la cara del CEO «hablando».
export function initFaq() {
  for (const sec of document.querySelectorAll('[data-faq]')) {
    const qs = [...sec.querySelectorAll('[data-faq-q]')]
    const as = [...sec.querySelectorAll('[data-faq-answer]')]
    const face = sec.querySelector('[data-faq-face]')
    const show = (i) => {
      qs.forEach((b, k) => {
        const on = k === i
        b.setAttribute('aria-expanded', String(on))
        b.classList.toggle('fqa', on)
        b.classList.toggle('fqb', !on)
      })
      as.forEach((a, k) => a.toggleAttribute('data-open', k === i))
      // Reinicia la animación de «escribiendo» y la cara que habla, como en el prototipo.
      face.classList.remove('faq-talk')
      void face.offsetWidth
      face.classList.add('faq-talk')
    }
    qs.forEach((b, i) => b.addEventListener('click', () => show(i)))
  }
}
