// ─────────────────────────────────────────────────────────────────────────────
// S03 · RECREACIÓN de la app real de Agent CEO (isla Preact, se hidrata al verse).
// Estructura, textos y tokens sacados de CRM-AI-evolution/apps/web (solo lectura):
// sidebar con interruptor Trabajo/Empresa, chat con el CEO (pensando → pasos/tool calls →
// respuesta en streaming), Aprobaciones (una se firma), Biblioteca, Panel de Comando,
// Ventas y Clientes (las métricas suben), selector de marca en las migas.
// · No carga la app real ni llama a APIs: todo es local y con DATOS INVENTADOS.
// · Recorrido automático solo a la vista, con botón de pausa (WCAG 2.2.2); al tocar algo,
//   el control pasa a la persona. Con «reducir movimiento»: estados finales, sin animar.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  SquarePen, Network, ListTodo, CircleCheck, Library, Workflow, Building2, MessageSquare, LayoutDashboard,
  Contact, Sparkles, Briefcase, Activity, Headset, Megaphone, ShoppingCart, Calculator, Package, Truck,
  ChevronsUpDown, Check, Crown, Bot, LoaderCircle, Globe, Image, Brain, Coins, ArrowUp, Paperclip, Search,
  Settings, ChevronRight, Play, Pause, FileText, Mail, Presentation, Sheet, Video, Undo2,
} from 'lucide-preact'
import { DICT, VIEWS, SIDE_OF, URL_OF, ORDERS, CLIENTS, METRICS } from './data.js'
// Estilos: appdemo.css va en el CSS NO crítico de la portada (scripts/build-rest-css.mjs).

const ICON_VIEW = { chat: MessageSquare, aprobaciones: CircleCheck, biblioteca: Library, panel: LayoutDashboard, ventas: ShoppingCart, clientes: Contact }
const KIND_ICON = { pink: Image, emerald: Sheet, violet: Mail, amber: Presentation, sky: FileText, rose: Video }
const FAM = { datos: Brain, web: Globe, imagen: Image }
const DWELL = { chat: 11000, aprobaciones: 6500, biblioteca: 6000, panel: 6000, ventas: 6000, clientes: 5000 }

const glyph = { crown: Crown, sparkles: Sparkles, bot: Bot }
const Kpi = ({ label, value, sub }) => (
  <div class="ad-kpi"><small>{label}</small><strong>{value}</strong>{sub && <em>{sub}</em>}</div>
)

const prefersReduce = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v[k])

/** Markdown mínimo y seguro: negritas y listas (el texto es nuestro, no del usuario). */
function Md({ text }) {
  const blocks = []
  let list = null
  for (const line of text.split('\n')) {
    const parts = (s) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p))
    if (line.startsWith('- ')) { if (!list) { list = []; blocks.push(list) } list.push(parts(line.slice(2))); continue }
    list = null
    blocks.push(<p>{parts(line)}</p>)
  }
  return blocks.map((b, i) => (Array.isArray(b) ? <ul key={i}>{b.map((li, j) => <li key={j}>{li}</li>)}</ul> : <span key={i}>{b}</span>))
}

