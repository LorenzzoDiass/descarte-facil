# Features para o Azure Boards

Lista das funcionalidades implementadas no app mobile Descarte Fácil, para o integrante responsável por Testing cadastrar as features e os casos de teste. Os resultados esperados descrevem o comportamento do código; os testes ainda precisam ser executados e registrados pela equipe.

Credenciais: `cidadao@descartefacil.demo` / `demo123` e `agente@descartefacil.demo` / `demo123`.

---

## F01 – Login e controle de perfil

**Descrição:** o usuário entra com e-mail e senha e é levado à área do seu perfil. A sessão fica salva no aparelho.

**Critérios de aceite**
- E-mail e senha são obrigatórios e o e-mail precisa ter formato válido.
- Credenciais corretas levam o Cidadão para "Início" e o Agente para "Agendamentos".
- Ao fechar e reabrir o app, a sessão continua ativa.
- "Sair" encerra a sessão e volta para o login.

| Cenário | Tipo | Passos | Resultado esperado |
| --- | --- | --- | --- |
| Login do cidadão | Positivo | Informar credenciais do cidadão e tocar em Entrar | Abre a aba Início com a saudação "Ana" |
| Login do agente | Positivo | Tocar em "Agente" e em Entrar | Abre a lista de agendamentos |
| Sessão salva | Positivo | Entrar, fechar o app e abrir novamente | Abre direto na área do perfil |
| Campos vazios | Negativo | Tocar em Entrar sem preencher | "Informe o e-mail." e "Informe a senha." |
| E-mail inválido | Negativo | Digitar `ana@` | "Informe um e-mail válido." |
| Senha errada | Negativo | Usar senha `123456` | "E-mail ou senha incorretos." |

## F02 – Tela inicial do cidadão

**Descrição:** mostra a próxima coleta, o resumo das solicitações, avisos e atalhos.

**Critérios de aceite**
- Exibe a próxima coleta aguardando, com data e prazo.
- Exibe aviso quando há coleta nos próximos 7 dias e aviso de coleta não realizada.
- Atalhos levam a Descartar, Minhas solicitações, Cata-Bagulho e Doações.

| Cenário | Tipo | Resultado esperado |
| --- | --- | --- |
| Usuário com coleta programada | Positivo | Card "Próxima coleta" com objeto, data e prazo |
| Coleta em até 7 dias | Positivo | Aviso de coleta programada no topo |
| Todas as solicitações canceladas | Negativo | Card informa que não há coleta programada |

## F03 – Registrar objeto para descarte

**Descrição:** formulário para registrar um objeto volumoso para o Cata-Bagulho, com orientação de destinação por categoria (regras locais, sem IA).

**Critérios de aceite**
- Nome (mín. 3 caracteres), categoria, CEP (8 dígitos), endereço (mín. 5) e bairro (mín. 3) são obrigatórios; descrição e foto são opcionais.
- O CEP recebe máscara `00000-000`.
- Ao escolher a categoria, aparece a destinação indicada.
- Categorias de ecoponto ou logística reversa (entulho, madeira e poda, eletrônicos) mostram a orientação e o botão "Ver ecopontos", sem registro de coleta.
- Com CEP da base, mostra a data de coleta; fora da base, a solicitação é salva sem data e com aviso.
- Após salvar, mostra confirmação e a solicitação aparece em "Minhas solicitações" com status "Aguardando coleta".

| Cenário | Tipo | Passos | Resultado esperado |
| --- | --- | --- | --- |
| Registro completo | Positivo | Sofá, Móveis, CEP 03142-000, endereço e bairro, Registrar | Tela de confirmação com a data; item no histórico |
| Com foto | Positivo | Adicionar foto pela galeria | Pré-visualização no formulário e nos detalhes |
| CEP fora da base | Positivo | CEP 13000-000 | Salva sem data e mostra aviso para consultar o calendário oficial |
| Entulho | Positivo | Escolher "Entulho" | Orientação de ecoponto; sem botão de registro |
| Campos vazios | Negativo | Registrar sem preencher | Mensagens em cada campo, ex.: "Informe o nome do objeto.", "Escolha uma categoria.", "Informe o CEP." |
| CEP incompleto | Negativo | CEP 0314 | "O CEP deve ter 8 dígitos." |
| Nome curto | Negativo | Nome "So" | "O nome do objeto deve ter pelo menos 3 caracteres." |
| Permissão de câmera negada | Negativo | Negar acesso à câmera | Aviso de falta de acesso, com opção de usar a galeria |

## F04 – Histórico e cancelamento de solicitações

**Descrição:** lista as solicitações do cidadão com filtro por situação, detalhes, linha do tempo e cancelamento.

**Critérios de aceite**
- Filtros por situação.
- Detalhes mostram objeto, endereço, data, foto e histórico.
- Apenas solicitações "Aguardando coleta" podem ser canceladas, com confirmação.

