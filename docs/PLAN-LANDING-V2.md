# PLAN · Landing Agent CEO v2

> FASE 0: análisis, sin construir nada. Lo escribió Luca el 19 de octubre de 2026 en la rama `luca/landing-v2`.
> La fuente es `docs/BRIEF-LANDING-V2.md`, secciones 1 a 11, incluido el addendum del widget.
> Cada afirmación sale de algo medido en este turno: un comando, un fichero leído o la API pública de OpenRouter.
> Lo que no se pudo medir lleva la etiqueta **[NO MEDIDO]**.

---

## 0. Lo medido antes de planear

### 0.1 Repo base (`agentceo-landing`, commit `ed5c227`)

| Pieza | Estado medido |
|---|---|
| Worker | `worker/index.js`, 150 líneas. Expone `POST /api/waitlist` y `POST /api/lead` (D1, honeypot `company`, `INSERT OR IGNORE`), redirige `/login` a la app y pone CSP y cabeceras de seguridad en el HTML. **Sin rate limit**: la auditoría del 10-ago lo dejó pendiente. |
| D1 | `agentceo-waitlist` (`06f5dc3a-…`). Tablas `signups(email, name, source, referrer, user_agent, created_at)` y `leads`. **No hay columnas para UTM ni para tipo de negocio.** |
| Wrangler | Assets en `./public` con `run_worker_first`, rutas `agentceo.io` y `www`, `workers_dev:false`. Versión local `4.148.0`. Node `v24.21.0`. |
| Home | `public/index.html`, 1.032 líneas, escrita a mano. Fuentes Fraunces y Hanken Grotesk desde Google. **Sin JSON-LD.** Tiene un FAQ de 5 `<details>`. El `og:image` es `apple-touch-icon.png`, que no es una imagen OG. El contacto todavía es `ceo@agentceo.io`. |
| Generador | `scripts/build-content.mjs`, 743 líneas. Plantillas en cadenas, `esc()`, `safeUrl()`, `jsonLdScript()` endurecido, Article, BlogPosting, NewsArticle y FAQPage (solo en precios), sitemap y robots. Escribe en `public/` (zona ignorada por git). |
| Legales | `content/legal/*.md` → `scripts/build-legal.mjs` → `public/legal/*.html`. Son 5 documentos (términos, privacidad, cookies, seguridad, gdpr), v2.0 del 2-ago, Klinworks LLC (Delaware, expediente n.º 10704723). Los contactos ya son `@klinworks.com`. |
| Contenido | `content/{noticias,blog,recursos,precios}.js`: 8 noticias, 4 posts, 3 recursos con gate y 2 planes («Gratis» y «A tu medida»). Junto con las legales suman **86.920 caracteres**. La home tiene 4.704 caracteres visibles. |
| Peso | `AgentCEO_video.mp4` **6,6 MB** (vídeo del hero) · `favicon.png` **464 KB** · `logo-ceo.png` 120 KB · `logo-agent.png` 100 KB. |
| Privacidad, §5 | Solo nombra Supabase, Cloudflare y OpenRouter. Pagos y correo aparecen como «Proveedor de…» genérico. **Faltan 11 de los 14 subprocesadores** que pide el brief. |
| Cookies, §2.3 | Dice: «Hoy no usamos cookies analíticas». Si llega la analítica, el texto y el banner tienen que cambiar a la vez. |

### 0.2 Prototipo (`~/Desktop/agentceo-landing-react`, leído sin escribir)

- React 18.3 y Vite 5.4. Las únicas dependencias son react y react-dom. **Sin router, sin i18n, sin framer-motion y sin una sola imagen**: todo son 344 SVG inline.
- **21 secciones, duplicadas** en `src/desktop/` y `src/mobile/`. `App.jsx` elige un árbol u otro con `matchMedia(820px)`. El código fuente pesa 996 KB, y los ficheros más grandes son S04 (88 KB ×2), S03 (67/43 KB), S13 (45 KB ×2) y S11 (41 KB ×2).
- Hay unos 4.000 `style={{}}` inline y **ningún token**: los colores se repiten a mano (por ejemplo, `#111113` aparece 2.299 veces). Aparecen 4 colores que no están en el brief: `#7A5C17`, `#5E5C56`, `#FBFAF7` y `#a9a7a0`.
- Carga 5 familias desde Google: Geist, Geist Mono, Instrument Serif, Inter y Playfair. Inter y Playfair solo se usan en S03.
- El motion es CSS puro: 105 `@keyframes`. `prefers-reduced-motion` se respeta **solo desde JS** con `data-reduce`, sin `@media` en el CSS.
- **No se puede prerenderizar tal como está**:
  - lee `matchMedia` en `useState`;
  - `[data-rv]{opacity:0}` deja la página invisible sin JS;
  - `html,body{overflow:hidden}` mete el scroll dentro de un div;
  - escala con `zoom`;
  - el FAQ, las pestañas y los caminos de S04 y S13 solo existen tras un clic.
- La lista de espera **va a Supabase RPC**, y la interfaz dice «Listo, estás en la lista» sin esperar la respuesta: un éxito falso. ⛔ El brief prohíbe Supabase. Se reescribe contra `/api/waitlist`.
- Accesibilidad:
  - el modal no gestiona el foco ni cierra con Escape;
  - el FAQ usa `aria-pressed` donde corresponde `aria-expanded`;
  - Términos y Privacidad del footer apuntan a `#top`;
  - **el dorado sobre crema falla el contraste**: `#B8923A`/`#F4F2ED` = 2,6:1 y `#D9B866`/`#F4F2ED` = 1,71:1.
  - El dorado oscuro `#7A5C17` sí pasa: 5,57:1.

