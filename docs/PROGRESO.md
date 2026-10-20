# PROGRESO · Landing v2

Una línea por fase cerrada: fecha · fase · qué quedó · commit.

- 2026-10-20 · **Fase 1 · Esqueleto** — Astro estático (formato *preserve*, mismas URLs), tokens con contraste medido, fuentes autoalojadas, Header/Footer/selector de idioma accesibles sin JS, i18n es/en con rutas únicas, Worker sirviendo dist/ (www→apex, legales .html→301, 404 por idioma, CSP self). Tests: 48 unitarios (workerd + D1 local) + 13 e2e en Chromium/WebKit escritorio y móvil. `0dbbd95`
- 2026-10-20 · **Fase 2 · Lista de espera** — WaitlistForm único (form real sin JS → /gracias/), éxito solo con respuesta real del Worker, modal <dialog> de 3 pasos (negocio opcional), CTA fijo móvil, exit-intent escritorio, UTM/click-id de primer toque, aviso CCPA con versión, rate limit nativo 8/min/IP + trampa de tiempo + origen, migración 0002 aditiva con respaldo v1 probado. Tests: 64 unitarios + 35 e2e. `d5b1cf3`
- 2026-10-20 · **Fase W · Widget «Tu CEO»** — lanzador con mascota e insignia IA, panel compacto/grande/pantalla completa, hoja móvil arrastrable, streaming SSE, markdown seguro, chips y sugerencias por página, lista de espera dentro del chat, persistencia 7 días, eventos de conversión (sin proveedor). Worker /api/chat: flag off/stub/live (stub activo), BM25 sobre la base generada del sitio, rate limit 10/min + 60/día por IP (DO con hash), 12 turnos, techo $5/día para live (probado con fetch falso). Precisión medida del stub: 44 % en reservado limpio. Tests: 100 unitarios + 68 e2e. `2e2d9bd`
- 2026-10-20 · **Fase 3 · Portada** — 18 secciones del prototipo compiladas a un árbol responsive (fidelidad pixelmatch: escritorio 0,8–5,7 %), islas Preact solo donde hay interacción, hero estático, FAQ reescrita con content/faq.js + FAQPage, contraste corregido, axe WCAG 2.2 AA 0 violaciones, inglés completo. JS del prototipo 142,6 KB gz de golpe → v2 entradas < 1 KB + islas al verse. Tests: 102 unitarios + 98 e2e. `f1cdba8`
- 2026-10-20 · **Fase 4 · Páginas internas** — Noticias/Blog/Recursos (listado con destacada y filtros, artículo con fuentes, compartir, relacionados, gate de recursos → /api/lead), Precios (plan gratis + pago con PENDIENTE visible, FAQ de precios con FAQPage), Empresa (datos verificables de Klinworks, LLC), Contacto (buzones @klinworks.com), Prensa (kit de marca). JSON-LD por página (CollectionPage, NewsArticle/BlogPosting/Article con citation, BreadcrumbList, AboutPage, ContactPage). axe 0 violaciones en 10 páginas × 2 anchos. Tests: 139 unitarios + 122 e2e. `b43de45` · precios reales `5352c40`
- 2026-10-20 · **Fase 5 · SEO + GEO** — sitemap con hreflang, robots con bots de IA, llms.txt/llms-full.txt (es/en), OG 1200×630 por página (resvg + fuentes del sitio), meta ≤160, un h1 por página, JSON-LD válido en todas, caché inmutable de assets, CSS crítico, filtros sin JS (CLS 0). Lighthouse local 98–100 en todo; LCP escritorio 0,4–0,6 s; móvil 1,7–1,8 s (portada 2,0–2,1 s: ⏳ ver DUDAS). Tests: 192 unitarios + 126 e2e. `60006fd`
- 2026-10-20 · **Fase L · Legal** — 14 documentos en borrador (5 actualizados + 9 nuevos) con banda visible y PENDIENTE resaltados, docs/LEGAL-CHECKLIST.md, datos de una sola fuente (subprocesadores, almacenamiento), panel de cookies (sin analítica; funcional desactivable que borra lo guardado), GPC respetado, página «No vender ni compartir», aviso CCPA en formularios, widget con base legal. axe 0 violaciones. Tests: 263 unitarios + 136 e2e. `c9e6b17` · fix(legal) `fc00328`
- 2026-10-20 · **Fase S03 · La app real, recreada** — isla Preact con los tokens y textos reales de la app (sidebar Trabajo/Empresa, chat con el CEO que piensa → usa herramientas con créditos → responde en streaming, aprobación que se firma, Biblioteca, Panel de Comando, Ventas y Clientes con métricas que suben, selector de marca), datos inventados de «Lúa», es/en, pausa visible, reduced-motion, axe 0. Tests: 268 unitarios + 168 e2e. `f49540a`
- 2026-10-20 · **Fase 6 · Inglés** — noticias, blog, recursos, precios, empresa, contacto, prensa, «Do Not Sell or Share» y los 14 legales en /en/ (80 páginas en total), hreflang recíproco por pieza, widget y llms.txt en inglés con su contenido, axe 0 en /en/. Tests: 438 unitarios + 176 e2e.
- 2026-10-20 · **Fase 7 · Verificación final** — todo medido sobre un build limpio (`rm -rf dist .astro`):
  - **Build:** 80 páginas HTML + 80 imágenes OG, 1,95 s; `dist/` 9,1 MB; base del widget de 45 + 45 fragmentos.
  - **Unitarios (vitest; Worker en workerd con D1 local + sitio):** **438/438** en 11 ficheros.
  - **E2E (Playwright, Chromium escritorio 1440, WebKit iPhone 15 y Chromium Pixel 7, contra `wrangler dev` con D1 local):** **176 pasan, 0 fallan**. Se omiten 10 por dispositivo (p. ej. el exit-intent solo en escritorio y la hoja del chat solo en móvil).
  - **Lighthouse 13 local** (sin PageSpeed; 11 páginas × móvil y escritorio = 22 pasadas):
    - **Rendimiento:** móvil 98–100; escritorio 100 en todas.
    - **Accesibilidad:** 100 en todas, tras corregir el orden de títulos del gate de recursos (antes 98).
    - **Buenas prácticas** y **SEO:** 100 en todas.
    - **LCP:** escritorio 0,4–0,5 s; móvil 1,5–1,8 s en las internas; **portada 2,1 s (es) / 2,0 s (en)**, sobre el presupuesto de < 2,0 s (ver DUDAS, Fase 5).
    - **CLS** 0–0,029 (presupuesto < 0,05) ✅ · **TBT** 0 ms en todas (INP no se mide en laboratorio) ✅.
  - **axe WCAG 2.2 AA:** 0 violaciones en todas las páginas auditadas (es y en, 390 y 1440 px).
  - **Seguridad:** sin claves en el código, en `dist/` ni en el historial de git; `npm audit`: 0 vulnerabilidades.
