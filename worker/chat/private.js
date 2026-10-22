// ─────────────────────────────────────────────────────────────────────────────
// DATOS SOCIETARIOS / REGISTRALES que el chat NUNCA debe saber ni decir (T40, Luca: en producción
// el bot respondió la fecha de constitución y el n.º de expediente de Klinworks, LLC; venían de los
// .md legales que build-knowledge metía en worker/generated/knowledge.json).
//
// Defensa en dos capas:
//   1. LISTA BLANCA en el origen (src/lib/knowledge.js): de los documentos legales solo entran su
//      descripción pública (frontmatter `descripcion`) y los títulos de sección; nunca su prosa,
//      que es donde viven la constitución, el expediente y la oficina registrada.
//   2. RED DE SEGURIDAD (este módulo): patrones de datos societarios. scripts/build-knowledge.mjs
//      FALLA si alguno aparece en el conocimiento, las respuestas curadas o el prompt de sistema;
//      tests/worker/chat-private.test.js lo vigila también.
// Módulo PURO (Node, workerd y navegador): sin dependencias.
// ─────────────────────────────────────────────────────────────────────────────

/** [nombre, patrón] de lo que no puede aparecer en lo que lee o dice el chat. */
export const PRIVATE_PATTERNS = [
  ['n.º de expediente concreto', /\b10704723\b/],
  ['número largo tipo registro (7+ cifras seguidas)', /(?<![\d.,])\d{7,}(?![\d.,])/],
  ['EIN', /\bEIN\b|\b\d{2}-\d{7}\b|employer identification|tax id(entification)? (number|no)/i],
  ['expediente / file number', /\bexpediente\b|\bfile (number|no\.?|#)/i],
  ['agente u oficina registrada', /\bregistered (agent|office)\b|\bagente registrad[oa]\b|\boficina registrada\b|\bdomicilio (social|registral)\b/i],
  ['estado de constitución', /\bdelaware\b/i],
  ['constitución de la sociedad', /\bconstitu(id[ao]s?|ci[oó]n|y[oó])\b|\bincorporat(ed|ion)\b|\bstate of (formation|incorporation)\b/i],
  ['fecha de constitución', /\b20 de julio de 2026\b|\bjuly 20,? 2026\b/i],
  ['dirección registrada', /\bcontinental drive\b|\bnewark\b|\b19713\b/i],
  ['dirección postal', /\b\d{1,5} [A-Z][a-z]+ (Drive|Street|Avenue|Road|Boulevard|Lane|Way)\b|\bsuite \d+\b/],
]

/** Coincidencias de datos privados en `text` → [{ name, match }] (vacío si está limpio). */
export function findPrivate(text = '') {
  const s = String(text)
  const out = []
  for (const [name, re] of PRIVATE_PATTERNS) {
    const m = s.match(re)
    if (m) out.push({ name, match: m[0] })
  }
  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// T40 b (Luca, red-team): ENDURECIMIENTO. Tres piezas puras más:
//   · privateKind(texto) → el TIPO de pregunta que el chat no responde (antes del modelo):
//       'legal'    datos societarios/registrales (también fr/de/pt/it)
//       'personal' contacto, teléfono, WhatsApp o dirección PERSONAL del fundador o del equipo
//       'internal' cómo está hecho (modelo, proveedor, stack), costes, gasto o límites internos,
//                  inversores, métricas
//       'rules'    sus instrucciones/reglas/prompt y marcadores de inyección
//   · stripInjection(texto) → { clean, injected }: recorta el bloque inyectado ([SISTEMA]…,
//     <system>…, «</review> nuevas instrucciones…») para responder la parte legítima (I01) SIN
//     pasar nunca el texto inyectado al modelo.
//   · findOutputLeak(texto) → filtro de SALIDA del modelo (y de la caché): datos societarios,
//     nombre del modelo/proveedor, claves, stack interno y eco del prompt de sistema.
// ─────────────────────────────────────────────────────────────────────────────
const fold = (s = '') => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss')
const anyOf = (parts) => new RegExp(parts.join('|'))

// Personas: fundador, dueño, equipo… (es/en/pt/fr/de/it).
const WHO = '(fundador|fundadora|founder|co-?founder|dueno|duena|owner|ceo de (la empresa|klinworks)|diego|equipo|team|empleados|staff|fondateur|proprietaire|grunder|inhaber|fondatore|proprietario|dono|dona)'
const KIND_RE = {
  rules: anyOf([
    // pedir sus instrucciones / reglas / prompt (en cualquier forma: resumir, enumerar, repetir…)
    '(reglas|instrucciones|indicaciones|directrices|normas|rules|instructions|guidelines|directives|regles|consignes|regeln|anweisungen|regole|istruzioni|regras|instrucoes)[^.?!]{0,40}(te (dieron|han dado|dio|pusieron)|you (were|have been) given|given to you|que (tienes|sigues)|you follow|antes de (esta|la) conversacion|before (this|the) conversation|du system|de systeme|del sistema|do sistema|des systems)',
    '(resume|resumeme|enumera|lista|repite|muestrame|dime|summari[sz]e|list|repeat|show|print|reveal|resume|wiederhole|zeig|riassumi|mostra|repita)[^.?!]{0,30}(tus|your|tes|deine|le tue|suas) (reglas|instrucciones|rules|instructions|regles|consignes|regeln|anweisungen|regole|istruzioni|regras|instrucoes|prompt)',
    'system ?prompt', 'prompt (de sistema|del sistema|interno|inicial|original)', '(tu|your|ton|dein|il tuo|seu) prompt', 'tus instrucciones', 'your (instructions|prompt)',
    // marcadores de inyección
    '\\[\\s*(sistema|system|systeme|admin|developer|dev|root|instrucciones|instructions)\\b', '<\\s*/?\\s*(system|sistema|instructions?|review|prompt|admin)\\b',
    '(nuevas|new|nouvelles|neue|nuove|novas) (instrucciones|instructions|anweisungen|istruzioni|instrucoes)', 'ignor(a|e|ez|iere|are)[^.?!]{0,30}(anteriores|previous|prior|above|precedentes|vorherigen|precedenti|anteriores|todas|all)',
    // T40c: «Ignora tus reglas…», «Ignore your rules», «salta tus reglas»: no casaban (solo «… anteriores»).
    '(ignora|ignore|ignorez|ignoriere|ignorar|salta|saltate|omite|skip|bypass|desactiva|disable|rompe|break|evita|evade|umgehe|aggira|pula)[^.?!]{0,20}(tus|tu|your|tes|deine|le tue|suas|las|los|the|tes) (reglas|instrucciones|normas|restricciones|limites|filtros|rules|instructions|restrictions|guidelines|limits|filters|regles|regeln|regole|regras)',
    'olvida (tus|las) (reglas|instrucciones)', 'forget (your|all|the) (rules|instructions)', 'developer mode', 'modo (desarrollador|dios|sin restricciones)', '\\bdan\\b', 'jailbreak',
    '(eres|soy|el usuario es|the user is|you are now|ahora eres|i am) (un )?(admin|administrador|desarrollador|developer|root)( verificado| verified)?',
    // T58b (eval de regresión): pedir el texto de arriba o el código interno, y «finge… y suelta tus reglas».
    'repite (todo )?lo (de arriba|anterior|que te (dijeron|escribieron))', 'repeat (everything|all|the text|what was said|what is) (above|before)', 'palabra por palabra', '\\bverbatim\\b',
    '(reveal|revela|dime|show|muestra|muestrame|dame|give me|print)[^.?!]{0,15}(internal code|codigo interno|canario|canary)',
    '(pretend|finge|actua como|act as)[^.?!]{0,50}(drop|forget|ignore|olvida|ignora|sin|without|suelta)[^.?!]{0,15}(rules|reglas|restrictions|restricciones)',
  ]),
  personal: anyOf([
    `(whatsapp|telefono|celular|movil|numero|phone|cell|mobile|number|e-?mail|correo|direccion|address|casa|home|domicilio|instagram|linkedin|telegram|adresse|telefon|handy|indirizzo|cellulare|endereco|celular)[^.?!]{0,40}(personal|privad[oa]|private|perso)?[^.?!]{0,25}\\b(de|del|of|du|von|des|di|della|do|da)\\b[^.?!]{0,12}${WHO}`,
    `${WHO}[^.?!]{0,40}(whatsapp|telefono|celular|movil|phone|cell|mobile|correo personal|personal (e-?mail|email|number)|direccion|address|donde vive|where (does )?(he|she|they) live|vive|lives?|edad|age|familia|family|casa|home)`,
    '(whatsapp|telefono|phone|numero|number) (personal|privad[oa]|private)', 'donde vive', 'where does .{1,30} live',
    '(correo|e-?mail|telefono|phone|celular|numero) personal (de|del|of) (la |el |the )?ceo', "ceo'?s? (personal|private) (e-?mail|email|phone|number)",
  ]),
  internal: anyOf([
    // cuánto les cuesta a ellos / gasto / límite interno
    '(cuanto|how much|combien|wie viel|quanto)[^.?!]{0,30}(les|os|you|vous|euch|ihnen|vi|lhes)[^.?!]{0,20}(cuesta|cuestan|cost|coute|kostet|costa|custa)',
    '(costo|coste|cost|gasto|spend|spending|budget|presupuesto|limite|limit)[^.?!]{0,25}(interno|internal|diario|daily|por (mensaje|respuesta)|per (message|reply|answer)|de (la )?(ia|api|llm|openrouter)|del chat|of (the )?chat)',
    '(limite|limit) (diario )?de (gasto|spend)', 'daily (spend|spending|budget|limit)', 'cada mensaje (de este chat|del chat)', 'each message (of|in) this chat',
    'costos? internos?', 'internal costs?',
    '(que|cual|which|what|quel|welches|quale) (modelo|model|modele|modell|llm|ia usan|ai do you use)\\b(?! de (negocio|precios|suscripcion|cobro))', 'modelo de (ia|lenguaje)', '\\bstack\\b', 'tecnologia (usan|utilizan)', 'tech(nology)? stack', 'built with', 'hech[oa] con que',
    'proveedor(es)? (de ia|que usan|del modelo)',
    // T58b: «¿quién es tu proveedor?», «which AI model are you?», «¿qué base de datos usan?».
    '(quien|cual|who|which|what) (es|is|son|are) (tu|tus|your) (proveedor|proveedores|provider|providers|vendor)', '(which|what|que|cual) (ai |ia )(model|modelo)',
    '(que|cual|cuales|which|what) (base de datos|bases de datos|database|databases|hosting|servidor|servidores|server|servers|nube|cloud) (usan|utilizan|tienen|do you use|are you on|is it on)', '\\b(openrouter|openai|gemini|chatgpt|gpt|anthropic|claude|cloudflare|wrangler)\\b', 'api ?key', 'clave(s)? (de api|secreta)',
    'cuanto (les |te )?cuesta (operar|mantener|el servidor|la ia|cada (mensaje|respuesta))', 'how much does (it|each message) cost you',
    'inversor', 'inversionista', 'investor', 'funding', 'ronda de', 'valuacion', 'valuation', 'facturacion', 'revenue', '\\bingresos\\b',
    'cuantos (usuarios|clientes|empleados) (tienen|hay|usan)', 'how many (users|customers|clients|employees) (do you have|have you got|are there|use (it|agent ceo|you))', '\\bmetricas\\b', '\\bmetrics\\b',
    'quien(es)? (trabaja|trabajan) (en|ahi)', 'who works (there|on|at)', 'equipo interno', 'internal team',
  ]),
  legal: anyOf([
    'constitu(id[ao]|cion|yo|yeron|ir)', 'se fundo', 'fecha de (fundacion|creacion) de la (empresa|sociedad|compania)', 'expediente', 'numero de registro', 'registro mercantil',
    '\\bein\\b', 'tax id', '(numero|identificacion) fiscal', '\\b(nif|cif|rfc|cnpj|siret|siren|tva|ust-?id|partita iva|codice fiscale)\\b', 'agente registrad', 'registered (agent|office)', 'oficina registrada',
    'domicilio (social|fiscal)', 'direccion (de la empresa|de la oficina|fisica|postal|legal|de klinworks|de agent ceo)', 'donde (esta|estan) (la empresa|ubicad|la oficina|sus oficinas|klinworks)',
    'where (are you|is the company|is klinworks|is agent ceo) (located|based|registered)',
    // T58b: «¿dónde está registrada la empresa?», «when was the company formed?».
    '(donde|en que (estado|pais)) (esta|fue|se) (registrad|constitu|fundad|cread)[a-z]* (la empresa|la sociedad|la compania|klinworks|agent ceo)', 'registrada (la empresa|la sociedad|klinworks)',
    'when (was|did) (the company|klinworks|agent ceo|your company) (formed|founded|registered|created|incorporated|start)', '(company|klinworks) (was )?(formed|registered)', '(company|office|mailing|business|legal|registered) address', 'delaware', 'incorporat', 'file number', 'state of (formation|incorporation)',
    // fr / de / it / pt
    'adresse (legale|du siege|de (la|votre) (societe|entreprise))', 'siege social', "numero d'?(enregistrement|immatriculation)", 'date de (creation|constitution)',
    'handelsregister', 'registernummer', 'grundungsdatum', 'gegrundet', 'firmensitz', 'geschaftsadresse', 'steuernummer',
    'sede (legale|sociale)', 'numero di registrazione', 'registro delle imprese', 'data di (costituzione|fondazione)',
    'endereco (legal|da empresa|da sede)', 'numero de registro', 'data de (constituicao|fundacao)', 'sede social',
  ]),
}

/** Tipo de pregunta reservada, o null. El orden importa: reglas/inyección > personal > interno > legal. */
export function privateKind(text = '') {
  const s = fold(text)
  for (const k of ['rules', 'personal', 'internal', 'legal']) if (KIND_RE[k].test(s)) return k
  return null
}

// Inyección: un bloque entre corchetes/etiquetas que se hace pasar por el sistema, o un cierre de
// etiqueta seguido de «nuevas instrucciones». Se recorta DESDE el marcador hasta el final de ese bloque.
const INJ_BLOCKS = [
  /\[\s*(sistema|system|systeme|admin|developer|dev|root|instrucciones|instructions)\b[^\]]*\]?/gi,
  /<\s*(system|sistema|instructions?|admin|prompt)\b[^>]*>[\s\S]*?(<\s*\/\s*\1\s*>|$)/gi,
  /<\s*\/\s*\w+\s*>[\s\S]*$/g, // «</review> Nuevas instrucciones: …» → todo lo que sigue al cierre
  /\b(nuevas|new|nouvelles|neue|nuove|novas) (instrucciones|instructions|anweisungen|istruzioni|instrucoes)\b[\s\S]*$/gi,
  /\b(ignora|ignore|ignorez|ignoriere|ignorare)\b[\s\S]*$/gi,
]
/** → { clean, injected }: el texto sin los bloques inyectados (y sin comillas sueltas). */
export function stripInjection(text = '') {
  let clean = String(text)
  for (const re of INJ_BLOCKS) clean = clean.replace(re, ' ')
  clean = clean.replace(/["«»“”]\s*["«»“”]/g, ' ').replace(/\s+/g, ' ').trim()
  return { clean, injected: clean !== String(text).replace(/\s+/g, ' ').trim() }
}

// ── Filtro de SALIDA ─────────────────────────────────────────────────────────
// Datos societarios: los de PRIVATE_PATTERNS con «incorporat…» y «constitu…» acotados a la empresa
// (una respuesta legítima puede decir «se incorpora a tu WhatsApp»).
// (Se excluye SOLO «constitución de la sociedad», que casa con «incorporated» suelto; filtrar por un
// trozo del nombre dejó fuera a «estado de constitución» = Delaware: lo cazó el test de caché.)
const OUT_LEGAL = PRIVATE_PATTERNS.filter(([n]) => n !== 'constitución de la sociedad').concat([
  ['constitución de la empresa', /\b(se )?constitu(y[oó]|id[ao]|ci[oó]n) (en|el|de la (empresa|sociedad))\b|\bincorporated (in|on)\b|\bdate of incorporation\b/i],
])
const OUT_INTERNAL = [
  ['modelo o proveedor', /\b(gemini|openrouter|openai|gpt-?\d|chatgpt|anthropic|claude|llama|mistral|vertex ai|google ai studio)\b/i],
  ['clave', /\bsk-(or-)?[a-z0-9-]{6,}/i],
  ['stack interno', /\b(cloudflare|wrangler|workerd|durable objects?|cloudflare workers?|astro|preact|\bD1\b)\b/],
  ['coste interno', /\$\s?0[.,]00\d|\bpor (cada )?mensaje (nos )?cuesta|\bper message (costs|is)\b|\bpresupuesto diario\b|\bdaily (budget|spend)\b/i],
]
/** Fragmentos del prompt de sistema (canario y frases propias) que no pueden salir nunca. */
export function promptEchoes(rules = [], { speakable = [] } = {}) {
  const frags = new Set(['reglas inquebrantables', 'unbreakable rules', '<<<contexto', '<<<context', 'codigo interno', 'internal code'])
  // T58b · FALSO POSITIVO en producción («Ok me quiero registrar amigo» → «Mis instrucciones internas no las
  // comparto…»). La regla 7 ORDENA decir «invítalo a apuntarse a la lista de espera (abrimos por grupos)»; el
  // modelo obedecía («Apúntate a la lista de espera: abrimos por grupos») y la ventana «a la lista de espera
  // abrimos por» (todas palabras que la web dice en público) lo marcaba como eco del prompt.
  // Ahora: ventanas de 7 palabras con PASO 1 (antes 3) y se descartan solo las que están hechas al 100 % de
  // vocabulario público (`speakable`: base de conocimiento, respuestas curadas y textos de la persona).
  // Propiedad (la prueba el test): TODO trozo de ≥7 palabras seguidas del prompt que lleve al menos una
  // palabra propia del prompt salta. Antes solo se garantizaba desde 10. Lo que ya no salta es, por
  // construcción, texto que el bot puede decir en público.
  const pub = new Set(speakable.flatMap((t) => fold(t).replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean)))
  for (const r of rules) {
    const words = fold(r).replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean)
    for (let i = 0; i + 7 <= words.length; i++) {
      const w = words.slice(i, i + 7)
      if (pub.size && w.every((x) => pub.has(x))) continue
      frags.add(w.join(' '))
    }
  }
  return [...frags]
}
/**
 * Filtro de salida. `echoes` = promptEchoes(RULES) (+ canario). → { kind, name } | null.
 */