---

## 1. Arquitectura

### 1.1 Decisión: Astro, con React en islas, generando estático y servido por el mismo Worker

**Recomendación (se ejecuta salvo veto de Diego):** sustituir los dos generadores de cadenas y la home escrita a mano por **un sitio Astro en modo `output: 'static'`**. Las demos interactivas del prototipo pasan a ser **islas React** con hidratación diferida (`client:visible` / `client:idle`).

Por qué esta opción y no otra:

- **Prerender real.** Cada página sale como HTML completo: FAQ, textos y legales. Un rastreador o un LLM la lee sin ejecutar JS, que es justo lo que pide el §6.
- **Reutiliza el prototipo.** Los componentes JSX se portan como islas en vez de reescribirse en plantillas de cadenas.
- **i18n de rutas nativo.** Con `i18n.routing` y `prefixDefaultLocale:false`, el español se queda en la raíz y el inglés vive en `/en/`. Así **no cambia ninguna URL actual**, ni se pierde el SEO ya ganado.
- **Peso de JS controlado por isla.** Una sección sin interacción no envía JS.
- Usa Vite por debajo: es la misma cadena que el prototipo.

**Alternativa descartada:** ampliar `build-content.mjs` y prerenderizar React con `renderToString` a mano. Obligaría a mantener una hidratación, un enrutado i18n y un pipeline de assets propios. Es más código propio y más frágil.

**Lo que no cambia:**
- el Worker (`worker/index.js`) y sus endpoints;
- D1 `agentceo-waitlist`;
- `content/*.js` como fuente de datos, que las páginas Astro importan tal cual;
- `content/legal/*.md` como fuente legal, ahora como *content collection*;
- las funciones de escape `esc`, `safeUrl` y `jsonLdScript`, que pasan a `src/lib/` con sus tests.

Lo único que cambia en el despliegue es `wrangler.jsonc`: `assets.directory` pasa de `./public` a `./dist`. Los `/public/*` estáticos actuales se mueven a `public/` de Astro, que conserva el mismo nombre.

### 1.2 Estructura objetivo

```
agentceo-landing/
├─ design/prototype/            ← copia LITERAL del Desktop (referencia, no se compila; el Desktop no se toca)
├─ content/                     ← SE CONSERVA (fuente de datos)
│  ├─ noticias.js blog.js recursos.js precios.js
│  ├─ faq.js                    ← NUEVO: FAQ fusionada (es/en)
│  ├─ legal/{es,en}/*.md        ← legales por idioma
│  └─ en/…                      ← traducciones del contenido editorial
├─ src/
│  ├─ i18n/{es,en}.json · config.ts · rutas.ts   ← diccionarios UI + mapa de slugs
│  ├─ styles/tokens.css         ← ÚNICA fuente de color/tipo/espaciado/motion
│  ├─ components/               ← Header, Footer, LangSwitch, WaitlistForm, CookieBanner, Seo, JsonLd…
│  ├─ sections/S02…S19.astro    ← UNA versión responsive por sección (adiós desktop/ + mobile/)
│  ├─ islands/                  ← demos interactivas React (S03, S04, S05, S08, S09, S11, S12, S13…)
│  ├─ widget/                   ← widget de soporte (isla, carga diferida)
│  ├─ lib/                      ← esc/safeUrl/jsonLd, utm, analytics (consent-gated)
│  └─ pages/[...] + pages/en/[...]
├─ worker/index.js              ← + /api/chat, rate limit, GPC, nuevas columnas
├─ migrations/0002_*.sql        ← migración ADITIVA (no se aplica a prod en esta rama)
└─ tests/                       ← vitest (worker, i18n, escapes) + Playwright (navegador real)
```

### 1.3 Port del diseño (las 21 secciones)

1. **Tokens primero.** Se crea `tokens.css` con la paleta del brief y los 4 colores extra medidos. Se definen pares de contraste validados:

   | Uso | Color |
   |---|---|
   | Texto dorado sobre crema | `#7A5C17` (el único que pasa AA) |
   | Dorado claro | Solo sobre `#111113`, o como decoración |
   | Texto atenuado | `#5E5C56`. `#a9a7a0` queda prohibido como texto sobre crema |

2. **Un árbol responsive por sección**, en lugar de dos. Va con CSS `clamp()` y container queries, y desaparecen el `zoom` y `useIsMobile`. Los cerca de 1.906 textos duplicados quedan en **uno**, dentro de los diccionarios i18n.
3. **Mejoras de conversión sobre el prototipo** (§2 del brief):
   - el hero con una sola promesa y un CTA;
   - prueba social honesta: placeholder hasta tener datos reales, nunca cifras inventadas;
   - recortar o fusionar las secciones que no empujan a la lista.
   - **S03 está «pendiente de rediseño» según su README.** Se porta como isla, pero queda como pregunta para Diego (§11).
