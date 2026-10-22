// ─────────────────────────────────────────────────────────────────────────────
// Recursos do AgentCEO — tradução para português do Brasil de content/recursos.js.
// Cada item mantém `es` (o slug original em espanhol) para pareá-lo com a fonte.
// `whatYouGet` é o gancho visível; `body` é o conteúdo liberado com o e-mail.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Recursos de IA para o seu negócio · Agent CEO',
  eyebrow: 'Recursos',
  h1: 'Guias e modelos para começar hoje.',
  sub: 'Material prático e gratuito para tocar o seu negócio com IA. Deixe o seu e-mail e ganhe acesso completo na hora.',
}

export const CATEGORIES = ['Checklists', 'Guias', 'Modelos']

export const ITEMS = [
  {
    es: 'checklist-tareas-para-automatizar',
    slug: '12-tarefas-que-seu-negocio-pode-automatizar-esta-semana',
    title: '12 tarefas que o seu negócio pode automatizar esta semana',
    category: 'Checklists',
    dateISO: '2026-08-07',
    featured: true,
    readMinutes: 6,
    excerpt: 'Um checklist prático para descobrir, na sua própria operação, o que delegar primeiro a um agente de IA —organizado por facilidade e por impacto.',
    whatYouGet: [
      'As 12 tarefas agrupadas por área: atendimento, vendas, operações e conteúdo.',
      'Quais são de **baixo risco** para você começar sem medo.',
      'Uma regra simples para decidir o que **NÃO** automatizar ainda.',
      'Um miniplano de 3 semanas para começar sem se sobrecarregar.',
    ],
    body: [
      { type: 'p', text: 'O jeito mais rápido de tirar proveito da IA não é automatizar “tudo”, é começar pelas tarefas certas: as repetitivas, as que você odeia fazer e as que não dependem do seu critério. Aqui estão 12, organizadas por área.' },
      { type: 'h', text: 'Atendimento ao cliente' },
      { type: 'ul', items: [
        'Responder às perguntas frequentes (horários, entregas, tamanhos, preços).',
        'Dar as boas-vindas e coletar os dados do cliente 24/7, mesmo enquanto você dorme.',
        'Enviar lembretes e confirmações (horários marcados, pedidos, pagamentos pendentes).',
      ] },
      { type: 'h', text: 'Vendas' },
      { type: 'ul', items: [
        'Retomar o contato com quem escreveu e não comprou (acompanhamento de leads).',
        'Recuperar carrinhos abandonados com uma mensagem na hora certa.',
        'Responder na hora às perguntas sobre preço e disponibilidade.',
      ] },
      { type: 'h', text: 'Operações' },
      { type: 'ul', items: [
        'Montar o relatório de vendas do dia e te enviar toda manhã.',
        'Te avisar quando um produto estiver para acabar.',
        'Organizar e classificar as mensagens ou os pedidos que chegam.',
      ] },
      { type: 'h', text: 'Conteúdo e marketing' },
      { type: 'ul', items: [
        'Escrever rascunhos de posts para as redes sociais.',
        'Redigir descrições de produto claras e otimizadas para SEO.',
        'Preparar respostas para avaliações e comentários.',
      ] },
      { type: 'h', text: 'A regra para decidir o que NÃO automatizar (ainda)' },
      { type: 'p', text: 'Se uma tarefa **muda o rumo do negócio**, é **irreversível** (um pagamento, uma publicação delicada) ou exige uma **conversa humana sensível**, não deixe que ela rode sozinha. Automatize a execução, mas deixe a decisão final passar por você com um clique de aprovação.' },
      { type: 'h', text: 'O seu plano de 3 semanas' },
      { type: 'ul', items: [
        '**Semana 1:** escolha UMA tarefa de “atendimento” e coloque para funcionar. Acompanhe de perto.',
        '**Semana 2:** some uma de “vendas” (acompanhamento ou carrinhos). Meça o resultado.',
        '**Semana 3:** automatize o seu relatório diário para nunca mais montá-lo à mão.',
      ] },
      { type: 'p', text: 'No fim das três semanas, você vai ter três coisas funcionando sozinhas e uma ideia muito mais clara do que delegar em seguida.' },
    ],
  },
  {
    es: 'guia-primera-instruccion-agente',
    slug: 'como-dar-ao-seu-agente-uma-instrucao-que-funciona-de-verdade',
    title: 'Como dar ao seu agente uma instrução que funciona de verdade',
    category: 'Guias',
    dateISO: '2026-08-06',
    readMinutes: 5,
    excerpt: 'A diferença entre um agente que ajuda e um que frustra quase sempre está em como você pede as coisas. Esta é a fórmula.',
    whatYouGet: [
      'A fórmula de 4 partes para uma instrução clara.',
      'Um exemplo real: de um pedido vago a um que funciona.',
      'Os 3 erros que fazem um agente “não entender”.',
    ],
    body: [
      { type: 'p', text: 'Você não precisa aprender a “programar” um agente. Precisa pedir as coisas como pediria a um bom funcionário novo: com clareza. Esta fórmula de quatro partes te entrega 90% do resultado.' },
      { type: 'h', text: 'A fórmula: Objetivo + Contexto + Limites + Formato' },
      { type: 'ul', items: [
        '**Objetivo:** o que você quer alcançar, em uma frase. (“Quero recuperar clientes que não compraram.”)',
        '**Contexto:** o que o agente precisa saber sobre o seu negócio. (“Vendemos jeans; o tíquete médio é $120.”)',
        '**Limites:** o que ele NÃO deve fazer. (“Não ofereça descontos acima de 10% sem me perguntar.”)',
        '**Formato:** como você quer o resultado. (“Me mande um rascunho antes de enviar qualquer coisa.”)',
      ] },
      { type: 'h', text: 'Exemplo: do vago ao claro' },
      { type: 'quote', text: 'Vago: “Me ajude com as vendas.”', cite: 'O agente não sabe por onde começar' },
      { type: 'quote', text: 'Claro: “Escreva para os clientes que compraram há 30 dias uma mensagem curta convidando-os a voltar. Tom próximo, sem descontos. Me mostre as mensagens antes de enviar.”', cite: 'Objetivo + contexto + limites + formato' },
      { type: 'h', text: 'Os 3 erros mais comuns' },
      { type: 'ul', items: [
        'Pedir algo grande demais de uma vez só. Divida em etapas.',
        'Não dizer o que NÃO fazer. Os limites evitam surpresas.',
        'Não pedir para revisar antes de executar. Para o que é delicado, peça sempre um rascunho.',
      ] },
    ],
  },
  {
    es: 'plantillas-whatsapp-atencion-ventas',
    slug: 'modelos-de-whatsapp-para-atender-e-vender-prontos-para-usar',
    title: 'Modelos de WhatsApp para atender e vender (prontos para usar)',
    category: 'Modelos',
    dateISO: '2026-08-05',
    readMinutes: 4,
    excerpt: 'Mensagens testadas para os momentos-chave: a primeira saudação, responder sobre o preço, retomar quem sumiu e fechar a venda. Copie e adapte.',
    whatYouGet: [
      '4 modelos de mensagem prontos para copiar e colar.',
      'Quando usar cada um durante a conversa.',
      'Como adaptá-los à sua marca sem parecer um robô.',
    ],
    body: [
      { type: 'p', text: 'Estes modelos cobrem os quatro momentos em que mais vendas são ganhas ou perdidas no WhatsApp. Copie, troque o que está entre colchetes e ajuste ao seu tom.' },
      { type: 'h', text: '1. Primeira saudação (responda em segundos)' },
      { type: 'quote', text: 'Oi! Obrigado por falar com a [MARCA]. Eu sou [NOME] e vou adorar te ajudar. Você está procurando algo específico ou quer que eu te mostre os mais pedidos? 😊' },
      { type: 'h', text: '2. Quando perguntam o preço' },
      { type: 'quote', text: 'O [PRODUTO] sai por [PREÇO], com entrega para [REGIÃO] em [PRAZO]. Se quiser, já separo para você agora mesmo e te mando o link de pagamento. Posso reservar?' },
      { type: 'h', text: '3. Retomar quem sumiu' },
      { type: 'quote', text: 'Oi, [NOME]! Vi que você se interessou pelo [PRODUTO] 👀. Ainda tenho o seu tamanho disponível, mas está acabando. Quer garantir o seu hoje?' },
      { type: 'h', text: '4. Fechar a venda' },
      { type: 'quote', text: 'Perfeito! Para deixar tudo pronto, só preciso de [DADO: endereço / tamanho]. Assim que você confirmar o pagamento aqui [LINK], eu preparo o seu pedido e te passo o código de rastreio. 🙌' },
      { type: 'h', text: 'Como não parecer um robô' },
      { type: 'p', text: 'Use o nome do cliente, responda ao que ele realmente disse (não cole a mensagem a frio) e deixe um agente de IA personalizar por você: você define o modelo, a IA adapta a cada conversa e você aprova o que importa.' },
    ],
  },
]
