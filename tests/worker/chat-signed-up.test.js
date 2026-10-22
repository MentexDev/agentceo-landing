// T60 · Recordar a quien ya se apuntó: el navegador manda `signedUp` (+ correo ENMASCARADO) a /api/chat. El
// servidor lo valida y solo lo usa para no volver a pedir el correo. /api/waitlist no revela si un correo existe.
import { env } from 'cloudflare:test'
import { exports } from 'cloudflare:workers'
import { describe, it, expect } from 'vitest'
import { web } from '../../worker/chat/channels/web.js'
import { respond } from '../../worker/chat/respond.js'
import { maskEmail } from '../../worker/email/mask.js'

const parse = async (body) => (await web.parse(new Request('https://agentceo.io/api/chat', { method: 'POST', body: JSON.stringify(body) }), env, { userKey: 'k', ip: '1.1.1.1' })).msg
const ask = (t, extra = {}) => ({ locale: 'es', messages: [{ role: 'user', content: t }], ...extra })
async function run(msg, { mode = 'stub' } = {}) {
  const ev = []
  let called = 0
  const r = await respond({ p: { ...msg, signals: { suspicious: [] } }, mode, env: { OPENROUTER_API_KEY: 'k' }, delay: 0, capTurns: 12,
    guards: { liveIp: async () => true, liveGlobal: async () => true, human: async () => ({ ok: true }), reserve: async () => ({ allowed: true }) },
    send: async (e, d) => ev.push({ e, d }), fetchImpl: async () => { called++; throw new Error('sin modelo') } })
  return { r, called, meta: ev.find((x) => x.e === 'meta').d, text: ev.filter((x) => x.e === 'delta').map((x) => x.d.t).join('') }
}

describe('validación en el servidor (no se confía en el navegador)', () => {
  it('acepta signedUp:true y un correo con forma enmascarada', async () => {
    const m = await parse(ask('hola', { signedUp: true, signedUpEmail: 'j***@g***.com' }))
    expect([m.signedUp, m.signedUpEmail]).toEqual([true, 'j***@g***.com'])
    expect(maskEmail('juana.perez@gmail.com')).toBe('j***@g***.com') // la misma forma que guarda el navegador
  })
  it.each([
    [{ signedUp: 'true', signedUpEmail: 'j***@g***.com' }, false, null], [{ signedUp: true, signedUpEmail: 'juana@gmail.com' }, true, null],
    [{ signedUp: true, signedUpEmail: '<b>x</b>***@g***.com' }, true, null], [{ signedUpEmail: 'j***@g***.com' }, false, null], [{ signedUp: true, signedUpEmail: 'j***@g***.com"><script>' }, true, null],
  ])('%j → signedUp %s, correo %s (lo raro se descarta)', async (extra, su, mail) => {
    const m = await parse(ask('hola', extra))
    expect([m.signedUp, m.signedUpEmail]).toEqual([su, mail])
  })
})

describe('con la bandera', () => {
  it.each([['es', 'me quiero registrar', /¡Ya estás en la lista con tu correo \*\*j∗∗∗@g∗∗∗\.com\*\*!/], ['en', 'sign me up', /You're already on the waitlist with \*\*j∗∗∗@g∗∗∗\.com\*\*/]])
  ('%s · «%s» → «ya estás en la lista con j***@…», siguientes pasos, SIN tarjeta y sin modelo', async (lang, t, re) => {
    const { meta, text, called, r } = await run({ lang, userText: t, turns: 1, history: [{ role: 'user', content: t }], signedUp: true, signedUpEmail: 'j***@g***.com' }, { mode: 'live' })
    expect(text).toMatch(re)
    expect(text).toMatch(lang === 'es' ? /cuéntame de tu negocio/ : /tell me about your business/)
    expect(meta).toMatchObject({ kind: 'intent:joined', cta: null })
    expect(called).toBe(0)
    expect(r.reason).toBe('already_joined')
  })
  it('sin correo enmascarado: «ya estás en la lista» a secas', async () => {
    const { text } = await run({ lang: 'es', userText: 'apúntame', turns: 1, history: [], signedUp: true, signedUpEmail: null })
    expect(text).toMatch(/^¡Ya estás en la lista! 🙌/)
  })
  it('nunca vuelve a salir la tarjeta (ni con una integración desconocida, que la trae)', async () => {
    const base = { lang: 'es', userText: '¿se integra con Trello?', turns: 1, history: [] }
    expect((await run(base)).meta.cta).toBe('waitlist')
    expect((await run({ ...base, signedUp: true })).meta.cta).toBeNull()
  })
  it('sin la bandera, «me quiero registrar» sigue mostrando la tarjeta', async () => {
    const { meta } = await run({ lang: 'es', userText: 'me quiero registrar', turns: 1, history: [] })
    expect(meta).toMatchObject({ kind: 'intent:join', cta: 'waitlist' })
  })
})

describe('/api/waitlist: sin enumeración', () => {
  const post = (email, ip) => exports.default.fetch(new Request('https://agentceo.io/api/waitlist', {
    method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip }, body: JSON.stringify({ email }),
  }))
  it('la respuesta es IDÉNTICA exista o no el correo (nadie averigua si un correo ajeno está en la lista)', async () => {
    const first = await post('enum-t60@example.com', '10.60.0.1')
    const again = await post('enum-t60@example.com', '10.60.0.2')
    const fresh = await post('otro-enum-t60@example.com', '10.60.0.3')
    const bodies = await Promise.all([first, again, fresh].map((r) => r.text()))
    expect(new Set([first.status, again.status, fresh.status])).toEqual(new Set([200]))
    expect(new Set(bodies).size).toBe(1)
    expect((await env.DB.prepare('SELECT COUNT(*) AS n FROM signups WHERE email = ?').bind('enum-t60@example.com').first()).n).toBe(1)
  })
})
