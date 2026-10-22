// ─────────────────────────────────────────────────────────────────────────────
// PERSONA del widget: «tu CEO», la mascota del prototipo. Cercano, breve, con
// humor ligero, y SIEMPRE claro en que es una IA (California SB 1001, Ley de IA
// de la UE art. 50): lo dice en la cabecera del panel, en el primer mensaje y
// cada vez que alguien pregunta si habla con una persona.
// ─────────────────────────────────────────────────────────────────────────────
import { norm } from './search.js'
import { privateKind, userLang } from './private.js'
import { integrationQuery } from './integrations.js'
import { T_PT, PRIV_PT } from './persona.pt.js'
import { LOCALES } from '../../src/i18n/meta.js'

export const CONTACT = 'info@agentceo.io'

// TONO (adenda T32, Diego): súper natural, cálido, cercano y fluido; corto; como un fundador
// amable que conoce su producto, nunca corporativo. Las evals de tono (scripts/chat-evals.mjs)
// vigilan longitud y muletillas. ⛔ No quitar «inteligencia artificial» / «no una persona»
// (SB 1001; los e2e los buscan).
const T = {
  es: {
    greet: '¡Hola! 👋 Soy tu CEO, la **inteligencia artificial** de Agent CEO, no una persona. Te cuento lo que quieras de la web, en corto. ¿Por dónde empezamos?',
    thanks: '¡A ti! Aquí sigo si te surge algo. Y si te animas, la lista está abierta.',
    // Comparación con otras herramientas (T40c): neutral, sin hablar mal de nadie, solo con lo publicado.
    // T60: comparación DE VERDAD (antes abría con «No hablo mal de nadie»): la diferencia, sin atacar a nadie.
    compare: 'Buena pregunta. Un asistente como ese te responde y te sugiere; Agent CEO es un equipo de empleados de IA que **hace** el trabajo en tus herramientas: vende por WhatsApp, cuida tu tienda y tu inventario y publica en tus redes, y lo importante siempre te lo pregunta antes. Muchos usan los dos. ¿Quieres que te cuente cómo lo usaría tu negocio?',
    // T60: charla casual (jerga incluida): respuesta cálida y vuelta al negocio.
    ack: '¡De una! 🙌 Aquí estoy para lo que necesites: cómo vender más, automatizar tareas o qué haría tu equipo de IA en tu negocio. ¿Por dónde arrancamos?',
    human: 'Soy una **inteligencia artificial**, no una persona. Respondo con lo que está en esta web. Si prefieres a alguien del equipo, escríbenos a [info@agentceo.io](mailto:info@agentceo.io) y te contestamos nosotros.',
    contact: 'Claro: escríbenos a [info@agentceo.io](mailto:info@agentceo.io) y te responde alguien del equipo. Yo soy la IA de la web.',
    join: '¡Qué bien! Deja tu correo aquí abajo y te guardo el sitio. Abrimos por grupos, y quien llega antes, entra antes.',
    // T58b · herramientas deterministas de navegación (sin modelo).
    goPricing: 'Aquí tienes los planes y precios: [ver precios](/precios/). Arranque es gratis y sin tarjeta; si quieres, te guardo un sitio en la lista.',
    goFaq: 'Las preguntas frecuentes están aquí: [ver preguntas frecuentes](/#faq). Y si no encuentras algo, pregúntamelo a mí.',
    fallback: 'Eso no lo tengo en la web y prefiero no inventarme nada. ¿Te ayudo con otra cosa? También puedes escribirnos a [info@agentceo.io](mailto:info@agentceo.io) o apuntarte a la lista y te contamos más.',
    cap: 'Llevamos un buen rato, ¡gracias por la charla! Para seguir, apúntate a la lista y te escribimos cuando abra tu grupo, o escríbenos a [info@agentceo.io](mailto:info@agentceo.io).',
    guard: 'Eso no lo puedo compartir 🙂. Lo que sí te cuento encantado: qué hace Agent CEO, cuánto cuesta o cómo entrar en la lista.',
    // T40: datos societarios/registrales o internos (constitución, expediente, direcciones, modelo,
    // costes, inversores, métricas, datos personales…): negativa amable, sin datos.
    private: 'Eso prefiero no compartirlo por aquí 🙂. Lo legal de la empresa está en las [páginas legales](/legal/), y para cualquier otra cosa escríbenos a [info@agentceo.io](mailto:info@agentceo.io). ¿Te cuento cómo funciona Agent CEO?',
    cut: 'Se me cortó la respuesta, perdona. ¿Me lo repites?',
    // T58b: tope GLOBAL de respuestas del día. Fijo: no llama al modelo.
    globalCap: 'Hoy hablé con muchísima gente y llegué a mi límite de respuestas del día 😅. Escríbenos a [info@agentceo.io](mailto:info@agentceo.io) y te contesta una persona del equipo, o vuelve mañana y seguimos.',
    more: 'Más aquí',
    chipJoin: 'Unirme a la lista',
    chipHuman: '¿Eres una persona?',
  },
  en: {
    greet: "Hi! 👋 I'm your CEO, Agent CEO's **artificial intelligence**, not a person. Ask me anything about the website and I'll keep it short. Where do we start?",
    thanks: "Anytime! I'm here if anything comes up. And if you're in, the waitlist is open.",
    // T60: a real comparison, no badmouthing.
    compare: "Good question. An assistant like that answers and suggests; Agent CEO is a team of AI employees that actually **do** the work inside your tools: they sell on WhatsApp, look after your store and inventory and post on your socials, and they always ask before anything important. Plenty of people use both. Want me to show how your business would use it?",
    // T60: casual chat (slang included): warm reply, back to business.
    ack: "You got it! 🙌 I'm here for whatever you need: selling more, automating tasks or what your AI team would do for your business. Where do we start?",
    human: "I'm an **artificial intelligence**, not a person. I answer with what's on this website. If you'd rather talk to someone on the team, email [info@agentceo.io](mailto:info@agentceo.io) and one of us will reply.",
    contact: "Sure: email [info@agentceo.io](mailto:info@agentceo.io) and someone on the team will get back to you. I'm the site's AI.",
    join: "Great! Drop your email below and I'll save your spot. We open in waves, and early birds get in first.",
    // T58b · deterministic navigation tools (no model).
    goPricing: "Here are the plans and prices: [see pricing](/en/pricing/). Arranque is free, no card needed; want me to save you a spot on the waitlist?",
    goFaq: "The FAQ is right here: [see the FAQ](/en/#faq). And if you can't find something, just ask me.",
    fallback: "That's not on the website, and I'd rather not make anything up. Can I help with something else? You can also email [info@agentceo.io](mailto:info@agentceo.io) or join the waitlist and we'll tell you more.",
    cap: "We've been at it a while, thanks for the chat! To keep going, join the waitlist and we'll write when your wave opens, or email [info@agentceo.io](mailto:info@agentceo.io).",
    guard: "I can't share that 🙂. Happy to tell you what Agent CEO does, what it costs or how to get on the waitlist.",
    private: "That's not something I share here 🙂. The company's legal details are in our [legal pages](/en/legal/), and for anything else, email [info@agentceo.io](mailto:info@agentceo.io). Want me to tell you how Agent CEO works?",
    cut: 'My answer got cut off, sorry. Could you ask again?',
    // T58b: global daily cap on answers. Fixed text: never calls the model.
    globalCap: "I've talked with a lot of people today and hit my answer limit for the day 😅. Email us at [info@agentceo.io](mailto:info@agentceo.io) and someone from the team will reply, or come back tomorrow and we'll pick it up.",
    more: 'More here',
    chipJoin: 'Join the waitlist',
    chipHuman: 'Are you a person?',
  },
  // T62 · pt-BR en su propio fichero (worker/chat/persona.pt.js), mismas claves (lo vigila chat-pt.test.js).
  pt: T_PT,
}

