import React from 'react'
import { s, css } from '../lib/bind.js'

export default function S13LaForja({ v }) {
  return (
    <><section id="forja" aria-label="La Forja" style={{padding: "64px 16px", display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "36px", alignItems: "center", borderTop: "1.5px solid #111113"}}><div style={{display: "flex", flexDirection: "column", gap: "26px"}}><div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
<div data-rv=""><span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#5E5C56"}}>La Forja</span></div>
<h2 data-rv="" style={{"--d": "80ms", margin: "0", fontFamily: "'Instrument Serif',Georgia,serif", fontWeight: "400", fontSize: "38px", lineHeight: "1.04", letterSpacing: "-0.02em", color: "#111113", maxWidth: "900px"}}>Pídela. <span style={{fontStyle: "italic"}}>Tu equipo la construye.</span></h2>
<p data-rv="" style={{"--d": "160ms", margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#5E5C56", maxWidth: "560px"}}>Páginas web, landings, tiendas, apps y herramientas para tu equipo. <span style={{color: "#7A5C17"}}>Elige una y mírala nacer.</span></p>
</div><ul data-rv="" style={{"--d": "180ms", listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "12px"}}><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "16px", lineHeight: "1.5", color: "#111113"}}><span style={{marginTop: "3px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>La describes en el chat. No hay que saber programar.</li><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "16px", lineHeight: "1.5", color: "#111113"}}><span style={{marginTop: "3px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>La ves en vista previa y la cambias con un clic.</li><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "16px", lineHeight: "1.5", color: "#111113"}}><span style={{marginTop: "3px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Cada cambio queda guardado como versión.</li><li style={{display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "16px", lineHeight: "1.5", color: "#111113"}}><span style={{marginTop: "3px"}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5C17" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{display: "block", flexShrink: "0"}}><path d="M20 6 9 17l-5-5"></path></svg></span>Se lanza a tu GitHub y tu Vercel: el código es tuyo.</li></ul></div><div data-rv="" style={{"--d": "120ms", display: "flex", flexDirection: "column", gap: "14px", minWidth: "0"}}>
<div role="group" aria-label="Qué construir" style={{display: "flex", flexWrap: "wrap", gap: "6px"}}><button type="button" className={s(v.fkc0)} onClick={v.fks0} aria-pressed={s(v.fkp0)} style={{minHeight: "38px", padding: "0 13px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap"}}>Landing page</button><button type="button" className={s(v.fkc1)} onClick={v.fks1} aria-pressed={s(v.fkp1)} style={{minHeight: "38px", padding: "0 13px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap"}}>Sitio web</button><button type="button" className={s(v.fkc2)} onClick={v.fks2} aria-pressed={s(v.fkp2)} style={{minHeight: "38px", padding: "0 13px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap"}}>Tienda</button><button type="button" className={s(v.fkc3)} onClick={v.fks3} aria-pressed={s(v.fkp3)} style={{minHeight: "38px", padding: "0 13px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap"}}>Aplicación web</button><button type="button" className={s(v.fkc4)} onClick={v.fks4} aria-pressed={s(v.fkp4)} style={{minHeight: "38px", padding: "0 13px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap"}}>App móvil</button><button type="button" className={s(v.fkc5)} onClick={v.fks5} aria-pressed={s(v.fkp5)} style={{minHeight: "38px", padding: "0 13px", borderRadius: "999px", border: "1.5px solid #111113", font: "inherit", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap"}}>Herramienta interna</button></div>
<div style={{boxShadow: "10px 10px 0 #B8923A", borderRadius: "22px"}}>{(v.fk0) ? (<>
<div className="fwin" style={{display: "flex", flexDirection: "column", border: "1.5px solid #111113", borderRadius: "22px", overflow: "hidden", background: "#FBFAF7"}}>
<div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "#EAE7E0", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: "0.16em", color: "#5E5C56"}}>FORJA · LANDING PAGE</span>
<div style={{alignSelf: "flex-end", maxWidth: "92%", padding: "10px 12px", borderRadius: "14px 14px 4px 14px", background: "#111113", color: "#F4F2ED", fontSize: "13px", lineHeight: "1.4"}}><span className="ftype">Quiero una landing page que venda mi colección de otoño.</span></div>
<div className="fstep s1" style={{display: "flex", alignItems: "flex-start", gap: "8px"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4s", "--bd": "0s"}}>
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
</svg><span style={{padding: "8px 10px", borderRadius: "12px 12px 12px 4px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)", fontSize: "12px", color: "#111113"}}>Hecho el plan. Empiezo a construir.</span></div>
<div className="fstep s2" style={{display: "flex", flexDirection: "column", gap: "4px", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", color: "#5E5C56"}}><span>+ index.html</span><span>+ src/main.js</span><span>+ src/estilos.css</span></div>
<div className="fstep s3" style={{marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px"}}>
<span style={{fontSize: "12px", color: "#5E5C56"}}>Dónde vivirá: <b style={{color: "#111113"}}>Mi GitHub y mi Vercel</b></span>
<span className="flaunch" style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "14px"}}>Lanzar</span>
</div>
</div>
<div style={{display: "flex", flexDirection: "column", minWidth: "0"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "10px 12px", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{display: "flex", gap: "6px"}}><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Editar</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Test</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Preview</span></span>
<span style={{position: "relative", fontSize: "11px", whiteSpace: "nowrap", minWidth: "150px", textAlign: "right"}}><span className="fst f1">Borrador · aún no se ha creado</span><span className="fst f2">Construyendo…</span><span className="fst f3">Listo</span><span className="fst f4 flive">● En vivo ahora</span></span>
</div>
<div style={{position: "relative", flexGrow: "1", minHeight: "220px"}}><div style={{display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", padding: "16px"}}><span className="fb" style={{"--i": "0", display: "block", width: "60%", height: "18px", background: "#E7E2D6", borderRadius: "6px"}}></span><span className="fb" style={{"--i": "1", display: "block", width: "40%", height: "10px", background: "#E7E2D6", borderRadius: "6px"}}></span><span className="fb" style={{"--i": "2", display: "block", width: "110px", height: "30px", borderRadius: "999px", background: "#111113"}}></span><div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px", width: "100%", marginTop: "6px"}}><span className="fb" style={{"--i": "3", display: "block", height: "70px", border: "1.5px solid #111113", borderRadius: "8px"}}></span><span className="fb" style={{"--i": "4", display: "block", height: "70px", background: "#D9B866", borderRadius: "6px"}}></span><span className="fb" style={{"--i": "5", display: "block", height: "70px", border: "1.5px solid #111113", borderRadius: "8px"}}></span></div></div><div className="fbuild" aria-hidden="true"></div></div>
<div style={{display: "flex", gap: "14px", padding: "10px 12px", borderTop: "1px solid rgba(17,17,19,0.12)", fontSize: "11px", color: "#5E5C56", overflow: "hidden", whiteSpace: "nowrap"}}><span style={{color: "#111113"}}>Resumen</span><span>Versiones</span><span>Datos</span><span>Diseño</span><span>Conexiones</span><span>Pruebas</span></div>
</div>
</div>
</>) : null}{(v.fk1) ? (<>
<div className="fwin" style={{display: "flex", flexDirection: "column", border: "1.5px solid #111113", borderRadius: "22px", overflow: "hidden", background: "#FBFAF7"}}>
<div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "#EAE7E0", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: "0.16em", color: "#5E5C56"}}>FORJA · SITIO WEB</span>
<div style={{alignSelf: "flex-end", maxWidth: "92%", padding: "10px 12px", borderRadius: "14px 14px 4px 14px", background: "#111113", color: "#F4F2ED", fontSize: "13px", lineHeight: "1.4"}}><span className="ftype">Hazme un sitio con quiénes somos, servicios y contacto.</span></div>
<div className="fstep s1" style={{display: "flex", alignItems: "flex-start", gap: "8px"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4s", "--bd": "-1s"}}>
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
</svg><span style={{padding: "8px 10px", borderRadius: "12px 12px 12px 4px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)", fontSize: "12px", color: "#111113"}}>Hecho el plan. Empiezo a construir.</span></div>
<div className="fstep s2" style={{display: "flex", flexDirection: "column", gap: "4px", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", color: "#5E5C56"}}><span>+ index.html</span><span>+ src/main.js</span><span>+ src/estilos.css</span></div>
<div className="fstep s3" style={{marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px"}}>
<span style={{fontSize: "12px", color: "#5E5C56"}}>Dónde vivirá: <b style={{color: "#111113"}}>Mi GitHub y mi Vercel</b></span>
<span className="flaunch" style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "14px"}}>Lanzar</span>
</div>
</div>
<div style={{display: "flex", flexDirection: "column", minWidth: "0"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "10px 12px", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{display: "flex", gap: "6px"}}><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Editar</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Test</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Preview</span></span>
<span style={{position: "relative", fontSize: "11px", whiteSpace: "nowrap", minWidth: "150px", textAlign: "right"}}><span className="fst f1">Borrador · aún no se ha creado</span><span className="fst f2">Construyendo…</span><span className="fst f3">Listo</span><span className="fst f4 flive">● En vivo ahora</span></span>
</div>
<div style={{position: "relative", flexGrow: "1", minHeight: "220px"}}><div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "14px"}}><div style={{display: "flex", justifyContent: "space-between"}}><span className="fb" style={{"--i": "0", display: "block", width: "60px", height: "12px", background: "#E7E2D6", borderRadius: "6px"}}></span><div style={{display: "flex", gap: "8px"}}><span className="fb" style={{"--i": "1", display: "block", width: "36px", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span className="fb" style={{"--i": "1", display: "block", width: "36px", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span className="fb" style={{"--i": "1", display: "block", width: "36px", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span></div></div><span className="fb" style={{"--i": "2", display: "block", height: "80px", background: "#D9B866", borderRadius: "6px"}}></span><div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px"}}><span className="fb" style={{"--i": "3", display: "block", height: "54px", border: "1.5px solid #111113", borderRadius: "8px"}}></span><span className="fb" style={{"--i": "4", display: "block", height: "54px", border: "1.5px solid #111113", borderRadius: "8px"}}></span><span className="fb" style={{"--i": "5", display: "block", height: "54px", border: "1.5px solid #111113", borderRadius: "8px"}}></span></div><span className="fb" style={{"--i": "6", display: "block", width: "50%", height: "10px", background: "#E7E2D6", borderRadius: "6px"}}></span></div><div className="fbuild" aria-hidden="true"></div></div>
<div style={{display: "flex", gap: "14px", padding: "10px 12px", borderTop: "1px solid rgba(17,17,19,0.12)", fontSize: "11px", color: "#5E5C56", overflow: "hidden", whiteSpace: "nowrap"}}><span style={{color: "#111113"}}>Resumen</span><span>Versiones</span><span>Datos</span><span>Diseño</span><span>Conexiones</span><span>Pruebas</span></div>
</div>
</div>
</>) : null}{(v.fk2) ? (<>
<div className="fwin" style={{display: "flex", flexDirection: "column", border: "1.5px solid #111113", borderRadius: "22px", overflow: "hidden", background: "#FBFAF7"}}>
<div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "#EAE7E0", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: "0.16em", color: "#5E5C56"}}>FORJA · TIENDA</span>
<div style={{alignSelf: "flex-end", maxWidth: "92%", padding: "10px 12px", borderRadius: "14px 14px 4px 14px", background: "#111113", color: "#F4F2ED", fontSize: "13px", lineHeight: "1.4"}}><span className="ftype">Arma mi tienda con catálogo, carrito y cobro.</span></div>
<div className="fstep s1" style={{display: "flex", alignItems: "flex-start", gap: "8px"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4s", "--bd": "-2s"}}>
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
</svg><span style={{padding: "8px 10px", borderRadius: "12px 12px 12px 4px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)", fontSize: "12px", color: "#111113"}}>Hecho el plan. Empiezo a construir.</span></div>
<div className="fstep s2" style={{display: "flex", flexDirection: "column", gap: "4px", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", color: "#5E5C56"}}><span>+ index.html</span><span>+ src/main.js</span><span>+ src/estilos.css</span></div>
<div className="fstep s3" style={{marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px"}}>
<span style={{fontSize: "12px", color: "#5E5C56"}}>Dónde vivirá: <b style={{color: "#111113"}}>Mi GitHub y mi Vercel</b></span>
<span className="flaunch" style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "14px"}}>Sincronizar</span>
</div>
</div>
<div style={{display: "flex", flexDirection: "column", minWidth: "0"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "10px 12px", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{display: "flex", gap: "6px"}}><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Editar</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Test</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Preview</span></span>
<span style={{position: "relative", fontSize: "11px", whiteSpace: "nowrap", minWidth: "150px", textAlign: "right"}}><span className="fst f1">Borrador · aún no se ha creado</span><span className="fst f2">Construyendo…</span><span className="fst f3">Listo</span><span className="fst f4 flive">● Tu tienda está al día</span></span>
</div>
<div style={{position: "relative", flexGrow: "1", minHeight: "220px"}}><div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "14px"}}><div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}><span className="fb" style={{"--i": "0", display: "block", width: "80px", height: "12px", background: "#E7E2D6", borderRadius: "6px"}}></span><span className="fb" style={{"--i": "5", position: "relative", width: "26px", height: "22px", borderRadius: "6px", border: "1.5px solid #111113"}}><span className="cartb" style={{position: "absolute", top: "-7px", right: "-7px", width: "14px", height: "14px", borderRadius: "50%", background: "#D9B866"}}></span></span></div><div style={{display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px"}}><div className="fb" style={{"--i": "1", display: "flex", flexDirection: "column", gap: "6px"}}><span style={{display: "block", height: "64px", background: "#D9B866", borderRadius: "6px"}}></span><span style={{display: "block", width: "70%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", width: "40%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span></div><div className="fb" style={{"--i": "2", display: "flex", flexDirection: "column", gap: "6px"}}><span style={{display: "block", height: "64px", border: "1.5px solid #111113", borderRadius: "8px"}}></span><span style={{display: "block", width: "70%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", width: "40%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span></div><div className="fb" style={{"--i": "3", display: "flex", flexDirection: "column", gap: "6px"}}><span style={{display: "block", height: "64px", border: "1.5px solid #111113", borderRadius: "8px"}}></span><span style={{display: "block", width: "70%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", width: "40%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span></div></div><span className="fb" style={{"--i": "4", display: "block", width: "120px", height: "28px", borderRadius: "999px", background: "#111113"}}></span></div><div className="fbuild" aria-hidden="true"></div></div>
<div style={{display: "flex", gap: "14px", padding: "10px 12px", borderTop: "1px solid rgba(17,17,19,0.12)", fontSize: "11px", color: "#5E5C56", overflow: "hidden", whiteSpace: "nowrap"}}><span style={{color: "#111113"}}>Resumen</span><span>Versiones</span><span>Datos</span><span>Diseño</span><span>Conexiones</span><span>Pruebas</span></div>
</div>
</div>
</>) : null}{(v.fk3) ? (<>
<div className="fwin" style={{display: "flex", flexDirection: "column", border: "1.5px solid #111113", borderRadius: "22px", overflow: "hidden", background: "#FBFAF7"}}>
<div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "#EAE7E0", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: "0.16em", color: "#5E5C56"}}>FORJA · APLICACIÓN WEB</span>
<div style={{alignSelf: "flex-end", maxWidth: "92%", padding: "10px 12px", borderRadius: "14px 14px 4px 14px", background: "#111113", color: "#F4F2ED", fontSize: "13px", lineHeight: "1.4"}}><span className="ftype">Una app para que mis clientes reserven su cita.</span></div>
<div className="fstep s1" style={{display: "flex", alignItems: "flex-start", gap: "8px"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4s", "--bd": "-3s"}}>
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
</svg><span style={{padding: "8px 10px", borderRadius: "12px 12px 12px 4px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)", fontSize: "12px", color: "#111113"}}>Hecho el plan. Empiezo a construir.</span></div>
<div className="fstep s2" style={{display: "flex", flexDirection: "column", gap: "4px", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", color: "#5E5C56"}}><span>+ index.html</span><span>+ src/main.js</span><span>+ src/estilos.css</span></div>
<div className="fstep s3" style={{marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px"}}>
<span style={{fontSize: "12px", color: "#5E5C56"}}>Dónde vivirá: <b style={{color: "#111113"}}>Mi GitHub y mi Vercel</b></span>
<span className="flaunch" style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "14px"}}>Lanzar</span>
</div>
</div>
<div style={{display: "flex", flexDirection: "column", minWidth: "0"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "10px 12px", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{display: "flex", gap: "6px"}}><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Editar</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Test</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Preview</span></span>
<span style={{position: "relative", fontSize: "11px", whiteSpace: "nowrap", minWidth: "150px", textAlign: "right"}}><span className="fst f1">Borrador · aún no se ha creado</span><span className="fst f2">Construyendo…</span><span className="fst f3">Listo</span><span className="fst f4 flive">● En vivo ahora</span></span>
</div>
<div style={{position: "relative", flexGrow: "1", minHeight: "220px"}}><div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "14px"}}><span className="fb" style={{"--i": "0", display: "block", width: "50%", height: "14px", background: "#E7E2D6", borderRadius: "6px"}}></span><div style={{display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "6px"}}><span className="fb" style={{"--i": "1", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span><span className="fb" style={{"--i": "2", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span><span className="fb" style={{"--i": "3", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span><span className="fb" style={{"--i": "4", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span><span className="fb" style={{"--i": "5", display: "block", height: "26px", borderRadius: "6px", background: "#D9B866"}}></span><span className="fb" style={{"--i": "6", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span><span className="fb" style={{"--i": "7", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span><span className="fb" style={{"--i": "8", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span><span className="fb" style={{"--i": "9", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span><span className="fb" style={{"--i": "10", display: "block", height: "26px", borderRadius: "6px", background: "#D9B866"}}></span><span className="fb" style={{"--i": "11", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span><span className="fb" style={{"--i": "12", display: "block", height: "26px", borderRadius: "6px", border: "1px solid rgba(17,17,19,.25)"}}></span></div><span className="fb" style={{"--i": "13", display: "block", width: "130px", height: "28px", borderRadius: "999px", background: "#111113"}}></span></div><div className="fbuild" aria-hidden="true"></div></div>
<div style={{display: "flex", gap: "14px", padding: "10px 12px", borderTop: "1px solid rgba(17,17,19,0.12)", fontSize: "11px", color: "#5E5C56", overflow: "hidden", whiteSpace: "nowrap"}}><span style={{color: "#111113"}}>Resumen</span><span>Versiones</span><span>Datos</span><span>Diseño</span><span>Conexiones</span><span>Pruebas</span></div>
</div>
</div>
</>) : null}{(v.fk4) ? (<>
<div className="fwin" style={{display: "flex", flexDirection: "column", border: "1.5px solid #111113", borderRadius: "22px", overflow: "hidden", background: "#FBFAF7"}}>
<div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "#EAE7E0", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: "0.16em", color: "#5E5C56"}}>FORJA · APP MÓVIL</span>
<div style={{alignSelf: "flex-end", maxWidth: "92%", padding: "10px 12px", borderRadius: "14px 14px 4px 14px", background: "#111113", color: "#F4F2ED", fontSize: "13px", lineHeight: "1.4"}}><span className="ftype">Una app para iPhone y Android con avisos de ofertas.</span></div>
<div className="fstep s1" style={{display: "flex", alignItems: "flex-start", gap: "8px"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4s", "--bd": "-4s"}}>
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
</svg><span style={{padding: "8px 10px", borderRadius: "12px 12px 12px 4px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)", fontSize: "12px", color: "#111113"}}>Hecho el plan. Empiezo a construir.</span></div>
<div className="fstep s2" style={{display: "flex", flexDirection: "column", gap: "4px", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", color: "#5E5C56"}}><span>+ index.html</span><span>+ src/main.js</span><span>+ src/estilos.css</span></div>
<div className="fstep s3" style={{marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px"}}>
<span style={{fontSize: "12px", color: "#5E5C56"}}>Dónde vivirá: <b style={{color: "#111113"}}>Mi GitHub y mi Vercel</b></span>
<span className="flaunch" style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "14px"}}>Preparar</span>
</div>
</div>
<div style={{display: "flex", flexDirection: "column", minWidth: "0"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "10px 12px", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{display: "flex", gap: "6px"}}><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Editar</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Test</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Preview</span></span>
<span style={{position: "relative", fontSize: "11px", whiteSpace: "nowrap", minWidth: "150px", textAlign: "right"}}><span className="fst f1">Borrador · aún no se ha creado</span><span className="fst f2">Construyendo…</span><span className="fst f3">Listo</span><span className="fst f4 flive">● Lista para las tiendas</span></span>
</div>
<div style={{position: "relative", flexGrow: "1", minHeight: "220px"}}><div style={{display: "flex", justifyContent: "center", padding: "10px"}}><div className="fb" style={{"--i": "0", width: "130px", height: "210px", borderRadius: "22px", border: "2px solid #111113", padding: "10px 8px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "6px", position: "relative"}}><span className="fb" style={{"--i": "1", display: "block", padding: "6px", borderRadius: "8px", background: "#D9B866", fontSize: "9px", color: "#111113"}}>¡Nueva oferta!</span><span className="fb" style={{"--i": "2", display: "block", height: "26px", border: "1.5px solid #111113", borderRadius: "8px"}}></span><span className="fb" style={{"--i": "3", display: "block", height: "26px", border: "1.5px solid #111113", borderRadius: "8px"}}></span><span className="fb" style={{"--i": "4", display: "block", height: "26px", border: "1.5px solid #111113", borderRadius: "8px"}}></span><span className="fb" style={{"--i": "5", display: "block", height: "26px", border: "1.5px solid #111113", borderRadius: "8px"}}></span></div></div><div className="fbuild" aria-hidden="true"></div></div>
<div style={{display: "flex", gap: "14px", padding: "10px 12px", borderTop: "1px solid rgba(17,17,19,0.12)", fontSize: "11px", color: "#5E5C56", overflow: "hidden", whiteSpace: "nowrap"}}><span style={{color: "#111113"}}>Resumen</span><span>Versiones</span><span>Datos</span><span>Diseño</span><span>Conexiones</span><span>Pruebas</span></div>
</div>
</div>
</>) : null}{(v.fk5) ? (<>
<div className="fwin" style={{display: "flex", flexDirection: "column", border: "1.5px solid #111113", borderRadius: "22px", overflow: "hidden", background: "#FBFAF7"}}>
<div style={{display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "#EAE7E0", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: "0.16em", color: "#5E5C56"}}>FORJA · HERRAMIENTA INTERNA</span>
<div style={{alignSelf: "flex-end", maxWidth: "92%", padding: "10px 12px", borderRadius: "14px 14px 4px 14px", background: "#111113", color: "#F4F2ED", fontSize: "13px", lineHeight: "1.4"}}><span className="ftype">Una herramienta para los pedidos y turnos del equipo.</span></div>
<div className="fstep s1" style={{display: "flex", alignItems: "flex-start", gap: "8px"}}><svg className="mascot " aria-hidden="true" width="26" height="26" viewBox="0 0 100 100" style={{display: "block", overflow: "visible"}}>
<g className="body">
<g data-tilt="">
<line x1="50" y1="19" x2="50" y2="7" stroke="#111113" strokeWidth="3" strokeLinecap="round"></line><circle className="ant" cx="50" cy="6" r="4.5" fill="#B8923A"></circle><rect x="12" y="18" width="76" height="70" rx="26" fill="#111113"></rect>
<g className="eyes" style={{"--bl": "4s", "--bd": "-5s"}}>
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
</svg><span style={{padding: "8px 10px", borderRadius: "12px 12px 12px 4px", background: "#FBFAF7", border: "1px solid rgba(17,17,19,0.22)", fontSize: "12px", color: "#111113"}}>Hecho el plan. Empiezo a construir.</span></div>
<div className="fstep s2" style={{display: "flex", flexDirection: "column", gap: "4px", fontFamily: "'Geist Mono',ui-monospace,monospace", fontSize: "11px", color: "#5E5C56"}}><span>+ index.html</span><span>+ src/main.js</span><span>+ src/estilos.css</span></div>
<div className="fstep s3" style={{marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px"}}>
<span style={{fontSize: "12px", color: "#5E5C56"}}>Dónde vivirá: <b style={{color: "#111113"}}>Mi GitHub y mi Vercel</b></span>
<span className="flaunch" style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40px", borderRadius: "999px", background: "#111113", color: "#F4F2ED", fontSize: "14px"}}>Invitar</span>
</div>
</div>
<div style={{display: "flex", flexDirection: "column", minWidth: "0"}}>
<div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "10px 12px", borderBottom: "1px solid rgba(17,17,19,0.12)"}}>
<span style={{display: "flex", gap: "6px"}}><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Editar</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Test</span><span style={{padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(17,17,19,0.22)", fontSize: "11px", color: "#111113"}}>Preview</span></span>
<span style={{position: "relative", fontSize: "11px", whiteSpace: "nowrap", minWidth: "150px", textAlign: "right"}}><span className="fst f1">Borrador · aún no se ha creado</span><span className="fst f2">Construyendo…</span><span className="fst f3">Listo</span><span className="fst f4 flive">● Tu equipo ya entra</span></span>
</div>
<div style={{position: "relative", flexGrow: "1", minHeight: "220px"}}><div style={{display: "flex", flexDirection: "column", gap: "4px", padding: "14px"}}><span className="fb" style={{"--i": "0", display: "block", width: "40%", height: "14px", marginBottom: "6px", background: "#E7E2D6", borderRadius: "6px"}}></span><div className="fb" style={{"--i": "1", display: "grid", gridTemplateColumns: "1fr 1fr 70px", gap: "8px", alignItems: "center", padding: "6px 0", borderTop: "1px solid rgba(17,17,19,.12)"}}><span style={{display: "block", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", width: "60%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", height: "16px", borderRadius: "999px", background: "#D9B866"}}></span></div><div className="fb" style={{"--i": "2", display: "grid", gridTemplateColumns: "1fr 1fr 70px", gap: "8px", alignItems: "center", padding: "6px 0", borderTop: "1px solid rgba(17,17,19,.12)"}}><span style={{display: "block", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", width: "60%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", height: "16px", borderRadius: "999px", border: "1px solid #111113"}}></span></div><div className="fb" style={{"--i": "3", display: "grid", gridTemplateColumns: "1fr 1fr 70px", gap: "8px", alignItems: "center", padding: "6px 0", borderTop: "1px solid rgba(17,17,19,.12)"}}><span style={{display: "block", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", width: "60%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", height: "16px", borderRadius: "999px", background: "#D9B866"}}></span></div><div className="fb" style={{"--i": "4", display: "grid", gridTemplateColumns: "1fr 1fr 70px", gap: "8px", alignItems: "center", padding: "6px 0", borderTop: "1px solid rgba(17,17,19,.12)"}}><span style={{display: "block", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", width: "60%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", height: "16px", borderRadius: "999px", border: "1px solid #111113"}}></span></div><div className="fb" style={{"--i": "5", display: "grid", gridTemplateColumns: "1fr 1fr 70px", gap: "8px", alignItems: "center", padding: "6px 0", borderTop: "1px solid rgba(17,17,19,.12)"}}><span style={{display: "block", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", width: "60%", height: "8px", background: "#E7E2D6", borderRadius: "6px"}}></span><span style={{display: "block", height: "16px", borderRadius: "999px", background: "#D9B866"}}></span></div></div><div className="fbuild" aria-hidden="true"></div></div>
<div style={{display: "flex", gap: "14px", padding: "10px 12px", borderTop: "1px solid rgba(17,17,19,0.12)", fontSize: "11px", color: "#5E5C56", overflow: "hidden", whiteSpace: "nowrap"}}><span style={{color: "#111113"}}>Resumen</span><span>Versiones</span><span>Datos</span><span>Diseño</span><span>Conexiones</span><span>Pruebas</span></div>
</div>
</div>
</>) : null}</div>
<button type="button" onClick={v.fkAgain} style={{alignSelf: "flex-start", background: "none", border: "0", font: "inherit", fontSize: "14px", color: "#7A5C17", textDecoration: "underline", cursor: "pointer", minHeight: "44px"}}>↻ Verla construirse otra vez</button>
</div></section></>
  )
}
