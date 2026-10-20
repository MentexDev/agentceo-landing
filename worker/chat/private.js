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
