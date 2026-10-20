import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S21VentanaUnion({ v }) {
  return (
    <>{(v.joinOpen) ? (<>
<div className="jover" onClick={v.joinClose} style={{position: "fixed", inset: "0", zIndex: "200", background: "rgba(17,17,19,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", boxSizing: "border-box"}}>
<div className="jcard" role="dialog" aria-modal="true" aria-label="Únete a la lista de espera" onClick={v.joinStop} style={{position: "relative", width: "100%", maxWidth: "440px", maxHeight: "100%", overflowY: "auto", borderRadius: "30px", background: "#F4F2ED", border: "1.5px solid #111113", boxShadow: "12px 12px 0 #B8923A", display: "grid", gridTemplateColumns: "minmax(0, 1fr)"}}>
<button type="button" onClick={v.joinClose} aria-label="Cerrar" style={{position: "absolute", top: "14px", right: "14px", zIndex: "3", width: "40px", height: "40px", borderRadius: "50%", border: "1.5px solid #111113", background: "#F4F2ED", color: "#111113", fontSize: "18px", cursor: "pointer"}}>×</button>
<div style={{position: "relative", background: "#111113", display: "none", flexDirection: "column", justifyContent: "space-between", padding: "32px", overflow: "hidden"}}>
<span style={{alignSelf: "flex-start", padding: "4px 10px", borderRadius: "999px", background: "#D9B866", color: "#111113", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em"}}>LISTA DE ESPERA</span>
<div className="jmasc" style={{alignSelf: "center"}}><svg className={`mascot ${s(v.ceoCls)}`} aria-hidden="true" width="170" height="201" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#F4F2ED" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#F4F2ED"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="3.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#F4F2ED"></circle>
<ellipse data-eye="3.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#F4F2ED"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#111113" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg></div>
<div className="orbit-mini" aria-hidden="true" style={{display: "flex", justifyContent: "center", gap: "10px"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#F4F2ED"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4s", "--bd": "0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#F4F2ED"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#F4F2ED"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#111113" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#F4F2ED"></circle>
<g className="eyes" style={{"--bl": "5s", "--bd": "-1s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#F4F2ED"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#F4F2ED"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#111113" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50 16a37 37 0 1 1-19.8 68.3L13 90l5.8-16.6A37 37 0 0 1 50 16z" fill="#F4F2ED"></path>
<g className="eyes" style={{"--bl": "6s", "--bd": "-2s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#F4F2ED"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#F4F2ED"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#111113" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#F4F2ED"></rect>
<g className="eyes" style={{"--bl": "7s", "--bd": "-3s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#F4F2ED"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#F4F2ED"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#111113" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div>
</div>
<div style={{padding: "28px 20px", display: "flex", flexDirection: "column", gap: "18px"}}>
{(v.jForm) ? (<>
<div className="pop" style={{display: "flex", flexDirection: "column", gap: "18px"}}>
<h2 style={{margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "34px", lineHeight: "1.02", letterSpacing: "-0.02em", color: "#111113"}}>Tu equipo de IA <span style={{fontStyle: "italic"}}>te está esperando.</span></h2>
<p style={{margin: "0", fontSize: "16px", lineHeight: "1.55", color: "#5E5C56"}}>Abrimos por grupos. Los primeros de la lista entran primero.</p>
<ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "10px"}}><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}><span style={{marginTop: "2px", width: "20px", height: "20px", borderRadius: "50%", background: "#D9B866", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0"}}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Entras antes que nadie, apenas abra tu grupo.</li><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}><span style={{marginTop: "2px", width: "20px", height: "20px", borderRadius: "50%", background: "#D9B866", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0"}}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Tu CEO te arma el equipo en una charla.</li><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}><span style={{marginTop: "2px", width: "20px", height: "20px", borderRadius: "50%", background: "#D9B866", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0"}}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Sin tarjeta. Solo tu correo.</li></ul>
<div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
<label htmlFor="jmail-m" style={{fontSize: "13px", color: "#111113"}}>Tu correo</label>
<input id="jmail-m" type="email" placeholder="tu@correo.com" autoComplete="email" onInput={v.mailIn} onKeyDown={v.joinKey} aria-invalid={s(v.mailInv)} className="jinput" style={{minHeight: "54px", padding: "0 20px", borderRadius: "16px", border: "1.5px solid #111113", background: "#fff", color: "#111113", font: "inherit", fontSize: "16px"}} />
{(v.mailErr) ? (<><span role="alert" className="pop" style={{fontSize: "13px", color: "#B4412B"}}>Escribe un correo válido, por ejemplo tu@correo.com</span></>) : null}
<button className={`btn jcta ${s(v.jBusyCls)}`} type="button" onClick={v.joinSubmit} style={{minHeight: "56px", borderRadius: "16px", border: "0", background: "#111113", color: "#F4F2ED", font: "inherit", fontSize: "17px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}>{(v.jBusy) ? (<><span className="spin2" aria-hidden="true"></span></>) : null}{s(v.jBtn)}</button>
<span style={{fontSize: "12px", color: "#5E5C56", textAlign: "center"}}>Sin spam. Solo te escribimos cuando abra tu grupo.</span>
</div>
</div>
</>) : null}
{(v.jBiz) ? (<>
<div className="pop" style={{display: "flex", flexDirection: "column", gap: "18px"}}>
<span style={{display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#7A5C17"}}><span style={{width: "18px", height: "18px", borderRadius: "50%", background: "#D9B866", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>CORREO GUARDADO · PASO 2 DE 2</span>
<h2 style={{margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "34px", lineHeight: "1.02", color: "#111113"}}>¡Casi! ¿Qué negocio <span style={{fontStyle: "italic"}}>tienes?</span></h2>
<p style={{margin: "0", fontSize: "15px", color: "#5E5C56"}}>Así tu CEO llega preparado a la primera charla.</p>
<div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}><button type="button" className={s(v.bz0)} onClick={v.bzs0} aria-pressed={s(v.bzp0)} style={{minHeight: "44px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Tienda online</button><button type="button" className={s(v.bz1)} onClick={v.bzs1} aria-pressed={s(v.bzp1)} style={{minHeight: "44px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Ropa y moda</button><button type="button" className={s(v.bz2)} onClick={v.bzs2} aria-pressed={s(v.bzp2)} style={{minHeight: "44px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Comida</button><button type="button" className={s(v.bz3)} onClick={v.bzs3} aria-pressed={s(v.bzp3)} style={{minHeight: "44px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Servicios</button><button type="button" className={s(v.bz4)} onClick={v.bzs4} aria-pressed={s(v.bzp4)} style={{minHeight: "44px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Empiezo de cero</button></div>
<button type="button" className={`btn jcta ${s(v.jBusyCls)}`} onClick={v.joinDone} style={{minHeight: "56px", borderRadius: "16px", border: "0", background: "#111113", color: "#F4F2ED", font: "inherit", fontSize: "17px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"}}>{(v.jBusy) ? (<><span className="spin2" aria-hidden="true"></span></>) : null}{s(v.jBtn2)}</button>
</div>
</>) : null}
{(v.jDone) ? (<>
<div className="pop" style={{position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px"}}>
<div className="confetti" aria-hidden="true" style={{position: "absolute", left: "40px", top: "30px"}}><span className="cf" style={{"--a": "0deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "24deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "48deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "72deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "96deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "120deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "144deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "168deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "192deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "216deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "240deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "264deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "288deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "312deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "336deg", "--c": "#B8923A"}}></span></div>
<div className="jumpy"><svg className="mascot happy" aria-hidden="true" width="84" height="99" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="2.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg></div>
<h2 style={{margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "34px", lineHeight: "1.02", color: "#111113"}}>¡Estás <span style={{fontStyle: "italic", color: "#7A5C17"}}>dentro!</span></h2>
<div style={{display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "999px", background: "#EFE4C8", fontSize: "13px", color: "#111113"}}>✉ {s(v.jMailShow)}</div><p role="status" style={{margin: "0", fontSize: "16px", lineHeight: "1.55", color: "#5E5C56"}}>Guardamos tu lugar. Te escribimos apenas abra tu grupo, y tu CEO te estará esperando.</p>
<button type="button" className="ghost" onClick={v.joinClose} style={{minHeight: "48px", padding: "0 22px", borderRadius: "999px", border: "1.5px solid #111113", background: "transparent", color: "#111113", font: "inherit", fontSize: "15px", cursor: "pointer"}}>Seguir viendo</button>
</div>
</>) : null}
</div>
</div>
</div>
</>) : null}</>
  )
}
