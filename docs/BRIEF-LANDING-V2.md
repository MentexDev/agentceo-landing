# Brief: Landing Agent CEO v2 (legendaria)

Rama: `luca/landing-v2`. Autor del brief: Luca (agente técnico de Diego).

## 1. Base y diseño
- **Base:** este repo (MentexDev/agentceo-landing). Incluye el Cloudflare Worker, el dominio agentceo.io, la lista de espera en D1 (`agentceo-waitlist`), `content/*.js`, los documentos legales en md y el script build-content.
- **Diseño nuevo:** `~/Desktop/agentceo-landing-react`. Es React 18 + Vite, con 21 secciones en versión escritorio y móvil.
  - Tipografía: Geist.
  - Paleta: #111113 y #F4F2ED, con dorados #B8923A, #D9B866 y #EFE4C8.
- **NO modificar la carpeta del Desktop.** Cópiala dentro del repo.
- Porta el diseño y mejora mucho el prototipo en:
  - conversión y claridad;
  - motion, respetando `prefers-reduced-motion`;
  - rendimiento;
  - accesibilidad WCAG 2.2 AA.

## 2. Solo lista de espera
- Todo CTA lleva a la lista de espera.
- Se mantiene en D1 `agentceo-waitlist` con el endpoint actual del Worker. NO migrar a Supabase.
- Conversión fuerte:
  - CTA sticky;
  - exit-intent;
  - prueba social;
  - formulario mínimo;
  - estado de éxito;
  - captura de UTM.

## 3. Navegación
- **Footer:** se conserva y se re-estiliza, con todos los enlaces funcionando.
  - Términos, Privacidad, Cookies, Seguridad, GDPR.
  - Recursos.
  - Empresa.
  - Producto: Cómo funciona, Agentes, Precios.
- **Empresa:** reforzarla con "sobre Klinworks, LLC", contacto y prensa/marca.
- **Header:** Recursos, Blog, Noticias y Precios.
  - Sus páginas internas se mantienen y se re-estilizan.
  - El contenido sigue en `content/*.js`.

## 4. FAQ
- Analiza la FAQ actual del sitio y la S18 del prototipo.
- Fusiónalas y mejóralas.
- Agrega schema FAQPage.

## 5. i18n
- es (por defecto) y en como mínimo, con arquitectura extensible (pt, etc.).
- Un selector de idioma hermoso.
- hreflang y rutas localizadas (/en/...).
- Documentos legales traducidos.

## 6. SEO + GEO
El objetivo es que nos recomienden ChatGPT, Claude, Perplexity y Google AI.
- HTML estático prerenderizado: nada de contenido solo-SPA.
- JSON-LD: Organization, SoftwareApplication, FAQPage, Article y BreadcrumbList.
- Sitemap con hreflang.
- robots.txt que permita GPTBot, ClaudeBot, PerplexityBot y Google-Extended.
- /llms.txt y /llms-full.txt.
- Imágenes OG y Twitter.
- URLs canónicas.
- Copy de entidad claro y factual.
- Presupuestos de Core Web Vitals: LCP < 2.0 s, CLS < 0.05, INP < 200 ms.

## 7. Legal EE. UU.
Todo sale como BORRADOR, marcado "requiere revisión de abogado".

**Privacidad:** actualizarla con todos los subprocesadores reales:
- Stripe, Resend, PostHog, Sentry, Plausible;
- Supabase, Cloudflare;
- OpenRouter, OpenAI, Google Gemini, Anthropic, xAI;
- Deepgram, ElevenLabs, Meta.

**Políticas y piezas que hay que entregar:**
- Aviso CCPA/CPRA, enlace "Do Not Sell or Share" y respeto de la señal GPC.
- Leyes de privacidad estatales.
- Banner de cookies, con opt-in donde aplique, que bloquee la analítica hasta que haya consentimiento.
- Términos.
- Uso aceptable.
- Política de divulgación de IA.
- Página con la lista de subprocesadores.
- DPA.
- Reembolsos y cancelación.
- Declaración de accesibilidad.
- DMCA.
- COPPA: sin menores de 13 años.
- CAN-SPAM para los correos de la lista de espera.
- Página de contacto.

**Entidad:** Klinworks, LLC (Delaware). Los contactos son @klinworks.com.

**Entregable:** `docs/LEGAL-CHECKLIST.md` con cada política y su estado.

## 8. Widget de agente de soporte
- Un chat que responda la FAQ y preguntas del producto, basado SOLO en el contenido del sitio.
- Fallback a la lista de espera.
- Construir la UI y un endpoint en el Worker detrás de un feature flag.
  - Por defecto devuelve una respuesta stub.
  - NO llamar a ningún LLM pago ni agregar API keys. Luca le lleva antes a Diego una estimación de costo.
- Rate limiting y anti-abuso.

## 9. Calidad
- Lighthouse 95+ en todas las categorías.
- Tests de la lista de espera y del i18n.
- Nunca imprimir secretos.
- Reutilizar los componentes y el contenido que ya existen.

## 10. Reglas
- Trabajar solo en la rama `luca/landing-v2`.
- NO push, NO deploy, NO `wrangler deploy`, NO escrituras en la D1 de producción.
- No tocar los puertos 3000, 4000, 3100, 4100, 4101, 5433 ni 6380.
- No tocar ~/neuralos-tony ni ~/NeuralOS.
- Para dev, usa el puerto 5179.

## 11. ADDENDUM: Widget de soporte (PRIORIDAD MÁXIMA, nivel producción)
El widget tiene que ser hermoso, divertido y estratégico.

**Frontend:**
- Launcher con micro-animación.
- Panel compacto que se expande a grande o a pantalla completa.
- Preguntas sugeridas.
- Escritura tipo streaming.
- Respuestas en markdown.
- Chips de respuesta rápida.
- Captura de la lista de espera dentro del chat.
- Persona con personalidad.
- Bottom sheet en móvil.
- Accesible y con i18n.
- Conversación guardada en localStorage.
- Eventos de analítica de conversión.

**Backend:**
- Endpoint en el Worker pensado para un modelo barato de OpenRouter (clase Gemini Flash).
- Basado en el contenido del sitio, con prompt caching.
- Se queda en STUB, con el flag apagado y sin keys.

**En el PLAN:** estimar el costo por conversación y por cada 1.000 conversaciones, con los supuestos explícitos.
