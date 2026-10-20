import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S02Inicio({ v }) {
  return (
    <><section id="top" aria-label="Inicio"><div style={{minHeight: "680px", boxSizing: "border-box", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 620px", gap: "40px", alignItems: "center", padding: "8px 64px 24px 96px"}}><div style={{display: "flex", flexDirection: "column", gap: "28px", alignItems: "flex-start", maxWidth: "600px"}}>
<div className="in" style={{"--i": "0", display: "inline-flex", alignItems: "center", gap: "10px", padding: "6px 14px 6px 8px", borderRadius: "999px", border: "1.5px solid rgba(17,17,19,0.22)", fontSize: "13px", color: "#111113"}}><span style={{padding: "3px 8px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: "0.1em"}}>NUEVO</span>Un equipo de IA para tu negocio</div>
<h1 style={{margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "84px", lineHeight: "1", letterSpacing: "-0.02em", color: "#111113"}}><span className="in" style={{"--i": "1", display: "block", whiteSpace: "nowrap"}}>Empleados de IA</span><span className="in" style={{"--i": "2", display: "block", fontStyle: "italic"}}>que <span className="scribble">venden</span> por ti.</span></h1>
<p className="in" style={{"--i": "3", margin: "0", fontSize: "20px", lineHeight: "1.55", color: "#5E5C56", maxWidth: "520px"}}>Venden por WhatsApp, publican en redes, cuidan tu inventario y te construyen tu web. <span style={{color: "#111113"}}>Tú solo apruebas lo importante.</span></p>
<div className="in" style={{"--i": "4", width: "100%", display: "flex", flexDirection: "column", gap: "10px"}}>{(v.notSent) ? (<>
<div style={{display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "480px"}}>
<div className="mailbox" style={{display: "flex", flexDirection: "row", gap: "8px", width: "100%", padding: "6px", borderRadius: "999px", border: "1.5px solid #111113", boxSizing: "border-box"}}>
<label htmlFor="correo-hd" style={{position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)"}}>Tu correo</label>
<input id="correo-hd" type="email" placeholder="tu@correo.com" autoComplete="email" onInput={v.mailIn} onKeyDown={v.mailKey} aria-invalid={s(v.mailInv)} style={{flexGrow: "1", minHeight: "48px", padding: "0 18px", border: "0", borderRadius: "999px", background: "transparent", color: "#111113", font: "inherit", fontSize: "16px", outline: "none"}} />
<button className="btn" type="button" onClick={v.submit} style={{minHeight: "48px", padding: "0 22px", borderRadius: "999px", border: "0", background: "#111113", color: "#F4F2ED", font: "inherit", fontSize: "15px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap"}}>{s(v.mailBtn)}</button>
</div>
{(v.mailErr) ? (<><span role="alert" className="pop" style={{fontSize: "13px", color: "#B4412B", paddingLeft: "18px"}}>Escribe un correo válido, por ejemplo tu@correo.com</span></>) : null}
</div>
</>) : null}
{(v.sent) ? (<>
<div role="status" className="pop" style={{display: "flex", alignItems: "center", gap: "10px", padding: "14px 20px", borderRadius: "999px", border: "1.5px solid #111113", color: "#111113", fontSize: "15px"}}><span style={{width: "22px", height: "22px", borderRadius: "50%", background: "#B8923A", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Listo, estás en la lista. Te avisamos cuando sea tu turno.</div>
</>) : null}<span style={{fontSize: "13px", color: "#6f6d66"}}>Abrimos por grupos. Apúntate hoy.</span></div>
</div><div style={{position: "relative", width: "620px", height: "620px", flexShrink: "0", margin: "0 auto"}}>
<div className="orbit" aria-hidden="true" style={{position: "absolute", inset: "0"}}>
<div style={{position: "absolute", left: "50%", top: "50%", width: "470px", height: "470px", margin: "-235px 0 0 -235px", border: "1.5px dashed rgba(17,17,19,0.22)", borderRadius: "50%"}}></div>
<div className="spinner" style={{position: "absolute", inset: "0"}}><div className="orb-item" style={{position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transform: "rotate(30deg) translateX(235px) rotate(-30deg)"}}><div className="counter-spin" style={{position: "absolute", left: "-32px", top: "-32px"}}><div className="bobble" style={{"--i": "0"}}><svg className="mascot " aria-hidden="true" width="64" height="64" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "3.5s", "--bd": "0s"}}>
<g className="eyeopen">
<ellipse data-eye="2.4" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.4" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div></div></div><div className="orb-item" style={{position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transform: "rotate(90deg) translateX(235px) rotate(-90deg)"}}><div className="counter-spin" style={{position: "absolute", left: "-32px", top: "-32px"}}><div className="bobble" style={{"--i": "1"}}><svg className="mascot " aria-hidden="true" width="64" height="64" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "4.1s", "--bd": "-1s"}}>
<g className="eyeopen">
<ellipse data-eye="2.4" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.4" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div></div></div><div className="orb-item" style={{position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transform: "rotate(150deg) translateX(235px) rotate(-150deg)"}}><div className="counter-spin" style={{position: "absolute", left: "-32px", top: "-32px"}}><div className="bobble" style={{"--i": "2"}}><svg className="mascot " aria-hidden="true" width="64" height="64" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50 16a37 37 0 1 1-19.8 68.3L13 90l5.8-16.6A37 37 0 0 1 50 16z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "4.7s", "--bd": "-2s"}}>
<g className="eyeopen">
<ellipse data-eye="2.4" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.4" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div></div></div><div className="orb-item" style={{position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transform: "rotate(210deg) translateX(235px) rotate(-210deg)"}}><div className="counter-spin" style={{position: "absolute", left: "-32px", top: "-32px"}}><div className="bobble" style={{"--i": "3"}}><svg className="mascot " aria-hidden="true" width="64" height="64" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "5.3s", "--bd": "-3s"}}>
<g className="eyeopen">
<ellipse data-eye="2.4" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.4" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div></div></div><div className="orb-item" style={{position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transform: "rotate(270deg) translateX(235px) rotate(-270deg)"}}><div className="counter-spin" style={{position: "absolute", left: "-32px", top: "-32px"}}><div className="bobble" style={{"--i": "4"}}><svg className="mascot " aria-hidden="true" width="64" height="64" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M9 58a41 41 0 0 1 82 0" stroke="#111113" strokeWidth="5" fill="none"></path><rect x="17" y="22" width="66" height="66" rx="24" fill="#111113"></rect><rect x="5" y="50" width="12" height="20" rx="5" fill="#111113"></rect><rect x="83" y="50" width="12" height="20" rx="5" fill="#111113"></rect><path d="M89 70q0 16-18 16" stroke="#111113" strokeWidth="3" fill="none"></path><circle cx="70" cy="86" r="3.5" fill="#B8923A"></circle>
<g className="eyes" style={{"--bl": "5.9s", "--bd": "-4s"}}>
<g className="eyeopen">
<ellipse data-eye="2.4" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.4" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div></div></div><div className="orb-item" style={{position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transform: "rotate(330deg) translateX(235px) rotate(-330deg)"}}><div className="counter-spin" style={{position: "absolute", left: "-32px", top: "-32px"}}><div className="bobble" style={{"--i": "5"}}><svg className="mascot " aria-hidden="true" width="64" height="64" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50.0 19.0 L58.2 11.8 L66.1 14.2 L68.9 24.7 L74.0 29.0 L84.9 29.7 L88.8 36.9 L83.3 46.4 L84.0 53.0 L91.2 61.2 L88.8 69.1 L78.3 71.9 L74.0 77.0 L73.3 87.9 L66.1 91.8 L56.6 86.3 L50.0 87.0 L41.8 94.2 L33.9 91.8 L31.1 81.3 L26.0 77.0 L15.1 76.3 L11.2 69.1 L16.7 59.6 L16.0 53.0 L8.8 44.8 L11.2 36.9 L21.7 34.1 L26.0 29.0 L26.7 18.1 L33.9 14.2 L43.4 19.7Z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "6.5s", "--bd": "-5s"}}>
<g className="eyeopen">
<ellipse data-eye="2.4" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.4" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div></div></div></div>
</div>
<div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -56%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", zIndex: "2"}}>
<div className="bubble" aria-live="polite" style={{position: "relative", padding: "10px 16px", borderRadius: "18px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", color: "#111113", whiteSpace: "nowrap", boxShadow: "4px 4px 0 #111113"}}>{s(v.ceoMsg)}<span style={{position: "absolute", left: "50%", bottom: "-8px", width: "14px", height: "14px", marginLeft: "-7px", background: "#FBFAF7", borderRight: "1.5px solid #111113", borderBottom: "1.5px solid #111113", transform: "rotate(45deg)"}}></span></div>
<button type="button" className="ceo-btn" onClick={v.ceoTap} aria-label="Tocar a tu CEO" style={{background: "none", border: "0", padding: "0", cursor: "pointer"}}><svg className={`mascot ${s(v.ceoCls)}`} role="img" aria-label="Tu CEO, la mascota de Agent CEO" width="250" height="295" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.2s", "--bd": "-0.5s"}}>
<g className="eyeopen">
<ellipse data-eye="4.2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="4.2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg></button>
</div>
</div></div></section></>
  )
}
