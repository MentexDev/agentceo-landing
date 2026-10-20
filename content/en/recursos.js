// ─────────────────────────────────────────────────────────────────────────────
// AgentCEO Resources — US English translation of content/recursos.js.
// Each item keeps `es` (the original Spanish slug) to pair it with its source.
// `whatYouGet` is the visible hook; `body` is the content unlocked by email.
// ─────────────────────────────────────────────────────────────────────────────

export const META = {
  title: 'Resources · Agent CEO',
  eyebrow: 'Resources',
  h1: 'Guides and templates to get started today.',
  sub: 'Practical, free material for running your business with AI. Leave us your email and get full access instantly.',
}

export const CATEGORIES = ['Checklists', 'Guides', 'Templates']

export const ITEMS = [
  {
    es: 'checklist-tareas-para-automatizar',
    slug: '12-tasks-your-business-can-automate-this-week',
    title: '12 tasks your business can automate this week',
    category: 'Checklists',
    dateISO: '2026-08-07',
    featured: true,
    readMinutes: 6,
    excerpt: 'An actionable checklist to find, in your own operation, what to delegate first to an AI agent —ranked by ease and by impact.',
    whatYouGet: [
      'The 12 tasks grouped by area: customer service, sales, operations and content.',
      'Which ones are **low-risk** so you can start without fear.',
      'A simple rule for deciding what **NOT** to automate yet.',
      'A 3-week mini-plan to get going without feeling overwhelmed.',
    ],
    body: [
      { type: 'p', text: 'The fastest way to get value from AI isn’t automating “everything,” it’s starting with the right tasks: the repetitive ones, the ones you hate doing and the ones that don’t depend on your judgment. Here are 12, organized by area.' },
      { type: 'h', text: 'Customer service' },
      { type: 'ul', items: [
        'Answering frequently asked questions (hours, shipping, sizes, prices).',
        'Greeting customers first and collecting their details 24/7, even while you sleep.',
        'Sending reminders and confirmations (appointments, orders, pending payments).',
      ] },
      { type: 'h', text: 'Sales' },
      { type: 'ul', items: [
        'Getting back to people who reached out but didn’t buy (lead follow-up).',
        'Recovering abandoned carts with a well-timed message.',
        'Answering price and availability questions instantly.',
      ] },
      { type: 'h', text: 'Operations' },
      { type: 'ul', items: [
        'Putting together the daily sales report and sending it to you every morning.',
        'Alerting you when a product is about to run out.',
        'Sorting and organizing incoming messages or orders.',
      ] },
      { type: 'h', text: 'Content and marketing' },
      { type: 'ul', items: [
        'Writing drafts of social media posts.',
        'Writing clear, SEO-friendly product descriptions.',
        'Preparing replies to reviews and comments.',
      ] },
      { type: 'h', text: 'The rule for deciding what NOT to automate (yet)' },
      { type: 'p', text: 'If a task **changes the direction of your business**, is **irreversible** (a payment, a sensitive post) or requires a **sensitive human conversation**, don’t let it run on its own. Automate the doing, but let the final decision go through you with one click of approval.' },
      { type: 'h', text: 'Your 3-week plan' },
      { type: 'ul', items: [
        '**Week 1:** pick ONE “customer service” task and get it running. Watch it.',
        '**Week 2:** add one from “sales” (follow-up or carts). Measure the result.',
        '**Week 3:** automate your daily report so you never build it by hand again.',
      ] },
      { type: 'p', text: 'By the end of three weeks you’ll have three things working on their own and a much clearer idea of what to delegate next.' },
    ],
  },
  {
    es: 'guia-primera-instruccion-agente',
    slug: 'how-to-give-your-agent-an-instruction-that-actually-works',
    title: 'How to give your agent an instruction that actually works',
    category: 'Guides',
    dateISO: '2026-08-06',
    readMinutes: 5,
    excerpt: 'The difference between an agent that helps and one that frustrates almost always comes down to how you ask. Here’s the formula.',
    whatYouGet: [
      'The 4-part formula for a clear instruction.',
      'A real example: from a vague request to one that works.',
      'The 3 mistakes that make an agent “not get it.”',
    ],
    body: [
      { type: 'p', text: 'You don’t need to learn how to “program” an agent. You need to ask the way you’d ask a good new employee: clearly. This four-part formula gets you 90% of the result.' },
      { type: 'h', text: 'The formula: Goal + Context + Limits + Format' },
      { type: 'ul', items: [
        '**Goal:** what you want to achieve, in one sentence. (“I want to win back customers who didn’t buy.”)',
        '**Context:** what the agent needs to know about your business. (“We sell jeans; the average order is $120.”)',
        '**Limits:** what it should NOT do. (“Don’t offer discounts over 10% without asking me.”)',
        '**Format:** how you want the result. (“Send me a draft before sending anything.”)',
      ] },
      { type: 'h', text: 'Example: from vague to clear' },
      { type: 'quote', text: 'Vague: “Help me with sales.”', cite: 'The agent doesn’t know where to start' },
      { type: 'quote', text: 'Clear: “Write to the customers who bought 30 days ago with a short message inviting them back. Friendly tone, no discounts. Show me the messages before sending them.”', cite: 'Goal + context + limits + format' },
      { type: 'h', text: 'The 3 most common mistakes' },
      { type: 'ul', items: [
        'Asking for something too big all at once. Break it into steps.',
        'Not saying what NOT to do. Limits prevent surprises.',
        'Not asking to review before it acts. For anything sensitive, always ask for a draft.',
      ] },
    ],
  },
  {
    es: 'plantillas-whatsapp-atencion-ventas',
    slug: 'whatsapp-templates-for-customer-service-and-sales-ready-to-use',
    title: 'WhatsApp templates for customer service and sales (ready to use)',
    category: 'Templates',
    dateISO: '2026-08-05',
    readMinutes: 4,
    excerpt: 'Proven messages for the key moments: the first greeting, answering the price question, following up with people who went quiet, and closing the sale. Copy and adapt them.',
    whatYouGet: [
      '4 message templates ready to copy and paste.',
      'When to use each one in the conversation.',
      'How to adapt them to your brand without sounding like a robot.',
    ],
    body: [
      { type: 'p', text: 'These templates cover the four moments where the most sales are won or lost on WhatsApp. Copy them, change what’s in brackets and adjust them to your tone.' },
      { type: 'h', text: '1. First greeting (reply in seconds)' },
      { type: 'quote', text: 'Hi! Thanks for reaching out to [BRAND]. I’m [NAME] and I’m happy to help. Are you looking for something specific, or would you like me to show you our most popular items? 😊' },
      { type: 'h', text: '2. When they ask about the price' },
      { type: 'quote', text: '[PRODUCT] is [PRICE], with shipping to [AREA] in [TIMEFRAME]. If you’d like, I can set it aside for you right now and send you the payment link. Want me to hold it?' },
      { type: 'h', text: '3. Following up with someone who went quiet' },
      { type: 'quote', text: 'Hi [NAME], I saw you were interested in [PRODUCT] 👀. I still have your size available, but it’s selling out. Want to lock it in today?' },
      { type: 'h', text: '4. Closing the sale' },
      { type: 'quote', text: 'Perfect! To get it ready I just need [DETAIL: address / size]. As soon as you confirm payment here [LINK], I’ll prepare your order and send you the tracking number. 🙌' },
      { type: 'h', text: 'How not to sound like a robot' },
      { type: 'p', text: 'Use the customer’s name, respond to what they actually said (don’t paste the message cold) and let an AI agent personalize them for you: you set the template, the AI adapts it to each conversation and you approve what matters.' },
    ],
  },
]
