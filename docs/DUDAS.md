# DUDAS · Landing v2

Decisiones tomadas con criterio propio cuando algo bloqueaba, más lo que queda abierto para Diego.
Formato: **fecha · fase · duda → decisión tomada (y por qué)**. Lo que sigue abierto lleva ⏳.

## Instrucciones recibidas (registro literal de lo que llegó)

- **2026-10-20 · instrucciones de construcción.** Llegaron pegadas, sin una línea propia de Diego, y se pidió confirmación. La respuesta, que llegó **cortada al principio**, fue: «…mar APIs. Nunca uses datos reales de clientes. Si aun así necesitas que Diego lo confirme en persona, dilo y espera.»
  → Se interpreta en el sentido más estricto: **no se llama a ninguna API de terceros** (LLM, Resend, analítica, OpenRouter). Instalar paquetes de npm sí, porque el plan aprobado con Astro lo exige. No se usan datos de clientes reales: solo correos `@example.com` en los tests y la D1 local.
- **2026-10-20 · reembolsos.** Llegó **cortado al principio**: «…se usaron; los créditos perdidos por fallos de la plataforma se devuelven como créditos si se reportan en 30 días; los errores de facturación se reembolsan completos; sin valor en efectivo; salvo lo que exija la ley.»
  → Lo recibido se redacta tal cual en `/legal/reembolsos`. ⏳ **El arranque de la política se perdió**: la primera cláusula, que acaba en «…se usaron», queda como `[PENDIENTE: primera cláusula, llegó cortada]`.
- **2026-10-20 · DMCA:** no hay agente registrado → la página queda con `[PENDIENTE registro dmca.copyright.gov]`.
- **2026-10-20 · correo (aclaración de Diego, que corrige el mensaje anterior):** todas las direcciones legales y de contacto **se quedan en `@klinworks.com`**. El commit `ed5c227` es intencional. **Solo el remitente** de los correos transaccionales es Resend desde agentceo.io.
  → Contacto, soporte y prensa del sitio: `info@klinworks.com`, que es el buzón de soporte que ya figura en `terminos.md`. Los legales siguen como estaban: `privacidad@`, `legal@` y `security@klinworks.com`. Las referencias a `ceo@agentceo.io` que quedan en la home y en las noticias se migran a `info@klinworks.com`.
  ⏳ ¿Prensa tiene un buzón propio, por ejemplo `prensa@klinworks.com`? Mientras no se confirme, se usa `info@klinworks.com`.

## Decisiones de criterio

_(se van añadiendo por fase)_

### Fase 1
- **Titular de la portada** (pregunta 2 del PLAN, sin respuesta): se usa el del prototipo, «Empleados de IA que venden por ti». Diego pidió conservar el prototipo, y la v1 no lo usaba. ⏳ Diego puede cambiarlo en `src/i18n/ui/*.js` (`site.title`).
- **Herramientas actuales (medidas):** Astro 7.4.1, React 19.3 (el prototipo usaba 18.3; React 19 es compatible con sus componentes de clase) y vitest 4.1. `@cloudflare/vitest-pool-workers` **está deprecado** y se sustituye por `@cloudflare/vitest-plugin` 1.4.5.
- **Telemetría desactivada** (`ASTRO_TELEMETRY_DISABLED`, `WRANGLER_SEND_METRICS=false`) para cumplir «no llamar APIs de terceros».
- **Fuentes:** se autoalojan en `public/fonts` (Geist, Geist Mono e Instrument Serif con subset latino, 112 KB en total, licencia OFL incluida). Se descartan Inter y Playfair.
- **El HTML de la v1 pasa a `design/legacy/`** (home, legales generadas, generadores). Queda como referencia, sin compilarse.
- **Migraciones:** `schema.sql` pasa a `migrations/0001_init.sql`, con `IF NOT EXISTS`, así que reaplicarla en producción es inocuo. ⛔ La aplica Diego.
- **Bug real encontrado con WebKit:** `upgrade-insecure-requests` y la cookie `Secure` rompían Safari en http local. Ahora solo se emiten bajo https. Hay un test que lo vigila.
- ⏳ La skill `crear-recurso-agentceo` todavía apunta a `build-content.mjs`. Se actualiza en la Fase 4, cuando se porten los recursos.

### Fase 2
- **El paso 2 (tipo de negocio) es opcional** y lleva el botón «Saltar este paso», que el prototipo no tenía. El correo ya está guardado en el paso 1, así que el paso 2 nunca puede costar un lead.
- **Tras apuntarse desde el hero, el modal se abre en el paso 2**, igual que en el prototipo (`trySend` → `join:'biz'`).
- **Atribución en `sessionStorage`, no en cookies ni en `localStorage`.** Dura lo que la pestaña y solo sale del navegador si la persona envía el formulario, así que no es seguimiento y no necesita consentimiento previo. El referrer se guarda solo como origen (sin ruta ni query).
- **Rate limit:** 8 envíos por minuto por IP y ruta, con el binding nativo de Workers. Se midió en `wrangler dev`: 8 × 200 y la 9.ª devuelve 429. La ventana diaria no es posible con este binding (solo admite 10 o 60 s).
- **Trampa de tiempo:** un envío hecho en menos de 1,2 s desde que se pintó la página se trata como bot. Recibe un OK silencioso y no se guarda.
- **Respaldo de esquema probado en vivo:** la D1 local de `wrangler dev` todavía no tenía la 0002 y el Worker guardó igualmente con el esquema v1. ⏳ Al desplegar, Diego aplica la 0002 en remoto (aditiva, solo columnas NULL).
- **El aviso CCPA del formulario** describe exactamente lo que se guarda: correo, idioma, campaña de origen y navegador (user-agent). Lleva `notice_version` = `2026-10-20` en cada fila, para poder demostrar qué aviso vio cada persona.
- ⏳ **Baja (CAN-SPAM):** el aviso promete «darte de baja desde cualquier correo». Los correos los enviará Resend desde agentceo.io, y el enlace de baja se construye con el envío, que queda fuera de esta rama.

