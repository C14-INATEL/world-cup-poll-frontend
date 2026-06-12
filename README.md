# World Cup Poll - Frontend

Frontend da aplicacao **World Cup Poll**, uma plataforma para criar grupos de bolao da Copa do Mundo, convidar participantes, registrar palpites, acompanhar resultados e visualizar rankings.

O projeto foi desenvolvido com **React**, **TypeScript** e **Vite**, seguindo uma organizacao inspirada em **Feature-Sliced Design (FSD)** para manter a base simples de navegar, testavel e preparada para evolucao.

---

## Sumario

- [Tecnologias](#tecnologias)
- [Pre-requisitos](#pre-requisitos)
- [Configuracao do ambiente](#configuracao-do-ambiente)
- [Como executar](#como-executar)
- [Scripts disponiveis](#scripts-disponiveis)
- [Rotas da aplicacao](#rotas-da-aplicacao)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Integracao com a API](#integracao-com-a-api)
- [Testes](#testes)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Metodologia de desenvolvimento](#metodologia-de-desenvolvimento)
- [Uso de IA](#uso-de-ia)
- [Padroes de desenvolvimento](#padroes-de-desenvolvimento)

---

## Tecnologias

- **React 19** - biblioteca para construcao da interface.
- **TypeScript 5** - tipagem estatica.
- **Vite 8** - dev server e build tool.
- **React Router v7** - roteamento da SPA.
- **TanStack React Query v5** - gerenciamento de estado vindo do servidor.
- **Axios** - cliente HTTP com interceptors.
- **Tailwind CSS v4** - estilos globais e design tokens.
- **shadcn/ui + Base UI** - base dos componentes reutilizaveis.
- **Lucide React** - icones.
- **React Hook Form + Zod** - formularios e validacao.
- **Sonner** - notificacoes toast.
- **Vitest + Testing Library** - testes automatizados.

---

## Pre-requisitos

- **Node.js 22** recomendado, alinhado ao Dockerfile e ao Jenkins.
- **npm** instalado junto com o Node.js.
- Backend do projeto disponivel em `http://localhost:3333`.
- Docker, caso queira executar a aplicacao em container ou subir o ambiente completo.

---

## Configuracao do ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Para desenvolvimento local, mantenha:

```env
VITE_API_URL=http://localhost:3333
```

A variavel `VITE_API_URL` define a URL base usada pelo Axios em `src/shared/api/api.ts`.

---

## Como executar

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicacao ficara disponivel em:

```text
http://localhost:5173
```

Para acessar as telas autenticadas, o backend precisa estar rodando e respondendo na URL configurada em `VITE_API_URL`.

---

## Scripts disponiveis

| Comando            | Descricao                                                          |
| ------------------ | ------------------------------------------------------------------ |
| `npm run dev`      | Inicia o Vite em modo desenvolvimento com HMR.                     |
| `npm run build`    | Gera o build de producao em `dist/`.                               |
| `npm run preview`  | Serve localmente o build gerado pelo Vite.                         |
| `npm run lint`     | Executa o ESLint no projeto.                                       |
| `npm run test`     | Executa os testes com Vitest.                                      |
| `npm run test:ci`  | Executa os testes gerando relatorio JUnit em `coverage/junit.xml`. |
| `npx tsc --noEmit` | Executa a checagem de tipos usada no pipeline.                     |

---

## Rotas da aplicacao

As rotas sao centralizadas em `src/shared/constants/routes.ts`.

| Rota                | Descricao                                                   | Acesso      |
| ------------------- | ----------------------------------------------------------- | ----------- |
| `/`                 | Redireciona para `/home`.                                   | Publico     |
| `/login`            | Login e cadastro de usuario.                                | Publico     |
| `/home`             | Dashboard com proximos jogos, convites e boloes do usuario. | Autenticado |
| `/guess`            | Tela para registrar e acompanhar palpites.                  | Autenticado |
| `/groups/:pollCode` | Detalhes do grupo, ranking, jogos e participantes.          | Autenticado |
| `/profile`          | Edicao de perfil do usuario autenticado.                    | Autenticado |

Rotas publicas passam por `PublicRoute` e rotas privadas passam por `PrivateRoute`.

---

## Estrutura do projeto

```text
src/
|-- app/                 # Entrada da aplicacao, providers, layouts, rotas e estilos globais
|   |-- layouts/         # Layouts compartilhados entre paginas
|   |-- providers/       # AppProviders, AuthProvider e QueryClientProvider
|   |-- routes/          # AppRouter, PrivateRoute e PublicRoute
|   `-- styles/          # global.css e tokens de UI
|
|-- entities/            # Modelos de dominio e queries de leitura
|   |-- game/            # Jogos e proximas partidas
|   |-- guess/           # Palpites
|   |-- invite/          # Convites
|   |-- poll/            # Boloes
|   |-- ranking/         # Ranking dos grupos
|   `-- user/            # Usuario autenticado e busca de usuarios
|
|-- features/            # Acoes do usuario e fluxos de negocio
|   |-- auth/            # Login e cadastro
|   |-- guess/           # Criacao e atualizacao de palpites
|   |-- invite/          # Criacao e resposta de convites
|   |-- poll/            # Criacao, edicao, exclusao e entrada em bolao
|   `-- user/            # Atualizacao de perfil
|
|-- pages/               # Telas roteaveis
|   |-- auth/
|   |-- group/
|   |-- guesses/
|   |-- home/
|   `-- profile/
|
|-- shared/              # Codigo compartilhado e independente de regra de negocio
|   |-- api/             # Axios e React Query client
|   |-- constants/       # Rotas e endpoints
|   |-- hooks/           # Hooks reutilizaveis
|   |-- lib/             # Tipos e utilitarios de ambiente
|   |-- ui/              # Componentes reutilizaveis
|   `-- utils/           # Helpers como cn()
|
`-- test/                # Setup, fixtures e mocks dos testes
```

### Organizacao por camadas

O projeto segue uma versao simplificada de FSD:

```text
app -> pages -> features -> entities -> shared
```

Regras principais:

- `app` configura a aplicacao.
- `pages` compoe telas e deve conter pouca regra de negocio.
- `features` concentra acoes do usuario.
- `entities` concentra modelos, tipos e queries de dominio.
- `shared` deve ser reutilizavel e nao depender das camadas acima.

---

## Integracao com a API

A configuracao HTTP fica em `src/shared/api/api.ts`.

Comportamentos importantes:

- `baseURL` vem de `VITE_API_URL`.
- O timeout padrao e de `5000ms`.
- O token de autenticacao fica em `localStorage`, na chave `auth_token`.
- Quando existe token, o Axios envia `Authorization: Bearer <token>`.
- Respostas com `{ error, data }` sao tratadas no interceptor.
- Erros da API sao exibidos com `sonner`.
- Resposta `401` limpa a sessao local e aciona logout.

Os caminhos da API ficam centralizados em `src/shared/constants/endpoints.ts`.

---

## Testes

Os testes usam **Vitest** com ambiente **jsdom** e setup em:

```text
src/test/setup/test-setup.ts
```

Execute todos os testes:

```bash
npm run test
```

Execute no formato usado pelo CI:

```bash
npm run test:ci
```

O comando de CI gera:

```text
coverage/junit.xml
```

---

## Docker

O `Dockerfile` possui dois estagios:

1. Build com `node:22-alpine`.
2. Servimento dos arquivos estaticos com `nginx:alpine`.

Build da imagem:

```bash
docker build --build-arg VITE_API_URL=http://localhost:3333 -t world-cup-poll-frontend .
```

Execucao local:

```bash
docker run --rm -p 3000:80 --name world-cup-poll-frontend world-cup-poll-frontend
```

A aplicacao ficara disponivel em:

```text
http://localhost:3000
```

---

## Rodando frontend e backend juntos

Na raiz do repositorio, suba primeiro as dependencias do backend:

```bash
cd world-cup-poll-backend
docker compose up -d db
npm install
npm run migrate
npm run dev
```

Em outro terminal, execute o frontend:

```bash
cd world-cup-poll-frontend
npm install
npm run dev
```

URLs padrao:

```text
Backend: http://localhost:3333
Frontend: http://localhost:5173
```

---

## CI/CD

O pipeline do `Jenkinsfile` executa:

1. Checkout do codigo.
2. Instalacao com `npm ci`.
3. Checagem de tipos com `npx tsc --noEmit`.
4. Testes com `npm run test:ci`.
5. Build da imagem Docker.
6. Deploy do container `world-cup-poll-frontend`.

Em caso de falha, o pipeline tenta enviar email com resumo dos testes a partir de `coverage/junit.xml`.

---

## Metodologia de desenvolvimento

O grupo adotou uma metodologia *híbrida, baseada em práticas do Scrum*.

Foram utilizados ciclos curtos de desenvolvimento, definição de prioridades e acompanhamento das atividades. A organização das tarefas foi feita principalmente pelo *WhatsApp*, onde o grupo distribuía as responsabilidades e informava o andamento do projeto.

Essa abordagem foi escolhida por ser simples e flexível, permitindo alterar prioridades e corrigir problemas durante o desenvolvimento.

## Papéis do grupo

* *João Vitor:* responsável pela organização das tarefas, definição das prioridades e desenvolvimento.
* *Vinicius:* responsável pelo desenvolvimento das funcionalidades e correção de erros.
* *José:* responsável pelo desenvolvimento das funcionalidades e correção de erros.
* *Eduardo:* responsável pelos testes, validação das funcionalidades e apoio no desenvolvimento.

Apesar dessa divisão, todos os integrantes colaboraram em diferentes partes do projeto.

## Cadência e ferramentas

O trabalho foi dividido em ciclos. O grupo definia as tarefas prioritárias e distribuía as atividades entre os integrantes.

Durante a semana, eram realizadas reuniões curtas ou trocas de mensagens para acompanhar o andamento, identificar dificuldades e reorganizar as tarefas quando necessário.

As principais ferramentas utilizadas foram:

* *GitHub*, para versionamento do código, branches, commits e issues;
* *WhatsApp*, para comunicação, distribuição e acompanhamento das tarefas.

## Definição de pronto

Uma tarefa era considerada pronta quando:

* a funcionalidade estava implementada;
* os testes haviam sido realizados;
* os critérios definidos haviam sido atendidos;
* o código estava integrado ao projeto;
* a conclusão havia sido comunicada ao grupo.

## Métricas

O grupo acompanhou métricas simples, como:

* quantidade de issues concluídas por ciclo;
* quantidade de tarefas pendentes;
* comparação entre tarefas planejadas e entregues.

Essas informações ajudaram o grupo a identificar atrasos e melhorar a organização dos ciclos seguintes.

---

## Uso de IA

Durante o desenvolvimento do projeto, ferramentas de inteligencia artificial foram usadas como apoio para acelerar tarefas de implementacao, revisao e documentacao. As sugestoes geradas foram avaliadas pelo grupo antes de serem incorporadas ao codigo.

### Modelos utilizados

- **ChatGPT / Codex** - apoio em documentacao, organizacao do README, revisao de estrutura do frontend, analise de codigo e sugestoes de melhoria.
- **GitHub Copilot** - apoio pontual na escrita de trechos repetitivos de codigo, autocompletar testes e acelerar implementacoes em componentes e hooks.

### Para que foram usados

- Geracao e melhoria de documentacao do frontend.
- Brainstorming de estrutura para README, secoes tecnicas e checklist de execucao.
- Revisao de rotas, scripts, variaveis de ambiente e arquitetura do projeto.
- Sugestoes de refatoracao em componentes, hooks e organizacao por camadas.
- Apoio na criacao e ajuste de testes automatizados com Vitest e Testing Library.
- Debugging de inconsistencias entre documentacao e codigo, como rotas e estrategia de autenticacao.
- Conferencia de endpoints centralizados em `shared/constants/endpoints.ts`.
- Apoio para validar uso de `PrivateRoute`, `PublicRoute` e lazy loading no `AppRouter`.
- Revisao da estrategia de token no Axios, incluindo envio do header `Authorization`.
- Apoio na escrita de mocks e providers para testes de componentes autenticados.
- Revisao do fluxo de build e deploy com Docker e Jenkins.

### Exemplos de prompts usados

| Prompt | Uso | Resultado |
| --- | --- | --- |
| `analise as rotas do AppRouter e confira se o README lista todas as telas autenticadas` | Revisao tecnica | A resposta foi aceita com ajustes. Foram conferidas as rotas `/home`, `/guess`, `/groups/:pollCode` e `/profile`, e o texto foi ajustado para explicar `PrivateRoute` e `PublicRoute`. |
| `explique como o interceptor do Axios trata token, erro 401 e formato { error, data }` | Debugging e documentacao | A resposta foi aceita com ajustes. A explicacao foi usada na secao de integracao com a API, depois de conferir o arquivo `src/shared/api/api.ts`. |
| `crie uma seed para popular o banco com usuarios, boloes, participantes, jogos e palpites para testes locais` | Dados de desenvolvimento | A resposta foi ajustada. A IA ajudou a montar a ideia da seed, mas o grupo adaptou os dados ao schema real do backend, aos relacionamentos entre tabelas e ao fluxo de testes local. |
| `construa a base da tela de usuario com formulario de edicao de nome e email usando os componentes compartilhados` | Implementacao de UI | A resposta foi parcialmente aceita. A estrutura inicial da tela foi aproveitada, mas estilos, estados de loading, validacao e integracao com a mutation foram ajustados manualmente. |
| `implemente o hook de atualizacao de perfil usando React Query mutation e invalide os dados do usuario logado` | React Query | A resposta foi ajustada. A ideia da mutation foi aproveitada, mas as chaves de cache e o endpoint seguiram os arquivos reais de `entities/user` e `features/user`. |
| `corrija o redirecionamento de usuario autenticado e nao autenticado usando PrivateRoute e PublicRoute` | Roteamento e autenticacao | A resposta foi parcialmente aceita. A IA ajudou a revisar o fluxo, mas a decisao final de redirecionar para `/home` ou `/login` foi validada no codigo. |
| `crie testes para o modal de criacao de bolao usando Vitest e Testing Library` | Testes | A resposta foi ajustada. A IA ajudou com o esqueleto dos testes, mas seletores, mocks e expectativas foram revisados manualmente para bater com os componentes reais. |
| `revise este hook de mutation e sugira invalidacoes de queries apos criar, editar ou excluir um bolao` | React Query | A resposta foi ajustada. A IA sugeriu invalidacoes, mas as chaves finais seguiram os arquivos `api/query-keys.ts` ja existentes. |
| `adicione validacao com Zod no formulario de login e mostre mensagens de erro por campo` | Formularios e validacao | A resposta foi ajustada. A IA sugeriu o schema e o uso de `zodResolver`, mas o grupo adequou as mensagens e o comportamento visual ao padrao das telas. |
| `sugira uma organizacao baseada em Feature-Sliced Design para este frontend React` | Arquitetura e brainstorming | A resposta foi parcialmente aceita. A ideia de camadas foi usada como referencia, mas o grupo simplificou a estrutura para evitar complexidade desnecessaria. |

### Dinamica de uso

A IA foi usada principalmente de forma individual pelos integrantes durante tarefas especificas e tambem em momentos de pair programming, quando o grupo queria comparar alternativas antes de implementar. No frontend, o uso ficou concentrado em documentacao, apoio a testes, revisao de componentes e validacao da estrutura de pastas.

As respostas nao foram aplicadas automaticamente. O grupo revisou os trechos sugeridos, testou quando necessario e adaptou nomes, rotas, endpoints e regras de negocio ao padrao ja existente no projeto.

### O que nao foi feito por IA

- Definicao das regras de negocio principais do bolao.
- Modelagem das entidades do dominio, como usuario, bolao, jogo, palpite, convite e ranking.
- Decisoes finais de arquitetura entre frontend e backend.
- Validacao manual dos fluxos de login, cadastro, criacao de bolao, convites, palpites e ranking.
- Ajustes finos de layout, responsividade e experiencia de uso.
- Revisao final do codigo antes da entrega.
- Configuracao e execucao final do ambiente local, Docker e pipeline de CI/CD.

---

## Padroes de desenvolvimento

- Use TypeScript em todo codigo de aplicacao.
- Centralize rotas em `shared/constants/routes.ts`.
- Centralize endpoints em `shared/constants/endpoints.ts`.
- Use React Query para dados vindos da API.
- Use mutations para acoes de escrita.
- Evite chamadas HTTP diretamente em componentes.
- Prefira componentes reutilizaveis de `shared/ui`.
- Mantenha paginas focadas em composicao.
- Crie ou atualize testes ao alterar comportamento relevante.
- Use nomes de arquivos em `kebab-case`.

Antes de abrir um pull request ou entregar uma alteracao, rode:

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```
