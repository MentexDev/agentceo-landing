// ─────────────────────────────────────────────────────────────────────────────
// PRICING (en-US) · Agent CEO
//
// English translation of content/precios.js. Same shape and exports; ids, prices,
// credits, seats and flags are identical. Plan and pack names are NOT translated.
// Nothing here may say more than the Spanish source says.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Pricing · Agent CEO',
  eyebrow: 'Pricing',
  h1: 'Start free. Grow whenever you want.',
  sub: 'Every plan comes with credits that renew every Monday and unlimited agents. Start with Arranque, no card needed, and move up a plan when your operation grows.',
}

export const PRICES_PENDING = false
export const CURRENCY = 'USD'

/** What ALL plans include. */
export const ALL_PLANS = [
  'Unlimited agents',
  'Credits renew every Monday',
  '30-day history',
]

// `credits` = credits per week; `seats` = people (null = unlimited).
export const PLANS = [
  {
    id: 'arranque',
    name: 'Arranque',
    price: 0,
    period: 'month',
    credits: 300,
    seats: 1,
    desc: 'Get to know your AI team without putting down a card.',
    features: ['**300 credits** per week', '1 user', 'No credit card'],
    cta: { label: 'Join the waitlist' },
    featured: false,
  },
  {
    id: 'impulso',
    name: 'Impulso',
    price: 29,
    period: 'month',
    credits: 2300,
    seats: 5,
    features: ['**2,300 credits** per week', 'Up to 5 people'],
    cta: { label: 'Join the waitlist' },
    featured: true,
    badge: 'Recommended',
  },
  {
    id: 'motor',
    name: 'Motor',
    price: 99,
    period: 'month',
    credits: 40000,
    seats: 20,
    features: ['**40,000 credits** per week', 'Up to 20 people'],
    cta: { label: 'Join the waitlist' },
    featured: false,
  },
  {
    id: 'imperio',
    name: 'Imperio',
    price: 249,
    period: 'month',
    credits: 200000,
    seats: null,
    features: ['**200,000 credits** per week', 'Unlimited people'],
    cta: { label: 'Join the waitlist' },
    featured: false,
  },
]

/** Credit packs: one-time payment, for when you need more that week. */
export const PACKS = [
  { id: 'chispa', name: 'Chispa', credits: 1000, price: 5, featured: false },
  { id: 'envion', name: 'Envión', credits: 3000, price: 12, featured: true },
  { id: 'turbina', name: 'Turbina', credits: 8000, price: 29, featured: false },
  { id: 'reserva', name: 'Reserva', credits: 20000, price: 65, featured: false, noExpiry: true },
]

// Guarantees band: only what the data above and the Terms back up.
export const GUARANTEES = [
  { icon: 'gift', text: 'Arranque is free' },
  { icon: 'card', text: 'No card to get started' },
  { icon: 'x', text: 'Unlimited agents' },
  { icon: 'lock', text: 'Your data is yours' },
]

export const FAQ = [
  { q: 'Is it really free?', a: 'Yes. The Arranque plan costs $0: it comes with 300 credits per week for 1 user and doesn’t ask for a card.' },
  { q: 'What happens if I run out of credits?', a: 'Your agents pause until your credits renew (every Monday) or until you buy a credit pack: Chispa, Envión, Turbina or Reserva. There are no automatic overage charges.' },
  { q: 'When do credits renew?', a: 'Every Monday, on every plan. Weekly credits you didn’t use expire that Monday: they don’t roll over.' },
  { q: 'Can I get a refund?', a: 'Yes, in these cases: on your first subscription, within 7 days if you used less than 10% of the credits; the Chispa, Envión and Turbina packs, within 14 days if you haven’t used them; and billing errors, always. Paid plans renew automatically every month until you cancel. Details in Refunds and cancellation.' },
  { q: 'Is there a limit on agents?', a: 'No. Every plan, including Arranque, has unlimited agents. What changes between plans is the number of credits per week and how many people on your team can sign in.' },
  { q: 'Do I need a credit card to get started?', a: 'No. Arranque doesn’t ask for a card. You only need one if you move to a paid plan or buy a credit pack.' },
  { q: 'Is my data mine?', a: 'Yes. Your business information and your agents’ information belong to you. You can export it or ask us to delete it.' },
]
