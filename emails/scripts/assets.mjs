// Genera los PNG de la mascota para correo (Gmail y Outlook no pintan SVG).
// Fuente: public/brand/agentceo-mascota{,-clara}.svg → public/brand/email/*.png (se publican con la landing).
// Cada PNG lleva su PROPIA placa opaca con esquinas redondeadas: si Gmail u Outlook invierten los colores
// del correo, la mascota no queda «tinta sobre tinta», porque las imágenes no se invierten y la placa viaja con ella.
//   node emails/scripts/assets.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { COLORS } from '../src/brand.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const OUT = path.join(ROOT, 'public/brand/email')
const inner = (file) => fs.readFileSync(path.join(ROOT, 'public/brand', file), 'utf8').trim().replace(/^<svg[^>]*>|<\/svg>$/g, '').replace(/<title>.*?<\/title>/, '')

// [nombre, svg de la mascota, color de la placa]
const VARIANTS = [
  ['mascota', 'agentceo-mascota.svg', COLORS.cream],          // la normal: tinta sobre crema
  ['mascota-oro', 'agentceo-mascota.svg', COLORS.gold3],      // para el equipo y las celebraciones
  ['mascota-noche', 'agentceo-mascota-clara.svg', COLORS.ink], // modo oscuro de Apple Mail / iOS
]
const SIZE = 192 // se muestra a 64 px → 3× para pantallas retina

fs.mkdirSync(OUT, { recursive: true })
for (const [name, file, plate] of VARIANTS) {
  // Placa 120×120 con la mascota (100×118) centrada y algo reducida.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${SIZE}" height="${SIZE}">
    <rect width="120" height="120" rx="30" fill="${plate}"/>
    <g transform="translate(17 10) scale(0.86)">${inner(file)}</g></svg>`
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: SIZE } }).render().asPng()
  fs.writeFileSync(path.join(OUT, `${name}.png`), png)
  console.log(`${name}.png`, png.length, 'B')
}
