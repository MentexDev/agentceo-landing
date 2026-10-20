// ─────────────────────────────────────────────────────────────────────────────
// PRECIOS de Agent CEO = los de la app.
//
// Fuente: mensaje de Luca/Diego del 2026-10-20 («Datos reales»). Solo se publica lo que
// ese mensaje dice; NADA inventado (ni funciones por plan, ni descuentos anuales).
//   · Planes (por mes): Arranque $0 · Impulso $29 (destacado) · Motor $99 · Imperio $249.
//   · Todos: agentes sin límite; los créditos se renuevan cada lunes; historial de 30 días.
//   · Paquetes de créditos (pago único): Chispa · Envión (destacado) · Turbina · Reserva (no caduca).
// ⏳ Moneda: se muestra en USD (Klinworks, LLC es una sociedad de EE. UU.) — ver docs/DUDAS.md.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Precios · Agent CEO',
  eyebrow: 'Precios',
  h1: 'Empieza gratis. Crece cuando quieras.',
  sub: 'Cada plan trae créditos que se renuevan cada lunes y agentes sin límite. Empieza con Arranque, sin tarjeta, y sube de plan cuando tu operación crezca.',
}

export const PRICES_PENDING = false
export const CURRENCY = 'USD'

/** Lo que incluyen TODOS los planes (del mensaje «Datos reales»). */
export const ALL_PLANS = [
  'Agentes sin límite',
  'Los créditos se renuevan cada lunes',
  'Historial de 30 días',
]

// `credits` = créditos por semana; `seats` = personas (null = sin límite).
export const PLANS = [
  {
    id: 'arranque',
    name: 'Arranque',
    price: 0,
    period: 'mes',
    credits: 300,
    seats: 1,
    desc: 'Para conocer a tu equipo de IA sin poner una tarjeta.',
    features: ['**300 créditos** por semana', '1 usuario', 'Sin tarjeta de crédito'],
    cta: { label: 'Únete a la lista' },
    featured: false,
  },
  {
    id: 'impulso',
    name: 'Impulso',
    price: 29,
    period: 'mes',
    credits: 2300,
    seats: 5,
    features: ['**2.300 créditos** por semana', 'Hasta 5 personas'],
    cta: { label: 'Únete a la lista' },
    featured: true,
    badge: 'Recomendado',
  },
  {
    id: 'motor',
    name: 'Motor',
    price: 99,
    period: 'mes',
    credits: 40000,
    seats: 20,
    features: ['**40.000 créditos** por semana', 'Hasta 20 personas'],
    cta: { label: 'Únete a la lista' },
    featured: false,
  },
  {
    id: 'imperio',
    name: 'Imperio',
    price: 249,
    period: 'mes',
    credits: 200000,
    seats: null,
    features: ['**200.000 créditos** por semana', 'Personas sin límite'],
    cta: { label: 'Únete a la lista' },
    featured: false,
  },
]

/** Paquetes de créditos: pago único, para cuando necesitas más esa semana. */
export const PACKS = [
  { id: 'chispa', name: 'Chispa', credits: 1000, price: 5, featured: false },
  { id: 'envion', name: 'Envión', credits: 3000, price: 12, featured: true },
  { id: 'turbina', name: 'Turbina', credits: 8000, price: 29, featured: false },
  { id: 'reserva', name: 'Reserva', credits: 20000, price: 65, featured: false, noExpiry: true },
]

// Banda de garantías: solo lo que respaldan los datos de arriba y los Términos.
export const GUARANTEES = [
  { icon: 'gift', text: 'Arranque es gratis' },
  { icon: 'card', text: 'Sin tarjeta para empezar' },
  { icon: 'x', text: 'Agentes sin límite' },
  { icon: 'lock', text: 'Tus datos son tuyos' },
]

export const FAQ = [
  { q: '¿Es gratis de verdad?', a: 'Sí. El plan Arranque cuesta $0: trae 300 créditos por semana para 1 usuario y no pide tarjeta.' },
  { q: '¿Qué pasa si me quedo sin créditos?', a: 'Tus agentes se detienen hasta que se renueven (cada lunes) o hasta que compres un paquete de créditos: Chispa, Envión, Turbina o Reserva. No hay cobros automáticos por exceso.' },
  { q: '¿Cuándo se renuevan los créditos?', a: 'Cada lunes, en todos los planes. Los créditos semanales que no usaste expiran ese lunes: no se acumulan.' },
  { q: '¿Puedo pedir un reembolso?', a: 'Sí, en estos casos: en tu primera suscripción, dentro de 7 días si usaste menos del 10 % de los créditos; los paquetes Chispa, Envión y Turbina, dentro de 14 días si no los usaste; y siempre los errores de facturación. Los planes de pago se renuevan automáticamente cada mes hasta que canceles. Detalles en Reembolsos y cancelación.' },
  { q: '¿Hay límite de agentes?', a: 'No. Todos los planes, incluido Arranque, tienen agentes sin límite. Lo que cambia entre planes son los créditos por semana y cuántas personas de tu equipo pueden entrar.' },
  { q: '¿Necesito tarjeta de crédito para empezar?', a: 'No. Arranque no pide tarjeta. Solo la necesitas si pasas a un plan de pago o compras un paquete de créditos.' },
  { q: '¿Mis datos son míos?', a: 'Sí. La información de tu negocio y la de tus agentes es tuya. Puedes exportarla o pedir que la borremos.' },
]
