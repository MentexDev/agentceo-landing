// Galería local de los correos: http://127.0.0.1:3012/
//   node emails/scripts/build.mjs && node emails/scripts/serve.mjs     (o: npm run gallery -w emails)
// Sirve emails/out/gallery y, para que los correos se vean con sus PNG y fuentes, /email-assets y /fonts de public/.
// Puerto: 3012 por defecto (EMAILS_PORT para otro). ⛔ Nunca 3000/4000/3100/4100/4101/5433/6380, y el 3011
// es de la rama `nube` en esta Mac. Si el puerto está ocupado, FALLA (no salta a otro ni mata a nadie).
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const GALLERY = path.resolve(HERE, '../out/gallery')
const PUBLIC = path.resolve(HERE, '../../public')
const PORT = Number(process.env.EMAILS_PORT || 3012)
const FORBIDDEN = new Set([3000, 3011, 4000, 3100, 4100, 4101, 5433, 6380])
if (FORBIDDEN.has(PORT)) throw new Error(`Puerto ${PORT} reservado: usa otro (EMAILS_PORT).`)

const TYPES = { '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }

export function resolveFile(urlPath) {
  const p = decodeURIComponent(urlPath.split('?')[0])
  const [base, rel] = /^\/(email-assets|fonts)\//.test(p) ? [PUBLIC, p] : [GALLERY, p === '/' ? '/index.html' : p]
  const file = path.resolve(base, `.${rel}`)
  // Sin salir de su carpeta: nada de ../../ hacia el resto del disco.
  return file.startsWith(base + path.sep) ? file : null
}

if (!fs.existsSync(path.join(GALLERY, 'index.html'))) throw new Error('Falta la galería: corre antes node emails/scripts/build.mjs')

http.createServer((req, res) => {
  const file = resolveFile(req.url)
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end('404'); return }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' })
  fs.createReadStream(file).pipe(res)
}).on('error', (e) => { console.error(`✗ No pude abrir el puerto ${PORT}: ${e.code}. ¿Quién lo tiene? lsof -nP -iTCP:${PORT} -sTCP:LISTEN`); process.exit(1) })
  .listen(PORT, '127.0.0.1', () => console.log(`✓ Galería de correos en http://127.0.0.1:${PORT}/`))
