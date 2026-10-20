import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S08VendedorEnWhatsApp({ v }) {
  return (
    <><section id="whatsapp" aria-label="Vendedor en WhatsApp" style={{padding: "140px 96px", display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)", gap: "96px", alignItems: "center", borderTop: "1.5px solid #111113"}}><div style={{display: "flex", flexDirection: "column", gap: "28px"}}><div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
<div data-rv=""><span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5E5C56"}}>WhatsApp</span></div>
<h2 data-rv="" style={{"--d": "80ms", margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "62px", lineHeight: "1.04", letterSpacing: "-0.02em", color: "#111113", maxWidth: "900px"}}>Vende por WhatsApp. <span style={{fontStyle: "italic"}}>Y cuida tu tienda.</span></h2>
<p data-rv="" style={{"--d": "160ms", margin: "0", fontSize: "19px", lineHeight: "1.6", color: "#5E5C56", maxWidth: "560px"}}>Responde a las 3 a. m., cierra la venta y vigila tus pedidos, carritos y stock.</p>
</div><ul data-rv="" style={{"--d": "200ms", listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "12px"}}><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "16px", lineHeight: "1.5", color: "#111113"}}><span style={{marginTop: "3px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Responde a cualquier hora, con el tono de tu marca.</li><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "16px", lineHeight: "1.5", color: "#111113"}}><span style={{marginTop: "3px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Por código QR o con el número oficial de WhatsApp.</li><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "16px", lineHeight: "1.5", color: "#111113"}}><span style={{marginTop: "3px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Todas las conversaciones en una sola bandeja.</li><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "16px", lineHeight: "1.5", color: "#111113"}}><span style={{marginTop: "3px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Cada cliente avanza paso a paso hasta pagar.</li></ul><div data-rv="" style={{"--d": "160ms", display: "flex", flexDirection: "column", gap: "14px", padding: "20px", border: "1.5px solid #111113", borderRadius: "22px", background: "#FBFAF7"}}>
<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}><span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", letterSpacing: "0.16em", color: "#5E5C56"}}>LA VENTA DE LAURA</span><span className="paid" style={{padding: "4px 10px", borderRadius: "999px", background: "#B8923A", color: "#fff", fontSize: "12px"}}>¡Venta cerrada!</span></div>
<div style={{display: "flex", gap: "8px"}}><div style={{flex: "1", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center"}}><span style={{fontSize: "12px", color: "#5E5C56"}}>Nuevo</span><span className="stg" style={{"--i": "0", width: "100%", height: "6px", borderRadius: "3px"}}></span></div><div style={{flex: "1", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center"}}><span style={{fontSize: "12px", color: "#5E5C56"}}>Interesado</span><span className="stg" style={{"--i": "1", width: "100%", height: "6px", borderRadius: "3px"}}></span></div><div style={{flex: "1", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center"}}><span style={{fontSize: "12px", color: "#5E5C56"}}>Apartado</span><span className="stg" style={{"--i": "2", width: "100%", height: "6px", borderRadius: "3px"}}></span></div><div style={{flex: "1", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center"}}><span style={{fontSize: "12px", color: "#5E5C56"}}>Pagado</span><span className="stg" style={{"--i": "3", width: "100%", height: "6px", borderRadius: "3px"}}></span></div></div>
</div></div><div data-rv="" style={{display: "flex", flexDirection: "column"}}><div role="tablist" aria-label="Qué vigila" style={{display: "flex", gap: "6px", padding: "5px", borderRadius: "999px", border: "1.5px solid #111113", alignSelf: "center", margin: "0 auto 16px", width: "max-content"}}>
<button type="button" role="tab" aria-selected={s(v.waSel0)} className={s(v.waC0)} onClick={v.waT0} style={{minHeight: "40px", padding: "0 18px", borderRadius: "999px", border: "0", font: "inherit", fontSize: "14px", cursor: "pointer"}}>WhatsApp</button>
<button type="button" role="tab" aria-selected={s(v.waSel1)} className={s(v.waC1)} onClick={v.waT1} style={{minHeight: "40px", padding: "0 18px", borderRadius: "999px", border: "0", font: "inherit", fontSize: "14px", cursor: "pointer"}}>Tu tienda</button>
</div>{(v.waP0) ? (<><div aria-hidden="true" style={{width: "340px", margin: "0 auto", border: "2px solid #111113", borderRadius: "40px", padding: "12px", background: "#FBFAF7", boxShadow: "10px 10px 0 #B8923A"}}>
<div style={{borderRadius: "30px", overflow: "hidden", background: "#EAE7E0", display: "flex", flexDirection: "column", height: "500px"}}>
<div style={{display: "flex", alignItems: "center", gap: "10px", padding: "14px", background: "#111113", color: "#F4F2ED"}}><svg className="mascot " aria-hidden="true" width="30" height="30" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50 16a37 37 0 1 1-19.8 68.3L13 90l5.8-16.6A37 37 0 0 1 50 16z" fill="#F4F2ED"></path>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.8" cx="38" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#F4F2ED"></circle>
<ellipse data-eye="1.8" cx="62" cy="51" rx="8.5" ry="10.5" fill="#111113"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#F4F2ED"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#111113" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#111113" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{display: "flex", flexDirection: "column"}}><span style={{fontSize: "14px", fontWeight: "600"}}>Tu tienda</span><span style={{fontSize: "11px", color: "#a9a7a0"}}>responde al instante</span></span></div>
<div style={{flexGrow: "1", padding: "14px 12px", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "flex-end"}}><div className="wam" style={{"--i": "0", alignSelf: "flex-start", maxWidth: "82%", padding: "9px 12px", borderRadius: "14px 14px 14px 4px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)", fontSize: "13.5px", lineHeight: "1.4", color: "#111113"}}>Hola, ¿tienen la camiseta negra en talla M?</div><div className="wam" style={{"--i": "1", alignSelf: "flex-end", maxWidth: "82%", padding: "9px 12px", borderRadius: "14px 14px 4px 14px", background: "#111113", color: "#F4F2ED", fontSize: "13.5px", lineHeight: "1.4"}}>¡Hola, Laura! Sí, nos quedan tres. ¿Te la aparto?</div><div className="wam" style={{"--i": "2", alignSelf: "flex-start", maxWidth: "82%", padding: "9px 12px", borderRadius: "14px 14px 14px 4px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)", fontSize: "13.5px", lineHeight: "1.4", color: "#111113"}}>Sí, porfa. ¿Cuánto cuesta el envío?</div><div className="wam" style={{"--i": "3", alignSelf: "flex-end", maxWidth: "82%", padding: "9px 12px", borderRadius: "14px 14px 4px 14px", background: "#111113", color: "#F4F2ED", fontSize: "13.5px", lineHeight: "1.4"}}>Gratis a Bogotá. Te mando el enlace de pago.</div><div className="wam" style={{"--i": "4", alignSelf: "flex-start", maxWidth: "82%", padding: "9px 12px", borderRadius: "14px 14px 14px 4px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)", fontSize: "13.5px", lineHeight: "1.4", color: "#111113"}}>¡Listo, ya pagué!</div></div>
</div>
</div></>) : null}{(v.waP1) ? (<><div className="pop"><div aria-hidden="true" style={{width: "360px", maxWidth: "100%", margin: "0 auto", border: "2px solid #111113", borderRadius: "24px", background: "#FBFAF7", overflow: "hidden", boxShadow: "10px 10px 0 #B8923A"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#111113", color: "#F4F2ED"}}><span style={{fontSize: "14px", fontWeight: "600"}}>Tu tienda · hoy</span><span style={{display: "flex", alignItems: "center", gap: "6px", fontSize: "11px"}}><span className="live" style={{width: "6px", height: "6px", borderRadius: "50%", background: "#D9B866"}}></span>vigilando</span></div>
<div style={{padding: "14px", display: "flex", flexDirection: "column", gap: "10px"}}>
<div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px"}}>
<div style={{padding: "10px", borderRadius: "12px", border: "1px solid rgba(17,17,19,0.22)"}}><div style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "24px", color: "#111113"}}>18</div><div style={{fontSize: "11px", color: "#5E5C56"}}>pedidos</div></div>
<div style={{padding: "10px", borderRadius: "12px", border: "1px solid rgba(17,17,19,0.22)"}}><div style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "24px", color: "#111113"}}>3</div><div style={{fontSize: "11px", color: "#5E5C56"}}>carritos</div></div>
<div style={{padding: "10px", borderRadius: "12px", border: "1px solid rgba(17,17,19,0.22)", background: "#EFE4C8"}}><div style={{fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "24px", color: "#111113"}}>1</div><div style={{fontSize: "11px", color: "#7A5C17"}}>stock bajo</div></div>
</div>
<div className="wam" style={{"--i": "0", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", background: "#EAE7E0", border: "1px solid rgba(17,17,19,0.22)"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.5" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.5" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{fontSize: "13px", lineHeight: "1.35", color: "#111113"}}>Pedido #1043 pagado. Ya avisé a producción.</span></div><div className="wam" style={{"--i": "1", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<path d="M50 16a37 37 0 1 1-19.8 68.3L13 90l5.8-16.6A37 37 0 0 1 50 16z" fill="#111113"></path>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.5" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.5" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{fontSize: "13px", lineHeight: "1.35", color: "#111113"}}>Recuperé un carrito: Sofía terminó su compra.</span></div><div className="wam" style={{"--i": "2", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", background: "#EAE7E0", border: "1px solid rgba(17,17,19,0.22)"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="14" y="18" width="72" height="70" rx="9" fill="#111113"></rect><path d="M14 32h72" stroke="#F4F2ED" strokeWidth="2" opacity="0.18"></path>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.5" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.5" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{fontSize: "13px", lineHeight: "1.35", color: "#111113"}}>La camiseta negra M se acaba. Preparé el pedido.</span></div><div className="wam" style={{"--i": "3", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<rect x="7" y="26" width="86" height="56" rx="28" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.5" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.5" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{fontSize: "13px", lineHeight: "1.35", color: "#111113"}}>Subí la foto nueva al producto estrella.</span></div><div className="wam" style={{"--i": "4", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", background: "#EAE7E0", border: "1px solid rgba(17,17,19,0.22)"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4.6s", "--bd": "0.0s"}}>
<g className="eyeopen">
<ellipse data-eye="1.5" cx="38" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="38" cy="52" r="4.4" fill="#111113"></circle>
<ellipse data-eye="1.5" cx="62" cy="51" rx="8.5" ry="10.5" fill="#F4F2ED"></ellipse><circle className="pupil" cx="62" cy="52" r="4.4" fill="#111113"></circle>
</g>
<g className="eyearc"><path d="M30 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path><path d="M54 53q8-9 16 0" stroke="#F4F2ED" strokeWidth="3.6" fill="none" strokeLinecap="round"></path></g>
</g>
<path className="mouth" d="M44 69q6 5 12 0" stroke="#F4F2ED" strokeWidth="3" fill="none" strokeLinecap="round"></path>
<circle className="blush" cx="27" cy="64" r="4" fill="#B8923A"></circle><circle className="blush" cx="73" cy="64" r="4" fill="#B8923A"></circle>
</g>

</g>
</svg><span style={{fontSize: "13px", lineHeight: "1.35", color: "#111113"}}>Hoy vendiste más que ayer. Resumen a las 7:00.</span></div>
</div></div></div></>) : null}</div></section></>
  )
}
