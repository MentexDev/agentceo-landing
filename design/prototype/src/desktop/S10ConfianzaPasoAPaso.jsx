import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S10ConfianzaPasoAPaso({ v }) {
  return (
    <><section id="confianza" aria-label="Confianza paso a paso" style={{padding: "140px 96px", display: "flex", flexDirection: "column", gap: "40px"}}>
<div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
<div data-rv=""><span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5E5C56"}}>Confianza paso a paso</span></div>
<h2 data-rv="" style={{"--d": "80ms", margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "62px", lineHeight: "1.04", letterSpacing: "-0.02em", color: "#111113", maxWidth: "900px"}}>Lo hace bien 3 veces. <span style={{fontStyle: "italic"}}>Luego lo hace solo.</span></h2>
<p data-rv="" style={{"--d": "160ms", margin: "0", fontSize: "19px", lineHeight: "1.6", color: "#5E5C56", maxWidth: "560px"}}>Cada acierto es un escalón. Lo que cuesta dinero, siempre te lo pregunta. <span style={{color: "#7A5C17"}}>Toca «Salió bien».</span></p>
</div>
<div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "18px", alignItems: "stretch"}}><div data-rv="" className={s(v.t0row)} style={{"--d": "0ms", position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", background: "#FBFAF7", overflow: "hidden"}}>
<div style={{display: "flex", flexDirection: "column", gap: "4px", minHeight: "64px"}}><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "24px", lineHeight: "1.1", color: "#111113"}}>Responder preguntas por WhatsApp</span><span style={{fontSize: "13px", color: "#5E5C56"}}>{s(v.t0txt)}</span></div>
<div style={{position: "relative"}}>
<svg viewBox="0 0 240 150" width="100%" aria-hidden="true" style={{display: "block", overflow: "visible"}}>
<path d="M0 149h240" stroke="#111113" strokeWidth="2"></path>
<rect x="60" y="120" width="60" height="30" fill="#EFE4C8" stroke="#111113" strokeWidth="2"></rect>
<rect x="120" y="90" width="60" height="60" fill="#EFE4C8" stroke="#111113" strokeWidth="2"></rect>
<rect x="180" y="60" width="60" height="90" fill="#EFE4C8" stroke="#111113" strokeWidth="2"></rect>
<text x="90" y="140" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" fill="#111113">1</text>
<text x="150" y="125" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" fill="#111113">2</text>
<text x="210" y="110" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" fill="#111113">3</text>
<path d="M232 60V26" stroke="#111113" strokeWidth="2"></path><path className="flag" d="M232 26h-20l6 7-6 7h20z" fill="#B8923A" stroke="#111113" strokeWidth="1.5"></path>
</svg>
<div className={`climber ${s(v.t0lvl)}`} style={{position: "absolute", width: "21%"}}><svg className={`mascot ${s(v.t0face)}`} aria-hidden="true" width="48" height="48" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50 16a37 37 0 1 1-19.8 68.3L13 90l5.8-16.6A37 37 0 0 1 50 16z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "4s", "--bd": "0s"}}>
<g className="eyeopen">
<ellipse data-eye="2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div>
{(v.t0done) ? (<><div className="confetti" aria-hidden="true" style={{position: "absolute", left: "80%", top: "10%"}}><span className="cf" style={{"--a": "0deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "30deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "60deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "90deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "120deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "150deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "180deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "210deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "240deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "270deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "300deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "330deg", "--c": "#D9B866"}}></span></div></>) : null}
</div>
{(v.t0open) ? (<><button type="button" className="btn" onClick={v.t0inc} style={{minHeight: "46px", borderRadius: "999px", border: "0", background: "#111113", color: "#F4F2ED", font: "inherit", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg>Salió bien</button></>) : null}
{(v.t0done) ? (<><div className="stamp" style={{minHeight: "46px", borderRadius: "999px", border: "2px solid #7A5C17", color: "#7A5C17", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "13px", letterSpacing: "0.12em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}>★ YA LO HACE SOLO</div></>) : null}
</div><div data-rv="" className={s(v.t1row)} style={{"--d": "110ms", position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", background: "#FBFAF7", overflow: "hidden"}}>
<div style={{display: "flex", flexDirection: "column", gap: "4px", minHeight: "64px"}}><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "24px", lineHeight: "1.1", color: "#111113"}}>Publicar los posts de la semana</span><span style={{fontSize: "13px", color: "#5E5C56"}}>{s(v.t1txt)}</span></div>
<div style={{position: "relative"}}>
<svg viewBox="0 0 240 150" width="100%" aria-hidden="true" style={{display: "block", overflow: "visible"}}>
<path d="M0 149h240" stroke="#111113" strokeWidth="2"></path>
<rect x="60" y="120" width="60" height="30" fill="#EFE4C8" stroke="#111113" strokeWidth="2"></rect>
<rect x="120" y="90" width="60" height="60" fill="#EFE4C8" stroke="#111113" strokeWidth="2"></rect>
<rect x="180" y="60" width="60" height="90" fill="#EFE4C8" stroke="#111113" strokeWidth="2"></rect>
<text x="90" y="140" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" fill="#111113">1</text>
<text x="150" y="125" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" fill="#111113">2</text>
<text x="210" y="110" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" fill="#111113">3</text>
<path d="M232 60V26" stroke="#111113" strokeWidth="2"></path><path className="flag" d="M232 26h-20l6 7-6 7h20z" fill="#B8923A" stroke="#111113" strokeWidth="1.5"></path>
</svg>
<div className={`climber ${s(v.t1lvl)}`} style={{position: "absolute", width: "21%"}}><svg className={`mascot ${s(v.t1face)}`} aria-hidden="true" width="48" height="48" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "5s", "--bd": "-1s"}}>
<g className="eyeopen">
<ellipse data-eye="2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div>
{(v.t1done) ? (<><div className="confetti" aria-hidden="true" style={{position: "absolute", left: "80%", top: "10%"}}><span className="cf" style={{"--a": "0deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "30deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "60deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "90deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "120deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "150deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "180deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "210deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "240deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "270deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "300deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "330deg", "--c": "#D9B866"}}></span></div></>) : null}
</div>
{(v.t1open) ? (<><button type="button" className="btn" onClick={v.t1inc} style={{minHeight: "46px", borderRadius: "999px", border: "0", background: "#111113", color: "#F4F2ED", font: "inherit", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg>Salió bien</button></>) : null}
{(v.t1done) ? (<><div className="stamp" style={{minHeight: "46px", borderRadius: "999px", border: "2px solid #7A5C17", color: "#7A5C17", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "13px", letterSpacing: "0.12em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}>★ YA LO HACE SOLO</div></>) : null}
</div><div data-rv="" className={s(v.t2row)} style={{"--d": "220ms", position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", background: "#FBFAF7", overflow: "hidden"}}>
<div style={{display: "flex", flexDirection: "column", gap: "4px", minHeight: "64px"}}><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "24px", lineHeight: "1.1", color: "#111113"}}>Agendar reuniones en tu calendario</span><span style={{fontSize: "13px", color: "#5E5C56"}}>{s(v.t2txt)}</span></div>
<div style={{position: "relative"}}>
<svg viewBox="0 0 240 150" width="100%" aria-hidden="true" style={{display: "block", overflow: "visible"}}>
<path d="M0 149h240" stroke="#111113" strokeWidth="2"></path>
<rect x="60" y="120" width="60" height="30" fill="#EFE4C8" stroke="#111113" strokeWidth="2"></rect>
<rect x="120" y="90" width="60" height="60" fill="#EFE4C8" stroke="#111113" strokeWidth="2"></rect>
<rect x="180" y="60" width="60" height="90" fill="#EFE4C8" stroke="#111113" strokeWidth="2"></rect>
<text x="90" y="140" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" fill="#111113">1</text>
<text x="150" y="125" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" fill="#111113">2</text>
<text x="210" y="110" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="12" fill="#111113">3</text>
<path d="M232 60V26" stroke="#111113" strokeWidth="2"></path><path className="flag" d="M232 26h-20l6 7-6 7h20z" fill="#B8923A" stroke="#111113" strokeWidth="1.5"></path>
</svg>
<div className={`climber ${s(v.t2lvl)}`} style={{position: "absolute", width: "21%"}}><svg className={`mascot ${s(v.t2face)}`} aria-hidden="true" width="48" height="48" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M9 58a41 41 0 0 1 82 0" stroke="#111113" strokeWidth="5" fill="none"></path><rect x="17" y="22" width="66" height="66" rx="24" fill="#111113"></rect><rect x="5" y="50" width="12" height="20" rx="5" fill="#111113"></rect><rect x="83" y="50" width="12" height="20" rx="5" fill="#111113"></rect><path d="M89 70q0 16-18 16" stroke="#111113" strokeWidth="3" fill="none"></path><circle cx="70" cy="86" r="3.5" fill="#B8923A"></circle>
<g className="eyes" style={{"--bl": "6s", "--bd": "-2s"}}>
<g className="eyeopen">
<ellipse data-eye="2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div>
{(v.t2done) ? (<><div className="confetti" aria-hidden="true" style={{position: "absolute", left: "80%", top: "10%"}}><span className="cf" style={{"--a": "0deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "30deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "60deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "90deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "120deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "150deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "180deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "210deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "240deg", "--c": "#D9B866"}}></span><span className="cf" style={{"--a": "270deg", "--c": "#B8923A"}}></span><span className="cf" style={{"--a": "300deg", "--c": "#111113"}}></span><span className="cf" style={{"--a": "330deg", "--c": "#D9B866"}}></span></div></>) : null}
</div>
{(v.t2open) ? (<><button type="button" className="btn" onClick={v.t2inc} style={{minHeight: "46px", borderRadius: "999px", border: "0", background: "#111113", color: "#F4F2ED", font: "inherit", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg>Salió bien</button></>) : null}
{(v.t2done) ? (<><div className="stamp" style={{minHeight: "46px", borderRadius: "999px", border: "2px solid #7A5C17", color: "#7A5C17", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "13px", letterSpacing: "0.12em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}>★ YA LO HACE SOLO</div></>) : null}
</div></div>
</section></>
  )
}
