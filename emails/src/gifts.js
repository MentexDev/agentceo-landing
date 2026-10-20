// Lo que «regala» cada correo: prompts listos para copiar y el equipo de IA (los puestos REALES de la landing,
// content/chat-knowledge.js · guia:equipo). Nada de cifras inventadas: los prompts no prometen resultados.
import { BUSINESS_TYPES } from '../../src/data/waitlist.js'

// Un prompt por tipo de negocio del paso 2 de la lista (src/data/waitlist.js). Lo vigila el test:
// si se añade un tipo nuevo allí sin su prompt aquí (en los dos idiomas), falla.
export const BUSINESS_PROMPTS = {
  es: {
    tienda: {
      title: 'Para vender más por WhatsApp',
      prompt: 'Actúa como el mejor vendedor de mi tienda de [QUÉ VENDES]. Un cliente me escribe por WhatsApp «¿cuánto cuesta?» y después deja de contestar. Escríbeme 3 mensajes cortos y cálidos: uno para responder el precio, otro para retomar la conversación al día siguiente y otro para cerrar la venta. Sin presionar y con un emoji como máximo.',
    },
    moda: {
      title: 'Para mover esa prenda',
      prompt: 'Eres mi asesora de estilo. Tengo esta prenda: [DESCRÍBELA]. Escribe 3 publicaciones cortas para Instagram (una para mostrarla, una con cómo combinarla y una de últimas tallas) y una respuesta para quien pregunte «¿la tienes en mi talla?». Tono cercano, sin palabras de relleno.',
    },
    comida: {
      title: 'Para llenar las mesas (o los pedidos)',
      prompt: 'Eres el encargado de mi negocio de comida, [TIPO: restaurante, panadería…]. Escribe el mensaje de WhatsApp para avisar a mis clientes del plato del día, con precio, horario y cómo pedir, en menos de 50 palabras. Dame también una respuesta amable para quien pregunta si hacemos domicilios.',
    },
    servicios: {
      title: 'Para responder «¿me das una cotización?»',
      prompt: 'Eres mi asistente comercial. Ofrezco [SERVICIO] a [TIPO DE CLIENTE]. Escribe la respuesta a alguien que me pide una cotización: 3 preguntas cortas para entender lo que necesita, cómo trabajo en dos líneas y una invitación a agendar una llamada de 15 minutos.',
    },
    desde_cero: {
      title: 'Para validar tu idea esta semana',
      prompt: 'Quiero empezar un negocio de [TU IDEA] en [CIUDAD]. Hazme 5 preguntas para comprobar si la gente lo compraría, dime cómo sería mi primer cliente ideal y propón una forma de conseguir mis primeras 10 ventas este mes sin gastar en publicidad.',
    },
  },
  en: {
    tienda: {
      title: 'To sell more on WhatsApp',
      prompt: "Act as the best salesperson at my [WHAT YOU SELL] store. A customer messages me on WhatsApp asking \"how much is it?\" and then goes quiet. Write 3 short, warm messages: one to answer the price, one to pick the conversation back up the next day and one to close the sale. No pressure, one emoji at most.",
    },
    moda: {
      title: 'To move that piece',
      prompt: "You're my style advisor. I have this piece: [DESCRIBE IT]. Write 3 short Instagram posts (one to show it off, one on how to style it and one for the last sizes left) and a reply for anyone asking \"do you have it in my size?\". Friendly tone, no filler words.",
    },
    comida: {
      title: 'To fill the tables (or the orders)',
      prompt: "You run my food business, a [TYPE: restaurant, bakery…]. Write the WhatsApp message announcing today's special to my customers, with price, hours and how to order, in under 50 words. Also give me a friendly reply for anyone asking if we deliver.",
    },
    servicios: {
      title: 'To answer "can you send me a quote?"',
      prompt: "You're my sales assistant. I offer [SERVICE] to [TYPE OF CLIENT]. Write the reply to someone asking for a quote: 3 short questions to understand what they need, how I work in two lines and an invitation to book a 15-minute call.",
    },
    desde_cero: {
      title: 'To test your idea this week',
      prompt: "I want to start a [YOUR IDEA] business in [CITY]. Ask me 5 questions to check whether people would buy it, describe my ideal first customer and suggest a way to land my first 10 sales this month without spending on ads.",
    },
  },
}

export const PROMPT_HINT = {
  es: 'Pégalo en el asistente de IA que uses y cambia lo que va entre [CORCHETES]. Cuando entres a Agent CEO, tu equipo lo hará con los datos reales de tu negocio.',
  en: "Paste it into whichever AI assistant you use and swap what's in [BRACKETS]. Once you're in Agent CEO, your team will do it with your business's real data.",
}

export const businessPrompt = (locale, business) =>
  BUSINESS_PROMPTS[locale][BUSINESS_TYPES.includes(business) ? business : 'tienda']

// Los cuatro puestos que abren la fila del equipo (los primeros de la landing, S05).
export const TEAM = {
  es: [
    { name: 'Director General', does: 'Tu CEO: coordina a todos' },
    { name: 'Vendedor de WhatsApp', does: 'Vende a cualquier hora' },
    { name: 'Encargado de inventario', does: 'Avisa antes de que algo se acabe' },
    { name: 'Creador de contenido', does: 'Prepara y publica tus posts' },
  ],
  en: [
    { name: 'Chief Executive Officer', does: 'Your CEO: coordinates everyone' },
    { name: 'WhatsApp seller', does: 'Sells any time of day' },
    { name: 'Inventory manager', does: 'Warns you before anything runs out' },
    { name: 'Content creator', does: 'Prepares and publishes your posts' },
  ],
}
