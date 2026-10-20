// Fuentes de las imágenes OG (src/lib/og.js): los woff2 del sitio se descomprimen a TTF para resvg.
// Medido el 20-oct (T33): descomprimirlos EN PARALELO con wawoff2 dejaba Geist y Geist Mono
// corruptos y resvg pintaba toda la OG con la única fuente válida. No se veía porque la caché se
// creaba una vez y no se regeneraba: este test la regenera desde cero cada vez.
import { describe, it, expect } from 'vitest'
import { readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

describe('fuentes de las OG', () => {
  it('regeneradas desde cero, todas son TTF válidos (cabecera sfnt 0x00010000)', async () => {
    rmSync(join(process.cwd(), 'node_modules', '.cache', 'og-fonts'), { recursive: true, force: true })
    const { fonts } = await import('../../src/lib/og.js')
    const files = await fonts()
    expect(files.map((f) => f.split('/').pop())).toEqual(['geist-latin-wght-normal.ttf', 'geist-mono-latin-wght-normal.ttf', 'fraunces-latin-560-normal.ttf'])
    for (const f of files) expect(readFileSync(f).subarray(0, 4).toString('hex'), f).toBe('00010000')
  }, 30_000)
})
