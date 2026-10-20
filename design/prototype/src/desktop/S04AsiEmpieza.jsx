import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S04AsiEmpieza({ v }) {
  return (
    <><section id="empieza" aria-label="Así empieza" style={{padding: "140px 96px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "96px", alignItems: "center"}}><div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
<div data-rv=""><span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5E5C56"}}>Así empieza</span></div>
<h2 data-rv="" style={{"--d": "80ms", margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "62px", lineHeight: "1.04", letterSpacing: "-0.02em", color: "#111113", maxWidth: "900px"}}>Cuéntale tu negocio. <span style={{fontStyle: "italic"}}>Te arma el equipo.</span></h2>
<p data-rv="" style={{"--d": "160ms", margin: "0", fontSize: "19px", lineHeight: "1.6", color: "#5E5C56", maxWidth: "560px"}}>Una charla corta y tienes tu equipo listo. <span style={{color: "#111113"}}>Pruébalo:</span></p>
</div><div data-rv="" style={{"--d": "120ms", background: "#EAE7E0", border: "1.5px solid #111113", borderRadius: "28px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", minHeight: "560px", boxSizing: "border-box"}}>
<div style={{display: "flex", alignItems: "center", gap: "10px", paddingBottom: "12px", borderBottom: "1px solid rgba(17,17,19,0.12)"}}><svg className="mascot " aria-hidden="true" width="38" height="38" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="2.2" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="2.2" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{display: "flex", flexDirection: "column"}}><span style={{fontSize: "15px", fontWeight: "600", color: "#111113"}}>Tu CEO</span><span style={{fontSize: "12px", color: "#5E5C56"}}>Entrevista para arrancar</span></span></div>
<div className="msgin static" style={{"--t": "0s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>¡Hola! Antes de armar tu equipo, cuéntame: ¿ya tienes un negocio andando?</span></div>
{(v.pathNone) ? (<>
<div style={{display: "flex", flexDirection: "row", gap: "8px", marginTop: "4px"}}>
<button type="button" className="ghost" onClick={v.chooseT} style={{flexGrow: "1", minHeight: "48px", padding: "0 18px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", color: "#111113", font: "inherit", fontSize: "15px", cursor: "pointer"}}>Ya tengo negocio</button>
<button type="button" className="ghost" onClick={v.chooseC} style={{flexGrow: "1", minHeight: "48px", padding: "0 18px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", color: "#111113", font: "inherit", fontSize: "15px", cursor: "pointer"}}>Empiezo desde cero</button>
</div>
</>) : null}
{(v.pathT) ? (<><div style={{display: "flex", flexDirection: "column", gap: "12px"}}><div className="msgin" style={{"--t": "0.1s", alignSelf: "flex-end", maxWidth: "80%", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", background: "#111113", color: "#F4F2ED", fontSize: "15px", lineHeight: "1.45"}}>Ya tengo negocio.</div><div className="msgin" style={{"--t": "0.8s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>Perfecto. Pásame tu web y la reviso mientras hablamos.</span></div><div className="msgin typing2" style={{"--t": "1.5s", alignSelf: "flex-start", display: "flex", gap: "5px", padding: "12px 16px", borderRadius: "18px", background: "#FBFAF7"}}><span className="td"></span><span className="td td2"></span><span className="td td3"></span></div><div className="msgin" style={{"--t": "2.6s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>Listo, ya la leí. Vendes ropa cómoda para mujeres, ¿cierto? Con eso armo tu equipo.</span></div><div className="msgin" style={{"--t": "3.4s", alignSelf: "stretch", padding: "16px", borderRadius: "20px", background: "#111113", color: "#F4F2ED", display: "flex", flexDirection: "column", gap: "12px"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#a9a7a0"}}>TU EQUIPO INICIAL · LISTO</span>
<div style={{display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px 6px", background: "#F4F2ED", borderRadius: "14px", padding: "14px 8px"}}><div className="popd" style={{"--t": "3.40s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="40" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.0s", "--bd": "0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg><span>Tu CEO</span></div><div className="popd" style={{"--t": "3.52s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.4s", "--bd": "-1s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Tienda</span></div><div className="popd" style={{"--t": "3.64s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "4.8s", "--bd": "-2s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Diseño</span></div><div className="popd" style={{"--t": "3.76s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "5.2s", "--bd": "-3s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Video</span></div><div className="popd" style={{"--t": "3.88s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "5.6s", "--bd": "-4s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Contenido</span></div><div className="popd" style={{"--t": "4.00s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M9 58a41 41 0 0 1 82 0" stroke="#111113" strokeWidth="5" fill="none"></path><rect x="17" y="22" width="66" height="66" rx="24" fill="#111113"></rect><rect x="5" y="50" width="12" height="20" rx="5" fill="#111113"></rect><rect x="83" y="50" width="12" height="20" rx="5" fill="#111113"></rect><path d="M89 70q0 16-18 16" stroke="#111113" strokeWidth="3" fill="none"></path><circle cx="70" cy="86" r="3.5" fill="#B8923A"></circle>
<g className="eyes" style={{"--bl": "6.0s", "--bd": "-5s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Clientes</span></div><div className="popd" style={{"--t": "4.12s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50.0 19.0 L58.2 11.8 L66.1 14.2 L68.9 24.7 L74.0 29.0 L84.9 29.7 L88.8 36.9 L83.3 46.4 L84.0 53.0 L91.2 61.2 L88.8 69.1 L78.3 71.9 L74.0 77.0 L73.3 87.9 L66.1 91.8 L56.6 86.3 L50.0 87.0 L41.8 94.2 L33.9 91.8 L31.1 81.3 L26.0 77.0 L15.1 76.3 L11.2 69.1 L16.7 59.6 L16.0 53.0 L8.8 44.8 L11.2 36.9 L21.7 34.1 L26.0 29.0 L26.7 18.1 L33.9 14.2 L43.4 19.7Z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "6.4s", "--bd": "-6s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Operaciones</span></div><div className="popd" style={{"--t": "4.24s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "6.800000000000001s", "--bd": "-7s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Constructor</span></div></div>
</div></div></>) : null}
{(v.pathC) ? (<><div style={{display: "flex", flexDirection: "column", gap: "12px"}}><div className="msgin" style={{"--t": "0.1s", alignSelf: "flex-end", maxWidth: "80%", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", background: "#111113", color: "#F4F2ED", fontSize: "15px", lineHeight: "1.45"}}>Empiezo desde cero.</div><div className="msgin" style={{"--t": "0.8s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>¡Qué emoción! Cuéntame tu idea en una frase y la aterrizamos juntos.</span></div><div className="msgin" style={{"--t": "1.8s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>Primero probamos que haya clientes. Después construimos, sin gastar de más.</span></div><div className="msgin" style={{"--t": "2.6s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>¿Qué quieres construir primero?</span></div>{(v.cbNone) ? (<><div className="msgin" style={{"--t": "3.1s", display: "flex", flexWrap: "wrap", gap: "8px"}}><button type="button" className="ghost" onClick={v.cb0} style={{minHeight: "46px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", color: "#111113", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Una tienda en Shopify</button><button type="button" className="ghost" onClick={v.cb1} style={{minHeight: "46px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", color: "#111113", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Una aplicación</button><button type="button" className="ghost" onClick={v.cb2} style={{minHeight: "46px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", color: "#111113", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Una página web</button><button type="button" className="ghost" onClick={v.cb3} style={{minHeight: "46px", padding: "0 16px", borderRadius: "999px", border: "1.5px solid #111113", background: "#FBFAF7", color: "#111113", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Vender por WhatsApp</button></div></>) : null}{(v.cbs0) ? (<><div style={{display: "flex", flexDirection: "column", gap: "12px"}}><div className="msgin" style={{"--t": "0.1s", alignSelf: "flex-end", maxWidth: "80%", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", background: "#111113", color: "#F4F2ED", fontSize: "15px", lineHeight: "1.45"}}>Una tienda en Shopify.</div><div className="msgin" style={{"--t": "0.7s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>Tu tienda en Shopify, con catálogo y cobro. Yo la armo y tú apruebas antes de publicar.</span></div><div className="msgin" style={{"--t": "1.5s", alignSelf: "stretch", padding: "16px", borderRadius: "20px", background: "#111113", color: "#F4F2ED", display: "flex", flexDirection: "column", gap: "12px"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#a9a7a0"}}>TU EQUIPO INICIAL · LISTO</span>
<div style={{display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px 6px", background: "#F4F2ED", borderRadius: "14px", padding: "14px 8px"}}><div className="popd" style={{"--t": "1.50s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="40" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.0s", "--bd": "0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg><span>Tu CEO</span></div><div className="popd" style={{"--t": "1.62s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.4s", "--bd": "-1s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Tienda</span></div><div className="popd" style={{"--t": "1.74s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "4.8s", "--bd": "-2s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Diseño</span></div><div className="popd" style={{"--t": "1.86s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "5.2s", "--bd": "-3s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Video</span></div><div className="popd" style={{"--t": "1.98s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "5.6s", "--bd": "-4s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Contenido</span></div><div className="popd" style={{"--t": "2.10s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M9 58a41 41 0 0 1 82 0" stroke="#111113" strokeWidth="5" fill="none"></path><rect x="17" y="22" width="66" height="66" rx="24" fill="#111113"></rect><rect x="5" y="50" width="12" height="20" rx="5" fill="#111113"></rect><rect x="83" y="50" width="12" height="20" rx="5" fill="#111113"></rect><path d="M89 70q0 16-18 16" stroke="#111113" strokeWidth="3" fill="none"></path><circle cx="70" cy="86" r="3.5" fill="#B8923A"></circle>
<g className="eyes" style={{"--bl": "6.0s", "--bd": "-5s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Clientes</span></div><div className="popd" style={{"--t": "2.22s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50.0 19.0 L58.2 11.8 L66.1 14.2 L68.9 24.7 L74.0 29.0 L84.9 29.7 L88.8 36.9 L83.3 46.4 L84.0 53.0 L91.2 61.2 L88.8 69.1 L78.3 71.9 L74.0 77.0 L73.3 87.9 L66.1 91.8 L56.6 86.3 L50.0 87.0 L41.8 94.2 L33.9 91.8 L31.1 81.3 L26.0 77.0 L15.1 76.3 L11.2 69.1 L16.7 59.6 L16.0 53.0 L8.8 44.8 L11.2 36.9 L21.7 34.1 L26.0 29.0 L26.7 18.1 L33.9 14.2 L43.4 19.7Z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "6.4s", "--bd": "-6s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Operaciones</span></div><div className="popd" style={{"--t": "2.34s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "6.800000000000001s", "--bd": "-7s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Constructor</span></div></div>
</div></div></>) : null}{(v.cbs1) ? (<><div style={{display: "flex", flexDirection: "column", gap: "12px"}}><div className="msgin" style={{"--t": "0.1s", alignSelf: "flex-end", maxWidth: "80%", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", background: "#111113", color: "#F4F2ED", fontSize: "15px", lineHeight: "1.45"}}>Una aplicación.</div><div className="msgin" style={{"--t": "0.7s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>Una app con tus clientes y tus datos. La describes y el Constructor la arma.</span></div><div className="msgin" style={{"--t": "1.5s", alignSelf: "stretch", padding: "16px", borderRadius: "20px", background: "#111113", color: "#F4F2ED", display: "flex", flexDirection: "column", gap: "12px"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#a9a7a0"}}>TU EQUIPO INICIAL · LISTO</span>
<div style={{display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px 6px", background: "#F4F2ED", borderRadius: "14px", padding: "14px 8px"}}><div className="popd" style={{"--t": "1.50s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="40" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.0s", "--bd": "0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg><span>Tu CEO</span></div><div className="popd" style={{"--t": "1.62s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.4s", "--bd": "-1s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Tienda</span></div><div className="popd" style={{"--t": "1.74s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "4.8s", "--bd": "-2s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Diseño</span></div><div className="popd" style={{"--t": "1.86s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "5.2s", "--bd": "-3s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Video</span></div><div className="popd" style={{"--t": "1.98s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "5.6s", "--bd": "-4s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Contenido</span></div><div className="popd" style={{"--t": "2.10s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M9 58a41 41 0 0 1 82 0" stroke="#111113" strokeWidth="5" fill="none"></path><rect x="17" y="22" width="66" height="66" rx="24" fill="#111113"></rect><rect x="5" y="50" width="12" height="20" rx="5" fill="#111113"></rect><rect x="83" y="50" width="12" height="20" rx="5" fill="#111113"></rect><path d="M89 70q0 16-18 16" stroke="#111113" strokeWidth="3" fill="none"></path><circle cx="70" cy="86" r="3.5" fill="#B8923A"></circle>
<g className="eyes" style={{"--bl": "6.0s", "--bd": "-5s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Clientes</span></div><div className="popd" style={{"--t": "2.22s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50.0 19.0 L58.2 11.8 L66.1 14.2 L68.9 24.7 L74.0 29.0 L84.9 29.7 L88.8 36.9 L83.3 46.4 L84.0 53.0 L91.2 61.2 L88.8 69.1 L78.3 71.9 L74.0 77.0 L73.3 87.9 L66.1 91.8 L56.6 86.3 L50.0 87.0 L41.8 94.2 L33.9 91.8 L31.1 81.3 L26.0 77.0 L15.1 76.3 L11.2 69.1 L16.7 59.6 L16.0 53.0 L8.8 44.8 L11.2 36.9 L21.7 34.1 L26.0 29.0 L26.7 18.1 L33.9 14.2 L43.4 19.7Z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "6.4s", "--bd": "-6s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Operaciones</span></div><div className="popd" style={{"--t": "2.34s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "6.800000000000001s", "--bd": "-7s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Constructor</span></div></div>
</div></div></>) : null}{(v.cbs2) ? (<><div style={{display: "flex", flexDirection: "column", gap: "12px"}}><div className="msgin" style={{"--t": "0.1s", alignSelf: "flex-end", maxWidth: "80%", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", background: "#111113", color: "#F4F2ED", fontSize: "15px", lineHeight: "1.45"}}>Una página web.</div><div className="msgin" style={{"--t": "0.7s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>Tu web con quiénes somos, servicios y contacto. Lista para mostrar.</span></div><div className="msgin" style={{"--t": "1.5s", alignSelf: "stretch", padding: "16px", borderRadius: "20px", background: "#111113", color: "#F4F2ED", display: "flex", flexDirection: "column", gap: "12px"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#a9a7a0"}}>TU EQUIPO INICIAL · LISTO</span>
<div style={{display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px 6px", background: "#F4F2ED", borderRadius: "14px", padding: "14px 8px"}}><div className="popd" style={{"--t": "1.50s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="40" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.0s", "--bd": "0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg><span>Tu CEO</span></div><div className="popd" style={{"--t": "1.62s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.4s", "--bd": "-1s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Tienda</span></div><div className="popd" style={{"--t": "1.74s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "4.8s", "--bd": "-2s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Diseño</span></div><div className="popd" style={{"--t": "1.86s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "5.2s", "--bd": "-3s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Video</span></div><div className="popd" style={{"--t": "1.98s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "5.6s", "--bd": "-4s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Contenido</span></div><div className="popd" style={{"--t": "2.10s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M9 58a41 41 0 0 1 82 0" stroke="#111113" strokeWidth="5" fill="none"></path><rect x="17" y="22" width="66" height="66" rx="24" fill="#111113"></rect><rect x="5" y="50" width="12" height="20" rx="5" fill="#111113"></rect><rect x="83" y="50" width="12" height="20" rx="5" fill="#111113"></rect><path d="M89 70q0 16-18 16" stroke="#111113" strokeWidth="3" fill="none"></path><circle cx="70" cy="86" r="3.5" fill="#B8923A"></circle>
<g className="eyes" style={{"--bl": "6.0s", "--bd": "-5s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Clientes</span></div><div className="popd" style={{"--t": "2.22s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50.0 19.0 L58.2 11.8 L66.1 14.2 L68.9 24.7 L74.0 29.0 L84.9 29.7 L88.8 36.9 L83.3 46.4 L84.0 53.0 L91.2 61.2 L88.8 69.1 L78.3 71.9 L74.0 77.0 L73.3 87.9 L66.1 91.8 L56.6 86.3 L50.0 87.0 L41.8 94.2 L33.9 91.8 L31.1 81.3 L26.0 77.0 L15.1 76.3 L11.2 69.1 L16.7 59.6 L16.0 53.0 L8.8 44.8 L11.2 36.9 L21.7 34.1 L26.0 29.0 L26.7 18.1 L33.9 14.2 L43.4 19.7Z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "6.4s", "--bd": "-6s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Operaciones</span></div><div className="popd" style={{"--t": "2.34s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "6.800000000000001s", "--bd": "-7s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Constructor</span></div></div>
</div></div></>) : null}{(v.cbs3) ? (<><div style={{display: "flex", flexDirection: "column", gap: "12px"}}><div className="msgin" style={{"--t": "0.1s", alignSelf: "flex-end", maxWidth: "80%", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", background: "#111113", color: "#F4F2ED", fontSize: "15px", lineHeight: "1.45"}}>Vender por WhatsApp.</div><div className="msgin" style={{"--t": "0.7s", alignSelf: "flex-start", display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "88%"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "#FBFAF7", border: "1.5px solid #111113", fontSize: "15px", lineHeight: "1.45", color: "#111113"}}>Tu vendedor de WhatsApp atiende desde el primer día. Yo te ayudo con el catálogo.</span></div><div className="msgin" style={{"--t": "1.5s", alignSelf: "stretch", padding: "16px", borderRadius: "20px", background: "#111113", color: "#F4F2ED", display: "flex", flexDirection: "column", gap: "12px"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#a9a7a0"}}>TU EQUIPO INICIAL · LISTO</span>
<div style={{display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px 6px", background: "#F4F2ED", borderRadius: "14px", padding: "14px 8px"}}><div className="popd" style={{"--t": "1.50s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="40" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.0s", "--bd": "0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>
<g className="tie"><path d="M45 87h10l-2 5h-6z" fill="#7A5C17"></path><path d="M47 92h6l5 15-8 8-8-8z" fill="#B8923A"></path></g>
</g>
</svg><span>Tu CEO</span></div><div className="popd" style={{"--t": "1.62s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.4s", "--bd": "-1s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Tienda</span></div><div className="popd" style={{"--t": "1.74s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "4.8s", "--bd": "-2s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Diseño</span></div><div className="popd" style={{"--t": "1.86s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "5.2s", "--bd": "-3s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Video</span></div><div className="popd" style={{"--t": "1.98s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<circle cx="50" cy="53" r="37" fill="#111113"></circle>
<g className="eyes" style={{"--bl": "5.6s", "--bd": "-4s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Contenido</span></div><div className="popd" style={{"--t": "2.10s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M9 58a41 41 0 0 1 82 0" stroke="#111113" strokeWidth="5" fill="none"></path><rect x="17" y="22" width="66" height="66" rx="24" fill="#111113"></rect><rect x="5" y="50" width="12" height="20" rx="5" fill="#111113"></rect><rect x="83" y="50" width="12" height="20" rx="5" fill="#111113"></rect><path d="M89 70q0 16-18 16" stroke="#111113" strokeWidth="3" fill="none"></path><circle cx="70" cy="86" r="3.5" fill="#B8923A"></circle>
<g className="eyes" style={{"--bl": "6.0s", "--bd": "-5s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Clientes</span></div><div className="popd" style={{"--t": "2.22s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50.0 19.0 L58.2 11.8 L66.1 14.2 L68.9 24.7 L74.0 29.0 L84.9 29.7 L88.8 36.9 L83.3 46.4 L84.0 53.0 L91.2 61.2 L88.8 69.1 L78.3 71.9 L74.0 77.0 L73.3 87.9 L66.1 91.8 L56.6 86.3 L50.0 87.0 L41.8 94.2 L33.9 91.8 L31.1 81.3 L26.0 77.0 L15.1 76.3 L11.2 69.1 L16.7 59.6 L16.0 53.0 L8.8 44.8 L11.2 36.9 L21.7 34.1 L26.0 29.0 L26.7 18.1 L33.9 14.2 L43.4 19.7Z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "6.4s", "--bd": "-6s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Operaciones</span></div><div className="popd" style={{"--t": "2.34s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "11px", color: "#5E5C56"}}><svg className="mascot " aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "6.800000000000001s", "--bd": "-7s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span>Constructor</span></div></div>
</div></div></>) : null}</div></>) : null}
{(v.pathSome) ? (<><button type="button" onClick={v.resetPath} style={{alignSelf: "center", marginTop: "4px", background: "none", border: "0", font: "inherit", fontSize: "13px", color: "#7A5C17", textDecoration: "underline", cursor: "pointer", minHeight: "44px"}}>Probar el otro camino</button></>) : null}
</div></section></>
  )
}
