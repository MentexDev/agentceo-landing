// FASE B · créditos y facturación. Planes, créditos y paquetes salen de content/precios.js (los reales de la
// landing): ningún precio se escribe a mano aquí. Los créditos se renuevan cada lunes (dato de la landing).
import { Layout, Header, Hero, Em, P, Block, CTA, Bubble, Tip, Steps, Facts, Meter, Note, Signature, Footer } from '../components.jsx'
import { fmtShort, fmtDate, money, num, lead, tr } from '../format.js'
import { PLANS as PLANS_ES, PACKS as PACKS_ES } from '../../../content/precios.js'
import { PLANS as PLANS_EN, PACKS as PACKS_EN } from '../../../content/en/precios.js'

// pt-BR: la landing no tiene precios en portugués → los de inglés (mismos nombres y precios en USD).
const PLANS = { es: PLANS_ES, en: PLANS_EN, pt: PLANS_EN }
const PACKS = { es: PACKS_ES, en: PACKS_EN, pt: PACKS_EN }
export const planOf = (locale, id) => {
  const p = PLANS[locale].find((x) => x.id === id)
  if (!p) throw new Error(`Plan desconocido: ${id}`)
  return p
}
const seats = (locale, p) => (p.seats == null ? tr(locale, 'sin límite', 'unlimited', 'sem limite') : num(locale, p.seats))
const sampleName = (locale) => tr(locale, 'Ana', 'Sam', 'Ana')
const monday = (locale, iso) => fmtDate(locale, iso, { weekday: 'long', day: 'numeric', month: 'long' })
/** pt: «na segunda-feira, 23 de novembro» / «no sábado, …» (sábado y domingo son masculinos). */
const onDay = (iso) => {
  const s = monday('pt', iso)
  return `${/^(sábado|domingo)/.test(s) ? 'no' : 'na'} ${s}`
}

