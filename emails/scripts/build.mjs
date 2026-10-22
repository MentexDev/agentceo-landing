// Render ESTÁTICO de todas las plantillas × idiomas, con los datos de ejemplo (ficticios) de cada una.
//   POSTAL_ADDRESS="…" node emails/scripts/build.mjs     → producción + galería (FALLA si falta POSTAL_ADDRESS)
//   node emails/scripts/build.mjs --gallery              → solo la galería (aviso amarillo donde va la dirección)
// Configuración (variables de entorno):
//   POSTAL_ADDRESS        dirección postal del pie (CAN-SPAM). Obligatoria para producción.
//   EMAIL_ASSET_BASE_URL  base https de los PNG (por defecto https://agentceo.io/email-assets/v1).
//   EMAILS_OUT_DIR        carpeta de salida (por defecto emails/out; los tests usan una temporal).
// Salidas (emails/out/, ignorado por git):
//   out/<id>.<locale>.html|.txt   → listas para un proveedor (PNG con URL https absoluta)
//   out/gallery/…                 → la galería local (PNG y fuentes desde el propio servidor de la galería)
// El JSX se compila con esbuild (dependencia del paquete); el código que se ejecuta es emails/src tal cual.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PKG = path.resolve(HERE, '..')
const OUT = path.resolve(process.env.EMAILS_OUT_DIR || path.join(PKG, 'out'))
const CACHE = path.join(PKG, '.cache')

export async function loadEmails() {
  const outfile = path.join(CACHE, 'emails.mjs')
  await build({
    entryPoints: [path.join(PKG, 'src/index.js')],
    bundle: true, platform: 'node', format: 'esm', jsx: 'automatic', packages: 'external',
    outfile, logLevel: 'warning',
  })
  return import(`${pathToFileURL(outfile).href}?v=${Date.now()}`)
}

const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch])

async function main() {
  const galleryOnly = process.argv.includes('--gallery')
  const postalAddress = (process.env.POSTAL_ADDRESS || '').trim()
  const assetBase = process.env.EMAIL_ASSET_BASE_URL || undefined
  if (!galleryOnly && !postalAddress) {
    console.error('✗ Falta POSTAL_ADDRESS: el build de producción no sale sin dirección postal (CAN-SPAM).\n  Para ver solo la galería: node emails/scripts/build.mjs --gallery')
    process.exit(1)
  }
  const { TEMPLATES, LOCALES, render } = await loadEmails()
  // Solo se borra lo que este script crea.
  fs.rmSync(path.join(OUT, 'gallery'), { recursive: true, force: true })
  if (!galleryOnly) for (const f of fs.existsSync(OUT) ? fs.readdirSync(OUT) : []) if (/\.(es|en)\.(html|txt)$/.test(f)) fs.rmSync(path.join(OUT, f))
  fs.mkdirSync(path.join(OUT, 'gallery'), { recursive: true })
  const meta = []
  for (const t of TEMPLATES) {
    const row = { id: t.id, phase: t.phase, kind: t.kind, tone: t.tone, title: t.title, when: t.when, locales: {} }
    for (const locale of LOCALES) {
      const data = t.sample(locale)
      const prev = await render(t, locale, data, { preview: true, assetBase: '/email-assets/v1', fontBase: '', postalAddress })
      const prod = galleryOnly ? prev : await render(t, locale, data, { assetBase, postalAddress })
      const txt = (r) => `${locale === 'es' ? 'Asunto' : 'Subject'}: ${r.subject}\n\n${r.text}\n`
      if (!galleryOnly) {
        fs.writeFileSync(path.join(OUT, `${t.id}.${locale}.html`), prod.html)
        fs.writeFileSync(path.join(OUT, `${t.id}.${locale}.txt`), txt(prod))
      }
      fs.writeFileSync(path.join(OUT, 'gallery', `${t.id}.${locale}.html`), prev.html)
      fs.writeFileSync(path.join(OUT, 'gallery', `${t.id}.${locale}.txt`), txt(prev))
      row.locales[locale] = { subject: prod.subject, preheader: prod.preheader, bytes: Buffer.byteLength(prod.html), headers: prod.headers }
    }
    meta.push(row)
  }
  fs.writeFileSync(path.join(OUT, 'gallery', 'meta.json'), JSON.stringify(meta, null, 2))
  fs.writeFileSync(path.join(OUT, 'gallery', 'index.html'), gallery(meta))
  const kb = meta.flatMap((m) => Object.values(m.locales).map((l) => l.bytes))
  console.log(`✓ ${meta.length} plantillas × ${LOCALES.length} idiomas → ${galleryOnly ? 'solo galería' : 'producción + galería'} en ${path.relative(process.cwd(), OUT) || '.'} (HTML de ${Math.min(...kb) / 1000 | 0} a ${Math.max(...kb) / 1000 | 0} KB; Gmail recorta a partir de 102 KB)`)
}

