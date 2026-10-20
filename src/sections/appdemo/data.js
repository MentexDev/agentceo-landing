// ─────────────────────────────────────────────────────────────────────────────
// S03 «Así se ve por dentro» · TEXTOS Y DATOS de la recreación de la app real.
// · Los textos de la interfaz son LITERALES de la app (CRM-AI-evolution/apps/web, leída en
//   solo lectura el 2026-10-20: AdminLayout, Agents/chat, Biblioteca, Approvals, PanoramaEmpresa,
//   PedidosDeVentas, ClientesDirectorio). La app no tiene i18n: el inglés es traducción nuestra.
// · TODOS los datos son INVENTADOS para una marca de ejemplo («Lúa», ropa cómoda para mujer en
//   Colombia, coherente con el resto de la portada). Nunca datos reales de clientes: los
//   fixtures con conversaciones reales de la app NO se leyeron ni se copiaron.
// ─────────────────────────────────────────────────────────────────────────────
export const VIEWS = ['chat', 'aprobaciones', 'biblioteca', 'panel', 'ventas', 'clientes']
export const SIDE_OF = { chat: 'trabajo', aprobaciones: 'trabajo', biblioteca: 'trabajo', panel: 'empresa', ventas: 'empresa', clientes: 'empresa' }
export const URL_OF = { chat: 'agentes/ceo-global', aprobaciones: 'aprobaciones', biblioteca: 'biblioteca', panel: 'company', ventas: 'ventas', clientes: 'clientes' }