4. **Contenido de las islas en el HTML.** Cada isla prerenderiza su estado inicial y un resumen textual. Las respuestas del FAQ, por ejemplo, van en el DOM con `<details>`, no condicionadas a un clic.
5. **Motion.** Se usan `@media (prefers-reduced-motion: reduce)` en CSS (no solo en JS) y animaciones solo de `transform` y `opacity`. Se elimina `opacity:0` sin JS: con `<html class="js">`, el contenido se ve aunque falle el JS. Los carruseles automáticos se paran con foco, hover o reduce, y tienen botón de pausa (WCAG 2.2.2).
6. **Fuentes.** Se autoalojan en woff2 y con subset latino **Geist, Geist Mono e Instrument Serif**. Se descartan Inter y Playfair. Geist se precarga. Se quitan Google Fonts, y con ello `font-src`/`style-src` externos de la CSP.

### 1.4 Lista de espera (solo lista, conversión fuerte)

- **Un único componente `WaitlistForm`** sirve para el hero, el CTA final, el modal, el sticky, el exit-intent y el widget. Es un `<form>` real que funciona sin JS (POST normal más redirección a `/gracias`) y se mejora con `fetch` cuando hay JS.
- **Éxito honesto**: el mensaje de éxito solo aparece si el Worker responde `ok`. Se acaba el `setTimeout` mentiroso del prototipo.
- **El modal de 3 pasos de S21** pide primero el correo, que ya queda guardado. El tipo de negocio es opcional y se envía en una segunda llamada. Así nunca se pierde un lead por pedir de más.
- **Captura de UTM.** Se leen `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid` y `ref` en la primera visita. Se guardan en `sessionStorage` (primer toque) y viajan con el envío.
- **Migración aditiva** `0002_waitlist_attribution.sql`:
  - en `signups` se añaden `locale`, `business_type` y los cinco `utm_*`, más `landing_path` y `consent_marketing`;
  - una segunda llamada actualiza el tipo de negocio con `UPDATE … WHERE email = ? AND business_type IS NULL`.
  - Se prueba **solo contra D1 local** (`wrangler d1 execute --local`). ⛔ **No se aplica a producción**: lo hace Diego al desplegar.
  - El Worker debe tolerar las dos versiones del esquema durante la ventana del despliegue.
- **CTA sticky**: aparece en móvil al pasar el hero y se oculta si el formulario está visible. **Exit-intent**: en escritorio, una vez por sesión y nunca si ya se apuntó; en móvil no hay exit-intent, porque es intrusivo.
- **CAN-SPAM**. La confirmación del formulario incluye:
  - la identidad (Klinworks, LLC y su dirección física);
  - el propósito;
  - la forma de darse de baja.
  - El envío de correos (Resend) **no forma parte de esta rama**: solo se deja el texto y el endpoint `GET/POST /api/unsubscribe?t=` diseñado con un token firmado (HMAC). [Pregunta §11]

---

## 2. i18n

- **Locales:** `es` (por defecto, en la raíz) y `en` (`/en/…`). La configuración es una lista: añadir `pt` = un diccionario, un mapa de slugs y una carpeta de legales. No se toca código.
- **Rutas localizadas con slugs traducidos** (`/precios/` ↔ `/en/pricing/`, `/legal/privacidad` ↔ `/en/legal/privacy`). Un mapa único en `src/i18n/rutas.ts` alimenta a la vez el selector, `hreflang`, el sitemap y los canonicals, así que no puede haber desajustes.
- **hreflang** en cada página: `es`, `en` y `x-default` (que apunta a `es`). Una página que no esté traducida **no emite hreflang `en`**, y el selector lleva a la portada `/en/` con un aviso. Nunca se sirve una traducción a medias.
- **Selector de idioma:**
  - es un menú accesible (`button` + `aria-expanded` + lista) con el nombre de cada idioma en su propio idioma;
  - conserva la página equivalente;
  - recuerda la elección en una cookie `lang`, que es funcional y no requiere consentimiento.
  - **No redirige automáticamente por `Accept-Language`**: esa redirección rompe a los rastreadores. Como mucho, un aviso discreto de «¿Prefieres English?».
- **Contenido editorial:**
  - el inglés vive en `content/en/*.js`, con la misma forma y el mismo `slug` interno, más `slug_en`;
  - las legales tienen sus propios `.md` en inglés;
  - las fechas se formatean con `Intl.DateTimeFormat`, en lugar del array `MESES` actual.
- **Tests de i18n:**
  1. paridad de claves es↔en (falla si falta una);
  2. cada ruta de `rutas.ts` existe en el build en los dos idiomas;
  3. cada hreflang apunta a una URL que devuelve 200;
  4. ningún texto en español aparece en las páginas `/en/` (heurística con lista de palabras frecuentes).

---

## 3. SEO + GEO

