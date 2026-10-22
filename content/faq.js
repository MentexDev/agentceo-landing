// ─────────────────────────────────────────────────────────────────────────────
// FAQ FUSIONADA de Agent CEO (brief §4). Una sola fuente para:
//   · la sección S18 de la portada (y su schema FAQPage),
//   · el widget de soporte (su base de conocimiento),
//   · /llms.txt y /llms-full.txt.
//
// Origen de cada respuesta (nada inventado):
//   [v1]  FAQ de la home v1 (design/legacy/index.html §FAQ, 5 preguntas)
//   [S18] FAQ del prototipo (design/prototype/src/desktop/S18PreguntasFrecuentes.jsx, 12)
//   [PRI] content/legal/privacidad.md §4 · [SEG] content/legal/seguridad.md §7
//   [TER] content/legal/terminos.md §1 · [ENT] entidad Klinworks, LLC (privacidad.md, cabecera)
//
//   [PRE] content/precios.js — precios de la app (datos de Luca/Diego, 2026-10-20)
// ─────────────────────────────────────────────────────────────────────────────

export const FAQ = [
  {
    id: 'que-es',
    src: '[ENT][TER]',
    q: {
      es: '¿Qué es Agent CEO y quién está detrás?',
      en: 'What is Agent CEO and who is behind it?',
      pt: 'O que é o Agent CEO e quem está por trás dele?',
    },
    a: {
      es: 'Agent CEO es una plataforma donde armas un equipo de empleados de IA que trabajan en tu negocio: venden por WhatsApp, cuidan tu tienda y crean contenido. La desarrolla Klinworks, LLC.',
      en: 'Agent CEO is a platform where you build a team of AI employees that work in your business: they sell on WhatsApp, look after your store and create content. It\'s built by Klinworks, LLC.',
      pt: 'O Agent CEO é uma plataforma onde você monta uma equipe de funcionários de IA que trabalham no seu negócio: vendem pelo WhatsApp, cuidam da sua loja e criam conteúdo. Quem desenvolve é a Klinworks, LLC.',
    },
  },
  {
    id: 'agente',
    src: '[S18][TER]',
    q: { es: '¿Qué es un agente?', en: 'What is an agent?', pt: 'O que é um agente?' },
    a: {
      es: 'Un asistente de inteligencia artificial que hace un trabajo concreto, como responder mensajes o revisar el inventario. Piensa en él como un empleado digital: no te sugiere qué hacer, lo hace en tus herramientas.',
      en: 'An artificial intelligence assistant that does a specific job, like answering messages or checking inventory. Think of it as a digital employee: it doesn’t suggest what to do, it does it in your tools.',
      pt: 'Um assistente de inteligência artificial que faz um trabalho específico, como responder mensagens ou conferir o estoque. Pense nele como um funcionário digital: ele não sugere o que fazer, ele faz, direto nas suas ferramentas.',
    },
  },
  {
    id: 'programar',
    src: '[v1][S18]',
    q: { es: '¿Tengo que saber de tecnología o programar?', en: 'Do I need to know about technology or coding?', pt: 'Preciso entender de tecnologia ou saber programar?' },
    a: {
      es: 'No. Le escribes como le escribirías a una persona de tu equipo. No hay prompts que aprender ni código que escribir.',
      en: 'No. You write to it as you would to a person on your team. There are no prompts to learn and no code to write.',
      pt: 'Não. Você escreve para ele como escreveria para alguém da sua equipe. Não tem prompt para aprender nem código para escrever.',
    },
  },
  {
    id: 'solos',
    src: '[v1][S18][SEG]',
    q: { es: '¿Hacen cosas sin avisarme?', en: 'Do they do things without telling me?', pt: 'Eles fazem coisas sem me avisar?' },
    a: {
      es: 'Solo lo que tú les permitas. Trabajan por su cuenta en lo rutinario, y lo importante, como gastar dinero, te lo preguntan siempre. Una acción sin permiso asignado se bloquea por defecto.',
      en: 'Only what you allow. They work on their own on routine tasks, and anything important, like spending money, they always ask you first. An action without an assigned permission is blocked by default.',
      pt: 'Só o que você permitir. Eles trabalham sozinhos no que é rotina, e o que é importante, como gastar dinheiro, eles sempre perguntam antes. Uma ação sem permissão atribuída fica bloqueada por padrão.',
    },
  },
  {
    id: 'whatsapp',
    src: '[S18]',
    q: { es: '¿Funciona con WhatsApp?', en: 'Does it work with WhatsApp?', pt: 'Funciona com o WhatsApp?' },
    a: {
      es: 'Sí. Responde a tus clientes a cualquier hora, cierra ventas y te avisa cuando algo necesita tu firma.',
      en: 'Yes. It answers your customers at any hour, closes sales and lets you know when something needs your sign-off.',
      pt: 'Sim. Ele responde aos seus clientes a qualquer hora, fecha vendas e te avisa quando algo precisa da sua aprovação.',
    },
  },
  {
    id: 'shopify',
    src: '[S18]',
    q: { es: '¿Sirve con mi tienda Shopify?', en: 'Does it work with my Shopify store?', pt: 'Funciona com a minha loja Shopify?' },
    a: {
      es: 'Sí. Conectas tu tienda y vigila pedidos, carritos abandonados y stock.',
      en: 'Yes. You connect your store and it watches orders, abandoned carts and stock.',
      pt: 'Sim. Você conecta a sua loja e ele fica de olho nos pedidos, nos carrinhos abandonados e no estoque.',
    },
  },
  {
    id: 'herramientas',
    src: '[v1]',
    q: { es: '¿A qué herramientas se conecta?', en: 'Which tools does it connect to?', pt: 'Com quais ferramentas ele se conecta?' },
    a: {
      es: 'A las que ya usas: Shopify, WhatsApp, Gmail, Google Drive, correo masivo y más. Tus agentes trabajan directamente sobre ellas; no te devuelven texto para que lo pegues tú.',
      en: 'The ones you already use: Shopify, WhatsApp, Gmail, Google Drive, bulk email and more. Your agents work directly in them; they don’t hand you text to paste yourself.',
      pt: 'Com as que você já usa: Shopify, WhatsApp, Gmail, Google Drive, e-mail em massa e outras. Seus agentes trabalham direto nelas; não te devolvem um texto para você colar.',
    },
  },
  {
    id: 'web',
    src: '[S18]',
    q: { es: '¿Puede crearme una web o una app?', en: 'Can it build me a website or an app?', pt: 'Ele pode criar um site ou um app para mim?' },
    a: {
      es: 'Sí. La Forja la construye contigo y tú la publicas con tu GitHub y tu Vercel.',
      en: 'Yes. The Forge builds it with you and you publish it with your own GitHub and Vercel.',
      pt: 'Sim. A Forja constrói com você, e você publica com o seu próprio GitHub e a sua Vercel.',
    },
  },
  {
    id: 'no-me-gusta',
    src: '[S18]',
    q: { es: '¿Y si no me gusta lo que hizo?', en: 'What if I don’t like what it did?', pt: 'E se eu não gostar do que ele fez?' },
    a: {
      es: 'Lo rechazas o le pides cambios con tus palabras. Cada corrección lo hace mejor.',
      en: 'You reject it or ask for changes in your own words. Every correction makes it better.',
      pt: 'Você recusa ou pede ajustes com as suas palavras. Cada correção o deixa melhor.',
    },
  },
  {
    id: 'atasca',
    src: '[S18]',
    q: { es: '¿Y si algo se atasca?', en: 'What if something gets stuck?', pt: 'E se alguma coisa travar?' },
    a: {
      es: 'Te lo muestra en una lista, junto con el motivo. Nada se queda escondido.',
      en: 'It shows it to you in a list, along with the reason. Nothing stays hidden.',
      pt: 'Ele te mostra isso em uma lista, junto com o motivo. Nada fica escondido.',
    },
  },
  {
    id: 'datos',
    src: '[v1][S18]',
    q: { es: '¿Mis datos están seguros?', en: 'Is my data safe?', pt: 'Meus dados estão seguros?' },
    a: {
      es: 'Tu información es tuya. Cada empresa está aislada de las demás, tú decides qué conectas y lo puedes desconectar cuando quieras.',
      en: 'Your information is yours. Each company is isolated from the others, you decide what you connect and you can disconnect it whenever you want.',
      pt: 'As suas informações são suas. Cada empresa fica isolada das outras, você decide o que conecta e pode desconectar quando quiser.',
    },
  },
  {
    id: 'datos-ia',
    src: '[PRI][SEG]',
    q: { es: '¿Usan mis datos para entrenar modelos de IA?', en: 'Do you use my data to train AI models?', pt: 'Vocês usam meus dados para treinar modelos de IA?' },
    a: {
      es: 'No. No entrenamos modelos con tu contenido, ni propios ni de terceros, y nuestros contratos con los proveedores de modelos les prohíben usarlo para entrenamiento.',
      en: 'No. We don’t train models on your content, neither our own nor third-party ones, and our contracts with model providers forbid them from using it for training.',
      pt: 'Não. Não treinamos modelos com o seu conteúdo, nem próprios nem de terceiros, e nossos contratos com os provedores de modelos os proíbem de usá-lo para treinamento.',
    },
    more: 'legal:privacidad',
  },
  {
    id: 'varios-negocios',
    src: '[S18]',
    q: { es: '¿Puedo manejar varios negocios?', en: 'Can I run several businesses?', pt: 'Posso gerenciar vários negócios?' },
    a: {
      es: 'Sí. La pantalla principal te los resume todos.',
      en: 'Yes. The main screen sums them all up for you.',
      pt: 'Sim. A tela principal resume todos eles para você.',
    },
  },
  {
    id: 'precio',
    src: '[PRE] content/precios.js (precios de la app, 2026-10-20)',
    q: { es: '¿Cuánto cuesta?', en: 'How much does it cost?', pt: 'Quanto custa?' },
    a: {
      es: 'El plan Arranque es gratis: 300 créditos por semana, 1 usuario y sin tarjeta. Los planes de pago son Impulso ($29 al mes), Motor ($99) e Imperio ($249). Todos tienen agentes sin límite y los créditos se renuevan cada lunes.',
      en: 'The Arranque plan is free: 300 credits per week, 1 user and no card. The paid plans are Impulso ($29 a month), Motor ($99) and Imperio ($249). All of them include unlimited agents, and credits renew every Monday.',
      pt: 'O plano Arranque é grátis: 300 créditos por semana, 1 usuário e sem cartão. Os planos pagos são Impulso ($29 por mês), Motor ($99) e Imperio ($249). Todos têm agentes sem limite, e os créditos se renovam toda segunda-feira.',
    },
    more: 'precios',
    cta: 'waitlist',
  },
  {
    id: 'cuando',
    src: '[S18]',
    q: { es: '¿Cuándo abre?', en: 'When does it open?', pt: 'Quando abre?' },
    a: {
      es: 'Estamos abriendo por grupos. Por eso la lista: los primeros en apuntarse entran primero.',
      en: 'We are opening in waves. That’s why there’s a waitlist: the first to sign up get in first.',
      pt: 'Estamos abrindo por etapas. Por isso existe a lista: quem se inscreve primeiro entra primeiro.',
    },
    cta: 'waitlist',
  },
]
