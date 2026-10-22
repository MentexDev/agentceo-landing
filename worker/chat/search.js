// ─────────────────────────────────────────────────────────────────────────────
// Búsqueda BM25 sobre la base de conocimiento del sitio (sin LLM, coste cero).
// Es el cerebro del modo STUB y el primer filtro del modo LIVE: si la confianza
// es alta, se responde sin llamar al modelo (y sin gastar).
// Función pura: se prueba igual en Node y en workerd.
// ─────────────────────────────────────────────────────────────────────────────

const STOP = new Set((
  // español
  'a al algo alguna alguno algun ante antes como con contra cual cuales de del desde donde dos el ella ellos en entre era es esa ese eso esta este esto estos fue ha hay la las le les lo los mas me mi mis muy ni no nos o os otra otro para pero poco por porque que quien se ser si sin sobre su sus te ti tu tus un una uno unos y ya yo usted ustedes puedo puede pueden tengo tiene tienen hace hacen quiero saber decir dime explicame cuentame hola oye necesito necesita nada usar uso algo cosa cosas va van estar ser sera hago hacer quedo pasa ' +
  // inglés
  'a an and are as at be but by can could do does for from had has have how i if in into is it its me my of on or our so than that the their them then there these they this to us was we were what when where which will with would you your tell please hey need needs use using thing things ' +
  // portugués (T62): solo las que no son ya del español
  'ao aos as da das do dos eu ele ela eles elas isso isto aquilo um uma uns umas meu minha meus minhas seu sua seus suas nosso nossa voce voces vc vcs tem tenho temos pode podem posso quero queria saber dizer diga me conta oi ola preciso nao sim pra pro pela pelo pelos pelas com na nas numa num ja so mais muito muita tambem qual quais onde quando porque ser estar sao esta estao era foi fazer faz faco ter vai vao coisa coisas usar uso'
).split(' '))

