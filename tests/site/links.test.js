// Ningún enlace interno roto: cada href interno de cada página de dist/ apunta a algo que existe.
import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { allPages, html, tags, DIST, fileFor } from './helpers.js'

const pages = allPages()
const internal = (h) => h && h.startsWith('/') && !h.startsWith('//') && !h.startsWith('/api/') && h !== '/login'

describe('enlaces internos', () => {
  it.each(pages)('%s', (url) => {
    const src = html(url)
    const broken = []
    for (const a of [...tags(src, 'a'), ...tags(src, 'link')]) {
      const h = a.href
      if (!internal(h)) continue
      const path = h.split('#')[0].split('?')[0]
      const ok = existsSync(fileFor(path)) || existsSync(join(DIST, path))
      if (!ok) broken.push(h)
    }
    expect(broken, `rotos en ${url}`).toEqual([])
  })

  it('las anclas a la portada (#faq, #acceso…) existen', () => {
    const home = html('/')
    for (const id of ['faq', 'acceso', 'empieza', 'equipo', 'contenido']) expect(home, id).toMatch(new RegExp(`id="${id}"`))
  })

  it('todos los mailto son @klinworks.com (aclaración de Diego)', () => {
    for (const url of pages) for (const a of tags(html(url), 'a')) {
      if (a.href?.startsWith('mailto:')) expect(a.href, url).toMatch(/@klinworks\.com$/)
    }
  })
})