| Pieza | Plan |
|---|---|
| HTML prerenderizado | Cada página es estática y completa. Test: `curl` del HTML (sin JS) contiene el H1, el FAQ y el texto principal. |
| JSON-LD | Un componente `<JsonLd>` reutiliza el escape `jsonLdScript` ya endurecido. Tipos: **Organization** (Klinworks, LLC; marca AgentCEO; `sameAs`, `contactPoint` @klinworks.com, dirección registrada), **SoftwareApplication** (categoría BusinessApplication; `offers` solo con lo que es real, el plan gratis a 0 USD, **sin inventar precios**), **FAQPage** (home y precios), **Article/BlogPosting/NewsArticle** (ya existen; se portan) y **BreadcrumbList** (todas las páginas internas). Todo se valida contra schema.org en un test. |
| Sitemap | `sitemap.xml` con `xhtml:link` hreflang por URL, generado desde `rutas.ts` más el contenido. Incluye las legales nuevas. Lleva `lastmod` real (`actualizado` o `date`). |
| robots.txt | `Allow` explícito para GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Googlebot y Bingbot, más la línea `Sitemap:`. **[NO MEDIDO]**: la lista vigente de user-agents se verifica en la documentación oficial de cada proveedor al construir. |
| `/llms.txt` y `/llms-full.txt` | Se generan en el build. `llms.txt` es el índice: entidad, qué es, para quién, enlaces. `llms-full.txt` es el texto plano de la home, el FAQ, los precios, el blog y los recursos, más un resumen legal. Hay una pareja por idioma: `/en/llms.txt`. |
| OG y Twitter | Una imagen 1200×630 por página, generada en el build a partir de una plantilla SVG con la paleta (dependencia propuesta: `@resvg/resvg-js`, sin Chrome). Se acaba el `apple-touch-icon` como OG. |
| Canonical | Siempre la URL limpia, sin `.html` y con la barra final coherente. Redirección **301** de `/legal/*.html` a `/legal/*` (hoy enlazadas con `.html`) y de `www` al apex. |
| Copy de entidad | Un párrafo canónico y factual, idéntico en `llms.txt`, Organization, `/empresa` y el footer: «AgentCEO es un producto de Klinworks, LLC (Delaware, EE. UU.) que…». Nada de superlativos que no se puedan verificar. Los LLM recomiendan lo que pueden citar. |
| Core Web Vitals | Presupuestos LCP < 2,0 s, CLS < 0,05 e INP < 200 ms, más estos topes: JS inicial ≤ 60 KB gz en la home (sin islas), CSS crítico inline ≤ 14 KB y fuentes precargadas ≤ 2. El vídeo de 6,6 MB del hero **no entra en v2** (el prototipo no lo usa). Si Diego lo quiere, va con un `poster` AVIF, carga en idle y en una versión ≤ 1,5 MB. `favicon.png` (464 KB) se rehace como SVG más un PNG ≤ 10 KB. |
| Medición | Lighthouse CI (escritorio y móvil) sobre `wrangler dev` local, como puerta del CI: 95 o más en las cuatro categorías. |

---

## 4. Legal EE. UU. (todo como BORRADOR)

Todas las páginas llevan una banda visible: **«BORRADOR — requiere revisión de abogado»**, junto con `version` y `actualizado` en el front-matter. Mientras siga en borrador, el `.md` lleva `estado: borrador` y el build pinta la banda. Al cambiar el estado a `revisado`, la banda desaparece.

| Documento | Ruta (es / en) | Estado de partida |
|---|---|---|
| Privacidad (con los 14 subprocesadores reales) | `/legal/privacidad` · `/en/legal/privacy` | Hay que actualizar la v2.0. A §5 le faltan 11 proveedores. |
| Aviso CCPA/CPRA (California) | `/legal/california` · `/en/legal/california` | Hay base en `gdpr.md` §12. Se separa en su propio documento. |
| Leyes estatales (VA, CO, CT, UT, TX, OR, MT…) | `/legal/estados` · `/en/legal/state-privacy` | Base en `gdpr.md` §13. Se amplía. |
| «Do Not Sell or Share» + GPC | `/no-vender-ni-compartir` · `/en/do-not-sell-or-share` | Nuevo (ver la mecánica abajo). |
| Cookies + banner | `/legal/cookies` · `/en/legal/cookies` | Hay que actualizarlo: hoy dice que no hay analítica. |
| Términos | `/legal/terminos` · `/en/legal/terms` | Existe (v2.0). Se traduce y se enlaza con lo nuevo. |
| Uso aceptable | `/legal/uso-aceptable` · `/en/legal/acceptable-use` | Nuevo. Parte de lo que hoy está en `terminos.md` §4. |
| Divulgación de IA | `/legal/ia` · `/en/legal/ai-disclosure` | Nuevo. Incluye que el widget es una IA. |
| Subprocesadores | `/legal/subprocesadores` · `/en/legal/subprocessors` | Nuevo. Una única fuente de datos (`content/subprocesadores.js`) que alimenta esta página y la tabla de privacidad. |
| DPA | `/legal/dpa` · `/en/legal/dpa` | Nuevo. Hay base en `gdpr.md` §1–9. |
| Reembolsos y cancelación | `/legal/reembolsos` · `/en/legal/refunds` | Nuevo. ⚠️ Necesita la política comercial real (§11). |
| Accesibilidad | `/legal/accesibilidad` · `/en/legal/accessibility` | Nuevo. Compromiso WCAG 2.2 AA y contacto. |
| DMCA | `/legal/dmca` · `/en/legal/dmca` | Nuevo. ⚠️ Un agente DMCA registrado en la Copyright Office es un trámite de Klinworks (§11). |
| COPPA (menores de 13) | Sección en Privacidad y Términos | Existe §11 «Menores». Se endurece. |
| CAN-SPAM | Texto del formulario y la baja (§1.4) | Nuevo. |
| Seguridad y GDPR | Se conservan y se traducen | Existen. |
| Contacto | `/contacto` · `/en/contact` | Nuevo. Buzones `@klinworks.com` por tema, sin formulario que envíe correo (no hay backend de correo en esta rama). |

**Subprocesadores** (la lista del brief): Stripe, Resend, PostHog, Sentry, Plausible, Supabase, Cloudflare, OpenRouter, OpenAI, Google (Gemini), Anthropic, xAI, Deepgram, ElevenLabs y Meta. Cada fila lleva propósito, datos, ubicación y si afecta a la landing o a la app. ⚠️ Son 15 nombres y el brief dice 14 porque cuenta a Google y Gemini como uno. Para cada uno hay que saber si **ya están contratados** o son previstos (§11). Si se publica un subprocesador que no se usa, el documento queda inexacto.

