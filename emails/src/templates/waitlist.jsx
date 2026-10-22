// FASE A · la landing de hoy (solo lista de espera). Ver docs/EMAILS-PLAN.md.
import { Layout, Header, Hero, Em, P, Block, Eyebrow, CTA, LinkFallback, Bubble, PromptCard, GiftIdeas, Tip, Steps, Stat, TeamRow, Note, Signature, Footer } from '../components.jsx'
import { fmtShort, num, hi, lead } from '../format.js'
import { businessIdeas, IDEAS_COPY, TEAM } from '../gifts.js'
import { COLORS as C, FONTS as F, ROUTES } from '../brand.js'
import { Text } from 'react-email'

const SENT = '2026-10-20T15:00:00Z'
const sampleName = (locale) => (locale === 'en' ? 'Sam' : 'Ana')

// ── A1 · Confirma tu correo (double opt-in) ─────────────────────────────────────────────────────────
export const waitlistConfirm = {
  id: 'waitlist-confirm',
  phase: 'A',
  kind: 'transactional',
  tone: 'sobrio',
  title: { es: 'Confirma tu correo (doble opt-in)', en: 'Confirm your email (double opt-in)', pt: 'Confirme seu e-mail (opt-in duplo)' },
  when: 'Justo al apuntarse en la landing. Hasta que no confirma, no recibe ningún otro correo.',
  required: ['confirmUrl'],
  sample: (locale) => ({ name: sampleName(locale), confirmUrl: 'https://agentceo.io/api/waitlist/confirm?t=EJEMPLO-no-real', expiresHours: 48, sentAt: SENT }),
  copy: {
    es: (d) => ({
      subject: lead(d.name, 'Confirma tu correo y guardamos tu lugar'),
      preheader: 'Un toque y quedas en la lista de Agent CEO. Es para saber que este correo es tuyo.',
      label: 'Lista de espera',
      eyebrow: 'Un paso y listo',
      title: <>Un toque y <Em>estás dentro.</Em></>,
      lead: `${hi('es', d.name)} Confirma que este correo es tuyo y te guardamos el lugar en la lista de Agent CEO.`,
      cta: 'Confirmar mi correo',
      ctaNote: `El enlace caduca en ${d.expiresHours ?? 48} horas.`,
      bubble: 'Abrimos por grupos para cuidar a cada negocio que entra. En cuanto confirmes, te cuento cómo va la fila. 😉',
      note: '¿No fuiste tú? Ignora este correo: sin confirmar, no te apuntamos a nada ni te volvemos a escribir.',
      reason: 'Recibes este correo porque alguien escribió esta dirección en agentceo.io.',
    }),
    en: (d) => ({
      subject: lead(d.name, 'Confirm your email and we’ll save your spot'),
      preheader: 'One tap and you’re on the Agent CEO waitlist. It’s just to make sure this email is yours.',
      label: 'Waitlist',
      eyebrow: 'One step and done',
      title: <>One tap and <Em>you’re in.</Em></>,
      lead: `${hi('en', d.name)} confirm this email is yours and we’ll save your spot on the Agent CEO waitlist.`,
      cta: 'Confirm my email',
      ctaNote: `The link expires in ${d.expiresHours ?? 48} hours.`,
      bubble: 'We open in waves so every business gets proper care. Once you confirm, I’ll keep you posted on the line. 😉',
      note: 'Wasn’t you? Just ignore this email: without confirming, we won’t add you to anything or write again.',
      reason: 'You got this email because someone entered this address on agentceo.io.',
    }),
    pt: (d) => ({
      subject: lead(d.name, 'Confirme seu e-mail e guardamos o seu lugar'),
      preheader: 'Um toque e você está na lista do Agent CEO. É só para saber que este e-mail é seu.',
      label: 'Lista de espera',
      eyebrow: 'Um passo e pronto',
      title: <>Um toque e <Em>você está dentro.</Em></>,
      lead: `${hi('pt', d.name)} Confirme que este e-mail é seu e guardamos o seu lugar na lista do Agent CEO.`,
      cta: 'Confirmar meu e-mail',
      ctaNote: `O link expira em ${d.expiresHours ?? 48} horas.`,
      bubble: 'Abrimos por grupos para cuidar de cada negócio que entra. Assim que você confirmar, te conto como está a fila. 😉',
      note: 'Não foi você? Ignore este e-mail: sem confirmar, não te inscrevemos em nada nem escrevemos de novo.',
      reason: 'Você recebeu este e-mail porque alguém digitou este endereço em agentceo.io.',
    }),
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
      <CTA href={d.confirmUrl} note={c.ctaNote}>{c.cta}</CTA>
      <LinkFallback ctx={ctx} href={d.confirmUrl} />
      <Bubble ctx={ctx}>{c.bubble}</Bubble>
      <Note>{c.note}</Note>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} />
    </Layout>
  ),
}