const es = {
  eyebrow: 'Por dentro',
  h2a: 'Así se ve ',
  h2b: 'tu empresa por dentro.',
  sub: 'Así es la app de verdad. Toca el menú y recórrela.',
  note: 'Demostración con datos inventados de una marca de ejemplo.',
  demoLabel: 'Demostración de la app de Agent CEO',
  tabsLabel: 'Pantallas de la app',
  tabs: { chat: 'Chat con tu CEO', aprobaciones: 'Aprobaciones', biblioteca: 'Biblioteca', panel: 'Panel de Comando', ventas: 'Ventas', clientes: 'Clientes' },
  play: 'Reproducir el recorrido',
  pause: 'Pausar el recorrido',
  sideLabel: 'Barra lateral',
  trabajo: 'Trabajo',
  empresa: 'Empresa',
  trabajoTitle: 'Trabajo · tus agentes y tus conversaciones',
  empresaTitle: 'Empresa · cómo está tu negocio',
  search: 'Buscar en todo el negocio',
  nav: { nueva: 'Nueva tarea', agentes: 'Agentes', tareas: 'Tareas', aprobaciones: 'Aprobaciones', biblioteca: 'Biblioteca', automatizaciones: 'Automatizaciones', empresa: 'Empresa', avanzado: 'AVANZADO' },
  agentsHead: 'AGENTES',
  agents: ['CEO Global', 'Inventarista', 'Creador de Contenido', 'Vendedor WhatsApp'],
  empresaNav: { panel: 'Panel de Comando', equipo: 'Equipo', marcas: 'Marcas', portafolio: 'Portafolio', salud: 'Salud', atencion: 'Atención', marketing: 'Marketing', ventas: 'Ventas', clientes: 'Clientes', finanzas: 'Finanzas', inventario: 'Inventario', envios: 'Envíos' },
  user: { name: 'Valentina M.', role: 'Dueña', status: 'En línea', initials: 'VM' },
  company: { name: 'Casa Lúa', plan: 'Plan Impulso' },
  brand: { general: 'General', generalFoot: 'la empresa', items: ['Lúa', 'Lúa Casa'], nueva: '+ Nueva marca', current: 'Lúa' },
  // Chat
  ceo: 'CEO Global',
  you: 'Tú',
  // Mensaje ANTERIOR, siempre visible (T35 · adenda: S03 «se veía vacía»: la escena arrancaba sin
  // nada y se rellenaba poco a poco; tampoco el HTML del servidor traía contenido).
  earlierDay: 'Ayer',
  earlier: 'Buenos días, Valentina ☀️ Ayer cerramos **12 ventas** por WhatsApp y el post del martes llegó a **3.400 personas**. Hoy preparo lo del pijama nuevo; lo importante te lo pregunto.',
  userMsg: '¿Cómo vamos esta semana? Prepara el post del pijama nuevo.',
  thinking: ['Entendiendo lo que pediste…', 'Revisando el resultado…', 'Casi listo…'],
  steps: [
    { fam: 'datos', run: 'Revisando las ventas de la semana', done: 'Revisó las ventas de la semana', cost: 2 },
    { fam: 'web', run: 'Buscando en la web', done: 'Buscó en la web', cost: 3 },
    { fam: 'imagen', run: 'Generando una imagen', done: 'Generó una imagen', cost: 12 },
  ],
  stepsHead: 'Trabajo del agente',
  stepsLive: 'Pensando el siguiente paso…',
  stepsWriting: 'Escribiendo la respuesta…',
  stepsDone: '{n} pasos · {s} s',
  credits: '−{n} créditos',
  reply: '**Vamos bien:** 38 pedidos esta semana, un 12 % más que la anterior, y COP 4,2 M facturados.\n- El pijama de algodón es lo más vendido.\n- Dejé el post listo en la Biblioteca. **Necesita tu firma** para publicarse.',
  composer: 'Escríbele a CEO Global…',
  send: 'Enviar (Enter)',
  attach: 'Adjuntar',
  chips: ['¿Qué está funcionando en redes?', '¿Qué publicamos esta semana?'],
  // Aprobaciones
  apTitle: 'Esperan tu firma',
  apSub: 'Lo que tus agentes dejaron listo y no ejecutan sin ti.',
  apPending: '{n} pendientes',
  apRows: [
    { glyph: 'crown', title: 'Publicar el post del pijama de algodón', who: 'CEO Global · de una tarea en marcha', risk: 'Reversible', riskTone: 'ok', kind: 'Publicación', act: 'Firmar', when: 'hace 2 min' },
    { glyph: 'sparkles', title: 'Pedir 40 camisetas negras al proveedor', who: 'Inventarista · de una tarea en marcha', risk: 'Mueve dinero', riskTone: 'warn', noUndo: 'No tiene vuelta', kind: 'Gasto', amount: 'COP 1.120.000', act: 'Revisar', when: 'hace 14 min' },
    { glyph: 'bot', title: 'Responder a la clienta de la devolución', who: 'Vendedor WhatsApp · sin tarea', risk: 'Sin riesgo', riskTone: 'ok', kind: 'Entrega', act: 'Aceptar', alt: 'Descartar', when: 'hace 31 min' },
  ],
  signed: 'Firmada',
  undo: 'Deshacer',
  // Biblioteca
  libTitle: 'La biblioteca',
  libSub: 'Todo lo que tu empresa ha producido, en un solo sitio.',
  libKpis: ['Total assets', 'Esta semana', 'Última actividad', 'Almacenamiento'],
  libNew: '+{n} nuevos',
  libLast: 'hace 1 min',
  libStorage: '1,4 GB',
  libSearch: 'Buscar por título o contenido…',
  libCards: [
    { kind: 'Imagen', tone: 'pink', title: 'Post · Pijama de algodón', who: 'Creador de Contenido', fresh: true },
    { kind: 'Hoja de cálculo', tone: 'emerald', title: 'Reporte semanal de ventas', who: 'CEO Global' },
    { kind: 'Correo', tone: 'violet', title: 'Carritos abandonados · octubre', who: 'Vendedor WhatsApp' },
    { kind: 'Presentación', tone: 'amber', title: 'Catálogo de temporada', who: 'Creador de Contenido' },
    { kind: 'Documento', tone: 'sky', title: 'Guion del reel de lanzamiento', who: 'Creador de Contenido' },
    { kind: 'Video', tone: 'rose', title: 'Lookbook en 30 segundos', who: 'Creador de Contenido' },
  ],
  // Panel de Comando
  cmdTitle: 'Panel de Comando',
  cmd: {
    ventas: { t: 'Ventas · 14 días', a: 'pedidos confirmados', b: 'facturado', act: 'Ver los {n}' },
    clientes: { t: 'Clientes', a: 'clientes', b: 'nuevos · 30 días', meta: 'creciendo' },
    caja: { t: 'La caja', a: 'entró este mes', b: 'salió este mes', c: 'por cobrar' },
    productos: { t: 'Tus productos', a: 'en uso', b: 'publicados', c: 'construyéndose' },
  },
  // Ventas
  salesTitle: 'Todas las ventas',
  salesKpis: ['Vendido', 'Pedidos', 'Ticket promedio', 'Sin cobrar'],
  salesCols: ['Pedido', 'Cliente', 'Origen', 'Total', 'Cobro', 'Entrega'],
  paid: 'Pagado', pending: 'Por cobrar', toShip: 'Por despachar', shipped: 'Enviado',
  // Clientes
  clientsTitle: 'Clientes',
  clientsKpis: ['Clientes', 'Nuevos · 30 días', 'Contactables', 'Sin clasificar'],
  clientsCols: ['Cliente', 'Tipo', 'Email', 'Creado por'],
  clientTypes: { frecuente: 'Frecuente', nueva: 'Nueva', mayorista: 'Mayorista' },
}

