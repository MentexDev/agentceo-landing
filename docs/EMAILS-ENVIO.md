# Envío automático de la bienvenida a la waitlist (T57)

> 2026-10-22 · rama `luca/emails-autosend`. **Apagado por defecto**: `WELCOME_EMAIL_ENABLED="false"` en `wrangler.jsonc`.
> Plantillas: [EMAILS-PLAN.md](EMAILS-PLAN.md) · paquete: [`emails/README.md`](../emails/README.md).

## Qué hace

Cuando alguien se apunta en `POST /api/waitlist`, recibe `waitlist-welcome`:
- en su idioma (`es` o `en`, el de la página);
- con el regalo según el tipo de negocio que elija en el paso 2 del modal;
- con la mascota por defecto;
- desde `Agent CEO <info@agentceo.io>`, por Resend, con el secreto `RESEND_API_KEY`.

```
POST /api/waitlist ──► guarda en signups ──► responde YA (200 / 303)
                         └─ ctx.waitUntil(enqueueWelcome)
                              ├ INSERT OR IGNORE email_send_log (UNIQUE email+template) + token de baja
                              ├ ¿ya hay negocio? → deliver() ahora
                              └ si no → espera WELCOME_EMAIL_DELAY_S (120 s) al paso 2 del modal
Cron */2 min ──► sweepEmails ──► deliver() de los pendientes que ya tocan y de los «sending» huérfanos (>10 min)
deliver(): reclamo atómico (UPDATE … RETURNING) → rellena el pre-render → POST a Resend con Idempotency-Key
           → sent | pending con backoff | failed
```

## Decisiones (medidas)

### 1. `ctx.waitUntil` + reintentos + Cron Trigger, no Cloudflare Queues

**Por qué no Queues**
- Queues exige Workers Paid (~5 USD/mes).
- Desde aquí no se puede verificar el plan de la cuenta sin crear nada. `wrangler.jsonc` no usa nada que solo exista en Paid (Durable Objects SQLite, Rate Limiting y D1 existen en Free).
- El brief manda no crear recursos. Ante la duda: la opción gratis.

**Por qué basta así a este volumen** (una lista de espera: decenas o cientos de altas al día)
- La respuesta no espera nada: todo va en `waitUntil`.
- Dentro de una entrega se intenta hasta 3 veces, con pausas de 0,5 s y 1,5 s.
- Si falla, se reintenta con backoff exponencial con jitter (entre d/2 y d, con d = 1 min × 2^(n−1) y un tope de 6 h). Hay un máximo de 8 intentos.
- Un Cron Trigger cada 2 min (gratis) recoge los pendientes y los huérfanos.
- La «cola» es la tabla `email_send_log`: es durable, se puede consultar con SQL y es idempotente.

**Cuándo pasar a Queues** (opción documentada, no construida)
- Si el volumen pasa de miles por hora.
- O si hace falta paralelismo o una DLQ gestionada.
- Cambio:
  1. `wrangler queues create agentceo-email` (exige Paid).
  2. Añadir un binding `producer` y un `consumer` en `wrangler.jsonc`.
  3. `enqueueWelcome` hace `env.EMAIL_QUEUE.send({ id })` en lugar de `deliver()`, y el consumer llama a `deliver(env, id)`.
- `email_send_log`, el reclamo y la idempotencia se quedan igual. El cron queda como red de seguridad.

### 2. Pre-render en el build, no React Email en el Worker

**Medido el 2026-10-22**

| | Bundle (`wrangler deploy --dry-run`) | CPU por correo |
|---|---|---|
| Worker antes de T57 | 157 KiB (53 KiB gzip) | — |
| Con React Email dentro | +715 KiB (+223 KiB gzip) | 13 ms de mediana, 39 ms en p95, 89 ms el primero (más 425 ms de import en frío). El plan Free da **10 ms** por invocación. |
| **Pre-render (elegido)** | **289 KiB (66 KiB gzip)** | < 1 ms (sustitución de marcas) |

**Cómo funciona**
- `emails/scripts/worker-templates.mjs` (en `prebuild` y `pretest`) pinta **la misma plantilla** de `emails/src`, con marcas en lugar de los datos.
- Variantes: `es`/`en` × con nombre o sin nombre.
- El regalo, la fecha, la baja y la base de los PNG son marcas.
- Resultado: `worker/generated/emails.js` (105 KB, ignorado por git).
- Si una marca desaparece de la plantilla, el build falla.
- El Worker (`worker/email/fill.js`) sustituye las marcas con los valores escapados. Si queda una marca sin rellenar, no envía.

### 3. Idempotencia por correo (tres capas)
1. `UNIQUE(email, template)` en `email_send_log` + `INSERT OR IGNORE` antes de enviar. Re-inscribirse o el paso 2 del modal no duplican.
2. **Reclamo atómico**: `UPDATE … SET status='sending' … RETURNING`. Si dos entregas compiten, solo una gana. Lo prueba un test de carrera.
3. **`Idempotency-Key` de Resend**: `waitlist-welcome/<sha256(template:email)[:40]>`, estable y sin el correo en claro. Si un Worker muere tras enviar y antes de anotarlo, el barrido reintenta a los 10 min y Resend no duplica (ventana de 24 h).

