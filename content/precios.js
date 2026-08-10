// ─────────────────────────────────────────────────────────────────────────────
// Página de PRECIOS de AgentCEO (dedicada, estilo NeuralOS).
//
// Contenido REAL de pre-lanzamiento: 2 planes (Gratis + A tu medida). NO se
// inventan tarifas — AgentCEO aún no tiene precios públicos, por eso no hay
// toggle mensual/anual ni cifras en dólares.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Precios · AgentCEO',
  eyebrow: 'Precios',
  h1: 'Empieza gratis. Crece cuando quieras.',
  sub: 'Estamos en pre-lanzamiento. Crea tu empresa y arma tu equipo de agentes sin costo; cuando tu operación crezca, pasamos a un plan a la medida de tu negocio.',
}

export const PLANS = [
  {
    name: 'Para empezar',
    price: 'Gratis',
    priceNote: 'Sin tarjeta de crédito',
    desc: 'Crea tu empresa y conversa con tu CEO Global. Ideal para arrancar.',
    features: [
      'Tu empresa y tu primera marca',
      'CEO Global que entiende tu negocio',
      'Crea tus primeros agentes',
      'Conecta tus herramientas (Shopify, WhatsApp…)',
    ],
    cta: { label: 'Únete a la lista', href: '/#waitlist', style: 'ghost' },
    featured: false,
  },
  {
    name: 'Para tu equipo',
    price: 'A tu medida',
    priceNote: 'Cuando tu operación crece',
    desc: 'Más agentes, más marcas y más automatización, con acompañamiento para montarlo todo.',
    features: [
      'Agentes ilimitados y varias marcas',
      'Automatizaciones y tareas autónomas',
      'Aprobaciones y guardrails por firma',
      'Acompañamiento para montarlo todo',
    ],
    cta: { label: 'Únete a la lista', href: '/#waitlist', style: 'primary' },
    featured: true,
    badge: 'Recomendado',
  },
]

// Banda de garantías (iconos simples inline en el generador por su `icon`).
export const GUARANTEES = [
  { icon: 'gift', text: 'Gratis para empezar' },
  { icon: 'card', text: 'Sin tarjeta de crédito' },
  { icon: 'x', text: 'Cancela cuando quieras' },
  { icon: 'lock', text: 'Tus datos son tuyos' },
]

// Tabla comparativa. `free`/`team` pueden ser true (✓), false (—) o texto.
export const COMPARE = {
  cols: ['Para empezar', 'Para tu equipo'],
  rows: [
    { label: 'Tu empresa y primera marca', free: true, team: true },
    { label: 'Marcas adicionales', free: false, team: 'Ilimitadas' },
    { label: 'CEO Global que coordina', free: true, team: true },
    { label: 'Agentes', free: 'Los primeros', team: 'Ilimitados' },
    { label: 'Conectores (Shopify, WhatsApp, Gmail…)', free: true, team: true },
    { label: 'Automatizaciones y tareas autónomas', free: false, team: true },
    { label: 'Aprobaciones y guardrails por firma', free: true, team: true },
    { label: 'Acompañamiento para montarlo', free: false, team: true },
  ],
}

export const FAQ = [
  { q: '¿Es gratis de verdad?', a: 'Sí. Creas tu empresa, hablas con tu CEO Global y armas tus primeros agentes sin poner una tarjeta. Empiezas a operar y solo creces de plan cuando lo necesites.' },
  { q: '¿Cuándo van a tener precios?', a: 'Estamos en pre-lanzamiento. El plan para equipos se ajusta a tu operación; cuando definamos tarifas públicas, quienes estén en la lista de espera serán los primeros en saberlo, con condiciones de fundador.' },
  { q: '¿Necesito tarjeta de crédito para empezar?', a: 'No. El plan para empezar no pide tarjeta. Solo la necesitarías más adelante si pasas a un plan de pago.' },
  { q: '¿Qué pasa cuando mi operación crezca?', a: 'Pasas al plan para tu equipo: agentes ilimitados, varias marcas, automatizaciones y acompañamiento para montarlo todo, a la medida de tu negocio.' },
  { q: '¿Puedo cancelar cuando quiera?', a: 'Sí. Sin permanencia ni ataduras. Tú decides cuándo empezar y cuándo parar.' },
  { q: '¿Mis datos son míos?', a: 'Sí. La información de tu negocio y la de tus agentes es tuya. Puedes exportarla o pedir que la borremos.' },
]