**Banner de cookies y GPC (mecánica):**
- **Categorías:** necesarias (siempre), funcionales y analítica.
- **El texto del banner depende de la jurisdicción, pero el comportamiento es el mismo en todas:** toda la analítica arranca en **opt-in**. Es lo más sólido: se cumple en la UE y en EE. UU. con un solo código.
- **El Worker detecta la región** con `request.cf.country` / `regionCode` y la inyecta en el HTML **solo para el texto**. Esto obliga a que el banner no quede en caché por región: el texto se resuelve en el cliente con un `<meta>` que inyecta el Worker con HTMLRewriter.
- **GPC:** si `navigator.globalPrivacyControl === true` o llega la cabecera `Sec-GPC: 1`, se aplica el opt-out de «venta o compartición» sin preguntar y el banner lo dice («Respetamos tu señal GPC»). Test: con `Sec-GPC: 1`, nunca se carga un script de analítica.
- **El consentimiento se guarda** en la cookie de primera parte `consent` (versionada) y se puede reabrir con el enlace «Preferencias de cookies» del footer.
- **Ningún script de analítica está en el HTML.** Un *loader* lo inyecta solo después del consentimiento. Test de Playwright: sin consentimiento, cero peticiones a dominios de analítica.

**Entregable** `docs/LEGAL-CHECKLIST.md`: una fila por cada pieza de la tabla, con estado (falta / borrador / traducido / revisado por abogado), fuente, ruta y dependencias de Diego. Se crea en la fase L.

---

## 5. Navegación y mapa de páginas

**Header:** logo · Recursos · Blog · Noticias · Precios · selector de idioma · CTA «Únete a la lista». En móvil, hamburguesa con menú accesible: trampa de foco, Escape y `aria-expanded`. Así se corrige el «móvil sin navegación» del prototipo.

**Footer** (se re-estiliza y todos sus enlaces dan 200; un test de enlaces rotos lo garantiza):
- **Producto:** Cómo funciona (`/#como-funciona`) · Agentes (`/#equipo`) · Precios
- **Recursos:** Recursos · Blog · Noticias · Preguntas (`/#faq`)
- **Empresa:** Sobre Klinworks · Contacto · Prensa y marca · Únete a la lista
- **Legal:** Términos · Privacidad · Cookies · Seguridad · GDPR · Subprocesadores · Uso aceptable · IA · Accesibilidad · DMCA · Reembolsos · DPA
- Abajo: «Do Not Sell or Share My Personal Information» · Preferencias de cookies · © Klinworks, LLC · selector de idioma

**Mapa** (versión `es`; cada página tiene su par `/en/`):

```
/                         home (secciones portadas + FAQ + CTA)
/precios/                 planes reales (Gratis · A tu medida)
/noticias/ · /noticias/<slug>
/blog/     · /blog/<slug>
/recursos/ · /recursos/<slug>   (gate de correo → /api/lead)
/empresa/                 sobre Klinworks, LLC (entidad, misión, datos verificables)
/contacto/                buzones @klinworks.com por tema
/prensa/                  kit de marca: logos SVG/PNG, colores, boilerplate, contacto prensa
/gracias/                 éxito de lista de espera sin JS
/legal/<doc>              14 documentos (§4)
/no-vender-ni-compartir/
/llms.txt · /llms-full.txt · /sitemap.xml · /robots.txt · /404
/login → 302 app (se conserva)
```

**FAQ fusionada** (`content/faq.js`, es/en): parte de las 5 del sitio y las 12 de S18, que se solapan en «programar/tecnología», «datos seguros» y «cuánto cuesta». Saldrán unas 13 preguntas canónicas, más 2 nuevas que hacen falta para GEO y para el negocio: «¿Qué es AgentCEO y quién está detrás?» y «¿Qué pasa con mis datos y la IA?».

⚠️ **Hay contradicciones medidas que no se resuelven sin Diego** (§11):
- S18 dice «plan Arranque con créditos cada semana», mientras que `precios.js` dice «Gratis + A tu medida».
- S18 dice que «La Forja publica con tu GitHub y tu Vercel», y eso no aparece en ningún otro sitio de la web.

---

## 6. Widget de agente de soporte (PRIORIDAD MÁXIMA, nivel producción)

### 6.1 Frontend (isla `src/widget/`, cargada en `idle`)

- **Launcher.** Va abajo a la derecha. Es la mascota CEO del prototipo (SVG ya existente, «ojos que miran»). Tiene una micro-animación de «respirar» y un globo con la primera sugerencia a los 8 s. Con reduce, no hay animación ni globo automático. Pesa ≤ 3 KB y se carga antes que el panel.
- **Panel.** Tiene tres tamaños: compacto (380×560), grande (720×80vh) y pantalla completa. En móvil (≤ 820 px) es un **bottom sheet** con agarrador, arrastre y `100dvh` seguro con el teclado abierto.
- **Persona.** Es «el CEO», con la voz del prototipo: cercano, breve y con humor ligero. Se presenta como IA desde el primer mensaje (divulgación de IA, §4). La misma persona existe en es y en, y el idioma sigue al de la página.
- **Conversación:**
  - preguntas sugeridas al abrir (vienen del FAQ y dependen de la página: en `/precios/`, preguntas de precio);
  - **streaming** token a token por SSE;
  - **markdown** seguro: un subset propio (negrita, listas, enlaces solo internos o a `@klinworks.com`), escapado antes de interpretarlo, sin `innerHTML` de datos crudos (se reutiliza la lógica de `enLinea` de `build-legal.mjs`);
  - **chips** de respuesta rápida al final de cada respuesta.