// ── B6 · Créditos bajos ─────────────────────────────────────────────────────────────────────────────
export const creditsLow = {
  id: 'credits-low',
  phase: 'B',
  kind: 'transactional',
  tone: 'edición',
  title: { es: 'Créditos bajos', en: 'Credits running low', pt: 'Créditos acabando' },
  when: 'Al llegar al 80\u00a0% de los créditos de la semana. Una sola vez por semana, a quien administra la cuenta.',
  required: ['usedPct', 'renewsOn', 'packsUrl'],
  sample: (locale) => ({
    name: sampleName(locale), usedPct: 80, renewsOn: '2026-11-23T00:00:00Z', packsUrl: 'https://app.agentceo.io/creditos', sentAt: '2026-11-20T15:00:00Z',
    top: tr(locale,
      [{ agent: 'Vendedor de WhatsApp', pct: 46, text: 'Respondió 212 chats' }, { agent: 'Creador de contenido', pct: 31, text: 'Preparó 9 posts' }],
      [{ agent: 'WhatsApp seller', pct: 46, text: 'Answered 212 chats' }, { agent: 'Content creator', pct: 31, text: 'Prepared 9 posts' }],
      [{ agent: 'Vendedor de WhatsApp', pct: 46, text: 'Respondeu 212 conversas' }, { agent: 'Criador de conteúdo', pct: 31, text: 'Preparou 9 posts' }]),
  }),
  copy: {
    es: (d) => ({
      subject: lead(d.name, `Te queda el ${100 - d.usedPct}\u00a0% de los créditos de esta semana`),
      preheader: `Se renuevan el ${monday('es', d.renewsOn)}. Si no quieres esperar, un paquete lo resuelve al momento.`,
      label: 'Tus créditos',
      title: <>Tu equipo <Em>trabajó mucho.</Em></>,
      lead: `Esta semana ya usaron el ${d.usedPct}\u00a0% de los créditos. Se renuevan solos el ${monday('es', d.renewsOn)}.`,
      meter: 'Créditos de esta semana',
      meterSub: `${d.usedPct}\u00a0% usado · ${100 - d.usedPct}\u00a0% disponible`,
      top: 'Quién gastó más',
      tipTitle: 'Gasta mejor',
      tip: 'Mira qué le pediste más de una vez esta semana: lo que se repite suele quedar mejor como automatización, que se enciende con un botón.',
      cta: 'Ver paquetes de créditos',
      ctaNote: 'El paquete Reserva no caduca: lo que no uses, se queda.',
      reason: 'Recibes este aviso porque administras una cuenta de Agent CEO. Llega como mucho una vez por semana.',
    }),
    en: (d) => ({
      subject: lead(d.name, `You have ${100 - d.usedPct}% of this week’s credits left`),
      preheader: `They renew on ${monday('en', d.renewsOn)}. If you’d rather not wait, a credit pack sorts it out right away.`,
      label: 'Your credits',
      title: <>Your team <Em>has been busy.</Em></>,
      lead: `They’ve already used ${d.usedPct}% of this week’s credits. They renew automatically on ${monday('en', d.renewsOn)}.`,
      meter: 'This week’s credits',
      meterSub: `${d.usedPct}% used · ${100 - d.usedPct}% left`,
      top: 'Who used the most',
      tipTitle: 'Spend smarter',
      tip: 'Look at what you asked for more than once this week: anything that repeats usually works better as an automation, which you turn on with one tap.',
      cta: 'See credit packs',
      ctaNote: 'The Reserva pack never expires: whatever you don’t use stays.',
      reason: 'You got this alert because you manage an Agent CEO account. It arrives at most once a week.',
    }),
    pt: (d) => ({
      subject: lead(d.name, `Você ainda tem ${100 - d.usedPct}% dos créditos desta semana`),
      preheader: `Eles se renovam ${onDay(d.renewsOn)}. Se não quiser esperar, um pacote resolve na hora.`,
      label: 'Seus créditos',
      title: <>Sua equipe <Em>trabalhou muito.</Em></>,
      lead: `Esta semana eles já usaram ${d.usedPct}% dos créditos. Eles se renovam sozinhos ${onDay(d.renewsOn)}.`,
      meter: 'Créditos desta semana',
      meterSub: `${d.usedPct}% usado · ${100 - d.usedPct}% disponível`,
      top: 'Quem gastou mais',
      tipTitle: 'Gaste melhor',
      tip: 'Veja o que você pediu mais de uma vez esta semana: o que se repete costuma funcionar melhor como automação, que liga com um botão.',
      cta: 'Ver pacotes de créditos',
      ctaNote: 'O pacote Reserva não expira: o que você não usar, fica.',
      reason: 'Você recebeu este aviso porque administra uma conta do Agent CEO. Ele chega no máximo uma vez por semana.',
    }),
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} title={c.title} lead={c.lead} />
      <Meter pct={d.usedPct} label={c.meter} sub={c.meterSub} />
      {d.top?.length > 0 && <Steps title={c.top} items={d.top.map((x) => ({ title: `${x.agent} · ${x.pct}\u00a0%`, text: x.text }))} />}
      <Tip ctx={ctx} title={c.tipTitle}>{c.tip}</Tip>
      <CTA href={d.packsUrl} note={c.ctaNote}>{c.cta}</CTA>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} preferencesUrl={d.preferencesUrl} />
    </Layout>
  ),
}

