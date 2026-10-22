# Turnstile en la lista de espera y el chat (T58)

> 2026-10-22 · rama `luca/turnstile`. **Apagado hasta que exista el secreto** `TURNSTILE_SECRET_KEY` en
> producción. La site key (pública) ya está en `wrangler.jsonc`.

## Qué protege

| Canal | Sin Turnstile (hoy) | Con Turnstile (las dos claves) |
|---|---|---|
| `POST /api/waitlist` (hero, CTA final, modal, exit-intent, formulario del chat) | honeypot + trampa de tiempo + 8/min por IP | **token obligatorio antes de guardar y de encolar la bienvenida** |
| Chat, respuestas live (LLM) | 10 respuestas live/día por IP | 25/día y solo con una sesión verificada; sin token, stub gratis con el reto |

## Cómo funciona

**Front** (`src/scripts/turnstile.js`):
- El Worker inyecta `<meta name="ac-turnstile">` solo si el canal está activo.
- El script `api.js` de Cloudflare se carga **async/defer en la primera interacción** con un formulario (foco o toque). Nunca bloquea el render.
- Hay un widget por formulario, dentro del propio formulario:
  - modo **Managed** (widget) y `appearance: interaction-only`: invisible salvo que Cloudflare pida interactuar;
  - `action: waitlist`.
- Cada token es de un solo uso: el paso 2 del modal pide uno nuevo.

**Worker** (`worker/lib/turnstile.js` → `worker/waitlist.js`):
- `siteverify` se llama con `remoteip` (la IP de `cf-connecting-ip`) y un timeout de 3 s.
- Va después del honeypot y de validar el correo, que no gastan llamadas, y **antes de guardar y de encolar**.

| Resultado de siteverify | Respuesta | Lead | Bienvenida |
|---|---|---|---|
| ok | 200 (o 303 a /gracias/) | se guarda | se envía |
| invalid (token ausente, falso, caducado o repetido) | **403 `verification_failed`**; el front muestra «No pudimos comprobar que eres una persona…» (es/en). Sin JS → `/gracias/#error` | no | no |
| unavailable (red, timeout, 5xx, secreto mal puesto) | 200 | **se guarda** | **retenida**: no se envía |

**CSP:** `challenges.cloudflare.com` se añade a `script-src` y `frame-src` **solo** cuando está activo.

### Fail-open o fail-closed ante un fallo de red de siteverify: **fail-open degradado**

**Por qué no fail-closed**
- Es tráfico **pagado**. Si siteverify cae, rechazar a todos los visitantes reales cuesta dinero y leads, y no es culpa de nadie que rellene el formulario.

**Por qué no fail-open puro**
- Lo que un bot más daña no es la tabla de D1, sino la reputación del dominio al recibir nuestra bienvenida en direcciones falsas.

**Cómo queda**
- Se guarda el alta, pero la bienvenida queda **retenida**: `email_send_log` con `status='failed'` y `last_error='held: turnstile_unavailable:…'`.
- El rate limit sigue activo.
- Cada caso deja un log `waitlist.turnstile_unavailable`.
- Para reenviar las retenidas, una vez revisadas:
  ```sql
  UPDATE email_send_log SET status='pending', attempts=0, next_attempt_at=NULL, last_error=NULL
   WHERE last_error LIKE 'held: turnstile_unavailable%';
  ```

**Un secreto mal configurado** (`invalid-input-secret`) cuenta como *unavailable*: es fallo nuestro, no del visitante.

## Rate limit del signup
- `RL_FORMS` (binding nativo): **8 peticiones por minuto por IP y ruta**. Se aplica antes de leer el cuerpo y antes de siteverify.
- T58: **IPv6 se agrupa por /64**. Un cliente IPv6 recibe un /64 entero, y antes podía rotar direcciones para saltar el límite.
- Límite conocido: el binding cuenta por ubicación de Cloudflare (no es global) y por ruta. Por eso Turnstile es la defensa principal y el rate limit, la segunda.

## El widget (ya creado)

