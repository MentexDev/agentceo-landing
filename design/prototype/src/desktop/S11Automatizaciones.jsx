import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S11Automatizaciones({ v }) {
  return (
    <><section id="automatizaciones" aria-label="Automatizaciones" style={{padding: "140px 96px", display: "flex", flexDirection: "column", gap: "28px", borderTop: "1.5px solid #111113"}}>
<div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
<div data-rv=""><span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5E5C56"}}>Automatizaciones</span></div>
<h2 data-rv="" style={{"--d": "80ms", margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "62px", lineHeight: "1.04", letterSpacing: "-0.02em", color: "#111113", maxWidth: "900px"}}>Prende una. <span style={{fontStyle: "italic"}}>Se hace sola cada día.</span></h2>
<p data-rv="" style={{"--d": "160ms", margin: "0", fontSize: "19px", lineHeight: "1.6", color: "#5E5C56", maxWidth: "560px"}}>Carritos abandonados, cobros, inventario, reportes. 26 listas para usar.</p>
</div>
<div data-rv="" style={{display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px", borderRadius: "20px", background: "#111113", color: "#F4F2ED", flexWrap: "wrap"}}>
<div className={s(v.meterFace)}><svg className="mascot " aria-hidden="true" width="44" height="52" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#F4F2ED" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#F4F2ED"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#F4F2ED"></circle>
<ellipse data-eye="2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#F4F2ED"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#111113" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg></div>
<div style={{display: "flex", flexDirection: "column", gap: "6px", flexGrow: "1", minWidth: "180px"}}>
<span style={{fontSize: "15px"}}><b style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "28px", fontWeight: "400", color: "#D9B866"}}>{s(v.onCount)}</b> de 9 automatizaciones prendidas</span>
<span style={{height: "6px", borderRadius: "3px", background: "rgba(244,242,237,0.14)", overflow: "hidden", display: "block"}}><span style={css(v.onBar)}></span></span>
</div>
<span style={{fontSize: "13px", color: "#a9a7a0"}}>{s(v.onMsg)}</span>
</div>
<div data-rv="" style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px"}}>
<div style={{display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px"}}><button type="button" className={s(v.ac0)} onClick={v.sa0} aria-pressed={s(v.ap0)} style={{minHeight: "40px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap"}}>Todas</button><button type="button" className={s(v.ac1)} onClick={v.sa1} aria-pressed={s(v.ap1)} style={{minHeight: "40px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap"}}>Ventas</button><button type="button" className={s(v.ac2)} onClick={v.sa2} aria-pressed={s(v.ap2)} style={{minHeight: "40px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap"}}>Clientes</button><button type="button" className={s(v.ac3)} onClick={v.sa3} aria-pressed={s(v.ap3)} style={{minHeight: "40px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap"}}>Inventario</button><button type="button" className={s(v.ac4)} onClick={v.sa4} aria-pressed={s(v.ap4)} style={{minHeight: "40px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap"}}>Contenido</button><button type="button" className={s(v.ac5)} onClick={v.sa5} aria-pressed={s(v.ap5)} style={{minHeight: "40px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap"}}>Finanzas</button></div>
<div style={{display: "flex", gap: "8px", flexShrink: "0"}}><button type="button" className="ghost" onClick={v.autoPrev} aria-label="Automatizaciones anteriores" style={{width: "48px", height: "48px", borderRadius: "50%", border: "1.5px solid #111113", background: "transparent", color: "#111113", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}}><span style={{display: "block", transform: "rotate(180deg)"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span></button><button type="button" className="btn" onClick={v.autoNext} aria-label="Más automatizaciones" style={{width: "48px", height: "48px", borderRadius: "50%", border: "0", background: "#111113", color: "#F4F2ED", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4F2ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></button></div>
</div>
<div className="hs hs-d" ref={v.setAutoRef} style={{display: "flex", gap: "18px"}}>{(v.show0) ? (<><div className={`auto ${s(v.acard0)}`} style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", overflow: "hidden"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
<span className="aic" style={{width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display: "block"}}><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg></span>
<button type="button" role="switch" aria-checked={s(v.on0)} aria-label="Activar Resumen de ventas cada mañana" onClick={v.tog0} className={s(v.sw0)} style={{position: "relative", width: "54px", height: "32px", borderRadius: "999px", border: "1.5px solid currentColor", cursor: "pointer", padding: "0", flexShrink: "0", color: "inherit"}}><span className="knob" style={{position: "absolute", top: "4px", left: "4px", width: "21px", height: "21px", borderRadius: "50%"}}></span></button>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span className="amu" style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase"}}>Ventas</span><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.05"}}>Resumen de ventas cada mañana</span><span className="amu" style={{fontSize: "14px", lineHeight: "1.5"}}>A las 7:00 reúne los pedidos de ayer y te manda el informe.</span></div>
<div className="flowrow" aria-hidden="true" style={{display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto minmax(0, 1fr) auto", alignItems: "center", gap: "6px", paddingTop: "12px", borderTop: "1px dashed currentColor"}}>
<span className="fchip" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>7:00 a. m.</span>
<span className="fline"><span className="fdot"></span></span>
<span className="fag"><svg className="mascot work" aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></span>
<span className="fline"><span className="fdot d2"></span></span>
<span className="fchip fres" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Informe</span>
</div>
</div></>) : null}{(v.show1) ? (<><div className={`auto ${s(v.acard1)}`} style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", overflow: "hidden"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
<span className="aic" style={{width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display: "block"}}><circle cx="9" cy="20" r="1.5"></circle><circle cx="18" cy="20" r="1.5"></circle><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6"></path></svg></span>
<button type="button" role="switch" aria-checked={s(v.on1)} aria-label="Activar Carritos abandonados" onClick={v.tog1} className={s(v.sw1)} style={{position: "relative", width: "54px", height: "32px", borderRadius: "999px", border: "1.5px solid currentColor", cursor: "pointer", padding: "0", flexShrink: "0", color: "inherit"}}><span className="knob" style={{position: "absolute", top: "4px", left: "4px", width: "21px", height: "21px", borderRadius: "50%"}}></span></button>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span className="amu" style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase"}}>Ventas</span><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.05"}}>Carritos abandonados</span><span className="amu" style={{fontSize: "14px", lineHeight: "1.5"}}>Si alguien no terminó de comprar, le escribe con lo que dejó.</span></div>
<div className="flowrow" aria-hidden="true" style={{display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto minmax(0, 1fr) auto", alignItems: "center", gap: "6px", paddingTop: "12px", borderTop: "1px dashed currentColor"}}>
<span className="fchip" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Carrito sin pagar</span>
<span className="fline"><span className="fdot"></span></span>
<span className="fag"><svg className="mascot work" aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50 16a37 37 0 1 1-19.8 68.3L13 90l5.8-16.6A37 37 0 0 1 50 16z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></span>
<span className="fline"><span className="fdot d2"></span></span>
<span className="fchip fres" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Mensaje</span>
</div>
</div></>) : null}{(v.show2) ? (<><div className={`auto ${s(v.acard2)}`} style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", overflow: "hidden"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
<span className="aic" style={{width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display: "block"}}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"></path></svg></span>
<button type="button" role="switch" aria-checked={s(v.on2)} aria-label="Activar Bienvenida a clientes nuevos" onClick={v.tog2} className={s(v.sw2)} style={{position: "relative", width: "54px", height: "32px", borderRadius: "999px", border: "1.5px solid currentColor", cursor: "pointer", padding: "0", flexShrink: "0", color: "inherit"}}><span className="knob" style={{position: "absolute", top: "4px", left: "4px", width: "21px", height: "21px", borderRadius: "50%"}}></span></button>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span className="amu" style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase"}}>Clientes</span><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.05"}}>Bienvenida a clientes nuevos</span><span className="amu" style={{fontSize: "14px", lineHeight: "1.5"}}>Cada cliente nuevo recibe tu mensaje, con el tono de tu marca.</span></div>
<div className="flowrow" aria-hidden="true" style={{display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto minmax(0, 1fr) auto", alignItems: "center", gap: "6px", paddingTop: "12px", borderTop: "1px dashed currentColor"}}>
<span className="fchip" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Cliente nuevo</span>
<span className="fline"><span className="fdot"></span></span>
<span className="fag"><svg className="mascot work" aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M9 58a41 41 0 0 1 82 0" stroke="#111113" strokeWidth="5" fill="none"></path><rect x="17" y="22" width="66" height="66" rx="24" fill="#111113"></rect><rect x="5" y="50" width="12" height="20" rx="5" fill="#111113"></rect><rect x="83" y="50" width="12" height="20" rx="5" fill="#111113"></rect><path d="M89 70q0 16-18 16" stroke="#111113" strokeWidth="3" fill="none"></path><circle cx="70" cy="86" r="3.5" fill="#B8923A"></circle>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></span>
<span className="fline"><span className="fdot d2"></span></span>
<span className="fchip fres" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Bienvenida</span>
</div>
</div></>) : null}{(v.show3) ? (<><div className={`auto ${s(v.acard3)}`} style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", overflow: "hidden"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
<span className="aic" style={{width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display: "block"}}><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg></span>
<button type="button" role="switch" aria-checked={s(v.on3)} aria-label="Activar Prepara cada reunión" onClick={v.tog3} className={s(v.sw3)} style={{position: "relative", width: "54px", height: "32px", borderRadius: "999px", border: "1.5px solid currentColor", cursor: "pointer", padding: "0", flexShrink: "0", color: "inherit"}}><span className="knob" style={{position: "absolute", top: "4px", left: "4px", width: "21px", height: "21px", borderRadius: "50%"}}></span></button>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span className="amu" style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase"}}>Clientes</span><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.05"}}>Prepara cada reunión</span><span className="amu" style={{fontSize: "14px", lineHeight: "1.5"}}>Antes de cada cita te deja un resumen del cliente.</span></div>
<div className="flowrow" aria-hidden="true" style={{display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto minmax(0, 1fr) auto", alignItems: "center", gap: "6px", paddingTop: "12px", borderTop: "1px dashed currentColor"}}>
<span className="fchip" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Cita mañana</span>
<span className="fline"><span className="fdot"></span></span>
<span className="fag"><svg className="mascot work" aria-hidden="true" width="30" height="35" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg></span>
<span className="fline"><span className="fdot d2"></span></span>
<span className="fchip fres" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Resumen</span>
</div>
</div></>) : null}{(v.show4) ? (<><div className={`auto ${s(v.acard4)}`} style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", overflow: "hidden"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
<span className="aic" style={{width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display: "block"}}><path d="M21 8l-9-5-9 5 9 5 9-5z"></path><path d="M3 8v8l9 5 9-5V8"></path><path d="M12 13v8"></path></svg></span>
<button type="button" role="switch" aria-checked={s(v.on4)} aria-label="Activar Aviso de inventario bajo" onClick={v.tog4} className={s(v.sw4)} style={{position: "relative", width: "54px", height: "32px", borderRadius: "999px", border: "1.5px solid currentColor", cursor: "pointer", padding: "0", flexShrink: "0", color: "inherit"}}><span className="knob" style={{position: "absolute", top: "4px", left: "4px", width: "21px", height: "21px", borderRadius: "50%"}}></span></button>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span className="amu" style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase"}}>Inventario</span><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.05"}}>Aviso de inventario bajo</span><span className="amu" style={{fontSize: "14px", lineHeight: "1.5"}}>Cuando algo se está acabando te avisa y deja listo el pedido.</span></div>
<div className="flowrow" aria-hidden="true" style={{display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto minmax(0, 1fr) auto", alignItems: "center", gap: "6px", paddingTop: "12px", borderTop: "1px dashed currentColor"}}>
<span className="fchip" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Stock bajo</span>
<span className="fline"><span className="fdot"></span></span>
<span className="fag"><svg className="mascot work" aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></span>
<span className="fline"><span className="fdot d2"></span></span>
<span className="fchip fres" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Pedido listo</span>
</div>
</div></>) : null}{(v.show5) ? (<><div className={`auto ${s(v.acard5)}`} style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", overflow: "hidden"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
<span className="aic" style={{width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display: "block"}}><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"></path><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"></path></svg></span>
<button type="button" role="switch" aria-checked={s(v.on5)} aria-label="Activar El contenido de la semana" onClick={v.tog5} className={s(v.sw5)} style={{position: "relative", width: "54px", height: "32px", borderRadius: "999px", border: "1.5px solid currentColor", cursor: "pointer", padding: "0", flexShrink: "0", color: "inherit"}}><span className="knob" style={{position: "absolute", top: "4px", left: "4px", width: "21px", height: "21px", borderRadius: "50%"}}></span></button>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span className="amu" style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase"}}>Contenido</span><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.05"}}>El contenido de la semana</span><span className="amu" style={{fontSize: "14px", lineHeight: "1.5"}}>Cada lunes prepara los posts y te los deja para aprobar.</span></div>
<div className="flowrow" aria-hidden="true" style={{display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto minmax(0, 1fr) auto", alignItems: "center", gap: "6px", paddingTop: "12px", borderTop: "1px dashed currentColor"}}>
<span className="fchip" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Lunes</span>
<span className="fline"><span className="fdot"></span></span>
<span className="fag"><svg className="mascot work" aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></span>
<span className="fline"><span className="fdot d2"></span></span>
<span className="fchip fres" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>5 posts</span>
</div>
</div></>) : null}{(v.show6) ? (<><div className={`auto ${s(v.acard6)}`} style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", overflow: "hidden"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
<span className="aic" style={{width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display: "block"}}><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"></path></svg></span>
<button type="button" role="switch" aria-checked={s(v.on6)} aria-label="Activar Un video largo, en piezas cortas" onClick={v.tog6} className={s(v.sw6)} style={{position: "relative", width: "54px", height: "32px", borderRadius: "999px", border: "1.5px solid currentColor", cursor: "pointer", padding: "0", flexShrink: "0", color: "inherit"}}><span className="knob" style={{position: "absolute", top: "4px", left: "4px", width: "21px", height: "21px", borderRadius: "50%"}}></span></button>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span className="amu" style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase"}}>Contenido</span><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.05"}}>Un video largo, en piezas cortas</span><span className="amu" style={{fontSize: "14px", lineHeight: "1.5"}}>Corta tu video en clips listos para redes.</span></div>
<div className="flowrow" aria-hidden="true" style={{display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto minmax(0, 1fr) auto", alignItems: "center", gap: "6px", paddingTop: "12px", borderTop: "1px dashed currentColor"}}>
<span className="fchip" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Video subido</span>
<span className="fline"><span className="fdot"></span></span>
<span className="fag"><svg className="mascot work" aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></span>
<span className="fline"><span className="fdot d2"></span></span>
<span className="fchip fres" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Clips</span>
</div>
</div></>) : null}{(v.show7) ? (<><div className={`auto ${s(v.acard7)}`} style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", overflow: "hidden"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
<span className="aic" style={{width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display: "block"}}><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 1V2l-1 1-3-2-3 2-3-2-3 2-3-2z"></path><path d="M8 8h8M8 12h8M8 16h5"></path></svg></span>
<button type="button" role="switch" aria-checked={s(v.on7)} aria-label="Activar Recordatorio de cobros" onClick={v.tog7} className={s(v.sw7)} style={{position: "relative", width: "54px", height: "32px", borderRadius: "999px", border: "1.5px solid currentColor", cursor: "pointer", padding: "0", flexShrink: "0", color: "inherit"}}><span className="knob" style={{position: "absolute", top: "4px", left: "4px", width: "21px", height: "21px", borderRadius: "50%"}}></span></button>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span className="amu" style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase"}}>Finanzas</span><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.05"}}>Recordatorio de cobros</span><span className="amu" style={{fontSize: "14px", lineHeight: "1.5"}}>Cada viernes revisa qué facturas vencieron y prepara los recordatorios.</span></div>
<div className="flowrow" aria-hidden="true" style={{display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto minmax(0, 1fr) auto", alignItems: "center", gap: "6px", paddingTop: "12px", borderTop: "1px dashed currentColor"}}>
<span className="fchip" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Viernes</span>
<span className="fline"><span className="fdot"></span></span>
<span className="fag"><svg className="mascot work" aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50.0 19.0 L58.2 11.8 L66.1 14.2 L68.9 24.7 L74.0 29.0 L84.9 29.7 L88.8 36.9 L83.3 46.4 L84.0 53.0 L91.2 61.2 L88.8 69.1 L78.3 71.9 L74.0 77.0 L73.3 87.9 L66.1 91.8 L56.6 86.3 L50.0 87.0 L41.8 94.2 L33.9 91.8 L31.1 81.3 L26.0 77.0 L15.1 76.3 L11.2 69.1 L16.7 59.6 L16.0 53.0 L8.8 44.8 L11.2 36.9 L21.7 34.1 L26.0 29.0 L26.7 18.1 L33.9 14.2 L43.4 19.7Z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></span>
<span className="fline"><span className="fdot d2"></span></span>
<span className="fchip fres" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Recordatorios</span>
</div>
</div></>) : null}{(v.show8) ? (<><div className={`auto ${s(v.acard8)}`} style={{position: "relative", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "24px", overflow: "hidden"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
<span className="aic" style={{width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{display: "block"}}><path d="M3 3v18h18"></path><path d="M7 15l4-4 3 3 6-6"></path></svg></span>
<button type="button" role="switch" aria-checked={s(v.on8)} aria-label="Activar Cierre del mes" onClick={v.tog8} className={s(v.sw8)} style={{position: "relative", width: "54px", height: "32px", borderRadius: "999px", border: "1.5px solid currentColor", cursor: "pointer", padding: "0", flexShrink: "0", color: "inherit"}}><span className="knob" style={{position: "absolute", top: "4px", left: "4px", width: "21px", height: "21px", borderRadius: "50%"}}></span></button>
</div>
<div style={{display: "flex", flexDirection: "column", gap: "6px"}}><span className="amu" style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase"}}>Finanzas</span><span style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "26px", lineHeight: "1.05"}}>Cierre del mes</span><span className="amu" style={{fontSize: "14px", lineHeight: "1.5"}}>Ordena ingresos y gastos y te entrega el resumen.</span></div>
<div className="flowrow" aria-hidden="true" style={{display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto minmax(0, 1fr) auto", alignItems: "center", gap: "6px", paddingTop: "12px", borderTop: "1px dashed currentColor"}}>
<span className="fchip" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Fin de mes</span>
<span className="fline"><span className="fdot"></span></span>
<span className="fag"><svg className="mascot work" aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50.0 19.0 L58.2 11.8 L66.1 14.2 L68.9 24.7 L74.0 29.0 L84.9 29.7 L88.8 36.9 L83.3 46.4 L84.0 53.0 L91.2 61.2 L88.8 69.1 L78.3 71.9 L74.0 77.0 L73.3 87.9 L66.1 91.8 L56.6 86.3 L50.0 87.0 L41.8 94.2 L33.9 91.8 L31.1 81.3 L26.0 77.0 L15.1 76.3 L11.2 69.1 L16.7 59.6 L16.0 53.0 L8.8 44.8 L11.2 36.9 L21.7 34.1 L26.0 29.0 L26.7 18.1 L33.9 14.2 L43.4 19.7Z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.6" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.6" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg></span>
<span className="fline"><span className="fdot d2"></span></span>
<span className="fchip fres" style={{padding: "5px 9px", borderRadius: "999px", fontSize: "11px", whiteSpace: "nowrap"}}>Resumen</span>
</div>
</div></>) : null}</div>
<p data-rv="" style={{margin: "0", fontSize: "15px", color: "#5E5C56"}}>Y 17 más.</p>
</section></>
  )
}
