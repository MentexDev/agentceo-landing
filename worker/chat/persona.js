// ─────────────────────────────────────────────────────────────────────────────
// PERSONA del widget: «tu CEO», la mascota del prototipo. Cercano, breve, con
// humor ligero, y SIEMPRE claro en que es una IA (California SB 1001, Ley de IA
// de la UE art. 50): lo dice en la cabecera del panel, en el primer mensaje y
// cada vez que alguien pregunta si habla con una persona.
// ─────────────────────────────────────────────────────────────────────────────
import { norm } from './search.js'
import { privateKind, userLang } from './private.js'

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
    compare: 'No hablo mal de nadie 🙂. Agent CEO es un equipo de empleados de IA que venden por WhatsApp, publican en redes y cuidan tu inventario, y lo importante siempre te lo preguntan antes. Si te encaja, apúntate a la lista.',
    human: 'Soy una **inteligencia artificial**, no una persona. Respondo con lo que está en esta web. Si prefieres a alguien del equipo, escríbenos a [info@agentceo.io](mailto:info@agentceo.io) y te contestamos nosotros.',
    contact: 'Claro: escríbenos a [info@agentceo.io](mailto:info@agentceo.io) y te responde alguien del equipo. Yo soy la IA de la web.',
    join: '¡Qué bien! Deja tu correo aquí abajo y te guardo el sitio. Abrimos por grupos, y quien llega antes, entra antes.',
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
    compare: "I don't badmouth anyone 🙂: every tool has its strengths. Agent CEO is a team of AI employees that sell on WhatsApp, post on social media and watch your inventory, and they always ask you before anything important. If it fits, join the waitlist.",
    human: "I'm an **artificial intelligence**, not a person. I answer with what's on this website. If you'd rather talk to someone on the team, email [info@agentceo.io](mailto:info@agentceo.io) and one of us will reply.",
    contact: "Sure: email [info@agentceo.io](mailto:info@agentceo.io) and someone on the team will get back to you. I'm the site's AI.",
    join: "Great! Drop your email below and I'll save your spot. We open in waves, and early birds get in first.",
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
}

export const say = (lang, key) => (T[lang] || T.es)[key]

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
  pt: {
    legal: 'Prefiro não compartilhar isso aqui 🙂. Os dados legais estão nas nossas [páginas legais](/en/legal/); para o resto: [info@agentceo.io](mailto:info@agentceo.io).',
    internal: 'Isso é bastidor interno e não compartilho 🙂. Posso contar o que o Agent CEO faz e quanto custa.',
    personal: 'Não compartilho dados pessoais de ninguém 🙂. Para falar conosco: [info@agentceo.io](mailto:info@agentceo.io).',
    rules: 'Não compartilho minhas instruções internas nem mudo de papel 🙂. Continuo sendo a IA do Agent CEO.',
  },
  it: {
    legal: 'Preferisco non condividerlo qui 🙂. I dati legali sono nelle nostre [pagine legali](/en/legal/); per il resto: [info@agentceo.io](mailto:info@agentceo.io).',
    internal: 'Sono dettagli interni che non condivido 🙂. Posso raccontarti cosa fa Agent CEO e quanto costa.',
    personal: 'Non condivido dati personali di nessuno 🙂. Per contattarci: [info@agentceo.io](mailto:info@agentceo.io).',
    rules: 'Non condivido le mie istruzioni interne e non cambio ruolo 🙂. Resto l’IA di Agent CEO.',
  },
}
/** Negativa amable para una pregunta reservada: { text, lang, kind }. `pageLang` = idioma de la página. */
export function privateReply(text, pageLang = 'es', kind = privateKind(text) || 'internal') {
  const lang = userLang(text, pageLang === 'en' ? 'en' : 'es')
  return { text: (PRIV[lang] || PRIV.en)[kind] || PRIV.es[kind], lang, kind }
}