### Fase W · widget
- **Modo:** `CHAT_MODE=stub` en `wrangler.jsonc`, sin LLM y sin keys, como decidió Diego. El modo live está escrito y probado **solo contra un `fetch` falso**: nunca se llamó a OpenRouter. Para activarlo harían falta `CHAT_MODE=live` y `wrangler secret put OPENROUTER_API_KEY`. El tope duro es de $5/día, en el Durable Object `ChatGuard`. Al superarlo, vuelve solo a stub.
- **Precisión del stub, MEDIDA (no estimada):**
  - Conjunto de afinado: 64/64. Está sobreajustado, así que no vale como estimación.
  - Reservado #1: 66,7 % (16/24) al medirlo. Después quedó contaminado, porque sus fallos inspiraron arreglos por categoría.
  - **Reservado #2, limpio: 44,0 % (11/25).** Es la cifra honesta para preguntas con palabras nuevas. El PLAN estimaba 60–80 %: **era optimista y queda corregido.**
  - Los clics en las preguntas sugeridas aciertan al 100 % (hay un test que recorre todo el FAQ).
- **Cómo se compensa sin LLM:** (1) cada respuesta muestra «Respuesta a: «…»», para que un emparejamiento dudoso se vea como tal; (2) la interfaz guía con preguntas sugeridas y chips; (3) lo que no está en la web se admite y lleva a la lista o a `info@klinworks.com`. **En ningún caso el stub genera texto:** solo cita la web.
- ⏳ **Recomendación para Diego:** con un 44 % en preguntas abiertas, el modo live (≈ $7 por cada 1.000 conversaciones con `gemini-3.1-flash-lite`, según el PLAN §6.3) es lo que convierte el widget en un agente útil. El stub sirve para guiar.
- **SB 1001 / Ley de IA de la UE art. 50:** la IA se declara en cuatro sitios: insignia «IA» en el lanzador, título y subtítulo del panel, primer mensaje y pie («Soy una IA y puedo equivocarme»). Además, toda pregunta del tipo «¿eres humano?» recibe la declaración explícita. Hay tests en es y en en.
- **Privacidad:** el contenido de los chats no se guarda en el servidor. El tope diario por IP usa un hash SHA-256 como nombre de instancia, sin la IP en claro (hay un test que lo comprueba). En el navegador, la conversación vive 7 días en `localStorage`, sin correos.
- **Bug real encontrado con WebKit:** recargar a mitad de una respuesta borraba la pregunta del historial. Ahora la pregunta se conserva y aparece «Reintentar». Hay un test que lo vigila.
- **Contacto que da el widget:** `info@klinworks.com` (aclaración de Diego: los contactos se quedan en @klinworks.com).

### Fase 3 · portada
- **Método: un compilador, no una reescritura a mano** (`scripts/port/compile-sections.mjs` + `compile-css.mjs`). Hace cinco cosas:
  - fusiona los árboles de escritorio y móvil en uno solo;
  - saca 4.017 estilos inline a 641 clases;
  - escala el escritorio con `--u` en lugar del `zoom` por JS;
  - corrige el contraste según el fondo;
  - extrae 722 textos a `src/i18n/sections/*.json`.

  La salida se versiona y no se edita a mano. **Para cambiar un texto se edita el JSON; para cambiar el diseño, el prototipo, y se recompila.**
- **Fidelidad medida con pixelmatch frente al prototipo**, con las mismas fuentes, 1440 y 390 px y motion reducido:
  - escritorio: 0,8–5,7 % de diferencia y alturas casi al píxel;
  - móvil: 2,9–11 %.
  - Lo que difiere a propósito: la FAQ (15 preguntas en vez de 12), los formularios con el aviso CCPA y los colores corregidos por contraste.
- **Islas con Preact + compat** en lugar de React 19: unos 10 KB frente a 68 KB gz, medido. **Estáticas, sin JS:** S02 (hero), S06, S07, S14–S17 y S19. El toque a la mascota del hero lo hace `vida.js` en vanilla, así que el LCP no paga ninguna hidratación.
- **S01, S20 y S21 se sustituyen** por Header, Footer y WaitlistModal del sitio. **S18 se reescribe a mano**, alimentada por `content/faq.js`: todas las respuestas están en el HTML, con `aria-expanded` y FAQPage.
- **Bugs reales encontrados y corregidos durante el porte:**
  - el reset fuera de capa pisaba las clases del prototipo (chip «Todas» negro sobre negro) → capas `reset < proto < sections`;
  - `box-sizing: border-box` global cambiaba los tamaños del prototipo → `content-box` dentro de las secciones, con especificidad 0;
  - la clase `.btn` mía chocaba con la del prototipo → renombrada a `.ac-btn`;
  - el hero de móvil está reordenado y la LCS duplicaba el `<h1>` → detección de permutaciones, que reordena con `order`;
  - en la FAQ móvil, `align-items: start` hacía que la tira midiera 1.951 px;
  - las tarjetas de los carruseles nunca aparecían porque el contenedor recorta la intersección.
- **Accesibilidad añadida:** axe WCAG 2.2 AA **0 violaciones** en /, /en/, /gracias/ y /404 (escritorio y móvil). Se resolvieron: texto claro sobre dorado → tinta; carruseles enfocables con teclado; controles dentro de `aria-hidden` fuera del orden de tabulación (sin `inert`, que rompía el toque); nombre accesible del selector de idioma y del lanzador del chat.
- ⏳ **S03 «Así se ve por dentro»:** el README del prototipo dice que está pendiente de rediseño. Se porta tal cual. Sus URLs simuladas (`app.agentceo.io/admin/agentes`…) se quedan en español también en `/en/`, porque son las rutas reales de la app.
- **Carruseles automáticos:** se pausan con puntero, foco y toque, y no corren con motion reducido. ⏳ WCAG 2.2.2 pide además un control de pausa visible para lo que se mueve más de 5 s; queda para la auditoría (Fase 7).
- **Inglés de la portada:** 722 textos traducidos por 3 agentes en paralelo con un glosario común. Lo validé yo: las mismas claves, los espacios de los bordes y que quedan sin traducir solo marcas, URLs y nombres propios (59). Hay un test de paridad.

### Fase 4 · páginas internas
- **Precios = los de la app (Diego los pasará).** El plan gratis se mantiene, porque lo confirman la v1 y el prototipo. El plan de pago muestra la marca visible `PENDIENTE · precios de la app` (`content/precios.js` → `pendiente: 'precios'`, `PRICES_PENDING = true`).
  - La **tabla comparativa no se pinta**, porque describe un plan de pago que puede no coincidir con la app.
  - El widget no cita «A tu medida» como precio.
  - ⏳ Para activar los precios reales: rellenar `PLANS`, quitar `pendiente` y poner `PRICES_PENDING = false`.