// ── B7 · Créditos agotados ──────────────────────────────────────────────────────────────────────────
export const creditsOut = {
  id: 'credits-out',
  phase: 'B',
  kind: 'transactional',
  tone: 'sobrio',
  title: { es: 'Créditos agotados', en: 'Out of credits', pt: 'Créditos esgotados' },
  when: 'Al gastar el 100\u00a0% de los créditos de la semana. Una vez por semana; sustituye al de créditos bajos si llegan el mismo día.',
  required: ['renewsOn', 'packsUrl', 'plan'],
  sample: (locale) => ({ name: sampleName(locale), plan: 'impulso', renewsOn: '2026-11-23T00:00:00Z', packsUrl: 'https://app.agentceo.io/creditos', sentAt: '2026-11-21T19:30:00Z' }),
  copy: {
    es: (d) => {
      const next = PLANS.es[PLANS.es.findIndex((p) => p.id === d.plan) + 1]
      return {
        subject: lead(d.name, 'Tu equipo se quedó sin créditos hasta el lunes'),
        preheader: `Vuelven el ${monday('es', d.renewsOn)}, o ahora mismo con un paquete de créditos.`,
        label: 'Tus créditos',
        title: <>Sin créditos <Em>hasta el lunes.</Em></>,
        lead: `Tu equipo usó todos los créditos de esta semana. Se renuevan el ${monday('es', d.renewsOn)}; si no quieres esperar, añade un paquete y siguen ahora mismo.`,
        packs: PACKS.es.map((p) => [p.name, `${num('es', p.credits)} créditos · ${money('es', p.price)}${p.noExpiry ? ' · no caduca' : ''}`]),
        cta: 'Añadir créditos',
        tip: next ? `Si te pasa seguido, el plan ${next.name} trae ${num('es', next.credits)} créditos cada semana (${money('es', next.price)} al mes).` : null,
        reason: 'Recibes este aviso porque administras una cuenta de Agent CEO.',
      }
    },
    en: (d) => {
      const next = PLANS.en[PLANS.en.findIndex((p) => p.id === d.plan) + 1]
      return {
        subject: lead(d.name, 'Your team is out of credits until Monday'),
        preheader: `They’re back on ${monday('en', d.renewsOn)}, or right now with a credit pack.`,
        label: 'Your credits',
        title: <>Out of credits <Em>until Monday.</Em></>,
        lead: `Your team used all of this week’s credits. They renew on ${monday('en', d.renewsOn)}; if you’d rather not wait, add a pack and they keep going right now.`,
        packs: PACKS.en.map((p) => [p.name, `${num('en', p.credits)} credits · ${money('en', p.price)}${p.noExpiry ? ' · never expires' : ''}`]),
        cta: 'Add credits',
        tip: next ? `If this keeps happening, the ${next.name} plan comes with ${num('en', next.credits)} credits every week (${money('en', next.price)} a month).` : null,
        reason: 'You got this alert because you manage an Agent CEO account.',
      }
    },
    pt: (d) => {
      const next = PLANS.pt[PLANS.pt.findIndex((p) => p.id === d.plan) + 1]
      return {
        subject: lead(d.name, 'Sua equipe ficou sem créditos até segunda'),
        preheader: `Eles voltam ${onDay(d.renewsOn)}, ou agora mesmo com um pacote de créditos.`,
        label: 'Seus créditos',
        title: <>Sem créditos <Em>até segunda.</Em></>,
        lead: `Sua equipe usou todos os créditos desta semana. Eles se renovam ${onDay(d.renewsOn)}; se não quiser esperar, adicione um pacote e eles continuam agora mesmo.`,
        packs: PACKS.pt.map((p) => [p.name, `${num('pt', p.credits)} créditos · ${money('pt', p.price)}${p.noExpiry ? ' · não expira' : ''}`]),
        cta: 'Adicionar créditos',
        tip: next ? `Se isso acontece com frequência, o plano ${next.name} traz ${num('pt', next.credits)} créditos toda semana (${money('pt', next.price)} por mês).` : null,
        reason: 'Você recebeu este aviso porque administra uma conta do Agent CEO.',
      }
    },
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} title={c.title} lead={c.lead} />
      <Meter pct={100} label={tr(ctx.locale, 'Créditos de esta semana', 'This week’s credits', 'Créditos desta semana')} />
      <Facts rows={c.packs} />
      <CTA href={d.packsUrl}>{c.cta}</CTA>
      {c.tip && <Tip ctx={ctx}>{c.tip}</Tip>}
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} preferencesUrl={d.preferencesUrl} />
    </Layout>
  ),
}

