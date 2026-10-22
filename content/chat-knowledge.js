// ─────────────────────────────────────────────────────────────────────────────
// CONOCIMIENTO CURADO DEL WIDGET «Tu CEO» (T32, 2026-10-20) · NO CONFIDENCIAL.
//
// Resúmenes escritos a mano SOLO con lo que ya está publicado en la portada
// (src/i18n/sections/{es,en}.json; la sección de origen va en `fuente`). Se suma a lo
// que scripts/build-knowledge.mjs genera del resto del sitio (FAQ, precios de
// content/precios.js, blog, recursos y legales) → worker/generated/knowledge.json.
//
// ⛔ PROHIBIDO aquí (lo vigila tests/worker/chat-knowledge.test.js):
//   secretos o claves · arquitectura interna (proveedores de la infraestructura del
//   sitio, bases de datos, modelos) · datos de clientes reales · roadmap interno,
//   fechas o funciones no anunciadas en la web.
// Los ejemplos de la portada (Laura, la camiseta negra…) son INVENTADOS y así se dicen.
// ─────────────────────────────────────────────────────────────────────────────

// Quién es Agent CEO, para el CHAT (T40, Luca): sin datos registrales. Solo quién lo desarrolla.
import { prefix } from '../src/i18n/meta.js'
export const ENTITY = {
  es: 'Agent CEO es un producto de Klinworks, LLC. Es una plataforma donde un dueño de negocio arma un equipo de agentes de IA que venden por WhatsApp, cuidan su tienda y crean contenido, y que le piden permiso antes de cualquier acción importante.',
  en: 'Agent CEO is a product of Klinworks, LLC. It is a platform where a business owner builds a team of AI agents that sell on WhatsApp, look after their store and create content, and that ask for permission before any important action.',
  pt: 'Agent CEO é um produto da Klinworks, LLC. É uma plataforma onde o dono de um negócio monta uma equipe de agentes de IA que vendem pelo WhatsApp, cuidam da loja e criam conteúdo, e que pedem permissão antes de qualquer ação importante.',
}

