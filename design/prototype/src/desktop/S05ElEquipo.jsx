import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S05ElEquipo({ v }) {
  return (
    <><section id="equipo" aria-label="El equipo" style={{padding: "140px 96px", display: "flex", flexDirection: "column", gap: "56px"}}>
<div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: "20px"}}>
<div style={{display: "flex", flexDirection: "column", gap: "16px"}}><div data-rv=""><span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5E5C56"}}>El equipo</span></div><h2 data-rv="" style={{"--d": "80ms", margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "62px", lineHeight: "1.04", letterSpacing: "-0.02em", color: "#111113"}}>Cada uno, <span style={{fontStyle: "italic"}}>experto en algo.</span></h2></div>
<p data-rv="" style={{"--d": "160ms", margin: "0", fontSize: "19px", lineHeight: "1.55", color: "#5E5C56", maxWidth: "380px"}}>Ventas, contenido, inventario, clientes. Pasa el mouse para ver qué hace cada uno.</p>
</div>
<div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px"}}><button type="button" className={s(v.a0)} onClick={v.poke0} data-rv="" style={{"--d": "0ms", position: "relative", textAlign: "left", font: "inherit", color: "#111113", background: "#FBFAF7", border: "1.5px solid #111113", borderRadius: "24px", padding: "20px 22px 26px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "14px"}}>
<span className="now" style={{position: "absolute", top: "16px", right: "16px", display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "12px", zIndex: "2"}}><span className="live" style={{width: "6px", height: "6px", borderRadius: "50%", background: "#B8923A"}}></span>Ahora: contando camisetas</span>
<span style={{display: "block", width: "100%"}}><svg aria-hidden="true" viewBox="0 0 260 170" width="100%" style={{display: "block", overflow: "visible"}}>
<path d="M0 150h260" stroke="rgba(17,17,19,0.22)" strokeWidth="1.5"></path>
<svg x="8" y="40" className="mascot work" aria-hidden="true" width="110" height="110" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "3.8s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="3.2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="3.2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg>
<g>
<rect x="148" y="112" width="40" height="34" rx="3" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></rect><path d="M148 122h40M168 112v10" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path>
<rect x="194" y="112" width="40" height="34" rx="3" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></rect><path d="M194 122h40M214 112v10" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path>
<rect x="171" y="76" width="40" height="34" rx="3" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></rect><path d="M171 86h40M191 76v10" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path>
<g className="drop"><rect x="171" y="40" width="40" height="34" rx="3" fill="#B8923A" stroke="#111113" strokeWidth="2.5"></rect><path d="M171 50h40M191 40v10" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path></g>
</g>
</svg></span>
<span style={{display: "flex", flexDirection: "column", gap: "6px"}}>
<span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "30px", lineHeight: "1.05"}}>Encargado de inventario</span>
<span style={{fontSize: "15px", lineHeight: "1.5", color: "#5E5C56"}}>Cuenta lo que tienes y te avisa antes de que algo se acabe.</span>
</span>
<span className="hi" aria-hidden="true" style={{position: "absolute", left: "22px", top: "26px", padding: "6px 12px", borderRadius: "12px", background: "#B8923A", color: "#fff", fontSize: "13px", fontWeight: "500"}}>¡Hola, jefe!</span>
</button><button type="button" className={s(v.a1)} onClick={v.poke1} data-rv="" style={{"--d": "90ms", position: "relative", textAlign: "left", font: "inherit", color: "#111113", background: "#FBFAF7", border: "1.5px solid #111113", borderRadius: "24px", padding: "20px 22px 26px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "14px"}}>
<span className="now" style={{position: "absolute", top: "16px", right: "16px", display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "12px", zIndex: "2"}}><span className="live" style={{width: "6px", height: "6px", borderRadius: "50%", background: "#B8923A"}}></span>Ahora: editando el post del viernes</span>
<span style={{display: "block", width: "100%"}}><svg aria-hidden="true" viewBox="0 0 260 170" width="100%" style={{display: "block", overflow: "visible"}}>
<path d="M0 150h260" stroke="rgba(17,17,19,0.22)" strokeWidth="1.5"></path>
<svg x="8" y="40" className="mascot work" aria-hidden="true" width="110" height="110" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "4.5s", "--bd": "-0.9s"}}>
<g className="eyeopen">
<ellipse data-eye="3.2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="3.2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg>
<g>
<rect x="160" y="36" width="62" height="110" rx="12" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></rect><path d="M183 44h16" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path>
<rect className="shot" x="168" y="56" width="46" height="46" rx="6" fill="#111113"></rect>
<path d="M170 114h40M170 124h26" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path>
<path className="heart h1" d="M226 70c-4-6-12-3-10 3 1 4 10 9 10 9s9-5 10-9c2-6-6-9-10-3z" fill="#B8923A"></path>
<path className="heart h2" d="M142 84c-4-6-12-3-10 3 1 4 10 9 10 9s9-5 10-9c2-6-6-9-10-3z" fill="#B8923A"></path>
<path className="heart h3" d="M232 110c-3-5-10-2-8 2 1 3 8 7 8 7s7-4 8-7c2-4-5-7-8-2z" fill="#111113"></path>
</g>
</svg></span>
<span style={{display: "flex", flexDirection: "column", gap: "6px"}}>
<span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "30px", lineHeight: "1.05"}}>Creador de contenido</span>
<span style={{fontSize: "15px", lineHeight: "1.5", color: "#5E5C56"}}>Prepara y publica tus posts en redes sociales.</span>
</span>
<span className="hi" aria-hidden="true" style={{position: "absolute", left: "22px", top: "26px", padding: "6px 12px", borderRadius: "12px", background: "#B8923A", color: "#fff", fontSize: "13px", fontWeight: "500"}}>¡Hola, jefe!</span>
</button><button type="button" className={s(v.a2)} onClick={v.poke2} data-rv="" style={{"--d": "180ms", position: "relative", textAlign: "left", font: "inherit", color: "#111113", background: "#FBFAF7", border: "1.5px solid #111113", borderRadius: "24px", padding: "20px 22px 26px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "14px"}}>
<span className="now" style={{position: "absolute", top: "16px", right: "16px", display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "12px", zIndex: "2"}}><span className="live" style={{width: "6px", height: "6px", borderRadius: "50%", background: "#B8923A"}}></span>Ahora: respondiéndole a Laura</span>
<span style={{display: "block", width: "100%"}}><svg aria-hidden="true" viewBox="0 0 260 170" width="100%" style={{display: "block", overflow: "visible"}}>
<path d="M0 150h260" stroke="rgba(17,17,19,0.22)" strokeWidth="1.5"></path>
<svg x="8" y="40" className="mascot work" aria-hidden="true" width="110" height="110" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50 16a37 37 0 1 1-19.8 68.3L13 90l5.8-16.6A37 37 0 0 1 50 16z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "5.199999999999999s", "--bd": "-1.8s"}}>
<g className="eyeopen">
<ellipse data-eye="3.2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="3.2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg>
<g>
<g className="bub b1"><rect x="138" y="34" width="96" height="30" rx="15" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></rect><path d="M152 49h50" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path></g>
<g className="bub b2"><rect x="158" y="74" width="84" height="30" rx="15" fill="#111113"></rect><path d="M172 89h40" stroke="#F4F2ED" strokeWidth="2.5" strokeLinecap="round"></path></g>
<g className="bub b3"><rect x="138" y="114" width="60" height="26" rx="13" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></rect><circle className="td" cx="156" cy="127" r="3" fill="#111113"></circle><circle className="td td2" cx="168" cy="127" r="3" fill="#111113"></circle><circle className="td td3" cx="180" cy="127" r="3" fill="#111113"></circle></g>
</g>
</svg></span>
<span style={{display: "flex", flexDirection: "column", gap: "6px"}}>
<span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "30px", lineHeight: "1.05"}}>Vendedor de WhatsApp</span>
<span style={{fontSize: "15px", lineHeight: "1.5", color: "#5E5C56"}}>Responde a tus clientes y cierra ventas, a cualquier hora.</span>
</span>
<span className="hi" aria-hidden="true" style={{position: "absolute", left: "22px", top: "26px", padding: "6px 12px", borderRadius: "12px", background: "#B8923A", color: "#fff", fontSize: "13px", fontWeight: "500"}}>¡Hola, jefe!</span>
</button><button type="button" className={s(v.a3)} onClick={v.poke3} data-rv="" style={{"--d": "60ms", position: "relative", textAlign: "left", font: "inherit", color: "#111113", background: "#FBFAF7", border: "1.5px solid #111113", borderRadius: "24px", padding: "20px 22px 26px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "14px"}}>
<span className="now" style={{position: "absolute", top: "16px", right: "16px", display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "12px", zIndex: "2"}}><span className="live" style={{width: "6px", height: "6px", borderRadius: "50%", background: "#B8923A"}}></span>Ahora: comparando dos anuncios</span>
<span style={{display: "block", width: "100%"}}><svg aria-hidden="true" viewBox="0 0 260 170" width="100%" style={{display: "block", overflow: "visible"}}>
<path d="M0 150h260" stroke="rgba(17,17,19,0.22)" strokeWidth="1.5"></path>
<svg x="8" y="40" className="mascot work" aria-hidden="true" width="110" height="110" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "5.8999999999999995s", "--bd": "-2.7s"}}>
<g className="eyeopen">
<ellipse data-eye="3.2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="3.2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg>
<g>
<path d="M140 90v-24l38-16v56z" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path><path d="M140 66h-6v24h6M148 90l4 18h10l-4-17" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path>
<path className="wv w1" d="M188 66q8 12 0 24" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path><path className="wv w2" d="M196 60q12 18 0 36" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path>
<rect className="gb g1" x="210" y="112" width="9" height="34" rx="2" fill="#111113"></rect>
<rect className="gb g2" x="223" y="100" width="9" height="46" rx="2" fill="#B8923A"></rect>
<rect className="gb g3" x="236" y="120" width="9" height="26" rx="2" fill="#111113"></rect>
</g>
</svg></span>
<span style={{display: "flex", flexDirection: "column", gap: "6px"}}>
<span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "30px", lineHeight: "1.05"}}>Experto en publicidad</span>
<span style={{fontSize: "15px", lineHeight: "1.5", color: "#5E5C56"}}>Maneja tus anuncios y te dice cuáles funcionan.</span>
</span>
<span className="hi" aria-hidden="true" style={{position: "absolute", left: "22px", top: "26px", padding: "6px 12px", borderRadius: "12px", background: "#B8923A", color: "#fff", fontSize: "13px", fontWeight: "500"}}>¡Hola, jefe!</span>
</button><button type="button" className={s(v.a4)} onClick={v.poke4} data-rv="" style={{"--d": "150ms", position: "relative", textAlign: "left", font: "inherit", color: "#111113", background: "#FBFAF7", border: "1.5px solid #111113", borderRadius: "24px", padding: "20px 22px 26px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "14px"}}>
<span className="now" style={{position: "absolute", top: "16px", right: "16px", display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "12px", zIndex: "2"}}><span className="live" style={{width: "6px", height: "6px", borderRadius: "50%", background: "#B8923A"}}></span>Ahora: cerrando un reclamo</span>
<span style={{display: "block", width: "100%"}}><svg aria-hidden="true" viewBox="0 0 260 170" width="100%" style={{display: "block", overflow: "visible"}}>
<path d="M0 150h260" stroke="rgba(17,17,19,0.22)" strokeWidth="1.5"></path>
<svg x="8" y="40" className="mascot work" aria-hidden="true" width="110" height="110" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M9 58a41 41 0 0 1 82 0" stroke="#111113" strokeWidth="5" fill="none"></path><rect x="17" y="22" width="66" height="66" rx="24" fill="#111113"></rect><rect x="5" y="50" width="12" height="20" rx="5" fill="#111113"></rect><rect x="83" y="50" width="12" height="20" rx="5" fill="#111113"></rect><path d="M89 70q0 16-18 16" stroke="#111113" strokeWidth="3" fill="none"></path><circle cx="70" cy="86" r="3.5" fill="#B8923A"></circle>
<g className="eyes" style={{"--bl": "6.6s", "--bd": "-3.6s"}}>
<g className="eyeopen">
<ellipse data-eye="3.2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="3.2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg>
<g>
<path d="M140 146h100" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path><rect x="206" y="104" width="38" height="42" rx="4" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></rect>
<g className="tk"><rect x="136" y="60" width="54" height="36" rx="5" fill="#FBFAF7" stroke="#111113" strokeWidth="2.5"></rect><path d="M145 72h26M145 82h18" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path></g>
<g className="tkdone"><circle cx="225" cy="84" r="13" fill="#B8923A"></circle><path d="M219 84l4 4 8-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></g>
</g>
</svg></span>
<span style={{display: "flex", flexDirection: "column", gap: "6px"}}>
<span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "30px", lineHeight: "1.05"}}>Atención al cliente</span>
<span style={{fontSize: "15px", lineHeight: "1.5", color: "#5E5C56"}}>Resuelve dudas, cambios y reclamos con paciencia infinita.</span>
</span>
<span className="hi" aria-hidden="true" style={{position: "absolute", left: "22px", top: "26px", padding: "6px 12px", borderRadius: "12px", background: "#B8923A", color: "#fff", fontSize: "13px", fontWeight: "500"}}>¡Hola, jefe!</span>
</button><button type="button" className={s(v.a5)} onClick={v.poke5} data-rv="" style={{"--d": "240ms", position: "relative", textAlign: "left", font: "inherit", color: "#111113", background: "#FBFAF7", border: "1.5px solid #111113", borderRadius: "24px", padding: "20px 22px 26px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "14px"}}>
<span className="now" style={{position: "absolute", top: "16px", right: "16px", display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "12px", zIndex: "2"}}><span className="live" style={{width: "6px", height: "6px", borderRadius: "50%", background: "#B8923A"}}></span>Ahora: revisando tres pedidos</span>
<span style={{display: "block", width: "100%"}}><svg aria-hidden="true" viewBox="0 0 260 170" width="100%" style={{display: "block", overflow: "visible"}}>
<path d="M0 150h260" stroke="rgba(17,17,19,0.22)" strokeWidth="1.5"></path>
<svg x="8" y="40" className="mascot work" aria-hidden="true" width="110" height="110" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50.0 19.0 L58.2 11.8 L66.1 14.2 L68.9 24.7 L74.0 29.0 L84.9 29.7 L88.8 36.9 L83.3 46.4 L84.0 53.0 L91.2 61.2 L88.8 69.1 L78.3 71.9 L74.0 77.0 L73.3 87.9 L66.1 91.8 L56.6 86.3 L50.0 87.0 L41.8 94.2 L33.9 91.8 L31.1 81.3 L26.0 77.0 L15.1 76.3 L11.2 69.1 L16.7 59.6 L16.0 53.0 L8.8 44.8 L11.2 36.9 L21.7 34.1 L26.0 29.0 L26.7 18.1 L33.9 14.2 L43.4 19.7Z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "7.3s", "--bd": "-4.5s"}}>
<g className="eyeopen">
<ellipse data-eye="3.2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="3.2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg>
<g>
<g className="spin" style={{transformOrigin: "188px 80px"}}><path d="M188.0 56.0 L194.0 49.6 L199.9 51.4 L201.3 60.0 L205.0 63.0 L213.8 62.8 L216.6 68.1 L211.5 75.3 L212.0 80.0 L218.4 86.0 L216.6 91.9 L208.0 93.3 L205.0 97.0 L205.2 105.8 L199.9 108.6 L192.7 103.5 L188.0 104.0 L182.0 110.4 L176.1 108.6 L174.7 100.0 L171.0 97.0 L162.2 97.2 L159.4 91.9 L164.5 84.7 L164.0 80.0 L157.6 74.0 L159.4 68.1 L168.0 66.7 L171.0 63.0 L170.8 54.2 L176.1 51.4 L183.3 56.5Z" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></path><circle cx="188" cy="80" r="9" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></circle></g>
<g className="spin rev" style={{transformOrigin: "228px 50px"}}><path d="M228.0 37.0 L232.0 32.5 L235.8 33.8 L236.1 39.8 L238.2 41.9 L244.2 42.2 L245.5 46.0 L241.0 50.0 L240.7 52.9 L244.2 57.8 L242.1 61.2 L236.1 60.2 L233.6 61.7 L232.0 67.5 L228.0 68.0 L225.1 62.7 L222.4 61.7 L216.8 64.1 L213.9 61.2 L216.3 55.6 L215.3 52.9 L210.0 50.0 L210.5 46.0 L216.3 44.4 L217.8 41.9 L216.8 35.9 L220.2 33.8 L225.1 37.3Z" fill="#111113"></path><circle cx="228" cy="50" r="5" fill="#F4F2ED"></circle></g>
<rect x="140" y="130" width="104" height="10" rx="5" stroke="#111113" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"></rect><rect className="pbar" x="142" y="132" width="100" height="6" rx="3" fill="#B8923A"></rect>
</g>
</svg></span>
<span style={{display: "flex", flexDirection: "column", gap: "6px"}}>
<span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "30px", lineHeight: "1.05"}}>Jefe de producción</span>
<span style={{fontSize: "15px", lineHeight: "1.5", color: "#5E5C56"}}>Sigue cada pedido desde que entra hasta que sale.</span>
</span>
<span className="hi" aria-hidden="true" style={{position: "absolute", left: "22px", top: "26px", padding: "6px 12px", borderRadius: "12px", background: "#B8923A", color: "#fff", fontSize: "13px", fontWeight: "500"}}>¡Hola, jefe!</span>
</button></div>
<div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px"}}>
<button type="button" className="btn" onClick={v.moreTog} aria-expanded={s(v.moreExp)} style={{minHeight: "50px", padding: "0 24px", borderRadius: "999px", border: "0", background: "#111113", color: "#F4F2ED", font: "inherit", fontSize: "15px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px"}}>{s(v.moreLbl)}</button>
{(v.moreOpen) ? (<><div className="pop" style={{display: "flex", flexWrap: "wrap", gap: "8px"}}><span className="chipin2" style={{"--i": "0", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Director General (CEO)</span><span className="chipin2" style={{"--i": "1", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Responsable de tienda</span><span className="chipin2" style={{"--i": "2", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Diseñador</span><span className="chipin2" style={{"--i": "3", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Realizador de video</span><span className="chipin2" style={{"--i": "4", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Responsable de contenido</span><span className="chipin2" style={{"--i": "5", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Responsable de clientes</span><span className="chipin2" style={{"--i": "6", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Responsable de operaciones</span><span className="chipin2" style={{"--i": "7", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Constructor de apps</span><span className="chipin2" style={{"--i": "8", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Analista de tendencias</span><span className="chipin2" style={{"--i": "9", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Contador</span><span className="chipin2" style={{"--i": "10", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Bibliotecario</span><span className="chipin2" style={{"--i": "11", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Estratega de pauta</span><span className="chipin2" style={{"--i": "12", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Inventarista</span><span className="chipin2" style={{"--i": "13", padding: "9px 14px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", fontSize: "14px", color: "#111113"}}>Vendedor WhatsApp</span><span className="chipin2" style={{"--i": "14", padding: "9px 14px", borderRadius: "999px", border: "1.5px dashed #7A5C17", color: "#7A5C17", fontSize: "14px"}}>+ Crea el tuyo</span></div></>) : null}
</div></section></>
  )
}
