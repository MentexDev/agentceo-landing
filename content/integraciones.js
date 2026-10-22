// ─────────────────────────────────────────────────────────────────────────────
// INTEGRACIONES de Agent CEO (T60) · fuente ÚNICA para la base de conocimiento del chat y para su respuesta
// determinista «¿se integra con X?» (worker/chat/integrations.js).
//
// Origen, leído en SOLO LECTURA (git show, sin checkout ni fetch) del repo CRM-AI, ramas nexo (fd51af7ab),
// origin/evolution (8f06a4e5c), origin/nube, origin/impulso, origin/b3-negocio y origin/main, 18-19 oct 2026:
//   apps/api/src/integrations/connectors/api-key-specs.catalog.ts   (catálogo maestro, idéntico en las 6 refs)
//   apps/api/src/integrations/oauth/oauth-provider-registry.ts      (conexiones con un clic)
//   apps/api/src/integrations/mcp/catalogo-mcp.ts · apps/web/src/lib/catalogoCanales.jsx · catalogoConectores.js
// + las marcas que nombra la landing (content/chat-knowledge.js · guia:integraciones). Decisión de Diego (T59):
// la landing manda y la app no se lanza sin lo prometido → todo se presenta como capacidad.
// ⛔ Fuera: nombres de la INFRAESTRUCTURA propia (no son integraciones para el usuario) y cualquier detalle
//    técnico de los catálogos (credenciales, endpoints, permisos). Solo nombres públicos de marcas.
// ─────────────────────────────────────────────────────────────────────────────

import { prefix } from '../src/i18n/meta.js'
/** Nombres que NO se anuncian aunque aparezcan en los catálogos: son infraestructura propia. */
export const INTERNAL_EXCLUDED = ['OpenRouter', 'Supabase', 'Cloudflare', 'Vertex AI']

// Etiqueta de la categoría en cada idioma (T62: + pt). Idioma nuevo = un argumento más.
const L = (es, en, pt) => ({ es, en, pt })