const en = {
  eyebrow: 'Inside',
  h2a: 'This is what ',
  h2b: 'your company looks like inside.',
  sub: "This is the real app. Tap the menu and look around.",
  note: 'Demo with made-up data from a sample brand.',
  demoLabel: 'Agent CEO app demo',
  tabsLabel: 'App screens',
  tabs: { chat: 'Chat with your CEO', aprobaciones: 'Approvals', biblioteca: 'Library', panel: 'Command Center', ventas: 'Sales', clientes: 'Customers' },
  play: 'Play the tour',
  pause: 'Pause the tour',
  sideLabel: 'Sidebar',
  trabajo: 'Work',
  empresa: 'Company',
  trabajoTitle: 'Work · your agents and your conversations',
  empresaTitle: 'Company · how your business is doing',
  search: 'Search the whole business',
  nav: { nueva: 'New task', agentes: 'Agents', tareas: 'Tasks', aprobaciones: 'Approvals', biblioteca: 'Library', automatizaciones: 'Automations', empresa: 'Company', avanzado: 'ADVANCED' },
  agentsHead: 'AGENTS',
  agents: ['Global CEO', 'Inventory Keeper', 'Content Creator', 'WhatsApp Seller'],
  empresaNav: { panel: 'Command Center', equipo: 'Team', marcas: 'Brands', portafolio: 'Portfolio', salud: 'Health', atencion: 'Support', marketing: 'Marketing', ventas: 'Sales', clientes: 'Customers', finanzas: 'Finance', inventario: 'Inventory', envios: 'Shipping' },
  user: { name: 'Valentina M.', role: 'Owner', status: 'Online', initials: 'VM' },
  company: { name: 'Casa Lúa', plan: 'Impulso plan' },
  brand: { general: 'General', generalFoot: 'the company', items: ['Lúa', 'Lúa Casa'], nueva: '+ New brand', current: 'Lúa' },
  ceo: 'Global CEO',
  you: 'You',
  earlierDay: 'Yesterday',
  earlier: "Good morning, Valentina ☀️ Yesterday we closed **12 sales** on WhatsApp and Tuesday's post reached **3,400 people**. Today I'm on the new pajamas; anything important, I'll ask you first.",
  userMsg: 'How are we doing this week? Get the post for the new pajamas ready.',
  thinking: ['Understanding what you asked…', 'Reviewing the result…', 'Almost done…'],
  steps: [
    { fam: 'datos', run: "Reviewing this week's sales", done: "Reviewed this week's sales", cost: 2 },
    { fam: 'web', run: 'Searching the web', done: 'Searched the web', cost: 3 },
    { fam: 'imagen', run: 'Generating an image', done: 'Generated an image', cost: 12 },
  ],
  stepsHead: "Agent's work",
  stepsLive: 'Thinking about the next step…',
  stepsWriting: 'Writing the answer…',
  stepsDone: '{n} steps · {s} s',
  credits: '−{n} credits',
  reply: "**We're doing well:** 38 orders this week, 12% more than last week, and COP 4.2M billed.\n- The cotton pajamas are the best seller.\n- I left the post ready in the Library. **It needs your sign-off** to be published.",
  composer: 'Write to Global CEO…',
  send: 'Send (Enter)',
  attach: 'Attach',
  chips: ["What's working on social media?", 'What are we posting this week?'],
  apTitle: 'Waiting for your sign-off',
  apSub: "What your agents left ready and won't run without you.",
  apPending: '{n} pending',
  apRows: [
    { glyph: 'crown', title: 'Publish the cotton pajamas post', who: 'Global CEO · from a running task', risk: 'Reversible', riskTone: 'ok', kind: 'Post', act: 'Sign', when: '2 min ago' },
    { glyph: 'sparkles', title: 'Order 40 black T-shirts from the supplier', who: 'Inventory Keeper · from a running task', risk: 'Moves money', riskTone: 'warn', noUndo: 'No way back', kind: 'Spend', amount: 'COP 1,120,000', act: 'Review', when: '14 min ago' },
    { glyph: 'bot', title: 'Reply to the customer about her return', who: 'WhatsApp Seller · no task', risk: 'No risk', riskTone: 'ok', kind: 'Delivery', act: 'Accept', alt: 'Discard', when: '31 min ago' },
  ],
  signed: 'Signed',
  undo: 'Undo',
  libTitle: 'The library',
  libSub: 'Everything your company has produced, in one place.',
  libKpis: ['Total assets', 'This week', 'Last activity', 'Storage'],
  libNew: '+{n} new',
  libLast: '1 min ago',
  libStorage: '1.4 GB',
  libSearch: 'Search by title or content…',
  libCards: [
    { kind: 'Image', tone: 'pink', title: 'Post · Cotton pajamas', who: 'Content Creator', fresh: true },
    { kind: 'Spreadsheet', tone: 'emerald', title: 'Weekly sales report', who: 'Global CEO' },
    { kind: 'Email', tone: 'violet', title: 'Abandoned carts · October', who: 'WhatsApp Seller' },
    { kind: 'Presentation', tone: 'amber', title: 'Seasonal catalog', who: 'Content Creator' },
    { kind: 'Document', tone: 'sky', title: 'Launch reel script', who: 'Content Creator' },
    { kind: 'Video', tone: 'rose', title: 'Lookbook in 30 seconds', who: 'Content Creator' },
  ],
  cmdTitle: 'Command Center',
  cmd: {
    ventas: { t: 'Sales · 14 days', a: 'confirmed orders', b: 'billed', act: 'See all {n}' },
    clientes: { t: 'Customers', a: 'customers', b: 'new · 30 days', meta: 'growing' },
    caja: { t: 'Cash', a: 'came in this month', b: 'went out this month', c: 'receivable' },
    productos: { t: 'Your products', a: 'in use', b: 'published', c: 'being built' },
  },
  salesTitle: 'All sales',
  salesKpis: ['Sold', 'Orders', 'Average ticket', 'Unpaid'],
  salesCols: ['Order', 'Customer', 'Source', 'Total', 'Payment', 'Delivery'],
  paid: 'Paid', pending: 'Unpaid', toShip: 'To ship', shipped: 'Shipped',
  clientsTitle: 'Customers',
  clientsKpis: ['Customers', 'New · 30 days', 'Reachable', 'Unclassified'],
  clientsCols: ['Customer', 'Type', 'Email', 'Created by'],
  clientTypes: { frecuente: 'Repeat', nueva: 'New', mayorista: 'Wholesale' },
}

