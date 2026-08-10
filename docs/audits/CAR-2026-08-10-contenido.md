# C-A-R — Secciones de contenido + Precios (2026-08-10)

**Alcance auditado:** generador estático (`scripts/build-content.mjs`), Worker
(`worker/index.js`), `schema.sql`, `wrangler.jsonc`, `public/assets/content.css`,
`public/index.html` y las páginas generadas (Noticias, Blog, Recursos, Precios).

**Método:** auditoría multi-agente en 7 dimensiones + verificación adversarial de
los hallazgos graves. Dos dimensiones salieron **limpias**: *anti-fake* (las 8
noticias son fieles a sus fuentes primarias, reabiertas y contrastadas) y
*regresión* (no se rompió `/api/waitlist`, la home ni las páginas legales).

## Hallazgos y remediaciones

| Sev | Hallazgo | Fix aplicado |
|-----|----------|--------------|
| HIGH→MED | JSON-LD inyectado crudo: `</script>` en título/fuente ⇒ XSS almacenado | `jsonLdScript()` escapa `< > &` a `\uXXXX` antes de incrustar |
| HIGH→MED | Callejón en móvil: Noticias/Blog/Recursos inalcanzables (nav oculto, sin hamburguesa) | Menú hamburguesa en generador + home (CSS + JS) |
| MED | `safeUrl()` no escapaba comillas → ruptura de atributo `href` | `safeUrl()` rechaza `" ' < > espacio`; además `esc(safeUrl())` en todos los href |
| MED | Endpoints sin rate-limit | Honeypot + índice único ya presentes; **pendiente**: regla de Rate Limiting a nivel Cloudflare (no en código) |
| MED | Canonical/enlaces con `.html` → 307 | URLs limpias (`urlOf()`, sin `.html`) en canonical, og:url, JSON-LD y tarjetas |
| MED | Sin `sitemap.xml`; robots sin `Sitemap:` | `writeSitemap()` genera `sitemap.xml` + `robots.txt` |
| MED | Home sin canonical | `<link rel=canonical>` + og:image en `index.html` |
| MED | Contraste `--muted-2` (#74716b) falla WCAG AA | subido a `#8d8a82` (~5.5:1) |
| LOW | `item.slug` sin escapar (y en `writeFile`) | slug SIEMPRE `slugify()` + `esc(href)` |
| LOW | body `null` → 500 (honeypot fuera de try/catch) | guard `if (!body || typeof body !== 'object')` |
| LOW | `workers.dev` expuesto (salta WAF) | `workers_dev: false` |
| LOW | `og:image` ausente; JSON-LD sin `image`/`publisher.logo` | añadidos (apple-touch-icon como OG) |
| LOW | Gate: error técnico en inglés; localStorage global | mensaje en español; `localStorage` **por-recurso** |
| LOW/INFO | roles ARIA (`role=tablist`), skip-link, ghost sin `aria-hidden`, áreas táctiles | corregidos (`role=group`+`aria-pressed`, skip-link, `aria-hidden`, padding táctil) |
| INFO | HTML sin CSP | CSP + `X-Content-Type-Options`/`Referrer-Policy`/`X-Frame-Options` en el Worker |

## Deuda consciente (no bloqueante)

- **Gate client-side:** el contenido de los recursos viaja en el HTML (visible en
  "ver fuente"). Capta el correo pero no protege el contenido. Aceptable para un
  imán de marketing; un gate server-side sería otra fase.
- **Rate limiting real:** conviene una regla de Rate Limiting de Cloudflare sobre
  `/api/*` (el honeypot + índice único mitigan, pero no limitan la tasa).

## Verificado en producción

Rutas 200 (incl. `/precios`, `/sitemap.xml`, `/robots.txt`), CSP activa sin romper
Google Fonts ni el `fetch` del lead magnet, hamburguesa móvil operativo, sección de
precios movida de la home a `/precios/`.