// ── A2 · Bienvenida a la lista (tras confirmar) ─────────────────────────────────────────────────────
export const waitlistWelcome = {
  id: 'waitlist-welcome',
  phase: 'A',
  kind: 'marketing',
  tone: 'celebración',
  title: { es: 'Bienvenida a la lista', en: 'Welcome to the waitlist', pt: 'Boas-vindas à lista' },
  when: 'Al confirmar el correo (A1). Una sola vez por persona.',
  required: [],
  sample: (locale) => ({ name: sampleName(locale), position: 318, business: 'tienda', referralUrl: 'https://agentceo.io/?ref=ana-7k2', siteUrl: 'https://agentceo.io', unsubscribeUrl: 'https://agentceo.io/api/unsubscribe?t=EJEMPLO', sentAt: SENT }),
  copy: {
    es: (d) => ({
      subject: lead(d.name, 'Ya tienes tu lugar en Agent CEO 🎉'),
      preheader: 'Tu lugar está guardado. Y un regalo para estrenar: ideas de prompts listas para copiar.',
      label: 'Lista de espera',
      sticker: '¡confirmado!',
      title: <>¡Estás <Em>dentro</Em>{d.name ? `, ${d.name}` : ''}!</>,
      lead: 'Tu correo quedó confirmado y tu lugar, guardado. Abrimos Agent CEO por grupos para cuidar a cada negocio que entra: cuando llegue el tuyo, te escribo yo.',
      statLabel: 'Tu lugar en la lista',
      team: 'Tu equipo te está esperando',
      share: '¿Conoces a alguien a quien le vendría bien?',
      shareText: 'Pásale tu enlace: así sabemos que viene de tu parte.',
      // T60c: «Ver cómo trabaja tu equipo» parecía un login; apunta a la demo de la landing.
      cta: 'Mira cómo trabajará tu equipo',
      signature: 'Te guardo el lugar',
      reason: 'Recibes este correo porque confirmaste tu lugar en la lista de Agent CEO.',
    }),
    en: (d) => ({
      subject: lead(d.name, 'Your spot in Agent CEO is saved 🎉'),
      preheader: 'Your spot is saved. Plus a gift to get started: prompt ideas ready to copy.',
      label: 'Waitlist',
      sticker: 'confirmed!',
      title: <>You’re <Em>in</Em>{d.name ? `, ${d.name}` : ''}!</>,
      lead: 'Your email is confirmed and your spot is saved. We’re opening Agent CEO in waves so every business gets proper care: when yours comes up, I’ll write to you myself.',
      statLabel: 'Your spot on the list',
      team: 'Your team is waiting for you',
      share: 'Know someone who could use it?',
      shareText: 'Send them your link so we know they came from you.',
      cta: 'See how your team will work',
      signature: 'Keeping your spot',
      reason: 'You got this email because you confirmed your spot on the Agent CEO waitlist.',
    }),
    pt: (d) => ({
      subject: lead(d.name, 'Seu lugar no Agent CEO está garantido 🎉'),
      preheader: 'Seu lugar está guardado. E um presente para começar: ideias de prompts prontas para copiar.',
      label: 'Lista de espera',
      sticker: 'confirmado!',
      title: <>Você está <Em>dentro</Em>{d.name ? `, ${d.name}` : ''}!</>,
      lead: 'Seu e-mail foi confirmado e seu lugar, guardado. Abrimos o Agent CEO por grupos para cuidar de cada negócio que entra: quando chegar o seu, eu mesmo te escrevo.',
      statLabel: 'Seu lugar na lista',
      team: 'Sua equipe está te esperando',
      share: 'Conhece alguém que ia gostar?',
      shareText: 'Mande o seu link: assim sabemos que a pessoa veio da sua parte.',
      cta: 'Veja como sua equipe vai trabalhar',
      signature: 'Guardo o seu lugar',
      reason: 'Você recebeu este e-mail porque confirmou seu lugar na lista do Agent CEO.',
    }),
  },
  // d.ideas, d.dateLabel y d.positionLabel: los usa el pre-render del Worker (emails/scripts/worker-templates.mjs),
  // que deja marcas en su lugar y las rellena al enviar. Sin ellos: las ideas salen del negocio, la fecha de
  // sentAt y la posición de d.position.
  // T60b/c · La posición («Tu lugar en la lista · #318») NO salía en la bienvenida automática: el pre-render no
  // pasaba position y el bloque se omitía. Ahora el pre-render deja la marca y el Worker pone la REAL de D1.
  Email: ({ c, d, ctx }) => {
    const ideas = d.ideas || businessIdeas(ctx.locale, d.business)
    const position = d.positionLabel ?? (d.position ? `#${num(ctx.locale, d.position)}` : null)
    return (
      <Layout ctx={ctx} preheader={c.preheader}>
        <Header label={c.label} date={d.dateLabel ?? fmtShort(ctx.locale, d.sentAt)} />
        <Hero ctx={ctx} sticker={c.sticker} title={c.title} lead={c.lead} />
        {position ? <Stat label={c.statLabel} value={position} /> : null}
        <TeamRow ctx={ctx} title={c.team} members={TEAM[ctx.locale]} />
        <GiftIdeas ctx={ctx} copy={IDEAS_COPY[ctx.locale]} ideas={ideas} />
        <CTA href={`${d.siteUrl || ctx.site}${ROUTES.home[ctx.locale] || ROUTES.home.es}#reunion`}>{c.cta}</CTA>
        {d.referralUrl && (
          <Block style={{ paddingTop: 26 }}>
            <Eyebrow>{c.share}</Eyebrow>
            <P style={{ marginTop: 6, fontSize: 15 }}>{c.shareText}</P>
            <Text className="ac-gold" style={{ margin: '6px 0 0', fontFamily: F.mono, fontSize: 13, color: C.goldInk, wordBreak: 'break-all' }}>{d.referralUrl}</Text>
          </Block>
        )}
        <Signature ctx={ctx} line={c.signature} />
        <Footer ctx={ctx} kind="marketing" reason={c.reason} unsubscribeUrl={d.unsubscribeUrl} preferencesUrl={d.preferencesUrl} />
      </Layout>
    )
  },
}

