// FASE B · el equipo de IA: primer equipo creado y el acta de la reunión diaria (S07 de la landing).
import { Layout, Header, Hero, Em, P, Block, Eyebrow, CTA, Bubble, PromptCard, Steps, Numbers, TeamRow, Signature, Footer } from '../components.jsx'
import { fmtShort, fmtDate, lead } from '../format.js'
import { TEAM } from '../gifts.js'
import { COLORS as C, FONTS as F } from '../brand.js'
import { Text } from 'react-email'

const sampleName = (locale) => (locale === 'es' ? 'Ana' : 'Sam')

// ── B4 · Tu equipo está listo (primer equipo / agente creado) ───────────────────────────────────────
export const teamReady = {
  id: 'team-ready',
  phase: 'B',
  kind: 'transactional',
  tone: 'celebración',
  title: { es: 'Tu primer equipo está listo', en: 'Your first team is ready' },
  when: 'Cuando el CEO termina de armar el primer equipo (o se crea el primer agente propio). Una vez.',
  required: ['appUrl'],
  sample: (locale) => ({ name: sampleName(locale), appUrl: 'https://app.agentceo.io/equipo', agents: TEAM[locale], firstReport: '7:00', sentAt: '2026-11-17T16:40:00Z' }),
  copy: {
    es: (d) => ({
      subject: lead(d.name, 'Tu equipo de IA ya está completo 🎉'),
      preheader: `Mañana a las ${d.firstReport ?? '7:00'} te llega la primera acta. Y aquí va su primer encargo.`,
      label: 'Tu equipo',
      sticker: '¡a trabajar!',
      title: <>Tu equipo, <Em>listo para trabajar.</Em></>,
      lead: 'Ya tienes a tu gente. Cada uno sabe lo suyo y, lo importante, siempre te preguntan antes de gastar o publicar.',
      team: 'Quiénes son',
      bubble: `Mañana a las ${d.firstReport ?? '7:00'} te mando el acta de la primera reunión: qué hicimos, qué sigue y qué espera tu OK.`,
      giftTitle: 'Su primer encargo',
      gift: 'Vendedor: escribe la respuesta que le darías a un cliente que pregunta si hacemos envíos a otra ciudad. Usa mi tono: cercano y breve.',
      giftHint: 'Pégalo en el chat del equipo. Si te gusta la respuesta, se la queda como modelo.',
      cta: 'Darles su primer encargo',
      reason: 'Recibes este correo porque tu equipo de Agent CEO acaba de quedar listo.',
    }),
    en: (d) => ({
      subject: lead(d.name, 'Your AI team is complete 🎉'),
      preheader: `Tomorrow at ${d.firstReport ?? '7:00'} you’ll get the first minutes. And here’s their first task.`,
      label: 'Your team',
      sticker: 'let’s go!',
      title: <>Your team, <Em>ready to work.</Em></>,
      lead: 'Your people are in place. Each one knows their job and, most importantly, they always ask you before spending or posting.',
      team: 'Meet them',
      bubble: `Tomorrow at ${d.firstReport ?? '7:00'} I’ll send you the minutes of our first meeting: what we did, what’s next and what needs your OK.`,
      giftTitle: 'Their first task',
      gift: 'WhatsApp seller: write the reply you’d give a customer asking if we ship to another city. Use my tone: friendly and brief.',
      giftHint: 'Paste it into the team chat. If you like the reply, they keep it as a template.',
      cta: 'Give them their first task',
      reason: 'You got this email because your Agent CEO team just got ready.',
    }),
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} sticker={c.sticker} title={c.title} lead={c.lead} />
      <TeamRow ctx={ctx} title={c.team} members={d.agents?.length ? d.agents : TEAM[ctx.locale]} />
      <Bubble ctx={ctx}>{c.bubble}</Bubble>
      <PromptCard ctx={ctx} title={c.giftTitle} prompt={c.gift} hint={c.giftHint} />
      <CTA href={d.appUrl}>{c.cta}</CTA>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} preferencesUrl={d.preferencesUrl} />
    </Layout>
  ),
}

// ── B5 · El acta de la reunión diaria ──────────────────────────────────────────────────────────────
const MINUTES_SAMPLE = {
  es: {
    numbers: [['3', 'ventas cerradas por WhatsApp'], ['14', 'chats respondidos'], ['2', 'posts listos para publicar']],
    done: [
      { agent: 'Vendedor de WhatsApp', text: 'Respondí 14 chats y cerré 3 ventas mientras dormías' },
      { agent: 'Encargado de inventario', text: 'Conté el stock: la camisa azul talla M está por acabarse' },
    ],
    next: [{ agent: 'Creador de contenido', text: 'Publicar los 2 posts de la semana el jueves a las 6:00 p. m.' }],
    approval: { agent: 'Encargado de inventario', title: 'Pedir 20 camisas azules talla M al proveedor', detail: 'Costo estimado según tu último pedido. Si no apruebas, no se pide nada.' },
    ceoNote: 'Los jueves por la tarde es cuando más te escriben. Por eso propuse publicar a esa hora.',
  },
  en: {
    numbers: [['3', 'sales closed on WhatsApp'], ['14', 'chats answered'], ['2', 'posts ready to publish']],
    done: [
      { agent: 'WhatsApp seller', text: 'Answered 14 chats and closed 3 sales while you slept' },
      { agent: 'Inventory manager', text: 'Counted stock: the blue shirt in size M is running low' },
    ],
    next: [{ agent: 'Content creator', text: 'Publish this week’s 2 posts on Thursday at 6:00 p.m.' }],
    approval: { agent: 'Inventory manager', title: 'Order 20 blue shirts in size M from the supplier', detail: 'Estimated cost based on your last order. If you don’t approve, nothing is ordered.' },
    ceoNote: 'Thursday afternoons are when most people message you. That’s why I suggested posting then.',
  },
}

