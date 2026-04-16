# World Cup Poll — Frontend

Aplicacao web para criar e participar de boloes da Copa do Mundo. Desenvolvida com React, TypeScript e Vite.

---

## Tecnologias

- **React 19** + **TypeScript**
- **Vite 8** — build tool e dev server
- **Tailwind CSS v4** — estilizacao com design tokens OKLCH
- **React Router v7** — roteamento
- **TanStack React Query v5** — gerenciamento de estado do servidor
- **React Hook Form** + **Zod** — formularios e validacao
- **Axios** — cliente HTTP
- **Sonner** — notificacoes toast

---

## Pre-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior
- Backend rodando em `http://localhost:3333` (veja o repositorio `world-cup-poll-backend`)

---

## Configuracao do ambiente

Copie o arquivo de exemplo e ajuste as variaveis:

```bash
cp .env.example .env
```

Conteudo do `.env` para desenvolvimento local:

```env
VITE_API_URL=http://localhost:3333
```

> **Atencao:** o valor padrao do `.env.example` usa `/api` (modo producao com Nginx). Para rodar localmente, certifique-se de apontar para a URL do backend.

---

## Como inicializar

```bash
# 1. Instale as dependencias
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicacao estara disponivel em: **http://localhost:5173**

---

## Scripts disponiveis

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Gera o build de producao em `/dist` |
| `npm run preview` | Previa do build de producao localmente |
| `npm run lint` | Executa o ESLint no projeto |

---

## Estrutura do projeto

```
src/
├── app/              # Setup da aplicacao (rotas, layouts, providers)
│   ├── layouts/      # authenticated-layout, divided-layout
│   ├── providers/    # AuthContext, QueryClient, AppProviders
│   ├── routes/       # app-router, private-route, public-route
│   └── styles/       # global.css com design tokens
│
├── entities/         # Modelos de dados e queries
│   ├── game/         # Tipos e useNextGamesQuery
│   ├── poll/         # Tipos e useUserPollsQuery
│   └── user/         # Tipos e useCurrentUserQuery
│
├── features/         # Logica de funcionalidades
│   ├── auth/         # useLoginMutation, useRegisterMutation
│   └── poll/         # CreatePollModal, useCreatePollMutation
│
├── pages/            # Componentes de pagina
│   ├── auth/         # Pagina de login e cadastro
│   └── home/         # Dashboard principal
│
└── shared/           # Utilitarios e componentes compartilhados
    ├── api/          # Instancia Axios e QueryClient
    ├── constants/    # Endpoints e rotas
    ├── hooks/        # useMobile
    ├── ui/           # Button, Dialog, Input, Sidebar, Skeleton...
    └── utils/        # cn (classname merger)
```

---

## Paginas

| Rota | Descricao | Acesso |
|------|-----------|--------|
| `/auth` | Login e cadastro de usuario | Publico |
| `/home` | Dashboard com proximos jogos e boloes | Autenticado |

---

## Rodando frontend e backend juntos

Para rodar o projeto completo localmente, siga a ordem abaixo:

```bash
# Terminal 1 — Banco de dados (requer Docker)
cd world-cup-poll-backend
docker compose up -d db

# Terminal 2 — Backend
cd world-cup-poll-backend
npm install
npx drizzle-kit migrate
npm run dev
# API disponivel em http://localhost:3333

# Terminal 3 — Frontend
cd world-cup-poll-frontend
npm install
npm run dev
# App disponivel em http://localhost:5173
```
