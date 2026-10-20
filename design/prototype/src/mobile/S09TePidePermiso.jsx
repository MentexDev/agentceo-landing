import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S09TePidePermiso({ v }) {
  return (
    <><section id="permiso" aria-label="Te pide permiso" style={{background: "#111113", color: "#F4F2ED", padding: "64px 16px", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "40px", alignItems: "center"}}>
<div style={{display: "flex", flexDirection: "column", gap: "22px"}}>
<div data-rv=""><span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#a9a7a0"}}>Permisos</span></div>
<h2 data-rv="" style={{"--d": "80ms", margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "38px", lineHeight: "1.04", letterSpacing: "-0.02em"}}>Nada importante sin <span style={{fontStyle: "italic", color: "#D9B866"}}>tu sí.</span></h2>
<p data-rv="" style={{"--d": "160ms", margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#a9a7a0", maxWidth: "480px"}}>Si cuesta dinero o no se puede deshacer, te pregunta primero. <span style={{color: "#F4F2ED"}}>Pruébalo:</span></p>
<p data-rv="" style={{"--d": "200ms", margin: "0", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#a9a7a0"}}><span style={{padding: "3px 10px", borderRadius: "999px", border: "1px solid rgba(244,242,237,0.14)", color: "#F4F2ED", fontSize: "12px"}}>Telegram</span>Aprueba desde tu celular, con un botón.</p>
<div data-rv="" style={{"--d": "220ms"}}><div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
<div style={{display: "flex", gap: "24px", fontSize: "14px", color: "#a9a7a0"}}><span>Aprobados: <b style={{color: "#F4F2ED", fontWeight: "600"}}>{s(v.okN)}</b></span><span>Rechazados: <b style={{color: "#F4F2ED", fontWeight: "600"}}>{s(v.noN)}</b></span></div>
<ul style={{listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "8px"}}>
{(v.log || []).map((it, __i) => (<React.Fragment key={__i}><li className="pop" style={{display: "flex", justifyContent: "space-between", gap: "12px", padding: "12px 16px", borderRadius: "14px", border: "1px solid rgba(244,242,237,0.14)", fontSize: "14px", color: "#F4F2ED"}}><span>{s(it.t)}</span><span style={css(it.st)}>{s(it.lbl)}</span></li></React.Fragment>))}
</ul>
</div></div>
</div>
<div data-rv="" style={{"--d": "120ms"}}><div className={s(v.reqCls)} style={{background: "#FBFAF7", color: "#111113", borderRadius: "28px", padding: "22px 20px", display: "flex", flexDirection: "column", gap: "24px", boxShadow: "8px 8px 0 #B8923A"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: "0.14em", color: "#5E5C56"}}><span>PERMISO {s(v.reqN)} DE 3</span><span>EJEMPLO</span></div>
{(v.notFin) ? (<>
{(v.r0) ? (<>
<div style={{display: "flex", flexDirection: "column", gap: "18px"}}>
<div style={{display: "flex", alignItems: "center", gap: "14px"}}>
<div className="raise"><svg className={`mascot ${s(v.reqFace)}`} aria-hidden="true" width="64" height="64" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4s", "--bd": "-1s"}}>
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
<div style={{display: "flex", flexDirection: "column", gap: "4px"}}><span style={{fontSize: "15px", fontWeight: "600", color: "#111113"}}>Encargado de inventario</span><span style={{display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "6px", padding: "3px 10px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "12px"}}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>Cuesta dinero</span></div>
</div>
<p style={{margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.15", color: "#111113"}}>«Se está acabando la camiseta negra talla M. ¿Pido 40 más al proveedor?»</p>
</div>
</>) : null}{(v.r1) ? (<>
<div style={{display: "flex", flexDirection: "column", gap: "18px"}}>
<div style={{display: "flex", alignItems: "center", gap: "14px"}}>
<div className="raise"><svg className={`mascot ${s(v.reqFace)}`} aria-hidden="true" width="64" height="64" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4s", "--bd": "-1s"}}>
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
<div style={{display: "flex", flexDirection: "column", gap: "4px"}}><span style={{fontSize: "15px", fontWeight: "600", color: "#111113"}}>Experto en publicidad</span><span style={{display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "6px", padding: "3px 10px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "12px"}}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>Cuesta dinero</span></div>
</div>
<p style={{margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.15", color: "#111113"}}>«El anuncio de esta semana va muy bien. ¿Le subo un poco el presupuesto?»</p>
</div>
</>) : null}{(v.r2) ? (<>
<div style={{display: "flex", flexDirection: "column", gap: "18px"}}>
<div style={{display: "flex", alignItems: "center", gap: "14px"}}>
<div className="raise"><svg className={`mascot ${s(v.reqFace)}`} aria-hidden="true" width="64" height="64" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "4s", "--bd": "-1s"}}>
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
<div style={{display: "flex", flexDirection: "column", gap: "4px"}}><span style={{fontSize: "15px", fontWeight: "600", color: "#111113"}}>Creador de contenido</span><span style={{display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "6px", padding: "3px 10px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "12px"}}><svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>Sale al público</span></div>
</div>
<p style={{margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.15", color: "#111113"}}>«Tengo listos los cinco posts de la semana. ¿Los publico?»</p>
</div>
</>) : null}
<div style={{display: "flex", gap: "10px"}}>
<button type="button" className="btn" onClick={v.yes} style={{flexGrow: "1", minHeight: "52px", borderRadius: "999px", border: "0", background: "#111113", color: "#F4F2ED", font: "inherit", fontSize: "16px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg>Sí, hazlo</button>
<button type="button" className="ghost" onClick={v.no} style={{flexGrow: "1", minHeight: "52px", borderRadius: "999px", border: "1.5px solid #111113", background: "transparent", color: "#111113", font: "inherit", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>Ahora no</button>
</div>
</>) : null}
{(v.fin) ? (<>
<div className="pop" style={{display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px"}}>
<svg className="mascot happy jumpy" aria-hidden="true" width="72" height="85" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
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
</svg>
<p style={{margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.15"}}>¡Listo por hoy! Tu equipo sigue trabajando con lo que decidiste.</p>
<button type="button" className="ghost" onClick={v.again} style={{minHeight: "44px", padding: "0 20px", borderRadius: "999px", border: "1.5px solid #111113", background: "transparent", color: "#111113", font: "inherit", fontSize: "15px", cursor: "pointer"}}>Probar otra vez</button>
</div>
</>) : null}
</div></div>
</section></>
  )
}
