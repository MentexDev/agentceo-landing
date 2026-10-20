// FASE B · ciclo de vida (marketing: siempre con baja). Win-back por inactividad y el resumen del mes.
import { Layout, Header, Hero, Em, P, Block, Eyebrow, CTA, PromptCard, Steps, Numbers, Signature, Footer } from '../components.jsx'
import { fmtShort, fmtDate, num, lead } from '../format.js'
import { COLORS as C, FONTS as F } from '../brand.js'
import { Link, Text } from 'react-email'

const sampleName = (locale) => (locale === 'es' ? 'Ana' : 'Sam')

// ── B12 · Win-back por inactividad ──────────────────────────────────────────────────────────────────
export const winback = {
  id: 'winback',
  phase: 'B',
  kind: 'marketing',
  tone: 'edición',
  title: { es: 'Win-back por inactividad', en: 'Inactivity win-back' },
  when: 'A los 14 días sin entrar, solo si dejó algo a medias. Una sola vez por ausencia: si no vuelve, no insistimos.',
  required: ['resumeUrl', 'items'],
  sample: (locale) => ({
    name: sampleName(locale), days: 14, resumeUrl: 'https://app.agentceo.io', pauseUrl: 'https://agentceo.io/api/pausar?t=EJEMPLO', unsubscribeUrl: 'https://agentceo.io/api/unsubscribe?t=EJEMPLO', sentAt: '2026-12-15T15:00:00Z',
    items: locale === 'es'
      ? [{ label: 'Espera tu aprobación', text: '4 posts de Navidad listos para publicar' }, { label: 'A medias', text: 'La respuesta tipo para «¿hacen envíos?»' }, { label: 'Sin estrenar', text: 'El Experto en publicidad: lo tienes y nunca le pediste nada' }]
      : [{ label: 'Needs your approval', text: '4 holiday posts ready to publish' }, { label: 'Half done', text: 'The template reply for "do you ship?"' }, { label: 'Never used', text: 'The Advertising expert: it’s on your team and you’ve never asked it for anything' }],
  }),
  copy: {
    es: (d) => ({
      subject: lead(d.name, `Tu equipo te espera: ${d.items[0].text.charAt(0).toLowerCase()}${d.items[0].text.slice(1)}`),
      preheader: 'Siguen listos, pero sin ti no se mueven. Vuelves en dos minutos.',
      label: d.days ? `Hace ${d.days} días` : 'Tu equipo',
      title: <>Tu equipo <Em>te echa de menos.</Em></>,
      lead: 'Siguen listos, pero sin ti no se mueven. Esto quedó a medias:',
      steps: 'Lo que te espera',
      giftTitle: 'Para volver en dos minutos',
      gift: 'Ponme al día: ¿qué pasó en mi negocio desde la última vez que entré y qué es lo primero que debería decidir hoy?',
      giftHint: 'Pégaselo a tu CEO al entrar. Te contesta con lo urgente arriba.',
      cta: 'Retomar donde lo dejé',
      pause: 'Pausar estos correos 30 días',
      reason: 'Te escribimos una sola vez por ausencia. Si no vuelves, no insistimos.',
    }),
    en: (d) => ({
      subject: lead(d.name, `Your team is waiting: ${d.items[0].text.charAt(0).toLowerCase()}${d.items[0].text.slice(1)}`),
      preheader: 'They’re ready, but without you they don’t move. You’re back in two minutes.',
      label: d.days ? `${d.days} days ago` : 'Your team',
      title: <>Your team <Em>misses you.</Em></>,
      lead: 'They’re ready, but without you they don’t move. Here’s what was left half done:',
      steps: 'What’s waiting',
      giftTitle: 'To get back in two minutes',
      gift: 'Catch me up: what happened in my business since I last logged in, and what’s the first thing I should decide today?',
      giftHint: 'Paste it to your CEO when you’re back. Urgent things come first.',
      cta: 'Pick up where I left off',
      pause: 'Pause these emails for 30 days',
      reason: 'We write only once per absence. If you don’t come back, we won’t keep insisting.',
    }),
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} title={c.title} lead={c.lead} />
      <Steps title={c.steps} items={d.items.slice(0, 3).map((x) => ({ title: x.text, text: x.label }))} />
      <CTA href={d.resumeUrl}>{c.cta}</CTA>
      <PromptCard ctx={ctx} title={c.giftTitle} prompt={c.gift} hint={c.giftHint} />
      {d.pauseUrl && (
        <Block style={{ paddingTop: 18 }}>
          <Link className="ac-muted" href={d.pauseUrl} style={{ fontSize: 14, color: C.muted, textDecoration: 'underline' }}>{c.pause}</Link>
        </Block>
      )}
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="marketing" reason={c.reason} unsubscribeUrl={d.unsubscribeUrl} preferencesUrl={d.preferencesUrl} />
    </Layout>
  ),
}

