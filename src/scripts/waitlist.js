// ─────────────────────────────────────────────────────────────────────────────
// Lista de espera · mejora progresiva de TODOS los formularios [data-waitlist],
// el modal de 3 pasos, el CTA fijo móvil y el exit-intent de escritorio.
//
// Reglas:
//  · El éxito SOLO se muestra si el Worker responde ok (el prototipo lo simulaba).
//  · Ningún dato personal se guarda en el navegador: solo el indicador «ya me apunté».
//  · Sin JS todo sigue funcionando (POST normal → /gracias/).
// ─────────────────────────────────────────────────────────────────────────────
import { captureAttribution, getAttribution } from './attribution.js'
import { track } from './track.js'

const JOINED = 'ac_wl'          // localStorage: '1' si ya se apuntó (sin el correo)
const STICKY_OFF = 'ac_sticky'  // sessionStorage: CTA fijo cerrado en esta sesión
const EXIT_SHOWN = 'ac_exit'    // sessionStorage: exit-intent ya mostrado
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const t0 = performance.now()

let msgs = {}
let lastEmail = '' // en memoria: solo para el paso 2 del modal de ESTA página
let modal = null

const store = {
  get: (s, k) => { try { return s.getItem(k) } catch { return null } },
  set: (s, k, v) => { try { s.setItem(k, v) } catch {} },
}
const joined = () => store.get(localStorage, JOINED) === '1'

async function send(payload) {
  const res = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  let data = {}
  try { data = await res.json() } catch {}
  if (res.ok && data.ok) return { ok: true }
  return { ok: false, error: data.error || (res.status === 429 ? 'rate_limited' : 'server_error') }
}

const errText = (code) => (code === 'invalid_email' ? msgs.invalid : code === 'rate_limited' ? msgs.rate : msgs.server)

function setBusy(form, busy) {
  form.setAttribute('aria-busy', String(busy))
  const btn = form.querySelector('button[type=submit]')
  if (!btn) return
  btn.disabled = busy
  const txt = btn.querySelector('.wl-btn-txt')
  if (txt) txt.textContent = busy ? btn.dataset.busy : btn.dataset.label
}

/** Marca un formulario inline como completado (sin perder el aviso ni la nota). */
function markDone(form, text) {
  form.setAttribute('data-done', '')
  const ok = form.querySelector('[data-wl-ok]')
  if (ok) {
    ok.querySelector('[data-wl-ok-text]').textContent = text
    ok.hidden = false
  }
}

function onJoined(email, source) {
  store.set(localStorage, JOINED, '1')
  lastEmail = email
  hideSticky()
  // Los demás formularios de la página pasan a «ya estás en la lista».
  for (const f of document.querySelectorAll('form[data-waitlist]:not([data-done])')) {
    if (!f.closest('[data-wl-modal]')) markDone(f, msgs.already)
  }
  track('wl_success', { source })
}

function bindForm(form) {
  const input = form.querySelector('input[type=email]')
  const msg = form.querySelector('[data-wl-msg]')
  const source = form.dataset.source || 'landing'
  const inModal = Boolean(form.closest('[data-wl-modal]'))

  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') {
      input.removeAttribute('aria-invalid')
      msg.textContent = ''
    }
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (form.getAttribute('aria-busy') === 'true') return
    const email = input.value.trim()
    msg.textContent = ''
    if (!EMAIL_RE.test(email)) {
      input.setAttribute('aria-invalid', 'true')
      msg.textContent = msgs.invalid
      input.focus()
      track('wl_error', { source, error: 'invalid_email_client' })
      return
    }
    const fd = new FormData(form)
    const payload = {
      ...getAttribution(),
      email,
      company: fd.get('company') || '',
      locale: fd.get('locale'),
      source,
      notice_version: fd.get('notice_version'),
      t: Math.round(performance.now() - t0),
    }
    track('wl_submit', { source })
    setBusy(form, true)
    let r
    try {
      r = await send(payload)
    } catch {
      r = { ok: false, error: 'network' }
    }
    setBusy(form, false)
    if (!r.ok) {
      if (r.error === 'invalid_email') input.setAttribute('aria-invalid', 'true')
      msg.textContent = errText(r.error)
      track('wl_error', { source, error: r.error })
      return
    }
    onJoined(email, source)
    form.dispatchEvent(new CustomEvent('wl:joined', { bubbles: true, detail: { source } }))
    if (form.hasAttribute('data-no-modal')) {
      markDone(form, msgs.success)
    } else if (inModal) {
      goStep('biz')
    } else {
      markDone(form, msgs.success)
      // Como en el prototipo: tras apuntarse desde la página, el modal pide el paso 2.
      openModal({ source, step: 'biz' })
    }
  })
}

