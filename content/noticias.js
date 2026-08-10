// ─────────────────────────────────────────────────────────────────────────────
// Noticias de IA para dueños de negocio · AgentCEO
//
// Contenido CURADO y VERIFICADO (método NeuralOS): cada nota se investigó con
// agentes y se contrastó abriendo su FUENTE PRIMARIA antes de publicarse.
// Regla anti-fake: si un dato no se pudo confirmar en la fuente, no entra.
//
// Para publicar una nota nueva: agrégala al array ITEMS y corre `npm run build`.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Noticias de IA para tu negocio · AgentCEO',
  eyebrow: 'Noticias',
  h1: 'Lo que pasa en IA, traducido a tu negocio.',
  sub: 'Filtramos el ruido: solo las novedades de inteligencia artificial que de verdad cambian cómo operas tu empresa. Cada nota, con su fuente a la vista y verificada.',
}

export const CATEGORIES = ['Modelos', 'Herramientas', 'Agentes', 'Industria']

export const ITEMS = [
  // ── DESTACADA ──────────────────────────────────────────────────────────────
  {
    slug: 'shopify-comercio-agentico-q2-2026',
    title: 'Shopify crece 34% y lo atribuye al “comercio agéntico”: las compras vía IA se triplican',
    category: 'Industria',
    dateISO: '2026-08-05',
    featured: true,
    readMinutes: 3,
    excerpt: 'El tráfico y los pedidos que llegan desde asistentes de IA se multiplicaron por tres en un año. Tus clientes ya no solo buscan en Google: le preguntan a una IA qué comprar.',
    body: [
      { type: 'p', text: 'Shopify presentó sus resultados del segundo trimestre de 2026 con ingresos de **3.583 millones de dólares**, un 34% más que el año anterior, y un volumen de ventas (GMV) de **115.570 millones** (+32%). Es su quinto trimestre seguido creciendo el GMV por encima del 30%.' },
      { type: 'p', text: 'La compañía atribuyó buena parte del impulso al **comercio agéntico**: el tráfico que llega a las tiendas desde canales de IA se triplicó frente al año pasado, y los pedidos originados en búsquedas hechas con IA también se multiplicaron por tres.' },
      { type: 'h', text: 'Por qué te importa' },
      { type: 'p', text: 'Durante años, “aparecer en Google” fue la puerta de entrada de clientes. Ahora se abre otra: cada vez más gente le pregunta directamente a un asistente de IA qué producto comprar, y la IA decide qué tiendas mostrar. Para un comercio, estar bien presentado en esos canales deja de ser futurista y empieza a ser un frente de ventas real.' },
      { type: 'ul', items: [
        'Ingresos de 3.583 M USD (+34%) y GMV de 115.570 M USD (+32%) en el Q2 2026.',
        'El tráfico desde canales de IA a las tiendas se triplicó interanual.',
        'Los compradores nuevos que llegan por IA convierten al doble de la tasa de los canales tradicionales.',
        'La acción de Shopify subió 18,4% tras el reporte.',
      ] },
    ],
    source: { name: 'Investing.com — Resultados Q2 2026 de Shopify', url: 'https://ca.investing.com/news/company-news/shopify-q2-2026-slides-ai-commerce-drives-3x-traffic-surge-93CH-4777963' },
    sources: [
      { name: 'Investing.com — Resultados Q2 2026 de Shopify', url: 'https://ca.investing.com/news/company-news/shopify-q2-2026-slides-ai-commerce-drives-3x-traffic-surge-93CH-4777963' },
      { name: 'Shopify Newsroom — Q2 2026 financial results', url: 'https://www.shopify.com/news/shopify-q2-2026-financial-results' },
    ],
  },

  // ── MODELOS ──────────────────────────────────────────────────────────────
  {
    slug: 'anthropic-claude-opus-5',
    title: 'Anthropic lanza Claude Opus 5: potencia de frontera a la mitad del precio',
    category: 'Modelos',
    dateISO: '2026-07-24',
    readMinutes: 2,
    excerpt: 'El nuevo modelo se acerca a lo más avanzado de Anthropic pero cuesta la mitad. Automatizar tareas complejas —análisis, redacción, soporte— se vuelve más barato.',
    body: [
      { type: 'p', text: 'Anthropic presentó **Claude Opus 5**, un modelo que, según la compañía, se acerca a la inteligencia de su modelo más avanzado (Claude Fable 5) en muchas tareas, pero por la mitad del precio. Quedó disponible de inmediato en todas sus plataformas.' },
      { type: 'p', text: 'El precio se mantiene en 5 dólares por millón de tokens de entrada y 25 por millón de salida (lo mismo que Opus 4.8), y trae un modo “Fast” unas 2,5 veces más rápido al doble del precio base. Destaca especialmente en programación, resolución de problemas e investigación.' },
      { type: 'h', text: 'Por qué te importa' },
      { type: 'p', text: 'Cuando un modelo de primer nivel baja de precio, automatizar trabajo complejo deja de ser caro. Un negocio puede delegar análisis, redacción de propuestas o soporte técnico a un agente sin pagar tarifa premium por cada tarea.' },
    ],
    source: { name: 'Anthropic (blog oficial)', url: 'https://www.anthropic.com/news/claude-opus-5' },
  },
  {
    slug: 'google-gemini-modelos-eficiencia-agentes',
    title: 'Google lanza tres modelos Gemini nuevos, enfocados en eficiencia y agentes',
    category: 'Modelos',
    dateISO: '2026-07-21',
    readMinutes: 2,
    excerpt: 'Gemini 3.6 Flash y dos variantes más, pensadas para bajar el costo y la latencia de las automatizaciones de alto volumen. Modelos más baratos = tareas más baratas.',
    body: [
      { type: 'p', text: 'Google publicó tres modelos Gemini nuevos —3.6 Flash, 3.5 Flash-Lite y 3.5 Flash Cyber— orientados a eficiencia, baja latencia y confiabilidad para quienes construyen agentes de IA a escala. Notablemente, no incluyó el esperado Gemini 3.5 Pro, al parecer retrasado por temas de rendimiento.' },
      { type: 'p', text: 'El **3.6 Flash** es el modelo “de trabajo”, con mejor código y hasta 17% menos uso de tokens que su antecesor, lo que lo abarata. El **Flash-Lite** es el más económico de su clase, para automatización de alto volumen, y el **Flash Cyber** se especializa en hallar y corregir vulnerabilidades (acceso limitado, en piloto).' },
      { type: 'h', text: 'Por qué te importa' },
      { type: 'p', text: 'Modelos más baratos y rápidos bajan el costo por tarea. Eso permite operar automatizaciones de alto volumen —clasificar mensajes, responder consultas, dar seguimiento— sin que el gasto se dispare a medida que creces.' },
    ],
    source: { name: 'TechCrunch', url: 'https://techcrunch.com/2026/07/21/google-releases-three-new-gemini-models-but-no-3-5-pro/' },
  },

  // ── HERRAMIENTAS ─────────────────────────────────────────────────────────
  {
    slug: 'claude-modo-voz-integraciones',
    title: 'Claude renueva su modo de voz: hablas y conecta con Gmail, Calendar, Slack, Canva y Notion',
    category: 'Herramientas',
    dateISO: '2026-07-23',
    readMinutes: 2,
    excerpt: 'Ahora puedes pedirle por voz que agende una reunión o redacte un mensaje usando tus propias herramientas de trabajo, y elegir el modelo que lo hace.',
    body: [
      { type: 'p', text: 'Anthropic actualizó el modo de voz de Claude para permitir elegir entre los modelos Opus, Sonnet y Haiku (antes solo usaba Haiku) y conectarse con aplicaciones externas. Ya puedes pedir por voz que agende reuniones o redacte mensajes usando las herramientas que ya usas.' },
      { type: 'ul', items: [
        'Integra Gmail, Google Calendar, Slack, Canva y Notion para ejecutar tareas por voz.',
        'Permite escoger modelo (Opus/Sonnet/Haiku); el plan gratuito queda limitado a Haiku y a una sola app conectada.',
        'Soporta más de 10 idiomas, incluido el español.',
        'Disponible en beta para todos los usuarios y plataformas.',
      ] },
      { type: 'h', text: 'Por qué te importa' },
      { type: 'p', text: 'Operar tu día por voz —agendar, redactar correos, actualizar notas— sin tocar el teclado y conectando las herramientas que ya usas es justo el tipo de fricción que frena a un dueño no técnico. Bajarla significa más cosas resueltas en menos pasos.' },
    ],
    source: { name: 'TechCrunch', url: 'https://techcrunch.com/2026/07/23/anthropic-updates-claude-voice-mode-with-more-capable-models/' },
  },

  // ── AGENTES ──────────────────────────────────────────────────────────────
  {
    slug: 'openai-chatgpt-work-agente',
    title: 'OpenAI lanza “ChatGPT Work”: un agente que ejecuta tareas de oficina de principio a fin',
    category: 'Agentes',
    dateISO: '2026-07-09',
    readMinutes: 3,
    excerpt: 'No solo responde: toma un encargo completo y lo termina —hojas de cálculo, presentaciones, documentos— aunque estés desconectado. Y llega con un programa de formación para pequeñas empresas.',
    body: [
      { type: 'p', text: 'OpenAI presentó **ChatGPT Work**, un agente impulsado por el modelo GPT-5.6 que no solo responde preguntas: toma una tarea completa y la ejecuta a lo largo de varias horas, incluso mientras el usuario está desconectado. Produce hojas de cálculo, presentaciones, documentos y hasta aplicaciones web terminadas.' },
      { type: 'p', text: 'En paralelo, la compañía lanzó **“ChatGPT para Pequeñas Empresas”**, con recursos educativos, capacitaciones en vivo y guías prácticas para que dueños de negocio no técnicos aprendan a usar la IA. El foco declarado: automatizar procesos y ganar productividad sin necesidad de programar.' },
      { type: 'h', text: 'Por qué te importa' },
      { type: 'p', text: 'Un agente que “entrega trabajo terminado” —un análisis de presupuesto, un brief de marketing— en lugar de solo dar respuestas cambia el cálculo de cuánto trabajo operativo puedes delegar sin contratar más gente.' },
      { type: 'ul', items: [
        'Descompone un encargo en pasos y los completa de forma autónoma, a través de apps y archivos.',
        'Entrega materiales terminados: hojas de cálculo, presentaciones, documentos y web apps.',
        'Disponible desde el 9 de julio para planes Pro, Enterprise y Edu; Plus y Business poco después.',
        'La app de escritorio quedó disponible de inmediato en todos los planes.',
      ] },
    ],
    source: { name: 'PYMNTS', url: 'https://www.pymnts.com/news/artificial-intelligence/2026/openai-launches-chatgpt-agent-that-executes-complex-workflows/' },
    sources: [
      { name: 'PYMNTS — OpenAI launches ChatGPT Work', url: 'https://www.pymnts.com/news/artificial-intelligence/2026/openai-launches-chatgpt-agent-that-executes-complex-workflows/' },
      { name: 'Forbes — New ChatGPT training for small businesses', url: 'https://www.forbes.com/sites/quickerbettertech/2026/07/26/new-chatgpt-training-for-small-businesses-and-other-technology-news-this-week-for-your-business/' },
    ],
  },
  {
    slug: 'anthropic-claude-for-small-business',
    title: 'Claude for Small Business: agentes prearmados para finanzas y ventas de pequeñas empresas',
    category: 'Agentes',
    dateISO: '2026-05-14',
    readMinutes: 3,
    excerpt: 'Flujos de trabajo listos para usar que meten a la IA dentro de QuickBooks, PayPal, HubSpot y más —siempre con tu aprobación antes de ejecutar. Pensado para negocios que necesitan que “funcione la primera semana”.',
    body: [
      { type: 'p', text: 'Anthropic presentó **Claude for Small Business**, un paquete de flujos de trabajo agénticos prearmados y conectores que integran a Claude dentro de QuickBooks, PayPal, HubSpot, Canva, DocuSign, Google Workspace y Microsoft 365. Cubre tareas como planificación de nómina, cobro de facturas, conciliación de fin de mes, campañas de ventas y ruteo de contratos.' },
      { type: 'p', text: 'Un punto clave: el agente **pide aprobación del dueño antes de ejecutar** cualquier acción. Incluye 15 flujos de trabajo listos para usar, 15 “skills”, un curso gratuito de fluidez en IA desarrollado con PayPal y una gira por 10 ciudades que arranca en Chicago.' },
      { type: 'h', text: 'Por qué te importa' },
      { type: 'p', text: 'Está diseñado explícitamente para negocios pequeños que, en palabras de la propia empresa, “no necesitan un comité de gobernanza para automatizar la contabilidad, necesitan que la herramienta funcione la primera semana”. Es el caso más directamente aplicable a un dueño no técnico.' },
    ],
    source: { name: 'PYMNTS', url: 'https://www.pymnts.com/artificial-intelligence-2/2026/anthropic-launches-claude-ai-agents-for-small-business-finance/' },
  },

  // ── INDUSTRIA ────────────────────────────────────────────────────────────
  {
    slug: 'ue-ley-ia-transparencia-agosto-2026',
    title: 'La Ley de IA de la UE ya exige avisar cuando un chatbot o un contenido es generado por IA',
    category: 'Industria',
    dateISO: '2026-08-02',
    readMinutes: 3,
    excerpt: 'Desde el 2 de agosto, si tu sistema habla con personas o genera imágenes, audio, video o texto, debes decir que es IA y marcar ese contenido. Con multas de hasta 15 millones de euros.',
    body: [
      { type: 'p', text: 'El 2 de agosto de 2026 empezaron a aplicarse las obligaciones de transparencia del Artículo 50 de la Ley de IA de la Unión Europea. Cualquier empresa cuyo sistema hable con personas o genere imágenes, audio, video o texto debe **avisar que es IA** y **marcar el contenido generado**, sea o no un sistema de “alto riesgo”.' },
      { type: 'ul', items: [
        'Los usuarios deben ser informados con claridad cuando interactúan con una IA y no con una persona real.',
        'El contenido generado o manipulado (incluidos los deepfakes) debe marcarse en un formato detectable por máquina.',
        'Multas de hasta 15 millones de euros o el 3% de la facturación anual mundial, lo que sea mayor.',
        'Los sistemas generativos ya en el mercado tienen hasta el 2 de diciembre de 2026 para cumplir con el marcado.',
      ] },
      { type: 'h', text: 'Por qué te importa' },
      { type: 'p', text: 'Si tu negocio usa un chatbot de atención o genera imágenes y textos con IA para vender, ahora estás legalmente obligado a avisarlo a tus clientes cuando operas o vendes hacia la UE. No es solo cumplimiento: la transparencia bien hecha también genera confianza.' },
    ],
    source: { name: 'Comisión Europea (nota oficial)', url: 'https://commission.europa.eu/news-and-media/news/safer-and-more-transparent-ai-2026-08-02_en' },
  },
  {
    slug: 'pymes-eeuu-adopcion-ia-66-formacion',
    title: 'La adopción de IA en pymes de EE.UU. sube a 66%, pero 7 de cada 10 dueños piden más formación',
    category: 'Industria',
    dateISO: '2026-07-15',
    readMinutes: 2,
    excerpt: 'La IA ya da retorno concreto en las pequeñas empresas —ingresos, tiempo, costos— pero la barrera no es comprarla: es aprender a usarla bien.',
    body: [
      { type: 'p', text: 'Una encuesta de la plataforma Thryv a 561 dueños y decisores de pequeñas y medianas empresas (todos ajenos a Thryv) muestra que la adopción de IA subió al **66%**, 11 puntos más que hace un año, y que los dueños reportan impacto real en ingresos y tiempo —aunque casi todos sienten que les falta capacitación.' },
      { type: 'ul', items: [
        'Adopción de IA en pymes al 66% (+11 puntos interanual); 86% se dice cómodo usándola.',
        '70% reporta que la IA aumentó sus ingresos el último año; 92% dice que les ahorra tiempo y 55% que redujo costos.',
        '70% de los dueños admite que necesita más formación para usarla con eficacia.',
        '46% preferiría IA antes que contratar a un nuevo empleado.',
      ] },
      { type: 'h', text: 'Por qué te importa' },
      { type: 'p', text: 'Para un dueño de pyme la IA ya está dando resultados, pero lo que separa el ahorro real del gasto no es la herramienta, es saber usarla. Invertir en capacitar al equipo rinde más que sumar otra suscripción.' },
    ],
    source: { name: 'Carrier Management (encuesta de Thryv)', url: 'https://www.carriermanagement.com/news/2026/07/15/290015.htm' },
  },
]