- **Empresa:** solo datos verificables (razón social, LLC de Delaware, expediente 10704723 y oficina registrada, todo sacado de `privacidad.md`). Sin equipo, historia ni redes sociales: no hay fuente para ellos.
- **Contacto:** un buzón por tema, todos `@klinworks.com` (hay un test que lo exige). Sin formulario, porque no hay envío de correo en esta rama. ⏳ Prensa usa `info@` hasta que se confirme un buzón propio.
- **Prensa:**
  - mascota en SVG, en versión oscura y clara;
  - colores con sus tokens, tipografías con su licencia OFL, reglas de uso y descripción para copiar.
  - Los PNG `logo-agent`/`logo-ceo` son la marca de la v1, así que no entran en el kit.
- **Recursos:** el gate client-side de la v1 se conserva. Sigue siendo deuda consciente: el contenido viaja en el HTML.
- **Bugs reales encontrados:** `display: grid` anulaba `hidden` (el gate no desaparecía tras dejar el correo; los filtros se veían sin JS) → corregido, con un test e2e que lo vigila.
- **Test intermitente investigado:** el rate limit nativo cuenta por ventanas de 60 s y el test fallaba si caía en el cambio de minuto → los tests esperan ahora a una ventana limpia.
- **Skill `crear-recurso-agentceo` actualizada** al flujo de la v2 (Astro, `dist/`, `scripts/preview-restart.sh`). Se recupera `npm run deploy` (build + `wrangler deploy`) **solo para Diego**: ninguna rama de agente lo ejecuta.

### Precios reales (mensaje de Luca/Diego, 2026-10-20) · commit aparte
- **Aplicado tal cual:**
  - Arranque $0 (300 créditos/semana, 1 usuario, sin tarjeta) · Impulso $29/mes, destacado (2.300/semana, 5 personas) · Motor $99/mes (40.000/semana, 20 personas) · Imperio $249/mes (200.000/semana, personas sin límite).
  - Todos los planes: agentes sin límite y créditos que se renuevan cada lunes.
  - Paquetes: Chispa 1.000/$5 · Envión 3.000/$12, destacado · Turbina 8.000/$29 · Reserva 20.000/$65, no caduca.
  - Historial de 30 días.
- **Interpretaciones (⏳ para confirmar):**
  - «Historial 30 días» se aplica a **todos los planes**.
  - **Solo Reserva** dice «no caduca». De los demás paquetes no se dice nada, y no se inventa.
  - Moneda **USD** («$», sociedad de EE. UU.). La página lo declara.
- **Retirado por obsoleto:**
  - la marca PENDIENTE;
  - la tabla comparativa de la v1 («Para empezar / Para tu equipo»), sustituida por otra generada de los datos reales;
  - las FAQ de precios de la v1 que ya no aplican («¿Cuándo van a tener precios?», «¿Puedo cancelar cuando quiera?»);
  - las descripciones de marketing que yo había escrito para los planes de pago, porque insinuaban funciones que no están en los datos.
- **FAQ nuevas de precios, todas con fuente:**
  - créditos agotados → se detienen y no hay cobro automático por exceso (`seguridad.md` §7.3);
  - renovación cada lunes;
  - sin límite de agentes.
- **Efecto medido en el widget:** el reservado #2 en español pasa de 6/15 a 5/15 por el **cambio de contenido**: la nueva FAQ «¿Hay límite de agentes?» capta «¿precio del plan para equipos?». El suelo se baja a lo medido, documentado y sin afinar el motor.
- **El mensaje «Datos reales» no llegó entero.** De él solo constan aquí los precios y los fragmentos de reembolsos y DMCA de más arriba. ⏳ Si traía más datos de reembolsos, falta la primera cláusula.

### Fase 5 · SEO + GEO
- **Generado desde las mismas fuentes que las páginas** (`rutas.js` + `content/` + diccionarios):
  - `sitemap.xml`: 24 URL, hreflang recíproco con x-default, sin páginas `noindex`;
  - `robots.txt`: bots de búsqueda e IA permitidos explícitamente, `/api/` fuera;
  - `/llms.txt` y `/llms-full.txt` en es/en, con entidad, FAQ, portada, precios reales y contenido;
  - **una OG de 1200×630 por página**, hecha con resvg y las fuentes del propio sitio.
- **Lista de user-agents de IA** (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Googlebot, Bingbot, Applebot, Applebot-Extended, CCBot): sale de lo que sé a junio de 2026. **No la verifiqué en la web**, por la regla de no llamar a APIs/terceros. ⏳ Conviene revisarla antes de desplegar. Como `User-agent: *` ya permite todo, un nombre mal escrito no bloquearía a nadie.
- **Bug real:** resvg-js 2.6 **ignora `fontBuffers`** (medido: imagen idéntica con cualquier familia) → se usa `fontFiles` con TTF descomprimidos en caché.
- **Lighthouse local** (Lighthouse 13, Chrome de Playwright, sin PageSpeed ni servicios externos, `wrangler dev` con brotli como producción):
  - **98–100 en las 4 categorías**; Accesibilidad, Buenas prácticas y SEO a 100 en todas las páginas medidas;
  - TBT 0 ms, CLS 0–0,013.
- **LCP:**
  - escritorio 0,4–0,6 s;
  - móvil (4G lento simulado + CPU ×4) 1,7–1,8 s en las páginas internas.
  - ✅ **Resuelto el 2026-10-20 (arreglo de Luca): la portada en móvil baja a 1,66–1,81 s (es y en), con CLS 0.** Ver PROGRESO, «LCP y pausa». Antes se quedaba en 2,0–2,1 s. Probado y medido entonces:
    - la entrada del hero esperaba al JS → animación CSS: el retraso del elemento LCP baja de 1,56 s a 0,09 s;
    - CSS crítico separado (hero bloqueante, el resto sin bloquear);
    - CSS en línea → **empeora** (2,3 s, HTML de 75 KB gz), revertido;
    - quitar la precarga de la serif → sin efecto, revertido.
  - Lo que queda es el peso del HTML (45 KB gz, el **42 % son SVG en línea** de las mascotas, con ojos animados por instancia). La siguiente palanca: renderizar bajo demanda los SVG de las secciones que quedan por debajo del pliegue. Queda para la auditoría.
  - **Lo que lo resolvió** (cada paso medido con Lighthouse 13 local móvil):
    - titular y entradilla del hero suben sin fundido desde opacidad 0 (el fundido impedía contarlos como LCP);
    - CSS no crítico en un fichero con hash pedido 300 ms tras `load`;
    - los `<script>` de los componentes, unidos en un solo módulo (`src/scripts/site.js`);
    - islas que importan sus textos en vez de serializarlos en el HTML;
    - fuentes de respaldo con las métricas reales (`scripts/font-fallbacks.mjs`): al quitar el fundido, el cambio de fuente movía el hero (CLS 0,18), y ahora da 0.
  - ⏳ **Pregunta para Diego:** el carrusel de S16 vive dentro de una maqueta decorativa (`aria-hidden`), y sus flechas y su pausa solo se usan con puntero o toque (`tabIndex=-1`, igual que en el prototipo). ¿Lo dejamos así, o S16 no debería avanzar solo?
