#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// GENERADOR DE LAS PÁGINAS LEGALES · content/legal/*.md → public/legal/*.html
// ═══════════════════════════════════════════════════════════════════════════
//
// POR QUÉ EXISTE (2026-08-11). Hasta hoy las cinco páginas legales eran HTML
// escrito a mano, y servían el texto provisional del 24 de julio: 21.098 B que
// **no nombraban ninguna entidad** y que se declaraban incompletos en público
// («Esta es la versión inicial de nuestro marco legal»).
//
// Eso bloqueaba las revisiones de Google, Meta, Shopify y LinkedIn, que
// comprueban la URL de privacidad automáticamente. Y restaba credibilidad a un
// producto que cobra suscripciones.
//
// El marco v2.0 (48.294 caracteres, con Klinworks LLC y su expediente de
// Delaware) estaba escrito desde el 2 de agosto y sin publicar.
//
// ⭐ POR QUÉ UN GENERADOR Y NO EDITAR EL HTML A MANO: un documento legal se
// revisa, se corrige y se vuelve a publicar. Con el HTML a mano, cada revisión
// es volver a maquetar cinco ficheros y arriesgarse a que uno quede distinto.
// Con esto, la fuente es el markdown —que es lo que un abogado sabe leer— y el
// HTML es una consecuencia reproducible.
//
// ⚠️ NO lo llama `npm run build`: `build-content.mjs` genera el sitio y las
// legales cambian con otro ritmo. Se corre a propósito:  npm run build:legal
//
// Uso:  node scripts/build-legal.mjs [--check]
//       --check  no escribe; dice qué cambiaría y sale 1 si hay diferencias.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGEN = join(RAIZ, 'content', 'legal')
const DESTINO = join(RAIZ, 'public', 'legal')

// ── Utilidades ──────────────────────────────────────────────────────────────

/** Escapa ANTES de aplicar markdown: si no, un `<` del texto rompe el HTML. */
const escapar = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Marcas de línea: negritas, cursivas, código y enlaces.
 * El orden importa — los enlaces se resuelven antes que las negritas para que
 * un `**[texto](url)**` no parta la etiqueta por la mitad.
 */
function enLinea(texto) {
  let t = escapar(texto)
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, url) => {
    // Solo se permiten esquemas seguros. Un `javascript:` en un documento legal
    // sería una puerta abierta en la página más confiable del sitio.
    const limpia = /^(https?:|mailto:|\/)/i.test(url) ? url : '#'
    return `<a href="${limpia}">${txt}</a>`
  })
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  t = t.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
  return t
}

/** Separa el frontmatter del cuerpo. Sin frontmatter, lanza: es un contrato. */
function partir(md, fichero) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) throw new Error(`${fichero}: no tiene frontmatter`)
  const meta = {}
  for (const linea of m[1].split('\n')) {
    const par = linea.match(/^(\w+):\s*(.+)$/)
    if (par) meta[par[1]] = par[2].trim()
  }
  for (const clave of ['titulo', 'ruta', 'actualizado', 'version']) {
    if (!meta[clave]) throw new Error(`${fichero}: falta '${clave}' en el frontmatter`)
  }
  return { meta, cuerpo: m[2] }
}

/** Una fila de tabla markdown → celdas ya limpias. */
const celdas = (linea) =>
  linea.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())

/** ¿Es la línea separadora de una tabla (`|---|---|`)? */
const esSeparador = (linea) => /^\|[\s:|-]+\|?$/.test(linea.trim())

// ── El conversor ────────────────────────────────────────────────────────────

/**
 * Markdown → HTML del cuerpo. Devuelve también el título y la fecha para que la
 * plantilla los coloque en su sitio en vez de dejarlos como párrafos sueltos.
 */