export const say = (lang, key) => (T[lang] || T.es)[key]

/** T60 · Ya apuntado: «ya estás en la lista con j***@…» (el correo llega enmascarado y validado) + siguientes pasos. */
export function joinedReply(lang, masked) {
  // «*» se mostraría como Markdown (cursiva): se pinta con el asterisco tipográfico «∗» (U+2217), igual a la vista.
  const shown = masked ? masked.replace(/\*/g, '∗') : ''
  const J = {
    es: [` con tu correo **${shown}**`, (m) => `¡Ya estás en la lista${m}! 🙌 No tienes que hacer nada más: te escribimos cuando abra tu grupo. Mientras tanto, cuéntame de tu negocio (qué vendes y a quién) y te digo qué haría tu equipo de IA, o pregúntame lo que quieras.`],
    en: [` with **${shown}**`, (m) => `You're already on the waitlist${m} 🙌 Nothing else to do: we'll email you when your group opens. Meanwhile, tell me about your business (what you sell and to whom) and I'll show you what your AI team would do, or ask me anything.`],
    pt: [` com o e-mail **${shown}**`, (m) => `Você já está na lista${m}! 🙌 Não precisa fazer mais nada: a gente te escreve quando abrir o seu grupo. Enquanto isso, me conta do seu negócio (o que você vende e pra quem) e eu te digo o que a sua equipe de IA faria, ou me pergunte o que quiser.`],
  }
  const [withMail, text] = J[lang] || J.es
  return text(shown ? withMail : '')
}