- **CLS de /noticias/ (0,062 → 0):** los filtros los revelaba el JS después de pintar → ahora son radios con `:has()`. Funcionan sin JS, no causan salto y son navegables con flechas.
- **Caché:** los assets con hash (`/_a/`, `/_s/`) salían con `max-age=0` → ahora un año, `immutable`. Fuentes 30 días; OG y marca 1 día.
- **Assets retirados de la web** (siguen en `design/legacy/assets`): el vídeo del hero de la v1 (6,6 MB), `favicon.png` (464 KB) y los logos PNG de la v1. ⏳ Pregunta 9 del PLAN: el vídeo no vuelve salvo que Diego lo pida.
- **Meta descripción:** se recorta a unos 160 caracteres sin partir palabras (una noticia tenía 212).

### Fase L · legal
- **14 documentos en BORRADOR**, con banda visible y `[PENDIENTE]` literales resaltados. El estado completo está en `docs/LEGAL-CHECKLIST.md`.
  - 5 actualizados: Términos 2.1, Privacidad 2.1, Cookies 2.1, GDPR 2.1 y Seguridad.
  - 9 nuevos, en v1.0: California, Estados, Uso aceptable, IA, Subprocesadores, DPA, Reembolsos, Accesibilidad y DMCA.
- **Redacción:** 2 agentes en paralelo con un paquete de hechos cerrado. Revisé yo los de más riesgo:
  - quité una frase sin fuente en Reembolsos («no se transfieren a otras cuentas»);
  - cambié «resumen cifrado (hash)» por «no reversible», porque un hash no es cifrado.
- **Una sola fuente de datos:** `content/subprocesadores.js`, que usan Privacidad, GDPR, Subprocesadores y DPA, y `src/data/storage.js`, que usa Cookies. Los tests exigen que coincidan y que cada clave que guarda el código esté documentada.
- **Analítica: ninguna (Diego).**
  - PostHog y Plausible figuran como «No activo».
  - El panel de cookies **no se muestra solo**, porque no hay nada no esencial que aceptar. Se abre desde el pie.
  - Desactivar lo funcional **borra** lo guardado y deja de guardar (probado en e2e).
  - GPC fuerza «no vender ni compartir» y bloquea cualquier analítica futura.
- **Edad mínima:** se mantiene la de **18** de la v1 (más estricta), con COPPA (< 13) mencionada expresamente.
- **Reembolsos:** la primera cláusula se reconstruyó con Términos §3.5 («los créditos consumidos no son reembolsables») y el fragmento que llegó («…se usaron»). ⏳ Diego debe confirmarla.
- **Bug real encontrado:** en móvil, la barra fija de la lista tapaba los enlaces del pie (entre ellos «Preferencias de cookies») → ahora se esconde con el pie a la vista. Hay un test que la vigila: se mutó y se puso rojo.
- **Widget:** la base incluye los legales, con peso 0,7 frente a la FAQ. Ahora responde reembolsos, accesibilidad y DMCA citando la página. Por el cambio de corpus, el reservado #1 en español baja de 14 a 13 («¿qué hago si se traba una tarea?» va al blog). Es un intercambio aceptado y documentado, sin afinar el motor mirando el reservado.
- ⏳ **Pendiente de confirmación de quien escribe:** el encargo de la «fase S03» (leer en SOLO LECTURA `CRM-AI-evolution/apps/web` y recrear sus pantallas como islas) llegó pegado y sin una línea propia del usuario. No se empieza hasta que se confirme.

### fix(legal) · «Datos reales» completos (Luca, auditoría de la fase L)
- **Reembolsos 1.1:**
  - los créditos semanales **expiran el lunes** y no se reembolsan;
  - **7 días** de reembolso en la primera suscripción si se usó **menos del 10 %** de los créditos;
  - **Chispa, Envión y Turbina reembolsables en 14 días si no se usaron**. Esto explica el fragmento cortado («…se usaron»), así que la primera cláusula queda **resuelta**;
  - aviso explícito de **renovación automática** mensual;
  - tablas de créditos por plan y por paquete.
  - ⏳ Pendiente: caducidad de los paquetes; si Reserva entra en la regla de 14 días (el mensaje solo nombra los otros tres); que el pago de la app muestre la renovación y envíe la confirmación (leyes de renovación automática); plazos.
- **Subprocesadores:** **PostHog, Sentry y Plausible retirados** (12 proveedores). Desaparece la columna «Estado». Privacidad y GDPR pasan a 2.2 y Subprocesadores a 1.1.
- **Evidencia sobre Sentry** (búsqueda en SOLO LECTURA de `CRM-AI-evolution`): solo aparece como **conector** que el cliente puede enlazar con su propia cuenta (`apps/web/src/lib/conectores/categorias.js`, `apps/api/src/integrations/connectors/*`) y como palabra del vocabulario de dictado. **No hay** `@sentry/*`, ni `Sentry.init`, ni `SENTRY_DSN`. Retirado como pidió Diego.
- **«En es y en»:** los legales en inglés todavía no existen (se escriben en la Fase 6). Nacerán ya con estos datos.

### Fase S03 · recreación de la app real («Así se ve por dentro»)
- **Fuente, leída en SOLO LECTURA:** `CRM-AI-evolution/apps/web`. Se tomaron de ahí:
  - los tokens de `tailwind.config.js`, `lib/paleta.js` e `index.css`;
  - los textos literales del sidebar (`AdminLayout`, `ElInterruptorDelLado`), del chat (`AgenteHablando`, `PensandoIndicador`, `PasosDelTurno`, `ChatComposer`), de Biblioteca, Aprobaciones (`FilaDeAprobacion`), del Panel de Comando (`TarjetaDeComando`), de Ventas (`PedidosDeVentas`), de Clientes (`ClientesDirectorio`) y de `MarcaEnLasMigas`.
  - No se ejecutó la app, no se instaló nada allí y no se llamó a ninguna API.
