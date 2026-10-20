// ─────────────────────────────────────────────────────────────────────────────
// PERSONA del widget: «tu CEO», la mascota del prototipo. Cercano, breve, con
// humor ligero, y SIEMPRE claro en que es una IA (California SB 1001, Ley de IA
// de la UE art. 50): lo dice en la cabecera del panel, en el primer mensaje y
// cada vez que alguien pregunta si habla con una persona.
// ─────────────────────────────────────────────────────────────────────────────
import { norm } from './search.js'

export const CONTACT = 'info@agentceo.io'

// TONO (adenda T32, Diego): súper natural, cálido, cercano y fluido; corto; como un fundador
// amable que conoce su producto, nunca corporativo. Las evals de tono (scripts/chat-evals.mjs)
// vigilan longitud y muletillas. ⛔ No quitar «inteligencia artificial» / «no una persona»
// (SB 1001; los e2e los buscan).
const T = {
  es: {
    greet: '¡Hola! 👋 Soy tu CEO, la **inteligencia artificial** de Agent CEO, no una persona. Te cuento lo que quieras de la web, en corto. ¿Por dónde empezamos?',
    thanks: '¡A ti! Aquí sigo si te surge algo. Y si te animas, la lista está abierta.',
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
    more: 'Más aquí',
    chipJoin: 'Unirme a la lista',
    chipHuman: '¿Eres una persona?',
  },
  en: {
    greet: "Hi! 👋 I'm your CEO, Agent CEO's **artificial intelligence**, not a person. Ask me anything about the website and I'll keep it short. Where do we start?",
    thanks: "Anytime! I'm here if anything comes up. And if you're in, the waitlist is open.",
    human: "I'm an **artificial intelligence**, not a person. I answer with what's on this website. If you'd rather talk to someone on the team, email [info@agentceo.io](mailto:info@agentceo.io) and one of us will reply.",
    contact: "Sure: email [info@agentceo.io](mailto:info@agentceo.io) and someone on the team will get back to you. I'm the site's AI.",
    join: "Great! Drop your email below and I'll save your spot. We open in waves, and early birds get in first.",
    fallback: "That's not on the website, and I'd rather not make anything up. Can I help with something else? You can also email [info@agentceo.io](mailto:info@agentceo.io) or join the waitlist and we'll tell you more.",
    cap: "We've been at it a while, thanks for the chat! To keep going, join the waitlist and we'll write when your wave opens, or email [info@agentceo.io](mailto:info@agentceo.io).",
    guard: "I can't share that 🙂. Happy to tell you what Agent CEO does, what it costs or how to get on the waitlist.",
    private: "That's not something I share here 🙂. The company's legal details are in our [legal pages](/en/legal/), and for anything else, email [info@agentceo.io](mailto:info@agentceo.io). Want me to tell you how Agent CEO works?",
    cut: 'My answer got cut off, sorry. Could you ask again?',
    more: 'More here',
    chipJoin: 'Join the waitlist',
    chipHuman: 'Are you a person?',
  },
}

export const say = (lang, key) => (T[lang] || T.es)[key]