// ── Modal ────────────────────────────────────────────────────────────────────
function goStep(step) {
  if (!modal) return
  modal.dataset.step = step
  for (const p of modal.querySelectorAll('[data-step-panel]')) p.hidden = p.dataset.stepPanel !== step
  const mail = modal.querySelector('[data-wl-mail]')
  if (step === 'done' && lastEmail) {
    modal.querySelector('[data-wl-mail-text]').textContent = lastEmail
    mail.hidden = false
  } else if (mail) {
    mail.hidden = true
  }
  const focus = modal.querySelector(`[data-step-panel="${step}"] [data-step-focus]`)
  if (focus) focus.focus()
  else if (step === 'form') modal.querySelector('[data-step-panel="form"] input[type=email]')?.focus()
}

function openModal({ source = 'cta', step, exit = false } = {}) {
  if (!modal) return
  for (const el of modal.querySelectorAll('[data-copy]')) el.hidden = el.dataset.copy !== (exit ? 'exit' : 'default')
  const target = step || (joined() ? 'done' : 'form')
  modal.dataset.source = source
  if (!modal.open) modal.showModal()
  goStep(target)
  track('wl_open', { source, step: target, exit })
}

function bindModal() {
  modal = document.querySelector('[data-wl-modal]')
  if (!modal) return
  for (const b of modal.querySelectorAll('[data-wl-close]')) b.addEventListener('click', () => modal.close())
  // Clic en el fondo (fuera de la tarjeta) cierra.
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close() })
  modal.addEventListener('close', () => track('wl_close', { step: modal.dataset.step }))

  const biz = modal.querySelector('[data-wl-biz]')
  const bizMsg = modal.querySelector('[data-wl-biz-msg]')
  modal.querySelector('[data-wl-skip]').addEventListener('click', () => {
    track('wl_business_skip', {})
    goStep('done')
  })
  biz.addEventListener('submit', async (e) => {
    e.preventDefault()
    const business = new FormData(biz).get('business')
    if (!business || !lastEmail) { goStep('done'); return }
    setBusy(biz, true)
    let r
    try {
      r = await send({ email: lastEmail, business, locale: document.documentElement.lang, source: modal.dataset.source || 'modal', t: Math.round(performance.now() - t0) })
    } catch {
      r = { ok: false, error: 'network' }
    }
    setBusy(biz, false)
    if (!r.ok) { bizMsg.textContent = errText(r.error); return }
    track('wl_business', { business })
    goStep('done')
  })

  // Cualquier enlace/botón [data-open-waitlist] abre el modal (sin JS: va al ancla #acceso).
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('[data-open-waitlist]')
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    openModal({ source: a.dataset.wlSource || 'cta' })
  })
}

// ── CTA fijo móvil ───────────────────────────────────────────────────────────
let sticky = null
function hideSticky() { if (sticky) sticky.hidden = true }
function bindSticky() {
  sticky = document.querySelector('[data-wl-sticky]')
  if (!sticky || joined() || store.get(sessionStorage, STICKY_OFF)) return
  sticky.querySelector('[data-wl-sticky-close]').addEventListener('click', () => {
    store.set(sessionStorage, STICKY_OFF, '1')
    hideSticky()
    track('wl_sticky_dismiss', {})
  })
  // Visible solo cuando NO hay ningún formulario de la lista a la vista y ya se pasó el inicio.
  const forms = [...document.querySelectorAll('form[data-waitlist]')].filter((f) => !f.closest('[data-wl-modal]'))
  const visible = new Set()
  const update = () => {
    if (joined() || store.get(sessionStorage, STICKY_OFF)) return hideSticky()
    sticky.hidden = !(window.scrollY > window.innerHeight * 0.6 && visible.size === 0)
  }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)
    update()
  })
  forms.forEach((f) => io.observe(f))
  addEventListener('scroll', update, { passive: true })
  update()
}

// ── Exit-intent (solo escritorio con ratón, una vez por sesión) ─────────────
function bindExitIntent() {
  if (!matchMedia('(pointer: fine) and (min-width: 1024px)').matches) return
  let armed = false
  setTimeout(() => { armed = true }, 6000)
  document.documentElement.addEventListener('mouseleave', (e) => {
    if (!armed || e.clientY > 0 || joined() || store.get(sessionStorage, EXIT_SHOWN) || modal?.open) return
    store.set(sessionStorage, EXIT_SHOWN, '1')
    openModal({ source: 'exit', exit: true })
  })
}

/** Para formularios insertados después de cargar la página (p. ej. dentro del widget). */
export function enhanceForm(form) {
  if (form.__wl) return
  form.__wl = true
  bindForm(form)
  // Si ya se apuntó en otra visita, el formulario lo dice en vez de volver a pedirlo.
  if (joined() && !form.closest('[data-wl-modal]')) markDone(form, msgs.already)
}

export function initWaitlist() {
  try { msgs = JSON.parse(document.getElementById('wl-i18n').textContent) } catch {}
  captureAttribution()
  for (const f of document.querySelectorAll('form[data-waitlist]')) enhanceForm(f)
  bindModal()
  bindSticky()
  bindExitIntent()
}
