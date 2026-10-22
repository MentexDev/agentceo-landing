// ─────────────────────────────────────────────────────────────────────────────
// PREÇOS (pt-BR) · Agent CEO
//
// Tradução para português do Brasil de content/precios.js. Mesma forma e mesmos
// exports que content/en/precios.js; ids, preços, créditos, assentos e flags são
// idênticos. Os nomes de planos e pacotes NÃO se traduzem.
// Nada aqui pode dizer mais do que diz a fonte em espanhol.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Preços · Agent CEO',
  eyebrow: 'Preços',
  h1: 'Comece grátis. Cresça quando quiser.',
  sub: 'Todo plano vem com créditos que se renovam toda segunda-feira e agentes sem limite. Comece com o Arranque, sem cartão, e mude de plano quando a sua operação crescer.',
}

export const PRICES_PENDING = false
export const CURRENCY = 'USD'

/** O que TODOS os planos incluem. */
export const ALL_PLANS = [
  'Agentes sem limite',
  'Os créditos se renovam toda segunda-feira',
  'Histórico de 30 dias',
]

// `credits` = créditos por semana; `seats` = pessoas (null = sem limite).
export const PLANS = [
  {
    id: 'arranque',
    name: 'Arranque',
    price: 0,
    period: 'mês',
    credits: 300,
    seats: 1,
    desc: 'Para conhecer a sua equipe de IA sem precisar de cartão.',
    features: ['**300 créditos** por semana', '1 usuário', 'Sem cartão de crédito'],
    cta: { label: 'Entre na lista' },
    featured: false,
  },
  {
    id: 'impulso',
    name: 'Impulso',
    price: 29,
    period: 'mês',
    credits: 2300,
    seats: 5,
    features: ['**2.300 créditos** por semana', 'Até 5 pessoas'],
    cta: { label: 'Entre na lista' },
    featured: true,
    badge: 'Recomendado',
  },
  {
    id: 'motor',
    name: 'Motor',
    price: 99,
    period: 'mês',
    credits: 40000,
    seats: 20,
    features: ['**40.000 créditos** por semana', 'Até 20 pessoas'],
    cta: { label: 'Entre na lista' },
    featured: false,
  },
  {
    id: 'imperio',
    name: 'Imperio',
    price: 249,
    period: 'mês',
    credits: 200000,
    seats: null,
    features: ['**200.000 créditos** por semana', 'Pessoas sem limite'],
    cta: { label: 'Entre na lista' },
    featured: false,
  },
]

/** Pacotes de créditos: pagamento único, para quando você precisar de mais naquela semana. */
export const PACKS = [
  { id: 'chispa', name: 'Chispa', credits: 1000, price: 5, featured: false },
  { id: 'envion', name: 'Envión', credits: 3000, price: 12, featured: true },
  { id: 'turbina', name: 'Turbina', credits: 8000, price: 29, featured: false },
  { id: 'reserva', name: 'Reserva', credits: 20000, price: 65, featured: false, noExpiry: true },
]

// Faixa de garantias: só o que os dados acima e os Termos sustentam.
export const GUARANTEES = [
  { icon: 'gift', text: 'O Arranque é grátis' },
  { icon: 'card', text: 'Sem cartão para começar' },
  { icon: 'x', text: 'Agentes sem limite' },
  { icon: 'lock', text: 'Seus dados são seus' },
]

export const FAQ = [
  { q: 'É grátis mesmo?', a: 'Sim. O plano Arranque custa US$ 0: vem com 300 créditos por semana para 1 usuário e não pede cartão.' },
  { q: 'O que acontece se meus créditos acabarem?', a: 'Seus agentes param até os créditos se renovarem (toda segunda-feira) ou até você comprar um pacote de créditos: Chispa, Envión, Turbina ou Reserva. Não há cobranças automáticas por uso excedente.' },
  { q: 'Quando os créditos se renovam?', a: 'Toda segunda-feira, em todos os planos. Os créditos semanais que você não usou expiram nessa segunda-feira: eles não se acumulam.' },
  { q: 'Posso pedir reembolso?', a: 'Sim, nestes casos: na sua primeira assinatura, em até 7 dias se você usou menos de 10% dos créditos; os pacotes Chispa, Envión e Turbina, em até 14 dias se você não os usou; e erros de cobrança, sempre. Os planos pagos se renovam automaticamente todo mês até você cancelar. Detalhes em Reembolsos e cancelamento.' },
  { q: 'Existe limite de agentes?', a: 'Não. Todos os planos, inclusive o Arranque, têm agentes sem limite. O que muda entre os planos são os créditos por semana e quantas pessoas da sua equipe podem entrar.' },
  { q: 'Preciso de cartão de crédito para começar?', a: 'Não. O Arranque não pede cartão. Você só precisa de um se passar para um plano pago ou comprar um pacote de créditos.' },
  { q: 'Meus dados são meus?', a: 'Sim. As informações do seu negócio e as dos seus agentes pertencem a você. Você pode exportá-las ou pedir que a gente as apague.' },
]