- **Datos:** todos inventados, para la marca de ejemplo **«Lúa / Casa Lúa»** (ropa cómoda para mujer en Colombia, coherente con S08 y S14). Clientas con nombre + inicial y correos `@example.com`. **Los fixtures con conversaciones reales de la app no se leyeron.** Hay un test que exige `@example.com` y la etiqueta «datos inventados».
- **Fidelidad frente a peso:** la app usa Inter, Playfair Display y JetBrains Mono. Aquí se usan Geist, Instrument Serif y Geist Mono, que ya están cargadas: **cero fuentes extra**. Los iconos son los mismos (lucide, en su versión para Preact).
- **Inglés:** la app no tiene i18n. Los textos en inglés de la demo son traducción nuestra.
- **Accesibilidad:**
  - pestañas con patrón tablist (flechas, Inicio, Fin);
  - **botón de pausa visible** (cumple WCAG 2.2.2 para esta animación);
  - el recorrido se detiene al interactuar y no corre fuera de pantalla ni con motion reducido (estados finales al instante);
  - axe da 0 violaciones en 390, 900 y 1440 px.
- **Bug encontrado en mi test:** el test de pausa **no probaba nada**. Pulsaba sobre el HTML del servidor antes de la hidratación y la mutación sobrevivía. Ahora espera la hidratación real (la isla pierde `ssr`) y verifica primero que el recorrido avanza. Mutado: rojo.
- La S03 compilada del prototipo (el recorrido de 6 pantallas «pendiente de rediseño») sale del compilador: así no hay CSS muerto.

### Fase 6 · inglés
- **Traducido:** 8 noticias, 4 posts, 3 recursos, precios (con los nombres de planes y paquetes sin traducir) y los **14 legales**, que nacen ya con el fix de reembolsos y subprocesadores.
  - Lo hicieron 4 agentes en paralelo, cada uno con su validación por script: mismo número de bloques y secciones, mismas cifras, marcadores `{{…}}` y `[PENDIENTE]` intactos, enlaces a las rutas en inglés.
  - Cada pieza en inglés lleva `es: '<slug>'` para el hreflang recíproco.
- **Rutas nuevas:** `/en/news/`, `/en/blog/`, `/en/resources/`, `/en/pricing/`, `/en/company/`, `/en/contact/`, `/en/press/`, `/en/do-not-sell-or-share/` y `/en/legal/*`. En total, el sitio tiene **80 páginas**.
- **Legal:** los Términos en inglés mantienen que **la versión vinculante es la española** (§13.7) y que el soporte es en español (§8.4), como el original. ⏳ El abogado debe decidir si se mantiene para clientes de EE. UU.
- **Widget en inglés:** su base pasa de 16 a 50 fragmentos. **Medido:** un motor léxico **empeora al crecer el corpus**. El reservado #1 en inglés baja de 9/9 a 7/9 («company» aparece en todos los legales; «monthly fee» cae en «Is it really free?»). Las expectativas se igualaron con las del español solo donde la respuesta es literalmente correcta. Los suelos se fijan en lo medido. Es un argumento más para el modo live del PLAN §6.3.
- ⏳ **Pendiente de la auditoría:** los carruseles automáticos del prototipo (S05 en móvil y S11) se pausan al pasar el ratón, enfocar o tocar, pero **no tienen botón de pausa visible** (WCAG 2.2.2). La demo de S03 sí lo tiene.

### T32 · Widget en modo live con Gemini (2026-10-20) · ⚠️ SUSTITUIDO por «T33 · chat» (OpenRouter)
- **Proveedor:** Gemini directo (`generativelanguage.googleapis.com`, `streamGenerateContent?alt=sse`), modelo `CHAT_MODEL=gemini-3.1-flash-lite`. **OpenRouter se retira**: un solo proveedor, un solo precio que vigilar. Esto deja obsoleto lo que dice arriba, en la Fase W, sobre `OPENROUTER_API_KEY`.
- **Clave:** el secreto `GEMINI_API_KEY`. **Hoy no existe** (no hay secreto ni `.dev.vars`); no se creó ni se pidió. Sin clave → stub, sin llamar a nadie (hay test).
- ⏳ **Pregunta para Diego:** `wrangler.jsonc` sigue con `CHAT_MODE=stub`, su decisión de la Fase W. Para encender live hacen falta dos cosas: `wrangler secret put GEMINI_API_KEY` **y** cambiar `CHAT_MODE` a `live`. ¿Se deja `live` ya puesto, para que baste con la clave (sin clave sigue respondiendo el stub), o se mantiene el doble interruptor?
- ⏳ **[PENDIENTE verificar]** antes de encender live (aquí no se consulta la web):
  - el identificador exacto del modelo en la API de Google (si no existe, la API devuelve 404 y el widget cae a stub sin que se note);
  - los precios: 0,25 / 1,50 / 0,025 USD por millón (entrada / salida / caché), medidos en OpenRouter el 20-oct, frente a la tabla oficial de Google.
- **Tope duro de $5/día:** reserva atómica del coste máximo en el Durable Object `ChatGuard` antes de llamar, y ajuste al coste real después. Detalle y por qué un DO (y no D1 o KV) en `worker/chat/guard.js`. Por IP: 60 mensajes/día, de los que 25 pueden ir al modelo (el resto, stub). Por conversación: 12 turnos (contados por el cliente). 500 caracteres por mensaje y 400 tokens de salida.
- **Evals:** `npm run evals:chat` → `docs/EVALS-CHAT-T32.md`. Stub 35/36. El fallo que queda es «Is there a plan for a big team?», que cae en «no lo encuentro»: no inventa, pero no acierta. Live: **no ejecutado, sin clave**.

### T32 · Adenda: anti-abuso, tono y canal (2026-10-20)
- **Objetivo (Diego):** nadie, usuario o competidor, puede quemar tokens. Capas, de la más barata a la que gasta. Cada una tiene su test en `tests/worker/chat-abuse.test.js` o `chat.test.js`, y cada guardián nuevo se mutó a mano hasta verlo en rojo.

  | Capa | Límite | Dónde vive | Si se pasa |
  |---|---|---|---|
  | Ráfaga por IP | 10/min | binding nativo `RL_CHAT` (antes de parsear) | 429 |
  | Hora y día por IP | 30/h · 60/día | `ChatGuard.hitAll` (atómico, todo o nada) | 429 |
  | Minuto, hora y día por sesión | 6/min · 20/h · 40/día | `ChatGuard.hitAll` (instancia por hash de la sesión) | 429 |
  | Mensaje | 500 caracteres | canal web | 400 |
  | Conversación | 12 turnos | `respond.js` | cierre amable con la lista |
  | Salida | 400 tokens, **techo duro** (`CHAT_MAX_TOKENS` solo puede bajarlo) | `respond.js` | — |
  | Gasto global | $5/día, reserva atómica antes de llamar | `ChatGuard` «budget» | stub |
  | Live por IP | 25/día | `ChatGuard` por IP | stub |
  | Bot / UA | UA vacío, curl/python/headless…, sin Accept-Language | `abuse.js` → `respond.js` | stub, **nunca live** |
  | Pregunta repetida | misma sesión, 10 min | `ChatGuard.seen` | caché o stub, no gasta |
  | Preguntas idénticas | 6 h, solo primer turno y sin datos personales | `ChatGuard.tget/tput` (instancia «cache») | respuesta cacheada, no gasta |
  | Turnstile | persona verificada antes de gastar (30 min por sesión) | `channels/index.js` + `abuse.js` | stub + reto al cliente |
  | Logs | solo contadores (`{t, ev, channel, path, reason, limit, mode, lang}`) | `abuse.js` `counter()` | — |

