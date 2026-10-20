# Plan de correos de Agent CEO (T42)

> 2026-10-20 · rama `luca/emails` · paquete `emails/` (React Email). **Nada se envía**: no hay clave de Resend,
> nada está cableado en producción. Inventario de la referencia: [EMAILS-INVENTARIO-NEURALOS.md](EMAILS-INVENTARIO-NEURALOS.md).

## 0. ¿La waitlist envía algún correo hoy? **No.**

Medido en `worker/`:
- **`worker/waitlist.js`** solo hace `INSERT … ON CONFLICT` en D1 (`signups`) y responde JSON o un 303 a `/gracias/`.
- **`worker/lead.js`** hace lo mismo con `leads`.
- `grep -riE "mail|resend|sendgrid|postmark|smtp|mailchannels"` en `worker/` solo encuentra los `mailto:` del chat y `cleanEmail`. No hay proveedor, ni cola, ni token de confirmación.

**Consecuencias:**
- La página de gracias promete «Te escribimos apenas abra tu grupo» (`src/i18n/ui/es.js`, `thanks.p`). Eso lo cumplirá la plantilla **A4**.
- Hoy la lista **no tiene doble opt-in**. Para que exista **A1** hace falta:
  - una tabla de tokens;
  - el endpoint de confirmación;
  - una columna `confirmed_at` en `signups`.

  Es trabajo de Worker y D1 que queda **fuera de este turno**. Ver «Lo que falta para enviar».

## 1. Las plantillas (17 × ES/EN)

**Tipos de correo:**
- **Transaccional (T):** de servicio. Sin baja ni publicidad; el pie explica por qué llega.
- **Marketing (M):** siempre con baja. Lleva un enlace en el pie y las cabeceras `List-Unsubscribe` y `List-Unsubscribe-Post` (RFC 8058, que Gmail y Yahoo exigen a quien envía en volumen). Si falta `unsubscribeUrl`, el render **falla**.

### Fase A · hoy (landing solo con waitlist)

| id | Plantilla | Tipo | Por qué está |
|---|---|---|---|
| `waitlist-confirm` | Confirma tu correo (doble opt-in) | **T** | Sin confirmación, una lista acepta correos ajenos (bots, erratas, terceros) y estropea la reputación del dominio antes de abrir. Es una petición del propio usuario: servicio, sin baja. |
| `waitlist-welcome` | Bienvenida a la lista | **M** | Es el primer «sí». Trae la posición (si se decide mostrarla), el equipo de IA en imagen y **un prompt según el tipo de negocio** que eligió en el modal (`business_type`, que ya se guarda en D1). Lleva el enlace de referido, así que va como marketing. |
| `waitlist-update` | Así va la fila (posición y referidos) | **M** | Mantiene viva la espera sin enfriar. Solo sale si algo cambió. El texto de «te sube N puestos» solo aparece si llega `boost`: **la mecánica de referidos no está decidida**. Botón: compartir por WhatsApp. |
| `launch-invite` | Invitación de lanzamiento | **M** | Es el correo que promete la página de gracias. Es comercial (invita a darse de alta), así que va como marketing por prudencia CAN-SPAM. |

### Fase B · con la app

| id | Plantilla | Tipo | Por qué está |
|---|---|---|---|
| `account-welcome` | Bienvenida + primeros pasos | **T** | Primer correo de la cuenta. Tres pasos reales de la landing: WhatsApp por QR, una automatización y el acta. |
| `magic-link` | Enlace para entrar / verificar | **T** | Acceso sin contraseña o verificación. Código opcional y destino visible. |
| `password-reset` | Restablecer contraseña | **T** | Imprescindible. Regala un tip de contraseña fuerte. |
| `team-ready` | Primer equipo listo | **T** | Celebra el primer resultado y da el primer encargo. Anuncia el acta de las 7:00 (dato de la landing). |
| `daily-minutes` | El acta de la reunión diaria | **T** | Es el corazón del producto (S07 de la landing): qué hicieron, qué sigue y **una** aprobación con su botón. Solo sale si hubo algo. |
| `credits-low` | Créditos bajos (80 %) | **T** | Aviso de cuenta. Los créditos se renuevan **cada lunes** (dato de la landing), no cada mes como en NeuralOS. |
| `credits-out` | Créditos agotados | **T** | Muestra los paquetes **reales** (Chispa, Envión, Turbina y Reserva) y el plan siguiente, leídos de `content/precios.js`. |
| `payment-receipt` | Recibo de pago | **T** | Obligatorio con cobros. Plan y créditos salen de `content/precios.js`. |
| `payment-failed` | Pago fallido | **T** | Dunning. El texto de gracia solo sale si llega `graceEndsOn`: la política no está decidida. |
| `plan-changed` | Cambio de plan | **T** | Antes y después de créditos y personas, con el tono según suba o baje. |
| `security-alert` | Inicio de sesión nuevo | **T** | Seguridad. No se puede apagar. Incluye la nota anti-phishing «nunca te pediremos tu contraseña». |
| `winback` | Win-back por inactividad | **M** | A los 14 días y solo si dejó algo a medias, **una vez**. Ofrece un enlace para pausar 30 días además de la baja. |
| `monthly-digest` | Resumen del mes | **M** | Cifras del mes, lo mejor, una novedad y el prompt del mes. Es marketing porque trae novedades del producto. Sin actividad, no sale. |

### Lo que se omitió de NeuralOS, y por qué