// Sinónimos → término canónico (la pregunta del usuario rara vez usa las palabras del FAQ).
const SYN = {
  cuesta: 'precio', cuestan: 'precio', costo: 'precio', coste: 'precio', cuanto: 'precio', vale: 'precio', valen: 'precio', tarifa: 'precio', tarifas: 'precio', plan: 'precio', planes: 'precio', pagar: 'precio', gratis: 'precio', gratuito: 'precio',
  mensual: 'precio', mensualidad: 'precio', suscripcion: 'precio', cuota: 'precio', cobran: 'precio', fee: 'precio', fees: 'precio', monthly: 'precio', subscription: 'precio', charge: 'precio',
  price: 'precio', prices: 'precio', pricing: 'precio', cost: 'precio', costs: 'precio', free: 'precio', pay: 'precio', plans: 'precio',
  programar: 'tecnologia', codigo: 'tecnologia', programacion: 'tecnologia', tecnico: 'tecnologia', tecnica: 'tecnologia', coding: 'tecnologia', code: 'tecnologia', technical: 'tecnologia', technology: 'tecnologia', programmer: 'tecnologia', developer: 'tecnologia',
  seguro: 'datos', segura: 'datos', seguridad: 'datos', privacidad: 'datos', informacion: 'datos', safe: 'datos', secure: 'datos', security: 'datos', privacy: 'datos', data: 'datos',
  aprende: 'entrenamiento', aprenden: 'entrenamiento', aprenda: 'entrenamiento', aprender: 'entrenamiento', learn: 'entrenamiento', learns: 'entrenamiento',
  entrenar: 'entrenamiento', entrenan: 'entrenamiento', train: 'entrenamiento', training: 'entrenamiento', trained: 'entrenamiento',
  abre: 'lanzamiento', abren: 'lanzamiento', lanzan: 'lanzamiento', lanza: 'lanzamiento', disponible: 'lanzamiento', empezar: 'lanzamiento', comenzar: 'lanzamiento', start: 'lanzamiento', begin: 'lanzamiento', started: 'lanzamiento', open: 'lanzamiento', opens: 'lanzamiento', launch: 'lanzamiento', available: 'lanzamiento', release: 'lanzamiento',
  contestan: 'responder', contesta: 'responder', responde: 'responder', responden: 'responder', atienden: 'responder', atiende: 'responder', reply: 'responder', replies: 'responder', answer: 'responder', answers: 'responder', respond: 'responder',
  whatsapp: 'whatsapp', wsp: 'whatsapp', wpp: 'whatsapp', whats: 'whatsapp',
  shopify: 'tienda', tienda: 'tienda', ecommerce: 'tienda', store: 'tienda', shop: 'tienda',
  web: 'web', pagina: 'web', sitio: 'web', app: 'web', aplicacion: 'web', website: 'web', site: 'web',
  negocios: 'negocio', empresas: 'negocio', empresa: 'negocio', marcas: 'negocio', business: 'negocio', businesses: 'negocio', companies: 'negocio', several: 'varios', multiple: 'varios',
  agente: 'agente', agentes: 'agente', empleado: 'agente', empleados: 'agente', agent: 'agente', agents: 'agente', employee: 'agente', employees: 'agente',
  dinero: 'dinero', gastar: 'dinero', gasto: 'dinero', gastos: 'dinero', spend: 'dinero', spending: 'dinero', money: 'dinero',
  asking: 'permiso', solo: 'permiso', solos: 'permiso', avisarme: 'permiso', avisar: 'permiso', permiso: 'permiso', aprobar: 'permiso', autonomos: 'permiso', alone: 'permiso', permission: 'permiso', approve: 'permiso', ask: 'permiso', without: 'permiso',
  herramientas: 'conectar', integraciones: 'conectar', conecta: 'conectar', conectan: 'conectar', integra: 'conectar', tools: 'conectar', integrations: 'conectar', connect: 'conectar', connects: 'conectar', gmail: 'conectar', drive: 'conectar',
  traba: 'atasca', trabado: 'atasca', bloquea: 'atasca', bloqueada: 'atasca', atora: 'atasca',
  atasca: 'atasca', atascado: 'atasca', falla: 'atasca', error: 'atasca', stuck: 'atasca', fails: 'atasca', breaks: 'atasca',
  gusta: 'rechazar', rechazar: 'rechazar', cambios: 'rechazar', corregir: 'rechazar', like: 'rechazar', reject: 'rechazar', changes: 'rechazar',
  quien: 'klinworks', detras: 'klinworks', compania: 'klinworks', behind: 'klinworks', company: 'klinworks', klinworks: 'klinworks', who: 'klinworks',
  // portugués (T62) → los mismos términos canónicos
  custa: 'precio', custam: 'precio', custo: 'precio', quanto: 'precio', preco: 'precio', valor: 'precio', valores: 'precio', plano: 'precio', planos: 'precio', mensalidade: 'precio', assinatura: 'precio', cobram: 'precio', gratuita: 'precio',
  programacao: 'tecnologia', tecnica: 'tecnologia', programador: 'tecnologia', desenvolvedor: 'tecnologia',
  seguranca: 'datos', privacidade: 'datos', informacao: 'datos', informacoes: 'datos', dados: 'datos',
  aprendem: 'entrenamiento', treinar: 'entrenamiento', treinam: 'entrenamiento', treinamento: 'entrenamiento',
  abrem: 'lanzamiento', lancam: 'lanzamiento', lancamento: 'lanzamiento', disponivel: 'lanzamiento', comecar: 'lanzamiento', comeca: 'lanzamiento',
  respondem: 'responder', atende: 'responder', atendem: 'responder',
  zap: 'whatsapp', loja: 'tienda', lojas: 'tienda', aplicativo: 'web',
  agente: 'agente', funcionario: 'agente', funcionarios: 'agente',
  dinheiro: 'dinero',
  sozinho: 'permiso', sozinhos: 'permiso', avisar: 'permiso', permissao: 'permiso',
  ferramentas: 'conectar', integracoes: 'conectar', integracao: 'conectar', conectam: 'conectar', integram: 'conectar',
  trava: 'atasca', travado: 'atasca', travar: 'atasca', falha: 'atasca', erro: 'atasca',
  gostar: 'rechazar', gosto: 'rechazar', rejeitar: 'rechazar', mudancas: 'rechazar',
  quem: 'klinworks', tras: 'klinworks',
}

/** Normaliza: minúsculas, sin acentos, sin puntuación. */
export const norm = (s = '') => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Tokens con stopwords fuera, sinónimos aplicados y plurales simples recortados. */
export function tokens(s = '') {
  const out = []
  for (let w of norm(s).split(/[^a-z0-9ñ]+/)) {
    if (!w || w.length < 2 || STOP.has(w)) continue
    if (SYN[w]) { out.push(SYN[w]); continue }
    if (w.length > 4 && w.endsWith('es')) w = w.slice(0, -2)
    else if (w.length > 3 && w.endsWith('s')) w = w.slice(0, -1)
    out.push(SYN[w] || w)
  }
  return out
}

