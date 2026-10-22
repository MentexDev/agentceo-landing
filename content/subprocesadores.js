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
const us = { es: 'Estados Unidos', en: 'United States', pt: 'Estados Unidos' }

export const SUBPROCESSORS = [
  { name: 'Cloudflare', purpose: { es: 'Alojamiento de esta web, red de distribución, protección y base de datos de la lista de espera', en: 'Hosting of this website, delivery network, protection and the waitlist database', pt: 'Hospedagem deste site, rede de distribuição, proteção e banco de dados da lista de espera' }, location: { es: 'Global (red distribuida)', en: 'Global (distributed network)', pt: 'Global (rede distribuída)' } },
  { name: 'Supabase', purpose: { es: 'Base de datos, autenticación y almacenamiento de la app', en: 'App database, authentication and storage', pt: 'Banco de dados, autenticação e armazenamento do app' }, location: us },
  { name: 'Stripe', purpose: { es: 'Procesamiento de pagos', en: 'Payment processing', pt: 'Processamento de pagamentos' }, location: us },
  { name: 'Resend', purpose: { es: 'Envío de correos transaccionales (remitente agentceo.io)', en: 'Transactional email delivery (sender agentceo.io)', pt: 'Envio de e-mails transacionais (remetente agentceo.io)' }, location: us },
  { name: 'OpenRouter', purpose: { es: 'Enrutado de peticiones a los modelos de lenguaje que ejecutan los agentes', en: 'Routing requests to the language models that run the agents', pt: 'Encaminhamento de solicitações aos modelos de linguagem que executam os agentes' }, location: us },
  { name: 'OpenAI', purpose: { es: 'Modelos de lenguaje', en: 'Language models', pt: 'Modelos de linguagem' }, location: us },
  { name: 'Google (Gemini)', purpose: { es: 'Modelos de lenguaje', en: 'Language models', pt: 'Modelos de linguagem' }, location: us },
  { name: 'Anthropic', purpose: { es: 'Modelos de lenguaje', en: 'Language models', pt: 'Modelos de linguagem' }, location: us },
  { name: 'xAI', purpose: { es: 'Modelos de lenguaje', en: 'Language models', pt: 'Modelos de linguagem' }, location: us },
  { name: 'Deepgram', purpose: { es: 'Transcripción de voz a texto', en: 'Speech-to-text transcription', pt: 'Transcrição de voz para texto' }, location: us },
  { name: 'ElevenLabs', purpose: { es: 'Síntesis de voz', en: 'Voice synthesis', pt: 'Síntese de voz' }, location: { es: 'Estados Unidos / Unión Europea [PENDIENTE verificar]', en: 'United States / European Union [PENDIENTE verify]', pt: 'Estados Unidos / União Europeia [PENDIENTE verificar]' } },
  { name: 'Meta (WhatsApp Business Platform)', purpose: { es: 'Mensajería de WhatsApp que tus agentes usan con tus clientes', en: 'WhatsApp messaging your agents use with your customers', pt: 'Mensagens de WhatsApp que seus agentes usam com seus clientes' }, location: { es: 'Estados Unidos / Unión Europea [PENDIENTE verificar]', en: 'United States / European Union [PENDIENTE verify]', pt: 'Estados Unidos / União Europeia [PENDIENTE verificar]' } },
]
