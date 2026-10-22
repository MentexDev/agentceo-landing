// FASE B · cuenta y seguridad (llegan con la app). Tono sobrio: un botón, el dato y la nota de «si no fuiste tú».
import { Layout, Header, Hero, Em, CTA, LinkFallback, PromptCard, Tip, Steps, Stat, Facts, Note, Signature, Footer } from '../components.jsx'
import { fmtShort, fmtDateTime, hi, lead, tr } from '../format.js'

const sampleName = (locale) => tr(locale, 'Ana', 'Sam', 'Ana')

// ── B1 · Bienvenida a la cuenta + primeros pasos ────────────────────────────────────────────────────
export const accountWelcome = {
  id: 'account-welcome',
  phase: 'B',
  kind: 'transactional',
  tone: 'celebración',
  title: { es: 'Bienvenida a la cuenta + primeros pasos', en: 'Account welcome + onboarding', pt: 'Boas-vindas à conta + primeiros passos' },
  when: 'Al crear la cuenta (tras verificar el correo). Una sola vez.',
  required: ['appUrl'],
  sample: (locale) => ({ name: sampleName(locale), appUrl: 'https://app.agentceo.io', sentAt: '2026-11-17T15:10:00Z' }),
  copy: {
    es: (d) => ({
      subject: lead(d.name, 'Te damos la bienvenida a Agent CEO'),
      preheader: 'Tres pasos para tu primera semana y un prompt para estrenar a tu CEO.',
      label: 'Bienvenida',
      sticker: '¡hola!',
      title: <>Tu equipo <Em>ya está aquí.</Em></>,
      lead: `${hi('es', d.name)} Tu cuenta está lista. Esto es lo que te recomiendo para tu primera semana:`,
      steps: 'Tu primera semana',
      items: [
        { title: 'Conecta tu WhatsApp', text: 'Tu Vendedor responde a cualquier hora, con el tono de tu marca.' },
        { title: 'Enciende una automatización', text: 'Por ejemplo, el resumen de ventas cada mañana. Se enciende con un botón.' },
        { title: 'Lee el acta de mañana', text: 'Tu equipo se reúne solo y te cuenta qué hizo, qué sigue y qué espera tu aprobación.' },
      ],
      cta: 'Entrar a Agent CEO',
      giftTitle: 'Pídeselo a tu CEO',
      gift: 'Revisa lo que vendí la última semana y dime qué producto debería empujar en redes, y por qué.',
      giftHint: 'Escríbeselo en el chat. Te responde con una propuesta y, si hay que publicar algo, te pide permiso antes.',
      reason: 'Recibes este correo porque acabas de crear tu cuenta de Agent CEO.',
    }),
    en: (d) => ({
      subject: lead(d.name, 'Welcome to Agent CEO'),
      preheader: 'Three steps for your first week and a prompt to break in your CEO.',
      label: 'Welcome',
      sticker: 'hello!',
      title: <>Your team <Em>is here.</Em></>,
      lead: `${hi('en', d.name)} your account is ready. Here’s what I recommend for your first week:`,
      steps: 'Your first week',
      items: [
        { title: 'Connect your WhatsApp', text: 'Your WhatsApp seller replies any time, in your brand’s voice.' },
        { title: 'Turn on an automation', text: 'For example, the morning sales summary. One tap and it’s on.' },
        { title: 'Read tomorrow’s minutes', text: 'Your team meets on its own and tells you what it did, what’s next and what needs your approval.' },
      ],
      cta: 'Enter Agent CEO',
      giftTitle: 'Ask your CEO',
      gift: 'Look at what I sold last week and tell me which product I should push on social media, and why.',
      giftHint: 'Type it into the chat. You’ll get a proposal, and if anything needs posting, it asks your permission first.',
      reason: 'You got this email because you just created your Agent CEO account.',
    }),
    pt: (d) => ({
      subject: lead(d.name, 'Boas-vindas ao Agent CEO'),
      preheader: 'Três passos para a sua primeira semana e um prompt para estrear o seu CEO.',
      label: 'Boas-vindas',
      sticker: 'olá!',
      title: <>Sua equipe <Em>já chegou.</Em></>,
      lead: `${hi('pt', d.name)} Sua conta está pronta. Isto é o que eu recomendo para a sua primeira semana:`,
      steps: 'Sua primeira semana',
      items: [
        { title: 'Conecte o seu WhatsApp', text: 'Seu Vendedor responde a qualquer hora, com o tom da sua marca.' },
        { title: 'Ative uma automação', text: 'Por exemplo, o resumo de vendas toda manhã. Liga com um botão.' },
        { title: 'Leia a ata de amanhã', text: 'Sua equipe se reúne sozinha e te conta o que fez, o que vem agora e o que espera a sua aprovação.' },
      ],
      cta: 'Entrar no Agent CEO',
      giftTitle: 'Peça ao seu CEO',
      gift: 'Veja o que eu vendi na última semana e me diga qual produto eu deveria impulsionar nas redes, e por quê.',
      giftHint: 'Escreva isso no chat. Ele te responde com uma proposta e, se precisar publicar algo, pede a sua permissão antes.',
      reason: 'Você recebeu este e-mail porque acabou de criar a sua conta no Agent CEO.',
    }),
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} sticker={c.sticker} title={c.title} lead={c.lead} />
      <Steps title={c.steps} items={c.items} />
      <CTA href={d.appUrl}>{c.cta}</CTA>
      <PromptCard ctx={ctx} title={c.giftTitle} prompt={c.gift} hint={c.giftHint} />
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} preferencesUrl={d.preferencesUrl} />
    </Layout>
  ),
}

