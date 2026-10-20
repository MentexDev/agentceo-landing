# Luca aquí (Diego aprobó) — T33 sobre ad44e21 (local). NO push, NO deploy, nada contra D1 remota, nunca imprimir secretos. Mismos puertos prohibidos.

1. Divisor: Diego sigue sin querer la línea horizontal (en su captura de lo que está en vivo se ve negra, gruesa y a todo el ancho) entre el hero y S03 «Así se ve tu empresa por dentro». Quítala o deja un separador muy sutil y contenido. Revisa a ojo en localhost:8787 (captura en escritorio y en móvil) que no quede ninguna raya dura negra a todo el ancho entre el hero y S03. Aplica el mismo criterio a los demás divisores de secciones.
2. Títulos claramente más gruesos: el trazo falso se queda corto. Cambia la serif display por una fuente con pesos reales que mantenga el look (Fraunces, Playfair Display o Newsreader en variable; elige la que más se parezca a Instrument Serif). Autoalojada, con subset latino, font-display swap y preload solo de lo necesario para el LCP. Titulares a 500–600 con itálica incluida. Retira el trazo falso. Mantén LCP móvil ≤2,0 s y a11y 100, e informa del trade-off (KB añadidos, LCP antes y después).
3. Proveedor del widget: vuelve a OpenRouter con el secreto OPENROUTER_API_KEY y quita el camino directo a Gemini.
   - Precios VERIFICADOS por Luca hoy en https://openrouter.ai/api/v1/models, en USD por millón de tokens:
     - `google/gemini-2.5-flash-lite`: 0,10 de entrada / 0,40 de salida / 0,01 de lectura de caché. Es el Flash Lite más barato en tiempo real.
     - `google/gemini-3.1-flash-lite`: 0,25 / 1,50 / 0,025.
     - `google/gemini-3.5-flash-lite`: 0,30 / 2,50.
     - Las variantes :batch no sirven para chat.
   - Modelo por defecto CHAT_MODEL=google/gemini-2.5-flash-lite, configurable por var. Las constantes de coste deben ir por modelo, con estos precios.
   - Mantén el tope de $5/día, todas las capas anti-abuso, Turnstile y la caída al stub.
   - Pon CHAT_MODE=live por defecto en wrangler.jsonc: sin clave → stub (con test), y con solo añadir el secreto queda encendido.
   - Actualiza los evals y docs/DUDAS.md.
4. Arregla que el lanzador del widget (y la burbuja «¿Tienes una pregunta?») tape la esquina de la tarjeta del acta en escritorio.

Después: build, unitarios, e2e en los 3 navegadores y Lighthouse de la portada en móvil (es y en). Capturas en docs/capturas-t33/ (divisor, títulos y acta con el widget, en escritorio y móvil). Commit local y scripts/preview-restart.sh. Resume: cambios, fuente elegida con su trade-off, números y hash.

5. (Diego, prioridad ALTA) Bug: con el widget EXPANDIDO, el header sticky del sitio queda encima de la cabecera del panel y tapa los botones de cerrar/contraer: no hay forma de cerrarlo.
   - El panel expandido debe quedar por encima del header (revisa z-index y stacking context) o desplazarse por debajo de él (top: altura del header + safe-area).
   - El botón de cerrar debe verse y poder pulsarse siempre, en escritorio y en móvil.
   - Esc lo cierra.
   - En móvil a pantalla completa, el panel cubre el header.
   - Test e2e en los 3 navegadores: expandir, cerrar con el botón; expandir, cerrar con Esc.