/** Índice BM25. El título pesa doble (se indexa dos veces). */
export function makeIndex(chunks) {
  const docs = chunks.map((c) => {
    const title = tokens(c.title)
    const toks = [...title, ...title, ...tokens(c.text)]
    const tf = new Map()
    for (const tk of toks) tf.set(tk, (tf.get(tk) || 0) + 1)
    return { c, tf, len: toks.length, title: new Set(title) }
  })
  const df = new Map()
  for (const d of docs) for (const tk of d.tf.keys()) df.set(tk, (df.get(tk) || 0) + 1)
  const avg = docs.reduce((a, d) => a + d.len, 0) / Math.max(1, docs.length)
  return { docs, df, avg, N: docs.length }
}

const K1 = 1.2, B = 0.75
const BRAND = new Set(['agent', 'ceo'])

/** Devuelve [{ chunk, score, coverage }] ordenado. coverage = fracción de términos de la pregunta encontrados. */
export function search(index, query, k = 5) {
  const q = [...new Set(tokens(query))]
  if (!q.length) return []
  // La MARCA («agente» + «ceo» en español) cuenta para la confianza general (las preguntas SOBRE
  // Agent CEO dependen de ella), pero no para la de un documento LEGAL (T40c, medido: «¿Agent CEO
  // puede hacer mi declaración de renta…?» casaba con «Declaración de accesibilidad» por una sola
  // palabra real; quitarla de todas las coberturas rompía «Hola amigo, ¿qué es Agent CEO?»).
  const pair = q.includes('ceo') && (q.includes('agente') || q.includes('agent'))
  const isBrand = (tk) => BRAND.has(tk) || (pair && tk === 'agente')
  const core = q.filter((tk) => !isBrand(tk))
  const res = []
  for (const d of index.docs) {
    let score = 0, hit = 0, inTitle = 0, coreHit = 0
    for (const tk of q) {
      if (d.title.has(tk)) inTitle++
      const f = d.tf.get(tk)
      if (!f) continue
      hit++
      if (!isBrand(tk)) coreHit++
      const n = index.df.get(tk)
      // La marca aparece en casi cualquier pregunta («¿cuánto cuesta Agent CEO?»): pesa poco,
      // para que no arrastre la respuesta a «¿qué es Agent CEO?» (fallo medido en las evals T32).
      const idf = Math.log(1 + (index.N - n + 0.5) / (n + 0.5)) * (isBrand(tk) ? 0.35 : 1)
      score += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.len) / index.avg)))
    }
    // Que la pregunta esté contenida en el título es la señal más fuerte (p. ej. «¿qué es un agente?»).
    if (score > 0) score += 2 * (inTitle / q.length)
    // Las FAQ son respuestas directas: a igualdad, ganan a un artículo largo. La letra legal
    // pesa menos: solo gana cuando la pregunta es claramente legal (reembolsos, datos, DMCA…).
    // Las guías curadas (content/chat-knowledge.js) resumen secciones enteras: ceden ante una FAQ.
    const w = d.c.kind === 'faq' ? 1.25 : d.c.kind === 'legal' ? 0.7 : d.c.kind === 'guia' ? 0.9 : 1
    if (score > 0) res.push({ chunk: d.c, score: score * w, coverage: hit / q.length, titleHit: inTitle / q.length, core: core.length ? coreHit / core.length : 1 })
  }
  return res.sort((a, b) => b.score - a.score).slice(0, k)
}

/**
 * ¿Respuesta con confianza suficiente para darla sin LLM? Medido en tests/site/chat-eval.
 * Exige puntuación mínima y, o bien que la pregunta toque el TÍTULO del fragmento, o bien
 * una cobertura alta. Así «escríbeme un poema» no se responde con un texto que solo
 * contiene «escribe» de pasada.
 */
export const confident = (r) =>
  Boolean(r) && r.score >= 2.2 && ((r.titleHit > 0 && r.coverage >= 0.5) || r.coverage >= 0.75) &&
  // Un documento LEGAL solo si la pregunta lo toca sin contar la marca (T40c).
  (r.chunk.kind !== 'legal' || (r.core ?? 1) >= 0.5)