- **Sesión:** id aleatorio del cliente, guardado dentro de `ac_chat` (misma clave y mismo consentimiento funcional; sin consentimiento, solo en memoria). **No es fiable por sí solo**: cualquiera puede inventarse sesiones nuevas, así que **el límite por IP manda**. La sesión sirve para que una pestaña no se coma el cupo de toda una oficina detrás de la misma IP, para el dedupe y para recordar que la conversación ya pasó Turnstile.
- **Turnstile (código listo, apagado):** ~~sin `TURNSTILE_SITE_KEY` (var pública) **y** `TURNSTILE_SECRET_KEY` (secreto), live no arranca~~ (T33: ahora sí arranca, con cupo por IP estricto; ver abajo). El cliente no carga nada de terceros y la CSP no abre `challenges.cloudflare.com`. Con las dos:
  - el primer mensaje que iría al modelo responde con el stub y un reto (`meta.challenge`);
  - el cliente carga Turnstile **en ese momento**, en modo invisible, y manda el token en el mensaje siguiente;
  - el servidor lo verifica con `siteverify` y marca la sesión como verificada durante 30 min.

  Cómo crearlo: comentario en `wrangler.jsonc`. Es gratis; no se creó nada.
- ⏳ **Para Diego:** el tráfico sospechoso nunca va a live, pero sí recibe el stub (es gratis): no se le bloquea, para no castigar a una persona con un navegador raro. ¿Bloquear del todo? No lo recomiendo.
- ⏳ **Caché:** guarda respuestas del modelo **a preguntas sobre la web pública** durante 6 h, sin texto de la pregunta (solo su hash) y nunca si la pregunta o la respuesta llevan un correo, un teléfono o una URL. Si un día cambian los precios, la caché puede servir la respuesta vieja hasta 6 h: al cambiar precios, **purgar** (cambiar la clave de la instancia «cache» o esperar 6 h).
- **Tono:**
  - persona, saludo, errores y regla 8 del prompt reescritos: fundador amable, de tú, corto, nada corporativo;
  - evals de tono: lista de muletillas prohibidas en TODAS las respuestas, ≤ 45 palabras en los textos propios y ≤ 90 en las respuestas del modelo;
  - se mantienen literalmente «inteligencia artificial» / «no una persona» (SB 1001).
- **Canal:** `worker/chat/channels/index.js` define el contrato (`who`, `parse` → mensaje normalizado, `open` → `send`/`close`, `reject`) y el núcleo común (límites, decisión y contadores). `respond.js` ya no sabe de HTTP ni de SSE. Web: `channels/web.js`. **WhatsApp no se construye**: un test enchufa un canal falso, sin streaming, sin tocar `respond.js`.

### T33 · chat: vuelve OpenRouter, live por defecto y auditoría de topes (2026-10-20)
- **Proveedor:** OpenRouter (`https://openrouter.ai/api/v1/chat/completions`, streaming SSE compatible con OpenAI). Cabecera `Authorization: Bearer` con el secreto `OPENROUTER_API_KEY`, más `HTTP-Referer: https://agentceo.io` y `X-Title: Agent CEO`. Pide `usage: { include: true }` para conocer el consumo real. **Se retira el camino directo a Gemini**: `GEMINI_API_KEY` ya no existe en el código. Lo de «T32 · live con Gemini» queda sustituido.
- **Clave (Luca, 20-oct):** `OPENROUTER_API_KEY` **ya existe en producción**. En local **no hay clave**: no se crea `.dev.vars` ni se pide. Sin clave → stub, sin llamar a nadie (hay test).
- **Encendido:** `wrangler.jsonc` pasa a `CHAT_MODE=live` y `CHAT_MODEL=google/gemini-2.5-flash-lite`. **Al desplegar, el modelo queda encendido** con el secreto de producción.
- **Precios por modelo** (`worker/chat/live.js` → `PRICES`, USD por millón). Verificados por Luca el 20-oct en `openrouter.ai/api/v1/models`:

  | Modelo | Entrada | Salida | Caché |
  |---|---|---|---|
  | `google/gemini-2.5-flash-lite` (por defecto) | 0,10 | 0,40 | 0,01 |
  | `google/gemini-3.1-flash-lite` | 0,25 | 1,50 | 0,025 |
  | `google/gemini-3.5-flash-lite` | 0,30 | 2,50 | no publicada: se cobra como entrada |

  Un `CHAT_MODEL` **sin precio en la tabla, o una variante `:batch`**, nunca va live: responde el stub y no se reserva nada. No se puede gastar sin poder contar.
- **Decisión sobre Turnstile** (Luca: «con solo añadir el secreto queda encendido»):
  - **Sin las claves de Turnstile, live se permite**, con un cupo por IP más estricto: **10 respuestas live por IP y día**, frente a 25 con Turnstile. El tráfico sospechoso (UA de herramienta, sin idioma…) **nunca** va live.
  - **Con Turnstile configurado, se exige persona verificada** como en T32, y el cupo sube a 25.
  - Hay tests de ambos caminos.
