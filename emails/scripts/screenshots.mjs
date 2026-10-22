// Capturas de cada plantilla con Playwright (Chromium), contra la galería local (node emails/scripts/serve.mjs).
//   node emails/scripts/screenshots.mjs
// → emails/screenshots/<id>.<locale>.{escritorio,movil,oscuro}.png (+ .invertido para ES) y overview.png
//   escritorio = 1200 px · movil = 375 px · oscuro = 375 px con prefers-color-scheme: dark (Apple Mail / iOS)
//   invertido  = 375 px con la inversión forzada de Gmail/Outlook simulada (colores invertidos, imágenes no)
//   sinimagenes = 375 px con las imágenes BLOQUEADAS (lo que ve Gmail antes de «Mostrar imágenes»): el alt
//                 tiene que quedarse dentro de su cuadrado (T54)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../screenshots')
const BASE = process.env.EMAILS_URL || 'http://127.0.0.1:3012'
const meta = await fetch(`${BASE}/meta.json`).then((r) => r.json()).catch(() => {
  throw new Error(`No veo la galería en ${BASE}. Arráncala: node emails/scripts/serve.mjs`)
})

const MODES = {
  escritorio: { viewport: { width: 1200, height: 900 }, colorScheme: 'light' },
  movil: { viewport: { width: 375, height: 812 }, colorScheme: 'light', deviceScaleFactor: 1 },
  oscuro: { viewport: { width: 375, height: 812 }, colorScheme: 'dark', deviceScaleFactor: 1 },
  invertido: { viewport: { width: 375, height: 812 }, colorScheme: 'light', deviceScaleFactor: 1, invert: true, only: 'es' },
  sinimagenes: { viewport: { width: 375, height: 812 }, colorScheme: 'light', deviceScaleFactor: 1, blockImages: true, only: 'es' },
}
const INVERT = 'html{filter:invert(1) hue-rotate(180deg)}img{filter:invert(1) hue-rotate(180deg)}'

// Solo se borra lo que ESTE script crea (<id>.<idioma>.<modo>.png y overview.png). Antes vaciaba la carpeta
// entera (rmSync recursivo) y en T60 se llevó por delante una carpeta ajena, emails/screenshots/prod/: nunca más.
fs.mkdirSync(OUT, { recursive: true })
const OWN = /^([a-z0-9-]+\.(es|en|pt)\.(escritorio|movil|oscuro|invertido|sinimagenes)|overview)\.png$/
for (const e of fs.readdirSync(OUT, { withFileTypes: true })) if (e.isFile() && OWN.test(e.name)) fs.rmSync(path.join(OUT, e.name))
const browser = await chromium.launch()
let n = 0
for (const [mode, cfg] of Object.entries(MODES)) {
  const ctx = await browser.newContext({ viewport: cfg.viewport, colorScheme: cfg.colorScheme, deviceScaleFactor: cfg.deviceScaleFactor || 1 })
  const page = await ctx.newPage()
  if (cfg.blockImages) await page.route(/\/email-assets\//, (route) => route.abort())
  for (const m of meta) {
    for (const locale of Object.keys(m.locales)) {
      if (cfg.only && cfg.only !== locale) continue
      await page.goto(`${BASE}/${m.id}.${locale}.html`, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      if (cfg.invert) await page.addStyleTag({ content: INVERT })
      await page.screenshot({ path: path.join(OUT, `${m.id}.${locale}.${mode}.png`), fullPage: true })
      n++
    }
  }
  await ctx.close()
}

// overview.png: miniaturas de todas (ES, móvil: se lee mejor en miniatura) para enseñarle a Diego de un vistazo.
const thumbs = meta.map((m) => ({ id: m.id, title: m.title.es, kind: m.kind, phase: m.phase, src: `data:image/png;base64,${fs.readFileSync(path.join(OUT, `${m.id}.es.movil.png`)).toString('base64')}` }))
const page = await browser.newPage({ viewport: { width: 2000, height: 1000 } })
await page.goto(`${BASE}/`) // mismo origen: las fuentes de la galería cargan
await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Instrument Serif';src:url(${BASE}/fonts/instrument-serif-latin-400-normal.woff2) format('woff2')}
@font-face{font-family:Geist;font-weight:100 900;src:url(${BASE}/fonts/geist-latin-wght-normal.woff2) format('woff2')}
body{margin:0;padding:48px;background:#F4F2ED;color:#111113;font:14px/1.4 Geist,sans-serif}
h1{margin:0 0 6px;font:400 56px/1 'Instrument Serif',Georgia,serif;-webkit-text-stroke:.035em currentColor;paint-order:stroke fill}
h1 i{font-style:italic}p.sub{margin:0 0 32px;color:#4E4C47;font-size:18px}
.grid{display:grid;grid-template-columns:repeat(6,1fr);gap:22px}
figure{margin:0;background:#FBFAF7;border:1px solid #E2DED4;border-radius:14px;padding:10px}
.img{height:640px;overflow:hidden;border-radius:8px;background:#F4F2ED}.img img{width:100%;display:block}
figcaption{margin-top:8px;font-weight:600}figcaption small{display:block;font-weight:400;color:#4E4C47;font-size:12px;letter-spacing:.06em;text-transform:uppercase}
</style></head><body>
<h1>Los correos de <i>Agent CEO</i></h1>
<p class="sub">${thumbs.length} plantillas · ES y EN · Fase A (lista de espera, hoy) y Fase B (con la app) · miniaturas de la versión móvil en español</p>
<div class="grid">${thumbs.map((t) => `<figure><div class="img"><img src="${t.src}" alt=""></div><figcaption>${t.title}<small>Fase ${t.phase} · ${t.kind === 'marketing' ? 'marketing' : 'transaccional'} · ${t.id}</small></figcaption></figure>`).join('')}</div>
</body></html>`, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: path.join(OUT, 'overview.png'), fullPage: true })
await browser.close()
const bytes = fs.readdirSync(OUT).reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0)
console.log(`✓ ${n} capturas + overview.png → emails/screenshots/ (${(bytes / 1e6).toFixed(1)} MB)`)
