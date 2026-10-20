import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S20Footer({ v }) {
  return (
    <><footer style={{background: "#111113", color: "#a9a7a0", padding: "32px 96px", borderTop: "1px solid rgba(244,242,237,0.14)", display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "16px", fontSize: "14px"}}>
<span style={{display: "flex", alignItems: "center", gap: "10px", color: "#F4F2ED"}}><svg className="mascot " aria-hidden="true" width="28" height="28" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
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

</g>
</svg><span style={{fontSize: "17px", fontWeight: "600"}}>agent<span style={{color: "#B8923A"}}>.</span>ceo</span></span>
<span style={{display: "flex", gap: "22px"}}><a href="#faq" style={{color: "#a9a7a0", textDecoration: "none"}}>Preguntas</a><a href="#top" style={{color: "#a9a7a0", textDecoration: "none"}}>Términos</a><a href="#top" style={{color: "#a9a7a0", textDecoration: "none"}}>Privacidad</a></span>
<span>© 2026 Klinworks, LLC</span>
</footer></>
  )
}