// ── B8 · Recibo de pago ─────────────────────────────────────────────────────────────────────────────
export const paymentReceipt = {
  id: 'payment-receipt',
  phase: 'B',
  kind: 'transactional',
  tone: 'sobrio',
  title: { es: 'Recibo de pago', en: 'Payment receipt', pt: 'Recibo de pagamento' },
  when: 'Tras cada cobro correcto del plan o de un paquete. A quien paga.',
  required: ['plan', 'amount', 'invoiceUrl', 'invoiceNo', 'periodFrom', 'periodTo', 'method'],
  sample: (locale) => ({ name: sampleName(locale), plan: 'impulso', amount: 29, method: tr(locale, 'Visa terminada en 4242', 'Visa ending in 4242', 'Visa final 4242'), invoiceNo: 'ACEO-2026-000123', periodFrom: '2026-12-01T00:00:00Z', periodTo: '2026-12-31T00:00:00Z', invoiceUrl: 'https://app.agentceo.io/facturas/EJEMPLO.pdf', sentAt: '2026-12-01T14:00:00Z' }),
  copy: {
    es: (d) => {
      const p = planOf('es', d.plan)
      return {
        subject: `Recibo de Agent CEO · ${p.name} · ${fmtDate('es', d.periodFrom, { month: 'long', year: 'numeric' })}`,
        preheader: `Recibimos tu pago de ${money('es', d.amount)}. Gracias por confiar en tu equipo.`,
        label: 'Recibo',
        title: d.name ? <>Gracias, <Em>{d.name}.</Em></> : <>Gracias por <Em>tu pago.</Em></>,
        lead: `Recibimos el pago de tu plan ${p.name}. Aquí va el detalle; la factura en PDF está en el botón.`,
        facts: [['Plan', `${p.name} · mensual`], ['Periodo', `${fmtDate('es', d.periodFrom)} – ${fmtDate('es', d.periodTo)}`], ['Método', d.method], ['N.º', d.invoiceNo]],
        total: ['Total', money('es', d.amount)],
        cta: 'Descargar la factura',
        help: '¿Algo no cuadra? Responde a este correo y lo revisamos.',
        bubble: `Con ${p.name}, tu equipo tiene ${num('es', p.credits)} créditos cada semana. ¡A darles trabajo! 💪`,
        reason: 'Recibes este recibo porque se cobró un pago en tu cuenta de Agent CEO.',
      }
    },
    en: (d) => {
      const p = planOf('en', d.plan)
      return {
        subject: `Agent CEO receipt · ${p.name} · ${fmtDate('en', d.periodFrom, { month: 'long', year: 'numeric' })}`,
        preheader: `We received your payment of ${money('en', d.amount)}. Thanks for trusting your team.`,
        label: 'Receipt',
        title: d.name ? <>Thank you, <Em>{d.name}.</Em></> : <>Thanks for <Em>your payment.</Em></>,
        lead: `We received the payment for your ${p.name} plan. Here are the details; the PDF invoice is behind the button.`,
        facts: [['Plan', `${p.name} · monthly`], ['Period', `${fmtDate('en', d.periodFrom, { month: 'short', day: 'numeric' })} – ${fmtDate('en', d.periodTo, { month: 'short', day: 'numeric' })}`], ['Method', d.method], ['No.', d.invoiceNo]],
        total: ['Total', money('en', d.amount)],
        cta: 'Download the invoice',
        help: 'Something look off? Reply to this email and we’ll check it.',
        bubble: `With ${p.name}, your team gets ${num('en', p.credits)} credits every week. Time to put them to work! 💪`,
        reason: 'You got this receipt because a payment was charged to your Agent CEO account.',
      }
    },
    pt: (d) => {
      const p = planOf('pt', d.plan)
      return {
        subject: `Recibo do Agent CEO · ${p.name} · ${fmtDate('pt', d.periodFrom, { month: 'long', year: 'numeric' })}`,
        preheader: `Recebemos o seu pagamento de ${money('pt', d.amount)}. Obrigado por confiar na sua equipe.`,
        label: 'Recibo',
        title: d.name ? <>Obrigado, <Em>{d.name}.</Em></> : <>Obrigado pelo <Em>seu pagamento.</Em></>,
        lead: `Recebemos o pagamento do seu plano ${p.name}. Aqui vão os detalhes; a nota em PDF está no botão.`,
        facts: [['Plano', `${p.name} · mensal`], ['Período', `${fmtDate('pt', d.periodFrom)} – ${fmtDate('pt', d.periodTo)}`], ['Forma de pagamento', d.method], ['N.º', d.invoiceNo]],
        total: ['Total', money('pt', d.amount)],
        cta: 'Baixar a nota',
        help: 'Algo não bate? Responda a este e-mail e a gente confere.',
        bubble: `Com o ${p.name}, sua equipe tem ${num('pt', p.credits)} créditos toda semana. Hora de botar eles para trabalhar! 💪`,
        reason: 'Você recebeu este recibo porque foi cobrado um pagamento na sua conta do Agent CEO.',
      }
    },
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} title={c.title} lead={c.lead} />
      <Facts rows={c.facts} total={c.total} />
      <CTA href={d.invoiceUrl}>{c.cta}</CTA>
      <Block><P muted style={{ fontSize: 14 }}>{c.help}</P></Block>
      <Bubble ctx={ctx}>{c.bubble}</Bubble>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} />
    </Layout>
  ),
}

