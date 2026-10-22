// EVALUACIÓN del modo stub (sin LLM) con preguntas reales, en es y en.
// Mide qué fracción se resuelve bien: el PLAN la estimaba «60–80 % [NO MEDIDO]».
// Cada caso espera: un fragmento (id), una intención (intent:x) o 'fallback'
// (no está en la web: hay que decirlo, no inventar).
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { makeIndex, search, confident } from '../../worker/chat/search.js'
import { intentOf } from '../../worker/chat/persona.js'

const KB = JSON.parse(readFileSync(new URL('../../worker/generated/knowledge.json', import.meta.url)))

export const CASES = {
  es: [
    ['¿Cuánto cuesta?', 'faq:precio'],
    ['es gratis?', 'faq:precio'],
    ['cuanto vale el plan', 'faq:precio'],
    ['¿necesito tarjeta de crédito?', 'pricing-faq:¿Necesito tarjeta de crédito para empezar?'],
    ['¿Necesito saber programar?', 'faq:programar'],
    ['no sé nada de tecnología, ¿lo puedo usar?', 'faq:programar'],
    ['¿qué es un agente?', 'faq:agente'],
    ['que es agent ceo', 'faq:que-es'],
    ['¿quién está detrás de esto?', 'faq:que-es'],
    ['¿funciona con whatsapp?', 'faq:whatsapp'],
    // Dos respuestas válidas: la FAQ y el recurso de plantillas de WhatsApp para vender.
    ['puedo vender por whatsapp', ['faq:whatsapp', 'recurso:plantillas-whatsapp-atencion-ventas']],
    ['tengo una tienda en shopify', 'faq:shopify'],
    ['¿se conecta con gmail?', 'faq:herramientas'],
    ['¿qué integraciones tiene?', 'faq:herramientas'],
    ['¿me puede hacer una página web?', 'faq:web'],
    ['¿hace cosas sin avisarme?', 'faq:solos'],
    ['¿puede gastar dinero sin mi permiso?', 'faq:solos'],
    ['¿y si no me gusta lo que hizo?', 'faq:no-me-gusta'],
    ['¿qué pasa si algo falla?', 'faq:atasca'],
    ['¿mis datos están seguros?', 'faq:datos'],
    ['¿entrenan la IA con mis datos?', 'faq:datos-ia'],
    ['tengo dos negocios, ¿puedo manejar varios?', 'faq:varios-negocios'],
    ['¿cuándo abren?', 'faq:cuando'],
    ['¿cuándo va a estar disponible?', 'faq:cuando'],
    // 2026-10-20: con los precios reales ya no hay FAQ de cancelación (la cubrirá Reembolsos, Fase L).
    ['¿puedo cancelar cuando quiera?', 'fallback'],
    ['qué tareas puedo automatizar', 'recurso:checklist-tareas-para-automatizar'],
    ['hola', 'intent:greet'],
    ['¿eres humano?', 'intent:human'],
    ['¿hablo con una persona real?', 'intent:human'],
    ['quiero hablar con una persona', 'intent:contact'],
    ['quiero apuntarme a la lista', 'intent:join'],
    ['gracias!', 'intent:thanks'],
    // Casos añadidos por CATEGORÍA tras el reservado #1 (redactados distinto, a propósito).
    ['¿cobran una cuota mensual?', 'faq:precio'],
    ['¿cuándo puedo comenzar?', 'faq:cuando'],
    ['¿mi información sirve para que aprenda la IA?', 'faq:datos-ia'],
    ['la tarea quedó bloqueada, ¿qué hago?', 'faq:atasca'],
    ['¿atienden a mis clientes por whatsapp?', 'faq:whatsapp'],
    ['¿esto es un chatbot?', 'intent:human'],
    ['escríbeme un cuento', 'fallback'],
    // Legal (fase L): la base del widget incluye los documentos legales.
    ['¿cómo pido un reembolso?', 'legal:reembolsos'],
    ['¿cumplen con la accesibilidad?', 'legal:accesibilidad'],
    ['tengo un aviso de derechos de autor', 'legal:dmca'],
    ['¿cuál es la capital de Francia?', 'fallback'],
    ['recomiéndame una receta de pasta', 'fallback'],
  ],
  en: [
    ['How much does it cost?', 'faq:precio'],
    // 2026-10-20 (fase 6): con la FAQ de precios en inglés, su respuesta literal también vale.
    ['is it free?', ['faq:precio', 'pricing-faq:Is it really free?']],
    ['do I need to know how to code?', 'faq:programar'],
    ['what is an agent?', 'faq:agente'],
    ['who is behind agent ceo?', 'faq:que-es'],
    ['does it work with whatsapp?', 'faq:whatsapp'],
    ['I have a shopify store', 'faq:shopify'],
    ['which tools does it connect to?', 'faq:herramientas'],
    ['can it build me a website?', 'faq:web'],
    ['does it spend money without asking me?', 'faq:solos'],
    ['is my data safe?', 'faq:datos'],
    ['do you train AI models on my data?', 'faq:datos-ia'],
    ['when does it launch?', 'faq:cuando'],
    ['can I manage several businesses?', 'faq:varios-negocios'],
    ['hi', 'intent:greet'],
    ['are you a real person?', 'intent:human'],
    ['I want to talk to a human', 'intent:contact'],
    ['how do I sign up?', 'intent:join'],
    ['do you charge a subscription?', 'faq:precio'],
    ['how do I get started?', ['faq:cuando', 'intent:join', 'pricing-faq:Do I need a credit card to get started?']],
    ['is this a chatbot?', 'intent:human'],
    ['write me a song', 'fallback'],
    ['what is the weather in Madrid?', 'fallback'],
  ],
}

/** Lo que haría el stub con una pregunta. */
export function decide(lang, q) {
  const intent = intentOf(q)
  if (intent) return `intent:${intent}`
  // T60: como el stub, sin las listas de integraciones (worker/chat/stub.js · stubSearchable).
  const [top] = search(makeIndex(KB[lang].filter((c) => c.kind !== 'integracion')), q)
  return confident(top) ? top.chunk.id : 'fallback'
}

describe.each(['es', 'en'])('evaluación del stub · %s', (lang) => {
  const cases = CASES[lang]
  const results = cases.map(([q, want]) => ({ q, want: [want].flat(), got: decide(lang, q) }))
  const ok = results.filter((r) => r.want.includes(r.got))
  const rate = ok.length / results.length

  it(`acierta ≥ 85 % (${ok.length}/${results.length})`, () => {
    const bad = results.filter((r) => !r.want.includes(r.got)).map((r) => `${r.q} → ${r.got} (esperado ${r.want})`)
    console.log(`[eval ${lang}] ${(rate * 100).toFixed(1)} % (${ok.length}/${results.length})`)
    expect(rate, bad.join('\n')).toBeGreaterThanOrEqual(0.85)
  })

  it('NUNCA responde con un fragmento a algo que no está en la web (cero invención)', () => {
    for (const r of results.filter((x) => x.want.includes('fallback'))) expect(r.got, r.q).toBe('fallback')
  })
})
