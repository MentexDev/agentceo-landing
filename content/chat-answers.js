// ─────────────────────────────────────────────────────────────────────────────
// RESPUESTAS CURADAS del widget «Tu CEO» (T35, Diego: «las preguntas comunes nunca llegan al
// LLM»). Escritas de antemano, en tono de fundador cálido y CORTAS (≤ 45 palabras), solo con lo
// publicado en la web (content/faq.js, content/precios.js y content/chat-knowledge.js). Se sirven
// al instante y con coste 0 de LLM:
//   · al pulsar un chip (el cliente manda su `chip` = id de aquí), y
//   · ante texto libre que case con alta confianza (worker/chat/curated.js, umbral calibrado).
// `ref`: el fragmento del sitio (worker/generated/knowledge.json) que da la procedencia visible
// (título y enlace). `ask`: formas de preguntarlo (para casar texto libre; la primera de cada
// idioma es la canónica). `keys`: términos ANCLA: sin al menos uno, nunca se casa.
// Los precios salen de content/precios.js: si cambian, cambian aquí solos y la versión de la caché
// (worker/generated/content-version.json) también.
// ⛔ Nada de secretos, arquitectura interna, clientes ni roadmap (lo vigila tests/worker/chat-curated.test.js).
// ─────────────────────────────────────────────────────────────────────────────
import { PLANS, PACKS } from './precios.js'

const plan = (id) => PLANS.find((p) => p.id === id)
const pack = (id) => PACKS.find((p) => p.id === id)
const n = (v, lang) => v.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')
const P = { arranque: plan('arranque'), impulso: plan('impulso'), motor: plan('motor'), imperio: plan('imperio') }
const K = { chispa: pack('chispa'), envion: pack('envion'), turbina: pack('turbina'), reserva: pack('reserva') }