- **Auditoría de topes, con el código delante:**
  - **Hueco 1 (arreglado), tope sin validar:** `Number(CHAT_DAILY_BUDGET_USD || 5)` con un valor mal escrito («5$») daba `NaN`, y `gastado + reserva > NaN` es siempre falso: **la reserva no frenaba nada**. Ahora `budgetCap()` solo admite números finitos ≥ 0 y **nunca más de $5** (techo duro: la variable solo puede bajarlo). Tests de 9 valores y de la reserva con un valor roto.
  - **Hueco 2 (arreglado), entrada inflada por el cliente:** el historial lo envía el cliente. Admitía 6 «respuestas del asistente» inventables de 2.000 caracteres, más 6 de usuario de 500: hasta ~60 KB de entrada pagada por mensaje.
    - Ahora al modelo van **≤ 4.000 caracteres** de historial (los más recientes; cada respuesta previa ≤ 1.200; el último mensaje, entero).
    - La reserva se calcula con eso mismo.
  - **Hueco 3 (arreglado), reserva optimista:** la reserva estimaba 1 token cada 3 caracteres; con emoji o escrituras no latinas se quedaba corta. Ahora es una **cota que no se puede superar: 1 token por byte UTF-8** de lo enviado, más la salida completa (`max_tokens`, que en Gemini incluye el razonamiento).
  - **Coste asentado:** el mayor entre tokens × precio del modelo y `usage.cost` de OpenRouter. Si OpenRouter cobrara más que nuestra tabla, el día se pasaría como mucho el exceso de una petición; la siguiente reserva ya no cabe.
  - **Verificado sin cambios** (con test):
    - la reserva atómica previa (20 simultáneas → 16 pasan) y que **ningún camino llama al modelo sin reservar** (un solo punto de llamada, después de `reserve`);
    - devolución en errores HTTP (401/402/500) y reserva retenida en cortes sin consumo conocido;
    - timeout de 15 s; salida de 400 tokens como techo duro;
    - 500 caracteres y 12 turnos;
    - límites por IP y por sesión (ráfaga, hora y día);
    - dedupe y caché;
    - errores del proveedor a mitad del stream → stub o corte avisado.
- **Peor caso económico:** calculado por `scripts/chat-evals.mjs` con las mismas funciones que producción (tabla en `docs/EVALS-CHAT-T33.md`). Con `google/gemini-2.5-flash-lite`:
  - **reserva máxima por respuesta: $0,00286**, con prompt de sistema de 14,8 KB, historial de 12 KB y 400 tokens de salida, todo a 1 token por byte;
  - **en $5 caben como mínimo ~1.746 respuestas live**; las típicas cuestan ~$0,00015, unas ~33.000 en $5;
  - **una sola IP puede gastar como mucho ~$0,029/día** sin Turnstile (10 respuestas), o ~$0,072 con él (25);
  - **aunque muchas IP se repartan el gasto, el día nunca pasa de $5.**
- **Evals:** `npm run evals:chat` → `docs/EVALS-CHAT-T33.md`. Stub 42/43; el único fallo es el de siempre, «Is there a plan for a big team?», que no inventa pero no acierta. **Live: pendiente, se ejecuta tras el deploy** (en local no hay clave).
- ⏳ **Para Diego:**
  - **Privacidad del proveedor:** OpenRouter puede enrutar a proveedores que guardan datos. Se podría forzar `provider: { data_collection: 'deny' }`, pero si ningún proveedor del modelo lo cumple, la llamada falla y el chat cae al stub. No se activó sin medirlo en producción.
  - **Caché de 6 h y precios:** sigue la nota de T32. Al cambiar precios, purgar la caché.

### T33 · interfaz (20-oct)
- **Serif de titulares: Fraunces** (en vez de Instrument Serif, que solo tiene peso 400). Comparadas Fraunces, Playfair Display y Newsreader con el titular real: Fraunces, con eje óptico de titular (144), es la más estrecha y contrastada y la única que mantiene el titular en una línea como Instrument. Se sirve como **instancia estática a 560** (normal + itálica, 17,0 + 21,5 KB: menos que Instrument, 20,5 + 21,6 KB). La versión variable 400–700 (30,4 + 38,1 KB) dejaba el LCP móvil en 1,82–1,97 s, al límite: descartada. ⏳ **Efecto a revisar con Diego:** los usos menores de la serif (preguntas del FAQ, citas del blog) también se ven a 560; si se quieren más ligeros, hace falta una segunda instancia (~17 KB, que solo se descarga donde se use).
- **Divisores:** los 8 filetes negros de 1,5 px a todo el ancho entre secciones (S03, S08, S11–S15, S17 y el FAQ) son ahora una línea de 1 px alineada al contenedor y difuminada (tokens `--divider`, `--divider-inset`). Bordes internos de tarjetas, sin cambios.
- **Widget sobre el contenido:** el lanzador se compacta a su círculo (con la insignia IA) y la burbuja se esconde mientras un bloque marcado `data-chat-avoid` (hoy, el acta) pasa por la franja inferior. Medido sin solape a 1024, 1280, 1440 y 1920 px.
- **Panel del widget por encima del header:** con el panel expandido el header tapaba el botón de cerrar (z-index 46 frente a 50). El panel abierto va ahora a 60 en cualquier tamaño; lanzador y burbuja siguen por debajo del header.
- **Bug de las imágenes OG (anterior a T33, salió al regenerar la caché):** las fuentes se descomprimían en paralelo y Geist salía corrupto, así que la OG se pintaba entera con la serif. Ahora se descomprimen una a una, con test.

### T35 · chat: capa curada y caché versionada (2026-10-20)
- **Respuestas curadas** (`content/chat-answers.js`, 16 fichas es/en, ≤ 45 palabras, tono de fundador, precios generados desde `content/precios.js`). Se sirven **antes de cualquier modelo y en cualquier modo**, al instante y con coste 0:
  - **chips:** el cliente manda `chip` (id curado). Los chips sugeridos lo llevan en `data-chat-chip` (`ChatWidget.astro`); los de respuesta, en `meta.chipIds`;
  - **texto libre:** se casa con alta confianza (`worker/chat/curated.js`).
- **Cómo se decide en texto libre:**
  - normalización (minúsculas, sin tildes ni signos), sinónimos y plurales de `search.js`, relleno fuera («están», «sirve», «get»…) y frases → término («how much», «al mes» → precio);
  - exige ≥ 1 palabra ANCLA de la ficha, cobertura ≥ **0,75** de los términos de la pregunta, ≤ 6 términos y ningún empate;
  - nunca casa si la pregunta huele a jailbreak, datos internos, métricas de la empresa o competidores (lista `DENY`): eso va al modelo con sus reglas.
- **Calibración** (`tests/worker/chat-curated.sets.js`):
  - **calibración:** 46/46 aciertos, 0 fichas equivocadas y 0/36 falsos positivos;
  - **ciego, escrito después:** 7/18 aciertos, 0 fichas equivocadas y 0/12 falsos positivos (1 FP inicial, «¿cuántos usuarios tienen ya?» → planes, corregido con la regla de métricas internas);
  - el umbral es estable entre 0,67 y 1; con 0,5–0,6 aparecen falsos positivos.
  - **Prioridad: precisión.** Lo que no se reconoce con confianza va al modelo (céntimos); una ficha equivocada engañaría al usuario.