| NeuralOS | Decisión | Motivo |
|---|---|---|
| S‑02/03/04 urgentes y escalado a admins | **Después** | En Agent CEO, las aprobaciones viven en el acta y en el celular. Un «urgente» solo tiene sentido cuando la app tenga vencimientos reales; se monta sobre las piezas del acta. |
| S‑07/10 invitaciones a un espacio | **Después** | Los planes tienen asientos (1/5/20/∞), pero la app aún no define invitaciones. |
| S‑13/14 cambio de correo y contraseña cambiada | **Siguiente tanda** | Son buenas prácticas de seguridad. Se hacen con las piezas de `password-reset` en minutos cuando la app tenga ese flujo. |
| S‑16 cuenta eliminada | **Siguiente tanda** | Lo pide la política de privacidad (derecho de supresión). Hay que decidir qué se borra y qué se guarda. |
| S‑09 trabajo terminado · S‑17 ahora eres admin · S‑28 hito | **Después** | Dependen de funciones de la app que aún no existen. |
| S‑21 pase de fundador · S‑23 tu ola abre mañana | **Fusionado / después** | La bienvenida a la lista cumple el papel del pase. La cuenta atrás con .ics llega si se decide avisar 24 h antes. |
| S‑22 bitácora cada 2 semanas | **Pregunta para Diego** | Exige contenido real cada 2 semanas. Sin eso, mejor no prometerla. |

## 2. Reglas de envío (para quien cablee Resend)

Son las del «Ritmo» de NeuralOS, adaptadas:
1. **Una promoción por semana como mucho.** Los transaccionales no cuentan.
2. **Silencio si no hay nada.** El acta, el resumen del mes y la actualización de la fila no salen sin datos nuevos.
3. **La hora de cada persona.** Nada entre las 21:00 y las 7:00 de su zona, salvo seguridad.
4. **Baja por tipo.** Darse de baja de marketing no apaga el acta ni la seguridad. La baja funciona en un clic y sin iniciar sesión.
5. **Si coinciden dos el mismo día, sale uno.** Por ejemplo, créditos agotados sustituye a créditos bajos.
6. **Si no abre, bajamos el ritmo.**
7. **Nunca un dato inventado.** Lo que falta hace fallar el render. Sin nombre, «Hola» a secas.

## 3. Cómo se usa

```js
import { render } from '@agentceo/emails'   // workspace del repo (emails/)
const { subject, preheader, html, text, headers } = await render('waitlist-confirm', 'es', {
  name: 'Ana', confirmUrl: 'https://agentceo.io/api/waitlist/confirm?t=…',
})
// Futuro (NO cableado): resend.emails.send({ from, to, subject, html, text, headers })
```

**Detalles de `render`:**
- Es **pura**: no envía, no toca la red ni el disco.
- `opts.assetBase` cambia de dónde salen los PNG y las fuentes. Por defecto es `https://agentceo.io`; la galería usa `''`.
- Los datos obligatorios de cada plantilla están en `required`. Los datos de ejemplo (ficticios) están en `sample(locale)`.

**Comandos:**
- `node emails/scripts/build.mjs` → HTML y texto estáticos en `emails/out/` (ignorado por git).
- `node emails/scripts/serve.mjs` → galería en **http://127.0.0.1:3012/**. Tiene conmutadores de móvil, oscuro (Apple Mail) e invertido (Gmail/Outlook).
- `node emails/scripts/screenshots.mjs` → `emails/screenshots/` y `overview.png`.
- `node emails/scripts/assets.mjs` → regenera los PNG de la mascota en `public/brand/email/`.

**Diseño:**
- Tablas, estilos en línea, ancho de 600 px y preheader en cada correo.
- `color-scheme` en `meta` y oscuro con `prefers-color-scheme` + `[data-ogsc]` para Outlook.com.
- La mascota es un **PNG con su placa opaca**: si Gmail u Outlook invierten los colores, no queda tinta sobre tinta. La captura `*.invertido.png` lo demuestra.
- Titulares en Instrument Serif con la negrita falsa de la landing (solo la pintan Apple Mail e iOS; el resto ve Georgia). Texto en Geist, que cae a Helvetica o Arial.
- El HTML pesa de 15 a 21 KB, lejos de los 102 KB a partir de los que Gmail recorta.

**Dependencias:** `@react-email/components` está **deprecated** en npm desde abril de 2026. Se usa su sucesor oficial, `react-email` 6.11.3: mismos componentes, mantenido y con `sideEffects:false`. Va con `@react-email/render` 2.1.1.
- `emails/` es un workspace npm.
- El `dist/` de la landing salió **idéntico byte a byte** al añadir React; solo cambian los 3 PNG nuevos.

## 4. Lo que falta para enviar (fuera de este turno)

1. **Dirección postal** para el pie. Hoy es el placeholder `{{POSTAL_ADDRESS}}`: CAN-SPAM exige una dirección física válida, y la del repo es la de la oficina registrada, que está vetada.
2. **Worker:**
   - tokens de confirmación y `confirmed_at`;
   - endpoint de baja de un clic (POST, RFC 8058);
   - tabla de bajas por tipo.
3. **Resend:**
   - dominio verificado (SPF, DKIM y DMARC en `agentceo.io`);
   - clave como *secret* de wrangler, nunca en el repo;
   - remitente (`hola@` o `info@agentceo.io`).
4. **Desplegar la landing** para que existan `https://agentceo.io/brand/email/*.png`. Hasta entonces, un correo real mostraría las imágenes rotas.
5. **Probar en clientes reales** (Gmail web y app, Outlook escritorio, Apple Mail e iOS). Las capturas son de Chromium: el modo oscuro de Apple Mail se emuló con `prefers-color-scheme` y la inversión de Gmail se simuló con un filtro CSS. **No se midió en los clientes reales.**