export const ANSWERS = [
  {
    id: 'precio',
    ref: 'faq:precio',
    cta: 'waitlist',
    keys: ['precio', 'cuesta', 'cuanto', 'vale', 'cobran', 'pagar', 'gratis', 'cost', 'price', 'pricing', 'free', 'pay'],
    ask: {
      es: ['¿Cuánto cuesta?', '¿Cuánto cuesta Agent CEO?', '¿Qué precio tiene?', '¿Cuánto vale?', '¿Es gratis?', '¿Cuánto cobran?', 'precios', '¿Cuánto hay que pagar?', '¿Cuál es el costo?', 'tarifas'],
      en: ['How much does it cost?', 'How much is Agent CEO?', "What's the price?", 'Is it free?', 'pricing', 'How much do I pay?', 'What does it cost?'],
    },
    a: {
      es: `¡Buena pregunta! Arranque es gratis: ${n(P.arranque.credits, 'es')} créditos por semana, 1 usuario y sin tarjeta. Cuando crezcas: Impulso ($${P.impulso.price} al mes), Motor ($${P.motor.price}) e Imperio ($${P.imperio.price}). Todos con agentes sin límite. ¿Te guardo un sitio en la lista?`,
      en: `Good question! Arranque is free: ${n(P.arranque.credits, 'en')} credits a week, 1 user, no card. As you grow: Impulso ($${P.impulso.price}/month), Motor ($${P.motor.price}) and Imperio ($${P.imperio.price}). Every plan has unlimited agents. Want me to save you a spot on the waitlist?`,
    },
  },
  {
    id: 'planes',
    ref: 'pricing',
    cta: 'waitlist',
    // (`plan`/`planes` no sirven de ancla: search.js los traduce a «precio» y empatarían con esa ficha.)
    keys: ['impulso', 'motor', 'imperio', 'arranque', 'incluye', 'diferencia', 'equipo grande', 'personas', 'usuarios', 'includes', 'difference', 'team', 'people', 'users', 'seats'],
    ask: {
      es: ['¿Qué incluye cada plan?', '¿Qué incluye el plan Impulso?', '¿Qué diferencia hay entre los planes?', '¿Hay un plan para un equipo grande?', '¿Cuántas personas pueden entrar?', '¿Cuántos usuarios incluye?', 'comparar planes', '¿Qué trae el plan Motor?', '¿Qué es el plan Imperio?'],
      en: ['What does each plan include?', "What's in the Impulso plan?", "What's the difference between the plans?", 'Is there a plan for a big team?', 'How many people can use it?', 'How many users are included?', 'compare plans'],
    },
    a: {
      es: `Así quedan: Arranque $0 (${n(P.arranque.credits, 'es')} créditos/semana, 1 usuario) · Impulso $${P.impulso.price}/mes (${n(P.impulso.credits, 'es')}, hasta ${P.impulso.seats} personas) · Motor $${P.motor.price} (${n(P.motor.credits, 'es')}, hasta ${P.motor.seats}) · Imperio $${P.imperio.price} (${n(P.imperio.credits, 'es')}, personas sin límite). Agentes sin límite en todos.`,
      en: `Here's the lineup: Arranque $0 (${n(P.arranque.credits, 'en')} credits/week, 1 user) · Impulso $${P.impulso.price}/month (${n(P.impulso.credits, 'en')}, up to ${P.impulso.seats} people) · Motor $${P.motor.price} (${n(P.motor.credits, 'en')}, up to ${P.motor.seats}) · Imperio $${P.imperio.price} (${n(P.imperio.credits, 'en')}, unlimited people). Unlimited agents on all of them.`,
    },
  },
  {
    id: 'paquetes',
    ref: 'pricing',
    keys: ['paquete', 'paquetes', 'creditos', 'chispa', 'envion', 'turbina', 'reserva', 'pack', 'packs', 'credits', 'top up', 'recargar', 'mas creditos'],
    ask: {
      es: ['¿Tienen paquetes de créditos?', '¿Puedo comprar más créditos?', '¿Qué pasa si me quedo sin créditos?', 'paquetes de créditos', '¿Cuánto cuestan los créditos extra?', 'recargar créditos'],
      en: ['Do you have credit packs?', 'Can I buy more credits?', 'What if I run out of credits?', 'credit packs', 'How much are extra credits?', 'top up credits'],
    },
    a: {
      es: `¡Claro! Si una semana necesitas más: Chispa (${n(K.chispa.credits, 'es')} créditos, $${K.chispa.price}), Envión (${n(K.envion.credits, 'es')}, $${K.envion.price}), Turbina (${n(K.turbina.credits, 'es')}, $${K.turbina.price}) y Reserva (${n(K.reserva.credits, 'es')}, $${K.reserva.price}, no caduca). Pago único, sin cobros automáticos por exceso.`,
      en: `Sure! If you need more in a given week: Chispa (${n(K.chispa.credits, 'en')} credits, $${K.chispa.price}), Envión (${n(K.envion.credits, 'en')}, $${K.envion.price}), Turbina (${n(K.turbina.credits, 'en')}, $${K.turbina.price}) and Reserva (${n(K.reserva.credits, 'en')}, $${K.reserva.price}, never expires). One-off payment, no automatic overage charges.`,
    },
  },
  {
    id: 'cuando',
    ref: 'faq:cuando',
    cta: 'waitlist',
    keys: ['cuando', 'abre', 'abren', 'lanzan', 'disponible', 'lanzamiento', 'when', 'open', 'opens', 'launch', 'available'],
    ask: {
      es: ['¿Cuándo abre?', '¿Cuándo abren?', '¿Cuándo lo lanzan?', '¿Cuándo está disponible?', '¿Ya se puede usar?', '¿Cuándo puedo empezar?'],
      en: ['When does it open?', 'When do you launch?', 'When is it available?', 'Can I use it yet?', 'When can I start?'],
    },
    a: {
      es: 'Estamos abriendo por grupos, y quien se apunta antes, entra antes. Deja tu correo en la lista y te escribimos cuando sea tu turno. 🙌',
      en: "We're opening in waves, and whoever signs up first gets in first. Drop your email on the waitlist and we'll write when it's your turn. 🙌",
    },
  },
  {
    id: 'programar',
    ref: 'faq:programar',
    keys: ['programar', 'codigo', 'tecnologia', 'tecnico', 'coding', 'code', 'technical', 'technology', 'programmer', 'developer'],
    ask: {
      es: ['¿Tengo que saber de tecnología o programar?', '¿Necesito saber programar?', '¿Hace falta saber de código?', '¿Es difícil de usar?', '¿Necesito conocimientos técnicos?'],
      en: ['Do I need to know about technology or coding?', 'Do I need to know how to code?', 'Do I need technical skills?', 'Is it hard to use?'],
    },
    a: {
      es: 'Para nada. Le escribes como le escribirías a alguien de tu equipo: sin código ni prompts raros. Si sabes mandar un WhatsApp, ya sabes usarlo.',
      en: "Not at all. You write to it the way you'd write to someone on your team: no code, no weird prompts. If you can send a WhatsApp message, you can use it.",
    },
  },
  {
    id: 'whatsapp',
    ref: 'faq:whatsapp',
    keys: ['whatsapp'],
    ask: {
      es: ['¿Funciona con WhatsApp?', '¿Responde a mis clientes por WhatsApp?', '¿Puede vender por WhatsApp?', '¿Se conecta a WhatsApp?', 'WhatsApp'],
      en: ['Does it work with WhatsApp?', 'Does it answer my customers on WhatsApp?', 'Can it sell on WhatsApp?', 'Does it connect to WhatsApp?'],
    },
    a: {
      es: '¡Sí! El Vendedor de WhatsApp responde a tus clientes a cualquier hora, con el tono de tu marca, y cierra ventas. Se conecta por código QR o con el número oficial, y todas las conversaciones quedan en una sola bandeja.',
      en: "Yes! The WhatsApp seller answers your customers any time, in your brand's voice, and closes sales. It connects via QR code or the official number, and every conversation lives in a single inbox.",
    },
  },
  {
    id: 'solos',
    ref: 'faq:solos',
    keys: ['permiso', 'avisar', 'avisarme', 'solos', 'aprobar', 'gastar', 'dinero', 'asking', 'permission', 'approve', 'spend', 'money', 'without'],
    ask: {
      es: ['¿Hacen cosas sin avisarme?', '¿Puede gastar dinero sin mi permiso?', '¿Me piden permiso?', '¿Actúan solos?', '¿Necesitan mi aprobación?'],
      en: ['Do they do things without telling me?', 'Will it do things without asking me?', 'Can it spend money without my permission?', 'Do I have to approve things?'],
    },
    a: {
      es: 'Solo lo que tú les permitas. En lo rutinario avanzan solos; lo importante, como gastar dinero, te lo preguntan siempre y lo apruebas con un botón. Una acción sin permiso se bloquea.',
      en: 'Only what you allow. They handle routine work on their own; anything important, like spending money, they always ask you first and you approve with one tap. An action without permission is blocked.',
    },
  },
  {
    id: 'datos',
    ref: 'faq:datos',
    // T40c: las preguntas de SEGURIDAD o PROTECCIÓN («¿están seguros?», «is it safe?») pasan a la
    // ficha «proteccion»; esta se queda con la PROPIEDAD y el USO de la información.
    // Anclas de PROPIEDAD solamente: «privacidad», «información», «safe», «data»… se pliegan en el
    // término «datos» (search.js), que es ancla de «proteccion»; con las dos, «Is my data secure?»
    // empataba y no respondía ninguna (medido en T40c).
    keys: ['mios', 'mias', 'mio', 'mine', 'dueno', 'dueña', 'owns', 'owner'],
    ask: {
      es: ['¿Qué hacen con mi información?', '¿Mis datos son míos?', '¿De quién son mis datos?', '¿Qué hacen con mis datos?'],
      en: ['What do you do with my information?', 'Is my data mine?', 'Who owns my data?', 'What do you do with my data?'],
    },
    a: {
      es: 'Tu información es tuya. Cada empresa está aislada de las demás, tú decides qué conectas y lo desconectas cuando quieras. Y puedes exportarla o pedir que la borremos.',
      en: "Your information is yours. Each company is isolated from the others, you decide what you connect and you can disconnect it whenever you want. You can also export it or ask us to delete it.",
    },
  },
  {
    // T40 (Luca): «¿qué tan protegidos están mis datos?». SOLO lo que dicen las páginas públicas:
    // Política de seguridad §1 (cifrado en tránsito y en reposo; claves de integraciones cifradas
    // aparte) y §2 (aislamiento en dos capas); Política de privacidad §4.1 (no entrenamos IA con tu
    // contenido) y §10 (aviso de brecha en 72 h). Enlaza la página.
    id: 'proteccion',
    ref: 'legal:seguridad',
    keys: ['protegidos', 'protegidas', 'proteccion', 'protegen', 'protege', 'proteger', 'cifrado', 'cifrados', 'cifran', 'encriptado', 'brecha', 'seguro', 'seguros', 'segura', 'seguras', 'seguridad', 'protected', 'protect', 'protection', 'encrypted', 'encryption', 'breach', 'safe', 'secure', 'security'],
    ask: {
      es: ['¿Qué tan protegidos están mis datos?', '¿Cómo protegen mis datos?', '¿Mis datos van cifrados?', '¿Qué pasa si hay una brecha de seguridad?', '¿Qué protección tienen mis datos?', '¿Mis datos están seguros?', '¿Están seguros mis datos?', '¿Es seguro?', '¿Protegen mi información?', 'Mis datos que tanto se protegen?'],
      en: ['How protected is my data?', 'How do you protect my data?', 'Is my data encrypted?', 'What happens if there is a data breach?', 'Is my data safe?', 'How safe is my data?', 'Is it secure?', 'Is my information secure?', 'How do you protect my information?'],
    },
    a: {
      es: 'Muy en serio 🔒 Todo viaja y se guarda cifrado, cada empresa está aislada en dos capas y las claves de tus integraciones se cifran aparte. No entrenamos IA con tu contenido y, si hubiera una brecha, te avisamos en 72 h. [Política de seguridad](/legal/seguridad)',
      en: "Seriously 🔒 Everything is encrypted in transit and at rest, each company is isolated in two layers, and your integration keys are encrypted separately. We don't train AI on your content, and if there's a breach, we tell you within 72 h. [Security Policy](/en/legal/security)",
    },
  },
  {
    id: 'datos-ia',
    ref: 'faq:datos-ia',
    keys: ['entrenar', 'entrenan', 'entrenamiento', 'train', 'training', 'trained', 'aprenden'],
    ask: {
      es: ['¿Usan mis datos para entrenar modelos de IA?', '¿Entrenan la IA con mis datos?', '¿Mi información entrena modelos?'],
      en: ['Do you use my data to train AI models?', 'Do you train AI on my data?', 'Is my content used for training?'],
    },
    a: {
      es: 'No. No entrenamos modelos con tu contenido, ni propios ni de terceros, y los contratos con los proveedores de modelos les prohíben usarlo para entrenar.',
      en: "No. We don't train models on your content, neither our own nor third-party ones, and our contracts with model providers forbid them from using it for training.",
    },
  },
  {
    id: 'varios-negocios',
    ref: 'faq:varios-negocios',
    keys: ['varios', 'negocios', 'marcas', 'empresas', 'several', 'multiple', 'businesses', 'brands', 'companies'],
    ask: {
      es: ['¿Puedo manejar varios negocios?', '¿Sirve para varias marcas?', '¿Puedo tener varias empresas?'],
      en: ['Can I run several businesses?', 'Does it work for multiple brands?', 'Can I have several companies?'],
    },
    a: {
      es: '¡Sí! Puedes llevar varios negocios a la vez, cada uno con sus datos aparte, y la pantalla principal te los resume todos.',
      en: 'Yes! You can run several businesses at once, each with its own data kept apart, and the main screen sums them all up for you.',
    },
  },
  {
    id: 'que-es',
    ref: 'faq:que-es',
    keys: ['que es', 'quien', 'detras', 'klinworks', 'what is', 'who', 'behind', 'hace'],
    ask: {
      es: ['¿Qué es Agent CEO?', '¿Qué es Agent CEO y quién está detrás?', '¿Qué hace Agent CEO?', '¿Quién está detrás?', '¿De qué se trata?'],
      en: ['What is Agent CEO?', 'What is Agent CEO and who is behind it?', 'What does Agent CEO do?', "Who's behind it?"],
    },
    a: {
      es: 'Es tu equipo de empleados de IA: venden por WhatsApp, cuidan tu tienda y crean tu contenido, y en lo importante te piden permiso. La desarrolla Klinworks, LLC.',
      en: "It's your team of AI employees: they sell on WhatsApp, look after your store and create your content, and they ask your permission for anything important. It's built by Klinworks, LLC.",
    },
  },
  {
    id: 'herramientas',
    ref: 'faq:herramientas',
    keys: ['herramientas', 'conecta', 'conectan', 'integraciones', 'integra', 'tools', 'connect', 'connects', 'integrations', 'gmail', 'drive', 'hubspot apps'],
    ask: {
      es: ['¿Con qué herramientas se conecta?', '¿A qué herramientas se conecta?', '¿Qué integraciones tiene?', '¿Se conecta con Gmail?', '¿Con qué apps funciona?'],
      en: ['Which tools does it connect to?', 'What integrations does it have?', 'Does it connect to Gmail?', 'What apps does it work with?'],
    },
    a: {
      es: 'Con más de 70 que seguro ya usas: Shopify, WooCommerce, MercadoLibre, Amazon, Gmail, Google Drive y Sheets, WhatsApp, TikTok y muchas más. Tus agentes trabajan directamente en ellas.',
      en: 'With 70+ tools you probably already use: Shopify, WooCommerce, MercadoLibre, Amazon, Gmail, Google Drive and Sheets, WhatsApp, TikTok and many more. Your agents work right inside them.',
    },
  },
  {
    id: 'shopify',
    ref: 'faq:shopify',
    keys: ['shopify'],
    ask: {
      es: ['¿Sirve con mi tienda Shopify?', '¿Funciona con Shopify?', '¿Se conecta a Shopify?'],
      en: ['Does it work with my Shopify store?', 'Does it work with Shopify?', 'Does it connect to Shopify?'],
    },
    a: {
      es: '¡Sí! Conectas tu tienda Shopify y tu equipo vigila pedidos, carritos abandonados y stock por ti.',
      en: 'Yes! You connect your Shopify store and your team keeps an eye on orders, abandoned carts and stock for you.',
    },
  },
  {
    id: 'web',
    ref: 'faq:web',
    keys: ['web', 'pagina', 'sitio', 'app', 'aplicacion', 'landing', 'tienda online', 'website', 'site', 'online store', 'construir', 'crear', 'build'],
    ask: {
      es: ['¿Puede crearme una web o una app?', '¿Me pueden construir una tienda online?', '¿Hacen páginas web?', '¿Me crea una app?', '¿Puede hacerme una landing?'],
      en: ['Can it build me a website or an app?', 'Can it build me an online store?', 'Do you make websites?', 'Can it make me an app?', 'Can it build a landing page?'],
    },
    a: {
      es: '¡Sí! Webs, landings, tiendas online, apps y herramientas internas. La describes en el chat, la ves en vista previa y se publica en tu GitHub y tu Vercel: el código es tuyo.',
      en: "Yes! Websites, landing pages, online stores, apps and internal tools. You describe it in the chat, see it in preview and it's published to your own GitHub and Vercel: the code is yours.",
    },
  },
  {
    id: 'agente',
    ref: 'faq:agente',
    keys: ['agente', 'agentes', 'empleado', 'agent', 'agents', 'employee'],
    ask: {
      es: ['¿Qué es un agente?', '¿Qué es un empleado digital?', '¿Qué hace un agente?'],
      en: ['What is an agent?', 'What is a digital employee?', 'What does an agent do?'],
    },
    a: {
      es: 'Es un empleado digital con un trabajo concreto, como responder mensajes o revisar el inventario. No te sugiere qué hacer: lo hace, directamente en tus herramientas.',
      en: "It's a digital employee with a specific job, like answering messages or checking inventory. It doesn't suggest what to do: it does it, right inside your tools.",
    },
  },
  {
    id: 'reembolso',
    ref: 'legal:reembolsos',
    keys: ['reembolso', 'reembolsos', 'devolucion', 'devuelven', 'refund', 'refunds', 'money back'],
    ask: {
      es: ['¿Puedo pedir un reembolso?', '¿Cómo pido un reembolso?', '¿Me devuelven el dinero?', 'reembolsos'],
      en: ['Can I get a refund?', 'How do I get a refund?', 'Do you give refunds?', 'refunds'],
    },
    a: {
      es: 'Sí: en tu primera suscripción, dentro de 7 días si usaste menos del 10 % de los créditos; los paquetes Chispa, Envión y Turbina, en 14 días si no los usaste; y siempre por errores de facturación.',
      en: 'Yes: on your first subscription, within 7 days if you used less than 10% of the credits; Chispa, Envión and Turbina packs within 14 days if unused; and always for billing errors.',
    },
  },
]

/** Respuesta curada por id (o null). */
export const answerById = (id) => ANSWERS.find((a) => a.id === id) || null