- 2026-10-20 · **LCP y pausa (arreglos de Luca)**:
  - **LCP de la portada en móvil (Lighthouse 13 local), de 2,1 s (es) y 2,0 s (en) a 1,66–1,81 s en es y en**, en 8 pasadas. CLS 0, y 99–100 en rendimiento, accesibilidad, buenas prácticas y SEO. Escritorio: 0,4 s.
  - **Cómo se consiguió:**
    - titular y entradilla suben sin fundido (la entrada conserva su recorrido y escalonado; etiqueta y botones conservan el fundido completo);
    - CSS no crítico con hash, pedido tras `load`;
    - un solo módulo JS;
    - islas sin props serializados;
    - fuentes de respaldo con métricas reales, que dejan el CLS en 0.
  - **Pausa y reproducción visibles (WCAG 2.2.2):** en los 7 carruseles automáticos (S05, S10, S11, S14, S16 y S17 en móvil, y S11 en escritorio). Botón con `aria-pressed` y etiqueta es/en; lo inyecta el compilador y lo gobierna `vida.js`. Arreglado de paso: el autoplay de S11 en escritorio nunca avanzaba (el ref móvil pisaba al de escritorio).
  - **Tests:**
    - 438 unitarios;
    - e2e: escritorio 64/64 y Chromium móvil 63/63, con `carousels.spec.js` nuevo y 4 mutaciones a mano que se ponen en rojo;
    - ⚠️ WebKit no se pudo medir al final: deja de arrancar en esta Mac (`browserType.launch` timeout). Antes de romperse, `carousels.spec` pasó 42/42 en los 3 navegadores. La suite completa con los 3 proyectos en paralelo se cuelga también en HEAD (`a2b5086`): no lo introduce este cambio.
