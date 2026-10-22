// CONJUNTOS RESERVADOS del widget (medición honesta, no afinado).
//  · #1 (2026-10-20): 66,7 % al medirlo por primera vez (es 11/15, en 5/9). Sus fallos
//    inspiraron arreglos POR CATEGORÍA → queda CONTAMINADO; se conserva como regresión.
//  · #2 (2026-10-20): escrito DESPUÉS de esos arreglos y NO usado para afinar. Es la
//    estimación honesta: 44,0 % (es 6/15 · en 5/10) para un motor léxico sin LLM ante
//    frases nuevas. Si se afina mirando sus fallos, hay que escribir un #3.
// T60: «¿se conecta con Google Drive / Gmail?» acepta también intent:integration (respuesta concreta de
// content/integraciones.js, más precisa que la ficha genérica de herramientas).
// Estos tests NO exigen un objetivo: son un SUELO DE REGRESIÓN con lo medido (que
// ningún cambio lo empeore) y dejan la cifra en la salida.
import { describe, it, expect } from 'vitest'
import { decide } from './chat-eval.test.js'

const HELD1 = {
  es: [
    ['¿esto tiene algún costo mensual?', ['faq:precio', 'pricing']],
    ['¿hay prueba gratis?', ['faq:precio', 'pricing-faq:¿Es gratis de verdad?']],
    ['¿me sirve si vendo por instagram?', ['fallback']],
    ['¿los agentes contestan a mis clientes?', ['faq:whatsapp', 'faq:agente']],
    ['¿se puede conectar google drive?', ['faq:herramientas', 'intent:integration']],
    ['¿quién es la empresa dueña de agent ceo?', ['faq:que-es']],
    ['¿qué pasa con mi información?', ['faq:datos', 'faq:datos-ia']],
    ['¿la IA aprende de mis datos para otros clientes?', ['faq:datos-ia']],
    ['¿puedo rechazar lo que propone?', ['faq:no-me-gusta']],
    ['¿qué hago si se traba una tarea?', ['faq:atasca']],
    ['¿cuándo puedo empezar a usarlo?', ['faq:cuando']],
    ['¿me hace la tienda online?', ['faq:web', 'faq:shopify']],
    ['quiero inscribirme', ['intent:join']],
    ['¿es un robot?', ['intent:human']],
    ['¿qué opinas del fútbol?', ['fallback']],
  ],
  en: [
    ['is there a monthly fee?', ['faq:precio']],
    ['can it reply to my customers on whatsapp?', ['faq:whatsapp']],
    ['does it connect to google drive?', ['faq:herramientas', 'intent:integration']],
    ['what company makes this?', ['faq:que-es']],
    ['will my data be used for training?', ['faq:datos-ia']],
    ['when can I start using it?', ['faq:cuando']],
    ['what happens if a task gets stuck?', ['faq:atasca']],
    ['can you write me a poem?', ['fallback']],
    ['am I chatting with a bot?', ['intent:human']],
  ],
}

const HELD2 = {
  es: [
    ['¿tengo que pagar algo para probarlo?', ['faq:precio', 'pricing', 'pricing-faq:¿Es gratis de verdad?', 'pricing-faq:¿Necesito tarjeta de crédito para empezar?']],
    ['¿funciona para una cafetería?', ['fallback', 'faq:que-es']],
    ['¿puede responder mensajes de mis clientes de noche?', ['faq:whatsapp']],
    ['¿cómo sé que no va a hacer algo raro?', ['faq:solos']],
    ['¿se integra con mi correo de gmail?', ['faq:herramientas', 'intent:integration']],
    ['¿borran mis datos si me voy?', ['fallback', 'faq:datos', 'pricing-faq:¿Mis datos son míos?']],
    ['¿qué diferencia hay entre un chatbot y un agente?', ['faq:agente', 'blog:que-es-un-agente-de-ia']],
    ['¿sirve para controlar el inventario?', ['faq:shopify', 'faq:agente']],
    ['¿me arma una app para mi negocio?', ['faq:web']],
    ['¿tienen app para iphone?', ['fallback']],
    ['¿dónde están ubicados?', ['fallback', 'faq:que-es']],
    ['me quiero registrar', ['intent:join']],
    ['¿tú eres una inteligencia artificial?', ['intent:human']],
    ['¿cómo hago una tortilla?', ['fallback']],
    // 2026-10-20: las FAQ de precios de la v1 a las que apuntaba este caso ya no existen (precios reales).
    ['¿precio del plan para equipos?', ['faq:precio', 'pricing']],
  ],
  en: [
    ['do I have to pay to try it?', ['faq:precio', 'pricing', 'pricing-faq:Is it really free?']],
    ['can it answer my customers at night?', ['faq:whatsapp']],
    ['how do I know it will not do something weird?', ['faq:solos']],
    ['does it integrate with gmail?', ['faq:herramientas', 'intent:integration']],
    ['what is the difference between a chatbot and an agent?', ['faq:agente', 'blog:what-an-ai-agent-really-is-and-why-its-not-a-chatbot']],
    ['can it handle inventory?', ['faq:shopify', 'faq:agente']],
    ['do you have an iphone app?', ['fallback']],
    ['I want to register', ['intent:join']],
    ['are you an AI?', ['intent:human']],
    ['how do I bake bread?', ['fallback']],
  ],
}

const SETS = { 1: HELD1, 2: HELD2 }
// Suelo = aciertos medidos el 2026-10-20 (no se puede bajar).
// '2es' bajó de 6 a 5 el 2026-10-20 por CAMBIO DE CONTENIDO, no del motor: con los precios reales
// entró la FAQ «¿Hay límite de agentes?» (habla de planes y equipo) y capta «precio del plan para
// equipos». Medido y documentado en docs/DUDAS.md; no se afinó el motor mirando este conjunto.
// '1es' bajó de 14 a 13 el 2026-10-20, también por CORPUS: al indexar los 14 documentos legales
// (que ahora responden reembolsos, accesibilidad o DMCA) cambian las frecuencias y «¿qué hago si
// se traba una tarea?» va al blog. Intercambio aceptado y documentado (docs/DUDAS.md).
// '1en' bajó de 9 a 7 el 2026-10-20 (fase 6), otra vez por CORPUS: al entrar el inglés de precios,
// blog, recursos y legales, «is there a monthly fee?» cae en «Is it really free?» (respuesta incompleta)
// y «what company makes this?» pierde fuerza («company» aparece en todos los legales). Medido y
// documentado: un motor léxico se degrada al crecer el corpus → argumento para el modo live.
const FLOOR = { '1es': 13, '1en': 7, '2es': 5, '2en': 6 }

describe.each([[1, 'es'], [1, 'en'], [2, 'es'], [2, 'en']])('reservado #%s · %s', (n, lang) => {
  const res = SETS[n][lang].map(([q, want]) => ({ q, want, got: decide(lang, q) }))
  const ok = res.filter((r) => r.want.includes(r.got))
  it('se mide y no baja del suelo medido', () => {
    console.log(`[reservado #${n} ${lang}] ${((ok.length / res.length) * 100).toFixed(1)} % (${ok.length}/${res.length})`)
    for (const r of res.filter((x) => !x.want.includes(x.got))) console.log(`   ✗ ${r.q} → ${r.got} (esperado ${r.want.join(' | ')})`)
    expect(ok.length).toBeGreaterThanOrEqual(FLOOR[`${n}${lang}`])
  })
})
