// ⛔ En los correos NO van: número de expediente, fecha de constitución ni el estado de constitución
// (brief T42 de Luca). Se vigila en lo que sale (asunto, preheader, HTML, texto) y en el código fuente,
// para que ni un comentario lo cuele. Las páginas legales SÍ lo llevan: este test no las mira.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { TEMPLATES, LOCALES, render as renderReal } from '../src/index.js'
// Con la dirección POR DEFECTO (la que sale de verdad): el pie real también pasa por el vigilante.
const render = (t, l, d) => renderReal(t, l, d)

export const FORBIDDEN = [
  /delaware/i,
  /\b10704723\b/, // n.º de expediente
  /\bexpediente\b|\bfile (no\.|number)\b/i,
  /20 de julio de 2026|july 20,? 2026|2026-07-20/i, // fecha de constitución
  /constituid[ao]|\bincorporated\b|formed (in|on) /i,
]
const hits = (s) => FORBIDDEN.filter((re) => re.test(s)).map(String)

describe('sin datos de constitución en los correos', () => {
  it.each(TEMPLATES.flatMap((t) => LOCALES.map((l) => [t.id, l, t])))('%s · %s', async (_id, l, t) => {
    const r = await render(t, l, t.sample(l))
    expect(hits([r.subject, r.preheader, r.html, r.text].join('\n'))).toEqual([])
  })

  it('ni en el código del paquete (src/ y scripts/)', () => {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
    const files = ['src', 'scripts'].flatMap((d) => fs.readdirSync(path.join(root, d), { recursive: true }).map((f) => path.join(root, d, f)))
      .filter((f) => /\.(m?js|jsx)$/.test(f))
    expect(files.length).toBeGreaterThan(5)
    for (const f of files) expect(hits(fs.readFileSync(f, 'utf8')), f).toEqual([])
  })

  it('el vigilante muerde: detecta cada dato prohibido', () => {
    for (const s of ['Klinworks, LLC, a Delaware company', 'expediente n.º 10704723', 'Constituida el 20 de julio de 2026', 'formed in the State of', 'File number 10704723'])
      expect(hits(s).length, s).toBeGreaterThan(0)
  })
})
