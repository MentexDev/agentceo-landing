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

// Los PNG de correo viven en public/email-assets/<versión>/ (se publican con la landing). Carpeta VERSIONADA: si
// un dibujo cambia, va a una carpeta nueva y los correos ya enviados siguen viendo el suyo. Gmail no pinta SVG ni
// rutas relativas: en producción, SIEMPRE URL https absoluta. La base se cambia con EMAIL_ASSET_BASE_URL.
//   v1 (T54) · los 4 agentes eran la misma mascota con otro fondo. INTACTA para los correos ya enviados.
//   v2 (T60b) · cada agente con su cara y su accesorio (emails/src/agent-art.js). Default de los renders nuevos.
export const EMAIL_ASSET_VERSION = 'v2'
export const EMAIL_ASSET_BASE = `${SITE}/email-assets/${EMAIL_ASSET_VERSION}`

// Cada PNG a 2× (retina) del tamaño MÁS GRANDE al que se pinta. px = lado del PNG; el test lo mide en el fichero.
//   ceo: portada 64 px (burbuja y firma, 40)  ·  agente-N: la fila del equipo, 56 px
// dark = su gemelo de modo oscuro (placa oscura, dibujo claro): cada avatar tiene el SUYO.
// svg = fichero de public/brand (la mascota) · agent = dibujo propio de agent-art.js (+ mode light/dark).
export const EMAIL_ASSETS = {
  ceo: { file: 'ceo.png', px: 128, plate: '#F4F2ED', svg: 'agentceo-mascota.svg', dark: 'ceo-noche' },
  'ceo-noche': { file: 'ceo-noche.png', px: 128, plate: '#111113', svg: 'agentceo-mascota-clara.svg' },
  'agente-1': { file: 'agente-1.png', px: 112, plate: '#EFE4C8', agent: 'director', mode: 'light', dark: 'agente-1-noche' },
  'agente-2': { file: 'agente-2.png', px: 112, plate: '#F4F2ED', agent: 'vendedor', mode: 'light', dark: 'agente-2-noche' },
  'agente-3': { file: 'agente-3.png', px: 112, plate: '#E8DCC0', agent: 'inventario', mode: 'light', dark: 'agente-3-noche' },
  'agente-4': { file: 'agente-4.png', px: 112, plate: '#E2DED4', agent: 'creador', mode: 'light', dark: 'agente-4-noche' },
  'agente-1-noche': { file: 'agente-1-noche.png', px: 112, plate: '#4A3D22', agent: 'director', mode: 'dark' },
  'agente-2-noche': { file: 'agente-2-noche.png', px: 112, plate: '#2A2A2F', agent: 'vendedor', mode: 'dark' },
  'agente-3-noche': { file: 'agente-3-noche.png', px: 112, plate: '#3D3420', agent: 'inventario', mode: 'dark' },
  'agente-4-noche': { file: 'agente-4-noche.png', px: 112, plate: '#3A3833', agent: 'creador', mode: 'dark' },
}

// Lo que una URL de imagen de correo tiene que cumplir (assets propios y avatares que llegan por datos).
export const EMAIL_IMAGE_URL = /^https:\/\/[^\s"'<>]+\.(png|jpg|gif)$/i

// Pie legal. ⛔ PROHIBIDO aquí cualquier dato del registro de la sociedad (número, fecha o estado
// donde se registró): lo vigila emails/tests/legal.test.js.
// Dirección postal (CAN-SPAM): por defecto la de la oficina, la misma que ya publica la web (CompanyView,
// jsonld.js). No es secreta (brief T54b) y Diego la aprobó para el pie (T57, cierra la pregunta de T54b). Se cambia con POSTAL_ADDRESS; vaciarla A PROPÓSITO hace fallar
// render() y el build de producción. Solo la vista previa (galería) pinta este aviso en su lugar.
export const COMPANY = {
  legalName: 'Klinworks, LLC',
  email: 'info@agentceo.io',
}
export const DEFAULT_POSTAL_ADDRESS = 'Klinworks, LLC · 131 Continental Dr, Suite 305, Newark, DE 19713, USA'
export const POSTAL_PLACEHOLDER = '[FALTA POSTAL_ADDRESS · dirección postal sin configurar]'

export const ROUTES = {
  home: { es: '/', en: '/en/', pt: '/pt/' },
  privacy: { es: '/legal/privacidad', en: '/en/legal/privacy', pt: '/pt/legal/privacidade' },
  pricing: { es: '/precios/', en: '/en/pricing/', pt: '/pt/precos/' },
}

// T62: la landing ya tiene portugués: los enlaces pt van a /pt/ (antes, T60b, a las páginas en inglés).
// = RUTAS de src/i18n/rutas.js (home, precios, legal:privacidad): tests/site/i18n-registros.test.js lo exige.
export const LOCALES = ['es', 'en', 'pt']
