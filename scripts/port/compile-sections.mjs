#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// COMPILADOR DEL PROTOTIPO · design/prototype (21 secciones × escritorio + móvil)
//                          → src/sections/gen (UNA sección responsive cada una)
//
// Por qué un compilador y no reescribir a mano (medido en la FASE 3):
//   · escritorio y móvil comparten estructura en 15 de 21 secciones (2–56 líneas
//     distintas, casi todas valores de estilo) → se pueden FUSIONAR sin perder nada;
//   · 4.017 objetos style inline, 134 condicionales `{(v.x) ? (<>…</>) : null}`,
//     textos fijos y `{s(v.x)}`: un patrón regular, generado por máquina.
//   Reescribirlo a mano arriesgaba perder «la vida» del prototipo, que Diego pidió
//   conservar íntegra.
//
// Qué hace, por sección:
//   1. Fusiona el árbol de escritorio con el de móvil. Donde la estructura difiere,
//      conserva AMBAS ramas marcadas .only-d / .only-m (alineación LCS de hijos).
//   2. Saca cada style estático a una clase CSS (deduplicada). Escritorio escala con
//      --u (sustituye al `zoom` por JS); móvil se emite como override en ≤1023 px.
//      Las variables CSS (--i, --d…) y los estilos dinámicos se quedan inline.
//   3. Corrige el CONTRASTE según el fondo heredado: dorado o gris claro como texto
//      sobre fondo claro → #7A5C17 / #5E5C56 (WCAG AA, medido en la FASE 0).
//   4. Extrae todo texto visible y los atributos de texto (aria-label, placeholder,
//      title, alt) a un diccionario: src/i18n/sections/es.json → {t.kN} en el JSX.
//
// Uso:  node scripts/port/compile-sections.mjs     (escribe src/sections/gen/*)
// No se ejecuta en el build: la salida se versiona y se revisa como código.
// ═══════════════════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { parse } from '@babel/parser'
import _generate from '@babel/generator'

const generate = _generate.default || _generate
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const PROTO = join(ROOT, 'design', 'prototype', 'src')
const OUT = join(ROOT, 'src', 'sections', 'gen')
const I18N = join(ROOT, 'src', 'i18n', 'sections')

// Secciones que se sustituyen por componentes del sitio (no se compilan):
//   S01 → Header.astro · S20 → Footer.astro · S21 → WaitlistModal.astro · S03 → appdemo
// S03 (recorrido simulado del prototipo) se sustituye por la recreación de la app real
// (src/sections/appdemo, fase S03, 2026-10-20).
const SKIP = new Set(['S01', 'S03', 'S20', 'S21'])
// Secciones cuyo formulario de lista de espera se sustituye por <WaitlistForm> (children).
const FORM_SLOT = new Set(['S02', 'S19'])
const BREAK = 1023 // ≤ esto: diseño móvil

const gen = (node) => generate(node, { jsescOption: { minimal: true } }).code
const warnings = []
const warn = (sec, msg) => warnings.push(`${sec}: ${msg}`)

// ── Texto JSX con la semántica de React (babel-plugin-transform-react-jsx) ──
function cleanJSXText(raw) {
  const lines = raw.split(/\r\n|\n|\r/)
  let lastNonEmpty = 0
  for (let i = 0; i < lines.length; i++) if (/[^ \t]/.test(lines[i])) lastNonEmpty = i
  let str = ''
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isFirst = i === 0, isLast = i === lines.length - 1, isLastNonEmpty = i === lastNonEmpty
    let trimmed = line.replace(/\t/g, ' ')
    if (!isFirst) trimmed = trimmed.replace(/^[ ]+/, '')
    if (!isLast) trimmed = trimmed.replace(/[ ]+$/, '')
    if (trimmed) {
      if (!isLastNonEmpty) trimmed += ' '
      str += trimmed
    }
  }
  return str
}

