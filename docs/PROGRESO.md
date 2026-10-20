# PROGRESO · Landing v2

Una línea por fase cerrada: fecha · fase · qué quedó · commit.

- 2026-10-20 · **Fase 1 · Esqueleto** — Astro estático (formato *preserve*, mismas URLs), tokens con contraste medido, fuentes autoalojadas, Header/Footer/selector de idioma accesibles sin JS, i18n es/en con rutas únicas, Worker sirviendo dist/ (www→apex, legales .html→301, 404 por idioma, CSP self). Tests: 48 unitarios (workerd + D1 local) + 13 e2e en Chromium/WebKit escritorio y móvil. `0dbbd95`
- 2026-10-20 · **Fase 2 · Lista de espera** — WaitlistForm único (form real sin JS → /gracias/), éxito solo con respuesta real del Worker, modal <dialog> de 3 pasos (negocio opcional), CTA fijo móvil, exit-intent escritorio, UTM/click-id de primer toque, aviso CCPA con versión, rate limit nativo 8/min/IP + trampa de tiempo + origen, migración 0002 aditiva con respaldo v1 probado. Tests: 64 unitarios + 35 e2e.