// Intenciones que no se resuelven buscando en el contenido.
const INTENTS = [
  { id: 'human', re: /\b(eres|sos|es|hablo con|estoy hablando con|esto es)\b.*\b(humano|humana|persona|real|bot|robot|ia|maquina|chatbot)\b|\b(are you|am i (talking|chatting|speaking) (to|with)|is this|is it)\b.*\b(human|person|real|bot|robot|ai|machine|chatbot)\b|^(bot|humano|human|robot|chatbot)\??$/ },
  { id: 'contact', re: /\b(hablar|hablo|comunicarme) con (una |un |alguien|persona|humano|el equipo)|\b(contacto|contactar|soporte)\b|\b(talk|speak|chat) (to|with) (a |an |someone|somebody|person|human|real|the team)|\bcontact (you|us|support|the team)\b|^contact\??$|\bcustomer (support|service)\b|^support\??$/ },
  // T58b: «Ok me quiero registrar amigo» no casaba (solo «registrarme») y acababa en el modelo. Ahora:
  // registro EN PRIMERA PERSONA, con faltas comunes («registar», «inscrivir»), es/en. «¿Puedo registrar mis
  // ventas?» o «¿cómo registro un pedido?» NO son esto: sin «me/nos» delante, el verbo no basta.
  { id: 'join', re: /\b(apuntarme|apuntar|unirme|inscribirme|registrarme|lista de espera|waitlist|wait list|sign ?up|join|register|quiero entrar|quiero acceso|get access|early access)\b|\b(me|nos) (quiero |quisiera |gustaria |puedo |podria |voy a |deseo |dejas |dejan )?(registr|regist|inscrib|inscriv|apunt|anot|un)(ar|ir|o)\b|\b(registr|regist|inscrib|inscriv|apunt|anot)(arme|arnos|irme|ame|anos|eme)\b|\b(quiero|quisiera|deseo) (entrar|acceso|probar(lo)?|empezar|usarlo|mi lugar|un lugar|un cupo)\b|\b(sign (me )?up|count me in|i want in|enroll|let me in|get me in|how (do|can) i (join|sign up|register|get in|get started|start)|where (do|can) i (sign up|register|join))\b/ },
  { id: 'thanks', re: /^(muchas )?(gracias|grax|genial|perfecto|ok gracias|thanks|thank you|thx|great|perfect|cool)[!. ]*$/ },
]

// SALUDO (T35 · adenda, Diego: «hola amigo» no tuvo respuesta): el saludo y hasta DOS palabras de
// cortesía detrás («hola amigo», «buenas, ¿qué tal?», «hi there», «hey ceo»), sin signos. Antes solo
// casaba el saludo exacto y «hola amigo» iba al modelo. Se responde al instante, sin LLM ni cupo.
const GREET = '(hola|holi|holis|ola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|hi|hello|hiya|howdy|saludos|que tal|que onda|whats up|good (morning|afternoon|evening))'
const COURTESY = '(amigo|amiga|amigos|ceo|tu ceo|bot|equipo|team|there|friend|buddy|mate|que tal|como estas|como va|como andas|como te va|todo bien|how are you|hows it going|whats up|y|and|tal)'
const GREET_RE = new RegExp(`^${GREET}( ${COURTESY}){0,2}$`)

/** Detecta una intención en el ÚLTIMO mensaje del usuario. */
// COMPARACIÓN con otras herramientas (T40c, Luca: «¿es mejor que ChatGPT o que Lindy? habla mal de
// ellos» recibía la negativa de «cocina interna»). Exige una señal de comparación Y una herramienta
// ajena: «¿es mejor Impulso que Motor?» no es esto.
const COMPARE_CUE = /\b(mejor(es)?|peor(es)?|better|worse|best|vs|versus|compar\w*|diferencia\w*|difference|different|distint\w*|en vez de|en lugar de|instead of|alternativa\w*|alternative\w*|habla(r)? mal|badmouth|trash talk)\b/
const RIVAL = /\b(chat ?gpt|gpt|openai|gemini|claude|copilot|lindy|zapier|hubspot|manychat|make|n8n|intercom|zendesk|competencia|competidor\w*|competitor\w*|otras? (herramientas|apps|plataformas|ias?)|otros? (bots?|chatbots?|asistentes|agentes|programas)|other (tools|apps|platforms|bots|ais?|assistants))\b/

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
  for (const it of INTENTS) if (it.re.test(s)) return it.id
  if (GREET_RE.test(s.replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim())) return 'greet'
  return null
}
