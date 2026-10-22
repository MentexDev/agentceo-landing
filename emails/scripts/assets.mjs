// Genera los PNG de correo (Gmail y Outlook no pintan SVG): public/email-assets/v1/*.png, a 2× (retina).
// Fuente: public/brand/agentceo-mascota{,-clara}.svg. El registro (nombre, lado en px, placa) es EMAIL_ASSETS
// de src/brand.js: el test comprueba que cada fichero existe y mide exactamente eso.
// Cada PNG lleva su PROPIA placa opaca con esquinas redondeadas: si Gmail u Outlook invierten los colores
// del correo, la mascota no queda «tinta sobre tinta», porque las imágenes no se invierten y la placa viaja con ella.
//   node emails/scripts/assets.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { EMAIL_ASSETS } from '../src/brand.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const ASSET_DIR = path.join(ROOT, 'public/email-assets/v1')
const inner = (file) => fs.readFileSync(path.join(ROOT, 'public/brand', file), 'utf8').trim().replace(/^<svg[^>]*>|<\/svg>$/g, '').replace(/<title>.*?<\/title>/, '')

fs.mkdirSync(ASSET_DIR, { recursive: true })
for (const { file, px, plate, svg } of Object.values(EMAIL_ASSETS)) {
  // Placa 120×120 con la mascota (100×118) centrada y algo reducida.
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${px}" height="${px}">
    <rect width="120" height="120" rx="30" fill="${plate}"/>
    <g transform="translate(17 10) scale(0.86)">${inner(svg)}</g></svg>`
  const png = new Resvg(doc, { fitTo: { mode: 'width', value: px } }).render().asPng()
  fs.writeFileSync(path.join(ASSET_DIR, file), png)
  console.log(`${file}`, `${px}×${px}`, png.length, 'B')
}
