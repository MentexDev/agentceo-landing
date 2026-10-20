// Todas las plantillas × ES/EN con sus datos de ejemplo: se pintan, traen asunto, preheader y texto plano,
// las de marketing llevan baja (enlace + cabeceras RFC 8058) y las de servicio no.
import { describe, it, expect } from 'vitest'
import { TEMPLATES, LOCALES, render, byId } from '../src/index.js'
import { BUSINESS_PROMPTS } from '../src/gifts.js'
import { BUSINESS_TYPES } from '../../src/data/waitlist.js'
import { PACKS } from '../../content/precios.js'

const cases = TEMPLATES.flatMap((t) => LOCALES.map((l) => [t.id, l]))
const out = new Map()
const get = async (id, l) => {
  const k = `${id}.${l}`
  if (!out.has(k)) out.set(k, await render(id, l, byId(id).sample(l)))
  return out.get(k)
}
const strip = (html) => html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')

describe('registro', () => {
  it('ids únicos, fase A/B, tipo válido, copia en los dos idiomas', () => {
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(TEMPLATES.length)
    for (const t of TEMPLATES) {
      expect(['A', 'B']).toContain(t.phase)
      expect(['transactional', 'marketing']).toContain(t.kind)
      for (const l of LOCALES) expect(typeof t.copy[l]).toBe('function')
      expect(t.when).toBeTruthy()
    }
  })
  it('cubre el plan: 4 de fase A y las 13 de fase B', () => {
    expect(TEMPLATES.filter((t) => t.phase === 'A').map((t) => t.id)).toEqual(['waitlist-confirm', 'waitlist-welcome', 'waitlist-update', 'launch-invite'])
    expect(TEMPLATES.filter((t) => t.phase === 'B')).toHaveLength(13)
  })
})

