// ─────────────────────────────────────────────────────────────────────────────
// VISTA PREVIA de La Forja (S13 · T35 adenda, punto 3, Diego: «un prototipo real, pulido y bonito,
// no un placeholder con cara de falso»). Lo que «construye» la Forja para cada tipo de producto,
// con una marca FICTICIA (Lúa, la de la demo de S03) y datos inventados:
//   0 landing · 1 sitio web · 2 tienda · 3 aplicación web · 4 app móvil · 5 herramienta interna
// Va en el hueco que el compilador abre en S13 (scripts/port/compile-sections.mjs → children(k)).
// Cada bloque lleva `fb` + `--i`: entra escalonado con la animación de «construyéndose» del
// prototipo (y aparece directo con movimiento reducido, por las mismas reglas). Sin imágenes
// externas: SVG y CSS (src/sections/forja/forja.css). Es una ilustración: role="img" + descripción,
// y el interior aria-hidden (nada enfocable dentro).
// ─────────────────────────────────────────────────────────────────────────────
import { FORJA } from './texts.js'

const C = { terra: '#C2643A', sand: '#E9D5BF', sage: '#9DAA8C', plum: '#7E5A6E', sky: '#B9C9D6', ink: '#2E2420' }

/** Prenda en SVG (suéter, vestido, pantalón o camiseta) sobre fondo de color. */
function Garment({ kind = 'sweater', color = C.terra, bg = C.sand }) {
  const shape = {
    sweater: 'M21 9q9 5 18 0l11 6 4 33h-7l-3-24v26H19V24l-3 24H9l4-33z',
    dress: 'M24 8h12l2 10 10 32H12l10-32z',
    pants: 'M18 8h24l2 44h-9l-5-30-5 30h-9z',
    tee: 'M21 10l9 3 9-3 11 7-4 8-5-2v27H19V23l-5 2-4-8z',
  }[kind]
  return (
    <svg class="fj-garment" viewBox="0 0 60 60" style={{ background: bg }}>
      <path d={shape} fill={color} />
      <path d={shape} fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1" />
    </svg>
  )
}

const Logo = ({ T, light }) => <span class={`fj-logo${light ? ' fj-logo-light' : ''}`}>{T.brand}<i>·</i></span>
const B = ({ i, class: cls = '', children, ...rest }) => <div class={`fb ${cls}`} style={{ '--i': String(i) }} data-i={String(i)} {...rest}>{children}</div>

function Landing({ T }) {
  const L = T.landing
  const garments = [['sweater', C.terra], ['dress', C.plum], ['pants', C.sage]]
  return (
    <div class="fj fj-landing">
      <B i={0} class="fj-nav"><Logo T={T} /><span class="fj-links">{L.nav.map((n) => <span>{n}</span>)}</span><span class="fj-bag">◍</span></B>
      <B i={1} class="fj-hero">
        <span class="fj-kicker">{L.kicker}</span>
        <span class="fj-title">{L.title}</span>
        <span class="fj-sub">{L.sub}</span>
        <span class="fj-row"><span class="fj-btn">{L.cta}</span><span class="fj-note">{L.cta2}</span></span>
      </B>
      <div class="fj-grid3">
        {L.items.map(([n, p], k) => (
          <B i={2 + k} class="fj-card"><Garment kind={garments[k][0]} color={garments[k][1]} /><span class="fj-name">{n}</span><span class="fj-price">{p}</span></B>
        ))}
      </div>
      <B i={5} class="fj-trust">{L.trust.map((x) => <span>✓ {x}</span>)}</B>
    </div>
  )
}

function Site({ T }) {
  const W = T.site
  return (
    <div class="fj fj-site">
      <B i={0} class="fj-nav fj-nav-dark"><Logo T={T} light /><span class="fj-links">{W.nav.map((n, k) => <span class={k === 0 ? 'on' : ''}>{n}</span>)}</span></B>
      <B i={1} class="fj-hero fj-hero-split">
        <span class="fj-col"><span class="fj-title">{W.title}</span><span class="fj-sub">{W.sub}</span><span class="fj-btn">{W.cta}</span></span>
        <Garment kind="dress" color={C.terra} bg="#F3E4D2" />
      </B>
      <div class="fj-grid3">
        {W.services.map(([ic, n], k) => <B i={2 + k} class="fj-service"><span class="fj-ic">{ic}</span><span>{n}</span></B>)}
      </div>
      <B i={5} class="fj-about"><span class="fj-h">{W.about}</span><span class="fj-sub">{W.aboutText}</span></B>
      <B i={6} class="fj-contact"><span class="fj-btn fj-btn-sm">{W.contact}</span><span class="fj-note">{W.hours}</span></B>
    </div>
  )
}

