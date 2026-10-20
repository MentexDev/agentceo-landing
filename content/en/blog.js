// ─────────────────────────────────────────────────────────────────────────────
// AgentCEO Blog — US English translation of content/blog.js.
// Each item keeps `es` (the original Spanish slug) to pair it with its source.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Blog · Agent CEO',
  eyebrow: 'Blog',
  h1: 'Ideas for running your business with AI.',
  sub: 'Clear, jargon-free guides for business owners who want to truly delegate —not learn to code.',
}

export const CATEGORIES = ['Fundamentals', 'Automation', 'Strategy']

export const ITEMS = [
  {
    es: 'que-es-un-agente-de-ia',
    slug: 'what-an-ai-agent-really-is-and-why-its-not-a-chatbot',
    title: 'What an AI agent really is (and why it’s not a chatbot)',
    category: 'Fundamentals',
    dateISO: '2026-08-07',
    featured: true,
    readMinutes: 4,
    excerpt: 'A chatbot answers. An agent acts. The difference isn’t technical: it’s the line between “having a tool” and “having someone who does the work.”',
    body: [
      { type: 'p', text: 'When people hear “artificial intelligence,” they almost always picture a chatbot: you type a question, it gives you an answer. Useful, but passive. An **AI agent** is something else: it doesn’t wait for you to ask, it carries a task through from start to finish.' },
      { type: 'h', text: 'The difference, in one sentence' },
      { type: 'p', text: 'A chatbot tells you **how** to do something. An agent **does** it. You ask it to “put together this week’s sales report and send it to me,” and the agent finds the data, builds the report, checks it and delivers it —without you touching every step.' },
      { type: 'h', text: 'What makes an agent an agent' },
      { type: 'ul', items: [
        '**It pursues a goal**, not just a single message: it breaks the request into steps.',
        '**It uses tools**: it connects to your store, your WhatsApp, your inventory, and takes action there.',
        '**It works on its own**: it can keep going even after you close your laptop.',
        '**It learns your context**: it remembers your preferences and how you like things done.',
      ] },
      { type: 'h', text: 'Why it matters to you as an owner' },
      { type: 'p', text: 'The question stops being “what should I ask the AI?” and becomes “what should I hand off to it?”. It’s the leap from having a tool to having a team. And that team doesn’t replace your judgment: it frees it up for what truly needs your attention.' },
    ],
  },
  {
    es: 'primeras-tareas-para-delegar-a-un-agente',
    slug: 'first-tasks-to-delegate-to-an-agent-and-the-ones-you-shouldnt',
    title: 'The first tasks you should delegate to an agent (and the ones you shouldn’t)',
    category: 'Automation',
    dateISO: '2026-08-06',
    readMinutes: 5,
    excerpt: 'Don’t start with the hardest or the most sensitive work. Start with what’s repetitive, what you hate doing, and what doesn’t need your judgment.',
    body: [
      { type: 'p', text: 'The most common mistake when automating is starting with the flashiest thing. What actually works is starting with the **repetitive, low-risk** stuff: tasks you do almost the same way every week that don’t depend on your judgment.' },
      { type: 'h', text: 'Good candidates to delegate first' },
      { type: 'ul', items: [
        '**Recurring reports**: daily sales, low inventory, weekly summary.',
        '**First-response customer service**: answering frequently asked questions on WhatsApp while you sleep.',
        '**Lead follow-up**: getting back to people who reached out but didn’t buy.',
        '**Starter content**: drafts of social posts and product descriptions.',
      ] },
      { type: 'h', text: 'What you should NOT delegate (yet)' },
      { type: 'ul', items: [
        'Decisions that change the direction of your business.',
        'Sensitive conversations: an upset customer, a legal matter or a delicate money issue.',
        'Any irreversible action without your approval (payments, sensitive posts).',
      ] },
      { type: 'h', text: 'The golden rule' },
      { type: 'p', text: 'Automate the **doing**, keep the **deciding**. A good agent handles the heavy lifting and leaves you the final sign-off. Start with a single task, watch it work for a week, then add the next one. The numbers back this up: in a recent survey of US small businesses, 92% of owners already using AI said it saves them time.' },
    ],
    sources: [
      { name: 'Carrier Management — encuesta de Thryv a pymes (2026)', url: 'https://www.carriermanagement.com/news/2026/07/15/290015.htm' },
    ],
  },
  {
    es: 'delegar-sin-perder-el-control',
    slug: 'delegate-without-losing-control-why-human-approval-changes-everything',
    title: 'Delegate without losing control: why human approval changes everything',
    category: 'Strategy',
    dateISO: '2026-08-05',
    readMinutes: 4,
    excerpt: 'The fear of automating is almost never about AI: it’s about losing control. The answer isn’t doing everything yourself, it’s approving what matters.',
    body: [
      { type: 'p', text: 'Many owners hesitate to delegate to an agent for a legitimate reason: **“what if it does something I wouldn’t have done?”**. That’s the right question. The answer isn’t avoiding AI, it’s designing the right controls.' },
      { type: 'h', text: 'Doing is not deciding' },
      { type: 'p', text: 'A good agent separates two things we tend to mix up: **doing the work** and **deciding that something gets published, sent or paid**. The agent does; you approve whatever has consequences. Nothing important goes out without your sign-off.' },
      { type: 'p', text: 'This isn’t just our idea. When Anthropic launched its agent package for small businesses, the core design was exactly that: the agent prepares the payroll, the reconciliation or the campaign, but **asks for the owner’s approval before executing**.' },
      { type: 'h', text: 'What it looks like in practice' },
      { type: 'ul', items: [
        'The agent shows you what it’s about to do, not just what it already did.',
        'You approve with one click —or ask for changes.',
        'Routine, reversible work can run on its own; sensitive work waits for your OK.',
      ] },
      { type: 'p', text: 'That’s how you truly delegate without letting go of the wheel. Control isn’t about touching every key: it’s about deciding what deserves your attention.' },
    ],
    sources: [
      { name: 'PYMNTS — Anthropic lanza Claude for Small Business', url: 'https://www.pymnts.com/artificial-intelligence-2/2026/anthropic-launches-claude-ai-agents-for-small-business-finance/' },
    ],
  },
  {
    es: 'tus-clientes-le-preguntan-a-la-ia-que-comprar',
    slug: 'your-customers-already-ask-ai-what-to-buy-does-your-business-show-up',
    title: 'Your customers already ask AI what to buy. Does your business show up?',
    category: 'Strategy',
    dateISO: '2026-08-06',
    readMinutes: 4,
    excerpt: 'The storefront is moving. More and more people don’t search Google: they ask an AI assistant. And the AI decides which stores to show.',
    body: [
      { type: 'p', text: 'For twenty years, “getting found” meant showing up on Google. That’s changing. More and more people ask an AI assistant directly which product to buy, and it’s the AI that decides which stores to recommend.' },
      { type: 'p', text: 'This isn’t a prediction: it’s already happening at scale. In its Q2 2026 report, **Shopify** said traffic to stores from AI channels **tripled** in a year, and that new shoppers arriving through AI convert at twice the rate of traditional channels.' },
      { type: 'h', text: 'What it means for a small business' },
      { type: 'ul', items: [
        'Your product information (name, description, price, availability) needs to be **clear and up to date**: now an AI reads it, not just a person.',
        'Answering quickly and well on your channels starts to matter more: AI rewards what works.',
        'Customer service no longer has “office hours”: whoever asks at 11 p.m. expects an answer.',
      ] },
      { type: 'h', text: 'The good news' },
      { type: 'p', text: 'You don’t need a tech team for this. You need your operation —catalog, customer service, follow-up— to be organized and awake. Exactly what a team of agents can keep running for you.' },
    ],
    sources: [
      { name: 'Investing.com — Resultados Q2 2026 de Shopify', url: 'https://ca.investing.com/news/company-news/shopify-q2-2026-slides-ai-commerce-drives-3x-traffic-surge-93CH-4777963' },
    ],
  },
]
