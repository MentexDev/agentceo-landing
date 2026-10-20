// Escapes de seguridad con casos de ataque reales.
import { describe, it, expect } from 'vitest'
import { esc, safeUrl, safeHref, jsonForScript, inlineMd, inlineBold } from '../../src/lib/escape.js'

describe('escapes', () => {
  it('esc neutraliza HTML y comillas', () => {
    expect(esc(`<img src=x onerror="a('b')">`)).toBe('&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;')
  })

  it.each(['javascript:alert(1)', 'data:text/html,x', 'https://a.com/"onmouseover=', 'https://a.com/ x', '//evil.com'])(
    'safeUrl rechaza %s', (u) => expect(safeUrl(u)).toBe('#'))

  it.each([['/precios/', '/precios/'], ['https://x.com/a', 'https://x.com/a'], ['mailto:info@klinworks.com', 'mailto:info@klinworks.com'],
    ['//evil.com', '#'], ['javascript:x', '#'], ['/a"b', '#']])('safeHref(%s) = %s', (u, out) => expect(safeHref(u)).toBe(out))

  it('jsonForScript no deja cerrar el <script>', () => {
    const s = jsonForScript({ name: '</script><script>alert(1)</script><!--' })
    expect(s).not.toMatch(/<\/script/i)
    expect(s).not.toContain('<!--')
    expect(JSON.parse(s).name).toBe('</script><script>alert(1)</script><!--')
  })

  it('inlineMd escapa antes de enlazar y bloquea esquemas peligrosos', () => {
    expect(inlineMd('[x](javascript:alert(1))')).not.toMatch(/href|<a/)
    expect(inlineMd('<b>hola</b> **ok**')).toBe('&lt;b&gt;hola&lt;/b&gt; <strong>ok</strong>')
    expect(inlineMd('[a](/legal/privacidad)')).toBe('<a href="/legal/privacidad">a</a>')
    expect(inlineMd('[a](https://x.com/?a=1&b=2)')).toBe('<a href="https://x.com/?a=1&amp;b=2">a</a>')
  })

  it('inlineBold', () => expect(inlineBold('**<x>**')).toBe('<strong>&lt;x&gt;</strong>'))
})
