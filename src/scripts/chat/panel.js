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
import { signupState } from '../signup-memory.js'
// T60: contexto «ya se apuntó» para /api/chat (el servidor lo valida y solo lo usa para no volver a pedir el correo).
const signupContext = () => { const s = signupState(); return s.signedUp ? { signedUp: true, ...(s.masked ? { signedUpEmail: s.masked } : {}) } : {} }
import { ls } from '../storage.js'
import { offlineReply, isGreeting } from './offline.js'

const KEY = 'ac_chat'
const TTL = 7 * 24 * 3600 * 1000
const MAX_STORED = 30
const MAX_CHARS = 500
// Tiempos máximos (T35 · adenda: sin timeout, una respuesta colgada dejaba el widget callado para
// siempre y bloqueaba los mensajes siguientes). Primer dato y cada trozo: 15 s; total: 40 s.
const T_IDLE = 15_000
const T_TOTAL = 40_000
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

  // Id de SESIÓN (adenda T32): aleatorio, sin datos de nadie; el servidor lo usa para los límites
  // por sesión, el dedupe y recordar que esta conversación pasó Turnstile. Vive dentro de ac_chat
  // (misma clave, mismo consentimiento funcional); sin consentimiento, solo en memoria.
  const newSid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}${Math.random()}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 40).padEnd(16, '0')
  let sid = newSid()
  let tsToken = null // token de Turnstile de un solo uso (solo si el servidor lo pidió)

  // ── Persistencia ────────────────────────────────────────────────────────
  const save = () => {
    ls.set(KEY, JSON.stringify({ v: 1, t: Date.now(), lang, sid, msgs: msgs.slice(-MAX_STORED) }))
  }
  const load = () => {
    try {
      const d = JSON.parse(ls.get(KEY) || 'null')
      if (d?.v === 1 && d.lang === lang && Date.now() - d.t < TTL && Array.isArray(d.msgs)) {
        if (typeof d.sid === 'string' && /^[A-Za-z0-9]{16,64}$/.test(d.sid)) sid = d.sid
        return d.msgs
      }
    } catch {}
    return []
  }

  // ── Turnstile BAJO DEMANDA (adenda T32) ─────────────────────────────────
  // Solo si el servidor lo pide (meta.challenge.turnstile = site key, que solo existe si Diego
  // configuró Turnstile y el modo live). Sin eso, el widget NO carga nada de terceros.
  let tsLoading = null
  function turnstile(siteKey) {
    if (tsToken || !/^[\w-]{10,80}$/.test(siteKey || '')) return
    tsLoading ||= new Promise((resolve, reject) => {
      const sc = document.createElement('script')
      sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      sc.async = true
      sc.onload = resolve
      sc.onerror = reject
      document.head.append(sc)
    })
    tsLoading.then(() => {
      let box = root.querySelector('[data-chat-ts]')
      if (!box) { box = document.createElement('div'); box.dataset.chatTs = ''; panel.append(box) }
      box.innerHTML = ''
      window.turnstile?.render(box, { sitekey: siteKey, size: 'invisible', appearance: 'interaction-only', callback: (t) => { tsToken = t } })
    }).catch(() => { tsLoading = null })
  }

  // ── Pintado ─────────────────────────────────────────────────────────────
  const scroll = () => { log.scrollTop = log.scrollHeight }
  // T60: quien ya se apuntó (bandera + correo enmascarado): nunca la tarjeta, y el servidor lo sabe.
  const joined = () => signupState().signedUp

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
  // Chips: el texto se pregunta y, si el servidor lo trae, su id CURADO viaja en `chip` (T35):
  // respuesta escrita de antemano, al instante y sin modelo.
  function chipsRow(chips = [], ids = []) {
    if (!chips.length) return
    const row = document.createElement('div')
    row.className = 'cw-chips-row'
    chips.forEach((c, i) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'cw-chip'
      b.textContent = c
      b.dataset.chatAsk = c
      if (ids[i]) b.dataset.chatChip = ids[i]
      row.append(b)
    })
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
      chipsRow(last.meta?.chips, last.meta?.chipIds)
      if (last.meta?.cta === 'waitlist') waitlistCard()
    } else if (last?.role === 'user') {
      showError('errNet') // la respuesta se perdió (p. ej. recarga a mitad): «Reintentar»
    }
  }

  // ── Conversación ────────────────────────────────────────────────────────
  async function ask(text, { retry = false, chip = null } = {}) {
    text = String(text || '').trim().slice(0, MAX_CHARS)
    if (!text || busy) return
    busy = true
    send.disabled = true
    let typing = null, el = null, content = '', meta = null
    const ac = new AbortController()
    let idle = 0
    const arm = () => { clearTimeout(idle); idle = setTimeout(() => ac.abort(), T_IDLE) }
    const total = setTimeout(() => ac.abort(), T_TOTAL)
    // TODO dentro del try: pase lo que pase, `busy` se libera (antes, una excepción o un fetch
    // colgado dejaba el envío bloqueado y los mensajes siguientes se ignoraban en silencio).
    try {
      suggest.hidden = true
      log.querySelectorAll('.cw-chips-row, .cw-err').forEach((r) => r.remove())
      if (!retry) {
        msgs.push({ role: 'user', content: text })
        bubble('user', userHtml(text))
        save()
      }
      track('chat_message', { turn: msgs.filter((m) => m.role === 'user').length, retry })

      // SALUDO → al instante, aquí mismo: sin petición, sin modelo y sin gastar cupo.
      if (isGreeting(text)) {
        const r = offlineReply(text, lang)
        const sug = [...suggest.querySelectorAll('.cw-chip')]
        answer(r.text, { mode: 'local', kind: r.kind, cta: null, chips: sug.map((b) => b.textContent.trim()), chipIds: sug.map((b) => b.dataset.chatChip || null), matched: null, sources: [] })
        return
      }

      typing = bubble('assistant', '<span class="cw-typing" aria-label="' + esc(S.typing) + '"><span></span><span></span><span></span></span>')
      arm()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: ac.signal,
        body: JSON.stringify({ locale: lang, page: location.pathname, session: sid, ...(chip ? { chip } : {}), ...(tsToken ? { turnstile: tsToken } : {}), ...signupContext(), messages: msgs.map(({ role, content }) => ({ role, content })) }),
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
        arm()
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
          if (ev === 'meta') { meta = data; tsToken = null; if (data.challenge?.turnstile) turnstile(data.challenge.turnstile) }
          else if (ev === 'delta') {
            content += data.t || ''
            if (!el) { typing.remove(); typing = null; el = bubble('assistant', '') }
            el.innerHTML = botHtml(content, meta)
            scroll()
          } else if (ev === 'error') throw new Error('net')
        }
      }
      if (!content) throw new Error('empty')
      msgs.push({ role: 'assistant', content, meta })
      save()
      announce.textContent = S.answered.replace('{text}', content.replace(/\*\*|\[|\]\([^)]*\)/g, ''))
      track('chat_answer', { kind: meta?.kind || 'unknown', mode: meta?.mode || 'unknown' })
      if (meta?.kind === 'fallback') track('chat_fallback', {})
      chipsRow(meta?.chips, meta?.chipIds)
      if (meta?.cta === 'waitlist') waitlistCard()
    } catch (e) {
      const why = e?.name === 'AbortError' ? 'timeout' : ['off', 'daily', 'rate', 'empty'].includes(e?.message) ? e.message : 'net'
      typing?.remove()
      track('chat_error', { error: why })
      if (el && content) {
        // Se cortó a MITAD de una respuesta: se conserva lo recibido y se ofrece reintentar.
        msgs.push({ role: 'assistant', content: `${content}…`, meta })
        save()
        el.innerHTML = botHtml(`${content}…`, meta)
        showError('errCut')
      } else {
        el?.remove()
        // NUNCA en silencio: un mensaje amable + la respuesta que se puede dar aquí mismo.
        const r = offlineReply(text, lang, chip)
        const body = r.kind === 'generic' ? S.offlineGeneric : r.text
        const soft = { rate: S.softRate, daily: S.softDaily, off: S.softOff }[why] || S.softNet
        answer(`${soft}\n\n${body}`, { mode: 'offline', kind: r.kind, reason: why, cta: r.cta, chips: [], matched: null, sources: [] })
        if (why !== 'daily' && why !== 'off') showError(why === 'rate' ? 'errRate' : 'errNet', { soft: true })
      }
    } finally {
      clearTimeout(idle)
      clearTimeout(total)
      typing?.remove()
      busy = false
      send.disabled = false
      scroll()
    }
  }

  /** Pinta y guarda una respuesta del asistente que no viene del stream (saludo o sin red). */
  function answer(content, meta) {
    msgs.push({ role: 'assistant', content, meta })
    save()
    bubble('assistant', botHtml(content, meta))
    announce.textContent = S.answered.replace('{text}', content.replace(/\*\*|\[|\]\([^)]*\)/g, ''))
    track('chat_answer', { kind: meta.kind, mode: meta.mode })
    chipsRow(meta.chips, meta.chipIds)
    if (meta.cta === 'waitlist') waitlistCard()
  }

  /** Error con botón «Reintentar» (reenvía la última pregunta sin duplicarla). `soft`: solo el
   *  botón (el mensaje amable ya lo dio la respuesta sin red). */
  function showError(key, { soft = false } = {}) {
    const box = document.createElement('div')
    box.className = soft ? 'cw-err cw-err-soft' : 'cw-err'
    if (!soft) { box.setAttribute('role', 'alert'); box.append(S[key]) }
    if (key === 'errNet' || key === 'errRate' || key === 'errCut') {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'cw-chip cw-retry'
      b.textContent = S.retry
      b.addEventListener('click', () => {
        // La respuesta provisional (sin red o cortada) no viaja al servidor como si fuera del asistente.
        const lastMsg = msgs[msgs.length - 1]
        if (lastMsg?.role === 'assistant' && (lastMsg.meta?.mode === 'offline' || lastMsg.content.endsWith('…'))) { msgs.pop(); save() }
        const last = [...msgs].reverse().find((m) => m.role === 'user')
        if (last) ask(last.content, { retry: true })
      })
      if (!soft) box.append(document.createElement('br'))
      box.append(b)
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
    ask(chip.dataset.chatAsk, { chip: chip.dataset.chatChip || null })
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