// NEGATIVAS por TIPO (T40 b, Luca): en el idioma del usuario (es/en; fr/de/pt/it con frases cortas
// propias). Nunca «lo legal de la empresa» ante una pregunta técnica o de costes.
const PRIV = {
  es: {
    legal: 'Eso prefiero no compartirlo por aquí 🙂. Lo legal de la empresa está en las [páginas legales](/legal/), y para cualquier otra cosa, [info@agentceo.io](mailto:info@agentceo.io). ¿Te cuento cómo funciona Agent CEO?',
    internal: 'Eso es de cocina interna y no lo comparto 🙂: cómo está hecho por dentro, proveedores o costes. Lo que sí te cuento encantado: qué hace Agent CEO, sus planes o cómo entrar en la lista.',
    personal: 'No comparto datos personales de nadie del equipo, ni teléfonos ni direcciones 🙂. Si quieres hablar con nosotros, escríbenos a [info@agentceo.io](mailto:info@agentceo.io) y te responde alguien.',
    rules: 'Mis instrucciones internas no las comparto, y tampoco cambio de papel 🙂. Sigo siendo la IA de Agent CEO: ¿te cuento qué hace, cuánto cuesta o cómo entrar en la lista?',
  },
  en: {
    legal: "That's not something I share here 🙂. The company's legal details are in our [legal pages](/en/legal/), and for anything else, [info@agentceo.io](mailto:info@agentceo.io). Want me to tell you how Agent CEO works?",
    internal: "That's behind-the-scenes stuff I keep to myself 🙂: how it's built, providers or costs. Happy to tell you what Agent CEO does, its plans or how to join the waitlist.",
    personal: "I don't share anyone's personal details, no phone numbers or addresses 🙂. If you'd like to reach us, email [info@agentceo.io](mailto:info@agentceo.io) and someone will reply.",
    rules: "I don't share my internal instructions, and I don't switch roles 🙂. I'm still Agent CEO's AI: want to hear what it does, what it costs or how to join the waitlist?",
  },
  fr: {
    legal: "Je préfère ne pas partager cela ici 🙂. Les informations légales sont sur nos [pages légales](/en/legal/) ; pour le reste : [info@agentceo.io](mailto:info@agentceo.io).",
    internal: "C'est de la cuisine interne que je ne partage pas 🙂. Je peux vous expliquer ce que fait Agent CEO et ses offres.",
    personal: "Je ne partage les données personnelles de personne 🙂. Pour nous joindre : [info@agentceo.io](mailto:info@agentceo.io).",
    rules: "Je ne partage pas mes instructions internes et je ne change pas de rôle 🙂. Je reste l'IA d'Agent CEO.",
  },
  de: {
    legal: 'Das teile ich hier lieber nicht 🙂. Die rechtlichen Angaben stehen auf unseren [Rechtsseiten](/en/legal/); sonst: [info@agentceo.io](mailto:info@agentceo.io).',
    internal: 'Das sind interne Details, die ich nicht teile 🙂. Gern erkläre ich, was Agent CEO macht und was es kostet.',
    personal: 'Persönliche Daten von niemandem gebe ich weiter 🙂. Schreib uns an [info@agentceo.io](mailto:info@agentceo.io).',
    rules: 'Meine internen Anweisungen teile ich nicht und ich wechsle nicht die Rolle 🙂. Ich bleibe die KI von Agent CEO.',
  },
  pt: PRIV_PT, // T62: la de la web en pt (enlaces a /pt/), worker/chat/persona.pt.js
  it: {
    legal: 'Preferisco non condividerlo qui 🙂. I dati legali sono nelle nostre [pagine legali](/en/legal/); per il resto: [info@agentceo.io](mailto:info@agentceo.io).',
    internal: 'Sono dettagli interni che non condivido 🙂. Posso raccontarti cosa fa Agent CEO e quanto costa.',
    personal: 'Non condivido dati personali di nessuno 🙂. Per contattarci: [info@agentceo.io](mailto:info@agentceo.io).',
    rules: 'Non condivido le mie istruzioni interne e non cambio ruolo 🙂. Resto l’IA di Agent CEO.',
  },
}
/** Negativa amable para una pregunta reservada: { text, lang, kind }. `pageLang` = idioma de la página. */
export function privateReply(text, pageLang = 'es', kind = privateKind(text) || 'internal') {
  const lang = userLang(text, LOCALES.includes(pageLang) ? pageLang : 'es')
  return { text: (PRIV[lang] || PRIV.en)[kind] || PRIV.es[kind], lang, kind }
}

