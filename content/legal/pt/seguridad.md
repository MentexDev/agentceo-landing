---
titulo: Política de Segurança
id: seguridad
slug: seguranca
estado: borrador
actualizado: 2026-08-02
version: 2.0
descripcion: Como a Klinworks, LLC protege as informações no Agent CEO: criptografia, isolamento, controle de acesso, agentes de IA e o que ainda não temos.
---

> Tradução para o português em revisão jurídica. Em caso de divergência, prevalece a versão em espanhol.

# Política de Segurança

**Última atualização: 2 de agosto de 2026**

Como a **Klinworks, LLC** («Klinworks») protege as informações no serviço
**AgentCEO**.

A Klinworks é uma sociedade de responsabilidade limitada de Delaware (Estados
Unidos), registro n.º 10704723, com escritório registrado em 131 Continental
Drive, Suite 305, Newark, Delaware 19713.

**Contato de segurança: security@klinworks.com**

> **Uma nota sobre honestidade.** Este documento descreve controles que estão
> implementados hoje, não aspirações. Quando algo estiver planejado mas não
> ativo, dizemos isso expressamente na seção 8. Preferimos que você saiba
> exatamente o que tem.

---

## 1. Criptografia

**1.1 Em trânsito.** Todo o tráfego trafega por TLS 1.2 ou superior. Não
servimos conteúdo por HTTP sem criptografia.

**1.2 Em repouso.** Os bancos de dados e o armazenamento de arquivos são
criptografados em disco pelos nossos provedores de infraestrutura.

**1.3 Credenciais de integrações.** Quando você conecta um sistema externo, as
chaves e tokens dele são criptografados com uma chave mestra que **não reside no
banco de dados**. Além disso, as colunas que contêm esse material têm o acesso
revogado no nível do motor: nem mesmo uma sessão autenticada legítima consegue
lê-las por meio de uma consulta. Somente o processo do servidor que precisa
usá-las pode descriptografá-las.

**1.4 Senhas.** Não armazenamos senhas em texto claro. A autenticação é
gerenciada pelo nosso provedor de identidade com algoritmos de hash
resistentes.

## 2. Isolamento entre organizações

Cada organização vê apenas os seus dados. Isso é aplicado em **duas camadas
independentes**, de forma que uma falha em uma delas não expõe as informações:

- **No banco de dados**, por meio de políticas de segurança no nível de linha
  que filtram cada consulta de acordo com a associação do usuário.
- **Na aplicação**, resolvendo a organização **sempre no servidor** a partir da
  sessão. A organização nunca é aceita a partir do navegador, porque isso
  permitiria a qualquer pessoa pedir os dados de outra empresa trocando um
  identificador.

Esse isolamento é verificado com testes automatizados executados a cada
alteração do código.

## 3. Controle de acesso

**3.1 Funções.** Dentro de uma organização, as permissões dependem da função. As
operações que comprometem a empresa — contratar, comprar, conectar integrações,
desconectar membros — são reservadas ao **Conselho de Administração**, e essa
restrição é aplicada **no servidor**, não apenas na interface.

**3.2 Verificação em duas etapas (2FA).** Disponível por meio de aplicativo de
autenticação (TOTP). Quando você a ativa, **o banco de dados exige o segundo
fator** para dar acesso aos dados da organização: não basta passar pela tela de
login.

**3.3 Sessões.** Você pode ver os dispositivos com sessão aberta e encerrá-la
remotamente. O Conselho pode desconectar um membro de todos os seus
dispositivos.

**3.4 Acesso da nossa equipe.** O acesso a dados de clientes é limitado ao
imprescindível para operar o Serviço e responder a incidentes. Não lemos o seu
conteúdo, salvo se você nos pedir, se a lei exigir ou se for imprescindível para
investigar um abuso grave.

## 4. Registro e auditoria

**4.1 Registro de alterações.** As modificações nos seus dados ficam
registradas para que você possa auditar o que seus agentes fizeram e restaurar
o que for necessário.

**4.2 Registro de operações sensíveis.** Conectar ou desconectar integrações,
mudanças de plano e compras ficam registradas de forma **imutável**: o registro
é somente de inserção e não pode ser modificado nem apagado a partir da
aplicação.

**4.3 Sem dados pessoais nos registros técnicos.** Nossos registros de sistema
guardam identificadores, nunca e-mails, telefones nem nomes completos.

