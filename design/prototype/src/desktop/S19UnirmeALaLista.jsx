import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S19UnirmeALaLista({ v }) {
  return (
    <><section id="acceso" aria-label="Unirme a la lista" style={{background: "#111113", color: "#F4F2ED", padding: "140px 96px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "28px", overflow: "hidden", position: "relative"}}>
<div data-rv="" className="wave-hi"><button type="button" onClick={v.ceoTap} aria-label="Tocar a tu CEO" style={{background: "none", border: "0", padding: "0", cursor: "pointer"}}><svg className={`mascot ${s(v.ceoCls)}`} role="img" aria-label="Tu CEO" width="160" height="189" viewBox="0 0 100 118" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#F4F2ED" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#F4F2ED"></rect>
<g className="eyes" style={{"--bl": "4.4s", "--bd": "-2s"}}>
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
</svg></button></div>
<h2 data-rv="" style={{"--d": "80ms", margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "76px", lineHeight: "1.02", letterSpacing: "-0.02em", maxWidth: "1000px"}}>Deja de hacerlo <span style={{fontStyle: "italic", color: "#B8923A"}}>todo</span> tú solo.</h2>
<p data-rv="" style={{"--d": "160ms", margin: "0", fontSize: "20px", lineHeight: "1.6", color: "#a9a7a0", maxWidth: "520px"}}>Apúntate y te avisamos cuando sea tu turno.</p>
<div data-rv="" style={{"--d": "220ms", width: "100%", display: "flex", justifyContent: "center"}}>{(v.notSent) ? (<>
<div style={{display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "480px"}}>
<div className="mailbox" style={{display: "flex", flexDirection: "row", gap: "8px", width: "100%", padding: "6px", borderRadius: "999px", border: "1.5px solid #F4F2ED", boxSizing: "border-box"}}>
<label htmlFor="correo-cd" style={{position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)"}}>Tu correo</label>
<input id="correo-cd" type="email" placeholder="tu@correo.com" autoComplete="email" onInput={v.mailIn} onKeyDown={v.mailKey} aria-invalid={s(v.mailInv)} style={{flexGrow: "1", minHeight: "48px", padding: "0 18px", border: "0", borderRadius: "999px", background: "transparent", color: "#F4F2ED", font: "inherit", fontSize: "16px", outline: "none"}} />
<button className="btn" type="button" onClick={v.submit} style={{minHeight: "48px", padding: "0 22px", borderRadius: "999px", border: "0", background: "#F4F2ED", color: "#111113", font: "inherit", fontSize: "15px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap"}}>{s(v.mailBtn)}</button>
</div>
{(v.mailErr) ? (<><span role="alert" className="pop" style={{fontSize: "13px", color: "#F2B8A8", paddingLeft: "18px"}}>Escribe un correo válido, por ejemplo tu@correo.com</span></>) : null}
</div>
</>) : null}
{(v.sent) ? (<>
<div role="status" className="pop" style={{display: "flex", alignItems: "center", gap: "10px", padding: "14px 20px", borderRadius: "999px", border: "1.5px solid #F4F2ED", color: "#F4F2ED", fontSize: "15px"}}><span style={{width: "22px", height: "22px", borderRadius: "50%", background: "#B8923A", display: "flex", alignItems: "center", justifyContent: "center"}}><svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Listo, estás en la lista. Te avisamos cuando sea tu turno.</div>
</>) : null}</div>
</section></>
  )
}
