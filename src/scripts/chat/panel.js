// ─────────────────────────────────────────────────────────────────────────────
// Panel del widget «Tu CEO». Se carga en el primer uso (ver ChatWidget.astro).
// · Streaming SSE desde /api/chat · markdown seguro · chips y preguntas sugeridas
// · lista de espera DENTRO del chat (mismo formulario y mismo endpoint que el resto)
// · conversación guardada en localStorage (30 mensajes, 7 días, sin correos)
// · accesible: diálogo no modal, Escape, foco gestionado, anuncio al TERMINAR cada respuesta
// ─────────────────────────────────────────────────────────────────────────────
import { renderMd } from './md.js'
import { track } from '../track.js'
import { enhanceForm } from '../waitlist.js'
import { ls } from '../storage.js'

const KEY = 'ac_chat'
const TTL = 7 * 24 * 3600 * 1000
const MAX_STORED = 30
const MAX_CHARS = 500
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export function initPanel(root) {
  if (root.__panel) return root.__panel
  const lang = root.dataset.lang
  const S = JSON.parse(root.querySelector('[data-chat-i18n]').textContent)
  const panel = root.querySelector('[data-chat-panel]')
  const launch = root.querySelector('[data-chat-launch]')
  const log = root.querySelector('[data-chat-log]')
  const form = root.querySelector('[data-chat-form]')
  const input = root.querySelector('[data-chat-input]')
  const send = root.querySelector('[data-chat-send]')
  const count = root.querySelector('[data-chat-count]')
  const suggest = root.querySelector('[data-chat-suggest]')
  const announce = root.querySelector('[data-chat-announce]')
  const sizeBtn = root.querySelector('[data-chat-size]')
  const fullBtn = root.querySelector('[data-chat-full]')
  const tease = root.querySelector('[data-chat-tease]')
  const tpl = root.querySelector('[data-chat-wl-tpl]')
  let msgs = [] // { role: 'user'|'assistant', content, meta? }
  let busy = false
  // Un fallo (red, aborto al recargar a mitad de respuesta…) NUNCA borra la pregunta del
  // historial: queda guardada y se ofrece «Reintentar» (bug medido en WebKit, donde el aborto
  // de la recarga llega antes que pagehide).
  let cardN = 0

  // ── Persistencia ────────────────────────────────────────────────────────
  const save = () => {
    ls.set(KEY, JSON.stringify({ v: 1, t: Date.now(), lang, msgs: msgs.slice(-MAX_STORED) }))
  }
  const load = () => {
    try {
      const d = JSON.parse(ls.get(KEY) || 'null')
      if (d?.v === 1 && d.lang === lang && Date.now() - d.t < TTL && Array.isArray(d.msgs)) return d.msgs
    } catch {}
    return []
  }

  // ── Pintado ─────────────────────────────────────────────────────────────
  const scroll = () => { log.scrollTop = log.scrollHeight }
  const joined = () => ls.get('ac_wl') === '1'

  function bubble(role, html) {
    const el = document.createElement('div')
    el.className = `cw-msg ${role === 'user' ? 'cw-user' : 'cw-bot'}`
    el.innerHTML = html
    log.append(el)
    scroll()
    return el
  }
  const userHtml = (text) => `<p>${esc(text)}</p>`
  function botHtml(content, meta) {
    const m = meta?.matched
    const head = m ? `<span class="cw-matched">${esc(S.matched)} «${esc(m.title)}»</span>` : ''
    const src = m?.url && /^\/(?!\/)/.test(m.url) ? `<a class="cw-src" href="${esc(m.url)}">${esc(S.source)} →</a>` : ''
    return head + renderMd(content) + src
  }
  function chipsRow(chips = []) {
    if (!chips.length) return
    const row = document.createElement('div')
    row.className = 'cw-chips-row'
    for (const c of chips) {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'cw-chip'
      b.textContent = c
      b.dataset.chatAsk = c
      row.append(b)
    }
    log.append(row)
    scroll()
  }
  function waitlistCard() {
    if (joined() || log.querySelector('.cw-card form:not([data-done])')) return
    const node = tpl.content.firstElementChild.cloneNode(true)
    const n = ++cardN
    // IDs únicos por tarjeta (la plantilla solo existe una vez).
    for (const el of node.querySelectorAll('[id]')) el.id = `${el.id}-${n}`
    for (const el of node.querySelectorAll('[for]')) el.htmlFor = `${el.htmlFor}-${n}`
    for (const el of node.querySelectorAll('[aria-describedby]')) el.setAttribute('aria-describedby', el.getAttribute('aria-describedby').split(' ').map((x) => `${x}-${n}`).join(' '))
    const f = node.querySelector('form')
    f.setAttribute('data-no-modal', '')
    log.append(node)
    enhanceForm(f)
    track('chat_waitlist_shown', {})
    scroll()
  }
  function renderAll() {
    log.innerHTML = ''
    bubble('assistant', renderMd(S.hello))
    for (const m of msgs) {
      bubble(m.role, m.role === 'user' ? userHtml(m.content) : botHtml(m.content, m.meta))
    }
    suggest.hidden = msgs.length > 0
    const last = msgs[msgs.length - 1]
    if (last?.role === 'assistant') {
      chipsRow(last.meta?.chips)
      if (last.meta?.cta === 'waitlist') waitlistCard()
    } else if (last?.role === 'user') {
      showError('errNet') // la respuesta se perdió (p. ej. recarga a mitad): «Reintentar»
    }
  }

  // ── Conversación ────────────────────────────────────────────────────────
  async function ask(text, { retry = false } = {}) {
    text = String(text || '').trim().slice(0, MAX_CHARS)
    if (!text || busy) return
    busy = true
    send.disabled = true
    suggest.hidden = true
    log.querySelectorAll('.cw-chips-row, .cw-err').forEach((r) => r.remove())
    if (!retry) {
      msgs.push({ role: 'user', content: text })
      bubble('user', userHtml(text))
      save()
    }
    track('chat_message', { turn: msgs.filter((m) => m.role === 'user').length, retry })

    const typing = bubble('assistant', '<span class="cw-typing" aria-label="' + esc(S.typing) + '"><span></span><span></span><span></span></span>')
    let content = '', meta = null, el = null
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locale: lang, page: location.pathname, messages: msgs.map(({ role, content }) => ({ role, content })) }),
      })
      if (!res.ok || !res.body) {
        let code = ''
        try { code = (await res.json()).error } catch {}
        throw new Error(res.status === 404 ? 'off' : code === 'daily_limit' ? 'daily' : res.status === 429 ? 'rate' : 'net')
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        let i
        while ((i = buf.indexOf('\n\n')) >= 0) {
          const block = buf.slice(0, i)
          buf = buf.slice(i + 2)
          const ev = /event: (\w+)/.exec(block)?.[1]
          let data = {}
          try { data = JSON.parse(/data: (.*)/.exec(block)?.[1] || '{}') } catch {}
          if (ev === 'meta') meta = data
          else if (ev === 'delta') {
            content += data.t || ''
            if (!el) { typing.remove(); el = bubble('assistant', '') }
            el.innerHTML = botHtml(content, meta)
            scroll()
          } else if (ev === 'error') throw new Error('net')
        }
      }
      if (!content) throw new Error('net')
      msgs.push({ role: 'assistant', content, meta })
      save()
      announce.textContent = S.answered.replace('{text}', content.replace(/\*\*|\[|\]\([^)]*\)/g, ''))
      track('chat_answer', { kind: meta?.kind || 'unknown', mode: meta?.mode || 'unknown' })
      if (meta?.kind === 'fallback') track('chat_fallback', {})
      chipsRow(meta?.chips)
      if (meta?.cta === 'waitlist') waitlistCard()
    } catch (e) {
      typing.remove()
      if (el) el.remove()
      showError({ off: 'errOff', daily: 'errDaily', rate: 'errRate' }[e.message] || 'errNet')
      track('chat_error', { error: e.message })
    } finally {
      busy = false
      send.disabled = false
      scroll()
    }
  }

  /** Error con botón «Reintentar» (reenvía la última pregunta sin duplicarla). */
  function showError(key) {
    const box = document.createElement('div')
    box.className = 'cw-err'
    box.setAttribute('role', 'alert')
    box.append(S[key])
    if (key === 'errNet' || key === 'errRate') {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'cw-chip cw-retry'
      b.textContent = S.retry
      b.addEventListener('click', () => {
        const last = [...msgs].reverse().find((m) => m.role === 'user')
        if (last) ask(last.content, { retry: true })
      })
      box.append(document.createElement('br'), b)
    }
    log.append(box)
    if (key === 'errOff' || key === 'errDaily') waitlistCard()
    scroll()
  }

  // ── Tamaño ──────────────────────────────────────────────────────────────
  function setSize(size) {
    panel.dataset.size = size
    const large = size === 'large'
    sizeBtn.setAttribute('aria-label', large ? S.shrink : S.expand)
    sizeBtn.title = large ? S.shrink : S.expand
    fullBtn.setAttribute('aria-pressed', String(size === 'full'))
    fullBtn.setAttribute('aria-label', size === 'full' ? S.exitFullscreen : S.fullscreen)
    fullBtn.title = fullBtn.getAttribute('aria-label')
    track('chat_size', { size })
    scroll()
  }
  sizeBtn.addEventListener('click', () => setSize(panel.dataset.size === 'large' ? 'compact' : 'large'))
  fullBtn.addEventListener('click', () => setSize(panel.dataset.size === 'full' ? 'compact' : 'full'))

  // ── Abrir / cerrar ──────────────────────────────────────────────────────
  const mobile = () => matchMedia('(max-width: 640px)').matches
  function open(source = 'launcher') {
    if (!panel.hidden) return
    if (tease) tease.hidden = true
    panel.hidden = false
    launch.setAttribute('aria-expanded', 'true')
    if (mobile()) document.documentElement.setAttribute('data-chat-open', '')
    renderAll()
    input.focus()
    track('chat_open', { source })
  }
  function close() {
    if (panel.hidden) return
    panel.hidden = true
    panel.removeAttribute('data-dragging')
    panel.style.transform = ''
    launch.setAttribute('aria-expanded', 'false')
    document.documentElement.removeAttribute('data-chat-open')
    launch.focus()
    track('chat_close', { turns: msgs.filter((m) => m.role === 'user').length })
  }
  root.querySelector('[data-chat-close]').addEventListener('click', close)
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close() }
  })
  root.querySelector('[data-chat-reset]').addEventListener('click', () => {
    msgs = []
    save()
    renderAll()
    input.focus()
    track('chat_reset', {})
  })

  // ── Entrada ─────────────────────────────────────────────────────────────
  function updateCount() {
    const n = input.value.length
    count.textContent = n > MAX_CHARS * 0.8 ? `${n}/${MAX_CHARS}` : ''
    input.style.height = 'auto'
    input.style.height = `${Math.min(120, input.scrollHeight)}px`
  }
  input.addEventListener('input', updateCount)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit() }
  })
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const v = input.value
    input.value = ''
    updateCount()
    ask(v)
  })
  panel.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-chat-ask]')
    if (!chip) return
    track('chat_suggestion_click', {})
    ask(chip.dataset.chatAsk)
  })
  // Al apuntarse desde el chat, el CEO lo celebra (y no vuelve a ofrecer la tarjeta).
  log.addEventListener('wl:joined', () => {
    msgs.push({ role: 'assistant', content: S.joinedMsg, meta: { kind: 'joined' } })
    save()
    setTimeout(() => { bubble('assistant', renderMd(S.joinedMsg)); announce.textContent = S.joinedMsg }, 350)
  })

  // ── Hoja móvil: arrastrar hacia abajo para cerrar ───────────────────────
  const grab = root.querySelector('[data-chat-grab]')
  let y0 = null, dy = 0
  grab.addEventListener('pointerdown', (e) => { y0 = e.clientY; dy = 0; panel.setAttribute('data-dragging', ''); grab.setPointerCapture(e.pointerId) })
  grab.addEventListener('pointermove', (e) => {
    if (y0 === null) return
    dy = Math.max(0, e.clientY - y0)
    panel.style.transform = `translateY(${dy}px)`
  })
  const end = () => {
    if (y0 === null) return
    y0 = null
    panel.removeAttribute('data-dragging')
    if (dy > 120) close()
    panel.style.transform = ''
  }
  grab.addEventListener('pointerup', end)
  grab.addEventListener('pointercancel', end)

  msgs = load()
  root.__panel = { open, close, ask }
  return root.__panel
}