## 5. Desenvolvimento seguro

Cada alteração do código passa por verificações automáticas antes de chegar à
produção:

- **Detecção de segredos**: impede que uma chave ou token acabe no repositório.
- **Verificação de segurança do banco de dados**: confirma que as políticas de
  isolamento continuam em vigor.
- **Verificação de tipos e análise estática**.
- **Testes automatizados**, incluindo os que verificam que uma organização não
  consegue ler os dados de outra.
- **Build do produto**, que deve ser concluído sem erros.

Nenhuma alteração é implantada se alguma dessas verificações falhar.

## 6. Cópias de segurança e continuidade

Nosso provedor de banco de dados faz cópias automáticas com recuperação para um
ponto no tempo. Os dados são replicados na infraestrutura do provedor.

**O que isso não significa:** hoje não oferecemos um compromisso contratual de
tempo de recuperação (RTO) nem de ponto de recuperação (RPO). Se você precisar
dessas garantias para a sua operação, escreva para legal@klinworks.com e
trataremos disso por contrato específico.

## 7. Segurança dos agentes de IA

**7.1 Execução isolada.** O código gerado pelos agentes é executado em ambientes
separados da infraestrutura que sustenta o Serviço.

**7.2 Política de ferramentas.** As ações sensíveis podem exigir aprovação
explícita. Uma ação sem política atribuída é **bloqueada por padrão**: na
dúvida, não é executada.

**7.3 Limites de gasto.** O consumo é medido em créditos e para quando eles se
esgotam. Não há cobrança automática por excedente, de modo que um agente em
loop não pode esvaziar sua conta.

**7.4 Seus dados não treinam modelos.** Exigimos contratualmente dos nossos
provedores de modelos que o conteúdo enviado em seu nome não seja usado para
treinamento.

## 8. O que ainda não temos

Dizemos isso expressamente porque um documento de segurança que só enumera
virtudes não serve para tomar decisões:

- **Não temos certificação SOC 2 nem ISO 27001.** Estão no nosso plano, sem data
  comprometida.
- **Não realizamos um teste de penetração externo** por um terceiro
  independente.
- **Hoje não oferecemos um acordo de nível de serviço (SLA)** com
  disponibilidade garantida.
- **Não temos um programa formal de recompensas** por vulnerabilidades, embora
  atendamos todos os relatos (seção 9).

Se algum desses pontos for um requisito para você, escreva-nos antes de
contratar e diremos com honestidade se podemos atendê-lo.

## 9. Relatar uma vulnerabilidade

Se você encontrar um problema de segurança, escreva para
**security@klinworks.com** com a descrição e os passos para reproduzi-lo.

**Nosso compromisso:**

- Confirmamos o recebimento em **72 horas úteis**.
- Mantemos você informado sobre o andamento.
- Não tomaremos medidas judiciais contra quem pesquisar de boa-fé, respeitar a
  privacidade de terceiros, não degradar o Serviço e nos der um prazo razoável
  antes de divulgar.

**Por favor, não** acesse dados de outras organizações, não realize ataques de
negação de serviço nem testes de engenharia social contra nossa equipe ou
nossos clientes.

## 10. Notificação de incidentes

Diante de uma violação de segurança que afete os seus dados, informaremos você
**sem demora injustificada e em um prazo máximo de 72 horas** a partir do
momento em que tomarmos conhecimento, indicando o que aconteceu, quais dados
foram afetados, quais medidas tomamos e o que recomendamos que você faça.
Notificaremos as autoridades de controle quando a normativa exigir.

## 11. Sua parte

A segurança é compartilhada. Recomendamos que você:

- Ative a verificação em duas etapas.
- Use uma senha única e robusta.
- Conceda a cada integração **a permissão mínima** de que ela precise.
- Revise periodicamente as sessões ativas e os membros da sua organização.
- Configure aprovações para as ações de agentes com impacto econômico.
- Avise-nos imediatamente se suspeitar de um acesso não autorizado.

---

## Contato

**Klinworks, LLC**
131 Continental Drive, Suite 305
Newark, Delaware 19713, Estados Unidos
Registro de Delaware n.º 10704723

- Segurança e vulnerabilidades: **security@klinworks.com**
- Assuntos jurídicos: **legal@klinworks.com**
- Privacidade: **privacidad@klinworks.com**