// ── B9 · Pago fallido ───────────────────────────────────────────────────────────────────────────────
export const paymentFailed = {
  id: 'payment-failed',
  phase: 'B',
  kind: 'transactional',
  tone: 'sobrio',
  title: { es: 'Pago fallido', en: 'Payment failed', pt: 'Pagamento recusado' },
  when: 'Cuando falla el cobro del plan. Se repite en cada reintento, a quien paga. La política de gracia la decide Diego (ver docs).',
  required: ['plan', 'method', 'billingUrl'],
  sample: (locale) => ({ name: sampleName(locale), plan: 'impulso', method: tr(locale, 'Visa terminada en 4242', 'Visa ending in 4242', 'Visa final 4242'), reason: tr(locale, 'Fondos insuficientes', 'Insufficient funds', 'Saldo insuficiente'), retryOn: '2026-12-04T00:00:00Z', billingUrl: 'https://app.agentceo.io/facturacion', sentAt: '2026-12-01T14:05:00Z' }),
  copy: {
    es: (d) => {
      const p = planOf('es', d.plan)
      return {
        subject: lead(d.name, `No pudimos cobrar tu plan ${p.name}`),
        preheader: `Actualiza tu método de pago y listo.${d.retryOn ? ` Volvemos a intentarlo el ${fmtDate('es', d.retryOn, { weekday: 'long', day: 'numeric', month: 'long' })}.` : ''}`,
        label: 'Facturación',
        title: <>El cobro <Em>no pasó.</Em></>,
        lead: 'El banco rechazó el pago. Casi siempre es una tarjeta vencida o un límite, y se arregla en un minuto.',
        facts: [['Plan', p.name], ['Método', d.method], ['Motivo', d.reason], ['Nuevo intento', d.retryOn && fmtDate('es', d.retryOn, { weekday: 'long', day: 'numeric', month: 'long' })]].filter(([, v]) => v),
        cta: 'Actualizar el método de pago',
        grace: d.graceEndsOn ? `Si para el ${fmtDate('es', d.graceEndsOn)} no se resuelve, tu cuenta pasa al plan Arranque (gratis). No se borra nada.` : null,
        reason: 'Recibes este aviso porque gestionas los pagos de una cuenta de Agent CEO.',
      }
    },
    en: (d) => {
      const p = planOf('en', d.plan)
      return {
        subject: lead(d.name, `We couldn’t charge your ${p.name} plan`),
        preheader: `Update your payment method and you’re set.${d.retryOn ? ` We’ll try again on ${fmtDate('en', d.retryOn, { weekday: 'long', month: 'long', day: 'numeric' })}.` : ''}`,
        label: 'Billing',
        title: <>The payment <Em>didn’t go through.</Em></>,
        lead: 'The bank declined the charge. It’s almost always an expired card or a limit, and it takes a minute to fix.',
        facts: [['Plan', p.name], ['Method', d.method], ['Reason', d.reason], ['Next attempt', d.retryOn && fmtDate('en', d.retryOn, { weekday: 'long', month: 'long', day: 'numeric' })]].filter(([, v]) => v),
        cta: 'Update payment method',
        grace: d.graceEndsOn ? `If it isn’t sorted by ${fmtDate('en', d.graceEndsOn, { month: 'long', day: 'numeric' })}, your account moves to the free Arranque plan. Nothing gets deleted.` : null,
        reason: 'You got this alert because you manage payments for an Agent CEO account.',
      }
    },
    pt: (d) => {
      const p = planOf('pt', d.plan)
      return {
        subject: lead(d.name, `Não conseguimos cobrar o seu plano ${p.name}`),
        preheader: `Atualize a sua forma de pagamento e pronto.${d.retryOn ? ` Tentamos de novo ${onDay(d.retryOn)}.` : ''}`,
        label: 'Cobrança',
        title: <>A cobrança <Em>não passou.</Em></>,
        lead: 'O banco recusou o pagamento. Quase sempre é um cartão vencido ou um limite, e se resolve em um minuto.',
        facts: [['Plano', p.name], ['Forma de pagamento', d.method], ['Motivo', d.reason], ['Nova tentativa', d.retryOn && monday('pt', d.retryOn)]].filter(([, v]) => v),
        cta: 'Atualizar a forma de pagamento',
        grace: d.graceEndsOn ? `Se até ${fmtDate('pt', d.graceEndsOn)} isso não se resolver, sua conta passa para o plano Arranque (grátis). Nada é apagado.` : null,
        reason: 'Você recebeu este aviso porque cuida dos pagamentos de uma conta do Agent CEO.',
      }
    },
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} title={c.title} lead={c.lead} />
      <Facts rows={c.facts} />
      <CTA href={d.billingUrl}>{c.cta}</CTA>
      {c.grace && <Note>{c.grace}</Note>}
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} />
    </Layout>
  ),
}