// ── Árbol: hijos significativos con su «firma» para alinear ────────────────
function kids(node) {
  return (node.children || []).filter((c) => !(c.type === 'JSXText' && cleanJSXText(c.value) === ''))
}
const nameOf = (el) => gen(el.openingElement.name)
const norm = (x) => x.replace(/\s+/g, ' ').trim()
function classSig(el) {
  const a = el.openingElement.attributes.find((x) => x.type === 'JSXAttribute' && x.name.name === 'className')
  if (!a) return ''
  return a.value.type === 'StringLiteral' ? `.${norm(a.value.value)}` : `.{${gen(a.value.expression)}}`
}
function sig(c) {
  if (c.type === 'JSXElement') return `el:${nameOf(c)}${classSig(c)}`
  if (c.type === 'JSXFragment') return 'frag'
  if (c.type === 'JSXText') return 'text'
  if (c.type === 'JSXExpressionContainer') {
    const e = c.expression
    if (e.type === 'ConditionalExpression') return `cond:${gen(e.test)}`
    return `expr:${gen(e)}`
  }
  return c.type
}

/** LCS de dos listas de firmas → pares [i, j] alineados. */
function lcs(a, b) {
  const n = a.length, m = b.length
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1))
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const pairs = []
  let i = 0, j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) { pairs.push([i, j]); i++; j++ }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++
    else j++
  }
  return pairs
}

// ── Estilos → CSS ───────────────────────────────────────────────────────────
const kebab = (k) => (k.startsWith('--') ? k : k.replace(/^(Webkit|Moz|ms)(?=[A-Z])/, (p) => `-${p.toLowerCase()}`).replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`))
const DARK_BG = /^(#111113|#1f1f23|#18181b|#0e0e10|rgba?\(17,\s*17,\s*19)/i
const LIGHT_BG = /^(#F4F2ED|#FBFAF7|#fff|#ffffff|#EFE4C8|#D9B866|#f7f5f0|white)/i

function readStyle(obj) {
  // → { stat: {css-prop: value}, keep: [ObjectProperty] (vars y dinámicos) }
  const stat = {}, keep = []
  for (const p of obj.properties) {
    if (p.type !== 'ObjectProperty') { keep.push(p); continue }
    const key = p.key.type === 'Identifier' ? p.key.name : p.key.value
    const v = p.value
    const lit = v.type === 'StringLiteral' ? v.value : v.type === 'NumericLiteral' ? String(v.value) : null
    if (lit === null || key.startsWith('--')) { keep.push(p); continue }
    stat[kebab(key)] = lit
  }
  return { stat, keep }
}

/** Escala px del diseño de escritorio con --u (≤ 2px se quedan: bordes y filetes). */
function scalePx(prop, value) {
  if (prop === 'font-size') {
    const m = /^(\d*\.?\d+)px$/.exec(value)
    if (m) {
      const n = parseFloat(m[1])
      return n <= 12 ? value : `max(calc(${n} * var(--u)), ${Math.min(n, 13)}px)`
    }
  }
  return value.replace(/(-?\d*\.?\d+)px\b/g, (all, num) => {
    const n = parseFloat(num)
    if (Math.abs(n) <= 2) return all
    return `calc(${n} * var(--u))`
  })
}

/** Contraste: color de texto según el fondo heredado. */
function fixColor(prop, value, dark) {
  if (prop !== 'color' || dark) return value
  if (/^#(B8923A|D9B866)$/i.test(value)) return '#7A5C17'
  if (/^#a9a7a0$/i.test(value)) return '#5E5C56'
  return value
}

/** Texto claro sobre dorado (2,9:1 y 1,7:1, falla AA) → tinta (6,5:1 / 9,9:1). */
const GOLD_BG = /^#(B8923A|D9B866|EFE4C8)$/i
const LIGHT_TXT = /^(#fff|#ffffff|#F4F2ED|#FBFAF7|white)$/i
function onGold(stat) {
  const bg = stat.background || stat['background-color']
  if (bg && GOLD_BG.test(bg) && stat.color && LIGHT_TXT.test(stat.color)) return { ...stat, color: '#111113' }
  return stat
}

const rules = new Map() // className → { base, mob }
const usedBy = new Map() // className → Set(sección)
let currentSection = ''
function classFor(desk, mob, dark) {
  desk = onGold(desk)
  mob = onGold(mob)
  const base = Object.entries(desk).map(([k, v]) => `${k}:${scalePx(k, fixColor(k, v, dark))}`).join(';')
  // En móvil --u = 1px: un valor idéntico en los dos diseños no necesita override.
  const over = Object.entries(mob)
    .filter(([k, v]) => desk[k] !== v)
    .map(([k, v]) => `${k}:${fixColor(k, v, dark)}`)
  // Lo que escritorio define y móvil NO: en móvil vuelve a lo que diga la capa del
  // prototipo (como pasaba sin el style inline) → revert-layer.
  for (const k of Object.keys(desk)) if (!(k in mob)) over.push(`${k}:revert-layer`)
  const mobStr = over.join(';')
  const name = `x${createHash('sha1').update(`${base}|${mobStr}`).digest('base64url').replace(/[-_]/g, '').slice(0, 6)}`
  if (!rules.has(name)) rules.set(name, { base, mob: mobStr })
  if (!usedBy.has(name)) usedBy.set(name, new Set())
  usedBy.get(name).add(currentSection)
  return name
}

// ── i18n ────────────────────────────────────────────────────────────────────
const TEXT_ATTRS = new Set(['aria-label', 'placeholder', 'title', 'alt', 'aria-roledescription'])
function makeDict() {
  const byText = new Map(), dict = {}
  let n = 0
  return {
    key(text) {
      if (byText.has(text)) return byText.get(text)
      const k = `k${++n}`
      byText.set(text, k)
      dict[k] = text
      return k
    },
    dict,
  }
}

// ── Construcción de AST (con @babel/parser para no depender de @babel/types) ─
const ex = (code) => parse(`(${code})`, { plugins: ['jsx'] }).program.body[0].expression
const tRef = (k) => ex(`t.${k}`)
const exprContainer = (expr) => ({ type: 'JSXExpressionContainer', expression: expr })
const strAttr = (name, value) => ({ type: 'JSXAttribute', name: { type: 'JSXIdentifier', name }, value: { type: 'StringLiteral', value } })

function addClass(el, cls) {
  const attrs = el.openingElement.attributes
  const a = attrs.find((x) => x.type === 'JSXAttribute' && x.name.name === 'className')
  if (!a) { attrs.push(strAttr('className', cls)); return }
  if (a.value.type === 'StringLiteral') { a.value.value = `${a.value.value.trim()} ${cls}`.trim(); return }
  // className={expr} → className={`${expr} cls`}
  const inner = gen(a.value.expression)
  a.value = exprContainer(ex(`\`\${${inner}} ${cls}\``))
}

