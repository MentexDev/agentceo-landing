// ─────────────────────────────────────────────────────────────────────────────
// Blog do AgentCEO — tradução para português do Brasil de content/blog.js.
// Cada item mantém `es` (o slug original em espanhol) para pareá-lo com a fonte.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Blog de IA para o seu negócio · Agent CEO',
  eyebrow: 'Blog',
  h1: 'Ideias para tocar o seu negócio com IA.',
  sub: 'Guias claros, sem jargão, para donos de negócio que querem delegar de verdade —e não aprender a programar.',
}

export const CATEGORIES = ['Fundamentos', 'Automação', 'Estratégia']

export const ITEMS = [
  {
    es: 'que-es-un-agente-de-ia',
    slug: 'o-que-e-de-verdade-um-agente-de-ia-e-por-que-nao-e-um-chatbot',
    title: 'O que é, de verdade, um agente de IA (e por que não é um chatbot)',
    category: 'Fundamentos',
    dateISO: '2026-08-07',
    featured: true,
    readMinutes: 4,
    excerpt: 'Um chatbot responde. Um agente age. A diferença não é técnica: é o que separa “ter uma ferramenta” de “ter alguém que faz o trabalho”.',
    body: [
      { type: 'p', text: 'Quando alguém fala em “inteligência artificial”, quase sempre imagina um chatbot: você escreve uma pergunta e ele te dá uma resposta. Útil, mas passivo. Um **agente de IA** é outra coisa: ele não espera você perguntar, ele leva uma tarefa do começo ao fim.' },
      { type: 'h', text: 'A diferença, em uma frase' },
      { type: 'p', text: 'Um chatbot te diz **como** fazer algo. Um agente **faz**. Você pede “monte o relatório de vendas desta semana e me mande”, e o agente busca os dados, monta o relatório, revisa e te entrega —sem você precisar mexer em cada etapa.' },
      { type: 'h', text: 'O que faz de um agente um agente' },
      { type: 'ul', items: [
        '**Persegue um objetivo**, e não só responde uma mensagem: ele divide o pedido em etapas.',
        '**Usa ferramentas**: se conecta à sua loja, ao seu WhatsApp, ao seu estoque, e age lá dentro.',
        '**Trabalha sozinho**: pode continuar mesmo depois que você fecha o computador.',
        '**Aprende o seu contexto**: lembra das suas preferências e de como você gosta que as coisas sejam feitas.',
      ] },
      { type: 'h', text: 'Por que isso importa para você, como dono' },
      { type: 'p', text: 'A pergunta deixa de ser “o que eu pergunto para a IA?” e passa a ser “o que eu delego para ela?”. É o salto de ter uma ferramenta para ter uma equipe. E essa equipe não substitui o seu critério: ela o libera para o que realmente precisa da sua atenção.' },
    ],
  },
  {
    es: 'primeras-tareas-para-delegar-a-un-agente',
    slug: 'primeiras-tarefas-para-delegar-a-um-agente-e-as-que-nao',
    title: 'As primeiras tarefas que você deveria delegar a um agente (e as que não)',
    category: 'Automação',
    dateISO: '2026-08-06',
    readMinutes: 5,
    excerpt: 'Não comece pelo mais difícil nem pelo mais delicado. Comece pelo repetitivo, pelo que você odeia fazer e pelo que não exige o seu critério.',
    body: [
      { type: 'p', text: 'O erro mais comum na hora de automatizar é começar pelo que mais brilha. O que funciona de verdade é começar pelo **repetitivo e de baixo risco**: tarefas que você faz quase do mesmo jeito toda semana e que não dependem do seu critério.' },
      { type: 'h', text: 'Boas candidatas para delegar primeiro' },
      { type: 'ul', items: [
        '**Relatórios recorrentes**: vendas do dia, estoque baixo, resumo da semana.',
        '**Primeiro atendimento**: responder perguntas frequentes no WhatsApp enquanto você dorme.',
        '**Acompanhamento de leads**: retomar o contato com quem escreveu e não comprou.',
        '**Conteúdo base**: rascunhos de posts e descrições de produto.',
      ] },
      { type: 'h', text: 'O que você NÃO deveria delegar (ainda)' },
      { type: 'ul', items: [
        'Decisões que mudam o rumo do negócio.',
        'Conversas delicadas: um cliente irritado, uma questão jurídica ou um assunto de dinheiro sensível.',
        'Qualquer ação irreversível sem a sua aprovação (pagamentos, publicações delicadas).',
      ] },
      { type: 'h', text: 'A regra de ouro' },
      { type: 'p', text: 'Automatize a **execução**, fique com a **decisão**. Um bom agente faz o trabalho pesado e deixa o aval final com você. Comece por uma única tarefa, acompanhe ela funcionando por uma semana e depois some a próxima. Os números confirmam a ideia: em uma pesquisa recente com pequenas empresas dos EUA, 92% dos donos que já usam IA disseram que ela economiza o tempo deles.' },
    ],
    sources: [
      { name: 'Carrier Management — encuesta de Thryv a pymes (2026)', url: 'https://www.carriermanagement.com/news/2026/07/15/290015.htm' },
    ],
  },
  {
    es: 'delegar-sin-perder-el-control',
    slug: 'delegar-sem-perder-o-controle-por-que-a-aprovacao-humana-muda-tudo',
    title: 'Delegar sem perder o controle: por que a aprovação humana muda tudo',
    category: 'Estratégia',
    dateISO: '2026-08-05',
    readMinutes: 4,
    excerpt: 'O medo de automatizar quase nunca é da IA: é de perder o controle. A saída não é fazer tudo sozinho, é aprovar o que importa.',
    body: [
      { type: 'p', text: 'Muitos donos hesitam em delegar a um agente por um motivo legítimo: **“e se ele fizer algo que eu não faria?”**. É a pergunta certa. A resposta não é fugir da IA, é desenhar o controle adequado.' },
      { type: 'h', text: 'Executar não é decidir' },
      { type: 'p', text: 'Um bom agente separa duas coisas que costumamos misturar: **fazer o trabalho** e **decidir que algo seja publicado, enviado ou pago**. O agente faz; você aprova o que tem consequências. Nada importante sai sem a sua assinatura.' },
      { type: 'p', text: 'Essa não é uma ideia só nossa. Quando a Anthropic lançou o seu pacote de agentes para pequenas empresas, o desenho central era exatamente esse: o agente prepara a folha de pagamento, a conciliação ou a campanha, mas **pede a aprovação do dono antes de executar**.' },
      { type: 'h', text: 'Como isso fica na prática' },
      { type: 'ul', items: [
        'O agente te mostra o que vai fazer, e não só o que já fez.',
        'Você aprova com um clique —ou pede ajustes.',
        'O que é rotineiro e reversível pode rodar sozinho; o que é delicado espera o seu ok.',
      ] },
      { type: 'p', text: 'É assim que você delega de verdade sem largar o volante. O controle não está em apertar cada tecla: está em decidir o que merece a sua atenção.' },
    ],
    sources: [
      { name: 'PYMNTS — Anthropic lanza Claude for Small Business', url: 'https://www.pymnts.com/artificial-intelligence-2/2026/anthropic-launches-claude-ai-agents-for-small-business-finance/' },
    ],
  },
  {
    es: 'tus-clientes-le-preguntan-a-la-ia-que-comprar',
    slug: 'seus-clientes-ja-perguntam-a-ia-o-que-comprar-seu-negocio-aparece',
    title: 'Seus clientes já perguntam à IA o que comprar. O seu negócio aparece?',
    category: 'Estratégia',
    dateISO: '2026-08-06',
    readMinutes: 4,
    excerpt: 'A vitrine está mudando de lugar. Cada vez mais gente não busca no Google: pergunta a um assistente de IA. E é a IA que decide quais lojas mostrar.',
    body: [
      { type: 'p', text: 'Durante vinte anos, “ser encontrado” significou aparecer no Google. Isso está mudando. Cada vez mais pessoas perguntam direto a um assistente de IA qual produto comprar, e é a IA que decide quais lojas recomendar.' },
      { type: 'p', text: 'Não é uma previsão: já está acontecendo em grande escala. No relatório do segundo trimestre de 2026, a **Shopify** informou que o tráfego para as lojas vindo de canais de IA **triplicou** em um ano, e que os novos compradores que chegam pela IA convertem o dobro da taxa dos canais tradicionais.' },
      { type: 'h', text: 'O que isso significa para um pequeno negócio' },
      { type: 'ul', items: [
        'As informações dos seus produtos (nome, descrição, preço, disponibilidade) precisam estar **claras e atualizadas**: agora quem lê é uma IA, e não só uma pessoa.',
        'Responder rápido e bem nos seus canais passa a pesar mais: a IA premia o que funciona.',
        'O atendimento deixa de ter “horário comercial”: quem pergunta às 11 da noite espera resposta.',
      ] },
      { type: 'h', text: 'A boa notícia' },
      { type: 'p', text: 'Você não precisa de uma equipe de tecnologia para isso. Precisa que a sua operação —catálogo, atendimento, acompanhamento— esteja organizada e acordada. Exatamente o que uma equipe de agentes pode manter funcionando por você.' },
    ],
    sources: [
      { name: 'Investing.com — Resultados Q2 2026 de Shopify', url: 'https://ca.investing.com/news/company-news/shopify-q2-2026-slides-ai-commerce-drives-3x-traffic-surge-93CH-4777963' },
    ],
  },
]
