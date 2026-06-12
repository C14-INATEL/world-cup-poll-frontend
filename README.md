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