// ── B10 · Cambio de plan ────────────────────────────────────────────────────────────────────────────
export const planChanged = {
  id: 'plan-changed',
  phase: 'B',
  kind: 'transactional',
  tone: 'celebración',
  title: { es: 'Cambio de plan', en: 'Plan changed', pt: 'Mudança de plano' },
  when: 'Al subir o bajar de plan. A quien administra la cuenta.',
  required: ['from', 'to', 'effectiveOn', 'appUrl'],
  sample: (locale) => ({ name: sampleName(locale), from: 'impulso', to: 'motor', effectiveOn: '2026-12-08T00:00:00Z', appUrl: 'https://app.agentceo.io/plan', sentAt: '2026-12-08T15:00:00Z' }),
  copy: {
    es: (d) => {
      const a = planOf('es', d.from), b = planOf('es', d.to), up = b.price > a.price
      return {
        subject: up ? lead(d.name, `Ya estás en ${b.name} 🚀`) : lead(d.name, `Tu plan cambió a ${b.name}`),
        preheader: `${num('es', b.credits)} créditos cada semana y ${seats('es', b)} ${b.seats === 1 ? 'persona' : 'personas'}, desde el ${fmtDate('es', d.effectiveOn)}.`,
        label: 'Tu plan',
        sticker: up ? '¡más manos!' : null,
        title: <>Ya estás en <Em>{b.name}.</Em></>,
        lead: up ? 'Más créditos, más manos. Esto cambia para tu equipo:' : 'Hecho. Esto cambia para tu equipo:',
        facts: [['Plan', `${a.name} → ${b.name}`], ['Créditos / semana', `${num('es', a.credits)} → ${num('es', b.credits)}`], ['Personas', `${seats('es', a)} → ${seats('es', b)}`], ['Desde', fmtDate('es', d.effectiveOn)]],
        total: ['Precio', `${money('es', b.price)} / mes`],
        tip: up ? 'Con más créditos, enciende el resumen de ventas cada mañana: a las 7:00 sabes cómo va tu negocio sin abrir nada.' : 'Si un día necesitas más, puedes volver a subir de plan cuando quieras.',
        cta: 'Ver mi plan',
        reason: 'Recibes este aviso porque se cambió el plan de tu cuenta de Agent CEO.',
      }
    },
    en: (d) => {
      const a = planOf('en', d.from), b = planOf('en', d.to), up = b.price > a.price
      return {
        subject: up ? lead(d.name, `You’re on ${b.name} now 🚀`) : lead(d.name, `Your plan changed to ${b.name}`),
        preheader: `${num('en', b.credits)} credits every week and ${seats('en', b)} ${b.seats === 1 ? 'person' : 'people'}, starting ${fmtDate('en', d.effectiveOn, { month: 'long', day: 'numeric' })}.`,
        label: 'Your plan',
        sticker: up ? 'more hands!' : null,
        title: <>You’re on <Em>{b.name}.</Em></>,
        lead: up ? 'More credits, more hands. Here’s what changes for your team:' : 'Done. Here’s what changes for your team:',
        facts: [['Plan', `${a.name} → ${b.name}`], ['Credits / week', `${num('en', a.credits)} → ${num('en', b.credits)}`], ['People', `${seats('en', a)} → ${seats('en', b)}`], ['Starting', fmtDate('en', d.effectiveOn, { month: 'long', day: 'numeric' })]],
        total: ['Price', `${money('en', b.price)} / month`],
        tip: up ? 'With more credits, turn on the morning sales summary: at 7:00 you know how your business is doing without opening anything.' : 'If you ever need more, you can move back up a plan whenever you like.',
        cta: 'See my plan',
        reason: 'You got this alert because the plan on your Agent CEO account changed.',
      }
    },
    pt: (d) => {
      const a = planOf('pt', d.from), b = planOf('pt', d.to), up = b.price > a.price
      return {
        subject: up ? lead(d.name, `Agora você está no ${b.name} 🚀`) : lead(d.name, `Seu plano mudou para ${b.name}`),
        preheader: `${num('pt', b.credits)} créditos toda semana e ${seats('pt', b)} ${b.seats === 1 ? 'pessoa' : 'pessoas'}, a partir de ${fmtDate('pt', d.effectiveOn)}.`,
        label: 'Seu plano',
        sticker: up ? 'mais mãos!' : null,
        title: <>Agora você está no <Em>{b.name}.</Em></>,
        lead: up ? 'Mais créditos, mais mãos. Isto muda para a sua equipe:' : 'Feito. Isto muda para a sua equipe:',
        facts: [['Plano', `${a.name} → ${b.name}`], ['Créditos / semana', `${num('pt', a.credits)} → ${num('pt', b.credits)}`], ['Pessoas', `${seats('pt', a)} → ${seats('pt', b)}`], ['A partir de', fmtDate('pt', d.effectiveOn)]],
        total: ['Preço', `${money('pt', b.price)} / mês`],
        tip: up ? 'Com mais créditos, ative o resumo de vendas toda manhã: às 7:00 você sabe como vai o seu negócio sem abrir nada.' : 'Se um dia precisar de mais, você pode subir de plano de novo quando quiser.',
        cta: 'Ver meu plano',
        reason: 'Você recebeu este aviso porque o plano da sua conta do Agent CEO mudou.',
      }
    },
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} sticker={c.sticker} title={c.title} lead={c.lead} />
      <Facts rows={c.facts} total={c.total} />
      <Tip ctx={ctx}>{c.tip}</Tip>
      <CTA href={d.appUrl}>{c.cta}</CTA>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} />
    </Layout>
  ),
}

export default [creditsLow, creditsOut, paymentReceipt, paymentFailed, planChanged]