/** Envuelve un hijo no-elemento para poder marcarlo only-d / only-m. */
function wrapOnly(child, cls) {
  if (child.type === 'JSXElement') { addClass(child, cls); return child }
  return { type: 'JSXElement', openingElement: { type: 'JSXOpeningElement', name: { type: 'JSXIdentifier', name: 'span' }, attributes: [strAttr('className', `${cls} dc`)], selfClosing: false }, closingElement: { type: 'JSXClosingElement', name: { type: 'JSXIdentifier', name: 'span' } }, children: [child] }
}

// ── Fusión ──────────────────────────────────────────────────────────────────
function isDarkStyle(stat) {
  const bg = stat.background || stat['background-color']
  if (!bg) return null
  if (DARK_BG.test(bg)) return true
  if (LIGHT_BG.test(bg)) return false
  return null
}

function processElement(sec, d, m, ctx) {
  const dAttrs = d.openingElement.attributes
  const mAttrs = m ? m.openingElement.attributes : []
  const byName = (list, n) => list.find((x) => x.type === 'JSXAttribute' && x.name.name === n)

  // Otros atributos: diferencias escritorio/móvil (ANTES de tocar nada)
  const sizeOver = {}
  if (m) {
    for (const ma of mAttrs) {
      if (ma.type !== 'JSXAttribute' || ma.name.name === 'style') continue
      const da = byName(dAttrs, ma.name.name)
      if (!da) { warn(sec, `atributo solo en móvil: ${ma.name.name}`); continue }
      const dv = da.value ? norm(gen(da.value)) : '', mv = ma.value ? norm(gen(ma.value)) : ''
      if (dv === mv || dv.replace(/ "/g, '"') === mv.replace(/ "/g, '"')) continue
      const n = ma.name.name
      if ((n === 'width' || n === 'height') && ma.value?.type === 'StringLiteral') {
        // Tamaño distinto en móvil → override CSS.
        const prop = n
        sizeOver[prop] = `${ma.value.value}px`
        continue
      }
      if (n === 'id' || n === 'htmlFor') continue // se queda el de escritorio
      warn(sec, `atributo ${n} distinto (se usa el de escritorio): ${dv} | ${mv}`)
    }
  }

  // Estilo
  let dark = ctx.dark
  const ds = byName(dAttrs, 'style'), ms = m ? byName(mAttrs, 'style') : null
  const dObj = ds?.value?.expression?.type === 'ObjectExpression' ? readStyle(ds.value.expression) : null
  const mObj = ms?.value?.expression?.type === 'ObjectExpression' ? readStyle(ms.value.expression) : null
  if (dObj) {
    const here = isDarkStyle(dObj.stat)
    if (here !== null) dark = here
    const mStat = { ...(mObj ? mObj.stat : dObj.stat), ...sizeOver }
    const cls = classFor(dObj.stat, mStat, dark)
    if (Object.keys(dObj.stat).length || Object.keys(sizeOver).length) addClass(d, cls)
    // El CSS del prototipo seleccionaba por `[style*="--i: N"]` (formato de React): se expone
    // como data-i="N", que no depende de cómo serialice el style cada motor.
    const iProp = dObj.keep.find((p) => p.type === 'ObjectProperty' && (p.key.value || p.key.name) === '--i' && p.value.type === 'StringLiteral')
    if (iProp && !byName(dAttrs, 'data-i')) d.openingElement.attributes.push(strAttr('data-i', iProp.value.value))
    if (dObj.keep.length) ds.value.expression.properties = dObj.keep
    else d.openingElement.attributes = d.openingElement.attributes.filter((x) => x !== ds)
  } else if (Object.keys(sizeOver).length || (mObj && Object.keys(mObj.stat).length)) {
    addClass(d, classFor({}, { ...(mObj ? mObj.stat : {}), ...sizeOver }, dark))
  }

  // Accesibilidad añadida al porte:
  //  · dentro de aria-hidden, los controles siguen funcionando con ratón/dedo (p. ej. las
  //    flechas de S05) pero salen del orden de tabulación (aria-hidden-focus). NO se usa
  //    `inert`: desactivaría también el puntero;
  //  · carruseles con scroll horizontal → tabIndex 0 (navegables con teclado, WCAG 2.1.1),
  //    salvo dentro de aria-hidden.
  const ah = byName(d.openingElement.attributes, 'aria-hidden')
  if (ah?.value?.value === 'true') ctx = { ...ctx, hidden: true }
  const tag = nameOf(d)
  if (ctx.hidden && /^(button|a|input|select|textarea)$/.test(tag) && !byName(d.openingElement.attributes, 'tabIndex')) {
    d.openingElement.attributes.push(strAttr('tabIndex', '-1'))
  }
  const cn = byName(d.openingElement.attributes, 'className')
  const cnText = cn ? gen(cn.value) : ''
  if (!ctx.hidden && /(^|[\s"`])(hs|hs-d|faqstrip)([\s"`]|$)/.test(cnText) && !byName(d.openingElement.attributes, 'tabIndex')) {
    d.openingElement.attributes.push(strAttr('tabIndex', '0'))
  }

  // Toque a la mascota (S02/S19 son estáticas): ganchos para vida.js en vanilla.
  const oc = byName(d.openingElement.attributes, 'onClick')
  if (oc && gen(oc.value.expression) === 'v.ceoTap') d.openingElement.attributes.push(strAttr('data-ceo-tap', ''))
  if (kids(d).some((c) => c.type === 'JSXExpressionContainer' && gen(c.expression) === 's(v.ceoMsg)')) d.openingElement.attributes.push(strAttr('data-ceo-msg', ''))

  // Texto en atributos
  for (const a of d.openingElement.attributes) {
    if (a.type === 'JSXAttribute' && TEXT_ATTRS.has(a.name.name) && a.value?.type === 'StringLiteral' && a.value.value.trim()) {
      a.value = exprContainer(tRef(ctx.dict.key(a.value.value)))
    }
  }

  mergeChildren(sec, d, m, { ...ctx, dark })
}

function processChild(sec, dc, mc, ctx) {
  if (dc.type === 'JSXElement') return processElement(sec, dc, mc, ctx)
  if (dc.type === 'JSXFragment') return mergeChildren(sec, dc, mc, ctx)
  if (dc.type === 'JSXExpressionContainer' && dc.expression.type === 'ConditionalExpression') {
    const dCons = dc.expression.consequent
    const mCons = mc?.expression?.consequent
    if (dCons.type === 'JSXFragment' || dCons.type === 'JSXElement') return processChild(sec, dCons, mCons, ctx)
  }
  if (dc.type === 'JSXExpressionContainer' && dc.expression.type === 'CallExpression') {
    // {(v.log || []).map((it, i) => (<Fragment>…</Fragment>))}
    const fn = dc.expression.arguments?.[0]
    const mfn = mc?.expression?.arguments?.[0]
    if (fn && (fn.type === 'ArrowFunctionExpression')) {
      const body = fn.body.type === 'JSXElement' || fn.body.type === 'JSXFragment' ? fn.body : null
      const mbody = mfn?.body
      if (body) processChild(sec, body, mbody, ctx)
    }
  }
}

/** Forma profunda (2 niveles): distingue hermanos con la misma etiqueta sin clase. */
function deepSig(c, depth = 2) {
  const own = sig(c)
  if (depth === 0 || (c.type !== 'JSXElement' && c.type !== 'JSXFragment')) return own
  return `${own}[${kids(c).map((k) => deepSig(k, depth - 1)).join(',')}]`
}

function mergeChildren(sec, d, m, ctx) {
  // Texto: extraer y reemplazar por {t.kN}
  const dk = kids(d)
  const mk = m ? kids(m) : dk

  // PERMUTACIÓN: mismos hijos (por forma profunda) en otro orden en móvil (p. ej. el hero:
  // texto ↔ órbita). Se emparejan gemelo con gemelo y en móvil se reordena con `order`,
  // en vez de duplicar el bloque (que duplicaba el <h1>).
  if (m && dk.length === mk.length && dk.length > 1 && dk.every((c) => c.type === 'JSXElement') && mk.every((c) => c.type === 'JSXElement')) {
    const A = dk.map((c) => deepSig(c)), B = mk.map((c) => deepSig(c))
    const same = A.every((x, i) => x === B[i])
    const sorted = (x) => [...x].sort().join('|')
    if (!same && sorted(A) === sorted(B)) {
      const used = new Set()
      dk.forEach((c, i) => {
        const j = B.findIndex((b, jj) => b === A[i] && !used.has(jj))
        used.add(j)
        processChild(sec, c, mk[j], ctx)
        addClass(c, classFor({}, { order: String(j) }, ctx.dark))
      })
      ctx.stats.permutations = (ctx.stats.permutations || 0) + 1
      d.children = dk
      return
    }
  }
  const sa = dk.map(sig), sb = mk.map(sig)
  let pairs
  if (sa.length === sb.length && sa.every((x, i) => x === sb[i])) pairs = sa.map((_, i) => [i, i])
  else pairs = lcs(sa, sb)

  const out = []
  let pi = 0, i = 0, j = 0
  const emitText = (node, onlyCls) => {
    const text = cleanJSXText(node.value)
    const repl = exprContainer(tRef(ctx.dict.key(text)))
    return onlyCls ? wrapOnly(repl, onlyCls) : repl
  }
  const take = (node, other) => {
    if (node.type === 'JSXText') {
      if (other && other.type === 'JSXText' && cleanJSXText(other.value) !== cleanJSXText(node.value)) {
        // mismo sitio, texto distinto en móvil → ambos
        out.push(emitText(node, 'only-d'), emitText(other, 'only-m'))
        return
      }
      out.push(emitText(node))
      return
    }
    processChild(sec, node, other, ctx)
    out.push(node)
  }
  const onlyD = (node) => {
    if (node.type === 'JSXText') { out.push(emitText(node, 'only-d')); return }
    processChild(sec, node, null, ctx)
    out.push(wrapOnly(node, 'only-d'))
  }
  const onlyM = (node) => {
    if (node.type === 'JSXText') { out.push(emitText(node, 'only-m')); return }
    processChild(sec, node, null, ctx)
    out.push(wrapOnly(node, 'only-m'))
  }
  while (i < dk.length || j < mk.length) {
    const p = pairs[pi]
    if (p && p[0] === i && p[1] === j) { take(dk[i], m ? mk[j] : null); i++; j++; pi++; continue }
    if (i < dk.length && (!p || i < p[0])) { onlyD(dk[i]); i++; continue }
    if (m && j < mk.length && (!p || j < p[1])) { onlyM(mk[j]); j++; continue }
    if (!m && j < mk.length) { j++; continue }
  }
  if (m && (sa.length !== sb.length || pairs.length !== sa.length)) ctx.stats.splits++
  d.children = out
}

// ── Sección ─────────────────────────────────────────────────────────────────
function rootOf(ast) {
  const fn = ast.program.body.find((n) => n.type === 'ExportDefaultDeclaration').declaration
  return fn.body.body.find((n) => n.type === 'ReturnStatement').argument
}

function replaceFormSlot(root, dict) {
  // {(v.notSent) ? … : null}{(v.sent) ? … : null} → {children}
  // La nota que el prototipo pone DETRÁS del formulario («Abrimos por grupos…», S02) se retira:
  // WaitlistForm ya la pinta en su sitio (bajo el campo, antes del aviso CCPA). Con las dos, la
  // frase salía duplicada (T32, Diego). Su clave sale del diccionario para no dejar texto muerto.
  let done = false
  const isNote = (c) => c.type === 'JSXElement' && c.openingElement.name.name === 'span' && c.children.length === 1 &&
    c.children[0].type === 'JSXExpressionContainer' && /^t\.k\d+$/.test(gen(c.children[0].expression))
  const walk = (node) => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node.children)) {
      let afterSlot = false
      node.children = node.children.flatMap((c) => {
        if (c.type === 'JSXExpressionContainer' && c.expression.type === 'ConditionalExpression') {
          const test = gen(c.expression.test)
          if (test === 'v.notSent') { done = true; afterSlot = true; return [exprContainer(ex('children'))] }
          if (test === 'v.sent') return []
        }
        if (afterSlot && isNote(c)) { afterSlot = false; delete dict[gen(c.children[0].expression).slice(2)]; return [] }
        if (c.type !== 'JSXText' || c.value.trim()) afterSlot = false
        return [c]
      })
      node.children.forEach(walk)
    }
    for (const k of ['consequent', 'body', 'expression']) if (node[k]) walk(node[k])
  }
  walk(root)
  return done
}

// PAUSA DE LOS CARRUSELES AUTOMÁTICOS (WCAG 2.2.2): todo carrusel que avanza solo lleva un
// botón visible de pausa/reproducir junto a sus flechas. El prototipo no lo tiene, así que el
// compilador lo inyecta en cada barra de flechas (móvil: .hsctl, que gobierna vida.js) y en la
// de escritorio de S11 (autoplay de store.js). La lógica vive en src/scripts/vida.js; los
// textos, en t.hsPause / t.hsPlay (es aquí, en a mano con las mismas claves).
const PAUSE_TXT = { hsPause: 'Pausar el carrusel', hsPlay: 'Reproducir el carrusel' }
const PAUSE_BTN = (where, inert = false) => `<button type="button" className="hs-play" data-hs-play="${where}"${inert ? ' tabIndex="-1"' : ''} aria-pressed="false" aria-label={t.hsPause} title={t.hsPause} data-l-pause={t.hsPause} data-l-play={t.hsPlay}><svg aria-hidden="true" className="hs-ico-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1"></rect><rect x="14" y="4" width="5" height="16" rx="1"></rect></svg><svg aria-hidden="true" className="hs-ico-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"></path></svg></button>`
function injectPause(id, code, dict) {
  let n = 0
  // Móvil: delante de la flecha «anterior» de cada barra .hsctl.
  code = code.replace(/(<div className="hsctl [^"]*"[^>]*>(?:(?!<\/div>).)*?)(<button type="button" data-hs="-1")/gs, (m, a, b) => {
    n++
    // Si la barra vive dentro de un maqueta decorativa (aria-hidden, S16), sus flechas llevan
    // tabIndex=-1: la pausa también, o habría un foco dentro de aria-hidden (axe: aria-hidden-focus).
    const inert = /data-hs="-?1"[^>]*tabIndex="-1"/.test(m + code.slice(code.indexOf(m) + m.length, code.indexOf(m) + m.length + 400))
    return `${a}${PAUSE_BTN('m', inert)}${b}`
  })
  // Escritorio (S11): delante de la flecha «anterior» del autoplay.
  code = code.replace(/(<button type="button" className="[^"]*" onClick=\{v\.autoPrev\})/g, (b) => { n++; return `${PAUSE_BTN('d')}${b}` })
  if (n) Object.assign(dict, PAUSE_TXT)
  return { code, n }
}

// EXPERTOS DE S05 (T32, Diego): la burbuja de cada tarjeta decía siempre «¡Hola, jefe!». Ahora
// muestra la frase que toca de ese experto (v.hiN, rota con cada clic; textos en ui/*.js →
// logic.agentLines) y una región viva oculta la anuncia (la burbuja es aria-hidden).
function wireAgentLines(id, code, dict) {
  if (id !== 'S05') return code
  // Escritorio y móvil son árboles distintos (12 burbujas): cada una toma el índice del
  // onClick={v.pokeN} de SU tarjeta (el último antes de ella).
  let n = 0, key = null
  code = code.replace(/(<span className="hi [^"]*" aria-hidden="true">)\{t\.(k\d+)\}(<\/span>)/g, (m, a, k, b, at, all) => {
    const pokes = [...all.slice(0, at).matchAll(/onClick=\{v\.poke(\d)\}/g)]
    if (!pokes.length) throw new Error('S05: burbuja de experto sin su tarjeta')
    key = k; n++
    return `${a}{v.hi${pokes.at(-1)[1]}}${b}`
  })
  if (n !== 12) throw new Error(`S05: se esperaban 12 burbujas de experto (6 escritorio + 6 móvil) y hay ${n}`)
  delete dict[key]
  return code.replace(/(<section id="equipo"[^>]*>)/, '$1<p className="sr-only" aria-live="polite" aria-atomic="true">{v.hiSay}</p>')
}

// ACTA DE S07 (T32): abre un hueco {children} al final de la tarjeta «Acta de hoy» (la que lleva
// las líneas .aline) para el acta con tareas por agente (src/sections/MeetingMinutes.astro).
function minutesSlot(id, code) {
  if (id !== 'S07') return code
  const re = /(<span className="aline [^"]*"[^>]*>(?:(?!<\/span>).)*<\/span><\/div>)(<\/div>)/s
  const all = code.match(new RegExp(re.source, 'gs')) || []
  if (all.length !== 1) throw new Error(`S07: se esperaba 1 bloque de líneas del acta y hay ${all.length}`)
  return code.replace(re, '$1{children}$2')
}

const files = readdirSync(join(PROTO, 'desktop')).filter((f) => /^S\d\d/.test(f)).sort()
const sectionsEs = {}
const report = []
mkdirSync(OUT, { recursive: true })
mkdirSync(I18N, { recursive: true })

for (const f of files) {
  const id = f.slice(0, 3)
  if (SKIP.has(id)) continue
  const parseFile = (dir) => parse(readFileSync(join(PROTO, dir, f), 'utf8'), { sourceType: 'module', plugins: ['jsx'] })
  const dAst = parseFile('desktop'), mAst = parseFile('mobile')
  const dRoot = rootOf(dAst), mRoot = rootOf(mAst)
  const dict = makeDict()
  const stats = { splits: 0 }
  currentSection = id
  mergeChildren(id, dRoot, mRoot, { dark: false, dict, stats })
  if (FORM_SLOT.has(id) && !replaceFormSlot(dRoot, dict.dict)) warn(id, 'no se encontró el formulario a sustituir')

  const name = f.replace('.jsx', '')
  const usesMap = /React\.Fragment/.test(gen(dRoot))
  const code = `// GENERADO por scripts/port/compile-sections.mjs desde design/prototype/src/{desktop,mobile}/${f}
// ⛔ No editar a mano: se regenera. Los textos viven en src/i18n/sections/*.json (t.kN).
${usesMap ? "import React from 'react'\n" : ''}import { s, css } from '../bind.js'

export default function ${name}({ v, t, children }) {
  return (
    ${gen(dRoot)}
  )
}
`
  const paused = injectPause(id, minutesSlot(id, wireAgentLines(id, code, dict.dict)), dict.dict)
  writeFileSync(join(OUT, `${id}.jsx`), paused.code)
  sectionsEs[id] = dict.dict
  report.push(`${id} ${name.slice(3)} · textos: ${Object.keys(dict.dict).length} · bloques con estructura distinta: ${stats.splits} · reordenados: ${stats.permutations || 0}${paused.n ? ` · pausas: ${paused.n}` : ''}`)
}

// CSS: base (escritorio con --u) + overrides móviles (≤ 1023 px). Clase doble = la
// especificidad que tenía el style inline frente a las clases del prototipo.
// CSS CRÍTICO (medido con Lighthouse: el CSS de la portada bloqueaba el render ≈ 755 ms en
// móvil): las reglas del hero (S02) van en sections.css (bloqueante, pequeño); el resto en
// public/_s/sections-rest.<hash>.css, que la portada carga SIN bloquear.
const CRITICAL = new Set(['S02'])
function cssFor(names) {
  let out = '/* GENERADO por scripts/port/compile-sections.mjs · no editar a mano */\n@layer reset, proto, sections;\n@layer sections {\n'
  const mob = []
  for (const n of names) {
    const r = rules.get(n)
    if (r.base) out += `.${n}.${n}{${r.base}}\n`
    if (r.mob) mob.push(`.${n}.${n}{${r.mob}}`)
  }
  out += `@media (max-width:${BREAK}px){\n${mob.join('\n')}\n}\n}\n`
  // Respaldo con las métricas de la fuente real (src/styles/fonts-fallback.css): sin él, el
  // titular del hero saltaba al llegar Instrument Serif (CLS 0,18 medido con Lighthouse 13).
  // TIPOGRAFÍA (T33, Diego: «títulos claramente más gruesos»): la serif del prototipo (Instrument
  // Serif, solo 400) pasa a Fraunces con pesos reales (src/styles/fonts.css). Cada regla que la usa
  // toma var(--serif) (con su respaldo de métricas) y var(--serif-weight) en lugar de su 400.
  // El gris secundario del prototipo (#5E5C56, 5,98:1) baja a var(--muted) (#4E4C47, 7,6:1).
  // DIVISORES (T33, Diego): el filete negro de 1,5 px a todo el ancho que el prototipo pone arriba
  // de cada sección pasa a la línea sutil y contenida de los tokens (--divider, --divider-inset).
  out = out.replace(/\.(x\w+)\.\1\{(padding:calc\(140[^{}]*?)border-top:1\.5px solid #111113([^{}]*)\}/g, (_, c, a, b) =>
    `.${c}.${c}{${a}border-top:0;position:relative${b}}\n.${c}.${c}::before{content:'';position:absolute;top:0;left:var(--divider-inset);right:var(--divider-inset);height:1px;background:var(--divider)}`)
  return out
    .replace(/\{([^{}]*'Instrument Serif',Georgia,serif[^{}]*)\}/g, (_, body) => {
      body = body.replace("font-family:'Instrument Serif',Georgia,serif", 'font-family:var(--serif)')
      body = /font-weight:/.test(body) ? body.replace(/font-weight:\s*400\b/, 'font-weight:var(--serif-weight)') : `${body};font-weight:var(--serif-weight)`
      return `{${body}}`
    })
    .replaceAll('#5E5C56', 'var(--muted)')
}
const all = [...rules.keys()]
const crit = all.filter((n) => [...usedBy.get(n)].some((x) => CRITICAL.has(x)))
const rest = all.filter((n) => !crit.includes(n))
let css = cssFor(crit)
css += `@media (max-width:${BREAK}px){.only-d{display:none!important}}\n@media (min-width:${BREAK + 1}px){.only-m{display:none!important}}\n.dc{display:contents}\n`
writeFileSync(join(OUT, 'sections.css'), css)
const restCss = cssFor(rest)
// El resto se ensambla en el build (scripts/build-rest-css.mjs) con el resto del prototipo
// y la demo de S03 en UN fichero con hash, que la portada carga sin bloquear.
writeFileSync(join(OUT, 'sections-rest.css'), restCss)

// Diccionario español (fuente). El inglés se traduce aparte con las MISMAS claves.
writeFileSync(join(I18N, 'es.json'), `${JSON.stringify(sectionsEs, null, 2)}\n`)

const nTexts = Object.values(sectionsEs).reduce((a, d) => a + Object.keys(d).length, 0)
console.log(report.join('\n'))
console.log(`\n✓ ${Object.keys(sectionsEs).length} secciones · ${rules.size} clases CSS · ${nTexts} textos · CSS crítico ${(css.length / 1024).toFixed(1)} KB + resto ${(restCss.length / 1024).toFixed(1)} KB`)
if (warnings.length) console.log(`\n⚠️ ${warnings.length} avisos:\n  ${[...new Set(warnings)].slice(0, 60).join('\n  ')}`)