// ── B2 · Enlace mágico / verificación ───────────────────────────────────────────────────────────────
export const magicLink = {
  id: 'magic-link',
  phase: 'B',
  kind: 'transactional',
  tone: 'sobrio',
  title: { es: 'Enlace para entrar / verificar el correo', en: 'Magic link / email verification', pt: 'Link de acesso / verificação do e-mail' },
  when: 'Cada vez que alguien pide entrar sin contraseña o verifica su correo. Sirve una vez.',
  required: ['loginUrl'],
  sample: (locale) => ({ loginUrl: 'https://app.agentceo.io/auth/magic?t=EJEMPLO-no-real', code: '482 913', expiresMinutes: 15, device: tr(locale, 'Chrome en macOS', 'Chrome on macOS', 'Chrome no macOS'), location: 'Bogotá, Colombia', sentAt: '2026-11-17T15:02:00Z' }),
  copy: {
    es: (d) => ({
      subject: 'Tu enlace para entrar a Agent CEO',
      preheader: d.code ? `Tu código: ${d.code}. Caduca en ${d.expiresMinutes ?? 15} minutos.` : `Un toque y entras. Caduca en ${d.expiresMinutes ?? 15} minutos.`,
      label: 'Tu cuenta',
      title: <>Tu llave <Em>para entrar.</Em></>,
      lead: 'Ni contraseñas que recordar: toca el botón y entras. El enlace sirve una sola vez.',
      codeLabel: 'O escribe este código',
      cta: 'Entrar a Agent CEO',
      ctaNote: `Caduca en ${d.expiresMinutes ?? 15} minutos.`,
      facts: [['Lo pidió', d.device], ['Desde (aprox.)', d.location]].filter(([, v]) => v),
      note: '¿No lo pediste tú? Ignora este correo: sin tocar el enlace, nadie entra a tu cuenta.',
      reason: 'Recibes este correo porque alguien pidió entrar a Agent CEO con esta dirección.',
    }),
    en: (d) => ({
      subject: 'Your link to sign in to Agent CEO',
      preheader: d.code ? `Your code: ${d.code}. It expires in ${d.expiresMinutes ?? 15} minutes.` : `One tap and you’re in. It expires in ${d.expiresMinutes ?? 15} minutes.`,
      label: 'Your account',
      title: <>Your key <Em>to get in.</Em></>,
      lead: 'No passwords to remember: tap the button and you’re in. The link works only once.',
      codeLabel: 'Or type this code',
      cta: 'Sign in to Agent CEO',
      ctaNote: `It expires in ${d.expiresMinutes ?? 15} minutes.`,
      facts: [['Requested from', d.device], ['Location (approx.)', d.location]].filter(([, v]) => v),
      note: 'Didn’t ask for this? Ignore this email: without the link, nobody gets into your account.',
      reason: 'You got this email because someone asked to sign in to Agent CEO with this address.',
    }),
    pt: (d) => ({
      subject: 'Seu link para entrar no Agent CEO',
      preheader: d.code ? `Seu código: ${d.code}. Expira em ${d.expiresMinutes ?? 15} minutos.` : `Um toque e você entra. Expira em ${d.expiresMinutes ?? 15} minutos.`,
      label: 'Sua conta',
      title: <>Sua chave <Em>para entrar.</Em></>,
      lead: 'Nada de senhas para lembrar: toque no botão e pronto, você entra. O link funciona uma única vez.',
      codeLabel: 'Ou digite este código',
      cta: 'Entrar no Agent CEO',
      ctaNote: `Expira em ${d.expiresMinutes ?? 15} minutos.`,
      facts: [['Pedido em', d.device], ['De onde (aprox.)', d.location]].filter(([, v]) => v),
      note: 'Não foi você que pediu? Ignore este e-mail: sem tocar no link, ninguém entra na sua conta.',
      reason: 'Você recebeu este e-mail porque alguém pediu para entrar no Agent CEO com este endereço.',
    }),
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} title={c.title} lead={c.lead} />
      <CTA href={d.loginUrl} note={c.ctaNote}>{c.cta}</CTA>
      {d.code && <Stat label={c.codeLabel} value={d.code} />}
      <LinkFallback ctx={ctx} href={d.loginUrl} />
      {c.facts.length > 0 && <Facts rows={c.facts} />}
      <Note>{c.note}</Note>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} />
    </Layout>
  ),
}