describe.each(cases)('%s · %s', (id, l) => {
  it('se pinta con asunto, preheader y texto plano', async () => {
    const r = await get(id, l)
    expect(r.subject.length).toBeGreaterThan(8)
    expect(r.subject.length).toBeLessThan(90)
    expect(r.preheader.length).toBeGreaterThan(20)
    // El preheader va dentro del HTML (bloque oculto de <Preview>), no solo en los metadatos.
    const hidden = r.html.match(/<div style="display:none[^"]*" data-skip-in-text="true">([^<]*)/)
    expect(hidden?.[1].replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')).toContain(r.preheader.slice(0, 40))
    expect(r.text.length).toBeGreaterThan(200)
    expect(r.text).not.toContain('<')
  })

  it('sin huecos de datos: ni undefined, ni null, ni NaN, ni [object …]', async () => {
    const r = await get(id, l)
    for (const s of [r.subject, r.preheader, r.text, strip(r.html)]) expect(s).not.toMatch(/\bundefined\b|\bnull\b|\bNaN\b|\[object /)
  })

  it('HTML de correo: 600 px, color-scheme, solo PNG absolutos, bajo el recorte de Gmail', async () => {
    const r = await get(id, l)
    expect(r.html).toMatch(/max-width:\s*600px/)
    expect(r.html).toContain('<meta name="color-scheme" content="light dark"')
    const imgs = [...r.html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1])
    expect(imgs.length).toBeGreaterThan(0)
    for (const src of imgs) expect(src).toMatch(/^https:\/\/agentceo\.io\/brand\/email\/[a-z-]+\.png$/)
    expect(r.html).not.toMatch(/<svg|\.svg"/)
    expect(Buffer.byteLength(r.html)).toBeLessThan(102_000)
    expect(r.html).toContain(`lang="${l}"`)
  })

  it('pie: empresa, dirección postal y contacto', async () => {
    const r = await get(id, l)
    for (const s of [r.html, r.text]) {
      expect(s).toContain('Klinworks, LLC')
      expect(s).toContain('{{POSTAL_ADDRESS}}')
      expect(s).toContain('info@agentceo.io')
    }
  })

  it('baja: SIEMPRE en marketing (enlace + List-Unsubscribe), NUNCA en servicio', async () => {
    const t = byId(id)
    const r = await get(id, l)
    const unsub = t.sample(l).unsubscribeUrl
    if (t.kind === 'marketing') {
      expect(r.html).toMatch(new RegExp(`<a[^>]+href="${unsub.replace(/[.?]/g, '\\$&')}"[^>]*data-unsubscribe`))
      expect(r.text).toContain(unsub)
      expect(r.headers['List-Unsubscribe']).toBe(`<${unsub}>`)
      expect(r.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click')
    } else {
      expect(r.html).not.toContain('data-unsubscribe')
      expect(r.text).not.toMatch(/darme de baja|unsubscribe/i)
      expect(r.headers).toEqual({})
    }
  })
})

describe('datos que faltan o que vienen mal', () => {
  it('lo obligatorio falla en voz alta (un correo sin enlace es peor que ninguno)', async () => {
    for (const t of TEMPLATES) {
      for (const k of t.required) {
        const data = { ...t.sample('es') }
        delete data[k]
        await expect(render(t, 'es', data)).rejects.toThrow(k)
      }
    }
  })
  it('marketing sin enlace de baja → no se pinta', async () => {
    for (const t of TEMPLATES.filter((x) => x.kind === 'marketing')) {
      const { unsubscribeUrl, ...data } = t.sample('en')
      await expect(render(t, 'en', data)).rejects.toThrow('unsubscribeUrl')
    }
  })
  it('idioma o plantilla desconocidos → error', async () => {
    await expect(render('waitlist-confirm', 'fr', {})).rejects.toThrow('idioma')
    await expect(render('no-existe', 'es', {})).rejects.toThrow('desconocida')
  })
  it('sin nombre: nunca «Hola, ,» ni «Ana, » colgando', async () => {
    for (const t of TEMPLATES) {
      for (const l of LOCALES) {
        const { name, ...data } = t.sample(l)
        const r = await render(t, l, data)
        for (const s of [r.subject, r.preheader, r.text]) {
          expect(s).not.toMatch(/,\s*,|Hola,\s*\.|Hi\s*,|^,|\s,\s/m)
          expect(s).not.toMatch(/\bundefined\b|\bnull\b/)
          expect(s).not.toMatch(/\b(Ana|Sam)\b/)
        }
      }
    }
  })
  it('el nombre se escapa (nadie mete HTML por el formulario)', async () => {
    const r = await render('waitlist-welcome', 'es', { ...byId('waitlist-welcome').sample('es'), name: '<img src=x onerror=alert(1)>' })
    expect(r.html).not.toContain('<img src=x')
    expect(r.html).toContain('&lt;img src=x')
  })
})

describe('regalos y precios reales', () => {
  it('hay un prompt para cada tipo de negocio de la lista, en los dos idiomas', () => {
    for (const l of LOCALES) for (const b of BUSINESS_TYPES) expect(BUSINESS_PROMPTS[l][b]?.prompt?.length).toBeGreaterThan(80)
  })
  it('el regalo de la bienvenida sigue el negocio que eligió', async () => {
    const base = byId('waitlist-welcome').sample('es')
    const moda = await render('waitlist-welcome', 'es', { ...base, business: 'moda' })
    expect(moda.text).toContain(BUSINESS_PROMPTS.es.moda.prompt.slice(0, 40))
    const raro = await render('waitlist-welcome', 'es', { ...base, business: 'inventado' })
    expect(raro.text).toContain(BUSINESS_PROMPTS.es.tienda.prompt.slice(0, 40))
  })
  it('los paquetes de créditos salen de content/precios.js (nada escrito a mano)', async () => {
    const r = await get('credits-out', 'es')
    for (const p of PACKS) {
      expect(r.text).toContain(p.name)
      expect(r.text).toContain(`$${p.price} USD`)
    }
  })
  it('cada correo regala o celebra algo: prompt, tip, equipo o la burbuja de tu CEO', async () => {
    for (const [id, l] of cases) {
      const r = await get(id, l)
      expect(r.html, id).toMatch(/Prompt listo|Ready-to-copy|💡 Tip|class="ac-tint"|ac-half/)
    }
  })
})
