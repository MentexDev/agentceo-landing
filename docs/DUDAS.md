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
