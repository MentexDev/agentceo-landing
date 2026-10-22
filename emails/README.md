# `@agentceo/emails` · los correos de Agent CEO

Son 17 plantillas en React Email, en español e inglés. Este paquete **solo pinta**; no envía nada. El plan completo está en [`docs/EMAILS-PLAN.md`](../docs/EMAILS-PLAN.md).

```js
import { render } from '@agentceo/emails'
const { subject, preheader, html, text, headers } = await render('waitlist-welcome', 'es', data, {
  postalAddress: process.env.POSTAL_ADDRESS,          // obligatoria: sin ella, render() falla
  assetBase: process.env.EMAIL_ASSET_BASE_URL,        // opcional: por defecto https://agentceo.io/email-assets/v1
})
```

## Configuración

| Variable | Obligatoria | Qué es |
|---|---|---|
| `POSTAL_ADDRESS` | **Sí** (producción) | Dirección postal del pie, que CAN-SPAM exige. Si falta, `render()` lanza un error y `build.mjs` sale con código 1. Solo la galería (`--gallery`, `preview: true`) pinta un aviso amarillo en su lugar. |
| `EMAIL_ASSET_BASE_URL` | No | Base **https** de los PNG. Por defecto, `https://agentceo.io/email-assets/v1`. Una base relativa o `http:` hace fallar el render. |

## Imágenes: por qué no se rompen en Gmail

**Formato y ruta**
- Solo PNG, en `public/email-assets/v1/`; se publican con la landing.
- Se pintan a 2× (retina) del tamaño mayor en pantalla:
  - `ceo.png` y `ceo-noche.png`: 128 px, porque se muestran a 64 px;
  - `agente-1…4.png`: 112 px, porque se muestran a 56 px.
- Se regeneran con `node emails/scripts/assets.mjs`. El registro de las imágenes es `EMAIL_ASSETS`, en `src/brand.js`.
- La carpeta lleva versión (`v1`). Si un dibujo cambia, va a `v2/`: los correos ya enviados siguen apuntando a la suya.

**En el HTML**
- Cada `<img>` lleva una URL https absoluta, `alt`, y `width`/`height` en atributo y en estilo.
- Cada imagen va dentro de una **celda de tamaño fijo** (`<td width height>`) con el color de la placa. Si las imágenes están bloqueadas, el alt se queda dentro del cuadrado en letra pequeña y no empuja la píldora «¡confirmado!».
- Alt de los agentes: su puesto. Alt del CEO: «Tu CEO».

> ⚠️ Los PNG solo existen en `https://agentceo.io/email-assets/v1/` **cuando se despliega la landing**. Medido el 2026-10-22: hoy dan 404. Por eso la Prueba 1 llegó rota: `/brand/email/*.png` nunca se publicó.

## Avatares propios (override)

Cualquier plantilla que muestre al CEO o a los agentes acepta estos datos opcionales:

```js
await render('waitlist-welcome', 'es', {
  ...data,
  ceo: { avatarUrl: 'https://cdn.tu-app.com/avatars/ceo-123.png' },
  agents: [
    { avatarUrl: 'https://cdn.tu-app.com/avatars/a1.jpg' },  // 1.º de la fila del equipo
    {},                                                      // 2.º: sin foto → agente-2.png
    { avatarUrl: 'https://cdn.tu-app.com/avatars/a3.gif' },
  ],
}, opts)
```

**El CEO (`ceo.avatarUrl`)**
- Sustituye a la mascota en todos sus sitios: la portada, la burbuja y la firma.

**Los agentes (`agents[i].avatarUrl`)**
- Van **por posición**: el `i` de `agents` es la columna `i` de la fila del equipo.
- Las columnas sin foto usan `agente-(i+1).png`.
- Hoy solo muestran el equipo `waitlist-welcome` y `team-ready`. En el resto, `agents` se ignora.

**Validación y respaldo**
- Una URL que Gmail no pintaría hace fallar el render con el campo nombrado (por ejemplo, `agents[1].avatarUrl`). Eso incluye:
  - `http:`, rutas relativas o SVG/WebP;
  - URLs con query o con comillas.
- Si **no** llega la foto, se usa el avatar por defecto (la mascota y su gemelo de modo oscuro).
- Si llega, se usa tal cual, sin gemelo oscuro. Sale recortada a su cuadrado (`object-fit: cover` donde se soporte).

## Comandos

| Comando | Qué hace |
|---|---|
| `node emails/scripts/build.mjs --gallery` | Solo la galería, en `emails/out/gallery`. No pide dirección. |
| `POSTAL_ADDRESS="…" node emails/scripts/build.mjs` | Producción (`emails/out/<id>.<locale>.html\|.txt`) más la galería. **Falla sin `POSTAL_ADDRESS`**. |
| `node emails/scripts/serve.mjs` | Abre la galería en http://127.0.0.1:3012/ (`EMAILS_PORT` para cambiar el puerto). |
| `node emails/scripts/screenshots.mjs` | Guarda las capturas en `emails/screenshots/`, con la galería abierta. |
| `node emails/scripts/send-test.mjs` | **La prueba real con Resend.** La ejecuta una persona a mano (ver abajo). |

### `send-test.mjs` · la prueba de envío

Manda **un** correo: `waitlist-welcome.es` a `ceo@agentceo.io`, desde `Agent CEO <info@agentceo.io>`, con el asunto `[Prueba 2] Bienvenido a la lista de espera de Agent CEO`.

```bash
EMAIL_ASSET_BASE_URL=https://agentceo.io/email-assets/v1 POSTAL_ADDRESS="…" node emails/scripts/send-test.mjs --dry-run   # todo menos enviar
EMAIL_ASSET_BASE_URL=https://agentceo.io/email-assets/v1 POSTAL_ADDRESS="…" node emails/scripts/send-test.mjs             # envía
```

**La clave**
- Lee `RESEND_API_KEY` de `.dev.vars`.
- **Nunca la imprime**: la tapa con `***` hasta en los errores.

**Antes de enviar**
- Pide cada imagen y **no envía** si alguna no responde `200 image/*`.
- Así se evita repetir la Prueba 1.

**El envío**
- Hace un solo POST, sin reintentos.
- Lleva una `Idempotency-Key` fija: repetirlo en 24 h no duplica el correo.

**Los datos**
- Son los de ejemplo de la plantilla (ficticios), sin nombre.
- `TEST_NAME` lo pone.
- `UNSUBSCRIBE_URL` cambia la baja; por defecto es `mailto:info@agentceo.io?subject=Baja`, porque el endpoint de baja aún no existe.
