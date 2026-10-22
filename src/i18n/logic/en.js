// Textos de la LÓGICA de la portada (en): los usan las islas (src/sections/islands/*) y ui/en.js.
// Módulo aparte para que cada isla descargue solo esto y no el diccionario ui entero de cada idioma (T62).
export default {
  // S05 expert lines (T32): one list per card, in section order
  // (inventory, content, WhatsApp, ads, customer care, production).
  agentLines: [
    ["Hi, boss! I've counted the whole stockroom.", 'Only 4 black T-shirts left in size M. Shall I order 40 more?', 'Mugs sell twice as much on Fridays. Already factored in.', 'Nothing sells out without me warning you first.'],
    ["Hi, boss! Friday's post is ready.", 'I have three reel ideas for this week. Want to see them?', 'Caption written, photo and time picked. It just needs your yes.', 'Your account now posts every day without you thinking about it.'],
    ['Hi, boss! Laura is asking if we have size S.', "It's 2 a.m. and I just closed a sale.", 'I reply in seconds, with your catalog and your prices.', 'If a customer gets upset, I hand them to you right away.'],
    ['Hi, boss! I compared two ads this morning.', 'Ad B brings more customers for the same money.', 'Raise the budget? I never spend a cent without your sign-off.', "I paused the ad that wasn't working. It's in your summary."],
    ["Hi, boss! I closed Andrew's complaint.", 'I swapped a size and the customer left happy.', 'Infinite patience, even at 11 p.m.', 'Questions that keep coming up, I now answer on my own.'],
    ['Hi, boss! Three orders came in today.', 'Order 1042 just shipped. I am letting the customer know.', 'If an order runs late, you know before the customer does.', 'Every order, from checkout to doorstep, under control.'],
  ],
  ceo: ["Hi! I'm your CEO. Tap me.", 'I organize the team for you.', 'Anything important, I always ask you.', 'My teammates are down below. Scroll!', 'Again? That tickles.'],
  req: ['Order 40 black T-shirts', 'Raise the ad budget', "Publish this week's posts"],
  approved: 'Approved',
  notNow: 'Not now',
  lockIdle: "No matter how well it does, this doesn't change.",
  lockTried: 'It will never do this on its own. It will always ask you.',
  trustDone: '3 of 3 done right, no surprises',
  trustStep: '{n} of 3 · still asks you',
  autoOn: 'On · your agents are already doing it',
  meter0: 'Switch one on to start',
  meterAll: 'Everything on autopilot!',
  meterSome: 'Your team already handles this',
  moreOpen: 'Show less',
  moreClosed: 'And many more  +',
  clonOn: 'Permission on. You can remove it whenever you want.',
  clonOff: 'Permission removed. Your spokesperson no longer uses your face or voice.',
}