// ── A3 · Así va la fila (posición y referidos) ──────────────────────────────────────────────────────
export const waitlistUpdate = {
  id: 'waitlist-update',
  phase: 'A',
  kind: 'marketing',
  tone: 'edición',
  title: { es: 'Así va la fila (posición y referidos)', en: 'Your place in line (position & referrals)', pt: 'Sua posição na fila (posição e indicações)' },
  when: 'Cuando sube de puesto por sus referidos, o como mucho una vez cada 2 semanas si hay novedad. Nunca si no cambió nada.',
  required: ['position', 'referralUrl'],
  sample: (locale) => ({ name: sampleName(locale), position: 212, previousPosition: 318, referrals: 3, referralUrl: 'https://agentceo.io/?ref=ana-7k2', unsubscribeUrl: 'https://agentceo.io/api/unsubscribe?t=EJEMPLO', sentAt: '2026-11-03T15:00:00Z' }),
  copy: {
    es: (d) => {
      const up = d.previousPosition > d.position
      const n = d.referrals || 0
      return {
        subject: up ? lead(d.name, `Subiste al puesto #${d.position} 🚀`) : lead(d.name, `Así va la fila: vas en el #${d.position}`),
        preheader: n
          ? `${n === 1 ? 'Una persona se apuntó' : `${n} personas se apuntaron`} con tu enlace. Y un tip para tu negocio mientras esperas.`
          : 'Así va la fila. Y un tip para tu negocio mientras esperas.',
        label: 'Así va la fila',
        title: up ? <>Vas <Em>subiendo.</Em></> : <>Así va <Em>la fila.</Em></>,
        lead: `${hi('es', d.name)} ${up ? `Estabas en el #${d.previousPosition} y ahora vas en el #${d.position}.` : `Sigues en el #${d.position}.`} Abrimos por grupos y te escribo en cuanto llegue el tuyo.`,
        statLabel: 'Tu lugar hoy',
        statSub: n ? `${n === 1 ? 'Una persona se apuntó' : `${n} personas se apuntaron`} con tu enlace. ¡Gracias por correr la voz!` : null,
        tipTitle: 'Prepara a tu equipo antes de que llegue',
        tip: 'Anota tus 3 preguntas más repetidas (precio, envío, horario) con la respuesta que das hoy. Cuando entres, se las enseñas a tu Vendedor en un minuto y responde como tú.',
        share: 'Tu enlace para compartir',
        shareText: d.boost ? `Cada persona que se apunta con tu enlace te sube ${d.boost} puestos.` : 'Quien se apunta con tu enlace llega de tu parte.',
        cta: 'Compartir por WhatsApp',
        waText: `Me apunté a Agent CEO, un equipo de empleados de IA para tu negocio. Apúntate con mi enlace: ${d.referralUrl}`,
        reason: 'Recibes este correo porque estás en la lista de espera de Agent CEO.',
      }
    },
    en: (d) => {
      const up = d.previousPosition > d.position
      const n = d.referrals || 0
      return {
        subject: up ? lead(d.name, `You moved up to #${d.position} 🚀`) : lead(d.name, `Your place in line: #${d.position}`),
        preheader: n
          ? `${n === 1 ? 'One person' : `${n} people`} joined with your link. Plus a tip for your business while you wait.`
          : 'Here’s how the line is moving. Plus a tip for your business while you wait.',
        label: 'Your place in line',
        title: up ? <>You’re <Em>moving up.</Em></> : <>Here’s <Em>the line.</Em></>,
        lead: `${hi('en', d.name)} ${up ? `you were #${d.previousPosition} and now you’re #${d.position}.` : `you’re still #${d.position}.`} We open in waves and I’ll write as soon as yours comes up.`,
        statLabel: 'Your spot today',
        statSub: n ? `${n === 1 ? 'One person' : `${n} people`} joined with your link. Thanks for spreading the word!` : null,
        tipTitle: 'Get your team ready before it arrives',
        tip: 'Write down your 3 most common questions (price, shipping, hours) with the answer you give today. Once you’re in, you teach them to your WhatsApp seller in a minute and it replies just like you.',
        share: 'Your link to share',
        shareText: d.boost ? `Every person who joins with your link moves you up ${d.boost} spots.` : 'Anyone who joins with your link comes in as your referral.',
        cta: 'Share on WhatsApp',
        waText: `I joined Agent CEO, a team of AI employees for your business. Join with my link: ${d.referralUrl}`,
        reason: 'You got this email because you’re on the Agent CEO waitlist.',
      }
    },
    pt: (d) => {
      const up = d.previousPosition > d.position
      const n = d.referrals || 0
      return {
        subject: up ? lead(d.name, `Você subiu para a posição #${d.position} 🚀`) : lead(d.name, `Sua posição na fila: #${d.position}`),
        preheader: n
          ? `${n === 1 ? 'Uma pessoa se inscreveu' : `${n} pessoas se inscreveram`} com o seu link. E uma dica para o seu negócio enquanto espera.`
          : 'Veja como está a fila. E uma dica para o seu negócio enquanto espera.',
        label: 'Como está a fila',
        title: up ? <>Você está <Em>subindo.</Em></> : <>Assim está <Em>a fila.</Em></>,
        lead: `${hi('pt', d.name)} ${up ? `Você estava na posição #${d.previousPosition} e agora está na #${d.position}.` : `Você continua na posição #${d.position}.`} Abrimos por grupos e te escrevo assim que chegar o seu.`,
        statLabel: 'Seu lugar hoje',
        statSub: n ? `${n === 1 ? 'Uma pessoa se inscreveu' : `${n} pessoas se inscreveram`} com o seu link. Obrigado por espalhar a notícia!` : null,
        tipTitle: 'Prepare sua equipe antes que ela chegue',
        tip: 'Anote suas 3 perguntas mais frequentes (preço, entrega, horário) com a resposta que você dá hoje. Quando entrar, você ensina isso ao seu Vendedor em um minuto e ele responde como você.',
        share: 'Seu link para compartilhar',
        shareText: d.boost ? `Cada pessoa que se inscreve com o seu link te faz subir ${d.boost} posições.` : 'Quem se inscreve com o seu link chega da sua parte.',
        cta: 'Compartilhar no WhatsApp',
        waText: `Entrei no Agent CEO, uma equipe de funcionários de IA para o seu negócio. Inscreva-se com o meu link: ${d.referralUrl}`,
        reason: 'Você recebeu este e-mail porque está na lista de espera do Agent CEO.',
      }
    },
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} title={c.title} lead={c.lead} />
      <Stat label={c.statLabel} value={`#${num(ctx.locale, d.position)}`} sub={c.statSub} />
      <Tip ctx={ctx} title={c.tipTitle}>{c.tip}</Tip>
      <Block style={{ paddingTop: 26 }}>
        <Eyebrow>{c.share}</Eyebrow>
        <P style={{ marginTop: 6, fontSize: 15 }}>{c.shareText}</P>
        <Text className="ac-gold" style={{ margin: '6px 0 0', fontFamily: F.mono, fontSize: 13, color: C.goldInk, wordBreak: 'break-all' }}>{d.referralUrl}</Text>
      </Block>
      <CTA href={`https://wa.me/?text=${encodeURIComponent(c.waText)}`}>{c.cta}</CTA>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="marketing" reason={c.reason} unsubscribeUrl={d.unsubscribeUrl} preferencesUrl={d.preferencesUrl} />
    </Layout>
  ),
}