/** [id, etiqueta es/en, marcas]. Una marca puede llevar alias: ['Nombre', 'alias1', 'alias2']. */
export const CATEGORIES = [
  ['mensajeria', L('Mensajería', 'Messaging', 'Mensagens'), [
    ['WhatsApp Business', 'whatsapp', 'wasap', 'guasap', 'wsp', 'wpp', 'whats', 'whatsap'], 'Telegram', 'Slack', 'Discord', ['Microsoft Teams', 'teams', 'ms teams'], 'Mattermost', ['Lark', 'feishu'],
    'Twilio', 'MessageBird', 'Sinch', 'Vonage', 'Bandwidth', 'LINE', 'Viber', 'OneSignal', 'Pushover', 'ntfy', 'Pusher', 'Zulip',
  ]],
  ['email', L('Correo y email marketing', 'Email and email marketing', 'E-mail e e-mail marketing'), [
    ['Gmail', 'google mail'], 'Mailchimp', 'Klaviyo', ['Kit', 'convertkit'], 'SendGrid', 'Resend', 'Postmark', ['Brevo', 'sendinblue'], 'Loops', 'Mailgun', 'SparkPost', 'Plunk',
    'ActiveCampaign', 'Drip', 'Beehiiv',
  ]],
  ['calendario', L('Calendario y agenda', 'Calendar and scheduling', 'Calendário e agenda'), [
    ['Google Calendar', 'gcal', 'calendar', 'calendario de google'], ['Outlook Calendar', 'outlook'], 'Calendly', ['Acuity Scheduling', 'acuity'], 'SavvyCal', 'Setmore', 'Trafft', 'Zoom', ['Google Meet', 'meet'],
  ]],
  ['crm', L('CRM y ventas', 'CRM and sales', 'CRM e vendas'), [
    'Salesforce', ['HubSpot', 'hub spot'], 'Pipedrive', 'Zoho CRM', ['Microsoft Dynamics 365', 'dynamics', 'dynamics 365'], ['Close CRM', 'close.com'], 'Keap', 'Attio', 'Salesloft', 'Outreach', 'Nimble',
    'Freshsales', 'Monday Sales CRM', 'Bitrix24', 'Google Contacts', 'Nutshell', 'Affinity', 'Folk', 'Insightly', ['Kommo', 'amocrm'], ['Respond.io', 'respond io'], 'Lusha',
  ]],
  ['pagos', L('Pagos', 'Payments', 'Pagamentos'), [
    'Stripe', 'Stripe Connect', 'PayPal', 'Square', ['Mercado Pago', 'mercadopago', 'mp'], 'TrueLayer', 'Mollie', ['Checkout.com', 'checkout com'], 'Adyen', 'Razorpay', 'Conekta', 'Culqi', 'Wompi',
    'Openpay', 'Kushki', 'Affirm', 'Worldpay', 'ePayco', 'Paddle', 'Lemon Squeezy', 'FastSpring',
  ]],
  ['ecommerce', L('Tiendas online y marketplaces', 'Online stores and marketplaces', 'Lojas online e marketplaces'), [
    'Shopify', ['WooCommerce', 'woo', 'woocomerce', 'woo commerce'], ['Wix', 'wix stores'], ['Squarespace', 'squarespace commerce'], 'PrestaShop', 'BigCommerce', 'Jumpseller', ['Tiendanube', 'nuvemshop', 'tienda nube'], 'Gumroad', 'Printful',
    ['Mercado Libre', 'mercadolibre', 'meli', 'mercado libre', 'mercado livre', 'mercadolivre'], ['Amazon', 'amazon seller', 'selling partner'], 'eBay', 'Etsy', 'Magalu', 'Allegro', 'Google Merchant Center', 'Ecwid', 'VTEX', 'Sellfy', 'Mirakl',
    ['Bol.com', 'bol'], 'Trendyol', 'Zalando', 'Shopee', 'Kaufland', ['Falabella Seller Center', 'falabella', 'linio', 'dafiti'],
  ]],
  ['contabilidad', L('Contabilidad y facturación', 'Accounting and invoicing', 'Contabilidade e faturamento'), [
    ['QuickBooks', 'quickbooks online', 'qbo', 'quick books'], 'Xero', 'FreshBooks', 'Zoho Books', 'Conta Azul', 'HMRC', 'Holded', 'Xubio', 'Siigo', 'Alegra', 'Factus', 'TaxJar',
  ]],
  ['redes', L('Redes sociales', 'Social media', 'Redes sociais'), [
    ['Instagram', 'insta', 'ig'], ['Facebook', 'facebook pages', 'fb', 'face'], 'TikTok', ['YouTube', 'yt'], 'Threads', ['X (Twitter)', 'twitter', 'x'], 'LinkedIn', 'Pinterest', 'Reddit', 'Tumblr', 'Mastodon',
    'Twitch', 'Vimeo', 'Spotify', 'Buffer', 'Bluesky',
  ]],
  ['anuncios', L('Publicidad', 'Advertising', 'Publicidade'), [
    ['Meta Ads', 'facebook ads', 'instagram ads'], ['Google Ads', 'adwords'], 'TikTok Ads', 'Snapchat Ads',
  ]],
  ['almacenamiento', L('Archivos y documentos', 'Files and documents', 'Arquivos e documentos'), [
    ['Google Drive', 'drive'], ['Google Docs', 'docs'], ['Google Sheets', 'sheets', 'hojas de calculo de google'], 'Google Workspace', 'Dropbox', 'Box', 'SharePoint', ['Microsoft Excel', 'excel', 'excel 365'],
    'DocuSign', 'Dropbox Sign', 'PandaDoc',
  ]],
  ['productividad', L('Productividad y proyectos', 'Productivity and projects', 'Produtividade e projetos'), [
    'Notion', 'Linear', 'Miro', ['monday.com', 'monday'], 'Asana', 'ClickUp', 'Todoist', 'Jira', 'Confluence', 'Wrike', 'Lucidchart', 'Figma', 'Canva', 'Airtable', 'Coda', 'Fibery',
  ]],
  ['desarrollo', L('Desarrollo, webs y apps', 'Development, websites and apps', 'Desenvolvimento, sites e apps'), [
    ['GitHub', 'git hub'], 'GitLab', 'Bitbucket', 'CircleCI', 'Nx Cloud', 'Snyk', 'SonarQube', 'Postman', 'Pulumi', 'GraphQL Hive', 'LaunchDarkly', 'Cronhooks',
    ['Google Cloud', 'google cloud platform', 'gcp'], 'Google IAM', 'Azure', 'Vercel', 'Netlify', 'Heroku', 'DigitalOcean', 'Webflow', 'Railway', 'Render', 'Fly.io',
    'Sentry', 'Rollbar', 'Bugsnag', 'AppSignal', 'Datadog', 'New Relic', 'Grafana Cloud', 'Opsgenie',
    'Auth0', 'Okta', 'OneLogin', 'Kinde', 'PingOne', 'Clerk', 'WorkOS', 'Stytch', 'Descope', 'FusionAuth', 'PropelAuth', 'SuperTokens', 'Hanko',
    'Neon', 'PlanetScale', 'Turso', 'Xata', 'Astra DB', 'MongoDB', 'CouchDB', 'ClickHouse', 'Snowflake', 'Databricks', 'InfluxDB', 'Upstash', 'Convex', 'Hasura', 'Elasticsearch', 'OpenSearch',
    'Pinecone', 'Qdrant', 'Weaviate', 'Chroma', ['Milvus', 'zilliz'], 'Vectara', 'LanceDB', 'turbopuffer', 'Upstash Vector', 'Marqo',
  ]],
  ['ia', L('IA con tu propia cuenta', 'AI with your own account', 'IA com a sua própria conta'), [
    'OpenAI', 'Anthropic', ['Google AI (Gemini)', 'gemini'], 'Azure OpenAI', 'Cohere', 'Mistral AI', 'Groq', 'Perplexity', 'Together AI', 'DeepSeek', 'AI21 Labs', 'Cerebras', 'DeepInfra',
    'Fireworks AI', 'Hugging Face', 'Moonshot AI', 'NVIDIA NIM', ['Qwen', 'alibaba'], ['xAI (Grok)', 'grok'], 'Replicate', 'fal.ai', 'Ollama', 'LM Studio',
    'ElevenLabs', 'Cartesia', 'Murf AI', 'Resemble AI', 'AssemblyAI', 'Deepgram',
    'Ideogram', 'Leonardo AI', 'Stability AI', ['Flux', 'black forest labs'], 'Photoroom', 'Runway', 'Luma AI', 'Kling AI', 'Synthesia', 'Creatomate', 'Google Veo', 'D-ID',
  ]],
  ['analitica', L('Analítica y datos', 'Analytics and data', 'Análise e dados'), [
    ['Google Analytics 4', 'google analytics', 'ga4', 'analytics'], 'Looker', ['Microsoft Power BI', 'power bi'], 'Mixpanel', 'Amplitude', 'Heap', 'Matomo', 'Plausible', 'Umami', 'Microsoft Clarity',
    'FullStory', 'June', 'ChartMogul', 'Metabase', 'Segment', 'RudderStack', 'Census', 'Hightouch', 'dbt Cloud', 'Airbyte', 'Fivetran',
  ]],
  ['formularios', L('Formularios y encuestas', 'Forms and surveys', 'Formulários e pesquisas'), ['Typeform', 'Google Forms', 'SurveyMonkey', 'Jotform']],
  ['soporte', L('Atención al cliente', 'Customer support', 'Atendimento ao cliente'), ['Zendesk', 'Intercom', 'ServiceNow']],
  ['rrhh', L('Recursos humanos', 'HR', 'Recursos humanos'), ['Factorial', 'Deel', 'Ashby', 'Greenhouse', 'BambooHR', 'Rippling', 'Personio']],
  ['logistica', L('Envíos y logística', 'Shipping and logistics', 'Envios e logística'), ['Shippo', 'EasyPost']],
  ['otros', L('Imágenes, mapas, SEO y datos', 'Images, maps, SEO and data', 'Imagens, mapas, SEO e dados'), [
    'Pexels', 'Pixabay', 'Unsplash', 'Giphy', 'Iconfinder', 'Freesound', 'Google Maps', 'Mapbox', 'ScraperAPI', 'Anakin.io', 'Ahrefs', 'Semrush', 'BuzzSumo',
    'Google Search Console', 'PageSpeed Insights', 'Alpha Vantage', 'Coinbase', 'Fixer',
  ]],
]

