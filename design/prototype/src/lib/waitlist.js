// Lista de espera → Supabase (función join_waitlist, ver supabase.sql).
// Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env (llave PÚBLICA anon/publishable, nunca service_role).
const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export function joinWaitlist({ email, business } = {}) {
  const row = {
    p_email: String(email || '').trim().toLowerCase(),
    p_business: business || null,
    p_source: window.matchMedia('(max-width: 820px)').matches ? 'landing-mobile' : 'landing-desktop',
    p_referrer: document.referrer || null,
  }
  if (!URL || !KEY) {
    console.info('[waitlist] Supabase sin configurar, no se guardó:', row)
    return Promise.resolve(false)
  }
  return fetch(URL.replace(/\/$/, '') + '/rest/v1/rpc/join_waitlist', {
    method: 'POST',
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
    keepalive: true,
  })
    .then((r) => r.ok)
    .catch((e) => { console.warn('[waitlist]', e); return false })
}
