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

// Pie legal. ⛔ PROHIBIDO aquí cualquier dato del registro de la sociedad (número, fecha o estado
// donde se registró): lo vigila emails/tests/legal.test.js. La dirección postal no está en el repo
// (las páginas legales solo tienen la oficina registrada, que no sirve): placeholder honesto.
export const COMPANY = {
  legalName: 'Klinworks, LLC',
  postalAddress: '{{POSTAL_ADDRESS}}',
  email: 'info@agentceo.io',
}

export const ROUTES = {
  home: { es: '/', en: '/en/' },
  privacy: { es: '/legal/privacidad', en: '/en/legal/privacy' },
  pricing: { es: '/precios/', en: '/en/pricing/' },
}

export const LOCALES = ['es', 'en']