// Intenciones que no se resuelven buscando en el contenido.
const INTENTS = [
  { id: 'human', re: /\b(eres|sos|es|hablo con|estoy hablando con|esto es)\b.*\b(humano|humana|persona|real|bot|robot|ia|maquina|chatbot)\b|\b(are you|am i (talking|chatting|speaking) (to|with)|is this|is it)\b.*\b(human|person|real|bot|robot|ai|machine|chatbot)\b|\b(voce e|vc e|e voce|e vc|eu falo com|to falando com|estou falando com|isso e|aqui e)\b.*\b(humano|humana|pessoa|real|bot|robo|ia|maquina|chatbot)\b|^(bot|humano|human|robot|robo|chatbot)\??$/ },
  { id: 'contact', re: /\b(hablar|hablo|comunicarme) con (una |un |alguien|persona|humano|el equipo)|\b(contacto|contactar|soporte)\b|\b(talk|speak|chat) (to|with) (a |an |someone|somebody|person|human|real|the team)|\bcontact (you|us|support|the team)\b|^contact\??$|\bcustomer (support|service)\b|^support\??$|\bfalar com (uma |um |alguem|pessoa|humano|a equipe|o time|um atendente)|\b(contato|contatar|suporte|atendimento humano)\b|^(contato|suporte)\??$/ },
  // T58b: «Ok me quiero registrar amigo» no casaba (solo «registrarme») y acababa en el modelo. Ahora:
  // registro EN PRIMERA PERSONA, con faltas comunes («registar», «inscrivir»), es/en. «¿Puedo registrar mis
  // ventas?» o «¿cómo registro un pedido?» NO son esto: sin «me/nos» delante, el verbo no basta.
  { id: 'join', re: /\b(apuntarme|apuntar|unirme|inscribirme|registrarme|lista de espera|waitlist|wait list|sign ?up|join|register|quiero entrar|quiero acceso|get access|early access)\b|\b(me|nos) (quiero |quisiera |gustaria |puedo |podria |voy a |deseo |dejas |dejan )?(registr|regist|inscrib|inscriv|apunt|anot|un)(ar|ir|o)\b|\b(registr|regist|inscrib|inscriv|apunt|anot)(arme|arnos|irme|ame|anos|eme)\b|\b(quiero|quisiera|deseo) (entrar|acceso|probar(lo)?|empezar|usarlo|mi lugar|un lugar|un cupo)\b|\b(sign (me )?up|count me in|i want in|enroll|let me in|get me in|how (do|can) i (join|sign up|register|get in|get started|start)|where (do|can) i (sign up|register|join))\b|\b(quero|queria|gostaria de|posso|vou|como|onde) (eu )?(me|nos) (inscrever|cadastrar|registrar|inscrevo|cadastro|registro)\b|\b(me inscreve|me cadastra|me coloca na lista|me inscrevo|me cadastro|me registra)\b|\b(quero|queria|gostaria de) (entrar|acesso|testar|experimentar|comecar|usar|meu lugar|um lugar|uma vaga|garantir (meu|minha) (lugar|vaga))\b|\b(fazer|faco) (o |meu )?cadastro\b(?! de)|\bgarantir (meu|minha) (lugar|vaga)\b|\b(como|onde) (eu )?(faco|faz|posso|consigo) (pra|para) (me )?(inscrever|cadastrar|registrar|entrar|participar)\b|\b(como|onde) (eu )?(me )?(inscrevo|cadastro|entro na lista)\b/ },
  // T58b · navegación (herramienta determinista open_section): «llévame a precios», «show me pricing»… Exige
  // un verbo o pista de NAVEGAR: «¿cuánto cuesta?» o «¿qué planes hay?» siguen yendo a la ficha curada.
  { id: 'goPricing', re: /\b(llevame|lleva me|ir a|ver|veo|mostrar|muestrame|ensename|pasame|dame|abrir|abre|link|enlace|pagina|seccion|donde (estan|veo|puedo ver|encuentro)) (a |la |el |los |las |de |del )*(precios?|planes|tarifas|pricing)\b|\b(take me to|show me|go to|open|link to|where (is|are|can i (see|find))|send me) (the |your )?(pricing|prices|plans|pricing page)\b|\b(me leva|me leve|leva|ir para|ir pra|ver|mostrar|mostra|me mostra|me manda|abre|abrir|link|pagina|secao|onde (estao|vejo|posso ver|encontro|ficam?)) (para |pra |a |o |os |as |de |da |do |dos |das )*(precos?|planos|tarifas|pricing)\b/ },
  { id: 'goFaq', re: /\b(preguntas frecuentes|faqs?|dudas frecuentes|preguntas comunes|frequently asked|perguntas frequentes|duvidas frequentes|perguntas comuns)\b/ },
  // T60: asentimientos y charla corta («de una», «bacano», «¿sí o qué?», «listo parce», «jaja»).
  { id: 'ack', re: /^(ok|okey|okay|vale|listo|dale|de una|bacano|bacana|chevere|chimba|que chimba|berraco|genial|super|perfecto|claro|si o que|si señor|hagale|hagamosle|uy|wow|(ja){2,}j?|(je){2,}j?|(ji){2,}j?|lol|cool|nice|awesome|sounds good|got it|bet|sure|alright|right on|beleza|blz|show|top|massa|demais|otimo|firmeza|tranquilo|fechou|fechado|pode crer|joia|ta bom|entendi|kkk+|(rs)+)( (parce|parcero|mijo|mija|pues|amigo|bro|man|hermano|llave|socio|entonces|ya|que mas|cara|mano|parceiro|entao|demais|de boa))*[!.¡?¿ ]*$/ },
  { id: 'thanks', re: /^(muchas )?(gracias|grax|genial|perfecto|ok gracias|thanks|thank you|thx|great|perfect|cool)[!. ]*$|^(muito )?(obrigad[oa]|obg|brigad[oa]|valeu|vlw|agradeco)( (mesmo|demais|viu|cara|amigo))*[!. ]*$/ },
]