| Cenário | Tipo | Resultado esperado |
| --- | --- | --- |
| Cancelar solicitação | Positivo | Após confirmar: "Solicitação cancelada." e status "Cancelada" no histórico |
| Desistir do cancelamento | Negativo | Ao tocar em "Voltar" na confirmação, nada muda |
| Filtro sem resultados | Negativo | Mensagem de lista vazia |

## F05 – Consulta do Cata-Bagulho por CEP

**Descrição:** informa a próxima data de coleta a partir do CEP, usando uma base demonstrativa identificada na tela.

**Critérios de aceite**
- Valida 8 dígitos e aplica máscara.
- CEP da base mostra setor, recorrência (ex.: "3º sábado do mês") e próxima data.
- Botão leva ao formulário de descarte com o CEP preenchido.
- Tela mostra aviso de dados simulados e link para o calendário oficial.

| Cenário | Tipo | Passos | Resultado esperado |
| --- | --- | --- | --- |
| CEP da base | Positivo | 03142-000 e Consultar | Setor Leste 1, 3º sábado e próxima data |
| Registrar a partir da consulta | Positivo | Tocar em registrar objeto | Formulário de descarte com o CEP preenchido |
| CEP fora da base | Negativo | 13000-000 | "Este CEP não está na base demonstrativa..." |
| CEP incompleto | Negativo | 0314 | "O CEP deve ter 8 dígitos." |

## F06 – Doações

**Descrição:** cadastro e consulta de objetos para doação, salvos apenas no aparelho.

**Critérios de aceite**
- Nome (mín. 3), categoria, descrição (mín. 10) e bairro (mín. 3) obrigatórios; foto e telefone opcionais.
- Telefone com máscara e validação de DDD.
- A lista mostra apenas nome, categoria e bairro; o telefone aparece só nos detalhes.
- Somente quem cadastrou pode marcar como indisponível ou disponível.

| Cenário | Tipo | Passos | Resultado esperado |
| --- | --- | --- | --- |
| Nova doação | Positivo | Preencher campos obrigatórios e publicar | "Doação publicada..." e item na lista |
| Telefone válido | Positivo | (11) 98765-4321 | Doação salva; botão de ligar nos detalhes |
| Marcar indisponível | Positivo | Em doação própria, marcar indisponível | "Doação marcada como indisponível." e saída da lista de disponíveis |
| Telefone incompleto | Negativo | (11) 9876 | "Informe o telefone com DDD, com 10 ou 11 dígitos." |
| Celular sem 9 | Negativo | (11) 88765-4321 | "Celulares com 11 dígitos começam com 9 depois do DDD." |
| Descrição curta | Negativo | "Bom" | "A descrição deve ter pelo menos 10 caracteres." |
| Doação de outra pessoa | Negativo | Abrir doação demonstrativa de terceiros | Nenhum botão para alterar a disponibilidade |

## F07 – Ecopontos com simulação IoT

**Descrição:** lista ecopontos com ocupação simulada da caçamba, atualizada a cada 3 segundos com a tela aberta.

**Critérios de aceite**
- Ocupação sempre entre 0% e 100%.
- Classificação: Disponível (< 70%), Quase cheio (70% a 90%), Lotado (> 90%).
- Alerta aparece quando um ecoponto passa de 90%.
- "Simular lotação" leva o ecoponto a 95%.
- A tela informa que os dados são simulados.

| Cenário | Tipo | Resultado esperado |
| --- | --- | --- |
| Atualização periódica | Positivo | Percentuais e horário da leitura mudam a cada ~3 s |
| Simular lotação | Positivo | Ecoponto vai para 95%, status "Lotado" e alerta no topo |
| Dispensar alerta | Positivo | Alerta some |
| Sair da tela | Negativo | Atualizações param enquanto a tela não está aberta |

## F08 – Painel do agente

**Descrição:** o agente vê todas as solicitações do aparelho, filtra por situação e atualiza o status.

**Critérios de aceite**
- Filtro por situação com contagem; padrão "Aguardando coleta".
- Detalhes mostram endereço completo, foto e histórico.
- Ações: confirmar coleta, registrar que não foi possível coletar e reabrir, todas com confirmação.
- A alteração aparece para o cidadão no histórico.

| Cenário | Tipo | Resultado esperado |
| --- | --- | --- |
| Confirmar coleta | Positivo | Status "Coletada" e evento com o nome do agente no histórico |
| Não foi possível coletar | Positivo | Status "Não coletada"; cidadão vê aviso na tela inicial |
| Reabrir | Positivo | Volta para "Aguardando coleta" |
| Solicitação cancelada | Negativo | Aviso de cancelamento e nenhuma ação disponível |
| Cidadão acessando o painel | Negativo | Rotas do agente redirecionam para a área do cidadão |

## F09 – Conta e restauração dos dados

**Descrição:** mostra os dados do usuário, o aviso de autenticação acadêmica, a opção de restaurar os dados de demonstração e "Sair".

| Cenário | Tipo | Resultado esperado |
| --- | --- | --- |
| Restaurar dados | Positivo | Após confirmar: "Os dados de demonstração foram restaurados." e registros criados pelo usuário removidos |
| Sair | Positivo | Volta para o login; reabrir o app mantém a tela de login |
