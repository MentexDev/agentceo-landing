// Textos de la LÓGICA de la portada (pt): los usan las islas (src/sections/islands/*) y ui/pt.js.
// Módulo aparte para que cada isla descargue solo esto y no el diccionario ui entero de cada idioma (T62).
export default {
  // Falas dos especialistas da S05 (T32): uma lista por cartão, na ordem da seção
  // (estoque, conteúdo, WhatsApp, anúncios, atendimento ao cliente, produção).
  agentLines: [
    ['Oi, chefe! Já contei o estoque inteiro.', 'Restam só 4 camisetas pretas tamanho M. Peço mais 40?', 'As canecas vendem o dobro às sextas. Já levei isso em conta.', 'Nada esgota sem eu avisar você antes.'],
    ['Oi, chefe! O post de sexta está pronto.', 'Tenho três ideias de reels para esta semana. Vamos ver?', 'Escrevi a legenda, escolhi a foto e o horário. Só falta o seu sim.', 'Sua conta agora publica todo dia sem você precisar pensar nisso.'],
    ['Oi, chefe! A Laura está perguntando se tem tamanho P.', 'São 2 da manhã e acabei de fechar uma venda.', 'Respondo em segundos, com o seu catálogo e os seus preços.', 'Se um cliente ficar chateado, passo para você na hora.'],
    ['Oi, chefe! Comparei dois anúncios hoje de manhã.', 'O anúncio B traz mais clientes pelo mesmo dinheiro.', 'Aumento a verba? Sem a sua aprovação, não gasto um centavo.', 'Pausei o anúncio que não estava funcionando. Está no seu resumo.'],
    ['Oi, chefe! Resolvi a reclamação do André.', 'Troquei um tamanho e o cliente ficou feliz.', 'Tenho paciência infinita, até às 11 da noite.', 'As dúvidas que se repetem, agora eu mesmo respondo.'],
    ['Oi, chefe! Hoje entraram três pedidos.', 'O pedido 1042 já saiu. Estou avisando o cliente.', 'Se um pedido atrasar, você fica sabendo antes do cliente.', 'Cada pedido, do checkout até a porta, sob controle.'],
  ],
  ceo: ['Oi! Eu sou o seu CEO. Toque em mim.', 'Eu organizo a equipe para você.', 'O que é importante, sempre pergunto a você.', 'Meus colegas estão lá embaixo. Role a página!', 'De novo? Assim você me faz cócegas.'],
  req: ['Pedir 40 camisetas pretas', 'Aumentar a verba do anúncio', 'Publicar os posts da semana'],
  approved: 'Aprovado',
  notNow: 'Agora não',
  lockIdle: 'Por melhor que ele se saia, isso não muda.',
  lockTried: 'Isso ele nunca vai fazer sozinho. Sempre vai perguntar a você.',
  trustDone: '3 de 3 certinhos, sem surpresas',
  trustStep: '{n} de 3 · ainda pergunta a você',
  autoOn: 'Ativa · seus agentes já estão cuidando disso',
  meter0: 'Ligue uma para começar',
  meterAll: 'Tudo no automático!',
  meterSome: 'Sua equipe já cuida disso',
  moreOpen: 'Ver menos',
  moreClosed: 'E muitas mais  +',
  clonOn: 'Permissão ativa. Você pode retirá-la quando quiser.',
  clonOff: 'Permissão retirada. Seu porta-voz não usa mais o seu rosto nem a sua voz.',
}