// SALUDO (T35 · adenda, Diego: «hola amigo» no tuvo respuesta): el saludo y hasta DOS palabras de
// cortesía detrás («hola amigo», «buenas, ¿qué tal?», «hi there», «hey ceo»), sin signos. Antes solo
// casaba el saludo exacto y «hola amigo» iba al modelo. Se responde al instante, sin LLM ni cupo.
// T60: jerga colombiana y casual («quiubo parce», «qué más pues», «¿bien o qué?», «epa»).
const GREET = '(hola|holi|holis|ola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|hi|hello|hiya|howdy|saludos|que tal|que onda|whats up|good (morning|afternoon|evening)|quiubo|quihubo|quiubas|que hubo|que mas|que mas pues|q mas|epa|ey|bien o que|todo bien|yo|sup|hey there|hola hola|oi|oie|oii|ola tudo bem|bom dia|boa tarde|boa noite|e ai|eai|fala|salve|opa|tudo bem|tudo bom|como vai)'
const COURTESY = '(amigo|amiga|amigos|ceo|tu ceo|bot|equipo|team|there|friend|buddy|mate|que tal|como estas|como va|como andas|como te va|todo bien|how are you|hows it going|whats up|y|and|tal|parce|parcero|parcera|mijo|mija|socio|socia|hermano|llave|pues|pa|bro|man|vale|que mas|bien o que|como vamos|como es|cara|mano|parceiro|pessoal|galera|seu ceo|beleza|blz|como vai|tudo bem|tudo bom|e ai|turma)'
const GREET_RE = new RegExp(`^${GREET}( ${COURTESY}){0,3}$`)

