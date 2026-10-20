# Luca aquí (Diego aprobó) — T35 (hazlo DESPUÉS de T34). Commit local, NO push, NO deploy. Mismas reglas de siempre.
A. Caché inteligente de respuestas (las preguntas comunes nunca llegan al LLM):
  1. Los chips de respuesta rápida del widget llevan a respuestas curadas y escritas de antemano (ES/EN, tono de fundador cálido, CTA a la lista). Se sirven al instante y con coste 0 de LLM.
  2. Texto libre: antes del LLM, normaliza (minúsculas, tildes, puntuación, idioma) y compáralo con el set curado del FAQ con un umbral de confianza (BM25/palabras clave + sinónimos). Con confianza alta → respuesta curada; si no → LLM. Embeddings de Workers AI solo si entran en el plan gratis: indica el costo; si no, no los uses.
  3. Mantén la caché de 6 h de respuestas idénticas, versionada por hash del contenido para que un cambio de precios la invalide sola.
  4. Contadores: % respondido por curado/caché frente a LLM (solo contadores, sin PII).
  Tests y evals que muestren la tasa de acierto de la caché sobre las 43 preguntas.
B. Diego quiere VOLVER a la fuente original Instrument Serif (se lee mejor que Fraunces), pero con un grosor visual cercano al de Fraunces 560.
  - Como solo existe en peso 400, usa un falso negrita afinado: -webkit-text-stroke ~0.5–0.8 px en currentColor, escalado en em con el tamaño, y paint-order. Si hace falta, text-shadow como respaldo.
  - Revísalo en hero, secciones y tarjetas, en Chrome, Safari y Firefox: sin contraformas empastadas, itálica incluida.
  - Haz capturas lado a lado con las de docs/capturas-t33 (Fraunces).
  - Revierte también la fuente de las imágenes OG.
  - Quita Fraunces si ya no se usa. Mantén LCP ≤2,0 s y a11y 100.
Después: build, unitarios, e2e en los 3 navegadores y Lighthouse móvil. Capturas en docs/capturas-t35/. Commit local y scripts/preview-restart.sh. Resume: números, hash y capturas.
