// ─────────────────────────────────────────────────────────────────────────────
// INVENTARIO de lo que esta WEB guarda en el navegador (cookies y almacenamiento local).
// FUENTE ÚNICA para /legal/cookies. Un test exige que cada clave usada en src/ esté aquí.
// Analítica: NINGUNA (decisión de Diego, 2026-10-20).
// ─────────────────────────────────────────────────────────────────────────────
const nec = { es: 'Necesaria', en: 'Necessary' }
const fun = { es: 'Funcional', en: 'Functional' }
const cookie = { es: 'Cookie propia', en: 'First-party cookie' }
const ls = { es: 'Almacenamiento local', en: 'Local storage' }
const ss = { es: 'Almacenamiento de sesión', en: 'Session storage' }
const session = { es: 'Hasta cerrar la pestaña', en: 'Until the tab is closed' }

export const STORAGE = [
  { name: 'consent', type: cookie, category: nec, duration: { es: '12 meses', en: '12 months' }, purpose: { es: 'Recordar tus preferencias de cookies y tu solicitud de no vender ni compartir (incluida la señal GPC)', en: 'Remember your cookie choices and your do-not-sell-or-share request (including the GPC signal)' } },
  { name: 'lang', type: cookie, category: fun, duration: { es: '12 meses', en: '12 months' }, purpose: { es: 'Recordar el idioma que elegiste', en: 'Remember the language you chose' } },
  // T60: además del indicador, el correo ENMASCARADO (j***@g***.com) para decirte «ya estás en la lista con …».
  { name: 'ac_wl', type: ls, category: fun, duration: { es: 'Hasta que la borres', en: 'Until you clear it' }, purpose: { es: 'Recordar que ya te apuntaste a la lista, para no volver a pedirte el correo (no guarda tu correo)', en: 'Remember that you already joined the waitlist so we don\'t ask for your email again (does not store your email)' } },
  { name: 'ac_wlm', type: ls, category: fun, duration: { es: 'Hasta que la borres', en: 'Until you clear it' }, purpose: { es: 'Tu correo ENMASCARADO (p. ej. j***@g***.com), para recordarte con qué correo te apuntaste; nunca el correo entero', en: 'Your MASKED email (e.g. j***@g***.com), to remind you which email you signed up with; never the full email' } },
  { name: 'ac_wl (cookie)', type: cookie, category: fun, duration: { es: '12 meses', en: '12 months' }, purpose: { es: 'Lo mismo que ac_wl y ac_wlm, por si se borra el almacenamiento local; con lo funcional apagado se elimina', en: 'Same as ac_wl and ac_wlm, in case local storage is cleared; removed if you turn functional off' } },
  { name: 'agentceo_lead_<recurso>', type: ls, category: fun, duration: { es: 'Hasta que la borres', en: 'Until you clear it' }, purpose: { es: 'Recordar que ya desbloqueaste un recurso (no guarda tu correo)', en: 'Remember that you already unlocked a resource (does not store your email)' } },
  { name: 'ac_chat', type: ls, category: fun, duration: { es: '7 días', en: '7 days' }, purpose: { es: 'Guardar tu conversación con el asistente de IA en tu navegador', en: 'Keep your conversation with the AI assistant in your browser' } },
  // ⏳ Revisión de abogado: es funcional (no imprescindible); vive solo en la pestaña y solo sale si te apuntas.
  { name: 'ac_attr', type: ss, category: fun, duration: session, purpose: { es: 'Recordar de qué campaña llegaste; solo se envía si te apuntas a la lista', en: 'Remember which campaign brought you; only sent if you join the waitlist' } },
  { name: 'ac_sticky · ac_exit · ac_tease', type: ss, category: fun, duration: session, purpose: { es: 'No volver a mostrarte avisos que ya cerraste', en: 'Not show you again notices you already closed' } },
]
