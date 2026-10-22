// Lo que «regala» la bienvenida: IDEAS de prompts por tipo de negocio y el equipo de IA (los puestos REALES de
// la landing, content/chat-knowledge.js · guia:equipo). Nada de cifras inventadas: no prometen resultados.
//
// T60c (feedback de Diego): el bloque confundía, porque parecía que el prompt era para Agent CEO, al que aún no
// pueden entrar. Ahora:
//   · se titula «Ideas de prompts listas para copiar»;
//   · explica que se pegan en ChatGPT, Gemini o el asistente que ya usen, cambiando lo de [CORCHETES];
//   · da 3 ideas CORTAS por negocio, cada una con su «para qué sirve», en vez de un muro;
//   · y aparte: «cuando entres a Agent CEO, tu equipo hará esto solo, con tus datos reales».
import { BUSINESS_TYPES } from '../../src/data/waitlist.js'

/** 3 ideas por tipo de negocio del paso 2 de la lista (src/data/waitlist.js) y por idioma. Un test lo vigila. */
export const BUSINESS_IDEAS = {
  es: {
    tienda: [
      { prompt: 'Escríbeme 3 respuestas cortas y cálidas para cuando un cliente pregunta «¿cuánto cuesta?» por WhatsApp sobre [PRODUCTO].', use: 'Para contestar rápido y no perder la venta.' },
      { prompt: 'Un cliente preguntó por [PRODUCTO] hace 2 días y no volvió a escribir. Dame un mensaje amable para retomar la conversación, sin presionar.', use: 'Para recuperar a quien se enfrió.' },
      { prompt: 'Describe [PRODUCTO] en 3 líneas para mi tienda online: qué es, para quién es y por qué vale la pena.', use: 'Para que tus fichas de producto vendan solas.' },
    ],
    moda: [
      { prompt: 'Tengo esta prenda: [DESCRÍBELA]. Escribe 3 publicaciones cortas para Instagram: una para mostrarla, otra con cómo combinarla y otra de últimas tallas.', use: 'Para llenar la semana de contenido sin pensar.' },
      { prompt: 'Escribe una respuesta amable para quien pregunta «¿la tienes en mi talla?» cuando [PRENDA] solo me queda en [TALLAS].', use: 'Para no perder la venta cuando falta una talla.' },
      { prompt: 'Dame 5 ideas de nombre y un texto corto para una colección de [TEMPORADA] de mi marca de [ESTILO].', use: 'Para lanzar tu próxima colección.' },
    ],
    comida: [
      { prompt: 'Escribe el mensaje de WhatsApp del plato del día de mi [RESTAURANTE/PANADERÍA]: [PLATO], precio [PRECIO] y cómo pedir. Menos de 50 palabras.', use: 'Para avisar a tus clientes cada mañana.' },
      { prompt: 'Dame una respuesta corta y amable para quien pregunta si hacemos domicilios a [BARRIO] y cuánto tardamos.', use: 'Para responder la pregunta que más te hacen.' },
      { prompt: 'Escribe 3 reseñas de ejemplo que me ayuden a pedir opiniones a mis clientes después de comer en [NEGOCIO].', use: 'Para pedir reseñas sin que suene forzado.' },
    ],
    servicios: [
      { prompt: 'Ofrezco [SERVICIO] a [TIPO DE CLIENTE]. Escribe la respuesta a quien me pide una cotización: 3 preguntas cortas para entender lo que necesita.', use: 'Para cotizar sin ir y venir de mensajes.' },
      { prompt: 'Escribe un recordatorio amable de la cita de mañana con [CLIENTE] a las [HORA], con la opción de reprogramar.', use: 'Para que no te dejen plantado.' },
      { prompt: 'Explica en 3 líneas qué hago, para quién y por qué elegirme, para la bio de mi [RED SOCIAL].', use: 'Para presentarte claro en tus redes.' },
    ],
    desde_cero: [
      { prompt: 'Quiero empezar un negocio de [TU IDEA] en [CIUDAD]. Hazme 5 preguntas para comprobar si la gente lo compraría.', use: 'Para validar la idea antes de gastar.' },
      { prompt: 'Describe a mi primer cliente ideal para [TU IDEA]: quién es, qué le preocupa y dónde lo encuentro.', use: 'Para saber a quién venderle primero.' },
      { prompt: 'Dame un plan de 4 semanas para conseguir mis primeras 10 ventas de [TU IDEA] sin gastar en publicidad.', use: 'Para arrancar con pasos concretos.' },
    ],
  },
  en: {
    tienda: [
      { prompt: 'Write 3 short, warm replies for when a customer asks "how much is it?" on WhatsApp about [PRODUCT].', use: 'To answer fast and not lose the sale.' },
      { prompt: 'A customer asked about [PRODUCT] 2 days ago and went quiet. Give me a friendly message to pick the conversation back up, no pressure.', use: 'To win back people who went cold.' },
      { prompt: 'Describe [PRODUCT] in 3 lines for my online store: what it is, who it is for and why it is worth it.', use: 'So your product pages sell on their own.' },
    ],
    moda: [
      { prompt: 'I have this piece: [DESCRIBE IT]. Write 3 short Instagram posts: one to show it, one on how to style it and one for the last sizes left.', use: 'To fill the week with content effortlessly.' },
      { prompt: 'Write a friendly reply for someone asking "do you have it in my size?" when [ITEM] is only left in [SIZES].', use: 'To keep the sale when a size runs out.' },
      { prompt: 'Give me 5 name ideas and a short blurb for a [SEASON] collection of my [STYLE] brand.', use: 'To launch your next collection.' },
    ],
    comida: [
      { prompt: 'Write the WhatsApp message for today\'s special at my [RESTAURANT/BAKERY]: [DISH], price [PRICE] and how to order. Under 50 words.', use: 'To let your customers know every morning.' },
      { prompt: 'Give me a short, friendly reply for someone asking if we deliver to [AREA] and how long it takes.', use: 'To answer the question you get most.' },
      { prompt: 'Write 3 example reviews that help me ask customers for feedback after eating at [BUSINESS].', use: 'To ask for reviews without it feeling forced.' },
    ],
    servicios: [
      { prompt: 'I offer [SERVICE] to [TYPE OF CLIENT]. Write the reply to someone asking for a quote: 3 short questions to understand what they need.', use: 'To quote without endless back-and-forth.' },
      { prompt: 'Write a friendly reminder for tomorrow\'s appointment with [CLIENT] at [TIME], with an option to reschedule.', use: 'So nobody stands you up.' },
      { prompt: 'Explain in 3 lines what I do, who it is for and why choose me, for my [SOCIAL NETWORK] bio.', use: 'To introduce yourself clearly on social.' },
    ],
    desde_cero: [
      { prompt: 'I want to start a [YOUR IDEA] business in [CITY]. Ask me 5 questions to check whether people would buy it.', use: 'To test the idea before spending.' },
      { prompt: 'Describe my ideal first customer for [YOUR IDEA]: who they are, what worries them and where to find them.', use: 'To know who to sell to first.' },
      { prompt: 'Give me a 4-week plan to land my first 10 sales of [YOUR IDEA] without spending on ads.', use: 'To get started with concrete steps.' },
    ],
  },
  pt: {
    tienda: [
      { prompt: 'Escreva 3 respostas curtas e calorosas para quando um cliente pergunta «quanto custa?» no WhatsApp sobre [PRODUTO].', use: 'Para responder rápido e não perder a venda.' },
      { prompt: 'Um cliente perguntou sobre [PRODUTO] há 2 dias e sumiu. Me dê uma mensagem gentil para retomar a conversa, sem pressionar.', use: 'Para recuperar quem esfriou.' },
      { prompt: 'Descreva [PRODUTO] em 3 linhas para minha loja online: o que é, para quem é e por que vale a pena.', use: 'Para suas páginas de produto venderem sozinhas.' },
    ],
    moda: [
      { prompt: 'Tenho esta peça: [DESCREVA]. Escreva 3 posts curtos para o Instagram: um para mostrá-la, outro com como combiná-la e outro de últimos tamanhos.', use: 'Para encher a semana de conteúdo sem esforço.' },
      { prompt: 'Escreva uma resposta gentil para quem pergunta «tem no meu tamanho?» quando [PEÇA] só tem em [TAMANHOS].', use: 'Para não perder a venda quando falta um tamanho.' },
      { prompt: 'Me dê 5 ideias de nome e um texto curto para uma coleção de [ESTAÇÃO] da minha marca de [ESTILO].', use: 'Para lançar sua próxima coleção.' },
    ],
    comida: [
      { prompt: 'Escreva a mensagem de WhatsApp do prato do dia do meu [RESTAURANTE/PADARIA]: [PRATO], preço [PREÇO] e como pedir. Menos de 50 palavras.', use: 'Para avisar seus clientes toda manhã.' },
      { prompt: 'Me dê uma resposta curta e gentil para quem pergunta se fazemos entrega em [BAIRRO] e quanto tempo demora.', use: 'Para responder a pergunta que mais te fazem.' },
      { prompt: 'Escreva 3 avaliações de exemplo que me ajudem a pedir a opinião dos clientes depois de comer no [NEGÓCIO].', use: 'Para pedir avaliações sem parecer forçado.' },
    ],
    servicios: [
      { prompt: 'Ofereço [SERVIÇO] para [TIPO DE CLIENTE]. Escreva a resposta para quem pede um orçamento: 3 perguntas curtas para entender o que precisa.', use: 'Para orçar sem ir e vir de mensagens.' },
      { prompt: 'Escreva um lembrete gentil do horário de amanhã com [CLIENTE] às [HORA], com a opção de remarcar.', use: 'Para ninguém te dar bolo.' },
      { prompt: 'Explique em 3 linhas o que eu faço, para quem e por que me escolher, para a bio do meu [REDE SOCIAL].', use: 'Para se apresentar com clareza nas redes.' },
    ],
    desde_cero: [
      { prompt: 'Quero começar um negócio de [SUA IDEIA] em [CIDADE]. Me faça 5 perguntas para ver se as pessoas comprariam.', use: 'Para validar a ideia antes de gastar.' },
      { prompt: 'Descreva meu primeiro cliente ideal para [SUA IDEIA]: quem é, o que o preocupa e onde encontrá-lo.', use: 'Para saber a quem vender primeiro.' },
      { prompt: 'Me dê um plano de 4 semanas para conseguir minhas primeiras 10 vendas de [SUA IDEIA] sem gastar com anúncios.', use: 'Para começar com passos concretos.' },
    ],
  },
}