- **Sobre las 43 preguntas de las evals** (`docs/EVALS-CHAT-T35.md`):
  - **1.ª vez:** 27/43 (63 %) sin modelo, 17 de ellas curadas y 0 incorrectas;
  - **2.ª vez:** 43/43, con la caché;
  - ⚠️ **cifra inflada:** varias de las 17 son coincidencias exactas porque las formas de preguntar se escribieron viendo esas evals. La cifra honesta de generalización es la del conjunto ciego.
- **Caché de 6 h versionada:** la clave lleva la versión de contenido (hash de conocimiento + fichas, `worker/generated/content-version.json`, generado en cada build). Si cambian los precios o una ficha, la caché vieja deja de servirse sola.
- **Contadores:** cada respuesta registra `src` = `curated` · `cache` · `llm` · `stub` · `cap` (solo etiquetas, sin PII). El % se saca de los logs: `count(src=curated|cache) / count(ev=answer)`.
  - ⏳ **Para leerlo en producción** hace falta `"observability": { "enabled": true }` en `wrangler.jsonc`, o `wrangler tail`. Hoy no está activado; es decisión de Diego y Luca.
- **Embeddings de Workers AI: NO se usan.**
  - [PENDIENTE verificar] su coste y si entran en el plan gratis: no se pudo consultar la tarifa sin red.
  - La capa léxica ya da 0 falsos positivos medidos. Los embeddings añadirían una llamada por mensaje y necesitarían un modelo multilingüe; solo merecen la pena si el ciego (7/18) se queda corto en producción.
- **Rareza anterior detectada:** el regex de la persona que detecta «¿eres humano?» también se activa con «¿Qué es un empleado de IA?» (contiene «es … IA»), y responde «soy una IA, no una persona». No se tocó (protege la declaración SB 1001); un test impide que una ficha use esas formas.

### T35 · adenda, punto 0: «hola amigo» sin respuesta (20-oct)
- **Reproducido con el JS de producción** (página real de agentceo.io con `/api/chat` interceptado en el navegador: ninguna petición llegó al servidor ni gastó cupo):
  - si la respuesta del servidor no termina, el widget se queda en «escribiendo…» para siempre;
  - **el mensaje siguiente ni se envía**: el `fetch` no tenía tiempo máximo y `busy` se quedaba en `true`;
  - 429, stream vacío y error de red sí mostraban aviso.
- **Por qué colgaba en el caso de Diego:** no observable sin los logs de producción. Lo que sí se midió:
  - «hola amigo» **no** contaba como saludo (solo «hola» exacto), así que iba al modelo;
  - en esa franja el proveedor del modelo devolvía error HTTP (ver `docs/EVALS-CHAT-T34-PROD.md`).
- **Sobre el cupo:** mis evals a producción iban a 1 petición cada 125 s (7 peticiones en 13 min), no a 6,5 s; esos 6,5 s eran del ensayo contra el preview local. No agotaron el 10/min, pero sí gastaron 5 del cupo live diario de esa IP (10 sin Turnstile), que es la de Diego.
- **Arreglo:**
  - **Cliente:**
    - tiempo máximo con `AbortController`: 15 s hasta el primer dato y entre trozos, 40 s en total;
    - `busy` siempre se libera;
    - ante 429, límite, error, timeout o stream vacío, mensaje amable + **respuesta calculada en el navegador** con la misma lógica del Worker (`worker/chat/match.js`, módulo puro);
    - los saludos se responden en el navegador al instante, sin petición.
  - **Servidor:**
    - saludos con cortesía («hola amigo», «buenas, ¿qué tal?», «hi there») = intención de saludo;
    - saludos, intenciones y fichas curadas **no gastan cupo** por IP ni por sesión; la ráfaga de 10/min sí aplica.
  - **Guardianes:** e2e en 3 navegadores (saludo sin petición, 429, stream vacío, servidor colgado) y unitarios; 5 mutaciones, todas en rojo.
- **Punto 5:** el chat cita `info@agentceo.io` (persona, prompt, base curada, textos del widget y la base generada de la web, reemplazado al construirla). Los documentos legales y la web conservan sus contactos.

### T35 · adenda, puntos 1, 2 y 4 (20-oct)
- **1 · Acta (S07):**
  - en escritorio la sección pasa a rejilla de dos columnas: cabecera y oficina a la izquierda; a la derecha la tarjeta, con su borde superior alineado con el título (medido: diferencia 0 px a 1280×800 y 1440×900);
  - el acta, algo compactada, cabe entera bajo el header (589 px de 724 útiles a 1280×800; 620 de 812 a 1440×900);
  - la oficina sube y se centra bajo el texto;
  - solo CSS (`overrides.css`): el HTML generado no cambia y el orden de lectura tampoco. Móvil, sin cambios.
- **2 · S03 «vacía» en producción:**
  - **Causa medida** (cargas de página en producción, sin tocar el chat, en Chromium, WebKit, móvil y escritorio): la isla hidrata bien y sin errores de JS, pero la escena del chat **empezaba sin ningún mensaje** (0 a los 0,8 s) y se rellenaba poco a poco; el HTML del servidor tampoco traía nada. Era la «ventana oscura sin nada dentro».
  - **Arreglo:** la conversación tiene un mensaje anterior fijo, el resumen del CEO de ayer, presente desde el HTML del servidor; la escena animada se añade debajo. Con e2e en 3 navegadores y sin JS.
- **2 · Web Analytics de Cloudflare (beacon bloqueado por la CSP):** se mantiene **bloqueado** por la CSP. La política de privacidad y la de cookies publicadas dicen que **no hay analítica**, y permitirla contradiría lo publicado (además de añadir un tercero). El beacon lo inyecta Cloudflare en el borde y el Worker no puede quitarlo. ⏳ **Acción para Luca:** desactivar Web Analytics en el panel de Cloudflare de agentceo.io (*Analytics & Logs → Web Analytics*). Mientras tanto, el bloqueo solo deja un aviso en la consola y no afecta a la página. Si Diego quiere analítica, antes hay que cambiar los textos legales y el panel de consentimiento.
- **4 · Footer e índice legal:**
  - 5 columnas: Producto, Recursos, Empresa, Legal (5 clave + «Ver todo») y Confianza;
  - páginas nuevas `/legal/` y `/en/legal/` con los 14 documentos por grupos;
  - las migas de cada documento pasan por el índice.