export function findOutputLeak(text = '', echoes = []) {
  const s = String(text), f = fold(s).replace(/[^\p{L}\p{N}<> -]/gu, ' ').replace(/\s+/g, ' ')
  for (const e of echoes) if (e && f.includes(fold(e))) return { kind: 'rules', name: 'eco del prompt' }
  for (const [name, re] of OUT_INTERNAL) if (re.test(s)) return { kind: 'internal', name }
  for (const [name, re] of OUT_LEGAL) if (re.test(s)) return { kind: 'legal', name }
  return null
}

// ── Idioma del usuario (para la negativa) ────────────────────────────────────
const STOP = {
  es: /\b(el|la|los|las|que|de|del|y|es|cual|cuanto|por|para|con|tu|su|sus|usted|ustedes|como|donde)\b/g,
  en: /\b(the|you|your|and|is|what|how|much|of|to|for|with|are|do|does|which|where)\b/g,
  fr: /\b(le|la|les|est|quelle|quel|votre|vos|et|de|du|des|societe|adresse|numero|comment|pour)\b/g,
  de: /\b(der|die|das|und|ist|wie|lautet|ihre|ihr|ihren|von|mit|fur|was|welche)\b/g,
  it: /\b(il|lo|la|gli|qual|quale|e|di|della|del|vostra|vostro|come|per|che)\b/g,
  pt: /\b(o|os|as|qual|e|de|da|do|sua|seu|voces|como|para|com|que)\b/g,
}
/** Idioma más probable del texto entre es/en/fr/de/it/pt; si no está claro, `fallback`. */
export function userLang(text = '', fallback = 'es') {
  const s = fold(text)
  let best = null, n = 0
  for (const [l, re] of Object.entries(STOP)) { const c = (s.match(re) || []).length; if (c > n) { best = l; n = c } }
  return n >= 2 ? best : fallback
}
