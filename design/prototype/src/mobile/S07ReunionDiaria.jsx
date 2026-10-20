import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S07ReunionDiaria({ v }) {
  return (
    <><section aria-label="Reunión diaria" style={{padding: "64px 16px", display: "flex", flexDirection: "column", gap: "40px"}}>
<div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
<div data-rv=""><span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5E5C56"}}>Reunión diaria</span></div>
<h2 data-rv="" style={{"--d": "80ms", margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "38px", lineHeight: "1.04", letterSpacing: "-0.02em", color: "#111113", maxWidth: "900px"}}>Se reúnen solos. <span style={{fontStyle: "italic"}}>Tú lees el acta.</span></h2>
<p data-rv="" style={{"--d": "160ms", margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#5E5C56", maxWidth: "560px"}}>Cada mañana te cuentan qué hicieron y qué sigue. Y tus reuniones, grabadas y resumidas.</p>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "32px", alignItems: "stretch"}}><div aria-hidden="true" data-rv="" style={{position: "relative", width: "358px", height: "300px", margin: "0 auto"}}>
<div style={{position: "absolute", left: "18%", right: "18%", top: "32%", bottom: "26%", borderRadius: "50%", border: "1.5px solid #111113", background: "#FBFAF7"}}></div>
<div style={{position: "absolute", left: "50%", top: "52%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", color: "#5E5C56"}}><span className="rec" style={{width: "8px", height: "8px", borderRadius: "50%", background: "#B8923A"}}></span>REUNIÓN DIARIA</div>
<div style={{position: "absolute", left: "150px", top: "7px", width: "58px", display: "flex", flexDirection: "column", alignItems: "center"}}>
<div className="talk" style={{"--i": "0", position: "absolute", bottom: "calc(100% + 6px)", left: "50%", width: "max-content", maxWidth: "150px", transform: "translateX(-50%)", padding: "8px 12px", borderRadius: "14px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "11px", lineHeight: "1.35", color: "#111113", textAlign: "center", zIndex: "3"}}>Ayer vendimos más que el martes.</div>
<div className="talker" style={{"--i": "0"}}><svg className="mascot " aria-hidden="true" width="58" height="68" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.0s", "--bd": "0s"}}>
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
</div><div style={{position: "absolute", left: "13px", top: "97px", width: "58px", display: "flex", flexDirection: "column", alignItems: "center"}}>
<div className="talk" style={{"--i": "1", position: "absolute", bottom: "calc(100% + 6px)", left: "50%", width: "max-content", maxWidth: "150px", transform: "translateX(-50%)", padding: "8px 12px", borderRadius: "14px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "11px", lineHeight: "1.35", color: "#111113", textAlign: "center", zIndex: "3"}}>La camiseta negra se está acabando.</div>
<div className="talker" style={{"--i": "1"}}><svg className="mascot " aria-hidden="true" width="58" height="58" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.5s", "--bd": "-1s"}}>
<g className="eyeopen">
<ellipse data-eye="2.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div>
</div><div style={{position: "absolute", left: "286px", top: "97px", width: "58px", display: "flex", flexDirection: "column", alignItems: "center"}}>
<div className="talk" style={{"--i": "2", position: "absolute", bottom: "calc(100% + 6px)", left: "50%", width: "max-content", maxWidth: "150px", transform: "translateX(-50%)", padding: "8px 12px", borderRadius: "14px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "11px", lineHeight: "1.35", color: "#111113", textAlign: "center", zIndex: "3"}}>Tengo lista la campaña del viernes.</div>
<div className="talker" style={{"--i": "2"}}><svg className="mascot " aria-hidden="true" width="58" height="58" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "5.0s", "--bd": "-2s"}}>
<g className="eyeopen">
<ellipse data-eye="2.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div>
</div><div style={{position: "absolute", left: "49px", top: "229px", width: "58px", display: "flex", flexDirection: "column", alignItems: "center"}}>
<div className="talk" style={{"--i": "3", position: "absolute", bottom: "calc(100% + 6px)", left: "50%", width: "max-content", maxWidth: "150px", transform: "translateX(-50%)", padding: "8px 12px", borderRadius: "14px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "11px", lineHeight: "1.35", color: "#111113", textAlign: "center", zIndex: "3"}}>Tres clientes piden talla M.</div>
<div className="talker" style={{"--i": "3"}}><svg className="mascot " aria-hidden="true" width="58" height="58" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50 16a37 37 0 1 1-19.8 68.3L13 90l5.8-16.6A37 37 0 0 1 50 16z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "5.5s", "--bd": "-3s"}}>
<g className="eyeopen">
<ellipse data-eye="2.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div>
</div><div style={{position: "absolute", left: "250px", top: "229px", width: "58px", display: "flex", flexDirection: "column", alignItems: "center"}}>
<div className="talk" style={{"--i": "4", position: "absolute", bottom: "calc(100% + 6px)", left: "50%", width: "max-content", maxWidth: "150px", transform: "translateX(-50%)", padding: "8px 12px", borderRadius: "14px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "11px", lineHeight: "1.35", color: "#111113", textAlign: "center", zIndex: "3"}}>El anuncio nuevo va bien.</div>
<div className="talker" style={{"--i": "4"}}><svg className="mascot " aria-hidden="true" width="58" height="58" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "6.0s", "--bd": "-4s"}}>
<g className="eyeopen">
<ellipse data-eye="2.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></div>
</div>
</div><div data-rv="" style={{"--d": "150ms", background: "#FBFAF7", border: "1.5px solid #111113", borderRadius: "22px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "6px 6px 0 #111113"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", color: "#111113"}}>Acta de hoy</span><span style={{display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#7A5C17"}}><span className="rec" style={{width: "8px", height: "8px", borderRadius: "50%", background: "#B8923A"}}></span>grabando</span></div>
<div style={{display: "flex", alignItems: "center", gap: "3px", height: "34px"}}><span className="wbar" style={{"--i": "0", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "1", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "2", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "3", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "4", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "5", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "6", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "7", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "8", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "9", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "10", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "11", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "12", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "13", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "14", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "15", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "16", width: "4px", borderRadius: "2px", background: "#111113"}}></span><span className="wbar" style={{"--i": "17", width: "4px", borderRadius: "2px", background: "#111113"}}></span></div>
<div style={{display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#111113"}}>
<span className="aline" style={{"--i": "0", display: "flex", gap: "8px"}}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg>Pedir 40 camisetas negras (espera tu sí)</span>
<span className="aline" style={{"--i": "1", display: "flex", gap: "8px"}}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg>Campaña del viernes: lista</span>
<span className="aline" style={{"--i": "2", display: "flex", gap: "8px"}}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg>Responder a quienes piden talla M</span>
</div>
</div></div>
</section></>
  )
}