- **Lista de espera dentro del chat.** Cuando la intención es de compra o la respuesta no se sabe, aparece una tarjeta con `WaitlistForm` (el mismo componente, con `source:'widget'` y UTM). Es el **fallback** obligatorio.
- **Persistencia.** La conversación se guarda en `localStorage`, con `try/catch`, un tope de 30 mensajes, caducidad de 7 días y un botón «Nueva conversación».
- **Accesibilidad:**
  - `role="dialog"`, foco gestionado, Escape para cerrar y foco que vuelve al launcher;
  - el log va con `role="log"` y `aria-live="polite"`, pero se anuncia **al terminar** cada respuesta, no por token;
  - se maneja entero con teclado, tiene un objetivo táctil de 24 px o más (WCAG 2.5.8) y contraste AA.
- **Analítica de conversión**, con un bus de eventos que **solo emite si hay consentimiento**:
  - eventos `widget_open`, `widget_suggested_click`, `widget_message_sent`, `widget_answer_done`, `widget_fallback_shown`, `widget_waitlist_submit` y `widget_close`;
  - ningún evento lleva el texto de los mensajes.
  - El proveedor (Plausible o PostHog) se decide en §11.

### 6.2 Backend (Worker `POST /api/chat`, flag apagado)

- **Feature flag.** La variable `CHAT_MODE` admite `off` (por defecto: 404 y el launcher no se pinta), `stub` y `live`. **En esta rama solo existen `off` y `stub`.** El modo `live` queda escrito y probado contra un mock de OpenRouter, sin ninguna key: `OPENROUTER_API_KEY` sería un *secret* que solo Diego pone.
- **Stub inteligente** (propuesta para hacerlo más legendario):
  - no devuelve un texto fijo: **busca por léxico en el FAQ y el contenido** (BM25 sobre el *knowledge pack* del build);
  - responde en streaming con el texto literal de la mejor coincidencia y su enlace;
  - si no supera el umbral, muestra la tarjeta de lista de espera.
  - Coste **cero**, sin LLM, y ya resuelve el 60–80 % de las preguntas de FAQ **[NO MEDIDO: es una estimación que se medirá con un juego de 50 preguntas]**.
  - Con esto, el widget puede salir a producción el día 1 con `stub`.
- **Knowledge pack.** Se genera en el build: un JSON por idioma con FAQ, precios, secciones de la home, blog, recursos y un resumen legal, en fragmentos con su URL. **Solo el contenido del sitio**; el prompt prohíbe responder fuera de él.
- **Prompt caching (modo live).** El prefijo es estable: persona, reglas y knowledge pack, en ese orden, sin fechas ni nada variable. Detrás va el historial. En Gemini, a través de OpenRouter, la caché es implícita para prefijos idénticos y acepta `cache_control` explícito **[NO MEDIDO: se verifica en la doc de OpenRouter antes de activar live]**.
- **Anti-abuso** (se aplica también en `stub`):
  1. **Rate limit por IP**: 10 mensajes por minuto y 60 por día, con el binding de Rate Limiting de Workers. Si no estuviera disponible en el plan, con un Durable Object por IP **[NO MEDIDO: disponibilidad del binding en la cuenta]**.
  2. Tope por conversación: 12 turnos; luego, tarjeta de lista de espera.
  3. Entrada de 500 caracteres como máximo, salida de 400 tokens como máximo y un historial enviado de los 6 últimos turnos.
  4. **Interruptor de presupuesto global**: un contador diario de gasto en el DO. Al pasar el tope (por ejemplo 5 USD/día, lo decide Diego) el modo baja a `stub` solo.
  5. Comprobación de `Origin`/`Referer` y Turnstile invisible en el primer mensaje. En los tests se usan **las sitekeys de prueba públicas de Cloudflare**, nunca claves reales.
  6. Defensa contra prompt injection: el contenido del usuario va delimitado, nunca se ejecutan herramientas y los enlaces de salida están en lista blanca.
  7. **No se guarda el contenido de los chats** en D1. Solo métricas agregadas.
  8. Rate limit también para `/api/waitlist` y `/api/lead`, que cierra la deuda de la auditoría del 10-ago.

### 6.3 Coste estimado del modo live

**Precios medidos el 20-oct-2026 a las 04:35 UTC** con `GET https://openrouter.ai/api/v1/models` (USD por millón de tokens):

| Modelo (OpenRouter) | Entrada | Salida | Lectura de caché |
|---|---|---|---|
| `google/gemini-3.1-flash-lite` | 0,25 | 1,50 | 0,025 |
| `~google/gemini-flash-latest` (→ 3.7-flash) | 0,75 | 3,75 | 0,075 |
| `google/gemini-2.5-flash-lite` (generación anterior) | 0,10 | 0,40 | 0,01 |
| `anthropic/claude-haiku-5.5` (comparativa) | 0,10 | 0,50 | 0,01 |