// ── B3 · Restablecer la contraseña ──────────────────────────────────────────────────────────────────
export const passwordReset = {
  id: 'password-reset',
  phase: 'B',
  kind: 'transactional',
  tone: 'sobrio',
  title: { es: 'Restablecer la contraseña', en: 'Password reset', pt: 'Redefinir a senha' },
  when: 'Cuando alguien pide «olvidé mi contraseña». Sirve una vez.',
  required: ['resetUrl'],
  sample: (locale) => ({ name: sampleName(locale), resetUrl: 'https://app.agentceo.io/auth/reset?t=EJEMPLO-no-real', expiresMinutes: 60, device: tr(locale, 'Safari en iPhone', 'Safari on iPhone', 'Safari no iPhone'), location: 'Medellín, Colombia', sentAt: '2026-11-18T13:12:00Z' }),
  copy: {
    es: (d) => ({
      subject: lead(d.name, 'Aquí tienes el enlace para tu contraseña nueva'),
      preheader: `Sirve una vez y caduca en ${d.expiresMinutes ?? 60} minutos. Hasta entonces, tu contraseña de siempre sigue funcionando.`,
      label: 'Tu cuenta',
      title: <>Una contraseña nueva, <Em>en un minuto.</Em></>,
      lead: 'Elige una contraseña nueva con este botón. Hasta que lo hagas, la de siempre sigue funcionando.',
      cta: 'Elegir contraseña nueva',
      ctaNote: `El enlace sirve una vez y caduca en ${d.expiresMinutes ?? 60} minutos.`,
      facts: [['Lo pidió', d.device], ['Desde (aprox.)', d.location]].filter(([, v]) => v),
      tipTitle: 'Una contraseña fuerte',
      tip: 'Cuatro palabras al azar («tortuga lámpara nube cobre») son más fuertes y más fáciles de recordar que «Clave123!». Y mejor aún con un gestor de contraseñas.',
      note: '¿No lo pediste tú? Ignora este correo: tu contraseña no cambia.',
      reason: 'Recibes este correo porque alguien pidió cambiar la contraseña de tu cuenta de Agent CEO.',
    }),
    en: (d) => ({
      subject: lead(d.name, 'Here’s the link for your new password'),
      preheader: `It works once and expires in ${d.expiresMinutes ?? 60} minutes. Until then, your current password still works.`,
      label: 'Your account',
      title: <>A new password, <Em>in a minute.</Em></>,
      lead: 'Choose a new password with this button. Until you do, your current one still works.',
      cta: 'Choose a new password',
      ctaNote: `The link works once and expires in ${d.expiresMinutes ?? 60} minutes.`,
      facts: [['Requested from', d.device], ['Location (approx.)', d.location]].filter(([, v]) => v),
      tipTitle: 'A strong password',
      tip: 'Four random words ("turtle lamp cloud copper") are stronger and easier to remember than "Password123!". Even better with a password manager.',
      note: 'Didn’t ask for this? Ignore this email: your password stays the same.',
      reason: 'You got this email because someone asked to reset the password of your Agent CEO account.',
    }),
    pt: (d) => ({
      subject: lead(d.name, 'Aqui está o link para a sua nova senha'),
      preheader: `Funciona uma vez e expira em ${d.expiresMinutes ?? 60} minutos. Até lá, a sua senha de sempre continua valendo.`,
      label: 'Sua conta',
      title: <>Uma senha nova, <Em>em um minuto.</Em></>,
      lead: 'Escolha uma senha nova com este botão. Enquanto você não fizer isso, a de sempre continua funcionando.',
      cta: 'Escolher uma senha nova',
      ctaNote: `O link funciona uma vez e expira em ${d.expiresMinutes ?? 60} minutos.`,
      facts: [['Pedido em', d.device], ['De onde (aprox.)', d.location]].filter(([, v]) => v),
      tipTitle: 'Uma senha forte',
      tip: 'Quatro palavras aleatórias (“tartaruga lâmpada nuvem cobre”) são mais fortes e mais fáceis de lembrar do que “Senha123!”. E melhor ainda com um gerenciador de senhas.',
      note: 'Não foi você que pediu? Ignore este e-mail: a sua senha não muda.',
      reason: 'Você recebeu este e-mail porque alguém pediu para trocar a senha da sua conta no Agent CEO.',
    }),
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} title={c.title} lead={c.lead} />
      <CTA href={d.resetUrl} note={c.ctaNote}>{c.cta}</CTA>
      <LinkFallback ctx={ctx} href={d.resetUrl} />
      {c.facts.length > 0 && <Facts rows={c.facts} />}
      <Tip ctx={ctx} title={c.tipTitle}>{c.tip}</Tip>
      <Note>{c.note}</Note>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} />
    </Layout>
  ),
}

