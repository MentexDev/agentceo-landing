// ─────────────────────────────────────────────────────────────────────────────
// ESTADO DE LA PORTADA · port de design/prototype/src/LandingLogic.jsx sin React.
//
// El prototipo era un componente de clase con un `state` y un `renderVals()` que
// producía el objeto `v` para TODAS las secciones. Aquí:
//   · un store de módulo (compartido entre islas: misma instancia en la página);
//   · `renderVals(state, L)` es el MISMO cálculo (puro) → sirve en el servidor (HTML
//     inicial) y en el cliente;
//   · los textos de la lógica vienen del diccionario (L = ui.logic) → i18n;
//   · la lista de espera (mail/join/biz) sale de aquí: la lleva WaitlistForm/Modal.
// Los efectos imperativos (aparición, ojos, carruseles) viven en src/scripts/vida.js.
// ─────────────────────────────────────────────────────────────────────────────
import { useSyncExternalStore } from 'react'

export const initialState = () => ({
  more: false, cb: -1, wa: 0, fk: 0, tour: -1, path: '', area: 0,
  autos: [true, false, false, false, false, false, false, false, false],
  tab: 0, clon: true, msg: 0, happy: false, poke: -1, idx: 0, anim: '', ok: 0, no: 0,
  log: [], tr: [0, 1, 2], lock: 0, shake: false, open: 0,
})

let state = initialState()
const subs = new Set()
const timers = {}
export const store = {
  get: () => state,
  set(patch) {
    state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
    subs.forEach((f) => f())
  },
  sub(f) { subs.add(f); return () => subs.delete(f) },
}
const later = (key, ms, fn) => { clearTimeout(timers[key]); timers[key] = setTimeout(fn, ms) }

// Carrusel de automatizaciones (S11): avanza solo cada 2,6 s si está a la vista,
// se pausa con puntero/foco/toque y NO corre con motion reducido.
let autoEl = null, autoHold = false, autoT = 0
function setAutoRef(el) {
  autoEl = el
  if (!el || el.__bound) return
  el.__bound = true
  const hold = () => { autoHold = true }
  const free = () => { autoHold = false }
  el.addEventListener('pointerenter', hold); el.addEventListener('pointerleave', free)
  el.addEventListener('focusin', hold); el.addEventListener('focusout', free)
  el.addEventListener('touchstart', () => { autoHold = true; later('ht', 6000, free) }, { passive: true })
  if (!autoT && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    autoT = setInterval(() => {
      if (!autoEl || autoHold || document.hidden || !autoEl.classList.contains('hs-d')) return
      const r = autoEl.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight) return
      const first = autoEl.firstElementChild
      const step = first ? first.getBoundingClientRect().width + 18 : 320
      if (autoEl.scrollLeft >= autoEl.scrollWidth - autoEl.clientWidth - 8) autoEl.scrollTo({ left: 0, behavior: 'smooth' })
      else autoEl.scrollBy({ left: step, behavior: 'smooth' })
    }, 2600)
  }
}
const nudge = (dir) => {
  autoHold = true
  later('hb', 6000, () => { autoHold = false })
  autoEl?.scrollBy({ left: dir * 378, behavior: 'smooth' })
}