export const dailyMinutes = {
  id: 'daily-minutes',
  phase: 'B',
  kind: 'transactional',
  tone: 'edición',
  title: { es: 'El acta de la reunión diaria', en: 'Daily meeting minutes' },
  when: 'Cada mañana a la hora que elija (por defecto 7:00), solo si el equipo hizo algo o hay algo que aprobar.',
  required: ['appUrl', 'date', 'done'],
  sample: (locale) => ({ name: sampleName(locale), date: '2026-11-20T12:00:00Z', appUrl: 'https://app.agentceo.io/acta/2026-11-20', approvalUrl: 'https://app.agentceo.io/aprobar/EJEMPLO', ...MINUTES_SAMPLE[locale], sentAt: '2026-11-20T12:00:00Z' }),
  copy: {
    es: (d) => {
      const day = fmtDate('es', d.date, { weekday: 'long', day: 'numeric', month: 'long' })
      return {
        subject: `Acta del ${day}: ${d.done.length} ${d.done.length === 1 ? 'cosa hecha' : 'cosas hechas'}${d.approval ? ', 1 espera tu OK' : ''}`,
        preheader: d.approval ? `${d.approval.agent} necesita tu aprobación: ${d.approval.title.charAt(0).toLowerCase()}${d.approval.title.slice(1)}.` : 'Lo que hizo tu equipo, en un minuto de lectura.',
        label: 'Reunión diaria',
        title: <>Buenos días{d.name ? `, ${d.name}` : ''}. <Em>Esto hizo tu equipo.</Em></>,
        approvalLabel: `Espera tu aprobación · ${d.approval?.agent ?? ''}`,
        cta: 'Revisar y aprobar',
        ctaAlt: 'Leer el acta completa',
        done: 'Lo que hicimos',
        next: 'Lo que sigue',
        reason: 'Recibes el acta cada mañana porque la tienes encendida en tu cuenta de Agent CEO.',
      }
    },
    en: (d) => {
      const day = fmtDate('en', d.date, { weekday: 'long', month: 'long', day: 'numeric' })
      return {
        subject: `Minutes for ${day}: ${d.done.length} ${d.done.length === 1 ? 'thing' : 'things'} done${d.approval ? ', 1 needs your OK' : ''}`,
        preheader: d.approval ? `${d.approval.agent} needs your approval: ${d.approval.title.charAt(0).toLowerCase()}${d.approval.title.slice(1)}.` : 'What your team did, in a one-minute read.',
        label: 'Daily meeting',
        title: <>Good morning{d.name ? `, ${d.name}` : ''}. <Em>Here’s what your team did.</Em></>,
        approvalLabel: `Needs your approval · ${d.approval?.agent ?? ''}`,
        cta: 'Review and approve',
        ctaAlt: 'Read the full minutes',
        done: 'What we did',
        next: 'What’s next',
        reason: 'You get the minutes every morning because they’re turned on in your Agent CEO account.',
      }
    },
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.date)} />
      <Hero ctx={ctx} title={c.title} />
      {d.numbers?.length > 0 && <Numbers items={d.numbers} />}
      {d.approval && (
        <Block style={{ paddingTop: 22 }}>
          <div className="ac-card" style={{ border: `1.5px solid ${C.ink}`, borderRadius: 18, padding: '18px 20px', background: '#FFFFFF' }}>
            <Eyebrow>{c.approvalLabel}</Eyebrow>
            <Text className="ac-tx" style={{ fontFamily: F.serif, fontWeight: 400, WebkitTextStrokeWidth: '0.035em', paintOrder: 'stroke fill', margin: '8px 0 0', fontSize: 26, lineHeight: '1.15', color: C.ink }}>{d.approval.title}</Text>
            {d.approval.detail && <P muted style={{ fontSize: 14, marginTop: 8 }}>{d.approval.detail}</P>}
          </div>
        </Block>
      )}
      <CTA href={d.approval ? d.approvalUrl || d.appUrl : d.appUrl}>{d.approval ? c.cta : c.ctaAlt}</CTA>
      <Steps title={c.done} items={d.done.map((x) => ({ title: x.text, text: x.agent }))} />
      {d.next?.length > 0 && <Steps title={c.next} items={d.next.map((x) => ({ title: x.text, text: x.agent }))} start={d.done.length + 1} />}
      {d.ceoNote && <Bubble ctx={ctx}>{d.ceoNote}</Bubble>}
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} preferencesUrl={d.preferencesUrl} />
    </Layout>
  ),
}

export default [teamReady, dailyMinutes]
