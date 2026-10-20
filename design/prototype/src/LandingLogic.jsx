// Estado y comportamiento de la landing (animaciones, carruseles, recorrido, FAQ, lista de espera).
// Es un componente de clase de React: state + setState + renderVals() → las vistas reciben `v`.
import React from 'react'

export default class LandingLogic extends React.Component {
  state = { mailErr: false, jBusy: false, mail: '', more: false, cb: -1, wa: 0, join: '', biz: -1, fk: 0, tour: -1, path: '', area: 0, autos: [true, false, false, false, false, false, false, false, false], tab: 0, clon: true, msg: 0, happy: false, poke: -1, idx: 0, anim: '', ok: 0, no: 0, log: [], tr: [0, 1, 2], lock: 0, shake: false, open: 0, sent: false };
  setRoot = (el) => { this.root = el; };
  setAutoRef = (el) => {
    this.autoEl = el;
    if (el && !el.__bound) {
      el.__bound = true;
      const hold = () => { this.autoHold = true; };
      const free = () => { this.autoHold = false; };
      el.addEventListener('pointerenter', hold); el.addEventListener('pointerleave', free);
      el.addEventListener('focusin', hold); el.addEventListener('focusout', free);
      el.addEventListener('touchstart', () => { this.autoHold = true; clearTimeout(this.htT); this.htT = setTimeout(free, 6000); }, { passive: true });
    }
  };
  componentDidMount() {
    const sc = this.root;
    if (!sc) return;
    this.reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.rvs = Array.prototype.slice.call(sc.querySelectorAll('[data-rv]'));
    if (this.reduce) { sc.setAttribute('data-reduce', ''); this.rvs.forEach((e) => e.setAttribute('data-in', '')); }
    this.onScroll = () => { if (this.tk) return; this.tk = requestAnimationFrame(() => { this.tk = 0; this.reveal(); this.aim(); }); };
    sc.addEventListener('scroll', this.onScroll, { passive: true });
    this.px = null;
    this.last = 0;
    this.onMove = (e) => { this.px = e.clientX; this.py = e.clientY; this.last = Date.now(); if (sc.hasAttribute('data-idle')) sc.removeAttribute('data-idle'); this.queue(); };
    sc.addEventListener('pointermove', this.onMove);
    sc.addEventListener('pointerdown', this.onMove);
    this.wander = setInterval(() => {
      if (Date.now() - this.last < 2600) return;
      const r = sc.getBoundingClientRect();
      sc.setAttribute('data-idle', '');
      this.px = r.left + r.width * (0.1 + Math.random() * 0.8);
      this.py = r.top + r.height * (0.1 + Math.random() * 0.8);
      this.queue();
    }, 1700);
    this.reveal();
    this.t0 = setTimeout(() => sc.setAttribute('data-ready', ''), 80);
    const holdHs = (el) => { el.__hold = true; clearTimeout(el.__ht); el.__ht = setTimeout(() => { el.__hold = false; }, 7000); };
    const stepHs = (el, dir) => {
      const w = el.clientWidth + 12;
      if (dir > 0 && el.scrollLeft >= el.scrollWidth - el.clientWidth - 8) el.scrollTo({ left: 0, behavior: 'smooth' });
      else if (dir < 0 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
      else el.scrollBy({ left: dir * w, behavior: 'smooth' });
    };
    Array.prototype.slice.call(sc.querySelectorAll('.hs')).forEach((el) => {
      if (el.classList.contains('hs-d')) return;
      el.addEventListener('touchstart', () => holdHs(el), { passive: true });
      el.addEventListener('pointerdown', () => holdHs(el));
    });
    this.onHsClick = (e) => {
      const b = e.target && e.target.closest ? e.target.closest('[data-hs]') : null;
      if (!b) return;
      const el = b.parentElement ? b.parentElement.nextElementSibling : null;
      if (!el || !el.classList.contains('hs')) return;
      holdHs(el); stepHs(el, parseInt(b.getAttribute('data-hs'), 10) || 1);
    };
    sc.addEventListener('click', this.onHsClick);
    if (!this.reduce) {
      this.hsT = setInterval(() => {
        const vr = sc.getBoundingClientRect();
        Array.prototype.slice.call(sc.querySelectorAll('.hs')).forEach((el) => {
          if (el.classList.contains('hs-d') || el.__hold || el.scrollWidth <= el.clientWidth + 4) return;
          const r = el.getBoundingClientRect();
          if (r.bottom < vr.top + 80 || r.top > vr.bottom - 80) return;
          stepHs(el, 1);
        });
      }, 3400);
    }
    if (!this.reduce) {
      this.autoT = setInterval(() => {
        const el = this.autoEl;
        if (!el || this.autoHold || !el.classList.contains('hs-d')) return;
        const vr = sc.getBoundingClientRect(), r = el.getBoundingClientRect();
        if (r.bottom < vr.top || r.top > vr.bottom) return;
        const first = el.firstElementChild;
        const step = first ? first.getBoundingClientRect().width + 18 : 320;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 8) el.scrollTo({ left: 0, behavior: 'smooth' });
        else el.scrollBy({ left: step, behavior: 'smooth' });
      }, 2600);
    }
  }
  queue() { if (this.ta) return; this.ta = requestAnimationFrame(() => { this.ta = 0; this.aim(); }); }
  aim() {
    const sc = this.root;
    if (!sc || this.px === null) return;
    const vr = sc.getBoundingClientRect();
    const eyes = sc.querySelectorAll('[data-eye]');
    for (let i = 0; i < eyes.length; i++) {
      const el = eyes[i];
      const p = el.nextElementSibling;
      if (!p) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < vr.top - 40 || r.top > vr.bottom + 40) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = this.px - cx, dy = this.py - cy;
      const d = Math.hypot(dx, dy) || 1;
      const mx = parseFloat(el.getAttribute('data-eye')) || 3;
      const f = Math.min(1, d / 240);
      p.style.transform = 'translate(' + (dx / d * mx * f).toFixed(2) + 'px,' + (dy / d * mx * f * 0.9).toFixed(2) + 'px)';
    }
    const tl = sc.querySelectorAll('[data-tilt]');
    for (let i = 0; i < tl.length; i++) {
      const g = tl[i];
      const r = g.getBoundingClientRect();
      if (r.bottom < vr.top - 40 || r.top > vr.bottom + 40) continue;
      const dx = this.px - (r.left + r.width / 2);
      const dy = this.py - (r.top + r.height / 2);
      const rot = Math.max(-7, Math.min(7, dx / 60));
      const ty = Math.max(-2, Math.min(2, dy / 120));
      g.style.transform = 'rotate(' + rot.toFixed(2) + 'deg) translateY(' + ty.toFixed(2) + 'px)';
    }
  }
  reveal() {
    const sc = this.root;
    if (!sc) return;
    const top0 = sc.getBoundingClientRect().top, vh = sc.clientHeight;
    this.rvs.forEach((e) => {
      if (e.hasAttribute('data-in')) return;
      const r = e.getBoundingClientRect();
      if (r.top - top0 < vh * 0.9 && r.bottom - top0 > 0) e.setAttribute('data-in', '');
    });
  }
  okMail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || '').trim()); }
  trySend(fromModal) {
    const v = (this.mailVal || '').trim();
    if (!this.okMail(v)) { this.setState({ mailErr: true }); return; }
    clearTimeout(this.jT);
    this.setState({ mailErr: false, jBusy: true, mail: v, join: fromModal ? this.state.join : 'form' });
    try { if (window.agentceoWaitlist) window.agentceoWaitlist({ email: v }); } catch (e) {}
    this.jT = setTimeout(() => this.setState({ jBusy: false, sent: true, join: 'biz' }), 750);
  }
  componentWillUnmount() {
    const sc = this.root;
    if (sc) { sc.removeEventListener('scroll', this.onScroll); sc.removeEventListener('pointermove', this.onMove); sc.removeEventListener('pointerdown', this.onMove); }
    clearInterval(this.wander); clearTimeout(this.jT); clearInterval(this.autoT); clearInterval(this.hsT); if (sc && this.onHsClick) sc.removeEventListener('click', this.onHsClick); clearTimeout(this.htT); clearTimeout(this.hbT); clearTimeout(this.t0); clearTimeout(this.th); clearTimeout(this.tp); clearTimeout(this.tr); clearTimeout(this.ts);
  }
  renderVals() {
    const s = this.state;
    const MSGS = ['¡Hola! Soy tu CEO. Tócame.', 'Yo organizo al equipo por ti.', 'Lo importante siempre te lo pregunto.', 'Mis compañeros están abajo. ¡Baja!', '¿Otra vez? Me haces cosquillas.'];
    const REQ = ['Pedir 40 camisetas negras', 'Subir el presupuesto del anuncio', 'Publicar los posts de la semana'];
    const decide = (yes) => {
      if (s.anim || s.idx > 2) return;
      this.setState({ anim: yes ? 'leave-yes' : 'leave-no' });
      this.tr = setTimeout(() => {
        this.setState((st) => ({
          anim: '', idx: st.idx + 1,
          ok: st.ok + (yes ? 1 : 0), no: st.no + (yes ? 0 : 1),
          log: st.log.concat([{ t: REQ[st.idx], lbl: yes ? 'Aprobado' : 'Ahora no', st: yes ? 'color: #D9B866; font-weight: 600;' : 'color: #a9a7a0;' }])
        }));
      }, 480);
    };
    const f = Array.from({ length: 12 }, (_, i) => i).map((i) => ({
      open: s.open === i, exp: s.open === i ? 'true' : 'false',
      icon: 'display: flex; flex-shrink: 0; transition: transform .35s ease; transform: rotate(' + (s.open === i ? 45 : 0) + 'deg);',
      toggle: () => this.setState({ open: s.open === i ? -1 : i })
    }));
    const out = {
      setRoot: this.setRoot,
      ceoMsg: MSGS[s.msg % MSGS.length],
      ceoCls: s.happy ? 'happy ceo-happy' : '',
      ceoTap: () => { clearTimeout(this.th); this.setState({ msg: s.msg + 1, happy: true }); this.th = setTimeout(() => this.setState({ happy: false }), 900); },
      r0: s.idx === 0, r1: s.idx === 1, r2: s.idx === 2,
      notFin: s.idx < 3, fin: s.idx >= 3, reqN: Math.min(3, s.idx + 1),
      reqCls: 'req ' + s.anim,
      reqFace: s.anim === 'leave-yes' ? 'happy' : (s.anim === 'leave-no' ? 'face-sad' : ''),
      yes: () => decide(true), no: () => decide(false),
      again: () => this.setState({ idx: 0, ok: 0, no: 0, log: [] }),
      okN: s.ok, noN: s.no, log: s.log,
      lockCls: s.shake ? 'shake' : '',
      lockTxt: s.lock > 0 ? 'Esto nunca lo hará solo. Siempre te va a preguntar.' : 'Por muy bien que lo haga, esto no cambia.',
      lockTry: () => { clearTimeout(this.ts); this.setState({ shake: true, lock: s.lock + 1 }); this.ts = setTimeout(() => this.setState({ shake: false }), 520); },
      notSent: !s.sent, sent: s.sent,
      submit: () => this.trySend(false)
    };
    for (let i = 0; i < 6; i++) {
      out['a' + i] = 'agent' + (s.poke === i ? ' poked' : '');
      out['poke' + i] = () => { clearTimeout(this.tp); this.setState({ poke: i }); this.tp = setTimeout(() => this.setState({ poke: -1 }), 1100); };
    }
    for (let i = 0; i < 3; i++) {
      const c = s.tr[i];
      for (let j = 0; j < 3; j++) out['t' + i + 'p' + j] = 'pip' + (j < c ? ' on' : '');
      out['t' + i + 'open'] = c < 3;
      out['t' + i + 'done'] = c >= 3;
      out['t' + i + 'row'] = c >= 3 ? 'trow-done' : ''; out['t' + i + 'lvl'] = 'lvl' + c; out['t' + i + 'face'] = c >= 3 ? 'happy' : '';
      out['t' + i + 'txt'] = c >= 3 ? '3 de 3 bien, sin sorpresas' : (c + ' de 3 · todavía te pregunta');
      out['t' + i + 'inc'] = () => { const tr = this.state.tr.slice(); tr[i] = Math.min(3, tr[i] + 1); this.setState({ tr: tr }); };
    }
    for (let i = 0; i < 12; i++) { out['f' + i] = f[i]; out['fq' + i] = s.open === i ? 'fqa' : 'fqb'; }
    out.fNone = s.open < 0; out.faqFace = s.open >= 0 ? 'faq-talk' : '';
    out.pathNone = !s.path; out.pathT = s.path === 't'; out.pathC = s.path === 'c'; out.pathSome = !!s.path;
    out.chooseT = () => this.setState({ path: 't', cb: -1 }); out.chooseC = () => this.setState({ path: 'c', cb: -1 });
    out.resetPath = () => this.setState({ path: s.path === 't' ? 'c' : 't', cb: -1 });
    const AREA = [1, 1, 2, 2, 3, 4, 4, 5, 5];
    for (let k = 0; k < 6; k++) { out['ac' + k] = s.area === k ? 'chip-on' : 'chip-off'; out['ap' + k] = s.area === k ? 'true' : 'false'; out['sa' + k] = () => { this.setState({ area: k }); if (this.autoEl) this.autoEl.scrollTo({ left: 0 }); }; }
    for (let i = 0; i < 9; i++) {
      const on = s.autos[i];
      out['show' + i] = s.area === 0 || AREA[i] === s.area;
      out['on' + i] = on ? 'true' : 'false';
      out['sw' + i] = on ? 'sw-on' : 'sw-off';
      out['acard' + i] = on ? 'acard-on' : 'acard-off';
      out['st' + i] = on ? 'Activa · tus agentes ya la están haciendo' : '';
      out['tog' + i] = () => { const a = this.state.autos.slice(); a[i] = !a[i]; this.setState({ autos: a }); };
    }
    for (let k = 0; k < 3; k++) { out['tab' + k] = s.tab === k; out['tsel' + k] = s.tab === k ? 'true' : 'false'; out['tcls' + k] = s.tab === k ? 'tab-on' : 'tab-off'; out['tset' + k] = () => this.setState({ tab: k }); }
    const nOn = s.autos.filter(Boolean).length;
    out.onCount = nOn; out.onBar = 'display: block; height: 100%; background: #D9B866; transition: width .5s; width: ' + Math.round(nOn / 9 * 100) + '%;';
    out.onMsg = nOn === 0 ? 'Prende una para empezar' : (nOn >= 9 ? '¡Todo en automático!' : 'Tu equipo ya se encarga de esto');
    out.meterFace = nOn >= 3 ? 'mface-happy' : '';
    out.setAutoRef = this.setAutoRef;
    out.autoNext = () => { this.autoHold = true; clearTimeout(this.hbT); this.hbT = setTimeout(() => { this.autoHold = false; }, 6000); if (this.autoEl) this.autoEl.scrollBy({ left: 378, behavior: 'smooth' }); };
    out.autoPrev = () => { this.autoHold = true; clearTimeout(this.hbT); this.hbT = setTimeout(() => { this.autoHold = false; }, 6000); if (this.autoEl) this.autoEl.scrollBy({ left: -378, behavior: 'smooth' }); };
    out.tourCls = s.tour >= 0 ? 'manual' : '';
    out.tourManual = s.tour >= 0;
    out.tourPlay = () => this.setState({ tour: -1 });
    for (let k = 0; k < 6; k++) { out['tn' + k] = s.tour === k ? 'tpick' : ''; out['ts' + k] = s.tour === k ? 'tpick' : ''; out['tg' + k] = () => this.setState({ tour: k }); }
    for (let k = 0; k < 6; k++) { out['fk' + k] = s.fk === k; out['fkc' + k] = s.fk === k ? 'fkon' : 'fkoff'; out['fkp' + k] = s.fk === k ? 'true' : 'false'; out['fks' + k] = () => this.setState({ fk: k }); }
    out.fkAgain = () => { const k = this.state.fk < 0 ? 0 : this.state.fk; this.setState({ fk: -1 }); clearTimeout(this.fkT); this.fkT = setTimeout(() => this.setState({ fk: k }), 40); };
    out.moreOpen = s.more; out.moreExp = s.more ? 'true' : 'false'; out.moreLbl = s.more ? 'Ver menos' : 'Y muchos más  +';
    out.moreTog = () => this.setState({ more: !this.state.more });
    out.cbNone = s.cb < 0;
    for (let k = 0; k < 4; k++) { out['cbs' + k] = s.cb === k; out['cb' + k] = () => this.setState({ cb: k }); }
    for (let k = 0; k < 2; k++) { out['waP' + k] = s.wa === k; out['waSel' + k] = s.wa === k ? 'true' : 'false'; out['waC' + k] = s.wa === k ? 'wtab-on' : 'wtab-off'; out['waT' + k] = () => this.setState({ wa: k }); }
    out.joinOpen = !!s.join; out.jForm = s.join === 'form'; out.jBiz = s.join === 'biz'; out.jDone = s.join === 'done';
    out.openJoin = () => this.setState({ join: this.state.sent ? 'done' : 'form' });
    out.joinClose = () => this.setState({ join: '' });
    out.joinStop = (e) => { if (e && e.stopPropagation) e.stopPropagation(); };
    out.joinSubmit = () => this.trySend(true);
    out.mailIn = (e) => { this.mailVal = e && e.target ? e.target.value : ''; if (this.state.mailErr) this.setState({ mailErr: false }); };
    out.mailKey = (e) => { if (e && e.key === 'Enter') { e.preventDefault(); this.trySend(false); } };
    out.joinKey = (e) => { if (e && e.key === 'Enter') { e.preventDefault(); this.trySend(true); } };
    out.mailErr = s.mailErr; out.mailInv = s.mailErr ? 'true' : 'false';
    out.mailBtn = s.jBusy ? 'Guardando…' : 'Quiero entrar';
    out.jBusy = s.jBusy; out.jBusyCls = s.jBusy ? 'busy' : '';
    out.jBtn = s.jBusy ? 'Guardando tu lugar…' : 'Quiero mi lugar →';
    out.jBtn2 = s.jBusy ? 'Guardando…' : 'Guardar mi lugar';
    out.jMailShow = s.mail || 'tu correo';
    out.joinDone = () => { try { if (window.agentceoWaitlist) window.agentceoWaitlist({ email: s.mail, business: ["Tienda online", "Ropa y moda", "Comida", "Servicios", "Empiezo de cero"][s.biz] || null }); } catch (e) {} clearTimeout(this.jT); this.setState({ jBusy: true }); this.jT = setTimeout(() => this.setState({ jBusy: false, join: 'done' }), 650); };
    for (let k = 0; k < 5; k++) { out['bz' + k] = s.biz === k ? 'bz-on' : 'bz-off'; out['bzp' + k] = s.biz === k ? 'true' : 'false'; out['bzs' + k] = () => this.setState({ biz: k }); }
    out.clonOn = s.clon ? 'true' : 'false'; out.clonSw = s.clon ? 'sw-on' : 'sw-off';
    out.clonTxt = s.clon ? 'Permiso activo. Lo puedes quitar cuando quieras.' : 'Permiso quitado. Tu vocero ya no usa tu cara ni tu voz.';
    out.clonTog = () => this.setState({ clon: !this.state.clon });
    return out;
  }

  render() {
    const View = this.props.view
    return <View v={this.renderVals()} />
  }
}
