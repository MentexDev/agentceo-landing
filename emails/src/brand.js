// La marca de la landing, traducida a correo. Fuente: src/styles/tokens.css (los mismos hex).
// En correo no hay variables CSS: cada color va en línea. Contraste medido en tokens.css (WCAG AA):
// --gold NUNCA como texto sobre crema; para texto dorado en claro, goldInk (5,57:1).

export const COLORS = {
  ink: '#111113',
  cream: '#F4F2ED',
  paper: '#FBFAF7',
  gold: '#B8923A',
  gold2: '#D9B866',
  gold3: '#EFE4C8',
  goldInk: '#7A5C17',
  muted: '#4E4C47',
  line: '#E2DED4',
  // Modo oscuro (Apple Mail / iOS, que respetan prefers-color-scheme): los de la landing sobre --ink.
  night: '#111113',
  nightCard: '#1D1D20',
  nightLine: '#34343A',
  nightText: '#F4F2ED',
  nightMuted: '#A9A7A0',
}

// Las fuentes web solo cargan en Apple Mail, iOS y algunos clientes; Gmail y Outlook usan el respaldo.
export const FONTS = {
  serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
  sans: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'Geist Mono', Menlo, Consolas, 'Courier New', monospace",
}

export const SITE = 'https://agentceo.io'

// Los PNG de correo viven en public/email-assets/v1/ (se publican con la landing). Carpeta VERSIONADA: si un
// dibujo cambia, va a v2/ y los correos ya enviados siguen viendo el suyo. Gmail no pinta SVG ni rutas
// relativas: en producción, SIEMPRE URL https absoluta. La base se cambia con EMAIL_ASSET_BASE_URL.
export const EMAIL_ASSET_BASE = `${SITE}/email-assets/v1`

// Cada PNG a 2× (retina) del tamaño MÁS GRANDE al que se pinta. px = lado del PNG; el test lo mide en el fichero.
//   ceo: portada 64 px (burbuja y firma, 40)  ·  agente-N: la fila del equipo, 56 px
export const EMAIL_ASSETS = {
  ceo: { file: 'ceo.png', px: 128, plate: '#F4F2ED', svg: 'agentceo-mascota.svg' },
  'ceo-noche': { file: 'ceo-noche.png', px: 128, plate: '#111113', svg: 'agentceo-mascota-clara.svg' },
  'agente-1': { file: 'agente-1.png', px: 112, plate: '#EFE4C8', svg: 'agentceo-mascota.svg' },
  'agente-2': { file: 'agente-2.png', px: 112, plate: '#F4F2ED', svg: 'agentceo-mascota.svg' },
  'agente-3': { file: 'agente-3.png', px: 112, plate: '#D9B866', svg: 'agentceo-mascota.svg' },
  'agente-4': { file: 'agente-4.png', px: 112, plate: '#E2DED4', svg: 'agentceo-mascota.svg' },
}

// Lo que una URL de imagen de correo tiene que cumplir (assets propios y avatares que llegan por datos).
export const EMAIL_IMAGE_URL = /^https:\/\/[^\s"'<>]+\.(png|jpg|gif)$/i

// Pie legal. ⛔ PROHIBIDO aquí cualquier dato del registro de la sociedad (número, fecha o estado
// donde se registró): lo vigila emails/tests/legal.test.js. La dirección postal NO vive en el repo: es
// configuración (POSTAL_ADDRESS) y render() falla sin ella. Solo la vista previa (galería) pinta este aviso.
export const COMPANY = {
  legalName: 'Klinworks, LLC',
  email: 'info@agentceo.io',
}
export const POSTAL_PLACEHOLDER = '[FALTA POSTAL_ADDRESS · dirección postal sin configurar]'

export const ROUTES = {
  home: { es: '/', en: '/en/' },
  privacy: { es: '/legal/privacidad', en: '/en/legal/privacy' },
  pricing: { es: '/precios/', en: '/en/pricing/' },
}

export const LOCALES = ['es', 'en']