`wrangler` 4.151.2 trae `wrangler turnstile widget` (alpha). Así se creó el 22-oct, sin dashboard y sin tocar tokens:

```bash
npx wrangler turnstile widget create "agentceo.io · lista de espera y chat" \
  --domain agentceo.io --domain www.agentceo.io --mode managed --json   # (salida filtrada: el secreto no se imprimió)
```
- **Site key:** `0x4AAAAAAFhJ06Nhr0kRGswq`. Es pública y está en `wrangler.jsonc` → `vars.TURNSTILE_SITE_KEY`.
- **Secreto:** no se guardó en ningún sitio. Se recupera con `wrangler turnstile widget get` o en el dashboard (Turnstile → el widget → Settings).

**Para crearlo desde el dashboard** (si hiciera falta otro):
1. Cloudflare → Turnstile → *Add widget*.
2. Nombre; hostnames `agentceo.io` y `www.agentceo.io`; *Widget Mode: Managed*; *Pre-clearance: No*.
3. *Create* → copiar la site key a `wrangler.jsonc` y el secreto con `wrangler secret put` (abajo).

## Activar, desplegar y deshacer (NO ejecutado)

```bash
cd "/Users/diego/Agent CEO/agentceo-landing"   # rama luca/turnstile

# 1. Deploy con Turnstile APAGADO (site key sin secreto = comportamiento de hoy + IPv6 por /64).
npm run deploy
curl -s https://agentceo.io/ | grep -c 'ac-turnstile'          # → 0 (apagado)

# 2. Encender: el secreto va DIRECTO del widget a `secret put`, sin pasar por la pantalla.
#    (`wrangler secret put` publica una versión nueva al momento: no hace falta otro deploy.)
npx wrangler turnstile widget get 0x4AAAAAAFhJ06Nhr0kRGswq --json \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s.slice(s.indexOf("{")));process.stdout.write((j.result||j).secret)})' \
  | npx wrangler secret put TURNSTILE_SECRET_KEY

# 3. Verificar.
curl -s https://agentceo.io/ | grep -o '<meta name="ac-turnstile"[^>]*>'          # la site key
curl -sI https://agentceo.io/ | grep -i content-security-policy | grep -o 'challenges.cloudflare.com' | head -1
curl -s -X POST https://agentceo.io/api/waitlist -H 'content-type: application/json' -d '{"email":"sin-token@example.com"}'   # → 403 verification_failed
npx wrangler tail agentceo-landing --format pretty   # waitlist.turnstile_rejected / _unavailable
# + un alta REAL desde el móvil (es y en): éxito y el paso 2 del modal.

# Apagar Turnstile al instante (sin tocar el código):
npx wrangler secret delete TURNSTILE_SECRET_KEY

# Volver al código anterior (versión en producción antes de T58):
npx wrangler rollback 4dab9db6-458c-4fb1-82d5-c3ac4ed068c4 --message "rollback T58"
# Esa versión no conoce TURNSTILE_SITE_KEY, así que no activa nada aunque exista el secreto.
# Aun así, borra el secreto si se vuelve atrás.
```

## Pruebas
- **Unitarias:** `tests/worker/turnstile.test.js`, 22 tests.
  - siteverify: ok, invalid, unavailable, timeout y `remoteip`.
  - waitlist: token válido, inválido, ausente, sin secreto, siteverify caído, formulario sin JS y el honeypot antes de gastar la llamada.
  - HTML y CSP.
  - Rate limit: IPv6 /64 y el binding real (la 9.ª petición da 429).
- **E2E en navegador real** con las claves de prueba oficiales: `npx playwright test -c playwright.turnstile.config.js`. Levanta dos Workers locales, en el 8794 (1x…, siempre pasa) y en el 8793 (2x…, siempre falla), y corre 6 escenarios en 3 navegadores.
- **Claves de prueba** (públicas, de Cloudflare):
  - site key `1x00000000000000000000AA`;
  - secreto que siempre pasa: `1x0000000000000000000000000000000AA`;
  - secreto que siempre falla: `2x0000000000000000000000000000000AA`.
