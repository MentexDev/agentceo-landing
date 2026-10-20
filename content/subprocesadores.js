// ─────────────────────────────────────────────────────────────────────────────
// SUBPROCESADORES de Klinworks, LLC para Agent CEO. FUENTE ÚNICA de la tabla que muestran
// /legal/privacidad (§5), /legal/subprocesadores y el DPA.
// Lista del brief (§7) depurada por Diego (2026-10-20, «Datos reales»): se QUITAN PostHog,
// Sentry y Plausible (no hay analítica ni monitorización de errores de terceros). Revisado en
// solo lectura CRM-AI-evolution: Sentry solo aparece como CONECTOR que el cliente enlaza con su
// propia cuenta y como palabra del dictado; ningún SDK inicializado (ver docs/DUDAS.md).
// ⏳ Razón social exacta y región de tratamiento de cada proveedor: [PENDIENTE verificar con
//    sus contratos/DPA] (ver docs/LEGAL-CHECKLIST.md). No se inventan entidades.
// ─────────────────────────────────────────────────────────────────────────────
const us = { es: 'Estados Unidos', en: 'United States' }

export const SUBPROCESSORS = [
  { name: 'Cloudflare', purpose: { es: 'Alojamiento de esta web, red de distribución, protección y base de datos de la lista de espera', en: 'Hosting of this website, delivery network, protection and the waitlist database' }, location: { es: 'Global (red distribuida)', en: 'Global (distributed network)' } },
  { name: 'Supabase', purpose: { es: 'Base de datos, autenticación y almacenamiento de la app', en: 'App database, authentication and storage' }, location: us },
  { name: 'Stripe', purpose: { es: 'Procesamiento de pagos', en: 'Payment processing' }, location: us },
  { name: 'Resend', purpose: { es: 'Envío de correos transaccionales (remitente agentceo.io)', en: 'Transactional email delivery (sender agentceo.io)' }, location: us },
  { name: 'OpenRouter', purpose: { es: 'Enrutado de peticiones a los modelos de lenguaje que ejecutan los agentes', en: 'Routing requests to the language models that run the agents' }, location: us },
  { name: 'OpenAI', purpose: { es: 'Modelos de lenguaje', en: 'Language models' }, location: us },
  { name: 'Google (Gemini)', purpose: { es: 'Modelos de lenguaje', en: 'Language models' }, location: us },
  { name: 'Anthropic', purpose: { es: 'Modelos de lenguaje', en: 'Language models' }, location: us },
  { name: 'xAI', purpose: { es: 'Modelos de lenguaje', en: 'Language models' }, location: us },
  { name: 'Deepgram', purpose: { es: 'Transcripción de voz a texto', en: 'Speech-to-text transcription' }, location: us },
  { name: 'ElevenLabs', purpose: { es: 'Síntesis de voz', en: 'Voice synthesis' }, location: { es: 'Estados Unidos / Unión Europea [PENDIENTE verificar]', en: 'United States / European Union [PENDIENTE verify]' } },
  { name: 'Meta (WhatsApp Business Platform)', purpose: { es: 'Mensajería de WhatsApp que tus agentes usan con tus clientes', en: 'WhatsApp messaging your agents use with your customers' }, location: { es: 'Estados Unidos / Unión Europea [PENDIENTE verificar]', en: 'United States / European Union [PENDIENTE verify]' } },
]
