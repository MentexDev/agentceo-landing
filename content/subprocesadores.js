// ─────────────────────────────────────────────────────────────────────────────
// SUBPROCESADORES de Klinworks, LLC para Agent CEO. FUENTE ÚNICA de la tabla que muestran
// /legal/privacidad (§5), /legal/subprocesadores y el DPA.
// Lista del brief (§7, «todos los subprocesadores reales») + estado conocido:
//   · Analítica: Diego confirmó (2026-10-20) que NO hay analítica activa → PostHog y
//     Plausible figuran como «No activo».
// ⏳ Razón social exacta y región de tratamiento de cada proveedor: [PENDIENTE verificar con
//    sus contratos/DPA] (ver docs/LEGAL-CHECKLIST.md). No se inventan entidades.
// ─────────────────────────────────────────────────────────────────────────────
const active = { es: 'Activo', en: 'Active' }
const inactive = { es: 'No activo (no se usa analítica)', en: 'Not active (no analytics in use)' }
const us = { es: 'Estados Unidos', en: 'United States' }

export const SUBPROCESSORS = [
  { name: 'Cloudflare', purpose: { es: 'Alojamiento de esta web, red de distribución, protección y base de datos de la lista de espera', en: 'Hosting of this website, delivery network, protection and the waitlist database' }, location: { es: 'Global (red distribuida)', en: 'Global (distributed network)' }, status: active },
  { name: 'Supabase', purpose: { es: 'Base de datos, autenticación y almacenamiento de la app', en: 'App database, authentication and storage' }, location: us, status: active },
  { name: 'Stripe', purpose: { es: 'Procesamiento de pagos', en: 'Payment processing' }, location: us, status: active },
  { name: 'Resend', purpose: { es: 'Envío de correos transaccionales (remitente agentceo.io)', en: 'Transactional email delivery (sender agentceo.io)' }, location: us, status: active },
  { name: 'Sentry', purpose: { es: 'Detección y diagnóstico de errores', en: 'Error detection and diagnostics' }, location: us, status: active },
  { name: 'OpenRouter', purpose: { es: 'Enrutado de peticiones a los modelos de lenguaje que ejecutan los agentes', en: 'Routing requests to the language models that run the agents' }, location: us, status: active },
  { name: 'OpenAI', purpose: { es: 'Modelos de lenguaje', en: 'Language models' }, location: us, status: active },
  { name: 'Google (Gemini)', purpose: { es: 'Modelos de lenguaje', en: 'Language models' }, location: us, status: active },
  { name: 'Anthropic', purpose: { es: 'Modelos de lenguaje', en: 'Language models' }, location: us, status: active },
  { name: 'xAI', purpose: { es: 'Modelos de lenguaje', en: 'Language models' }, location: us, status: active },
  { name: 'Deepgram', purpose: { es: 'Transcripción de voz a texto', en: 'Speech-to-text transcription' }, location: us, status: active },
  { name: 'ElevenLabs', purpose: { es: 'Síntesis de voz', en: 'Voice synthesis' }, location: { es: 'Estados Unidos / Unión Europea [PENDIENTE verificar]', en: 'United States / European Union [PENDIENTE verify]' }, status: active },
  { name: 'Meta (WhatsApp Business Platform)', purpose: { es: 'Mensajería de WhatsApp que tus agentes usan con tus clientes', en: 'WhatsApp messaging your agents use with your customers' }, location: { es: 'Estados Unidos / Unión Europea [PENDIENTE verificar]', en: 'United States / European Union [PENDIENTE verify]' }, status: active },
  { name: 'PostHog', purpose: { es: 'Analítica de producto', en: 'Product analytics' }, location: { es: 'Estados Unidos / Unión Europea', en: 'United States / European Union' }, status: inactive },
  { name: 'Plausible', purpose: { es: 'Analítica web sin cookies', en: 'Cookieless web analytics' }, location: { es: 'Unión Europea', en: 'European Union' }, status: inactive },
]