/** Textos fijos del bloque de ideas (T60c). */
export const IDEAS_COPY = {
  es: {
    eyebrow: '🎁 Para empezar hoy',
    title: 'Ideas de prompts listas para copiar',
    intro: 'Mientras abrimos tu lugar, pega esta idea en ChatGPT, Gemini o el asistente de IA que ya uses. Cambia lo que está entre [CORCHETES] por los datos de tu negocio.',
    use: 'Para qué sirve',
    after: 'Cuando entres a Agent CEO, tu equipo hará esto solo, con tus datos reales.',
  },
  en: {
    eyebrow: '🎁 To get started today',
    title: 'Prompt ideas ready to copy',
    intro: "While we open your spot, paste this idea into ChatGPT, Gemini or whatever AI assistant you already use. Swap what's in [BRACKETS] for your business details.",
    use: "What it's for",
    after: "Once you're in Agent CEO, your team will do this on its own, with your real data.",
  },
  pt: {
    eyebrow: '🎁 Para começar hoje',
    title: 'Ideias de prompts prontas para copiar',
    intro: 'Enquanto abrimos o seu lugar, cole esta ideia no ChatGPT, no Gemini ou no assistente de IA que você já usa. Troque o que está entre [COLCHETES] pelos dados do seu negócio.',
    use: 'Para que serve',
    after: 'Quando você entrar no Agent CEO, sua equipe vai fazer isso sozinha, com seus dados reais.',
  },
}

/** Las 3 ideas de un negocio (si el tipo no se conoce, las de «tienda»). */
export const businessIdeas = (locale, business) => {
  const L = BUSINESS_IDEAS[locale] ? locale : 'en'
  return BUSINESS_IDEAS[L][BUSINESS_TYPES.includes(business) ? business : 'tienda']
}

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
  pt: [
    { name: 'Diretor-geral', does: 'Seu CEO: coordena todo mundo' },
    { name: 'Vendedor de WhatsApp', does: 'Vende a qualquer hora' },
    { name: 'Responsável pelo estoque', does: 'Avisa antes de algo acabar' },
    { name: 'Criador de conteúdo', does: 'Prepara e publica seus posts' },
  ],
}