function convertir(cuerpo) {
  const lineas = cuerpo.split('\n')
  const partes = []
  let titulo = null
  let actualizado = null
  let i = 0

  while (i < lineas.length) {
    const linea = lineas[i]

    // Líneas en blanco: separan bloques y no producen nada.
    if (!linea.trim()) { i++; continue }

    // ── Línea divisoria ─────────────────────────────────────────────────────
    // Los cinco documentos separan secciones con `---`. Sin esta rama caían al
    // párrafo y salían como TEXTO LITERAL en la página. Lo cazó mirar la
    // pantalla, no los tests: las comprobaciones de contenido pasaban todas.
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(linea.trim())) {
      partes.push('<hr/>')
      i++
      continue
    }

    // ── Encabezados ─────────────────────────────────────────────────────────
    const enc = linea.match(/^(#{1,4})\s+(.+)$/)
    if (enc) {
      const nivel = enc[1].length
      const texto = enLinea(enc[2].trim())
      // El PRIMER h1 es el título de la página, no contenido.
      if (nivel === 1 && titulo === null) titulo = enc[2].trim()
      // Los h1 siguientes (gdpr tiene «Parte I» y «Parte II») son divisores de
      // sección: se pintan como tales para que no compitan con el título.
      else if (nivel === 1) partes.push(`<h2 class="parte">${texto}</h2>`)
      else partes.push(`<h${nivel}>${texto}</h${nivel}>`)
      i++
      continue
    }

    // ── Tablas ──────────────────────────────────────────────────────────────
    if (linea.trim().startsWith('|') && esSeparador(lineas[i + 1] ?? '')) {
      const cabecera = celdas(linea)
      i += 2
      const filas = []
      while (i < lineas.length && lineas[i].trim().startsWith('|')) {
        filas.push(celdas(lineas[i])); i++
      }
      const th = cabecera.map((c) => `<th>${enLinea(c)}</th>`).join('')
      const tr = filas
        .map((f) => `<tr>${f.map((c) => `<td>${enLinea(c)}</td>`).join('')}</tr>`)
        .join('\n')
      // El envoltorio permite desplazar la tabla en móvil sin que la PÁGINA
      // se desplace en horizontal, que es lo que rompe la lectura en un móvil.
      partes.push(`<div class="tabla"><table><thead><tr>${th}</tr></thead><tbody>\n${tr}\n</tbody></table></div>`)
      continue
    }

    // ── Listas ──────────────────────────────────────────────────────────────
    if (/^\s*[-*]\s+/.test(linea)) {
      const items = []
      while (i < lineas.length && (/^\s*[-*]\s+/.test(lineas[i]) || /^\s{2,}\S/.test(lineas[i]))) {
        if (/^\s*[-*]\s+/.test(lineas[i])) items.push(lineas[i].replace(/^\s*[-*]\s+/, ''))
        // Continuación de un item partido a 80 columnas: se une al anterior.
        else if (items.length) items[items.length - 1] += ' ' + lineas[i].trim()
        i++
      }
      partes.push(`<ul>${items.map((t) => `<li>${enLinea(t)}</li>`).join('')}</ul>`)
      continue
    }

    // ── Listas numeradas ────────────────────────────────────────────────────
    if (/^\s*\d+\.\s+/.test(linea)) {
      const items = []
      while (i < lineas.length && (/^\s*\d+\.\s+/.test(lineas[i]) || /^\s{2,}\S/.test(lineas[i]))) {
        if (/^\s*\d+\.\s+/.test(lineas[i])) items.push(lineas[i].replace(/^\s*\d+\.\s+/, ''))
        else if (items.length) items[items.length - 1] += ' ' + lineas[i].trim()
        i++
      }
      partes.push(`<ol>${items.map((t) => `<li>${enLinea(t)}</li>`).join('')}</ol>`)
      continue
    }

    // ── Párrafo ─────────────────────────────────────────────────────────────
    // Los documentos vienen partidos a ~80 columnas: un párrafo son TODAS las
    // líneas seguidas hasta la siguiente en blanco. Sin esto saldría un <p> por
    // línea y el texto se leería a saltos.
    const trozo = []
    while (
      i < lineas.length &&
      lineas[i].trim() &&
      !/^#{1,4}\s/.test(lineas[i]) &&
      !/^\s*[-*]\s+/.test(lineas[i]) &&
      !/^\s*\d+\.\s+/.test(lineas[i]) &&
      !lineas[i].trim().startsWith('|')
    ) { trozo.push(lineas[i].trim()); i++ }

    const texto = trozo.join(' ')
    // «**Última actualización: …**» va a su sitio propio de la plantilla.
    const fecha = texto.match(/^\*\*Última actualización:\s*(.+?)\*\*$/)
    if (fecha && actualizado === null) { actualizado = fecha[1].trim(); continue }
    partes.push(`<p>${enLinea(texto)}</p>`)
  }

  return { html: partes.join('\n'), titulo, actualizado }
}

// ── La plantilla ────────────────────────────────────────────────────────────

/**
 * La misma que ya usaban las cinco páginas —tipografías, colores, cabecera y
 * pie idénticos— con DOS añadidos y UNA supresión:
 *
 *   + CSS de tablas: los documentos v2.0 traen hasta 25 filas y la plantilla
 *     vieja no tenía ni un selector `table`. Sin esto se verían sin formato.
 *   + `.parte` para los divisores de sección del aviso RGPD/CCPA.
 *   − El bloque `.note` que declaraba el marco como provisional. Ese aviso era
 *     honesto cuando el texto estaba a medias; con el v2.0 publicado sería
 *     falso, y es justo lo que hacía que una revisión de Google no pasara.
 */
function plantilla({ titulo, actualizado, contenido }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${escapar(titulo)} — Agent · CEO</title>
<meta name="robots" content="index,follow"/>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
:root{--bg:#08080b;--ink:#f4f1ea;--muted:#9d9a92;--line:rgba(255,255,255,.1);--accent:#e3c592;
--serif:'Fraunces',Georgia,serif;--sans:'Hanken Grotesk',system-ui,-apple-system,Arial,sans-serif;}
*{box-sizing:border-box;}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:16.5px;line-height:1.7;-webkit-font-smoothing:antialiased;}
a{color:var(--accent);text-decoration:none;} a:hover{text-decoration:underline;}
.top{border-bottom:1px solid var(--line);}
.top .in{max-width:820px;margin:0 auto;padding:22px 24px;display:flex;align-items:center;gap:8px;}
.brand{display:flex;align-items:center;gap:8px;} .brand img.a{height:26px;} .brand img.b{height:16px;}
.brand .dot{font-family:var(--serif);color:var(--accent);font-size:18px;font-weight:600;}
.wrap{max-width:820px;margin:0 auto;padding:56px 24px 90px;}
h1{font-family:var(--serif);font-weight:400;font-size:clamp(34px,6vw,52px);letter-spacing:-.03em;margin:0 0 10px;}
.upd{color:var(--muted);font-size:14px;margin-bottom:34px;}
h2{font-family:var(--serif);font-weight:600;font-size:24px;margin:44px 0 12px;letter-spacing:-.01em;}
h3{font-family:var(--sans);font-weight:600;font-size:17px;margin:28px 0 8px;color:var(--ink);}
h2.parte{font-size:29px;margin:64px 0 8px;padding-top:30px;border-top:1px solid var(--line);color:var(--accent);}
p,li{color:#cbc8c1;} ul,ol{padding-left:20px;} li{margin:8px 0;}
strong{color:var(--ink);font-weight:600;}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.9em;background:rgba(255,255,255,.06);padding:1px 5px;border-radius:5px;}
/* Las tablas se desplazan DENTRO de su caja: en un móvil, una tabla ancha no
   debe arrastrar la página entera en horizontal. */
.tabla{overflow-x:auto;margin:22px 0;border:1px solid var(--line);border-radius:12px;}
table{border-collapse:collapse;width:100%;min-width:460px;font-size:14.5px;}
th,td{text-align:left;padding:11px 14px;border-bottom:1px solid var(--line);vertical-align:top;}
th{color:var(--ink);font-weight:600;background:rgba(255,255,255,.035);white-space:nowrap;}
tbody tr:last-child td{border-bottom:none;}
td{color:#cbc8c1;}
hr{border:none;border-top:1px solid var(--line);margin:38px 0;}
.back{display:inline-block;margin-top:48px;color:var(--muted);font-size:14px;}
footer{border-top:1px solid var(--line);color:var(--muted);font-size:13px;}
footer .in{max-width:820px;margin:0 auto;padding:26px 24px;}
</style>
</head>
<body>
<div class="top"><div class="in"><a href="/" class="brand" aria-label="AgentCEO">
<img class="a" src="/logo-agent.png" alt="Agent"/><span class="dot">·</span><img class="b" src="/logo-ceo.png" alt="CEO"/></a></div></div>
<div class="wrap">
<h1>${escapar(titulo)}</h1>
<div class="upd">Última actualización: ${escapar(actualizado)}</div>
${contenido}
<a class="back" href="/">← Volver a agentceo.io</a>
</div>
<footer><div class="in">© 2026 Klinworks, LLC · Agent · CEO · agentceo.io</div></footer>
</body></html>
`
}

// ── Ejecución ───────────────────────────────────────────────────────────────

const soloComprobar = process.argv.includes('--check')

if (!existsSync(ORIGEN)) {
  console.error(`\n🔴 No existe ${ORIGEN}. Las fuentes markdown viven ahí.\n`)
  process.exit(1)
}

const fuentes = readdirSync(ORIGEN).filter((f) => f.endsWith('.md')).sort()

// Autocomprobación: si el lector no ve fuentes, no está midiendo nada. Un
// generador que no genera nada y sale en verde es peor que uno que falla.
if (fuentes.length < 5) {
  console.error(`\n🔴 Encontré ${fuentes.length} documentos y esperaba 5 o más.\n`)
  process.exit(1)
}

let cambios = 0
console.log(`\n  ${ORIGEN.replace(RAIZ + '/', '')} → ${DESTINO.replace(RAIZ + '/', '')}\n`)

for (const f of fuentes) {
  const md = readFileSync(join(ORIGEN, f), 'utf8')
  const { meta, cuerpo } = partir(md, f)
  const { html, titulo, actualizado } = convertir(cuerpo)

  if (!titulo) throw new Error(`${f}: el cuerpo no tiene un '# Título'`)
  if (!actualizado) throw new Error(`${f}: falta la línea '**Última actualización: …**'`)

  // La ruta del frontmatter manda: es la que declara el documento y la que
  // comprueba el guardián de CRM-AI. El nombre del fichero se deriva de ella.
  const salida = join(DESTINO, basename(meta.ruta) + '.html')
  const paginaNueva = plantilla({ titulo, actualizado, contenido: html })

  // 🛡️ EL GUARDIÁN · se niega a emitir markdown sin convertir.
  //
  // Nació de un fallo real: `---` no tenía rama y salía como TEXTO LITERAL en
  // la página de privacidad. Las comprobaciones de contenido —Klinworks
  // presente, aviso provisional ausente, etiquetas balanceadas— pasaron TODAS.
  // Lo cazó abrir la página y mirarla.
  //
  // ⭐ La lección: un texto que «contiene lo que debe» puede estar roto igual.
  // Por eso esto mide la AUSENCIA de lo que no debería sobrevivir.
  const restos = [
    ['línea divisoria', /<p>\s*(-{3,}|\*{3,}|_{3,})\s*<\/p>/g],
    ['negrita', /\*\*/g],
    ['encabezado', /<p>\s*#{1,4}\s/g],
    ['enlace', /\]\(/g],
    ['fila de tabla', /<p>\s*\|/g],
  ]
  const sucios = restos
    .map(([nombre, re]) => [nombre, (paginaNueva.match(re) || []).length])
    .filter(([, n]) => n > 0)

  if (sucios.length) {
    console.error(`\n🔴 ${basename(salida)} lleva markdown SIN CONVERTIR y no se escribe:\n`)
    for (const [nombre, n] of sucios) console.error(`     · ${nombre}: ${n}`)
    console.error('\n  Eso saldría como texto literal en una página legal pública.\n')
    process.exit(1)
  }
  const anterior = existsSync(salida) ? readFileSync(salida, 'utf8') : ''
  const cambia = anterior !== paginaNueva

  if (cambia) cambios++
  if (!soloComprobar && cambia) writeFileSync(salida, paginaNueva, 'utf8')

  const marca = cambia ? (soloComprobar ? '≠' : '✅') : '·'
  console.log(
    `  ${marca} ${basename(salida).padEnd(18)} ${String(anterior.length).padStart(6)} B → ` +
      `${String(paginaNueva.length).padStart(6)} B   v${meta.version}  ${actualizado}`,
  )
}

console.log(
  soloComprobar
    ? `\n  ${cambios === 0 ? '✅ al día' : `≠ ${cambios} páginas cambiarían`}\n`
    : `\n  ${cambios} páginas escritas\n`,
)
if (soloComprobar && cambios > 0) process.exit(1)
