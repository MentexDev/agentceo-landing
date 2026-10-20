// ─────────────────────────────────────────────────────────────────────────────
// AI news for business owners (en-US) · AgentCEO
//
// English translation of content/noticias.js. Same shape and exports. Each item
// carries `es` (the original Spanish slug, to pair them) and its own English `slug`.
// dateISO, featured, readMinutes and sources (names and URLs) are kept unchanged.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'AI news for your business · AgentCEO',
  eyebrow: 'News',
  h1: 'What’s happening in AI, translated for your business.',
  sub: 'We filter out the noise: only the artificial intelligence news that truly changes how you run your company. Every story, verified and with its source in plain sight.',
}

export const CATEGORIES = ['Models', 'Tools', 'Agents', 'Industry']

export const ITEMS = [
  // ── FEATURED ───────────────────────────────────────────────────────────────
  {
    es: 'shopify-comercio-agentico-q2-2026',
    slug: 'shopify-grows-34-percent-agentic-commerce-ai-purchases-triple',
    title: 'Shopify grows 34% and credits “agentic commerce”: purchases through AI triple',
    category: 'Industry',
    dateISO: '2026-08-05',
    featured: true,
    readMinutes: 3,
    excerpt: 'Traffic and orders coming from AI assistants tripled in a year. Your customers no longer just search on Google: they ask an AI what to buy.',
    body: [
      { type: 'p', text: 'Shopify reported its second-quarter 2026 results with revenue of **$3,583 million**, up 34% from the previous year, and gross merchandise volume (GMV) of **$115,570 million** (+32%). It is its fifth consecutive quarter with GMV growing above 30%.' },
      { type: 'p', text: 'The company credited much of the momentum to **agentic commerce**: traffic reaching stores from AI channels tripled compared with last year, and orders originating from AI-powered searches also tripled.' },
      { type: 'h', text: 'Why it matters to you' },
      { type: 'p', text: 'For years, “showing up on Google” was the front door for customers. Now another one is opening: more and more people ask an AI assistant directly which product to buy, and the AI decides which stores to show. For a retailer, being well presented in those channels stops being futuristic and starts being a real sales front.' },
      { type: 'ul', items: [
        'Revenue of $3,583M (+34%) and GMV of $115,570M (+32%) in Q2 2026.',
        'Traffic from AI channels to stores tripled year over year.',
        'New buyers arriving through AI convert at twice the rate of traditional channels.',
        'Shopify stock rose 18.4% after the report.',
      ] },
    ],
    source: { name: 'Investing.com — Resultados Q2 2026 de Shopify', url: 'https://ca.investing.com/news/company-news/shopify-q2-2026-slides-ai-commerce-drives-3x-traffic-surge-93CH-4777963' },
    sources: [
      { name: 'Investing.com — Resultados Q2 2026 de Shopify', url: 'https://ca.investing.com/news/company-news/shopify-q2-2026-slides-ai-commerce-drives-3x-traffic-surge-93CH-4777963' },
      { name: 'Shopify Newsroom — Q2 2026 financial results', url: 'https://www.shopify.com/news/shopify-q2-2026-financial-results' },
    ],
  },

  // ── MODELS ─────────────────────────────────────────────────────────────────
  {
    es: 'anthropic-claude-opus-5',
    slug: 'anthropic-launches-claude-opus-5-frontier-power-half-the-price',
    title: 'Anthropic launches Claude Opus 5: frontier power at half the price',
    category: 'Models',
    dateISO: '2026-07-24',
    readMinutes: 2,
    excerpt: 'The new model comes close to Anthropic’s most advanced one but costs half as much. Automating complex tasks —analysis, writing, support— gets cheaper.',
    body: [
      { type: 'p', text: 'Anthropic introduced **Claude Opus 5**, a model that, according to the company, comes close to the intelligence of its most advanced model (Claude Fable 5) on many tasks, but at half the price. It became available immediately across all its platforms.' },
      { type: 'p', text: 'Pricing stays at $5 per million input tokens and $25 per million output tokens (the same as Opus 4.8), and it adds a “Fast” mode about 2.5 times faster at twice the base price. It stands out especially in programming, problem solving and research.' },
      { type: 'h', text: 'Why it matters to you' },
      { type: 'p', text: 'When a top-tier model gets cheaper, automating complex work stops being expensive. A business can hand off analysis, proposal writing or technical support to an agent without paying a premium rate for every task.' },
    ],
    source: { name: 'Anthropic (blog oficial)', url: 'https://www.anthropic.com/news/claude-opus-5' },
  },
  {
    es: 'google-gemini-modelos-eficiencia-agentes',
    slug: 'google-launches-three-gemini-models-for-efficiency-and-agents',
    title: 'Google launches three new Gemini models, focused on efficiency and agents',
    category: 'Models',
    dateISO: '2026-07-21',
    readMinutes: 2,
    excerpt: 'Gemini 3.6 Flash and two more variants, designed to lower the cost and latency of high-volume automations. Cheaper models = cheaper tasks.',
    body: [
      { type: 'p', text: 'Google released three new Gemini models —3.6 Flash, 3.5 Flash-Lite and 3.5 Flash Cyber— geared toward efficiency, low latency and reliability for those building AI agents at scale. Notably, it did not include the expected Gemini 3.5 Pro, apparently delayed over performance issues.' },
      { type: 'p', text: '**3.6 Flash** is the “workhorse” model, with better code and up to 17% less token usage than its predecessor, which makes it cheaper. **Flash-Lite** is the most affordable in its class, for high-volume automation, and **Flash Cyber** specializes in finding and fixing vulnerabilities (limited access, in pilot).' },
      { type: 'h', text: 'Why it matters to you' },
      { type: 'p', text: 'Cheaper, faster models lower the cost per task. That lets you run high-volume automations —sorting messages, answering inquiries, following up— without costs spiraling as you grow.' },
    ],
    source: { name: 'TechCrunch', url: 'https://techcrunch.com/2026/07/21/google-releases-three-new-gemini-models-but-no-3-5-pro/' },
  },

  // ── TOOLS ──────────────────────────────────────────────────────────────────
  {
    es: 'claude-modo-voz-integraciones',
    slug: 'claude-revamps-voice-mode-gmail-calendar-slack-canva-notion',
    title: 'Claude revamps its voice mode: you talk, and it connects with Gmail, Calendar, Slack, Canva and Notion',
    category: 'Tools',
    dateISO: '2026-07-23',
    readMinutes: 2,
    excerpt: 'Now you can ask it by voice to schedule a meeting or draft a message using your own work tools, and choose the model that does it.',
    body: [
      { type: 'p', text: 'Anthropic updated Claude’s voice mode so you can choose between the Opus, Sonnet and Haiku models (before, it only used Haiku) and connect it with external apps. You can now ask by voice for it to schedule meetings or draft messages using the tools you already use.' },
      { type: 'ul', items: [
        'Integrates Gmail, Google Calendar, Slack, Canva and Notion to carry out tasks by voice.',
        'Lets you pick the model (Opus/Sonnet/Haiku); the free plan is limited to Haiku and a single connected app.',
        'Supports more than 10 languages, including Spanish.',
        'Available in beta for all users and platforms.',
      ] },
      { type: 'h', text: 'Why it matters to you' },
      { type: 'p', text: 'Running your day by voice —scheduling, drafting emails, updating notes— without touching the keyboard and connecting the tools you already use removes exactly the kind of friction that holds back a non-technical owner. Less friction means more things done in fewer steps.' },
    ],
    source: { name: 'TechCrunch', url: 'https://techcrunch.com/2026/07/23/anthropic-updates-claude-voice-mode-with-more-capable-models/' },
  },

  // ── AGENTS ─────────────────────────────────────────────────────────────────
  {
    es: 'openai-chatgpt-work-agente',
    slug: 'openai-launches-chatgpt-work-agent-office-tasks-start-to-finish',
    title: 'OpenAI launches “ChatGPT Work”: an agent that carries out office tasks from start to finish',
    category: 'Agents',
    dateISO: '2026-07-09',
    readMinutes: 3,
    excerpt: 'It doesn’t just answer: it takes on a full assignment and finishes it —spreadsheets, presentations, documents— even while you’re offline. And it comes with a training program for small businesses.',
    body: [
      { type: 'p', text: 'OpenAI introduced **ChatGPT Work**, an agent powered by the GPT-5.6 model that doesn’t just answer questions: it takes a complete task and carries it out over several hours, even while the user is offline. It produces finished spreadsheets, presentations, documents and even web applications.' },
      { type: 'p', text: 'Alongside it, the company launched **“ChatGPT for Small Businesses”**, with educational resources, live training sessions and practical guides so non-technical business owners can learn to use AI. The stated focus: automate processes and gain productivity without needing to code.' },
      { type: 'h', text: 'Why it matters to you' },
      { type: 'p', text: 'An agent that “delivers finished work” —a budget analysis, a marketing brief— instead of just giving answers changes the math on how much operational work you can delegate without hiring more people.' },
      { type: 'ul', items: [
        'Breaks an assignment into steps and completes them autonomously, across apps and files.',
        'Delivers finished materials: spreadsheets, presentations, documents and web apps.',
        'Available since July 9 for Pro, Enterprise and Edu plans; Plus and Business shortly after.',
        'The desktop app became available immediately on all plans.',
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
    slug: 'claude-for-small-business-prebuilt-agents-finance-sales',
    title: 'Claude for Small Business: prebuilt agents for small-business finance and sales',
    category: 'Agents',
    dateISO: '2026-05-14',
    readMinutes: 3,
    excerpt: 'Ready-to-use workflows that bring AI into QuickBooks, PayPal, HubSpot and more —always with your approval before anything runs. Built for businesses that need it to “work the first week.”',
    body: [
      { type: 'p', text: 'Anthropic introduced **Claude for Small Business**, a bundle of prebuilt agentic workflows and connectors that integrate Claude into QuickBooks, PayPal, HubSpot, Canva, DocuSign, Google Workspace and Microsoft 365. It covers tasks such as payroll planning, invoice collection, month-end reconciliation, sales campaigns and contract routing.' },
      { type: 'p', text: 'A key point: the agent **asks the owner for approval before carrying out** any action. It includes 15 ready-to-use workflows, 15 “skills,” a free AI fluency course developed with PayPal and a 10-city tour kicking off in Chicago.' },
      { type: 'h', text: 'Why it matters to you' },
      { type: 'p', text: 'It is explicitly designed for small businesses that, in the company’s own words, “don’t need a governance committee to automate their accounting, they need the tool to work the first week.” It is the case most directly applicable to a non-technical owner.' },
    ],
    source: { name: 'PYMNTS', url: 'https://www.pymnts.com/artificial-intelligence-2/2026/anthropic-launches-claude-ai-agents-for-small-business-finance/' },
  },

  // ── INDUSTRY ───────────────────────────────────────────────────────────────
  {
    es: 'ue-ley-ia-transparencia-agosto-2026',
    slug: 'eu-ai-act-now-requires-disclosing-ai-chatbots-and-generated-content',
    title: 'The EU AI Act now requires disclosing when a chatbot or a piece of content is AI-generated',
    category: 'Industry',
    dateISO: '2026-08-02',
    readMinutes: 3,
    excerpt: 'Since August 2, if your system talks with people or generates images, audio, video or text, you must say it’s AI and label that content. With fines of up to 15 million euros.',
    body: [
      { type: 'p', text: 'On August 2, 2026, the transparency obligations of Article 50 of the European Union’s AI Act began to apply. Any company whose system talks with people or generates images, audio, video or text must **disclose that it is AI** and **label the generated content**, whether or not it is a “high-risk” system.' },
      { type: 'ul', items: [
        'Users must be clearly informed when they are interacting with an AI and not a real person.',
        'Generated or manipulated content (including deepfakes) must be labeled in a machine-detectable format.',
        'Fines of up to 15 million euros or 3% of annual worldwide turnover, whichever is higher.',
        'Generative systems already on the market have until December 2, 2026 to comply with the labeling.',
      ] },
      { type: 'h', text: 'Why it matters to you' },
      { type: 'p', text: 'If your business uses a customer service chatbot or generates images and text with AI to sell, you are now legally required to tell your customers when you operate in or sell into the EU. It’s not just compliance: transparency done well also builds trust.' },
    ],
    source: { name: 'Comisión Europea (nota oficial)', url: 'https://commission.europa.eu/news-and-media/news/safer-and-more-transparent-ai-2026-08-02_en' },
  },
  {
    es: 'pymes-eeuu-adopcion-ia-66-formacion',
    slug: 'us-small-business-ai-adoption-hits-66-percent-owners-want-training',
    title: 'AI adoption among U.S. small businesses rises to 66%, but 7 in 10 owners want more training',
    category: 'Industry',
    dateISO: '2026-07-15',
    readMinutes: 2,
    excerpt: 'AI is already delivering concrete returns for small businesses —revenue, time, costs— but the barrier isn’t buying it: it’s learning to use it well.',
    body: [
      { type: 'p', text: 'A survey by the Thryv platform of 561 owners and decision-makers at small and midsize businesses (none of them affiliated with Thryv) shows that AI adoption rose to **66%**, 11 points higher than a year ago, and that owners report a real impact on revenue and time —though almost all of them feel they lack training.' },
      { type: 'ul', items: [
        'AI adoption among small businesses at 66% (+11 points year over year); 86% say they are comfortable using it.',
        '70% report that AI increased their revenue over the last year; 92% say it saves them time and 55% that it cut costs.',
        '70% of owners admit they need more training to use it effectively.',
        '46% would rather use AI than hire a new employee.',
      ] },
      { type: 'h', text: 'Why it matters to you' },
      { type: 'p', text: 'For a small-business owner, AI is already delivering results, but what separates real savings from wasted spend isn’t the tool, it’s knowing how to use it. Investing in training your team pays off more than adding another subscription.' },
    ],
    source: { name: 'Carrier Management (encuesta de Thryv)', url: 'https://www.carriermanagement.com/news/2026/07/15/290015.htm' },
  },
]
