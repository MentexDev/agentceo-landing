// ─────────────────────────────────────────────────────────────────────────────
// Notícias de IA para donos de negócio (pt-BR) · AgentCEO
//
// Tradução para português do Brasil de content/noticias.js. Mesma forma e mesmos
// exports que content/en/noticias.js. Cada item leva `es` (o slug original em
// espanhol, para pareá-los) e o seu próprio `slug` em português.
// dateISO, featured, readMinutes e sources (nomes e URLs) ficam iguais.
// Regra anti-fake: tradução fiel, sem acrescentar nenhum dado à fonte.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Notícias de IA para o seu negócio · AgentCEO',
  eyebrow: 'Notícias',
  h1: 'O que acontece na IA, traduzido para o seu negócio.',
  sub: 'A gente filtra o ruído: só as novidades de inteligência artificial que realmente mudam o jeito como você toca a sua empresa. Cada notícia verificada e com a fonte à vista.',
}

export const CATEGORIES = ['Modelos', 'Ferramentas', 'Agentes', 'Mercado']

export const ITEMS = [
  // ── DESTAQUE ───────────────────────────────────────────────────────────────
  {
    es: 'shopify-comercio-agentico-q2-2026',
    slug: 'shopify-cresce-34-por-cento-comercio-agentico-compras-via-ia-triplicam',
    title: 'Shopify cresce 34% e credita o resultado ao “comércio agêntico”: as compras via IA triplicam',
    category: 'Mercado',
    dateISO: '2026-08-05',
    featured: true,
    readMinutes: 3,
    excerpt: 'O tráfego e os pedidos que chegam de assistentes de IA triplicaram em um ano. Seus clientes já não buscam só no Google: eles perguntam a uma IA o que comprar.',
    body: [
      { type: 'p', text: 'A Shopify divulgou os resultados do segundo trimestre de 2026 com receita de **US$ 3.583 milhões**, 34% a mais que no ano anterior, e volume bruto de mercadorias (GMV) de **US$ 115.570 milhões** (+32%). É o quinto trimestre seguido com o GMV crescendo acima de 30%.' },
      { type: 'p', text: 'A empresa atribuiu boa parte desse impulso ao **comércio agêntico**: o tráfego que chega às lojas por canais de IA triplicou em relação ao ano passado, e os pedidos originados em buscas feitas com IA também triplicaram.' },
      { type: 'h', text: 'Por que isso importa para você' },
      { type: 'p', text: 'Durante anos, “aparecer no Google” foi a porta de entrada dos clientes. Agora se abre outra: cada vez mais gente pergunta direto a um assistente de IA qual produto comprar, e é a IA que decide quais lojas mostrar. Para um varejista, estar bem apresentado nesses canais deixa de ser coisa do futuro e passa a ser uma frente real de vendas.' },
      { type: 'ul', items: [
        'Receita de US$ 3.583 mi (+34%) e GMV de US$ 115.570 mi (+32%) no 2º tri de 2026.',
        'O tráfego vindo de canais de IA para as lojas triplicou na comparação anual.',
        'Os novos compradores que chegam pela IA convertem o dobro da taxa dos canais tradicionais.',
        'A ação da Shopify subiu 18,4% depois do relatório.',
      ] },
    ],
    source: { name: 'Investing.com — Resultados Q2 2026 de Shopify', url: 'https://ca.investing.com/news/company-news/shopify-q2-2026-slides-ai-commerce-drives-3x-traffic-surge-93CH-4777963' },
    sources: [
      { name: 'Investing.com — Resultados Q2 2026 de Shopify', url: 'https://ca.investing.com/news/company-news/shopify-q2-2026-slides-ai-commerce-drives-3x-traffic-surge-93CH-4777963' },
      { name: 'Shopify Newsroom — Q2 2026 financial results', url: 'https://www.shopify.com/news/shopify-q2-2026-financial-results' },
    ],
  },

  // ── MODELOS ────────────────────────────────────────────────────────────────
  {
    es: 'anthropic-claude-opus-5',
    slug: 'anthropic-lanca-claude-opus-5-potencia-de-fronteira-pela-metade-do-preco',
    title: 'Anthropic lança o Claude Opus 5: potência de fronteira pela metade do preço',
    category: 'Modelos',
    dateISO: '2026-07-24',
    readMinutes: 2,
    excerpt: 'O novo modelo chega perto do mais avançado da Anthropic, mas custa a metade. Automatizar tarefas complexas —análise, redação, suporte— fica mais barato.',
    body: [
      { type: 'p', text: 'A Anthropic apresentou o **Claude Opus 5**, um modelo que, segundo a empresa, se aproxima da inteligência do seu modelo mais avançado (Claude Fable 5) em muitas tarefas, mas pela metade do preço. Ele ficou disponível imediatamente em todas as suas plataformas.' },
      { type: 'p', text: 'O preço se mantém em US$ 5 por milhão de tokens de entrada e US$ 25 por milhão de tokens de saída (o mesmo do Opus 4.8), e ele traz um modo “Fast” cerca de 2,5 vezes mais rápido, pelo dobro do preço base. Ele se destaca especialmente em programação, resolução de problemas e pesquisa.' },
      { type: 'h', text: 'Por que isso importa para você' },
      { type: 'p', text: 'Quando um modelo de primeira linha fica mais barato, automatizar trabalho complexo deixa de ser caro. Um negócio pode delegar análises, redação de propostas ou suporte técnico a um agente sem pagar uma tarifa premium por cada tarefa.' },
    ],
    source: { name: 'Anthropic (blog oficial)', url: 'https://www.anthropic.com/news/claude-opus-5' },
  },
  {
    es: 'google-gemini-modelos-eficiencia-agentes',
    slug: 'google-lanca-tres-novos-modelos-gemini-focados-em-eficiencia-e-agentes',
    title: 'Google lança três novos modelos Gemini, focados em eficiência e agentes',
    category: 'Modelos',
    dateISO: '2026-07-21',
    readMinutes: 2,
    excerpt: 'O Gemini 3.6 Flash e mais duas variantes, pensados para baixar o custo e a latência das automações de alto volume. Modelos mais baratos = tarefas mais baratas.',
    body: [
      { type: 'p', text: 'O Google lançou três novos modelos Gemini —3.6 Flash, 3.5 Flash-Lite e 3.5 Flash Cyber— voltados para eficiência, baixa latência e confiabilidade para quem constrói agentes de IA em escala. Chamou atenção a ausência do esperado Gemini 3.5 Pro, que ao que tudo indica atrasou por questões de desempenho.' },
      { type: 'p', text: 'O **3.6 Flash** é o modelo “para o dia a dia”, com código melhor e até 17% menos uso de tokens que o antecessor, o que o deixa mais barato. O **Flash-Lite** é o mais econômico da sua categoria, para automação de alto volume, e o **Flash Cyber** é especializado em encontrar e corrigir vulnerabilidades (acesso limitado, em fase piloto).' },
      { type: 'h', text: 'Por que isso importa para você' },
      { type: 'p', text: 'Modelos mais baratos e mais rápidos reduzem o custo por tarefa. Isso permite rodar automações de alto volume —classificar mensagens, responder dúvidas, fazer acompanhamento— sem que os gastos disparem à medida que você cresce.' },
    ],
    source: { name: 'TechCrunch', url: 'https://techcrunch.com/2026/07/21/google-releases-three-new-gemini-models-but-no-3-5-pro/' },
  },

  // ── FERRAMENTAS ────────────────────────────────────────────────────────────
  {
    es: 'claude-modo-voz-integraciones',
    slug: 'claude-renova-modo-de-voz-gmail-calendar-slack-canva-notion',
    title: 'Claude renova o modo de voz: você fala, e ele se conecta ao Gmail, Calendar, Slack, Canva e Notion',
    category: 'Ferramentas',
    dateISO: '2026-07-23',
    readMinutes: 2,
    excerpt: 'Agora você pode pedir por voz que ele marque uma reunião ou escreva uma mensagem usando as suas próprias ferramentas de trabalho, e escolher o modelo que faz isso.',
    body: [
      { type: 'p', text: 'A Anthropic atualizou o modo de voz do Claude para permitir escolher entre os modelos Opus, Sonnet e Haiku (antes ele só usava o Haiku) e se conectar a aplicativos externos. Agora você pode pedir por voz que ele marque reuniões ou escreva mensagens usando as ferramentas que você já usa.' },
      { type: 'ul', items: [
        'Integra Gmail, Google Calendar, Slack, Canva e Notion para executar tarefas por voz.',
        'Permite escolher o modelo (Opus/Sonnet/Haiku); o plano gratuito fica limitado ao Haiku e a um único app conectado.',
        'Suporta mais de 10 idiomas, incluindo o espanhol.',
        'Disponível em beta para todos os usuários e plataformas.',
      ] },
      { type: 'h', text: 'Por que isso importa para você' },
      { type: 'p', text: 'Tocar o seu dia por voz —marcar compromissos, escrever e-mails, atualizar anotações— sem encostar no teclado e conectando as ferramentas que você já usa elimina justamente o tipo de atrito que trava um dono de negócio que não é da área técnica. Menos atrito significa mais coisas resolvidas em menos passos.' },
    ],
    source: { name: 'TechCrunch', url: 'https://techcrunch.com/2026/07/23/anthropic-updates-claude-voice-mode-with-more-capable-models/' },
  },

  // ── AGENTES ────────────────────────────────────────────────────────────────
  {
    es: 'openai-chatgpt-work-agente',
    slug: 'openai-lanca-chatgpt-work-agente-que-executa-tarefas-de-escritorio-do-inicio-ao-fim',
    title: 'OpenAI lança o “ChatGPT Work”: um agente que executa tarefas de escritório do início ao fim',
    category: 'Agentes',
    dateISO: '2026-07-09',
    readMinutes: 3,
    excerpt: 'Ele não só responde: pega uma tarefa completa e a termina —planilhas, apresentações, documentos— mesmo com você offline. E chega com um programa de capacitação para pequenas empresas.',
    body: [
      { type: 'p', text: 'A OpenAI apresentou o **ChatGPT Work**, um agente movido pelo modelo GPT-5.6 que não só responde perguntas: ele pega uma tarefa completa e a executa ao longo de várias horas, inclusive enquanto o usuário está offline. Ele entrega planilhas, apresentações, documentos e até aplicativos web prontos.' },
      { type: 'p', text: 'Ao mesmo tempo, a empresa lançou o **“ChatGPT para Pequenas Empresas”**, com recursos educativos, treinamentos ao vivo e guias práticos para que donos de negócio sem perfil técnico aprendam a usar a IA. O foco declarado: automatizar processos e ganhar produtividade sem precisar programar.' },
      { type: 'h', text: 'Por que isso importa para você' },
      { type: 'p', text: 'Um agente que “entrega trabalho pronto” —uma análise de orçamento, um briefing de marketing— em vez de só dar respostas muda a conta de quanto trabalho operacional você consegue delegar sem contratar mais gente.' },
      { type: 'ul', items: [
        'Divide uma tarefa em etapas e as conclui de forma autônoma, passando por apps e arquivos.',
        'Entrega materiais prontos: planilhas, apresentações, documentos e web apps.',
        'Disponível desde 9 de julho para os planos Pro, Enterprise e Edu; Plus e Business pouco depois.',
        'O app para desktop ficou disponível imediatamente em todos os planos.',
      ] },
    ],
    source: { name: 'PYMNTS', url: 'https://www.pymnts.com/news/artificial-intelligence/2026/openai-launches-chatgpt-agent-that-executes-complex-workflows/' },
    sources: [
      { name: 'PYMNTS — OpenAI launches ChatGPT Work', url: 'https://www.pymnts.com/news/artificial-intelligence/2026/openai-launches-chatgpt-agent-that-executes-complex-workflows/' },
      { name: 'Forbes — New ChatGPT training for small businesses', url: 'https://www.forbes.com/sites/quickerbettertech/2026/07/26/new-chatgpt-training-for-small-businesses-and-other-technology-news-this-week-for-your-business/' },
    ],
  },
  {
    es: 'anthropic-claude-for-small-business',
    slug: 'claude-for-small-business-agentes-prontos-para-financas-e-vendas',
    title: 'Claude for Small Business: agentes prontos para as finanças e as vendas de pequenas empresas',
    category: 'Agentes',
    dateISO: '2026-05-14',
    readMinutes: 3,
    excerpt: 'Fluxos de trabalho prontos para usar que colocam a IA dentro do QuickBooks, PayPal, HubSpot e outros —sempre com a sua aprovação antes de executar. Pensado para negócios que precisam que tudo “funcione na primeira semana”.',
    body: [
      { type: 'p', text: 'A Anthropic apresentou o **Claude for Small Business**, um pacote de fluxos de trabalho agênticos prontos e de conectores que integram o Claude ao QuickBooks, PayPal, HubSpot, Canva, DocuSign, Google Workspace e Microsoft 365. Ele cobre tarefas como planejamento da folha de pagamento, cobrança de faturas, conciliação de fim de mês, campanhas de vendas e encaminhamento de contratos.' },
      { type: 'p', text: 'Um ponto-chave: o agente **pede a aprovação do dono antes de executar** qualquer ação. Inclui 15 fluxos de trabalho prontos para usar, 15 “skills”, um curso gratuito de fluência em IA desenvolvido com o PayPal e uma turnê por 10 cidades que começa em Chicago.' },
      { type: 'h', text: 'Por que isso importa para você' },
      { type: 'p', text: 'Ele foi pensado explicitamente para pequenos negócios que, nas palavras da própria empresa, “não precisam de um comitê de governança para automatizar a contabilidade, precisam que a ferramenta funcione na primeira semana”. É o caso que se aplica mais diretamente a um dono de negócio sem perfil técnico.' },
    ],
    source: { name: 'PYMNTS', url: 'https://www.pymnts.com/artificial-intelligence-2/2026/anthropic-launches-claude-ai-agents-for-small-business-finance/' },
  },

  // ── MERCADO ────────────────────────────────────────────────────────────────
  {
    es: 'ue-ley-ia-transparencia-agosto-2026',
    slug: 'lei-de-ia-da-ue-ja-exige-avisar-quando-chatbot-ou-conteudo-e-gerado-por-ia',
    title: 'A Lei de IA da UE já exige avisar quando um chatbot ou um conteúdo é gerado por IA',
    category: 'Mercado',
    dateISO: '2026-08-02',
    readMinutes: 3,
    excerpt: 'Desde 2 de agosto, se o seu sistema conversa com pessoas ou gera imagens, áudio, vídeo ou texto, você precisa dizer que é IA e identificar esse conteúdo. Com multas de até 15 milhões de euros.',
    body: [
      { type: 'p', text: 'Em 2 de agosto de 2026 começaram a valer as obrigações de transparência do Artigo 50 da Lei de IA da União Europeia. Qualquer empresa cujo sistema converse com pessoas ou gere imagens, áudio, vídeo ou texto precisa **avisar que é IA** e **identificar o conteúdo gerado**, seja ou não um sistema de “alto risco”.' },
      { type: 'ul', items: [
        'Os usuários devem ser informados com clareza quando estão interagindo com uma IA, e não com uma pessoa real.',
        'O conteúdo gerado ou manipulado (incluindo deepfakes) deve ser identificado em um formato detectável por máquina.',
        'Multas de até 15 milhões de euros ou 3% do faturamento anual mundial, o que for maior.',
        'Os sistemas generativos que já estão no mercado têm até 2 de dezembro de 2026 para se adequar à identificação.',
      ] },
      { type: 'h', text: 'Por que isso importa para você' },
      { type: 'p', text: 'Se o seu negócio usa um chatbot de atendimento ou gera imagens e textos com IA para vender, agora você é legalmente obrigado a avisar os seus clientes quando opera ou vende para a UE. Não é só cumprir a lei: a transparência bem feita também gera confiança.' },
    ],
    source: { name: 'Comisión Europea (nota oficial)', url: 'https://commission.europa.eu/news-and-media/news/safer-and-more-transparent-ai-2026-08-02_en' },
  },
  {
    es: 'pymes-eeuu-adopcion-ia-66-formacion',
    slug: 'adocao-de-ia-em-pequenas-empresas-dos-eua-sobe-para-66-por-cento-mas-donos-pedem-mais-capacitacao',
    title: 'A adoção de IA em pequenas empresas dos EUA sobe para 66%, mas 7 em cada 10 donos pedem mais capacitação',
    category: 'Mercado',
    dateISO: '2026-07-15',
    readMinutes: 2,
    excerpt: 'A IA já dá retorno concreto às pequenas empresas —receita, tempo, custos—, mas a barreira não é comprá-la: é aprender a usá-la bem.',
    body: [
      { type: 'p', text: 'Uma pesquisa da plataforma Thryv com 561 donos e tomadores de decisão de pequenas e médias empresas (nenhum deles ligado à Thryv) mostra que a adoção de IA subiu para **66%**, 11 pontos a mais que há um ano, e que os donos relatam impacto real na receita e no tempo —embora quase todos sintam que falta capacitação.' },
      { type: 'ul', items: [
        'Adoção de IA nas pequenas empresas em 66% (+11 pontos na comparação anual); 86% dizem se sentir à vontade usando a tecnologia.',
        '70% relatam que a IA aumentou a receita no último ano; 92% dizem que ela economiza tempo e 55%, que reduziu custos.',
        '70% dos donos admitem que precisam de mais capacitação para usá-la com eficácia.',
        '46% prefeririam usar IA a contratar um novo funcionário.',
      ] },
      { type: 'h', text: 'Por que isso importa para você' },
      { type: 'p', text: 'Para o dono de uma pequena empresa, a IA já está dando resultado, mas o que separa a economia real do gasto à toa não é a ferramenta, é saber usá-la. Investir na capacitação da equipe rende mais do que somar mais uma assinatura.' },
    ],
    source: { name: 'Carrier Management (encuesta de Thryv)', url: 'https://www.carriermanagement.com/news/2026/07/15/290015.htm' },
  },
]
