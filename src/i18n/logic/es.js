// Textos de la LÓGICA de la portada (es): los usan las islas (src/sections/islands/*) y ui/es.js.
// Módulo aparte para que cada isla descargue solo esto y no el diccionario ui entero de cada idioma (T62).
export default {
  // Frases de los expertos de S05 (T32): una lista por tarjeta, en el orden de la sección
  // (inventario, contenido, WhatsApp, publicidad, atención al cliente, producción).
  agentLines: [
    ['¡Hola, jefe! Ya conté todo el almacén.', 'Quedan 4 camisetas negras talla M. ¿Pido 40 más?', 'Las tazas se venden el doble los viernes. Ya lo tengo en cuenta.', 'Nada se agota sin que te avise antes.'],
    ['¡Hola, jefe! El post del viernes está listo.', 'Tengo tres ideas de reels para esta semana. ¿Las vemos?', 'Escribí el texto, elegí la foto y la hora. Solo falta tu sí.', 'Tu cuenta ya publica todos los días sin que lo pienses.'],
    ['¡Hola, jefe! Laura pregunta si hay talla S.', 'Son las 2 de la mañana y acabo de cerrar una venta.', 'Respondo en segundos, con tu catálogo y tus precios.', 'Si un cliente se enfada, te lo paso a ti al instante.'],
    ['¡Hola, jefe! Comparé dos anuncios esta mañana.', 'El anuncio B trae más clientes por el mismo dinero.', '¿Subo el presupuesto? Sin tu firma no gasto nada.', 'Apagué el anuncio que no funcionaba. Te lo cuento en el resumen.'],
    ['¡Hola, jefe! Cerré el reclamo de Andrés.', 'Cambié una talla y el cliente quedó feliz.', 'Tengo paciencia infinita, incluso a las 11 de la noche.', 'Las dudas que se repiten ya las respondo solo.'],
    ['¡Hola, jefe! Hoy entraron tres pedidos.', 'El pedido 1042 ya salió. Le aviso al cliente.', 'Si un pedido se atrasa, lo sabes tú antes que el cliente.', 'Cada pedido, de la entrada a la puerta, bajo control.'],
  ],
  ceo: ['¡Hola! Soy tu CEO. Tócame.', 'Yo organizo al equipo por ti.', 'Lo importante siempre te lo pregunto.', 'Mis compañeros están abajo. ¡Baja!', '¿Otra vez? Me haces cosquillas.'],
  req: ['Pedir 40 camisetas negras', 'Subir el presupuesto del anuncio', 'Publicar los posts de la semana'],
  approved: 'Aprobado',
  notNow: 'Ahora no',
  lockIdle: 'Por muy bien que lo haga, esto no cambia.',
  lockTried: 'Esto nunca lo hará solo. Siempre te va a preguntar.',
  trustDone: '3 de 3 bien, sin sorpresas',
  trustStep: '{n} de 3 · todavía te pregunta',
  autoOn: 'Activa · tus agentes ya la están haciendo',
  meter0: 'Prende una para empezar',
  meterAll: '¡Todo en automático!',
  meterSome: 'Tu equipo ya se encarga de esto',
  moreOpen: 'Ver menos',
  moreClosed: 'Y muchos más  +',
  clonOn: 'Permiso activo. Lo puedes quitar cuando quieras.',
  clonOff: 'Permiso quitado. Tu vocero ya no usa tu cara ni tu voz.',
}