**Supuestos**, que son explícitos y se pueden cambiar:
- Las tokens se calculan como caracteres / 3,5 (español). El corpus completo del sitio mide 91.624 caracteres, unas 26.000 tokens. El knowledge pack curado se queda **por debajo**.
- El prefijo cacheado es persona + reglas + knowledge pack. En cada turno se paga **todo el historial** previo como entrada sin caché.
- En los escenarios base y pesimista, **el primer turno de cada conversación falla la caché** y paga el prefijo a precio de entrada completo, porque con poco tráfico la caché caduca. Los demás turnos leen de caché.
- No se incluyen la escritura de caché (cuyo precio es menor que el de entrada), los reintentos ni el Worker.

| Escenario | Pack | Turnos | Usuario/turno | Salida/turno | Caché en el turno 1 |
|---|---|---|---|---|---|
| Optimista | 10 k | 3 | 40 | 180 | sí |
| **Base** | **15 k** | **4** | **60** | **260** | no |
| Pesimista | 25 k | 8 | 120 | 450 | no |

| Modelo | Optimista /conv · /1.000 | **Base /conv · /1.000** | Pesimista /conv · /1.000 |
|---|---|---|---|
| gemini-3.1-flash-lite | $0,0018 · $1,76 | **$0,0070 · $6,98** | $0,0203 · $20,26 |
| gemini-flash-latest (3.7) | $0,0049 · $4,86 | **$0,0201 · $20,14** | $0,0581 · $58,07 |
| gemini-2.5-flash-lite | $0,0006 · $0,59 | **$0,0026 · $2,58** | $0,0074 · $7,38 |
| claude-haiku-5.5 | $0,0007 · $0,65 | **$0,0027 · $2,69** | $0,0077 · $7,74 |

**Lectura para Diego:**
- Con el modelo de clase Flash-Lite actual, **unos 7 USD por cada 1.000 conversaciones**. Con 10.000 conversaciones al mes, unos 70 USD/mes en el escenario base y unos 200 USD en el peor.
- El interruptor de presupuesto (§6.2) pone un **techo duro**, sea cual sea el tráfico.
- El stub inteligente responde gratis lo que esté en el FAQ. Si se usa como **primer filtro también en live** (si BM25 tiene alta confianza, se responde sin LLM), el coste real baja en proporción a ese 60–80 % [NO MEDIDO].
- Recomendación: **gemini-3.1-flash-lite** para empezar. Haiku 5.5 sale ~2,6× más barato en el escenario base, así que conviene compararlos con el mismo juego de 50 preguntas antes de elegir.
- **[NO MEDIDO]** El coste de Workers, Durable Objects y Rate Limiting a ese volumen, porque no consulté el plan de la cuenta. Se espera marginal frente a los tokens.

---

## 7. Calidad y tests

| Qué | Cómo |
|---|---|
| Worker | Vitest con el pool de Workers y D1 **local**. Casos: correo válido e inválido, duplicado, honeypot, cuerpo `null`, UTM truncados, rate limit (429), GPC, `/api/chat` en `off`/`stub`, tope de turnos, presupuesto. **Mutación a mano** de cada guardián (por ejemplo, quitar el `INSERT OR IGNORE` y ver el rojo). |
| i18n | Los 4 tests de §2. |
| Escapes | Se portan las defensas de `esc`, `safeUrl` y `jsonLdScript` con casos de ataque (`</script>`, `javascript:`, comillas). |
| Navegador real | Playwright con Chromium y WebKit, en escritorio y en móvil (emulación de dispositivo con input real de teclado y táctil, sin `dispatchEvent`). Flujos: apuntarse a la lista desde los 6 puntos, el selector de idioma, el banner sin analítica, el widget completo y las páginas sin JS. |
| Accesibilidad | axe-core en cada página dentro de Playwright, más una revisión manual con VoiceOver de los flujos clave. |
| Lighthouse | CI con un umbral de 95 en las 4 categorías, en móvil y escritorio, sobre las páginas tipo. |
| Enlaces | Un crawler del `dist/` que exige 200 en todos los internos y `mailto:` @klinworks.com válidos. |
| Secretos | No hay ninguna key en el repo; `.dev.vars` va en `.gitignore`. Un test busca patrones de claves en `dist/` y `worker/`. Los logs nunca imprimen `env`. |

---

## 8. Fases propuestas (cada una cierra con commit local, sin push)

| Fase | Contenido | Depende de |
|---|---|---|
| **1. Esqueleto** | Copia del prototipo a `design/prototype/`, Astro, tokens, fuentes autoalojadas, layout, Header y Footer, i18n (config, rutas, selector), Worker sirviendo `dist/`, tests base | — |
| **2. Lista de espera** | `WaitlistForm` único, UTM, migración 0002 (local), modal de 3 pasos, sticky, exit-intent, `/gracias`, rate limit en `/api/*` | 1 |
| **3. Home** | Port de las secciones (tokens + responsive único + islas), FAQ fusionada, motion y reduce | 1, 2 · ⚠️ §11 (S03, precios) |
| **W. Widget** | UI completa, knowledge pack, `/api/chat` off/stub, stub BM25, anti-abuso, modo live contra un mock | 1, 2, FAQ de la 3 |
| **4. Páginas internas** | Precios, noticias, blog y recursos re-estilizados, más empresa, contacto y prensa | 1 |
| **5. SEO/GEO** | JSON-LD, sitemap con hreflang, robots, llms, OG, 301 y CWV | 3, 4 |
| **L. Legal** | 14 documentos en borrador (es) + `LEGAL-CHECKLIST.md`, banner + GPC, Do Not Sell | 1 · ⚠️ §11 |
| **6. Inglés** | Traducción de la interfaz, el contenido y las legales | 3, 4, L |
| **7. Audit C-A-R-F** | En un turno aparte: Lighthouse, axe, ataques al Worker en local, mutaciones y el *lessons doc* | todo |