/** El cálculo de `v` del prototipo, puro. `L` = textos de la lógica en el idioma. */
export function renderVals(s, L) {
  const set = store.set
  const decide = (yes) => {
    if (s.anim || s.idx > 2) return
    set({ anim: yes ? 'leave-yes' : 'leave-no' })
    later('tr', 480, () => set((st) => ({
      anim: '', idx: st.idx + 1,
      ok: st.ok + (yes ? 1 : 0), no: st.no + (yes ? 0 : 1),
      log: st.log.concat([{ t: L.req[st.idx], lbl: yes ? L.approved : L.notNow, st: yes ? 'color: #D9B866; font-weight: 600;' : 'color: #a9a7a0;' }]),
    })))
  }
  const f = Array.from({ length: 12 }, (_, i) => ({
    open: s.open === i, exp: s.open === i ? 'true' : 'false',
    icon: `display: flex; flex-shrink: 0; transition: transform .35s ease; transform: rotate(${s.open === i ? 45 : 0}deg);`,
    toggle: () => set({ open: s.open === i ? -1 : i }),
  }))
  const out = {
    ceoMsg: L.ceo[s.msg % L.ceo.length],
    ceoCls: s.happy ? 'happy ceo-happy' : '',
    ceoTap: () => { set({ msg: s.msg + 1, happy: true }); later('th', 900, () => set({ happy: false })) },
    r0: s.idx === 0, r1: s.idx === 1, r2: s.idx === 2,
    notFin: s.idx < 3, fin: s.idx >= 3, reqN: Math.min(3, s.idx + 1),
    reqCls: `req ${s.anim}`,
    reqFace: s.anim === 'leave-yes' ? 'happy' : s.anim === 'leave-no' ? 'face-sad' : '',
    yes: () => decide(true), no: () => decide(false),
    again: () => set({ idx: 0, ok: 0, no: 0, log: [] }),
    okN: s.ok, noN: s.no, log: s.log,
    lockCls: s.shake ? 'shake' : '',
    lockTxt: s.lock > 0 ? L.lockTried : L.lockIdle,
    lockTry: () => { set({ shake: true, lock: s.lock + 1 }); later('ts', 520, () => set({ shake: false })) },
  }
  for (let i = 0; i < 6; i++) {
    out[`a${i}`] = `agent${s.poke === i ? ' poked' : ''}`
    out[`poke${i}`] = () => { set({ poke: i }); later('tp', 1100, () => set({ poke: -1 })) }
  }
  for (let i = 0; i < 3; i++) {
    const c = s.tr[i]
    for (let j = 0; j < 3; j++) out[`t${i}p${j}`] = `pip${j < c ? ' on' : ''}`
    out[`t${i}open`] = c < 3
    out[`t${i}done`] = c >= 3
    out[`t${i}row`] = c >= 3 ? 'trow-done' : ''
    out[`t${i}lvl`] = `lvl${c}`
    out[`t${i}face`] = c >= 3 ? 'happy' : ''
    out[`t${i}txt`] = c >= 3 ? L.trustDone : L.trustStep.replace('{n}', c)
    out[`t${i}inc`] = () => { const tr = store.get().tr.slice(); tr[i] = Math.min(3, tr[i] + 1); set({ tr }) }
  }
  for (let i = 0; i < 12; i++) { out[`f${i}`] = f[i]; out[`fq${i}`] = s.open === i ? 'fqa' : 'fqb' }
  out.fNone = s.open < 0
  out.faqFace = s.open >= 0 ? 'faq-talk' : ''
  out.pathNone = !s.path; out.pathT = s.path === 't'; out.pathC = s.path === 'c'; out.pathSome = !!s.path
  out.chooseT = () => set({ path: 't', cb: -1 })
  out.chooseC = () => set({ path: 'c', cb: -1 })
  out.resetPath = () => set({ path: s.path === 't' ? 'c' : 't', cb: -1 })
  const AREA = [1, 1, 2, 2, 3, 4, 4, 5, 5]
  for (let k = 0; k < 6; k++) {
    out[`ac${k}`] = s.area === k ? 'chip-on' : 'chip-off'
    out[`ap${k}`] = s.area === k ? 'true' : 'false'
    out[`sa${k}`] = () => { set({ area: k }); autoEl?.scrollTo({ left: 0 }) }
  }
  for (let i = 0; i < 9; i++) {
    const on = s.autos[i]
    out[`show${i}`] = s.area === 0 || AREA[i] === s.area
    out[`on${i}`] = on ? 'true' : 'false'
    out[`sw${i}`] = on ? 'sw-on' : 'sw-off'
    out[`acard${i}`] = on ? 'acard-on' : 'acard-off'
    out[`st${i}`] = on ? L.autoOn : ''
    out[`tog${i}`] = () => { const a = store.get().autos.slice(); a[i] = !a[i]; set({ autos: a }) }
  }
  for (let k = 0; k < 3; k++) {
    out[`tab${k}`] = s.tab === k
    out[`tsel${k}`] = s.tab === k ? 'true' : 'false'
    out[`tcls${k}`] = s.tab === k ? 'tab-on' : 'tab-off'
    out[`tset${k}`] = () => set({ tab: k })
  }
  const nOn = s.autos.filter(Boolean).length
  out.onCount = nOn
  out.onBar = `display: block; height: 100%; background: #D9B866; transition: width .5s; width: ${Math.round((nOn / 9) * 100)}%;`
  out.onMsg = nOn === 0 ? L.meter0 : nOn >= 9 ? L.meterAll : L.meterSome
  out.meterFace = nOn >= 3 ? 'mface-happy' : ''
  out.setAutoRef = setAutoRef
  out.autoNext = () => nudge(1)
  out.autoPrev = () => nudge(-1)
  out.tourCls = s.tour >= 0 ? 'manual' : ''
  out.tourManual = s.tour >= 0
  out.tourPlay = () => set({ tour: -1 })
  for (let k = 0; k < 6; k++) {
    out[`tn${k}`] = s.tour === k ? 'tpick' : ''
    out[`ts${k}`] = s.tour === k ? 'tpick' : ''
    out[`tg${k}`] = () => set({ tour: k })
  }
  for (let k = 0; k < 6; k++) {
    out[`fk${k}`] = s.fk === k
    out[`fkc${k}`] = s.fk === k ? 'fkon' : 'fkoff'
    out[`fkp${k}`] = s.fk === k ? 'true' : 'false'
    out[`fks${k}`] = () => set({ fk: k })
  }
  out.fkAgain = () => { const k = s.fk < 0 ? 0 : s.fk; set({ fk: -1 }); later('fk', 40, () => set({ fk: k })) }
  out.moreOpen = s.more
  out.moreExp = s.more ? 'true' : 'false'
  out.moreLbl = s.more ? L.moreOpen : L.moreClosed
  out.moreTog = () => set({ more: !store.get().more })
  out.cbNone = s.cb < 0
  for (let k = 0; k < 4; k++) { out[`cbs${k}`] = s.cb === k; out[`cb${k}`] = () => set({ cb: k }) }
  for (let k = 0; k < 2; k++) {
    out[`waP${k}`] = s.wa === k
    out[`waSel${k}`] = s.wa === k ? 'true' : 'false'
    out[`waC${k}`] = s.wa === k ? 'wtab-on' : 'wtab-off'
    out[`waT${k}`] = () => set({ wa: k })
  }
  out.clonOn = s.clon ? 'true' : 'false'
  out.clonSw = s.clon ? 'sw-on' : 'sw-off'
  out.clonTxt = s.clon ? L.clonOn : L.clonOff
  out.clonTog = () => set({ clon: !store.get().clon })
  return out
}

/** Hook de las islas: el `v` del estado actual (en el servidor, el del estado inicial). */
export function useLanding(L) {
  const s = useSyncExternalStore(store.sub, store.get, store.get)
  return renderVals(s, L)
}
