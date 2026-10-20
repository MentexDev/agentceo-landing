import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S01Header({ v }) {
  return (
    <><header style={{position: "sticky", top: "0", zIndex: "50", height: "76px", padding: "0 48px", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px"}} className="navbar">
<a href="#top" aria-label="Agent CEO, inicio" style={{display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#111113"}}>
<svg className="mascot logo" aria-hidden="true" width="34" height="34" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "5.2s", "--bd": "-1s"}}>
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
</svg>
<span style={{fontSize: "19px", fontWeight: "600", letterSpacing: "-0.02em"}}>agent<span style={{color: "#B8923A"}}>.</span>ceo</span>
</a>
<nav aria-label="Principal" style={{display: "flex", gap: "28px", fontSize: "15px"}}>
<a className="nl" href="#empieza" style={{color: "#111113", textDecoration: "none"}}>Cómo empieza</a>
<a className="nl" href="#solos" style={{color: "#111113", textDecoration: "none"}}>Cómo trabaja</a>
<a className="nl" href="#automatizaciones" style={{color: "#111113", textDecoration: "none"}}>Automatizaciones</a>
<a className="nl" href="#faq" style={{color: "#111113", textDecoration: "none"}}>Preguntas</a>
</nav>
<button type="button" className="btn jbtn" onClick={v.openJoin} style={{border: "0", cursor: "pointer", font: "inherit", display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 20px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", textDecoration: "none", fontSize: "14px", fontWeight: "500"}}>Unirme a la lista</button>
</header></>
  )
}