// ── B13 · El resumen del mes ────────────────────────────────────────────────────────────────────────
const DIGEST_SAMPLE = {
  es: {
    numbers: { tasks: 186, approvals: 31, sales: 42 },
    best: { title: 'Recuperaste 9 carritos abandonados', text: 'La automatización de carritos escribió a quien se fue sin pagar. 9 volvieron y compraron.' },
    news: { title: 'Novedad: tus reuniones, grabadas y resumidas', text: 'Conecta tu calendario y tu CEO te deja el resumen y las tareas de cada reunión.' },
  },
  en: {
    numbers: { tasks: 186, approvals: 31, sales: 42 },
    best: { title: 'You recovered 9 abandoned carts', text: 'The abandoned-cart automation messaged people who left without paying. 9 came back and bought.' },
    news: { title: 'New: your meetings, recorded and summarized', text: 'Connect your calendar and your CEO leaves you the summary and the tasks from every meeting.' },
  },
}

export const monthlyDigest = {
  id: 'monthly-digest',
  phase: 'B',
  kind: 'marketing',
  tone: 'edición',
  title: { es: 'El resumen del mes', en: 'Monthly digest' },
  when: 'El primer martes de cada mes, si la cuenta tuvo actividad. Sin actividad, no sale.',
  required: ['month', 'numbers', 'appUrl'],
  sample: (locale) => ({ name: sampleName(locale), month: '2026-11-15T00:00:00Z', appUrl: 'https://app.agentceo.io/mes/2026-11', unsubscribeUrl: 'https://agentceo.io/api/unsubscribe?t=EJEMPLO', sentAt: '2026-12-01T14:00:00Z', ...DIGEST_SAMPLE[locale] }),
  copy: {
    es: (d) => {
      const m = fmtDate('es', d.month, { month: 'long' })
      return {
        subject: `Tu ${m} con Agent CEO: ${num('es', d.numbers.tasks)} tareas hechas por tu equipo`,
        preheader: 'Lo mejor del mes, una novedad y el prompt del mes, listo para copiar.',
        label: 'Tu mes',
        sticker: `¡${m}!`,
        title: <>Tu mes, <Em>en un minuto.</Em></>,
        lead: d.name ? `${d.name}, esto es lo que hizo tu equipo este mes.` : 'Esto es lo que hizo tu equipo este mes.',
        numbers: [[num('es', d.numbers.tasks), 'tareas terminadas'], [num('es', d.numbers.approvals), 'aprobaciones tuyas'], [num('es', d.numbers.sales), 'ventas por WhatsApp']],
        best: 'Lo mejor del mes',
        news: 'Nuevo en Agent CEO',
        giftTitle: 'El prompt del mes',
        gift: 'Mira las preguntas que más me hicieron mis clientes este mes y escribe una publicación que responda las tres más repetidas, con mi tono.',
        giftHint: 'Pídeselo a tu Creador de contenido. Antes de publicar, te pide permiso.',
        cta: 'Ver mi mes completo',
        reason: 'Recibes el resumen del mes porque tienes una cuenta de Agent CEO. Si un mes no hay actividad, no te escribimos.',
      }
    },
    en: (d) => {
      const m = fmtDate('en', d.month, { month: 'long' })
      return {
        subject: `Your ${m} with Agent CEO: ${num('en', d.numbers.tasks)} tasks done by your team`,
        preheader: 'The best of the month, something new and the prompt of the month, ready to copy.',
        label: 'Your month',
        sticker: `${m}!`,
        title: <>Your month, <Em>in a minute.</Em></>,
        lead: d.name ? `${d.name}, here’s what your team did this month.` : 'Here’s what your team did this month.',
        numbers: [[num('en', d.numbers.tasks), 'tasks done'], [num('en', d.numbers.approvals), 'approvals from you'], [num('en', d.numbers.sales), 'sales on WhatsApp']],
        best: 'Best of the month',
        news: 'New in Agent CEO',
        giftTitle: 'Prompt of the month',
        gift: 'Look at the questions my customers asked most this month and write a post that answers the top three, in my voice.',
        giftHint: 'Ask your Content creator. It asks your permission before posting.',
        cta: 'See my full month',
        reason: 'You get the monthly digest because you have an Agent CEO account. If a month has no activity, we don’t write.',
      }
    },
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} sticker={c.sticker} title={c.title} lead={c.lead} />
      <Numbers items={c.numbers} />
      {d.best && (
        <Block style={{ paddingTop: 22 }}>
          <div className="ac-tint" style={{ background: C.gold3, border: `1px solid ${C.gold3}`, borderRadius: 18, padding: '18px 22px' }}>
            <Eyebrow>{c.best}</Eyebrow>
            <Text className="ac-tx" style={{ fontFamily: F.serif, fontWeight: 400, WebkitTextStrokeWidth: '0.035em', paintOrder: 'stroke fill', margin: '6px 0 0', fontSize: 26, lineHeight: '1.15', color: C.ink }}>{d.best.title}</Text>
            <P style={{ fontSize: 15, marginTop: 8 }}>{d.best.text}</P>
          </div>
        </Block>
      )}
      {d.news && <Steps title={c.news} items={[d.news]} />}
      <PromptCard ctx={ctx} title={c.giftTitle} prompt={c.gift} hint={c.giftHint} />
      <CTA href={d.appUrl}>{c.cta}</CTA>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="marketing" reason={c.reason} unsubscribeUrl={d.unsubscribeUrl} preferencesUrl={d.preferencesUrl} />
    </Layout>
  ),
}

export default [winback, monthlyDigest]