export const DICT = { es, en }

// Datos de ejemplo (inventados). Pedidos y clientas con nombre + inicial y correos @example.com.
export const ORDERS = [
  { id: '#1075', who: 'Camila R.', src: 'WhatsApp', total: 129000, pay: 'paid', ship: 'toShip', fresh: true },
  { id: '#1074', who: 'Mariana G.', src: 'Tienda', total: 98000, pay: 'paid', ship: 'shipped' },
  { id: '#1073', who: 'Laura P.', src: 'WhatsApp', total: 214000, pay: 'pending', ship: 'toShip' },
  { id: '#1072', who: 'Sofía T.', src: 'Instagram', total: 76000, pay: 'paid', ship: 'shipped' },
  { id: '#1071', who: 'Daniela V.', src: 'Tienda', total: 152000, pay: 'paid', ship: 'shipped' },
]
export const CLIENTS = [
  { who: 'Camila R.', type: 'nueva', email: 'camila.r@example.com', by: 1, fresh: true },
  { who: 'Mariana G.', type: 'frecuente', email: 'mariana.g@example.com', by: 3 },
  { who: 'Laura P.', type: 'frecuente', email: 'laura.p@example.com', by: 3 },
  { who: 'Boutique Ámbar', type: 'mayorista', email: 'compras@example.com', by: 1 },
  { who: 'Sofía T.', type: 'nueva', email: 'sofia.t@example.com', by: 3 },
]
// Métricas: [antes, después] — suben al terminar la escena (una venta nueva entra).
export const METRICS = {
  pedidos14: [71, 74], facturado14: [8.1, 8.4], clientes: [1284, 1291], nuevos30: [96, 103],
  entro: [12.6, 12.7], salio: [7.9, 7.9], porCobrar: [1.1, 1.1],
  enUso: [3, 3], publicados: [2, 3], construyendo: [1, 0],
  vendido: [8.1, 8.4], pedidos: [73, 74], ticket: [111000, 113500], sinCobrar: [1.1, 1.1],
  contactables: [1176, 1180], sinClasificar: [22, 22],
  assets: [128, 129], semana: [11, 12],
}
