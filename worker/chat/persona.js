// ─────────────────────────────────────────────────────────────────────────────
// PERSONA del widget: «tu CEO», la mascota del prototipo. Cercano, breve, con
// humor ligero, y SIEMPRE claro en que es una IA (California SB 1001, Ley de IA
// de la UE art. 50): lo dice en la cabecera del panel, en el primer mensaje y
// cada vez que alguien pregunta si habla con una persona.
// ─────────────────────────────────────────────────────────────────────────────
import { norm } from './search.js'

export const CONTACT = 'info@klinworks.com'

// TONO (adenda T32, Diego): súper natural, cálido, cercano y fluido; corto; como un fundador
// amable que conoce su producto, nunca corporativo. Las evals de tono (scripts/chat-evals.mjs)
// vigilan longitud y muletillas. ⛔ No quitar «inteligencia artificial» / «no una persona»
// (SB 1001; los e2e los buscan).
const T = {
  es: {
    greet: '¡Hola! 👋 Soy tu CEO, la **inteligencia artificial** de Agent CEO, no una persona. Te cuento lo que quieras de la web, en corto. ¿Por dónde empezamos?',
    thanks: '¡A ti! Aquí sigo si te surge algo. Y si te animas, la lista está abierta.',
    human: 'Soy una **inteligencia artificial**, no una persona. Respondo con lo que está en esta web. Si prefieres a alguien del equipo, escríbenos a [info@klinworks.com](mailto:info@klinworks.com) y te contestamos nosotros.',
    contact: 'Claro: escríbenos a [info@klinworks.com](mailto:info@klinworks.com) y te responde alguien del equipo. Yo soy la IA de la web.',
    join: '¡Qué bien! Deja tu correo aquí abajo y te guardo el sitio. Abrimos por grupos, y quien llega antes, entra antes.',
    fallback: 'Eso no lo tengo en la web y prefiero no inventarme nada. ¿Te ayudo con otra cosa? También puedes escribirnos a [info@klinworks.com](mailto:info@klinworks.com) o apuntarte a la lista y te contamos más.',
    cap: 'Llevamos un buen rato, ¡gracias por la charla! Para seguir, apúntate a la lista y te escribimos cuando abra tu grupo, o escríbenos a [info@klinworks.com](mailto:info@klinworks.com).',
    guard: 'Eso no lo puedo compartir 🙂. Lo que sí te cuento encantado: qué hace Agent CEO, cuánto cuesta o cómo entrar en la lista.',
    cut: 'Se me cortó la respuesta, perdona. ¿Me lo repites?',
    more: 'Más aquí',
    chipJoin: 'Unirme a la lista',
    chipHuman: '¿Eres una persona?',
  },
  en: {
    greet: "Hi! 👋 I'm your CEO, Agent CEO's **artificial intelligence**, not a person. Ask me anything about the website and I'll keep it short. Where do we start?",
    thanks: "Anytime! I'm here if anything comes up. And if you're in, the waitlist is open.",
    human: "I'm an **artificial intelligence**, not a person. I answer with what's on this website. If you'd rather talk to someone on the team, email [info@klinworks.com](mailto:info@klinworks.com) and one of us will reply.",
    contact: "Sure: email [info@klinworks.com](mailto:info@klinworks.com) and someone on the team will get back to you. I'm the site's AI.",
    join: "Great! Drop your email below and I'll save your spot. We open in waves, and early birds get in first.",
    fallback: "That's not on the website, and I'd rather not make anything up. Can I help with something else? You can also email [info@klinworks.com](mailto:info@klinworks.com) or join the waitlist and we'll tell you more.",
    cap: "We've been at it a while, thanks for the chat! To keep going, join the waitlist and we'll write when your wave opens, or email [info@klinworks.com](mailto:info@klinworks.com).",
    guard: "I can't share that 🙂. Happy to tell you what Agent CEO does, what it costs or how to get on the waitlist.",
    cut: 'My answer got cut off, sorry. Could you ask again?',
    more: 'More here',
    chipJoin: 'Join the waitlist',
    chipHuman: 'Are you a person?',
  },
}

export const say = (lang, key) => (T[lang] || T.es)[key]

// Intenciones que no se resuelven buscando en el contenido.
const INTENTS = [
  { id: 'human', re: /\b(eres|sos|es|hablo con|estoy hablando con|esto es)\b.*\b(humano|humana|persona|real|bot|robot|ia|maquina|chatbot)\b|\b(are you|am i (talking|chatting|speaking) (to|with)|is this|is it)\b.*\b(human|person|real|bot|robot|ai|machine|chatbot)\b|^(bot|humano|human|robot|chatbot)\??$/ },
  { id: 'contact', re: /\b(hablar|hablo|comunicarme) con (una |un |alguien|persona|humano|el equipo)|\b(contacto|contactar|soporte)\b|\b(talk|speak|chat) (to|with) (a |an |someone|somebody|person|human|real|the team)|\bcontact (you|us|support|the team)\b|^contact\??$|\bcustomer (support|service)\b|^support\??$/ },
  { id: 'join', re: /\b(apuntarme|apuntar|unirme|inscribirme|registrarme|lista de espera|waitlist|sign ?up|join|register|quiero entrar|quiero acceso|get access|early access)\b/ },
  { id: 'thanks', re: /^(muchas )?(gracias|grax|genial|perfecto|ok gracias|thanks|thank you|thx|great|perfect|cool)[!. ]*$/ },
  { id: 'greet', re: /^(hola|holi|buenas|buenos dias|buenas tardes|buenas noches|hey|hi|hello|hiya|good (morning|afternoon|evening)|que tal|whats up)[!.? ]*$/ },
]

/** Detecta una intención en el ÚLTIMO mensaje del usuario. */
export function intentOf(text = '') {
  const s = norm(text).replace(/[¿¡]/g, '').trim()
  for (const it of INTENTS) if (it.re.test(s)) return it.id
  return null
}