Por la prioridad máxima del addendum, **W va justo después de la 2**: no espera a que la home entera esté portada, solo a la FAQ.

---

## 9. Riesgos

| Riesgo | Nivel | Por qué / mitigación |
|---|---|---|
| Port de casi 1 MB de JSX duplicado con 4.000 estilos inline | **ALTO** | Es el grueso del trabajo. Mitigación: tokens primero, una sección por commit y comparación visual contra el prototipo con capturas de Playwright a 1440 y 390. |
| Contraste dorado/crema (2,6:1 y 1,71:1) | **ALTO** | Obliga a cambiar el diseño en puntos concretos: `#7A5C17` para el texto y el dorado claro solo como decoración. Diego tiene que aceptar ese ajuste visual. |
| Contradicciones de producto (precios, Forja, cuándo abre) | **ALTO** | Publicar la que no es sería prometer en falso, también a los LLM. Se bloquea en §11. |
| Legales nuevas sin abogado | **ALTO** | Mitigación: banda de BORRADOR, checklist y ninguna afirmación de cumplimiento que no se sostenga. Y no publicar subprocesadores que no se usan. |
| Migración D1 al desplegar | MEDIO | Es aditiva y el Worker es compatible con los dos esquemas. ⛔ Diego la aplica en producción, nunca esta rama. |
| Caché del banner por región | MEDIO | El texto se resuelve en cliente con un `<meta>` inyectado por el Worker. El comportamiento (opt-in) es igual en todas partes. |
| Lighthouse 95 con islas pesadas (S03, S04) | MEDIO | Hidratación en `visible`, división de código por isla y presupuesto de JS en el CI. |
| Volumen de traducción (8 noticias, 4 posts, 3 recursos, 14 legales) | MEDIO | Si no cabe, una página sin traducir no emite hreflang `en`, sin páginas a medias. Una traducción legal se marca BORRADOR como su original. |
| Abuso de `/api/chat` cuando se active live | MEDIO | Rate limit, Turnstile, topes y un interruptor de presupuesto con techo duro. |
| Rate Limiting binding no disponible en el plan | BAJO | Alternativa con Durable Object, ya prevista. |
| Puerto 5179 ocupado | BAJO | `lsof` antes de levantar. `wrangler dev` en `8787` (no está en la lista prohibida). |

---

## 10. Restricciones que este plan respeta

- Solo la rama `luca/landing-v2`. **Sin push, sin deploy, sin `wrangler deploy`, sin escrituras en la D1 de producción** (solo `--local`).
- `~/Desktop/agentceo-landing-react` solo se lee y se copia; nunca se modifica.
- Sin Supabase para la lista de espera. Sin llamadas a LLM de pago. Sin API keys.
- Puertos prohibidos: 3000, 4000, 3100, 4100, 4101, 5433 y 6380. Dev en **5179**. No se toca `~/neuralos-tony` ni `~/NeuralOS`.
- No se imprimen secretos. Las pruebas usan claves de mentira o las claves de test públicas de Cloudflare.

---

## 11. Preguntas para Diego (producto y negocio, bloquean lo marcado con ⚠️)

1. **Precios:** el prototipo dice «plan gratis y plan **Arranque** con créditos cada semana», y la web actual dice «Gratis + A tu medida». ¿Cuál es el real hoy?
2. **Mensaje principal:** ¿«Empleados de IA que venden por ti» (prototipo) o «Haz crecer tu empresa, sin hacerlo todo tú» (actual)?
3. **S03 «Así se ve por dentro»**: el README dice que está pendiente de rediseño. ¿Se porta así, se omite o se espera el rediseño?
4. **Subprocesadores:** de los 15 nombres del brief, ¿cuáles están **contratados hoy** y cuáles son previstos? (Meta, ¿como API de WhatsApp?).
5. **Analítica:** ¿Plausible (sin cookies), PostHog o los dos? Cambia el banner y el texto de cookies.
6. **Reembolsos:** ¿qué política comercial hay (plazo, prorrateo, créditos)? Sin eso, el documento queda vacío.
7. **DMCA:** ¿Klinworks tiene un agente DMCA registrado? Si no, es un trámite previo a publicar esa página.
8. **Contacto del sitio:** ¿`ceo@agentceo.io` (que hoy está en la home y en las noticias) pasa a `@klinworks.com` igual que las legales? ¿Qué buzón es el de prensa?
9. **Vídeo del hero (6,6 MB):** ¿se queda en v2? El prototipo no lo usa.
10. **Correos a la lista (CAN-SPAM):** ¿quién envía hoy y desde qué dominio? ¿Se construye ya el endpoint de baja?
11. **Widget live:** ¿qué tope de presupuesto diario quieres (propuesta: 5 USD/día) y qué modelo prefieres tras la comparativa?

## 12. Fuera de este plan (se anota, no se construye)

- El envío real de correos de la lista (Resend) y la doble confirmación.
- Un gate de recursos en el servidor (deuda consciente del 10-ago).
- `pt` y otros idiomas: la arquitectura los admite, pero no se traducen.
- Una página de estado o *trust center* más allá de Seguridad.
