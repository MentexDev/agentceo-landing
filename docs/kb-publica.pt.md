# KB pública curada do chat · pt-BR (tradução do BORRADOR T58b · revisado no T59-KB)

> **Status: rascunho. NÃO está ligado ao chat.**
> - O chat continua lendo `worker/generated/knowledge.json`; ver a seção 5 de `/tmp/luca_t58_report.md`.
> - Este documento serve para que Diego e Luca decidam o que entra antes de ligá-lo.
> - Versão em português do Brasil de `docs/kb-publica-borrador.md` (só os blocos ES, traduzidos).

**Convenção**
- O que **está publicado na landing** vai sem marca, com a fonte entre colchetes curtos: `[web: …]`.
- O que **não está na landing** vem do produto e vai com **[VERIFICAR]**. Vem do repositório `CRM-AI`, lido somente para leitura: branch `origin/b3-negocio`, último commit `006ca367b` de 2026-10-18. É o snapshot local, sem `fetch`; fonte principal `docs/brain/agent-ceo-producto.md`.
- **A landing é a fonte da verdade das capacidades** (decisão do Diego, T59). O app não é lançado até que tudo o que foi prometido esteja construído, então tudo o que o site promete é descrito aqui como capacidade do produto.
- Os detalhes que só estão no produto entram como **complemento**, nunca para negar o site, e mantêm **[VERIFICAR]** porque o site não os promete.

**Sempre excluído**
- Qualquer dado societário ou de registro da empresa: a lista exata é a de `worker/chat/private.js` (T40).
- Infraestrutura, fornecedores e modelos de IA.
- Segredos, métricas, clientes, datas de roadmap e preços não publicados.

**Guarda:** `tests/site/kb-publica-borrador.test.js` falha se entrar um dado reservado.

