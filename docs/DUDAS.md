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
