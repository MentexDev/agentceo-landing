# Luca aquí (Diego aprobó) — T34: evals LIVE contra producción (8cec919 ya está desplegado: versión eabdc365)
Sin cambios de diseño, NO push, NO deploy, NO escribir en D1 remota, nunca imprimir secretos. En local no hay clave: no crees .dev.vars.
- Añade a scripts/chat-evals.mjs un modo `--target=https://agentceo.io` que mande los 43 casos a POST /api/chat con el formato real del widget (SSE, Origin https://agentceo.io, UA de navegador real y Accept-Language), reutilice los mismos criterios y lea meta.mode (live/stub/cache).
- OJO a los límites de producción por IP: 10/min, 30/h, 60/día y 25 live/día. Espacia las peticiones (≥7 s) y usa una sesión por caso. Los casos que pasen de 25 live van a caer al stub: regístralo aparte (también sirve para confirmar el fallback).
- Gasto máximo: $0,50. Estima el coste por respuesta con los PRICES del modelo y súmalo.
- Incluye las sondas de jailbreak y confidencialidad, más 3 comprobaciones:
  - ráfaga de 12 mensajes en <60 s → algún 429;
  - mensaje de >500 caracteres → 400;
  - fallback al stub confirmado.
- Objetivo: ≥40/43 entre las respuestas live. Informe en docs/EVALS-CHAT-T34-PROD.md: aprobadas, fallos notables con la respuesta citada, número de respuestas live/stub/cache, coste estimado. Commit local.
