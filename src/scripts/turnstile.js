// ─────────────────────────────────────────────────────────────────────────────
// Turnstile en los formularios de la lista de espera (T58).
//
// · Solo existe si el Worker inyectó <meta name="ac-turnstile" content="SITE_KEY"> (las dos claves
//   configuradas). Sin ella, este módulo no hace nada ni carga nada de terceros.
// · El script de Cloudflare se carga async/defer en la PRIMERA interacción con un formulario (foco o toque),
//   nunca en el render: no cuesta nada a quien no se apunta.
// · Un widget por formulario, DENTRO del formulario (también en el modal: un <dialog> está en la capa
//   superior, así que un reto fuera de él quedaría tapado). appearance: interaction-only → invisible salvo
//   que Cloudflare pida interactuar.
// · Cada token es de un solo uso: tras cada envío se pide uno nuevo (el paso 2 del modal lo necesita).
// ─────────────────────────────────────────────────────────────────────────────
const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const WAIT_MS = 12_000

let api = null // Promise<window.turnstile>
const widgets = new WeakMap() // form → { id, token, waiters: [] }

export const siteKey = () => document.querySelector('meta[name="ac-turnstile"]')?.content || ''
export const turnstileOn = () => Boolean(siteKey())

function loadApi() {
  if (api) return api
  api = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile)
    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    s.defer = true
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')))
    s.onerror = () => { api = null; reject(new Error('turnstile')) }
    document.head.appendChild(s)
  })
  return api
}

function settle(w, token) {
  w.token = token
  const ws = w.waiters.splice(0)
  for (const r of ws) r(token)
}

/** Prepara el widget de un formulario (idempotente). Devuelve su estado, o null si Turnstile está apagado. */
export function prime(form) {
  if (!turnstileOn() || !form) return null
  let w = widgets.get(form)
  if (w) return w
  w = { id: null, token: null, waiters: [], failed: false }
  widgets.set(form, w)
  let box = form.querySelector('[data-wl-ts]')
  if (!box) {
    box = document.createElement('div')
    box.className = 'wl-ts'
    box.setAttribute('data-wl-ts', '')
    const anchor = form.querySelector('[data-wl-msg]')
    anchor ? form.insertBefore(box, anchor) : form.appendChild(box)
  }
  loadApi().then((ts) => {
    w.id = ts.render(box, {
      sitekey: siteKey(),
      action: 'waitlist',
      appearance: 'interaction-only',
      language: document.documentElement.lang || 'auto',
      'refresh-expired': 'auto',
      callback: (t) => { w.failed = false; settle(w, t) },
      'expired-callback': () => { w.token = null },
      'error-callback': () => { w.failed = true; settle(w, null) },
    })
  }).catch(() => { w.failed = true; settle(w, null) })
  return w
}

/**
 * El token para enviar AHORA (espera a que llegue, como mucho WAIT_MS). '' si Turnstile está apagado;
 * null si no se pudo obtener (el servidor responderá 403 y el formulario lo explica).
 */
export async function tokenFor(form) {
  const w = prime(form)
  if (!w) return ''
  if (w.token) return w.token
  return new Promise((resolve) => {
    const timer = setTimeout(() => { w.waiters = w.waiters.filter((r) => r !== done); resolve(null) }, WAIT_MS)
    const done = (t) => { clearTimeout(timer); resolve(t) }
    w.waiters.push(done)
  })
}

/** Gasta el token (un solo uso) y pide otro para el siguiente envío del mismo formulario. */
export function consume(form) {
  const w = widgets.get(form)
  if (!w) return
  w.token = null
  try { if (w.id != null) window.turnstile?.reset(w.id) } catch {}
}

/** Prepara el widget en cuanto alguien toca un formulario de la lista (foco, toque o clic). */
export function initTurnstile() {
  if (!turnstileOn()) return
  const onTouch = (e) => {
    const f = e.target.closest?.('form[data-waitlist]')
    if (f) prime(f)
  }
  document.addEventListener('focusin', onTouch)
  document.addEventListener('pointerdown', onTouch, { passive: true })
}