export const fold = (s = '') => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const key = (s) => fold(s).replace(/[^a-z0-9]+/g, ' ').trim()

/** Lista plana: { name, category, label: {es, en, pt}, aliases: [claves normalizadas] }. */
export const INTEGRATIONS = CATEGORIES.flatMap(([category, label, brands]) => brands.map((b) => {
  const [name, ...extra] = Array.isArray(b) ? b : [b]
  const aliases = [...new Set([name, ...extra].flatMap((a) => [key(a), key(a).replace(/ /g, '')]).filter(Boolean))]
  return { name, category, label, aliases }
}))

export const TOTAL = INTEGRATIONS.length
export const COUNTS = Object.fromEntries(CATEGORIES.map(([id, label, brands]) => [id, { label, n: brands.length }]))

/** Fragmentos para la base de conocimiento del chat (uno por categoría), es/en. */
export function integrationChunks(lang) {
  // Sin frases repetidas («Agent CEO se conecta con…») en cada fragmento: inflaban «Agent CEO» en la búsqueda
  // BM25 y desplazaban a los fragmentos buenos (medido en tests/site/chat-heldout.test.js).
  const W = { es: 'Integraciones', en: 'Integrations', pt: 'Integrações' }
  return CATEGORIES.map(([id, label, brands]) => ({
    id: `integraciones:${id}`,
    kind: 'integracion',
    title: `${W[lang] || W.es} · ${label[lang] || label.es}`,
    text: `${brands.map((b) => (Array.isArray(b) ? b[0] : b)).join(', ')}.`,
    url: `${prefix(lang)}/`,
  }))
}