### 4. Errores
- **Se reintentan:** 408, 409, 429, 5xx y los fallos de red (timeout de 10 s).
- **Fallo definitivo, sin reintento:** el resto de 4xx (400, 401, 403, 404, 422…). Queda `failed` con `last_error`.
- **Sin `RESEND_API_KEY`:** no se reclama nada. Las filas siguen `pending` y salen solas cuando exista la clave.

### 5. La bienvenida es un correo de marketing (T42): lleva baja de verdad
- **`/api/unsubscribe?t=<token>`:**
  - `GET` muestra un botón. Los escáneres de enlaces hacen GET y no deben dar de baja a nadie.
  - `POST` da de baja: es el one-click de RFC 8058 que piden Gmail y Yahoo.
  - El token son 48 hex aleatorios (`email_preferences`): no revela el correo.
- **Cabeceras:** `List-Unsubscribe` y `List-Unsubscribe-Post`.
- **Supresión:** quien se dio de baja no recibe (queda `failed: suppressed`).

### 6. Privacidad y abuso
- **Logs:** JSON de una línea (`email.queued`, `email.sent`, `email.retry`, `email.failed`, `email.suppressed`, `email.unsubscribed`, `email.sweep`), con el correo enmascarado (`a***@g***.com`). `last_error` va limpio de correos y de la clave.
- **La clave** solo viaja a `https://api.resend.com/…`, o a `localhost` para el e2e: una `RESEND_API_URL` ajena se ignora.
- **El nombre** es un campo libre. Si parece un enlace, un correo o HTML, se ignora y el saludo queda en «Hola» a secas. Así nadie usa nuestra bienvenida para mandar spam.

## Configuración

| Variable | Dónde | Por defecto |
|---|---|---|
| `WELCOME_EMAIL_ENABLED` | `wrangler.jsonc` → `vars` | `"false"` (solo `"true"` lo enciende) |
| `RESEND_API_KEY` | secreto (`wrangler secret put`) / `.dev.vars` | — (sin ella no se envía nada) |
| `EMAIL_FROM` | var opcional | `Agent CEO <info@agentceo.io>` |
| `EMAIL_ASSET_BASE_URL` | var opcional (https) | `https://agentceo.io/email-assets/v1` |
| `SITE_URL` | var opcional | `https://agentceo.io` (enlaces y baja) |
| `WELCOME_EMAIL_DELAY_S` | var opcional | `120` (espera al paso 2 si aún no hay negocio) |

**Migración:** `migrations/0003_email_send_log.sql`.
- `email_send_log`: `id`, `email`, `template`, `locale`, `status` (`pending|sending|sent|failed`), `resend_id`, `attempts`, `last_error`, `next_attempt_at`, `created_at`, `updated_at`, `sent_at`.
- `email_preferences`: `email`, `unsub_token`, `unsubscribed_at`, `created_at`.

## Pruebas
- **Unitarias** (`tests/worker/welcome-email.test.js`, D1 local efímera, Resend simulado): 31 tests.
  - Flag, idempotencia y carrera.
  - Backoff, 4xx frente a 5xx y el máximo de intentos.
  - Idioma `es`/`en`, el paso 2 y los huérfanos.
  - Bajas, la clave sin configurar, logs sin PII y que el signup no espera.
- **E2E local:** `node scripts/e2e-welcome.mjs`.
  - Usa `wrangler dev --local` en el 8797, con una D1 en una carpeta temporal que se borra al terminar, y un Resend simulado en el 8796.
  - 12 comprobaciones: signup → `sent`, sin duplicados, `en`, 503×2 → `sent` al 3.º intento, 422 → `failed`, cron (`/__scheduled`) y baja GET/POST.
- **Prueba real única:** `node scripts/e2e-welcome.mjs --real`. Envía un correo a `ceo@agentceo.io` y se niega a repetir.

## Activar en producción (NO ejecutado aquí)

```bash
# 0. Desde la raíz del repo, en la rama que se vaya a desplegar.
cd "/Users/diego/Agent CEO/agentceo-landing"

# 1. Migración en la D1 de producción (aplica en orden las pendientes: 0002 si faltaba, y 0003).
npx wrangler d1 migrations list agentceo-waitlist --remote
npx wrangler d1 migrations apply agentceo-waitlist --remote

# 2. Comprobar las tablas y que el secreto existe (lista solo nombres, nunca valores).
npx wrangler d1 execute agentceo-waitlist --remote --command "SELECT name FROM sqlite_master WHERE name IN ('email_send_log','email_preferences')"
npx wrangler secret list

# 3. Encender el flag: en wrangler.jsonc → "WELCOME_EMAIL_ENABLED": "true" (y commit).

# 4. Desplegar (build: pre-render, Astro y wrangler deploy; sube también el cron */2).
npm run deploy

# 5. Verificar en vivo.
npx wrangler tail agentceo-landing --format pretty      # buscar email.queued / email.sent
npx wrangler d1 execute agentceo-waitlist --remote --command "SELECT status, COUNT(*) n FROM email_send_log GROUP BY status"

# Apagar: "WELCOME_EMAIL_ENABLED": "false" y npm run deploy (los pendientes esperan intactos).
```
