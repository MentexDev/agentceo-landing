// ─────────────────────────────────────────────────────────────────────────────
// Recursos de AgentCEO — guías y plantillas descargables (lead magnet).
//
// Cada recurso muestra "qué incluye" + un gate de correo; al dejar el correo,
// se revela la guía completa (y se captura el lead en D1 vía /api/lead).
// `whatYouGet` es el gancho visible; `body` es el contenido que se desbloquea.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Recursos · AgentCEO',
  eyebrow: 'Recursos',
  h1: 'Guías y plantillas para arrancar hoy.',
  sub: 'Material práctico y gratuito para operar tu negocio con IA. Déjanos tu correo y te damos acceso completo al instante.',
}

export const CATEGORIES = ['Checklists', 'Guías', 'Plantillas']

export const ITEMS = [
  {
    slug: 'checklist-tareas-para-automatizar',
    title: '12 tareas que tu negocio puede automatizar esta semana',
    category: 'Checklists',
    dateISO: '2026-08-07',
    featured: true,
    readMinutes: 6,
    excerpt: 'Un checklist accionable para encontrar, en tu propia operación, qué delegar primero a un agente de IA —ordenado por facilidad y por impacto.',
    whatYouGet: [
      'Las 12 tareas agrupadas por área: atención, ventas, operaciones y contenido.',
      'Cuáles son de **bajo riesgo** para empezar sin miedo.',
      'Una regla simple para decidir qué **NO** automatizar todavía.',
      'Un mini-plan de 3 semanas para arrancar sin abrumarte.',
    ],
    body: [
      { type: 'p', text: 'La forma más rápida de sacarle provecho a la IA no es automatizar “todo”, es empezar por las tareas correctas: las repetitivas, las que odias hacer y las que no dependen de tu criterio. Aquí tienes 12, ordenadas por área.' },
      { type: 'h', text: 'Atención al cliente' },
      { type: 'ul', items: [
        'Responder las preguntas frecuentes (horarios, envíos, tallas, precios).',
        'Dar el primer saludo y recoger datos 24/7, aunque estés durmiendo.',
        'Enviar recordatorios y confirmaciones (citas, pedidos, pagos pendientes).',
      ] },
      { type: 'h', text: 'Ventas' },
      { type: 'ul', items: [
        'Retomar a quien escribió y no compró (seguimiento de leads).',
        'Recuperar carritos abandonados con un mensaje a tiempo.',
        'Responder consultas de precio y disponibilidad al instante.',
      ] },
      { type: 'h', text: 'Operaciones' },
      { type: 'ul', items: [
        'Armar el reporte de ventas del día y enviártelo cada mañana.',
        'Avisarte cuando un producto está por agotarse.',
        'Ordenar y clasificar mensajes o pedidos entrantes.',
      ] },
      { type: 'h', text: 'Contenido y marketing' },
      { type: 'ul', items: [
        'Escribir borradores de publicaciones para redes.',
        'Redactar descripciones de producto claras y con SEO.',
        'Preparar respuestas a reseñas y comentarios.',
      ] },
      { type: 'h', text: 'La regla para decidir qué NO automatizar (todavía)' },
      { type: 'p', text: 'Si una tarea **cambia el rumbo del negocio**, es **irreversible** (un pago, una publicación delicada) o requiere una **conversación humana sensible**, no la dejes correr sola. Automatiza la ejecución, pero deja que la decisión final pase por ti con un clic de aprobación.' },
      { type: 'h', text: 'Tu plan de 3 semanas' },
      { type: 'ul', items: [
        '**Semana 1:** elige UNA tarea de “atención” y ponla a funcionar. Obsérvala.',
        '**Semana 2:** suma una de “ventas” (seguimiento o carritos). Mide el resultado.',
        '**Semana 3:** automatiza tu reporte diario para no volver a armarlo a mano.',
      ] },
      { type: 'p', text: 'Al final de tres semanas tendrás tres cosas trabajando solas y una idea mucho más clara de qué delegar después.' },
    ],
  },
  {
    slug: 'guia-primera-instruccion-agente',
    title: 'Cómo darle a tu agente una instrucción que sí funcione',
    category: 'Guías',
    dateISO: '2026-08-06',
    readMinutes: 5,
    excerpt: 'La diferencia entre un agente que ayuda y uno que frustra casi siempre está en cómo le pides las cosas. Esta es la fórmula.',
    whatYouGet: [
      'La fórmula de 4 partes para una instrucción clara.',
      'Un ejemplo real: de una orden vaga a una que funciona.',
      'Los 3 errores que hacen que un agente “no entienda”.',
    ],
    body: [
      { type: 'p', text: 'No necesitas aprender a “programar” un agente. Necesitas pedirle las cosas como se las pedirías a un buen empleado nuevo: con claridad. Esta fórmula de cuatro partes te da el 90% del resultado.' },
      { type: 'h', text: 'La fórmula: Objetivo + Contexto + Límites + Formato' },
      { type: 'ul', items: [
        '**Objetivo:** qué quieres lograr, en una frase. (“Quiero recuperar clientes que no compraron.”)',
        '**Contexto:** lo que el agente necesita saber de tu negocio. (“Vendemos jeans; el ticket promedio es $120.”)',
        '**Límites:** qué NO debe hacer. (“No ofrezcas descuentos mayores al 10% sin preguntarme.”)',
        '**Formato:** cómo quieres el resultado. (“Mándame un borrador antes de enviar nada.”)',
      ] },
      { type: 'h', text: 'Ejemplo: de vago a claro' },
      { type: 'quote', text: 'Vago: “Ayúdame con las ventas.”', cite: 'El agente no sabe por dónde empezar' },
      { type: 'quote', text: 'Claro: “Escríbele a los clientes que compraron hace 30 días un mensaje corto invitándolos a volver. Tono cercano, sin descuentos. Muéstrame los mensajes antes de enviarlos.”', cite: 'Objetivo + contexto + límites + formato' },
      { type: 'h', text: 'Los 3 errores más comunes' },
      { type: 'ul', items: [
        'Pedir algo demasiado grande de golpe. Divide en pasos.',
        'No decir qué NO hacer. Los límites evitan sorpresas.',
        'No pedir revisar antes de ejecutar. Para lo delicado, siempre pide borrador.',
      ] },
    ],
  },
  {
    slug: 'plantillas-whatsapp-atencion-ventas',
    title: 'Plantillas de WhatsApp para atender y vender (listas para usar)',
    category: 'Plantillas',
    dateISO: '2026-08-05',
    readMinutes: 4,
    excerpt: 'Mensajes probados para los momentos clave: primer saludo, responder el precio, recuperar a quien no contestó y cerrar la venta. Cópialos y adáptalos.',
    whatYouGet: [
      '4 plantillas de mensaje listas para copiar y pegar.',
      'Cuándo usar cada una en la conversación.',
      'Cómo adaptarlas a tu marca sin sonar a robot.',
    ],
    body: [
      { type: 'p', text: 'Estas plantillas cubren los cuatro momentos donde más ventas se ganan o se pierden en WhatsApp. Cópialas, cambia lo que va entre corchetes y ajústalas a tu tono.' },
      { type: 'h', text: '1. Primer saludo (responde en segundos)' },
      { type: 'quote', text: '¡Hola! Gracias por escribir a [MARCA]. Soy [NOMBRE] y con gusto te ayudo. ¿Buscas algo en especial o quieres que te muestre lo más pedido? 😊' },
      { type: 'h', text: '2. Cuando preguntan el precio' },
      { type: 'quote', text: 'El precio de [PRODUCTO] es [PRECIO], con envío a [ZONA] en [TIEMPO]. Si quieres, te lo aparto ahora mismo y te paso el link de pago. ¿Te lo reservo?' },
      { type: 'h', text: '3. Recuperar a quien no contestó' },
      { type: 'quote', text: 'Hola [NOMBRE], vi que te interesó [PRODUCTO] 👀. Todavía tengo disponible tu talla, pero se está agotando. ¿Lo quieres asegurar hoy?' },
      { type: 'h', text: '4. Cerrar la venta' },
      { type: 'quote', text: '¡Perfecto! Para dejarlo listo necesito [DATO: dirección / talla]. Apenas confirmes el pago aquí [LINK], preparo tu pedido y te comparto el número de guía. 🙌' },
      { type: 'h', text: 'Cómo no sonar a robot' },
      { type: 'p', text: 'Usa el nombre del cliente, responde a lo que dijo (no pegues el mensaje en frío) y deja que un agente de IA los personalice por ti: tú pones el molde, la IA lo adapta a cada conversación y tú apruebas lo importante.' },
    ],
  },
]