export const CURATED = [
  {
    id: 'guia:equipo',
    fuente: 'portada · S05 «El equipo»',
    es: {
      title: '¿Qué empleados de IA trae el equipo?',
      text: 'Tu equipo de IA tiene expertos, cada uno en algo: Director General (tu CEO, que coordina), Vendedor de WhatsApp (responde a tus clientes y cierra ventas a cualquier hora), Encargado de inventario (cuenta lo que tienes y avisa antes de que algo se acabe), Creador de contenido (prepara y publica tus posts), Experto en publicidad (maneja tus anuncios y te dice cuáles funcionan), Atención al cliente (dudas, cambios y reclamos), Jefe de producción (sigue cada pedido), y también diseñador, realizador de video, contador, analista de tendencias, constructor de apps y más. Y puedes crear el tuyo. Los agentes no tienen límite en ningún plan.',
    },
    en: {
      title: 'Which AI employees come with the team?',
      text: 'Your AI team has experts, each one good at something: Chief Executive Officer (your CEO, who coordinates), WhatsApp seller (answers your customers and closes sales any time), Inventory manager (counts what you have and warns you before anything runs out), Content creator (prepares and publishes your posts), Advertising expert (runs your ads and tells you which ones work), Customer service (questions, exchanges and complaints), Production manager (tracks every order), plus designer, video producer, accountant, trend analyst, app builder and more. And you can create your own. Agents are unlimited on every plan.',
    },
    pt: {
      title: 'Quais funcionários de IA vêm na equipe?',
      text: 'Sua equipe de IA tem especialistas, cada um bom em uma coisa: Diretor Geral (o seu CEO, que coordena), Vendedor de WhatsApp (responde seus clientes e fecha vendas a qualquer hora), Responsável pelo estoque (conta o que você tem e avisa antes que algo acabe), Criador de conteúdo (prepara e publica seus posts), Especialista em publicidade (cuida dos seus anúncios e diz quais funcionam), Atendimento ao cliente (dúvidas, trocas e reclamações), Chefe de produção (acompanha cada pedido), e também designer, editor de vídeo, contador, analista de tendências, construtor de apps e mais. E você pode criar o seu. Os agentes são ilimitados em todos os planos.',
    },
  },
  {
    id: 'guia:whatsapp',
    fuente: 'portada · S08 «Vende por WhatsApp»',
    es: {
      title: 'Vender por WhatsApp con un agente',
      text: 'El Vendedor de WhatsApp responde a cualquier hora con el tono de tu marca, cierra la venta y vigila tus pedidos, carritos y stock. Se conecta por código QR o con el número oficial de WhatsApp, y todas las conversaciones quedan en una sola bandeja. Cada cliente avanza paso a paso hasta pagar.',
    },
    en: {
      title: 'Selling on WhatsApp with an agent',
      text: "The WhatsApp seller replies any time in your brand's voice, closes the sale and keeps an eye on your orders, carts and stock. It connects via QR code or with the official WhatsApp number, and every conversation lives in a single inbox. Each customer moves step by step to payment.",
    },
    pt: {
      title: 'Vender pelo WhatsApp com um agente',
      text: 'O Vendedor de WhatsApp responde a qualquer hora com o tom da sua marca, fecha a venda e acompanha seus pedidos, carrinhos e estoque. Ele se conecta por QR code ou pelo número oficial do WhatsApp, e todas as conversas ficam numa caixa de entrada só. Cada cliente avança passo a passo até pagar.',
    },
  },
  {
    id: 'guia:aprobaciones',
    fuente: 'portada · S09 «Te pide permiso» y S10 «Confianza paso a paso»',
    es: {
      title: '¿Cómo funcionan las aprobaciones?',
      text: 'Nada importante pasa sin ti: si algo cuesta dinero o no se puede deshacer, el agente te pregunta primero y lo apruebas desde tu celular con un botón (por ejemplo, pedir más inventario al proveedor, subir el presupuesto de un anuncio o publicar los posts de la semana). La confianza va paso a paso: cuando una tarea sale bien 3 veces, puede hacerla sola. Lo que cuesta dinero te lo pregunta siempre.',
    },
    en: {
      title: 'How do approvals work?',
      text: "Nothing important happens without you: if something costs money or can't be undone, the agent asks you first and you approve it from your phone with one tap (for example, ordering more stock from the supplier, raising an ad's budget or publishing the week's posts). Trust builds step by step: once a task goes well 3 times, it can do it on its own. Anything that costs money, it always asks you first.",
    },
    pt: {
      title: 'Como funcionam as aprovações?',
      text: 'Nada importante acontece sem você: se algo custa dinheiro ou não pode ser desfeito, o agente te pergunta primeiro e você aprova pelo celular com um botão (por exemplo, pedir mais estoque ao fornecedor, aumentar o orçamento de um anúncio ou publicar os posts da semana). A confiança vem passo a passo: quando uma tarefa dá certo 3 vezes, ela pode ser feita sozinha. O que custa dinheiro, ele sempre te pergunta.',
    },
  },
  {
    id: 'guia:reunion',
    fuente: 'portada · S06 «Trabajan solos» y S07 «Reunión diaria»',
    es: {
      title: 'Reunión diaria y reporte de la mañana',
      text: 'Tu equipo trabaja también de noche: a las 7:00 tienes tu reporte de ventas. Cada mañana se reúnen solos y tú lees el acta: qué hicieron, qué sigue y qué espera tu aprobación. Tus reuniones también pueden quedar grabadas y resumidas.',
    },
    en: {
      title: 'Daily meeting and morning report',
      text: "Your team also works at night: at 7:00 your sales report is waiting. Every morning they meet on their own and you read the minutes: what they did, what's next and what's waiting for your approval. Your meetings can also be recorded and summarized.",
    },
    pt: {
      title: 'Reunião diária e relatório da manhã',
      text: 'Sua equipe trabalha também de noite: às 7:00 você já tem seu relatório de vendas. Toda manhã eles se reúnem sozinhos e você lê a ata: o que fizeram, o que vem a seguir e o que espera a sua aprovação. Suas reuniões também podem ficar gravadas e resumidas.',
    },
  },
  {
    id: 'guia:automatizaciones',
    fuente: 'portada · S11 «Automatizaciones»',
    es: {
      title: '¿Qué automatizaciones hay?',
      text: 'Hay 26 automatizaciones listas para usar, que se encienden con un botón: resumen de ventas cada mañana, carritos abandonados, bienvenida a clientes nuevos, preparar cada reunión, aviso de inventario bajo, el contenido de la semana, cobros y reportes, entre otras.',
    },
    en: {
      title: 'What automations are there?',
      text: 'There are 26 ready-to-use automations you turn on with one tap: morning sales summary, abandoned carts, welcome new customers, prep every meeting, low inventory alert, the week\'s content, payments and reports, among others.',
    },
    pt: {
      title: 'Quais automações existem?',
      text: 'Há 26 automações prontas para usar, que você liga com um botão: resumo de vendas toda manhã, carrinhos abandonados, boas-vindas a clientes novos, preparar cada reunião, aviso de estoque baixo, o conteúdo da semana, cobranças e relatórios, entre outras.',
    },
  },
  {
    id: 'guia:estudio',
    fuente: 'portada · S12 «Estudio creativo»',
    es: {
      title: 'Estudio creativo: fotos, videos y diseños',
      text: 'Tu equipo crea el contenido de tu marca: fotos y portadas realistas (13 estilos), videos animados y reels con guion, música y edición, y más de 192 plantillas de diseño. También puedes clonarte: un presentador con tu cara y tu voz, solo con tu permiso, que puedes retirar cuando quieras.',
    },
    en: {
      title: 'Creative Studio: photos, videos and designs',
      text: "Your team creates your brand's content: realistic photos and covers (13 styles), animated videos and reels with script, music and editing, and over 192 design templates. You can also clone yourself: a presenter with your face and voice, only with your permission, which you can revoke whenever you want.",
    },
    pt: {
      title: 'Estúdio criativo: fotos, vídeos e designs',
      text: 'Sua equipe cria o conteúdo da sua marca: fotos e capas realistas (13 estilos), vídeos animados e reels com roteiro, música e edição, e mais de 192 modelos de design. Você também pode se clonar: um apresentador com o seu rosto e a sua voz, só com a sua permissão, que você pode retirar quando quiser.',
    },
  },
  {
    id: 'guia:construir',
    fuente: 'portada · S13 «Tu equipo la construye»',
    es: {
      title: '¿Me pueden construir una web, tienda o app?',
      text: 'Sí: páginas web, landings, tiendas, apps y herramientas internas. La describes en el chat, sin saber programar; la ves en vista previa y la cambias con un clic; cada cambio queda guardado como versión. Se lanza a tu GitHub y tu Vercel: el código es tuyo.',
    },
    en: {
      title: 'Can they build me a website, store or app?',
      text: 'Yes: websites, landing pages, stores, apps and internal tools. You describe it in the chat, no coding required; you see it in preview and change it with one click; every change is saved as a version. It launches to your GitHub and your Vercel: the code is yours.',
    },
    pt: {
      title: 'Vocês podem construir um site, loja ou app pra mim?',
      text: 'Sim: sites, landing pages, lojas, apps e ferramentas internas. Você descreve no chat, sem saber programar; vê a prévia e muda com um clique; cada mudança fica salva como versão. É publicado no seu GitHub e na sua Vercel: o código é seu.',
    },
  },
  {
    id: 'guia:cerebro',
    fuente: 'portada · S14 «El cerebro de tu empresa»',
    es: {
      title: 'El cerebro de tu empresa',
      text: 'Conoce tu negocio y mejora cada día: lee tus documentos, las conversaciones y cada tarea terminada, y separa lo que es seguro de lo que solo supone.',
    },
    en: {
      title: "Your company's brain",
      text: "It knows your business and gets better every day: it reads your documents, conversations and every finished task, and separates what's certain from what's just a guess.",
    },
    pt: {
      title: 'O cérebro da sua empresa',
      text: 'Conhece o seu negócio e melhora a cada dia: lê seus documentos, as conversas e cada tarefa concluída, e separa o que é certo do que é só suposição.',
    },
  },
  {
    id: 'guia:integraciones',
    fuente: 'portada · S15 «Se conecta con lo que ya usas»',
    es: {
      title: '¿Con qué herramientas se conecta?',
      text: 'Con más de 70: tiendas (Shopify, WooCommerce, Wix, Squarespace, PrestaShop), marketplaces (MercadoLibre, Amazon, Etsy, eBay), facturación (Alegra, Siigo, Factus, QuickBooks), CRM (HubSpot, Kommo, Bitrix24), Google (Gmail, Drive, Sheets, Calendar) y canales (WhatsApp, Telegram, TikTok, YouTube). Además, una extensión para Chrome permite que tu agente abra pestañas, llene formularios y aprenda un proceso mirándote una vez; lo importante te lo sigue preguntando.',
    },
    en: {
      title: 'What tools does it connect with?',
      text: 'More than 70: stores (Shopify, WooCommerce, Wix, Squarespace, PrestaShop), marketplaces (MercadoLibre, Amazon, Etsy, eBay), invoicing (Alegra, Siigo, Factus, QuickBooks), CRM (HubSpot, Kommo, Bitrix24), Google (Gmail, Drive, Sheets, Calendar) and channels (WhatsApp, Telegram, TikTok, YouTube). Plus, a Chrome extension lets your agent open tabs, fill out forms and learn a process by watching you once; the important stuff, it still asks you first.',
    },
    pt: {
      title: 'Com quais ferramentas se conecta?',
      text: 'Com mais de 70: lojas (Shopify, WooCommerce, Wix, Squarespace, PrestaShop), marketplaces (MercadoLibre, Amazon, Etsy, eBay), faturamento (Alegra, Siigo, Factus, QuickBooks), CRM (HubSpot, Kommo, Bitrix24), Google (Gmail, Drive, Sheets, Calendar) e canais (WhatsApp, Telegram, TikTok, YouTube). Além disso, uma extensão para o Chrome permite que seu agente abra abas, preencha formulários e aprenda um processo vendo você fazer uma vez; o que é importante, ele continua te perguntando.',
    },
  },
  {
    id: 'guia:marcas-gasto',
    fuente: 'portada · S17 «Tranquilidad»',
    es: {
      title: 'Varias marcas, tus datos y tu gasto',
      text: 'Todas tus marcas en un lugar, cada una con su equipo y un solo resumen. Tus datos son tuyos: nadie más ve tu información y todo queda registrado. Sin sorpresas en la factura: tú pones el tope de gasto por marca.',
    },
    en: {
      title: 'Several brands, your data and your spending',
      text: 'All your brands in one place, each with its own team and a single overview. Your data is yours: no one else sees your information and everything is logged. No surprises on your bill: you set the spending cap for each brand.',
    },
    pt: {
      title: 'Várias marcas, seus dados e seus gastos',
      text: 'Todas as suas marcas num só lugar, cada uma com sua equipe e um resumo único. Seus dados são seus: ninguém mais vê suas informações e tudo fica registrado. Sem surpresas na fatura: você define o limite de gasto por marca.',
    },
  },
  {
    id: 'guia:entrevista',
    fuente: 'portada · S04 «Así empieza»',
    es: {
      title: '¿Cómo se empieza?',
      text: 'Con una charla corta: le cuentas tu negocio (o tu idea, si empiezas desde cero) y te arma el equipo. Si ya tienes web, la revisa mientras hablan. Si empiezas de cero, primero se comprueba que haya clientes y después se construye, sin gastar de más.',
    },
    en: {
      title: 'How do you get started?',
      text: "With one short chat: you tell it about your business (or your idea, if you're starting from scratch) and it builds your team. If you already have a website, it reviews it while you talk. If you're starting from scratch, first you make sure there are customers, then you build, without overspending.",
    },
    pt: {
      title: 'Como se começa?',
      text: 'Com uma conversa curta: você conta sobre o seu negócio (ou a sua ideia, se está começando do zero) e ele monta a sua equipe. Se você já tem site, ele analisa enquanto vocês conversam. Se está começando do zero, primeiro se confirma que há clientes e depois se constrói, sem gastar demais.',
    },
  },
  {
    id: 'guia:lista',
    fuente: 'portada · S02 y S19 (formulario de la lista de espera)',
    cta: 'waitlist',
    es: {
      title: '¿Cómo me apunto a la lista de espera?',
      text: 'Deja tu correo en el formulario de la web (o aquí mismo, en el chat). Abrimos por grupos: los primeros de la lista entran primero y te avisamos por correo cuando sea tu turno. Puedes darte de baja desde cualquier correo.',
    },
    en: {
      title: 'How do I join the waitlist?',
      text: "Leave your email in the form on the website (or right here in the chat). We open in batches: the first on the list get in first, and we'll email you when it's your turn. You can unsubscribe from any email.",
    },
    pt: {
      title: 'Como entro na lista de espera?',
      text: 'Deixe seu e-mail no formulário do site (ou aqui mesmo, no chat). Abrimos por grupos: os primeiros da lista entram primeiro e a gente te avisa por e-mail quando for a sua vez. Você pode cancelar a inscrição em qualquer e-mail.',
    },
  },
  {
    id: 'guia:asistente',
    fuente: 'política del widget (SB 1001) · persona.js',
    es: {
      title: '¿Qué sabe este asistente?',
      text: 'Soy una inteligencia artificial, no una persona. Solo respondo con lo que está publicado en esta web. No tengo acceso a cuentas, datos de clientes ni información interna de la empresa, y no hablo de planes o fechas que no estén anunciados. Para hablar con una persona: info@agentceo.io.',
    },
    en: {
      title: 'What does this assistant know?',
      text: "I'm an artificial intelligence, not a person. I only answer with what's published on this website. I have no access to accounts, customer data or internal company information, and I don't discuss plans or dates that haven't been announced. To talk to a person: info@agentceo.io.",
    },
    pt: {
      title: 'O que este assistente sabe?',
      text: 'Sou uma inteligência artificial, não uma pessoa. Só respondo com o que está publicado neste site. Não tenho acesso a contas, dados de clientes nem informações internas da empresa, e não falo de planos ou datas que não foram anunciados. Para falar com uma pessoa: info@agentceo.io.',
    },
  },
]

/** Fragmentos del idioma pedido, con la misma forma que el resto de la base. */
export function curatedChunks(lang) {
  const home = `${prefix(lang)}/`
  return CURATED.filter((c) => c[lang]).map((c) => ({
    id: c.id,
    kind: 'guia',
    title: c[lang].title,
    text: c[lang].text,
    url: home,
    ...(c.cta ? { cta: c.cta } : {}),
  }))
}
