// ─────────────────────────────────────────────────────────────────────────────
// RESPUESTA SIN RED del widget (T35 · adenda, punto 0: Diego escribió «hola amigo» y el widget se
// quedó callado). El widget NUNCA se queda en silencio: si el servidor tarda, limita (429), se
// corta o devuelve un stream vacío, responde aquí mismo, en el navegador, con la MISMA lógica que el
// Worker (intenciones de persona.js y fichas curadas de match.js / content/chat-answers.js). Y los
// saludos se responden aquí al instante, sin petición: ni modelo ni cupo.
// ─────────────────────────────────────────────────────────────────────────────
import { matchCurated } from '../../../worker/chat/match.js'
import { answerById } from '../../../content/chat-answers.js'
import { intentOf, say, privateReply } from '../../../worker/chat/persona.js'

/** ¿Es un saludo (con o sin cortesía: «hola amigo», «hi there»)? */
export const isGreeting = (text) => intentOf(text) === 'greet'

/**
 * Respuesta local para `text` (o para el chip curado `chip`) en `lang`.
 * → { text, kind: 'intent:…' | 'curated' | 'generic', cta: 'waitlist' | null }
 * `generic` = no hay ficha: el texto lo pone el panel (S.offlineGeneric, con enlaces a la web).
 */
export function offlineReply(text, lang, chip = null) {
  const L = lang === 'en' ? 'en' : 'es'
  const intent = intentOf(text)
  // Negativa de datos privados por TIPO e idioma (T40b), igual que en el Worker.
  if (intent === 'private') return { text: privateReply(text, L).text, kind: 'intent:private', cta: null }
  if (intent) return { text: say(L, intent), kind: `intent:${intent}`, cta: intent === 'join' || intent === 'thanks' ? 'waitlist' : null }
  const id = chip && answerById(chip) ? chip : matchCurated(text)?.id
  const a = id && answerById(id)
  if (a) return { text: a.a[L], kind: 'curated', cta: a.cta || null }
  return { text: '', kind: 'generic', cta: 'waitlist' }
}