/** Detecta una intención en el ÚLTIMO mensaje del usuario. */
// COMPARACIÓN con otras herramientas (T40c, Luca: «¿es mejor que ChatGPT o que Lindy? habla mal de
// ellos» recibía la negativa de «cocina interna»). Exige una señal de comparación Y una herramienta
// ajena: «¿es mejor Impulso que Motor?» no es esto.
const COMPARE_CUE = /\b(mejor(es)?|peor(es)?|better|worse|best|vs|versus|compar\w*|diferencia\w*|difference|different|distint\w*|en vez de|en lugar de|instead of|alternativa\w*|alternative\w*|habla(r)? mal|badmouth|trash talk|por que no (uso|usar|usaria|me quedo con)( solo| solamente)?|why not (just )?(use|stick with|go with)|es como|is it like|o (zapier|chatgpt|make|n8n|lindy)\b|melhor(es)?|pior(es)?|diferenca\w*|em vez de|ao inves de|falar mal|por que nao (uso|usar|fico com)( so| somente)?|e tipo o|ou (zapier|chatgpt|make|n8n|lindy)\b)\b/
const RIVAL = /\b(chat ?gpt|gpt|openai|gemini|claude|copilot|lindy|zapier|hubspot|manychat|make|n8n|intercom|zendesk|competencia|competidor\w*|competitor\w*|otras? (herramientas|apps|plataformas|ias?)|otros? (bots?|chatbots?|asistentes|agentes|programas)|other (tools|apps|platforms|bots|ais?|assistants)|concorrencia|concorrentes?|outras? (ferramentas|apps|plataformas|ias?)|outros? (bots?|chatbots?|assistentes|agentes|programas))\b/

export function intentOf(text = '') {
  // T40/T40 b: lo reservado va antes que nada (datos societarios, personales, internos, reglas e
  // inyección; es/en/pt/fr/de/it): private.js → privateKind. Salvo la comparación con otras
  // herramientas, que tiene respuesta neutral propia (solo si no hay inyección ni datos legales o
  // personales en juego).
  const s = norm(text).replace(/[¿¡]/g, '').trim()
  const pk = privateKind(text)
  if (pk && pk !== 'internal') return 'private'
  if (COMPARE_CUE.test(s) && RIVAL.test(s)) return 'compare'
  if (pk) return 'private'
  // T60: «¿se integra con X?» → respuesta determinista desde content/integraciones.js (worker/chat/integrations.js).
  if (integrationQuery(text)) return 'integration'
  for (const it of INTENTS) if (it.re.test(s)) return it.id
  if (GREET_RE.test(s.replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim())) return 'greet'
  return null
}
