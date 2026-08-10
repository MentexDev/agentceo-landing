// ─────────────────────────────────────────────────────────────────────────────
// Blog de AgentCEO — contenido PROPIO de marca.
//
// Guías y ensayos originales para dueños de negocio que quieren operar con IA.
// A diferencia de Noticias, aquí la voz es nuestra; cuando se citan datos, van
// con su referencia real (misma disciplina anti-fake).
//
// Para publicar: agrega al array ITEMS y corre `npm run build`.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Blog · AgentCEO',
  eyebrow: 'Blog',
  h1: 'Ideas para operar tu negocio con IA.',
  sub: 'Guías claras, sin jerga, para dueños de negocio que quieren delegar de verdad —no aprender a programar.',
}

export const CATEGORIES = ['Fundamentos', 'Automatización', 'Estrategia']

export const ITEMS = [
  {
    slug: 'que-es-un-agente-de-ia',
    title: 'Qué es realmente un agente de IA (y por qué no es un chatbot)',
    category: 'Fundamentos',
    dateISO: '2026-08-07',
    featured: true,
    readMinutes: 4,
    excerpt: 'Un chatbot responde. Un agente actúa. La diferencia no es técnica: es la que separa “tener una herramienta” de “tener a alguien que hace el trabajo”.',
    body: [
      { type: 'p', text: 'Cuando alguien dice “inteligencia artificial”, casi siempre imagina un chatbot: le escribes una pregunta, te da una respuesta. Útil, pero pasivo. Un **agente de IA** es otra cosa: no espera a que le preguntes, ejecuta una tarea de principio a fin.' },
      { type: 'h', text: 'La diferencia, en una frase' },
      { type: 'p', text: 'Un chatbot te dice **cómo** hacer algo. Un agente lo **hace**. Le encargas “prepara el reporte de ventas de esta semana y mándamelo”, y el agente busca los datos, arma el reporte, lo revisa y te lo entrega —sin que tú toques cada paso.' },
      { type: 'h', text: 'Qué hace “agente” a un agente' },
      { type: 'ul', items: [
        '**Persigue un objetivo**, no solo responde un mensaje: descompone el encargo en pasos.',
        '**Usa herramientas**: se conecta a tu tienda, tu WhatsApp, tu inventario, y actúa ahí.',
        '**Trabaja solo**: puede seguir aunque tú cierres la computadora.',
        '**Aprende tu contexto**: recuerda tus preferencias y cómo te gusta el trabajo.',
      ] },
      { type: 'h', text: 'Por qué te importa como dueño' },
      { type: 'p', text: 'La pregunta deja de ser “¿qué le pregunto a la IA?” y pasa a ser “¿qué le delego?”. Es el salto de tener una herramienta a tener un equipo. Y ese equipo no reemplaza tu criterio: lo libera para lo que de verdad requiere tu atención.' },
    ],
  },
  {
    slug: 'primeras-tareas-para-delegar-a-un-agente',
    title: 'Las primeras tareas que deberías delegar a un agente (y las que no)',
    category: 'Automatización',
    dateISO: '2026-08-06',
    readMinutes: 5,
    excerpt: 'No empieces por lo más difícil ni por lo más delicado. Empieza por lo repetitivo, lo que odias hacer y lo que no requiere tu criterio.',
    body: [
      { type: 'p', text: 'El error más común al automatizar es empezar por lo más vistoso. Lo que de verdad funciona es empezar por lo **repetitivo y de bajo riesgo**: tareas que haces casi igual cada semana y que no dependen de tu criterio.' },
      { type: 'h', text: 'Buenas candidatas para delegar primero' },
      { type: 'ul', items: [
        '**Reportes recurrentes**: ventas del día, inventario bajo, resumen de la semana.',
        '**Primeras respuestas de atención**: contestar preguntas frecuentes en WhatsApp mientras tú duermes.',
        '**Seguimiento de leads**: retomar a quien escribió y no compró.',
        '**Contenido base**: borradores de publicaciones y descripciones de producto.',
      ] },
      { type: 'h', text: 'Lo que NO deberías delegar (todavía)' },
      { type: 'ul', items: [
        'Decisiones que cambian el rumbo del negocio.',
        'Conversaciones delicadas: un cliente molesto, un tema legal o de dinero sensible.',
        'Cualquier acción irreversible sin tu aprobación (pagos, publicaciones delicadas).',
      ] },
      { type: 'h', text: 'La regla de oro' },
      { type: 'p', text: 'Automatiza la **ejecución**, conserva la **decisión**. Un buen agente hace el trabajo pesado y te deja el visto bueno final. Empieza por una sola tarea, míralo funcionar una semana y suma la siguiente. Los datos acompañan la idea: en una encuesta reciente a pymes de EE.UU., el 92% de los dueños que ya usan IA dijo que les ahorra tiempo.' },
    ],
    sources: [
      { name: 'Carrier Management — encuesta de Thryv a pymes (2026)', url: 'https://www.carriermanagement.com/news/2026/07/15/290015.htm' },
    ],
  },
  {
    slug: 'delegar-sin-perder-el-control',
    title: 'Delegar sin perder el control: por qué la aprobación humana lo cambia todo',
    category: 'Estrategia',
    dateISO: '2026-08-05',
    readMinutes: 4,
    excerpt: 'El miedo a automatizar casi nunca es a la IA: es a perder el control. La solución no es hacerlo todo tú, es aprobar lo que importa.',
    body: [
      { type: 'p', text: 'Muchos dueños dudan en delegar a un agente por una razón legítima: **“¿y si hace algo que yo no habría hecho?”**. Es la pregunta correcta. La respuesta no es evitar la IA, es diseñar el control adecuado.' },
      { type: 'h', text: 'Ejecutar no es decidir' },
      { type: 'p', text: 'Un buen agente separa dos cosas que solemos mezclar: **hacer el trabajo** y **decidir que se publique, se envíe o se pague**. El agente hace; tú apruebas lo que tiene consecuencias. Nada importante sale sin tu firma.' },
      { type: 'p', text: 'No es una idea nuestra en el vacío. Cuando Anthropic lanzó su paquete de agentes para pequeñas empresas, el diseño central era justo ese: el agente prepara la nómina, la conciliación o la campaña, pero **pide la aprobación del dueño antes de ejecutar**.' },
      { type: 'h', text: 'Cómo se ve en la práctica' },
      { type: 'ul', items: [
        'El agente te muestra lo que va a hacer, no solo lo que ya hizo.',
        'Tú apruebas con un clic —o pides cambios.',
        'Lo rutinario y reversible puede correr solo; lo delicado espera tu visto bueno.',
      ] },
      { type: 'p', text: 'Así delegas de verdad sin soltar el timón. El control no está en tocar cada tecla: está en decidir qué merece tu atención.' },
    ],
    sources: [
      { name: 'PYMNTS — Anthropic lanza Claude for Small Business', url: 'https://www.pymnts.com/artificial-intelligence-2/2026/anthropic-launches-claude-ai-agents-for-small-business-finance/' },
    ],
  },
  {
    slug: 'tus-clientes-le-preguntan-a-la-ia-que-comprar',
    title: 'Tus clientes ya le preguntan a la IA qué comprar. ¿Tu negocio aparece?',
    category: 'Estrategia',
    dateISO: '2026-08-06',
    readMinutes: 4,
    excerpt: 'El escaparate se está moviendo. Cada vez más gente no busca en Google: le pregunta a un asistente de IA. Y la IA decide qué tiendas mostrar.',
    body: [
      { type: 'p', text: 'Durante veinte años, “que te encuentren” significó aparecer en Google. Eso está cambiando. Cada vez más personas le preguntan directamente a un asistente de IA qué producto comprar, y es la IA la que decide qué tiendas recomendar.' },
      { type: 'p', text: 'No es una predicción: ya pasa a escala. En su reporte del segundo trimestre de 2026, **Shopify** informó que el tráfico a las tiendas desde canales de IA se **triplicó** en un año, y que los compradores nuevos que llegan por IA convierten al doble de la tasa de los canales tradicionales.' },
      { type: 'h', text: 'Qué significa para un negocio pequeño' },
      { type: 'ul', items: [
        'Tu información de producto (nombre, descripción, precio, disponibilidad) tiene que estar **clara y actualizada**: ahora la lee una IA, no solo una persona.',
        'Responder rápido y bien en tus canales empieza a pesar más: la IA premia lo que funciona.',
        'La atención deja de tener “horario de oficina”: quien pregunta a las 11 de la noche espera respuesta.',
      ] },
      { type: 'h', text: 'La buena noticia' },
      { type: 'p', text: 'No necesitas un equipo de tecnología para esto. Necesitas que tu operación —catálogo, atención, seguimiento— esté ordenada y despierta. Justo lo que un equipo de agentes puede sostener por ti.' },
    ],
    sources: [
      { name: 'Investing.com — Resultados Q2 2026 de Shopify', url: 'https://ca.investing.com/news/company-news/shopify-q2-2026-slides-ai-commerce-drives-3x-traffic-surge-93CH-4777963' },
    ],
  },
]