## Índice
1. [O que é o Agent CEO](#1-o-que-é-o-agent-ceo)
2. [Como funciona](#2-como-funciona)
3. [A equipe: agentes e funções](#3-a-equipe-agentes-e-funções)
4. [Funções](#4-funções)
5. [Integrações](#5-integrações)
6. [Casos de uso por tipo de negócio](#6-casos-de-uso-por-tipo-de-negócio)
7. [Como começar (lista de espera e primeiros passos)](#7-como-começar)
8. [Planos e preços](#8-planos-e-preços)
9. [Segurança, privacidade e controle](#9-segurança-privacidade-e-controle)
10. [Em vez de fazer à mão](#10-em-vez-de-fazer-à-mão)
11. [Objeções frequentes](#11-objeções-frequentes)
12. [Glossário](#12-glossário)
13. [Perguntas frequentes (34)](#13-perguntas-frequentes)
14. [Contato](#14-contato)
15. [Nota interna: landing ↔ produto (resolvido)](#15-nota-interna-landing--produto-resolvido)
16. [O que foi excluído e por quê](#16-o-que-foi-excluído-e-por-quê)

---

## 1. O que é o Agent CEO

- O Agent CEO é uma plataforma onde você monta uma **equipe de funcionários de IA** que trabalham no seu negócio: vendem pelo WhatsApp, cuidam da sua loja e criam conteúdo. No que é importante, pedem sua permissão. [web: FAQ «O que é o Agent CEO?»]
- Um **agente** é um assistente de IA que faz um trabalho específico, como responder mensagens ou revisar o estoque. É um funcionário digital: não te sugere o que fazer, ele faz nas suas ferramentas. [web: FAQ «O que é um agente?»]
- Um chatbot responde; um agente age. Persegue um objetivo, usa suas ferramentas, trabalha sozinho e aprende o seu contexto. [web: blog «O que é realmente um agente de IA»]
- Não é um ERP nem um CRM tradicional em que uma pessoa preenche formulários: o trabalho é feito pelos agentes, e você dirige, aprova e decide. **[VERIFICAR]** (produto: «O que o Agent CEO NÃO é»)

## 2. Como funciona

1. **Uma conversa curta.** Você conta sobre o seu negócio, ou a sua ideia se está começando do zero, e ele monta a equipe. Se você já tem site, ele analisa enquanto vocês conversam. [web: «Como se começa?»]
2. **Sua equipe trabalha.** Responde clientes, acompanha a loja, prepara conteúdo e te avisa do que precisa da sua assinatura. [web]
3. **Você aprova o que é importante.** Se algo custa dinheiro ou não pode ser desfeito, o agente te pergunta primeiro, e você aprova pelo celular com um botão. [web: «Como funcionam as aprovações?»]
4. **Reunião diária e ata da manhã.** Sua equipe trabalha também de noite. Toda manhã ela se reúne sozinha e você lê a ata: o que fizeram, o que vem a seguir e o que espera a sua aprovação. Às 7:00 você tem seu relatório de vendas. Suas reuniões também podem ficar gravadas e resumidas. [web: «Reunião diária»]
5. **Cada tarefa, com sua entrega.** Você pode executá-las na hora, deixá-las salvas ou programá-las todo dia, semana ou mês, no horário local do seu negócio. **[VERIFICAR]**

## 3. A equipe: agentes e funções

**O que o site publica** [web: «Quais funcionários de IA vêm na equipe?»]
- **Diretor Geral**: o seu CEO, que coordena todos.
- **Vendedor de WhatsApp**: responde seus clientes e fecha vendas a qualquer hora.
- **Responsável pelo estoque**: conta o que você tem e avisa antes que algo acabe.
- **Criador de conteúdo**: prepara e publica seus posts.
- **Especialista em publicidade**: cuida dos seus anúncios e te diz quais funcionam.
- **Atendimento ao cliente**: dúvidas, trocas e reclamações.
- **Chefe de produção**: acompanha cada pedido.
- E também designer, editor de vídeo, contador, analista de tendências, construtor de apps e mais.
- Você pode **criar o seu**. **Não há limite de agentes** em nenhum plano.

**Complementos do produto** **[VERIFICAR]**
- Cada agente tem uma **ficha**: do que ele cuida e do que não cuida.
- Você pode **mudar o nome** de qualquer agente.
- Quando é preciso um cargo novo, o seu Diretor Geral propõe, e toda contratação passa pela sua aprovação.

## 4. Funções

**Publicadas** [web]
- **Venda pelo WhatsApp:**
  - responde com o tom da sua marca, fecha a venda e acompanha pedidos, carrinhos e estoque;
  - conecta por QR code ou pelo número oficial;
  - todas as conversas ficam numa caixa de entrada só;
  - cada cliente avança passo a passo até pagar.
- **Aprovações pelo celular,** com um botão.
- **Reunião diária com sua ata** e relatório de vendas às 7:00.
- **26 automações prontas,** que se ligam com um botão: resumo de vendas toda manhã, carrinhos abandonados, boas-vindas a clientes novos, preparar cada reunião, aviso de estoque baixo, o conteúdo da semana, cobranças e relatórios, entre outras.
- **Estúdio criativo:**
  - fotos e capas realistas (13 estilos);
  - vídeos animados e reels com roteiro, música e edição;
  - mais de 192 modelos de design;
  - **se clonar:** um apresentador com o seu rosto e a sua voz, só com a sua permissão, que você pode retirar quando quiser.
- **Construir sites, landing pages, lojas, apps e ferramentas internas:**
  - você descreve no chat, sem programar;
  - vê a prévia e muda com um clique;
  - cada mudança fica salva como versão;
  - é publicado no **seu** GitHub e na **sua** Vercel: o código é seu.
- **O cérebro da sua empresa:** lê seus documentos, conversas e tarefas concluídas, e separa o que é certo do que é só suposição.
- **Várias marcas** num só lugar, cada uma com sua equipe, um resumo único e um limite de gasto por marca.
- **Extensão para o Chrome:** o agente abre abas, preenche formulários e aprende um processo vendo você fazer uma vez. O que é importante, ele continua te perguntando.

**Do produto** **[VERIFICAR]**
- **Atalhos ao escrever:** design, documento, planilha, imagem, vídeo, automatizar, pesquisar, navegar na web, perguntar à empresa.
- **Planilha** com fórmulas de verdade.
- **Documentos e apresentações.**
- **«Mural»** para comparar referências.
- **Vídeo do começo ao fim:** storyboard, animação dos planos aprovados e reel vertical com música, locução e legendas.
- **Automações criadas conversando:**
  - nascem como rascunho e não são ligadas sem a sua revisão;
  - disparam por horário ou por algo que acontece (um pedido, um cliente novo).
- **Painéis ao vivo** que se atualizam sozinhos (campanhas, estoque, redes).
- **Indicadores do negócio em linguagem normal** («como estamos este mês?»).
- **Detecta trabalho repetitivo** e propõe automatizá-lo.
- **Agenda:** consulta seu calendário e cria eventos.
- **Grava e transcreve** uma reunião enquanto você escreve um documento.
- **Compartilhar e baixar:** você compartilha uma conversa com um link somente leitura que pode revogar, e baixa as entregas.

## 5. Integrações

**Publicadas** [web]
- Conecta com **mais de 70 ferramentas**:
  - **Lojas:** Shopify, WooCommerce, Wix, Squarespace, PrestaShop.
  - **Marketplaces:** MercadoLibre, Amazon, Etsy, eBay.
  - **Faturamento:** Alegra, Siigo, Factus, QuickBooks.
  - **CRM:** HubSpot, Kommo, Bitrix24.
  - **Google:** Gmail, Drive, Sheets, Calendar.
  - **Canais:** WhatsApp, Telegram, TikTok, YouTube.
- Seus agentes trabalham **direto** nelas: não te devolvem um texto para você colar.
- **Shopify:** você conecta sua loja e ele acompanha pedidos, carrinhos abandonados e estoque.

**Complementos do produto** **[VERIFICAR]**
- Formas de conectar:
  - **com um clique**, autorizando na página do fornecedor; fica salva uma permissão revogável, não a sua senha;
  - **com uma chave**;
  - **com qualquer API**;
  - **entrando com a sua sessão** em sites sem conexão oficial.

## 6. Casos de uso por tipo de negócio

> **Fontes**
> - O site não tem uma página por setor. O que está marcado `[web]` é uma função publicada aplicada ao setor.
> - Os exemplos da página inicial (p. ex. «roupa confortável para mulheres») são **inventados** e são apresentados assim.
> - **[VERIFICAR]** marca o que o site não diz para esse setor (nem o site nem o produto têm casos por setor).

| Tipo | PT |
|---|---|
| **Loja** (`tienda`) | Vende pelo WhatsApp a qualquer hora, recupera carrinhos abandonados, avisa sobre estoque baixo e acompanha pedidos e estoque da sua Shopify. [web] |
| **Moda** (`moda`) | Cria fotos e capas de produto, prepara os posts da semana e responde «tem no meu tamanho?» pelo WhatsApp. As fotos e o conteúdo são [web]; tamanhos e provadores, **[VERIFICAR]**. |
| **Comida** (`comida`) | Avisa seus clientes do prato do dia, responde pedidos e horários pelo WhatsApp e acompanha cada pedido. O WhatsApp e o acompanhamento são [web]; entregas, cardápios e reservas, **[VERIFICAR]**. |
| **Serviços** (`servicios`) | Responde pedidos de orçamento, faz follow-up com quem não respondeu e te deixa um resumo do cliente antes de cada reunião. O follow-up de leads é [web, blog]; o resumo antes da reunião, [web, página inicial]; o acompanhamento de orçamentos, **[VERIFICAR]**. |
| **Do zero** (`desde_cero`) | Primeiro se confirma que há clientes e depois se constrói, sem gastar demais. Te ajuda a validar a ideia e a montar o site ou a loja. [web] O produto pesquisa o seu mercado, propõe nomes e te ajuda com a estética: **[VERIFICAR]**. |

## 7. Como começar

- **Hoje:**
  - O Agent CEO abre **por grupos**, e quem entra na lista antes entra antes. [web]
  - Deixe seu e-mail no formulário do site, ou no chat, e a gente te escreve quando for a sua vez. [web]
  - Você pode cancelar a inscrição em qualquer e-mail. [web]
- **Ao entrar** **[VERIFICAR]**:
  1. Uma única pergunta: «Já tenho minha empresa» ou «Vou criar uma do zero».
  2. Uma entrevista com o seu CEO: uma pergunta de cada vez.
  3. Vocês definem a «tese» da sua empresa (por que ela existe e para quem).
  4. O CEO te apresenta a equipe.
  5. Uma lista «Configure sua empresa» que vai se marcando sozinha.
  - Você pode pular a entrevista.

## 8. Planos e preços

Só o que foi publicado. Preços em USD. [web: /pt/precos/ · `content/precios.js`]

| Plano | Preço | Créditos por semana | Pessoas |
|---|---|---|---|
| Arranque | $0 (sem cartão) | 300 | 1 |
| Impulso | $29 por mês | 2.300 | 5 |
| Motor | $99 por mês | 40.000 | 20 |
| Imperio | $249 por mês | 200.000 | ilimitadas |

**Em todos os planos**
- **Agentes ilimitados.**
- Os **créditos se renovam toda segunda-feira**; os não usados não se acumulam.
- Histórico de 30 dias.

**Pacotes de créditos (pagamento único)**
- **Chispa:** 1.000 créditos, $5.
- **Envión:** 3.000, $12.
- **Turbina:** 8.000, $29.
- **Reserva:** 20.000, $65, não expira.
- Não há cobranças automáticas por excesso. Sem créditos, os agentes param até a segunda-feira ou até você comprar um pacote.

**Reembolsos** (detalhes na página de Reembolsos e cancelamento)
- **Primeira assinatura:** em até 7 dias, se você usou menos de 10 % dos créditos.
- **Chispa, Envión e Turbina:** em até 14 dias, se você não os usou.
- **Erros de cobrança:** sempre.
- Os planos pagos se renovam todo mês até você cancelar.

## 9. Segurança, privacidade e controle

**Publicado** [web]
- **Nada importante acontece sem você:**
  - o que custa dinheiro ou não pode ser desfeito, eles sempre te perguntam;
  - uma ação sem permissão atribuída é bloqueada por padrão.
- **A confiança vem passo a passo:** quando uma tarefa dá certo 3 vezes, ela pode ser feita sozinha. O que custa dinheiro, ele sempre te pergunta.
- **Seus dados são seus:**
  - cada empresa fica isolada;
  - você decide o que conecta e desconecta quando quiser;
  - você pode exportá-los ou pedir que a gente apague.
- **Não treinamos modelos** com o seu conteúdo, nem próprios nem de terceiros.
- **Criptografia:** tudo trafega e fica guardado criptografado, e as chaves das suas integrações são criptografadas à parte. Se houver um vazamento, avisamos você em 72 h. [web: chat curado «proteccion» → Política de segurança]
- **Se clonar** só com a sua permissão, e você pode retirá-la.

**Complementos do produto** **[VERIFICAR]** (somam-se ao anterior; não o substituem)
- **Três modos de autonomia por agente,** além da confiança passo a passo:
  - **Manual**, o padrão: você aprova cada ação.
  - **Auto:** age sozinho no dia a dia.
  - **Piloto automático:** só te consulta o que precisa de um passo seu.
- **O que nenhum modo pula:** enviar uma campanha de e-mail, publicar a loja e apagar sempre pedem a sua assinatura.
- **Os agentes nunca veem as suas credenciais.**
- **Limites de gasto por agente** e avisos de saldo em 80 % e em 95 %.
- **Em sites sensíveis** (bancos, pagamentos), a extensão para e espera a sua permissão.
- **O que você compartilha nasce privado** («Só eu»).
- **Você só pode clonar a si mesmo.**

## 10. Em vez de fazer à mão

- **À mão:** você responde o WhatsApp de noite, confere o estoque numa planilha e monta os posts no domingo.
- **Com o Agent CEO:** a equipe trabalha também de noite e às 7:00 você tem seu relatório. [web]
- **Contratar pessoa por pessoa** em vez de ter uma equipe desde o primeiro minuto, com alguém a quem delegar cada coisa. **[VERIFICAR]**
- **Terceirizar um site ou um app** em vez de descrevê-lo no chat, ver a prévia e ter o código como seu. [web]
- **Produtora para conteúdo** em vez de reels com roteiro, música e edição, sem equipe de produção. [web: estúdio]
- **O que não muda:** o seu critério. «Automatize a execução, mantenha a decisão.» [web: blog]

## 11. Objeções frequentes

| Objeção | PT |
|---|---|
| «E se ele fizer algo sem a minha permissão?» | Só o que você permitir. O que custa dinheiro ou não pode ser desfeito, ele sempre te pergunta, e o que não é permitido é bloqueado. [web] |
| «Não entendo de tecnologia» | Não precisa: você escreve como escreveria pra uma pessoa da sua equipe. Se você sabe mandar um WhatsApp, sabe usar. [web] |
| «Vou ter surpresas na fatura?» | Não há cobranças automáticas por excesso; você define o limite de gasto por marca. [web] Além disso, você vê quanto custou cada resposta. **[VERIFICAR]** |
| «Vai soar como robô / conteúdo genérico» | Usa o tom da sua marca e conhece o seu negócio: lê seus documentos e conversas. [web] |
| «E se ele inventar coisas?» | Separa o que é certo do que é só suposição. [web] Se não consegue fazer algo, ele diz em vez de improvisar. **[VERIFICAR]** |
| «E se eu não gostar do que ele fez?» | Você rejeita ou pede mudanças com as suas palavras; cada correção o deixa melhor. [web] |
| «E os meus dados?» | São seus, isolados, exportáveis e apagáveis. Não treinamos IA com eles. [web] |
| «É caro» | O Arranque é grátis e sem cartão; você muda de plano quando crescer. [web] |

## 12. Glossário

| Termo | PT |
|---|---|
| Agente | Funcionário digital de IA com um trabalho específico. [web] |
| Créditos | O que os agentes consomem ao trabalhar; se renovam toda segunda-feira. [web] |
| Pacote de créditos | Créditos extras de pagamento único (Chispa, Envión, Turbina, Reserva). [web] |
| Aprovação | Botão para dar o ok a algo que custa dinheiro ou não pode ser desfeito. [web] |
| Reunião diária · ata | A equipe se reúne sozinha toda manhã e você lê a ata; às 7:00, o relatório de vendas. [web] |
| Automação | Tarefa que se repete sozinha; há 26 prontas. [web] |
| Estúdio | Onde se criam fotos, vídeos e designs. [web] |
| Cérebro | O que a equipe sabe sobre o seu negócio. [web] |
| Lista de espera | Abrimos por grupos; os primeiros entram primeiro. [web] |
| Diretor Geral (o seu CEO) | O agente que coordena toda a equipe. [web] |
| Ficha | Do que cada agente cuida e do que não cuida. **[VERIFICAR]** |
| Modo de autonomia | Manual, Auto ou Piloto automático. **[VERIFICAR]** |
| Forja | Onde se constroem sites, lojas e apps. [web: FAQ] |
| Sala | Conversa com vários agentes. **[VERIFICAR]** |
| Tese | Por que a sua empresa existe e para quem. **[VERIFICAR]** |

## 13. Perguntas frequentes

1. **O que é o Agent CEO?** Uma equipe de funcionários de IA que vendem pelo WhatsApp, cuidam da sua loja e criam o seu conteúdo. No que é importante, pedem sua permissão. [web]
2. **O que é um agente?** Um funcionário digital com um trabalho específico, que age nas suas ferramentas em vez de só sugerir. [web]
3. **Preciso saber programar?** Não. Você escreve como escreveria pra uma pessoa da sua equipe. [web]
4. **Eles fazem coisas sem me avisar?** Só o que você permitir. O que custa dinheiro, eles sempre te perguntam. [web]
5. **Funciona com WhatsApp?** Sim: responde a qualquer hora com o tom da sua marca, fecha vendas e se conecta por QR code ou pelo número oficial do WhatsApp. [web]
6. **Serve com minha loja Shopify?** Sim. Acompanha pedidos, carrinhos abandonados e estoque. [web]
7. **Com quais ferramentas se conecta?** Com mais de 70: Shopify, WooCommerce, MercadoLibre, Amazon, Gmail, Drive, Sheets, WhatsApp, TikTok e mais. [web]
8. **Pode criar um site ou um app pra mim?** Sim: sites, landing pages, lojas, apps e ferramentas internas, publicados no seu GitHub e na sua Vercel. [web]
9. **O código é meu?** Sim. [web]
10. **E se eu não gostar do que ele fez?** Você rejeita ou pede mudanças com as suas palavras. [web]
11. **E se algo travar?** Ele te mostra numa lista, com o motivo. [web]
12. **Meus dados estão seguros?** São seus. Cada empresa fica isolada, e você decide o que conecta. [web]
13. **Vocês treinam IA com meus dados?** Não, nem modelos próprios nem de terceiros. [web]
14. **Posso exportar ou apagar meus dados?** Sim. [web]
15. **Posso gerenciar vários negócios?** Sim, com um resumo de todos. [web]
16. **Quanto custa?** O Arranque é grátis. Impulso $29, Motor $99 e Imperio $249 por mês. [web]
17. **É grátis de verdade?** Sim: Arranque, 300 créditos por semana, 1 usuário, sem cartão. [web]
18. **Preciso de cartão?** Só para um plano pago ou um pacote de créditos. [web]
19. **E se meus créditos acabarem?** Os agentes param até a segunda-feira ou até você comprar um pacote. Sem cobranças automáticas. [web]
20. **Quando os créditos se renovam?** Toda segunda-feira, e não se acumulam. [web]
21. **Tem limite de agentes?** Não, em nenhum plano. [web]
22. **Posso pedir reembolso?** Sim, nos casos publicados: 7 dias na primeira assinatura, 14 dias nos pacotes não usados, e sempre em caso de erros de cobrança. [web]
23. **Quando abre?** Por grupos. Entre na lista e a gente te escreve. [web]
24. **Como entro na lista?** Deixe seu e-mail no site ou no chat. [web]
25. **Posso cancelar a inscrição dos e-mails?** Sim, em qualquer e-mail, com um clique. [web]
26. **Faz fotos e vídeos?** Sim: fotos e capas em 13 estilos, vídeos animados e reels com roteiro, música e edição, e mais de 192 modelos de design. [web]
27. **Pode falar com o meu rosto e a minha voz?** Só com a sua permissão, e você pode retirá-la. [web]
28. **O que é a reunião diária?** Toda manhã a equipe se reúne sozinha e você lê a ata: o que fizeram, o que vem a seguir e o que espera a sua aprovação. Às 7:00 você tem seu relatório de vendas. [web]
29. **Quantas automações existem?** 26 prontas para ligar com um botão. [web]
30. **Posso ter várias marcas?** Sim, cada uma com sua equipe e seu limite de gasto. [web]
31. **Posso mudar o nome de um agente?** Sim. **[VERIFICAR]**
32. **Posso programar tarefas?** Sim: diárias, semanais ou mensais, no seu horário local. **[VERIFICAR]**
33. **Tem extensão para o navegador?** Sim, para o Chrome: abre abas, preenche formulários e aprende processos vendo você fazer. [web]
34. **Com quem eu falo se tiver outra dúvida?** Com a equipe, em info@agentceo.io. [web]

## 14. Contato

- Para falar com uma pessoa, escreva para **info@agentceo.io**. O assistente do site é uma IA e sempre diz isso. [web]

## 15. Nota interna: landing ↔ produto (resolvido)

> **Resolvido no T59 (decisão do Diego): manda a landing.** O app não é lançado até que esteja construído tudo o que o site promete. Por isso esta KB descreve como capacidades do produto:
> - WhatsApp por QR ou pelo número oficial;
> - mais de 70 integrações;
> - os cargos do site;
> - «depois de 3 vezes ele faz sozinho»;
> - a ata da manhã com o relatório das 7:00;
> - o vídeo.
>
> Os detalhes do produto que não contradizem o site entram como complementos com [VERIFICAR]. *(Nota para a equipe; não é ligada ao chat.)*

## 16. O que foi excluído e por quê

- **Qualquer dado societário ou de registro** (a lista exata está em `worker/chat/private.js`). O brief exige isso, e o chat já os bloqueia (T40).
- **Infraestrutura, fornecedores, modelos de IA,** o seletor interno de modelo, bancos de dados, nomes de serviços: vão contra as regras do chat («bastidores internos»).
- **Tudo o que no produto contradiz o site** (canais pendentes, outros nomes de cargos, catálogo de conectores, restrições de plano): manda a landing (T59).
- **Preços, limites e nomes de plano do produto que não coincidem com o site:** só vale o que foi publicado.
- **Datas de roadmap, funções experimentais ou não lançadas** e contagens medidas em produção.
- **Modelos de clientes específicos, auditorias e documentos internos de estratégia.**
- **Notícias de terceiros** (o site as publica, mas o chat responde sobre o Agent CEO).
