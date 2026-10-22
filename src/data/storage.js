// ─────────────────────────────────────────────────────────────────────────────
// INVENTARIO de lo que esta WEB guarda en el navegador (cookies y almacenamiento local).
// FUENTE ÚNICA para /legal/cookies. Un test exige que cada clave usada en src/ esté aquí.
// Analítica: NINGUNA (decisión de Diego, 2026-10-20).
// ─────────────────────────────────────────────────────────────────────────────
const nec = { es: 'Necesaria', en: 'Necessary', pt: 'Necessário' }
const fun = { es: 'Funcional', en: 'Functional', pt: 'Funcional' }
const cookie = { es: 'Cookie propia', en: 'First-party cookie', pt: 'Cookie próprio' }
const ls = { es: 'Almacenamiento local', en: 'Local storage', pt: 'Armazenamento local' }
const ss = { es: 'Almacenamiento de sesión', en: 'Session storage', pt: 'Armazenamento de sessão' }
const session = { es: 'Hasta cerrar la pestaña', en: 'Until the tab is closed', pt: 'Até fechar a aba' }

export const STORAGE = [
  { name: 'consent', type: cookie, category: nec, duration: { es: '12 meses', en: '12 months', pt: '12 meses' }, purpose: { es: 'Recordar tus preferencias de cookies y tu solicitud de no vender ni compartir (incluida la señal GPC)', en: 'Remember your cookie choices and your do-not-sell-or-share request (including the GPC signal)', pt: 'Lembrar suas preferências de cookies e sua solicitação de não vender nem compartilhar (incluindo o sinal GPC)' } },
  { name: 'lang', type: cookie, category: fun, duration: { es: '12 meses', en: '12 months', pt: '12 meses' }, purpose: { es: 'Recordar el idioma que elegiste', en: 'Remember the language you chose', pt: 'Lembrar o idioma que você escolheu' } },
  // T60: además del indicador, el correo ENMASCARADO (j***@g***.com) para decirte «ya estás en la lista con …».
  { name: 'ac_wl', type: ls, category: fun, duration: { es: 'Hasta que la borres', en: 'Until you clear it', pt: 'Até você apagar' }, purpose: { es: 'Recordar que ya te apuntaste a la lista, para no volver a pedirte el correo (no guarda tu correo)', en: 'Remember that you already joined the waitlist so we don\'t ask for your email again (does not store your email)', pt: 'Lembrar que você já entrou na lista de espera, para não pedir seu e-mail de novo (não guarda seu e-mail)' } },
  { name: 'ac_wlm', type: ls, category: fun, duration: { es: 'Hasta que la borres', en: 'Until you clear it', pt: 'Até você apagar' }, purpose: { es: 'Tu correo ENMASCARADO (p. ej. j***@g***.com), para recordarte con qué correo te apuntaste; nunca el correo entero', en: 'Your MASKED email (e.g. j***@g***.com), to remind you which email you signed up with; never the full email', pt: 'Seu e-mail MASCARADO (por ex. j***@g***.com), para lembrar com qual e-mail você se inscreveu; nunca o e-mail completo' } },
  { name: 'ac_wl (cookie)', type: cookie, category: fun, duration: { es: '12 meses', en: '12 months', pt: '12 meses' }, purpose: { es: 'Lo mismo que ac_wl y ac_wlm, por si se borra el almacenamiento local; con lo funcional apagado se elimina', en: 'Same as ac_wl and ac_wlm, in case local storage is cleared; removed if you turn functional off', pt: 'O mesmo que ac_wl e ac_wlm, caso o armazenamento local seja apagado; é removido se você desligar os funcionais' } },
  { name: 'agentceo_lead_<recurso>', type: ls, category: fun, duration: { es: 'Hasta que la borres', en: 'Until you clear it', pt: 'Até você apagar' }, purpose: { es: 'Recordar que ya desbloqueaste un recurso (no guarda tu correo)', en: 'Remember that you already unlocked a resource (does not store your email)', pt: 'Lembrar que você já desbloqueou um recurso (não guarda seu e-mail)' } },
  { name: 'ac_chat', type: ls, category: fun, duration: { es: '7 días', en: '7 days', pt: '7 dias' }, purpose: { es: 'Guardar tu conversación con el asistente de IA en tu navegador', en: 'Keep your conversation with the AI assistant in your browser', pt: 'Guardar sua conversa com o assistente de IA no seu navegador' } },
  // ⏳ Revisión de abogado: es funcional (no imprescindible); vive solo en la pestaña y solo sale si te apuntas.
  { name: 'ac_attr', type: ss, category: fun, duration: session, purpose: { es: 'Recordar de qué campaña llegaste; solo se envía si te apuntas a la lista', en: 'Remember which campaign brought you; only sent if you join the waitlist', pt: 'Lembrar de qual campanha você veio; só é enviado se você entrar na lista de espera' } },
  { name: 'ac_sticky · ac_exit · ac_tease', type: ss, category: fun, duration: session, purpose: { es: 'No volver a mostrarte avisos que ya cerraste', en: 'Not show you again notices you already closed', pt: 'Não mostrar de novo os avisos que você já fechou' } },
]