/** Cifra que sube de `from` a `to` cuando `go` pasa a true. */
function useCount(from, to, go, reduce, ms = 1100) {
  const [v, setV] = useState(go && reduce ? to : from)
  useEffect(() => {
    if (!go) { setV(from); return }
    if (reduce) { setV(to); return }
    let raf, t0
    const tick = (t) => {
      t0 ??= t
      const k = Math.min(1, (t - t0) / ms)
      setV(from + (to - from) * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [go, from, to, reduce])
  return v
}

function Chat({ c }) {
  const { T, s } = c
  return (
    <div class="ad-chat">
      <div class="ad-log" role="log" aria-live="off">
        {s.sent && (
          <div class="ad-turn ad-user ad-in">
            <div class="ad-bubble ad-bubble-user">{T.userMsg}</div>
          </div>
        )}
        {s.sent && (
          <div class="ad-turn ad-in">
            <div class="ad-who"><span class="ad-av" aria-hidden="true"><Crown size={13} /></span><strong>{T.ceo}</strong><time>09:41</time></div>
            {s.thinking != null && (
              <div class="ad-thinking" aria-hidden="true"><span>{T.thinking[s.thinking]}</span><i /><i /><i /></div>
            )}
            {s.steps > 0 && (
              <div class="ad-steps">
                <div class="ad-steps-head">
                  {s.stepsDone < T.steps.length || s.writing ? <LoaderCircle size={14} class="ad-spin" aria-hidden="true" /> : <Check size={14} class="ad-okc" aria-hidden="true" />}
                  <span>{s.writing ? T.stepsWriting : s.stepsDone < T.steps.length ? T.stepsLive : fill(T.stepsDone, { n: T.steps.length, s: 9 })}</span>
                </div>
                <ol>
                  {T.steps.slice(0, s.steps).map((st, k) => {
                    const F = FAM[st.fam]
                    const ok = k < s.stepsDone
                    return (
                      <li class={ok ? 'ok' : 'run'} key={k}>
                        <span class={`ad-dot ${ok ? (st.fam === 'web' ? 'sky' : 'ok') : 'run'}`} aria-hidden="true" />
                        <F size={13} aria-hidden="true" />
                        <span>{ok ? st.done : st.run}</span>
                        {ok && <span class="ad-cost"><Coins size={12} aria-hidden="true" />{fill(T.credits, { n: st.cost })}</span>}
                      </li>
                    )
                  })}
                </ol>
              </div>
            )}
            {s.reply > 0 && (
              <div class="ad-bubble ad-bubble-agent"><Md text={T.reply.slice(0, s.reply)} />{s.writing && <span class="ad-caret" aria-hidden="true" />}</div>
            )}
            {s.done && <div class="ad-chips">{T.chips.map((c) => <span class="ad-chip">{c}</span>)}</div>}
          </div>
        )}
      </div>
      <div class="ad-composer">
        <span class={s.typed ? 'ad-typed' : 'ad-ph'}>{s.typed || T.composer}{s.typed && <span class="ad-caret" aria-hidden="true" />}</span>
        <span class="ad-attach" title={T.attach}><Paperclip size={15} aria-hidden="true" /></span>
        {s.typed && <span class="ad-send" title={T.send}><ArrowUp size={15} aria-hidden="true" /></span>}
      </div>
    </div>
  )
}

function Aprobaciones({ c }) {
  const { T, s, reduce, nf, cop, copM, M, go } = c
  return (
    <div class="ad-page">
      <header class="ad-ph1"><h3>{T.apTitle}</h3><p>{T.apSub}</p><span class="ad-count">{fill(T.apPending, { n: s.signed ? 2 : 3 })}</span></header>
      <ul class="ad-ap" role="list">
        {T.apRows.map((r, i) => {
          const G = glyph[r.glyph]
          const signed = i === 0 && s.signed
          return (
            <li class={`ad-aprow ${signed ? 'is-signed' : ''}`} key={i}>
              <span class="ad-glyph" aria-hidden="true"><G size={16} /></span>
              <span class="ad-apmain"><strong>{r.title}</strong><small>{r.who}</small></span>
              <span class="ad-apside">
                <span class={`ad-pill ${r.riskTone}`}>{r.risk}</span>
                <span class="ad-kind">{r.kind}</span>
                {signed
                  ? <span class="ad-signed"><Check size={13} aria-hidden="true" />{T.signed} · <span class="ad-undo"><Undo2 size={12} aria-hidden="true" />{T.undo}</span></span>
                  : <span class={`ad-act ${i === 0 ? 'primary' : ''} ${i === 0 && s.press ? 'pressed' : ''}`}>{r.act}</span>}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Biblioteca({ c }) {
  const { T, s, reduce, nf, cop, copM, M, go } = c
  {
    const assets = useCount(M('assets')[0], M('assets')[1], go, reduce)
    const week = useCount(M('semana')[0], M('semana')[1], go, reduce)
    return (
      <div class="ad-page">
        <header class="ad-ph1"><h3>{T.libTitle}</h3><p>{T.libSub}</p></header>
        <div class="ad-kpis">
          <Kpi label={T.libKpis[0]} value={nf(assets)} />
          <Kpi label={T.libKpis[1]} value={nf(week)} sub={fill(T.libNew, { n: Math.round(week) })} />
          <Kpi label={T.libKpis[2]} value={T.libLast} />
          <Kpi label={T.libKpis[3]} value={T.libStorage} />
        </div>
        <div class="ad-search"><Search size={14} aria-hidden="true" /><span>{T.libSearch}</span></div>
        <ul class="ad-cards" role="list">
          {T.libCards.filter((c) => !c.fresh || s.fresh || reduce).map((c, i) => {
            const I = KIND_ICON[c.tone]
            return (
              <li class={`ad-card ${c.fresh ? 'ad-pop' : ''}`} key={c.title}>
                <span class={`ad-thumb t-${c.tone}`} aria-hidden="true"><I size={22} /></span>
                <span class={`ad-type t-${c.tone}`}>{c.kind}</span>
                <strong>{c.title}</strong>
                <small><i class={`ad-cdot t-${c.tone}`} />{c.who}</small>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

function Panel({ c }) {
  const { T, s, reduce, nf, cop, copM, M, go } = c
  {
    const ped = useCount(M('pedidos14')[0], M('pedidos14')[1], go, reduce)
    const fac = useCount(M('facturado14')[0], M('facturado14')[1], go, reduce)
    const cli = useCount(M('clientes')[0], M('clientes')[1], go, reduce)
    const nue = useCount(M('nuevos30')[0], M('nuevos30')[1], go, reduce)
    const pub = useCount(M('publicados')[0], M('publicados')[1], go, reduce)
    const con = useCount(M('construyendo')[0], M('construyendo')[1], go, reduce)
    const C = T.cmd
    const Card = ({ t, rows, foot }) => (
      <div class="ad-cmd"><small>{t}</small><div class="ad-cmd-grid">{rows.map(([v, l]) => <span><strong>{v}</strong><em>{l}</em></span>)}</div>{foot && <span class="ad-cmd-foot">{foot}</span>}</div>
    )
    return (
      <div class="ad-page">
        <header class="ad-ph1"><h3>{T.cmdTitle}</h3></header>
        <div class="ad-cmds">
          <Card t={C.ventas.t} rows={[[nf(ped), C.ventas.a], [copM(fac), C.ventas.b]]} foot={<>{fill(C.ventas.act, { n: Math.round(ped) })} <ChevronRight size={12} aria-hidden="true" /></>} />
          <Card t={C.clientes.t} rows={[[nf(cli), C.clientes.a], [nf(nue), C.clientes.b]]} foot={<span class="ad-up">↑ {C.clientes.meta}</span>} />
          <Card t={C.caja.t} rows={[[copM(M('entro')[go ? 1 : 0]), C.caja.a], [copM(M('salio')[1]), C.caja.b], [copM(M('porCobrar')[1]), C.caja.c]]} />
          <Card t={C.productos.t} rows={[[nf(M('enUso')[1]), C.productos.a], [nf(pub), C.productos.b], [nf(con), C.productos.c]]} />
        </div>
      </div>
    )
  }
}

function Ventas({ c }) {
  const { T, s, reduce, nf, cop, copM, M, go } = c
  {
    const ven = useCount(M('vendido')[0], M('vendido')[1], go, reduce)
    const ped = useCount(M('pedidos')[0], M('pedidos')[1], go, reduce)
    const tic = useCount(M('ticket')[0], M('ticket')[1], go, reduce)
    const rows = ORDERS.filter((o) => !o.fresh || s.fresh || reduce)
    return (
      <div class="ad-page">
        <header class="ad-ph1"><h3>{T.salesTitle}</h3></header>
        <div class="ad-kpis">
          <Kpi label={T.salesKpis[0]} value={copM(ven)} />
          <Kpi label={T.salesKpis[1]} value={nf(ped)} />
          <Kpi label={T.salesKpis[2]} value={cop(Math.round(tic / 500) * 500)} />
          <Kpi label={T.salesKpis[3]} value={copM(M('sinCobrar')[1])} />
        </div>
        <div class="ad-tbl-wrap"><table class="ad-tbl">
          <thead><tr>{T.salesCols.map((c) => <th scope="col">{c}</th>)}</tr></thead>
          <tbody>{rows.map((o) => (
            <tr class={o.fresh ? 'ad-pop' : ''} key={o.id}>
              <td class="mono">{o.id}</td><td>{o.who}</td><td>{o.src}</td><td class="mono">{cop(o.total)}</td>
              <td><span class={`ad-pill ${o.pay === 'paid' ? 'ok' : 'warn'}`}>{o.pay === 'paid' ? T.paid : T.pending}</span></td>
              <td><span class={`ad-pill ${o.ship === 'shipped' ? 'ok' : 'sky'}`}>{o.ship === 'shipped' ? T.shipped : T.toShip}</span></td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    )
  }
}

function Clientes({ c }) {
  const { T, s, reduce, nf, cop, copM, M, go } = c
  {
    const cli = useCount(M('clientes')[0], M('clientes')[1], go, reduce)
    const nue = useCount(M('nuevos30')[0], M('nuevos30')[1], go, reduce)
    const con = useCount(M('contactables')[0], M('contactables')[1], go, reduce)
    const rows = CLIENTS.filter((c) => !c.fresh || s.fresh || reduce)
    return (
      <div class="ad-page">
        <header class="ad-ph1"><h3>{T.clientsTitle}</h3></header>
        <div class="ad-kpis">
          <Kpi label={T.clientsKpis[0]} value={nf(cli)} />
          <Kpi label={T.clientsKpis[1]} value={nf(nue)} />
          <Kpi label={T.clientsKpis[2]} value={nf(con)} />
          <Kpi label={T.clientsKpis[3]} value={nf(M('sinClasificar')[1])} />
        </div>
        <div class="ad-tbl-wrap"><table class="ad-tbl">
          <thead><tr>{T.clientsCols.map((c) => <th scope="col">{c}</th>)}</tr></thead>
          <tbody>{rows.map((c) => (
            <tr class={c.fresh ? 'ad-pop' : ''} key={c.who}>
              <td>{c.who}</td><td><span class="ad-pill">{T.clientTypes[c.type]}</span></td><td class="mono">{c.email}</td><td>{T.agents[c.by]}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </div>
    )
  }
}

export default function AppDemo({ lang = 'es' }) {
  const T = DICT[lang]
  const locale = lang === 'es' ? 'es-CO' : 'en-US'
  const nf = (n, d = 0) => new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(n)
  const cop = (n) => `COP ${nf(n)}`
  const copM = (n) => (lang === 'es' ? `COP ${nf(n, 1)} M` : `COP ${nf(n, 1)}M`)

  const [view, setView] = useState('chat')
  const [playing, setPlaying] = useState(true)
  const [visible, setVisible] = useState(false)
  const [reduce, setReduce] = useState(false)
  const [brandOpen, setBrandOpen] = useState(false)
  const [s, setS] = useState({}) // estado de la escena actual
  const rootRef = useRef(null)
  const tabRefs = useRef({})
  const runId = useRef(0)

  useEffect(() => { setReduce(prefersReduce()); if (prefersReduce()) setPlaying(false) }, [])
  // Solo corre a la vista (y con la pestaña del navegador visible).
  useEffect(() => {
    const el = rootRef.current
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // ── Motor de escenas: cada vista tiene su guion; un cambio de vista lo cancela. ──
  const run = useCallback(async (v, instant) => {
    const id = ++runId.current
    const alive = () => runId.current === id
    const wait = (ms) => new Promise((r) => setTimeout(r, instant ? 0 : ms))
    const set = (patch) => alive() && setS((o) => ({ ...o, ...patch }))
    setS({})
    if (v === 'chat') {
      const msg = T.userMsg
      if (instant) {
        setS({ typed: '', sent: true, steps: T.steps.length, stepsDone: T.steps.length, reply: T.reply.length, done: true })
        return
      }
      await wait(500)
      for (let i = 1; i <= msg.length && alive(); i += 2) { set({ typed: msg.slice(0, i) }); await wait(28) }
      await wait(250); set({ typed: '', sent: true, thinking: 0 })
      for (let k = 0; k < T.thinking.length && alive(); k++) { set({ thinking: k }); await wait(650) }
      for (let k = 0; k < T.steps.length && alive(); k++) { set({ thinking: null, steps: k + 1, stepsDone: k }); await wait(900); set({ stepsDone: k + 1 }); await wait(250) }
      set({ writing: true })
      for (let i = 0; i <= T.reply.length && alive(); i += 4) { set({ reply: i }); await wait(22) }
      set({ reply: T.reply.length, writing: false, done: true })
    } else if (v === 'aprobaciones') {
      await wait(1400); set({ press: true }); await wait(450); set({ signed: true, press: false })
    } else {
      await wait(900); set({ go: true }); await wait(700); set({ fresh: true })
    }
  }, [T])

  useEffect(() => { run(view, reduce) }, [view, reduce, run])

  // Recorrido automático.
  useEffect(() => {
    if (!playing || !visible || reduce) return
    const t = setTimeout(() => setView((v) => VIEWS[(VIEWS.indexOf(v) + 1) % VIEWS.length]), DWELL[view])
    return () => clearTimeout(t)
  }, [playing, visible, reduce, view])

  const choose = (v) => { setPlaying(false); setBrandOpen(false); setView(v) }
  const onTabKey = (e) => {
    const i = VIEWS.indexOf(view)
    const next = e.key === 'ArrowRight' ? (i + 1) % VIEWS.length : e.key === 'ArrowLeft' ? (i - 1 + VIEWS.length) % VIEWS.length : e.key === 'Home' ? 0 : e.key === 'End' ? VIEWS.length - 1 : -1
    if (next < 0) return
    e.preventDefault()
    choose(VIEWS[next])
    tabRefs.current[VIEWS[next]]?.focus()
  }

  const side = SIDE_OF[view]
  const M = (k) => METRICS[k]
  const go = Boolean(s.go)

  const V = { chat: Chat, aprobaciones: Aprobaciones, biblioteca: Biblioteca, panel: Panel, ventas: Ventas, clientes: Clientes }[view]
  const ctx = { T, s, reduce, nf, cop, copM, M, go }

  const workNav = [
    ['nueva', SquarePen, null], ['agentes', Network, null], ['tareas', ListTodo, null],
    ['aprobaciones', CircleCheck, 'aprobaciones'], ['biblioteca', Library, 'biblioteca'], ['automatizaciones', Workflow, null],
  ]
  const compNav = [
    ['panel', LayoutDashboard, 'panel'], ['equipo', Contact, null], ['marcas', Sparkles, null], ['portafolio', Briefcase, null],
    ['salud', Activity, null], ['atencion', Headset, null], ['marketing', Megaphone, null], ['ventas', ShoppingCart, 'ventas'],
    ['clientes', Contact, 'clientes'], ['finanzas', Calculator, null], ['inventario', Package, null], ['envios', Truck, null],
  ]
  const NavItem = ({ label, Icon, to, active, extra }) => (
    to
      ? <button type="button" class={`ad-nav ${active ? 'is-active' : ''}`} onClick={() => choose(to)} aria-current={active ? 'page' : undefined}><Icon size={16} aria-hidden="true" /><span>{label}</span>{extra}</button>
      : <span class="ad-nav is-static"><Icon size={16} aria-hidden="true" /><span>{label}</span>{extra}</span>
  )

  return (
    <div class="ad" ref={rootRef} data-appdemo>
      <div class="ad-bar">
        <div class="ad-tabs" role="tablist" aria-label={T.tabsLabel} onKeyDown={onTabKey}>
          {VIEWS.map((v) => {
            const I = ICON_VIEW[v]
            return (
              <button type="button" role="tab" id={`ad-tab-${v}`} aria-selected={view === v ? 'true' : 'false'} aria-controls="ad-panel" tabIndex={view === v ? 0 : -1}
                ref={(el) => { tabRefs.current[v] = el }} class="ad-tab" onClick={() => choose(v)} key={v}>
                <I size={14} aria-hidden="true" /><span>{T.tabs[v]}</span>
              </button>
            )
          })}
        </div>
        {!reduce && (
          <button type="button" class="ad-play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? T.pause : T.play} aria-pressed={playing ? 'false' : 'true'} title={playing ? T.pause : T.play}>
            {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          </button>
        )}
      </div>

      <div class="ad-win" role="group" aria-roledescription="demo" aria-label={T.demoLabel}>
        <div class="ad-chrome" aria-hidden="true"><i /><i /><i /><span class="ad-url">app.agentceo.io/admin/{URL_OF[view]}</span></div>
        <div class="ad-app">
          <aside class="ad-side" aria-label={T.sideLabel}>
            <div class="ad-logo" aria-hidden="true">Agent<span>·</span>CEO</div>
            <div class="ad-switch" role="group">
              <button type="button" class={side === 'trabajo' ? 'on' : ''} title={T.trabajoTitle} aria-pressed={side === 'trabajo' ? 'true' : 'false'} onClick={() => choose('chat')}><MessageSquare size={14} aria-hidden="true" />{T.trabajo}</button>
              <button type="button" class={side === 'empresa' ? 'on' : ''} title={T.empresaTitle} aria-pressed={side === 'empresa' ? 'true' : 'false'} onClick={() => choose('panel')}><Building2 size={14} aria-hidden="true" />{T.empresa}</button>
            </div>
            <div class="ad-find" aria-hidden="true"><Search size={13} /><span>{T.search}</span></div>
            <nav class="ad-navs">
              {side === 'trabajo' ? (
                <>
                  {workNav.map(([k, I, to]) => <NavItem label={T.nav[k]} Icon={I} to={to} active={to === view || (k === 'nueva' && view === 'chat')} key={k} />)}
                  <NavItem label={T.nav.empresa} Icon={Building2} to="panel" active={false} extra={<><span class="ad-adv">{T.nav.avanzado}</span><ChevronRight size={13} aria-hidden="true" /></>} />
                  <span class="ad-agh">{T.agentsHead}</span>
                  {T.agents.map((a, i) => <span class={`ad-agent ${i === 0 && view === 'chat' ? 'on' : ''}`} key={a}><i class="ad-agdot" />{a}</span>)}
                </>
              ) : (
                compNav.map(([k, I, to]) => <NavItem label={T.empresaNav[k]} Icon={I} to={to} active={to === view} key={k} />)
              )}
            </nav>
            <div class="ad-foot">
              {side === 'trabajo' ? (
                <><span class="ad-avatar">{T.user.initials}</span><span class="ad-fmeta"><strong>{T.user.name}</strong><small><i class="ad-online" />{T.user.status} · {T.user.role}</small></span><Settings size={15} aria-hidden="true" /></>
              ) : (
                <><span class="ad-badge" aria-hidden="true">L</span><span class="ad-fmeta"><strong>{T.company.name}</strong><small>{T.company.plan}</small></span></>
              )}
            </div>
          </aside>

          <section class="ad-main" id="ad-panel" role="tabpanel" aria-labelledby={`ad-tab-${view}`}>
            <div class="ad-head">
              <span class="ad-crumb">{T.company.name}</span><span class="ad-sep" aria-hidden="true">/</span>
              <span class="ad-brand">
                <button type="button" class="ad-brandbtn" aria-haspopup="listbox" aria-expanded={brandOpen ? 'true' : 'false'} onClick={() => setBrandOpen((o) => !o)}>
                  {T.brand.current}<ChevronsUpDown size={13} aria-hidden="true" />
                </button>
                {brandOpen && (
                  <ul class="ad-brandmenu" role="listbox" aria-label={T.nav.empresa}>
                    <li role="option" aria-selected="false"><span>{T.brand.general}</span><small>{T.brand.generalFoot}</small></li>
                    {T.brand.items.map((b) => <li role="option" aria-selected={b === T.brand.current ? 'true' : 'false'} key={b}><Sparkles size={13} aria-hidden="true" /><span>{b}</span>{b === T.brand.current && <Check size={13} aria-hidden="true" />}</li>)}
                    <li class="ad-newbrand">{T.brand.nueva}</li>
                  </ul>
                )}
              </span>
              <span class="ad-sep" aria-hidden="true">/</span><span class="ad-crumb ad-now">{T.tabs[view]}</span>
            </div>
            <div class="ad-body" key={view}><V c={ctx} /></div>
          </section>
        </div>
      </div>
      <p class="ad-note">{T.note}</p>
    </div>
  )
}