// ── A4 · Invitación de lanzamiento (es tu turno) ────────────────────────────────────────────────────
export const launchInvite = {
  id: 'launch-invite',
  phase: 'A',
  kind: 'marketing',
  tone: 'celebración',
  title: { es: 'Invitación de lanzamiento (es tu turno)', en: 'Launch invite (it’s your turn)', pt: 'Convite de lançamento (é a sua vez)' },
  when: 'Cuando abre su grupo. Es el correo que la página de gracias promete («te escribimos apenas abra tu grupo»).',
  required: ['inviteUrl'],
  sample: (locale) => ({ name: sampleName(locale), inviteUrl: 'https://agentceo.io/entrar?i=EJEMPLO-no-real', expiresDays: 7, unsubscribeUrl: 'https://agentceo.io/api/unsubscribe?t=EJEMPLO', sentAt: '2026-11-17T14:00:00Z' }),
  copy: {
    es: (d) => ({
      subject: lead(d.name, 'Es tu turno: tu equipo de IA ya está listo'),
      preheader: 'Entra cuando quieras: tu CEO te espera para armar tu equipo contigo.',
      label: 'Es tu turno',
      sticker: '¡llegó!',
      title: <>Llegó <Em>tu grupo.</Em></>,
      lead: `${hi('es', d.name)} Abrimos la puerta a tu grupo y tu lugar está listo. Entra con este correo y tu CEO te recibe.`,
      cta: 'Entrar a Agent CEO',
      ctaNote: d.expiresDays ? `Tu invitación es personal y te espera ${d.expiresDays} días.` : 'Tu invitación es personal: no la reenvíes.',
      steps: 'Tus primeros pasos',
      items: [
        { title: 'Cuéntale a tu CEO de qué es tu negocio', text: 'O tu idea, si empiezas de cero. Con eso arma tu equipo.' },
        { title: 'Conecta tu WhatsApp', text: 'Con un código QR o con el número oficial de WhatsApp.' },
        { title: 'Aprueba lo primero que te propongan', text: 'Lo que cuesta dinero o no se puede deshacer, siempre te lo preguntan antes.' },
      ],
      giftTitle: 'Tu primer mensaje para tu CEO',
      gift: 'Tengo [TU NEGOCIO] en [CIUDAD]. Lo que más tiempo me quita es [TAREA]. Arma mi equipo y dime qué haría cada uno esta semana.',
      giftHint: 'Cópialo en el chat con tu CEO apenas entres.',
      bubble: 'Arranque es gratis y sin tarjeta: puedes probar con calma y subir de plan cuando quieras.',
      reason: 'Recibes este correo porque te apuntaste a la lista de espera de Agent CEO.',
    }),
    en: (d) => ({
      subject: lead(d.name, 'It’s your turn: your AI team is ready'),
      preheader: 'Come in whenever you like: your CEO is waiting to build your team with you.',
      label: 'Your turn',
      sticker: 'it’s here!',
      title: <>Your wave <Em>is open.</Em></>,
      lead: `${hi('en', d.name)} we’ve opened the door to your wave and your spot is ready. Sign in with this email and your CEO will meet you inside.`,
      cta: 'Enter Agent CEO',
      ctaNote: d.expiresDays ? `Your invite is personal and stays open for ${d.expiresDays} days.` : 'Your invite is personal: please don’t forward it.',
      steps: 'Your first steps',
      items: [
        { title: 'Tell your CEO what your business does', text: 'Or your idea, if you’re starting from scratch. That’s how it builds your team.' },
        { title: 'Connect your WhatsApp', text: 'With a QR code or the official WhatsApp number.' },
        { title: 'Approve the first thing they suggest', text: 'Anything that costs money or can’t be undone, they always ask you first.' },
      ],
      giftTitle: 'Your first message to your CEO',
      gift: 'I run [YOUR BUSINESS] in [CITY]. What eats most of my time is [TASK]. Build my team and tell me what each of them would do this week.',
      giftHint: 'Paste it into the chat with your CEO as soon as you’re in.',
      bubble: 'Arranque is free with no card required: take your time, and move up a plan whenever you like.',
      reason: 'You got this email because you joined the Agent CEO waitlist.',
    }),
    pt: (d) => ({
      subject: lead(d.name, 'É a sua vez: sua equipe de IA já está pronta'),
      preheader: 'Entre quando quiser: seu CEO está te esperando para montar sua equipe com você.',
      label: 'É a sua vez',
      sticker: 'chegou!',
      title: <>Chegou <Em>o seu grupo.</Em></>,
      lead: `${hi('pt', d.name)} Abrimos a porta para o seu grupo e o seu lugar está pronto. Entre com este e-mail e seu CEO te recebe.`,
      cta: 'Entrar no Agent CEO',
      ctaNote: d.expiresDays ? `Seu convite é pessoal e fica disponível por ${d.expiresDays} dias.` : 'Seu convite é pessoal: não o encaminhe.',
      steps: 'Seus primeiros passos',
      items: [
        { title: 'Conte ao seu CEO do que é o seu negócio', text: 'Ou a sua ideia, se está começando do zero. Com isso ele monta sua equipe.' },
        { title: 'Conecte seu WhatsApp', text: 'Com um código QR ou com o número oficial do WhatsApp.' },
        { title: 'Aprove a primeira coisa que te propuserem', text: 'O que custa dinheiro ou não dá para desfazer, sempre te perguntam antes.' },
      ],
      giftTitle: 'Sua primeira mensagem para o seu CEO',
      gift: 'Tenho [SEU NEGÓCIO] em [CIDADE]. O que mais toma o meu tempo é [TAREFA]. Monte minha equipe e me diga o que cada um faria esta semana.',
      giftHint: 'Cole no chat com o seu CEO assim que entrar.',
      bubble: 'O Arranque é grátis e sem cartão: você pode testar com calma e mudar de plano quando quiser.',
      reason: 'Você recebeu este e-mail porque se inscreveu na lista de espera do Agent CEO.',
    }),
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} sticker={c.sticker} title={c.title} lead={c.lead} />
      <CTA href={d.inviteUrl} note={c.ctaNote}>{c.cta}</CTA>
      <Steps title={c.steps} items={c.items} />
      <PromptCard ctx={ctx} title={c.giftTitle} prompt={c.gift} hint={c.giftHint} />
      <Bubble ctx={ctx}>{c.bubble}</Bubble>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="marketing" reason={c.reason} unsubscribeUrl={d.unsubscribeUrl} preferencesUrl={d.preferencesUrl} />
    </Layout>
  ),
}

export default [waitlistConfirm, waitlistWelcome, waitlistUpdate, launchInvite]