function Store({ T }) {
  const S = T.store
  const g = [['sweater', C.terra, C.sand], ['dress', C.plum, '#EADDE4'], ['tee', C.sage, '#E4E9DD']]
  return (
    <div class="fj fj-store">
      <B i={0} class="fj-nav"><Logo T={T} /><span class="fj-search">⌕ {S.search}</span><span class="fj-cart">{S.cart}<b>2</b></span></B>
      <B i={1} class="fj-chips">{S.filters.map((f, k) => <span class={k === 0 ? 'on' : ''}>{f}</span>)}</B>
      <div class="fj-grid3">
        {S.items.map(([n, p, tag], k) => (
          <B i={2 + k} class="fj-card">
            {tag ? <span class="fj-tag">{tag}</span> : null}
            <Garment kind={g[k][0]} color={g[k][1]} bg={g[k][2]} />
            <span class="fj-name">{n}</span>
            <span class="fj-row fj-between"><span class="fj-price">{p}</span><span class="fj-add">+ {S.add}</span></span>
          </B>
        ))}
      </div>
      <B i={5} class="fj-checkout"><span>{S.subtotal} <b>{S.total}</b></span><span class="fj-btn fj-btn-sm">{S.pay} →</span></B>
    </div>
  )
}

function App({ T }) {
  const A = T.app
  return (
    <div class="fj fj-app">
      <B i={0} class="fj-nav"><Logo T={T} /><span class="fj-avatar">AN</span></B>
      <B i={1} class="fj-hero fj-hero-tight"><span class="fj-title fj-title-sm">{A.title}</span><span class="fj-sub">{A.sub}</span></B>
      <B i={2} class="fj-days">{A.days.map(([d, n], k) => <span class={k === 2 ? 'on' : ''}><small>{d}</small><b>{n}</b></span>)}</B>
      <B i={3} class="fj-slots">{A.slots.map((s, k) => <span class={k === 1 ? 'on' : ''}>{s}</span>)}</B>
      <B i={4} class="fj-confirm"><span class="fj-note">{A.service}</span><span class="fj-btn fj-btn-sm">{A.confirm}</span></B>
      <B i={5} class="fj-includes"><span class="fj-h">{A.includes}</span>{A.list.map((x) => <span>✓ {x}</span>)}</B>
      <B i={6} class="fj-next"><span class="fj-dot" /><span><small>{A.next}</small><b>{A.nextWhen}</b></span></B>
    </div>
  )
}

function Mobile({ T, deal }) {
  const M = T.mobile
  return (
    <div class="fj fj-mobile">
      <B i={0} class="fj-phone">
        <div class="fj-status"><span>{M.time}</span><span class="fj-island" /><span>●●●</span></div>
        <div class="fj-push"><span class="fj-push-ic">{T.brand[0]}</span><span><small>{M.push}</small><b>{deal}</b><span>{M.pushText}</span></span></div>
        <div class="fj-screen">
          <span class="fj-hello">{M.hello}</span>
          <span class="fj-h">{M.section}</span>
          <div class="fj-card fj-card-wide"><Garment kind="sweater" color={C.terra} /><span class="fj-col"><span class="fj-name">{M.item[0]}</span><span class="fj-row"><s>{M.item[1]}</s><span class="fj-price">{M.item[2]}</span></span></span></div>
          <div class="fj-tabs">{M.tabs.map((t, k) => <span class={k === 0 ? 'on' : ''}>{t}</span>)}</div>
        </div>
      </B>
    </div>
  )
}

function Tool({ T }) {
  const O = T.tool
  return (
    <div class="fj fj-tool">
      <B i={0} class="fj-nav fj-nav-dark"><Logo T={T} light /><span class="fj-note fj-note-light">{O.title}</span></B>
      <B i={1} class="fj-kpis">{O.kpis.map(([n, l]) => <span><b>{n}</b><small>{l}</small></span>)}</B>
      <B i={2} class="fj-table">
        <span class="fj-tr fj-th">{O.cols.map((c) => <span>{c}</span>)}</span>
        {O.rows.map(([id, who, st, k]) => <span class="fj-tr"><span>{id}</span><span>{who}</span><span><i class={`fj-st fj-st-${k}`}>{st}</i></span></span>)}
      </B>
      <B i={3} class="fj-week"><span class="fj-note">{O.week}</span><span class="fj-bars">{[38, 52, 46, 70, 64, 92, 58].map((h, k) => <span><i style={{ height: `${h}%` }} class={k === 5 ? 'top' : ''} /><small>{O.days[k]}</small></span>)}</span></B>
      <B i={4} class="fj-shifts"><span class="fj-h">{O.shifts}</span>{O.team.map(([ini, n, s]) => <span class="fj-person"><span class="fj-avatar">{ini}</span><span>{n}</span><small>{s}</small></span>)}</B>
    </div>
  )
}

const VIEWS = [Landing, Site, Store, App, Mobile, Tool]

/** Vista previa del tipo `kind` (0–5) en `lang`. `deal`: «¡Nueva oferta!» del diccionario de S13. */
export default function ForjaPreview({ kind, lang, deal }) {
  const T = FORJA[lang] || FORJA.es
  const View = VIEWS[kind] || Landing
  return (
    <div class="fj-wrap" role="img" aria-label={T.alt[kind] || T.alt[0]} data-forja={kind}>
      <div aria-hidden="true" class="fj-inner"><View T={T} deal={deal} /></div>
    </div>
  )
}
