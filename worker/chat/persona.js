// ─────────────────────────────────────────────────────────────────────────────
// PERSONA del widget: «tu CEO», la mascota del prototipo. Cercano, breve, con
// humor ligero, y SIEMPRE claro en que es una IA (California SB 1001, Ley de IA
// de la UE art. 50): lo dice en la cabecera del panel, en el primer mensaje y
// cada vez que alguien pregunta si habla con una persona.
// ─────────────────────────────────────────────────────────────────────────────
import { norm } from './search.js'

export const CONTACT = 'info@klinworks.com'

const T = {
  es: {
    greet: '¡Hola! Soy tu CEO, el asistente de **inteligencia artificial** de Agent CEO (no soy una persona). Te respondo con lo que hay publicado en esta web. ¿Qué quieres saber?',
    thanks: '¡A ti! Si te quedó alguna duda, aquí sigo. Y si quieres entrar de los primeros, la lista está abierta.',
    human: 'Soy una **inteligencia artificial**, no una persona: el asistente automático de Agent CEO. Respondo solo con lo que hay en esta web. Si prefieres hablar con alguien del equipo, escríbenos a [info@klinworks.com](mailto:info@klinworks.com).',
    contact: 'Para hablar con una persona del equipo, escríbenos a [info@klinworks.com](mailto:info@klinworks.com). Yo soy una IA y respondo con lo que hay en esta web.',
    join: '¡Me encanta! Déjame tu correo aquí abajo y te guardo el lugar. Abrimos por grupos y los primeros de la lista entran primero.',
    fallback: 'Eso no lo encuentro en lo que hay publicado en esta web, y prefiero no inventarme nada. Puedes preguntarme otra cosa, escribir a [info@klinworks.com](mailto:info@klinworks.com) o apuntarte a la lista y te contamos todo cuando abra tu grupo.',
    cap: 'Hemos hablado un buen rato, ¡gracias! Para seguir, apúntate a la lista y te escribimos cuando abra tu grupo, o escríbenos a [info@klinworks.com](mailto:info@klinworks.com).',
    more: 'Más aquí',
    chipJoin: 'Unirme a la lista',
    chipHuman: '¿Eres una persona?',
  },
  en: {
    greet: "Hi! I'm your CEO, Agent CEO's **artificial intelligence** assistant (I'm not a person). I answer with what's published on this website. What would you like to know?",
    thanks: "You're welcome! If anything's still unclear, I'm here. And if you want to get in early, the waitlist is open.",
    human: "I'm an **artificial intelligence**, not a person: Agent CEO's automated assistant. I only answer with what's on this website. If you'd rather talk to someone on the team, email [info@klinworks.com](mailto:info@klinworks.com).",
    contact: "To talk to a person on the team, email [info@klinworks.com](mailto:info@klinworks.com). I'm an AI and I answer with what's on this website.",
    join: "Love it! Leave your email below and I'll save your spot. We open in waves and the first on the list get in first.",
    fallback: "I can't find that in what's published on this website, and I'd rather not make anything up. You can ask me something else, email [info@klinworks.com](mailto:info@klinworks.com), or join the waitlist and we'll tell you everything when your wave opens.",
    cap: "We've chatted for a while, thanks! To keep going, join the waitlist and we'll write when your wave opens, or email [info@klinworks.com](mailto:info@klinworks.com).",
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