// Intenciones que no se resuelven buscando en el contenido.
const INTENTS = [
  // T40 (Luca: el bot dio la fecha de constitución y el expediente): datos societarios/registrales
  // de la empresa e información interna → negativa amable (say('private')), antes que nada más.
  { id: 'private', re: new RegExp([
    // (a) societario / registral
    'constitu(id[ao]|cion|yo|yeron|ir)', 'se fundo', 'fecha de (fundacion|creacion) de la (empresa|sociedad|compania)', 'expediente', 'numero de registro', 'registro mercantil',
    '\\bein\\b', 'tax id', '(numero|identificacion) fiscal', '\\b(nif|cif|rfc)\\b', 'agente registrad', 'registered (agent|office)', 'oficina registrada',
    'domicilio (social|fiscal)', 'direccion (de la empresa|de la oficina|fisica|postal|de klinworks|de agent ceo)', 'donde (esta|estan) (la empresa|ubicad|la oficina|sus oficinas|klinworks)',
    'where (are you|is the company|is klinworks|is agent ceo) (located|based|registered)', '(company|office|mailing|business) address', 'delaware', 'incorporat', 'file number', 'state of (formation|incorporation)',
    // (b) información interna
    '(que|cual|which|what) (modelo|model)\\b(?! de (negocio|precios|suscripcion|cobro))', '(que|cual|which|what) (llm|ia usan|ai do you use|ai model)', 'modelo de (ia|lenguaje)', '\\bstack\\b', 'tecnologia (usan|utilizan)', 'tech(nology)? stack', 'built with', 'hech[oa] con que',
    'proveedor(es)? (de ia|que usan|del modelo)', '\\b(openrouter|openai|gemini|chatgpt|gpt|anthropic|claude)\\b', 'system prompt', 'prompt (de sistema|interno)', 'tus instrucciones', 'your (instructions|prompt)',
    'api ?key', 'clave(s)? (de api|secreta)', 'cuanto (les |te )?cuesta (operar|mantener|el servidor|la ia|cada (mensaje|respuesta))', 'costos? internos?', 'internal costs?', 'how much does (it|each message) cost you',
    'inversor', 'inversionista', 'investor', 'funding', 'ronda de', 'valuacion', 'valuation', 'facturacion', 'revenue', '\\bingresos\\b',
    'cuantos (usuarios|clientes|empleados) (tienen|hay|usan)', 'how many (users|customers|clients|employees) (do you have|have you got|are there|use (it|agent ceo|you))', '\\bmetricas\\b', '\\bmetrics\\b',
    'quien(es)? (trabaja|trabajan) (en|ahi)', 'who works (there|on|at)', 'equipo interno', 'internal team',
    'fundador.*(vive|edad|telefono|direccion|correo personal|casa|familia)', 'founder.*(lives?|address|age|phone|personal|home|family)', 'donde vive', 'where does .* live',
  ].join('|')) },
  { id: 'human', re: /\b(eres|sos|es|hablo con|estoy hablando con|esto es)\b.*\b(humano|humana|persona|real|bot|robot|ia|maquina|chatbot)\b|\b(are you|am i (talking|chatting|speaking) (to|with)|is this|is it)\b.*\b(human|person|real|bot|robot|ai|machine|chatbot)\b|^(bot|humano|human|robot|chatbot)\??$/ },
  { id: 'contact', re: /\b(hablar|hablo|comunicarme) con (una |un |alguien|persona|humano|el equipo)|\b(contacto|contactar|soporte)\b|\b(talk|speak|chat) (to|with) (a |an |someone|somebody|person|human|real|the team)|\bcontact (you|us|support|the team)\b|^contact\??$|\bcustomer (support|service)\b|^support\??$/ },
  { id: 'join', re: /\b(apuntarme|apuntar|unirme|inscribirme|registrarme|lista de espera|waitlist|sign ?up|join|register|quiero entrar|quiero acceso|get access|early access)\b/ },
  { id: 'thanks', re: /^(muchas )?(gracias|grax|genial|perfecto|ok gracias|thanks|thank you|thx|great|perfect|cool)[!. ]*$/ },
]

// SALUDO (T35 · adenda, Diego: «hola amigo» no tuvo respuesta): el saludo y hasta DOS palabras de
// cortesía detrás («hola amigo», «buenas, ¿qué tal?», «hi there», «hey ceo»), sin signos. Antes solo
// casaba el saludo exacto y «hola amigo» iba al modelo. Se responde al instante, sin LLM ni cupo.
const GREET = '(hola|holi|holis|ola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|hi|hello|hiya|howdy|saludos|que tal|que onda|whats up|good (morning|afternoon|evening))'
const COURTESY = '(amigo|amiga|amigos|ceo|tu ceo|bot|equipo|team|there|friend|buddy|mate|que tal|como estas|como va|como andas|como te va|todo bien|how are you|hows it going|whats up|y|and|tal)'
const GREET_RE = new RegExp(`^${GREET}( ${COURTESY}){0,2}$`)

/** Detecta una intención en el ÚLTIMO mensaje del usuario. */
export function intentOf(text = '') {
  const s = norm(text).replace(/[¿¡]/g, '').trim()
  for (const it of INTENTS) if (it.re.test(s)) return it.id
  if (GREET_RE.test(s.replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim())) return 'greet'
  return null
}