// La galería: una página, todas las plantillas × ES/EN, con conmutadores de ancho y de tema.
function gallery(meta) {
  const card = (m) => `
  <article class="card" id="${m.id}" data-kind="${m.kind}" data-phase="${m.phase}">
    <header>
      <div class="tags"><span class="tag ph">Fase ${m.phase}</span><span class="tag ${m.kind}">${m.kind === 'marketing' ? 'Marketing · con baja' : 'Transaccional'}</span><span class="tag">${esc(m.tone)}</span></div>
      <h2>${esc(m.title.es)}</h2>
      <p class="when">${esc(m.when)}</p>
    </header>
    <div class="pair">${['es', 'en'].map((l) => `
      <section>
        <p class="subj"><b>${l.toUpperCase()}</b> ${esc(m.locales[l].subject)}</p>
        <p class="pre">${esc(m.locales[l].preheader)}</p>
        <iframe src="${m.id}.${l}.html" title="${esc(m.title[l])} (${l})" loading="lazy"></iframe>
        <p class="links"><a href="${m.id}.${l}.html" target="_blank">HTML</a> · <a href="${m.id}.${l}.txt" target="_blank">Texto plano</a> · ${(m.locales[l].bytes / 1000).toFixed(1)} KB</p>
      </section>`).join('')}
    </div>
  </article>`
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Correos de Agent CEO</title>
<style>
@font-face{font-family:'Instrument Serif';src:url(/fonts/instrument-serif-latin-400-normal.woff2) format('woff2')}
@font-face{font-family:Geist;font-weight:100 900;src:url(/fonts/geist-latin-wght-normal.woff2) format('woff2')}
:root{--ink:#111113;--cream:#F4F2ED;--paper:#FBFAF7;--gold:#B8923A;--gold3:#EFE4C8;--gold-ink:#7A5C17;--muted:#4E4C47;--line:#E2DED4}
*{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--ink);font:15px/1.5 Geist,system-ui,sans-serif}
.top{position:sticky;top:0;z-index:2;background:rgba(244,242,237,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);padding:14px clamp(16px,4vw,40px);display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center}
h1{margin:0;font:400 34px/1 'Instrument Serif',Georgia,serif;-webkit-text-stroke:.035em currentColor;paint-order:stroke fill}
h1 i{font-style:italic}.count{color:var(--muted)}
.ctl{display:flex;gap:6px;flex-wrap:wrap}.ctl button{font:inherit;font-size:13px;border:1px solid var(--ink);background:transparent;border-radius:999px;padding:6px 12px;cursor:pointer}
.ctl button[aria-pressed=true]{background:var(--ink);color:var(--cream)}
main{padding:24px clamp(16px,4vw,40px) 80px;display:grid;gap:28px}
.card{background:var(--paper);border:1px solid var(--line);border-radius:20px;padding:22px}
.card h2{margin:6px 0 2px;font:400 28px/1.1 'Instrument Serif',Georgia,serif;-webkit-text-stroke:.03em currentColor;paint-order:stroke fill}
.when{margin:0;color:var(--muted);font-size:14px}
.tags{display:flex;gap:6px;flex-wrap:wrap}.tag{font-size:11px;letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:3px 9px;background:#fff;border:1px solid var(--line)}
.tag.marketing{background:var(--gold3);border-color:var(--gold3);color:var(--gold-ink)}.tag.transactional{background:var(--ink);color:var(--cream);border-color:var(--ink)}
.pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:20px;margin-top:16px}
.subj{margin:0;font-weight:600}.subj b{font-size:11px;letter-spacing:.1em;color:var(--gold-ink);margin-right:6px}
.pre{margin:2px 0 10px;color:var(--muted);font-size:13px}
iframe{display:block;width:100%;height:900px;border:1px solid var(--line);border-radius:14px;background:#fff;margin:0 auto;transition:width .2s}
body.mobile iframe{width:375px;max-width:100%}
.links{font-size:13px;color:var(--muted);margin:8px 0 0}.links a{color:var(--gold-ink)}
nav.idx{display:flex;flex-wrap:wrap;gap:6px;font-size:13px}nav.idx a{color:var(--ink);text-decoration:none;border-bottom:1px solid var(--gold)}
</style></head><body>
<div class="top">
  <h1>Correos de <i>Agent CEO</i></h1>
  <span class="count">${meta.length} plantillas × ES/EN · datos de ejemplo ficticios · nada se envía</span>
  <div class="ctl" role="group" aria-label="Ancho"><button data-w="desk" aria-pressed="true">Escritorio</button><button data-w="mobile" aria-pressed="false">Móvil 375</button></div>
  <div class="ctl" role="group" aria-label="Tema"><button data-t="light" aria-pressed="true">Claro</button><button data-t="dark" aria-pressed="false">Oscuro (Apple Mail)</button><button data-t="invert" aria-pressed="false">Invertido (Gmail/Outlook)</button></div>
  <div class="ctl" role="group" aria-label="Filtro"><button data-f="all" aria-pressed="true">Todas</button><button data-f="A" aria-pressed="false">Fase A</button><button data-f="B" aria-pressed="false">Fase B</button><button data-f="marketing" aria-pressed="false">Marketing</button><button data-f="transactional" aria-pressed="false">Transaccionales</button></div>
  <nav class="idx">${meta.map((m) => `<a href="#${m.id}">${m.id}</a>`).join('')}</nav>
</div>
<main>${meta.map(card).join('')}</main>
<script>
const frames=[...document.querySelectorAll('iframe')]
let theme='light'
// Oscuro: el iframe hereda color-scheme → su prefers-color-scheme pasa a dark (lo que hace Apple Mail).
// Invertido: imita la inversión forzada de Gmail/Outlook (colores invertidos, imágenes intactas).
function applyTheme(f){const d=f.contentDocument;if(!d||!d.documentElement)return
  f.style.colorScheme=theme==='dark'?'dark':'light'
  let s=d.getElementById('__inv');if(!s){s=d.createElement('style');s.id='__inv';d.head.appendChild(s)}
  s.textContent=theme==='invert'?'html{filter:invert(1) hue-rotate(180deg)}img{filter:invert(1) hue-rotate(180deg)}':''}
frames.forEach(f=>f.addEventListener('load',()=>applyTheme(f)))
function press(group,btn){group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)))}
document.querySelectorAll('.ctl').forEach(g=>g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(g,b)
  if(b.dataset.w)document.body.classList.toggle('mobile',b.dataset.w==='mobile')
  if(b.dataset.t){theme=b.dataset.t;frames.forEach(applyTheme)}
  if(b.dataset.f){const f=b.dataset.f;document.querySelectorAll('.card').forEach(c=>{c.hidden=!(f==='all'||c.dataset.phase===f||c.dataset.kind===f)})}}))
</script></body></html>`
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main()
