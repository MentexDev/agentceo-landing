# PROGRESO · Landing v2

Una línea por fase cerrada: fecha · fase · qué quedó · commit.

- 2026-10-20 · **Fase 1 · Esqueleto** — Astro estático (formato *preserve*, mismas URLs), tokens con contraste medido, fuentes autoalojadas, Header/Footer/selector de idioma accesibles sin JS, i18n es/en con rutas únicas, Worker sirviendo dist/ (www→apex, legales .html→301, 404 por idioma, CSP self). Tests: 48 unitarios (workerd + D1 local) + 13 e2e en Chromium/WebKit escritorio y móvil.