// ── B11 · Alerta de seguridad (nuevo inicio de sesión) ──────────────────────────────────────────────
export const securityAlert = {
  id: 'security-alert',
  phase: 'B',
  kind: 'transactional',
  tone: 'sobrio',
  title: { es: 'Alerta de seguridad (inicio de sesión nuevo)', en: 'Security alert (new sign-in)', pt: 'Alerta de segurança (novo acesso)' },
  when: 'Cuando alguien entra desde un dispositivo o país que no habíamos visto. No se puede apagar.',
  required: ['secureUrl', 'when', 'device'],
  sample: (locale) => ({ name: sampleName(locale), when: '2026-11-19T03:02:00Z', device: 'iPhone · Safari', location: tr(locale, 'Lima, Perú', 'Lima, Peru', 'Lima, Peru'), ipPartial: '181.49.•••.•••', timeZone: 'America/Lima', secureUrl: 'https://app.agentceo.io/auth/secure?t=EJEMPLO-no-real', sentAt: '2026-11-19T03:03:00Z' }),
  copy: {
    es: (d) => ({
      subject: lead(d.name, 'Entraron a tu cuenta desde un dispositivo nuevo'),
      preheader: `${d.device}${d.location ? ` · ${d.location}` : ''}. Si fuiste tú, no tienes que hacer nada.`,
      label: 'Seguridad',
      title: d.name ? <>¿Fuiste tú, <Em>{d.name}?</Em></> : <>¿Fuiste <Em>tú?</Em></>,
      lead: 'Alguien entró a tu cuenta desde un dispositivo que no conocíamos. Si fuiste tú, todo bien: la próxima vez ya lo reconozco.',
      facts: [[d.timeZone ? 'Cuándo' : 'Cuándo (UTC)', fmtDateTime('es', d.when, d.timeZone)], ['Dispositivo', d.device], ['Lugar (aprox.)', d.location], ['IP', d.ipPartial]].filter(([, v]) => v),
      cta: 'No fui yo: proteger mi cuenta',
      ctaNote: 'Cerramos esa sesión y te pedimos una contraseña nueva.',
      note: 'Nunca te pediremos tu contraseña ni un código por correo, chat o teléfono. Si alguien lo hace en nuestro nombre, no es Agent CEO.',
      reason: 'Los avisos de seguridad no se pueden apagar: son para proteger tu cuenta.',
    }),
    en: (d) => ({
      subject: lead(d.name, 'Someone signed in to your account from a new device'),
      preheader: `${d.device}${d.location ? ` · ${d.location}` : ''}. If it was you, there’s nothing to do.`,
      label: 'Security',
      title: d.name ? <>Was that you, <Em>{d.name}?</Em></> : <>Was that <Em>you?</Em></>,
      lead: 'Someone signed in to your account from a device we hadn’t seen before. If it was you, all good: next time I’ll recognize it.',
      facts: [[d.timeZone ? 'When' : 'When (UTC)', fmtDateTime('en', d.when, d.timeZone)], ['Device', d.device], ['Location (approx.)', d.location], ['IP', d.ipPartial]].filter(([, v]) => v),
      cta: 'Not me: secure my account',
      ctaNote: 'We’ll close that session and ask you for a new password.',
      note: 'We will never ask for your password or a code by email, chat or phone. If someone does in our name, it isn’t Agent CEO.',
      reason: 'Security alerts can’t be turned off: they’re there to protect your account.',
    }),
    pt: (d) => ({
      subject: lead(d.name, 'Alguém entrou na sua conta por um dispositivo novo'),
      preheader: `${d.device}${d.location ? ` · ${d.location}` : ''}. Se foi você, não precisa fazer nada.`,
      label: 'Segurança',
      title: d.name ? <>Foi você, <Em>{d.name}?</Em></> : <>Foi <Em>você?</Em></>,
      lead: 'Alguém entrou na sua conta por um dispositivo que a gente não conhecia. Se foi você, tudo certo: da próxima vez eu já reconheço.',
      facts: [[d.timeZone ? 'Quando' : 'Quando (UTC)', fmtDateTime('pt', d.when, d.timeZone)], ['Dispositivo', d.device], ['Local (aprox.)', d.location], ['IP', d.ipPartial]].filter(([, v]) => v),
      cta: 'Não fui eu: proteger minha conta',
      ctaNote: 'A gente encerra essa sessão e te pede uma senha nova.',
      note: 'Nunca vamos pedir a sua senha nem um código por e-mail, chat ou telefone. Se alguém fizer isso em nosso nome, não é o Agent CEO.',
      reason: 'Os alertas de segurança não podem ser desativados: eles existem para proteger a sua conta.',
    }),
  },
  Email: ({ c, d, ctx }) => (
    <Layout ctx={ctx} preheader={c.preheader}>
      <Header label={c.label} date={fmtShort(ctx.locale, d.sentAt)} />
      <Hero ctx={ctx} title={c.title} lead={c.lead} />
      <Facts rows={c.facts} />
      <CTA href={d.secureUrl} note={c.ctaNote}>{c.cta}</CTA>
      <Note tone="alert">{c.note}</Note>
      <Signature ctx={ctx} />
      <Footer ctx={ctx} kind="transactional" reason={c.reason} />
    </Layout>
  ),
}

export default [accountWelcome, magicLink, passwordReset, securityAlert]
