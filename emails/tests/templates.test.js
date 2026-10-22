// Todas las plantillas × ES/EN con sus datos de ejemplo: se pintan, traen asunto, preheader y texto plano,
// las de marketing llevan baja (enlace + cabeceras RFC 8058) y las de servicio no.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { EMAIL_ASSETS, POSTAL_PLACEHOLDER, DEFAULT_POSTAL_ADDRESS, EMAIL_ASSET_BASE } from '../src/brand.js'
import { createHash } from 'node:crypto'
import { SEND, readDevVar, redact, imageSources, checkImages, buildTestEmail, config } from '../scripts/send-test.mjs'
import { TEMPLATES, LOCALES, render as renderReal, byId } from '../src/index.js'
// Dirección postal FICTICIA para casi todos los tests (la de verdad: DEFAULT_POSTAL_ADDRESS / POSTAL_ADDRESS).
const POSTAL = 'Calle Ficticia 123, 00000 Ciudad de Prueba'
const V1_HASHES = {"agente-1-noche.png": "cc1025206e71", "agente-1.png": "3c1dcbd73490", "agente-2-noche.png": "03b15da11cc3", "agente-2.png": "934b4687d9d9", "agente-3-noche.png": "9c184cb1e236", "agente-3.png": "d217dc3b35da", "agente-4-noche.png": "4d50668efee7", "agente-4.png": "05ec8ffef549", "ceo-noche.png": "af9040eb97dc", "ceo.png": "57db73931c91"}
const BUILD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../scripts/build.mjs')
const render = (t, l, d, o) => renderReal(t, l, d, { postalAddress: POSTAL, ...o })
import { BUSINESS_IDEAS } from '../src/gifts.js'
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
    for (const src of imgs) expect(src).toMatch(/^https:\/\/agentceo\.io\/email-assets\/v2\/[a-z0-9-]+\.png$/)
    expect(r.html).not.toMatch(/<svg|\.svg"/)
    expect(Buffer.byteLength(r.html)).toBeLessThan(102_000)
    expect(r.html).toContain(`lang="${l}"`)
  })

  it('pie: empresa, dirección postal y contacto', async () => {
    const r = await get(id, l)
    for (const s of [r.html, r.text]) {
      expect(s).toContain('Klinworks, LLC')
      expect(s).toContain(POSTAL)
      expect(s).not.toContain('POSTAL_ADDRESS')
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
  // T60c: el regalo son IDEAS (3 por negocio, cada una con su «para qué sirve»), para el asistente que ya usan.
  it('hay 3 ideas con «para qué sirve» para cada tipo de negocio de la lista, en los 3 idiomas', () => {
    for (const l of LOCALES) for (const b of BUSINESS_TYPES) {
      expect(BUSINESS_IDEAS[l][b], `${l}/${b}`).toHaveLength(3)
      for (const it of BUSINESS_IDEAS[l][b]) { expect(it.prompt.length).toBeGreaterThan(40); expect(it.prompt.length).toBeLessThan(220); expect(it.use.length).toBeGreaterThan(10) }
    }
  })
  it('el regalo de la bienvenida sigue el negocio que eligió (y explica que es para el asistente que ya usa)', async () => {
    const base = byId('waitlist-welcome').sample('es')
    const moda = await render('waitlist-welcome', 'es', { ...base, business: 'moda' })
    for (const it of BUSINESS_IDEAS.es.moda) expect(moda.text).toContain(it.prompt.slice(0, 40))
    expect(moda.text).toContain('Ideas de prompts listas para copiar')
    expect(moda.text).toContain('ChatGPT, Gemini o el asistente de IA que ya uses')
    expect(moda.text).toContain('Cuando entres a Agent CEO, tu equipo hará esto solo')
    const raro = await render('waitlist-welcome', 'es', { ...base, business: 'inventado' })
    expect(raro.text).toContain(BUSINESS_IDEAS.es.tienda[0].prompt.slice(0, 40))
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

describe('imágenes que Gmail sí pinta (T54: la Prueba 1 llegó con las imágenes rotas)', () => {
  const ASSET_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/email-assets/v2')
  const pngSide = (file) => { const b = fs.readFileSync(file); return [b.readUInt32BE(16), b.readUInt32BE(20)] }
  const imgs = (html) => [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
  const attr = (tag, a) => tag.match(new RegExp(`\\s${a}="([^"]*)"`))?.[1]

  it('T60b · v1 queda CONGELADA (correos ya enviados): sus 10 PNG siguen ahí, idénticos a los de T54b', () => {
    const v1 = path.resolve(ASSET_DIR, '../v1')
    const files = fs.readdirSync(v1).sort()
    expect(files).toEqual(Object.values(EMAIL_ASSETS).map((a) => a.file).sort())
    // Huella de T54b (commit 4852607): si alguien regenera v1, el test se pone rojo.
    const sha = (f) => createHash('sha256').update(fs.readFileSync(path.join(v1, f))).digest('hex').slice(0, 12)
    expect(Object.fromEntries(files.map((f) => [f, sha(f)]))).toEqual(V1_HASHES)
  })
  it('T60b · en v2 los 4 agentes son DIBUJOS distintos (no la misma cara con otro fondo)', () => {
    const px = (f) => fs.readFileSync(path.join(ASSET_DIR, f))
    const agents = [1, 2, 3, 4].map((n) => px(`agente-${n}.png`).toString('base64'))
    expect(new Set(agents).size).toBe(4)
    expect(Object.values(EMAIL_ASSETS).filter((a) => a.agent).map((a) => a.agent).sort()).toEqual(['creador', 'creador', 'director', 'director', 'inventario', 'inventario', 'vendedor', 'vendedor'])
    expect(EMAIL_ASSET_BASE).toBe('https://agentceo.io/email-assets/v2')
  })
  it('cada PNG del registro existe en public/email-assets/v2 y mide 2× su tamaño mayor en pantalla', () => {
    for (const { file, px } of Object.values(EMAIL_ASSETS)) {
      const f = path.join(ASSET_DIR, file)
      expect(fs.existsSync(f), file).toBe(true)
      expect(pngSide(f), file).toEqual([px, px])
    }
  })

  it.each(cases)('%s · %s: cada <img> lleva alt, width/height y va en su celda fija', async (id, l) => {
    const r = await get(id, l)
    for (const tag of imgs(r.html)) {
      expect(attr(tag, 'alt')?.trim().length, tag).toBeGreaterThan(1)
      const w = Number(attr(tag, 'width')), h = Number(attr(tag, 'height'))
      expect(w, tag).toBeGreaterThan(0)
      expect(h, tag).toBeGreaterThan(0)
      // 2× retina: el PNG propio mide al menos el doble de lo que ocupa.
      const own = Object.values(EMAIL_ASSETS).find((a) => attr(tag, 'src').endsWith(`/${a.file}`))
      if (own) expect(own.px, tag).toBeGreaterThanOrEqual(2 * w)
    }
    // Celda de tamaño fijo: cada avatar va dentro de un <td width=N height=N> (con imágenes bloqueadas,
    // el alt se queda dentro del cuadrado en vez de desbordarse junto a la píldora).
    const cells = [...r.html.matchAll(/<td[^>]*\swidth="(\d+)"[^>]*\sheight="(\d+)"[^>]*>(?:(?!<\/td>)[\s\S])*?<img[^>]*\swidth="(\d+)"/g)]
    expect(cells.length).toBe(imgs(r.html).filter((t) => !/ac-dark-img/.test(t)).length)
    for (const [, tw, th, iw] of cells) expect([tw, th]).toEqual([iw, iw])
  })

  it('con imágenes bloqueadas, la portada no se rompe: la columna de la mascota tiene ancho fijo', async () => {
    const r = await get('waitlist-welcome', 'es')
    expect(r.html).toMatch(/<td[^>]*width="80"[^>]*>[\s\S]*?<table[^>]*width="64"/)
    expect(r.html).toContain('¡confirmado!')
  })

  it('el HTML CONSTRUIDO (build.mjs) solo trae <img src> https absolutos acabados en .png/.jpg/.gif', () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'emails-t54-'))
    try {
      execFileSync(process.execPath, [BUILD], { env: { ...process.env, POSTAL_ADDRESS: POSTAL, EMAILS_OUT_DIR: out, EMAIL_ASSET_BASE_URL: '' }, stdio: 'pipe' })
      const files = fs.readdirSync(out).filter((f) => f.endsWith('.html'))
      expect(files).toHaveLength(TEMPLATES.length * LOCALES.length)
      let n = 0
      for (const f of files) {
        for (const [, src] of fs.readFileSync(path.join(out, f), 'utf8').matchAll(/<img[^>]+src="([^"]+)"/g)) {
          expect(src, f).toMatch(/^https:\/\/[^\s"]+\.(png|jpg|gif)$/)
          n++
        }
      }
      expect(n).toBeGreaterThan(TEMPLATES.length * LOCALES.length)
    } finally {
      fs.rmSync(out, { recursive: true, force: true })
    }
  }, 60_000)

  const runBuild = (env) => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'emails-t54-'))
    try {
      let code = 0
      try { execFileSync(process.execPath, [BUILD], { env: { ...env, EMAILS_OUT_DIR: out }, stdio: 'pipe' }) } catch (e) { code = e.status }
      const files = fs.readdirSync(out)
      const welcome = files.includes('waitlist-welcome.es.html') ? fs.readFileSync(path.join(out, 'waitlist-welcome.es.html'), 'utf8') : ''
      return { code, files, welcome }
    } finally {
      fs.rmSync(out, { recursive: true, force: true })
    }
  }

  it('sin POSTAL_ADDRESS, el build de producción usa la dirección por defecto', () => {
    const { POSTAL_ADDRESS, ...env } = process.env
    const { code, welcome } = runBuild(env)
    expect(code).toBe(0)
    expect(welcome).toContain('131 Continental Dr, Suite 305, Newark, DE 19713, USA')
  }, 60_000)

  it('POSTAL_ADDRESS vaciada a propósito → el build de producción FALLA (y no escribe nada)', () => {
    for (const empty of ['', '   ']) {
      const { code, files } = runBuild({ ...process.env, POSTAL_ADDRESS: empty })
      expect(code).toBe(1)
      expect(files).toEqual([])
    }
  }, 60_000)

  it('render: por defecto, la dirección de la config; vacía → falla; la vista previa pinta el aviso claro', async () => {
    const d = byId('waitlist-confirm').sample('es')
    const def = await renderReal('waitlist-confirm', 'es', d)
    expect(DEFAULT_POSTAL_ADDRESS).toBe('Klinworks, LLC · 131 Continental Dr, Suite 305, Newark, DE 19713, USA')
    for (const s of [def.html, def.text]) {
      expect(s).toContain('131 Continental Dr, Suite 305, Newark, DE 19713, USA')
      // La razón social, una sola vez en el pie (la dirección ya la trae).
      expect(s.match(/Klinworks, LLC/g)).toHaveLength(1)
    }
    for (const empty of ['', '  ']) await expect(renderReal('waitlist-confirm', 'es', d, { postalAddress: empty })).rejects.toThrow('POSTAL_ADDRESS')
    const prev = await renderReal('waitlist-confirm', 'es', d, { preview: true, assetBase: '/email-assets/v2', postalAddress: '' })
    expect(prev.html).toContain(POSTAL_PLACEHOLDER)
  })

  it('la base de imágenes es configurable y fuera de la galería tiene que ser https', async () => {
    const d = byId('waitlist-welcome').sample('es')
    const r = await render('waitlist-welcome', 'es', d, { assetBase: 'https://cdn.ejemplo.test/correo/v1/' })
    for (const [, src] of r.html.matchAll(/<img[^>]+src="([^"]+)"/g)) expect(src).toMatch(/^https:\/\/cdn\.ejemplo\.test\/correo\/v1\/[a-z0-9-]+\.png$/)
    for (const bad of ['', '/email-assets/v2', 'http://agentceo.io/email-assets/v2', '//agentceo.io/x'])
      await expect(render('waitlist-welcome', 'es', d, { assetBase: bad })).rejects.toThrow('https')
  })
})

describe('avatares propios: ceo.avatarUrl y agents[].avatarUrl', () => {
  const CEO = 'https://cdn.ejemplo.test/fotos/ceo.jpg'
  const AG = ['https://cdn.ejemplo.test/a/1.png', null, 'https://cdn.ejemplo.test/a/3.gif']
  it.each(TEMPLATES.map((t) => [t.id]))('%s: el CEO usa su foto si llega, y si no, la mascota', async (id) => {
    const d = byId(id).sample('es')
    const base = await render(id, 'es', d)
    const r = await render(id, 'es', { ...d, ceo: { avatarUrl: CEO }, agents: AG.map((avatarUrl) => ({ avatarUrl })) })
    const ceoImgs = (base.html.match(/\/ceo(-noche)?\.png"/g) || []).length
    expect(ceoImgs).toBeGreaterThan(0)
    // La foto sustituye a la imagen clara Y a la oscura: ni rastro de la mascota del CEO.
    expect((r.html.match(new RegExp(`src="${CEO}"`, 'g')) || []).length).toBe(ceoImgs)
    expect(r.html).not.toMatch(/\/ceo(-noche)?\.png"/)
  })
  it('la fila del equipo: override por posición, y la mascota por defecto donde no llega', async () => {
    const d = byId('waitlist-welcome').sample('es')
    const r = await render('waitlist-welcome', 'es', { ...d, agents: AG.map((avatarUrl) => ({ avatarUrl })) })
    expect(r.html).toContain(`src="${AG[0]}"`)
    expect(r.html).toContain('/agente-2.png"')
    expect(r.html).toContain(`src="${AG[2]}"`)
    expect(r.html).toContain('/agente-4.png"')
    expect(r.html).not.toContain('/agente-1.png"')
    // En oscuro también: el override reemplaza al gemelo de noche; los que no tienen foto usan el SUYO.
    expect(r.html).not.toMatch(/\/agente-[13]-noche\.png"/)
    expect(r.html).toContain('/agente-2-noche.png"')
    expect(r.html).toContain('/agente-4-noche.png"')
    expect((r.html.match(new RegExp(`src="${AG[0]}"`, 'g')) || []).length).toBe(2)
    expect(r.html).toMatch(new RegExp(`alt="Director General"[^>]*src="${AG[0]}"|src="${AG[0]}"[^>]*alt="Director General"`))
  })
  it.each(cases)('%s · %s: en oscuro, cada avatar lleva SU gemelo (ningún agente con ceo-noche)', async (id, l) => {
    const r = await get(id, l)
    const cells = [...r.html.matchAll(/<td class="ac-plate"[\s\S]*?<\/td>/g)].map((m) => [...m[0].matchAll(/src="[^"]*\/([a-z0-9-]+)\.png"/g)].map((x) => x[1]))
    expect(cells.length).toBeGreaterThan(0)
    for (const [light, dark] of cells) {
      expect(EMAIL_ASSETS[light]?.dark, light).toBeTruthy()
      expect(dark).toBe(EMAIL_ASSETS[light].dark)
    }
    if (/agente-1\.png/.test(r.html)) expect(cells.filter(([lt]) => lt.startsWith('agente')).map(([, dk]) => dk)).toEqual(['agente-1-noche', 'agente-2-noche', 'agente-3-noche', 'agente-4-noche'])
  })
  it('un avatar que Gmail no pintaría (http, SVG, relativo, con comillas) → falla en voz alta', async () => {
    const d = byId('waitlist-welcome').sample('es')
    for (const bad of ['http://x.test/a.png', 'https://x.test/a.svg', '/a.png', 'https://x.test/a.png" onerror="x', 'https://x.test/a.png?v=1'])
      await expect(render('waitlist-welcome', 'es', { ...d, ceo: { avatarUrl: bad } })).rejects.toThrow('ceo.avatarUrl')
    await expect(render('waitlist-welcome', 'es', { ...d, agents: [{}, { avatarUrl: 'https://x.test/a.webp' }] })).rejects.toThrow('agents[1].avatarUrl')
  })
})

describe('send-test.mjs (sin enviar nada: solo sus piezas)', () => {
  const FAKE = 're_FALSA_clave_de_mentira_123456'
  it('lee la clave de .dev.vars y nunca la deja salir a pantalla', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'emails-t54-'))
    try {
      const f = path.join(dir, '.dev.vars')
      fs.writeFileSync(f, `OTRA=1\nRESEND_API_KEY="${FAKE}"\nPOSTAL_ADDRESS=${POSTAL}\n`)
      expect(readDevVar(f, 'RESEND_API_KEY')).toBe(FAKE)
      expect(readDevVar(f, 'NO_ESTA')).toBeNull()
      const cfg = config({ EMAIL_ASSET_BASE_URL: 'https://agentceo.io/email-assets/v2' }, f)
      expect(cfg.errors).toEqual([])
      expect(cfg.postalAddress).toBe(POSTAL)
      expect(redact(`Bearer ${FAKE} y otra vez ${FAKE}`, FAKE)).toBe('Bearer *** y otra vez ***')
      // Sin config, los errores nombran lo que falta, nunca la clave.
      const bad = config({}, path.join(dir, 'no-existe'))
      expect(bad.errors.join(' ')).toMatch(/RESEND_API_KEY/)
      expect(bad.errors.join(' ')).not.toMatch(/EMAIL_ASSET_BASE_URL/)
      // T57: la base de los PNG, por defecto la de producción; una no https, error.
      expect(bad.assetBase).toBe('https://agentceo.io/email-assets/v2')
      expect(config({ EMAIL_ASSET_BASE_URL: 'http://agentceo.io/x' }, f).errors.join(' ')).toMatch(/EMAIL_ASSET_BASE_URL debe ser https/)
      expect(bad.postalAddress).toBe(DEFAULT_POSTAL_ADDRESS)
      // Vaciada a propósito (en el entorno o en .dev.vars) → no envía.
      expect(config({ EMAIL_ASSET_BASE_URL: 'https://a.test/v1', POSTAL_ADDRESS: '' }, f).errors.join(' ')).toMatch(/POSTAL_ADDRESS está vacía/)
      fs.writeFileSync(f, `RESEND_API_KEY=${FAKE}\nPOSTAL_ADDRESS=\n`)
      expect(config({ EMAIL_ASSET_BASE_URL: 'https://a.test/v1' }, f).errors.join(' ')).toMatch(/POSTAL_ADDRESS está vacía/)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
  it('arma EXACTAMENTE el correo pedido: waitlist-welcome.es, de info@ a ceo@, asunto de la Prueba 2', async () => {
    const email = await buildTestEmail({ render: renderReal, byId, assetBase: 'https://agentceo.io/email-assets/v2', postalAddress: POSTAL, unsubscribeUrl: 'mailto:info@agentceo.io?subject=Baja' })
    expect(email.from).toBe('Agent CEO <info@agentceo.io>')
    expect(email.to).toEqual(['ceo@agentceo.io'])
    expect(email.subject).toBe('[Prueba 2] Bienvenido a la lista de espera de Agent CEO')
    expect(email.html).toContain('¡confirmado!')
    expect(email.text.length).toBeGreaterThan(200)
    expect(email.headers).toEqual({ 'List-Unsubscribe': '<mailto:info@agentceo.io?subject=Baja>' })
    for (const src of imageSources(email.html)) expect(src).toMatch(/^https:\/\/agentceo\.io\/email-assets\/v2\/[a-z0-9-]+\.png$/)
    expect(SEND.idempotencyKey).toBeTruthy()
  })
  it('no envía si una imagen no responde 200 image/png (lo que rompió la Prueba 1)', async () => {
    const html = '<img src="https://a.test/ok.png"><img src="https://a.test/falta.png"><img src="/rel.png">'
    const fake = async (u) => ({ status: u.endsWith('ok.png') ? 200 : 404, headers: new Headers({ 'content-type': u.endsWith('ok.png') ? 'image/png' : 'text/html' }) })
    const p = await checkImages(html, fake)
    expect(p).toHaveLength(2)
    expect(p.join(' ')).toMatch(/falta\.png → 404/)
    expect(p.join(' ')).toMatch(/rel\.png → no es https/)
    expect(await checkImages('<img src="https://a.test/ok.png">', fake)).toEqual([])
    // Un 404 que aun así dice image/png (página de error de algún CDN) tampoco pasa.
    const liar = async () => ({ status: 404, headers: new Headers({ 'content-type': 'image/png' }) })
    expect(await checkImages('<img src="https://a.test/ok.png">', liar)).toHaveLength(1)
  })
})
