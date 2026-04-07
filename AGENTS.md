# AGENTS.md

## Project Overview

This is a World Cup pool web application.

Priorities:

* Mobile-first UI
* High performance
* Consistent system design
* Clear separation of concerns

---

## Documentation Resources

Always follow these official documentations:

* [https://feature-sliced.design/docs/get-started/overview](https://feature-sliced.design/docs/get-started/overview) — Architecture (FSD)
* [https://feature-sliced.design/docs/guides/tech/with-react-query](https://feature-sliced.design/docs/guides/tech/with-react-query) — React Query with FSD
* [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs) — UI components
* [https://v3.tailwindcss.com/](https://v3.tailwindcss.com/) — Styling

---

## Project Structure (Feature-Sliced Inspired)

This project follows a **simplified Feature-Sliced Design (FSD)** approach.
The goal is to keep the codebase **scalable, maintainable, and easy to navigate**, without unnecessary complexity.

```
src/
  app/
    providers/
    routes/
  pages/
  features/
  entities/
  shared/
    api/
    ui/
    lib/
    constants/
```

---

### Layer Responsibilities

* **app/**
  Application entry point and global setup (providers, routing, global configs).

* **pages/**
  Route-level components.
  Responsible for composing features and entities into screens.
  Should contain minimal business logic.

* **features/**
  User-driven actions and flows (e.g., login, create poll, invite user).
  Encapsulates business logic, state, and UI related to specific interactions.

* **entities/**
  Core business models (e.g., user, poll, game, guess).
  Contains types, API calls, and minimal domain logic.

* **shared/**
  Reusable, app-agnostic code.
  Includes UI components, utilities, API clients, and constants.
  Should not depend on other layers.

---

### Guidelines

* Prefer **organization by domain (feature/entity)** over file type.
* Keep dependencies **unidirectional**:

  ```
  app → pages → features → entities → shared
  ```
* Avoid cross-layer imports that break this flow.
* Use **barrel files (`index.ts`)** to simplify imports.
* Keep pages thin — move logic to features whenever possible.

---

## Development Guidelines

### Code Style & Standards

* TypeScript **required** (strict mode)
* Use **kebab-case** for filenames
* Use **descriptive naming**
* Prefer **small, composable functions/components**

---

### React Guidelines (React 19)

* Use **function components only**
* Use **hooks for logic extraction**
* Enable **React Compiler**
* Use memoization when needed (`useMemo`, `useCallback`)
* Use **Error Boundaries**

---

## Side Effects Strategy (IMPORTANT)

**Do NOT default to `useEffect` for side effects.**

Instead, follow this decision model:

### ✅ Preferred Patterns

* **Data fetching** → use **React Query**
* **User actions (mutations)** → use **React Query mutations**
* **Derived state** → compute directly (no effect)
* **Event-based logic** → handle inside event handlers
* **Async flows** → encapsulate in hooks or services

### ⚠️ `useEffect` is allowed ONLY for:

* DOM side effects (e.g., focus, scroll)
* Subscriptions (e.g., websockets, listeners)
* Integrations with external APIs that require lifecycle control

### ❌ Avoid:

* Fetching data with `useEffect`
* Syncing state that can be derived
* Triggering business logic on render

---

## Data Fetching

Use **TanStack React Query** for all server state.

### Rules

* No manual fetch logic inside components
* All API calls must go through query/mutation hooks

### Naming Convention

* Queries → `useXQuery`
* Mutations → `useXMutation`

### Query Keys

Use structured keys and create a file to define keys:

```ts
// entities/*/api/query-keys.ts
export const userQueryKeys = {
  all: ['users'],
  single: (userId: string) => ['users', userId],
  me: ['users', 'me'],
};
```

```
["entity", "scope", params]
```

Example:

```
["poll", "by-code", code]
```

### Placement

* `entities/*/api` → entity-related queries
* `features/*/api` → action-related mutations

---

## API

Backend: `http://localhost:3333`

### Response Format

**Error:**

```json
{
  "error": "string",
  "data": null
}
```

**Success:**

```json
{
  "error": null,
  "data": {}
}
```

---

### Authentication

* Uses **http-only cookie (`session_id`)**
* Fetch current user via `/me`
* Do not store tokens manually

---

### API Routes

* POST /auth/register
* POST /auth/login
* POST /auth/logout
* POST /poll/invite
* GET /me/invites
* PATCH /invite/:id
* POST /poll/create
* GET /poll/:code
* GET /polls/user
* GET /games
* POST /polls/:pollId/guess/create
* PUT /polls/:pollId/guess/:guessId/update
* GET /guess/participant/:participantId
* GET /guess/game/:gameId

---

## Data Models

### Game

```ts
type Game = {
  date: Date;
  id: string;
  status: string;
  apiId: number;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  firstTeamName: string | null;
  secondTeamName: string | null;
  firstTeamGoals: number | null;
  secondTeamGoals: number | null;
  firstTeamCrestUrl: string | null;
  secondTeamCrestUrl: string | null;
}
```

### Guess

```ts
type Guess = {
  id: string;
  createdAt: Date;
  firstTeamPoints: number;
  secondTeamPoints: number;
  gameId: string;
  participantId: string;
}
```

### Invite

```ts
type Invite = {
  id: string;
  createdAt: Date;
  pollId: string;
  invitedUserId: string;
  invitedBy: string;
  status: "pending" | "accepted" | "declined";
  expiresAt: Date;
}
```

### Participant

```ts
type Participant = {
  id: string;
  pollId: string;
  userId: string;
}
```

### Poll

```ts
type Poll = {
  id: string;
  title: string;
  code: string;
  createdAt: Date;
  ownerId: string;
}
```

### User

```ts
type User = {
  name: string;
  id: string;
  email: string;
  passwordHash: string;
}
```

---

## UI Guidelines

* Use **shadcn components** from `shared/ui`
* Avoid raw HTML if a component exists
* Keep components:

  * Small
  * Reusable
  * Presentational (no business logic)

---

## State Management

* Server state → React Query
* Local state → `useState`
* Avoid global state unless necessary

---

## Forms & Validation

Use **React Hook Form** + **Zod** for all forms.

### Rules

* Use `react-hook-form` to manage form state and submission
* Use `zod` schemas as the single source of truth for validation
* Integrate with `@hookform/resolvers/zod` via `zodResolver`
* Keep schemas close to the feature/entity that owns the form
* Show field-level validation messages in the UI
* Avoid manual validation logic inside components when schema validation can cover it

### Placement

* `features/*/model` or `entities/*/model` → form schemas/types
* `features/*/ui` → form components using `useForm`

### Naming Convention

* Schema → `xSchema` (example: `loginSchema`)
* Inferred type → `XFormValues` (example: `LoginFormValues`)

---

## UX Rules

Always handle:

* Loading state
* Error state
* Empty state

Use shadcn components (skeletons/spinners).

---

## Routing

* Use `React Router` with `<BrowserRouter />`
* Define routes in `app/routes`
* Use constants from `shared/constants/routes`
* Use lazy loading for pages

---

## Constants

* Store all routes and endpoints in:

  * `shared/constants/routes`
  * `shared/constants/endpoints`

Do NOT hardcode paths.

---

## Do / Don't

### ✅ Do

* Follow FSD structure strictly
* Extract logic into hooks
* Use React Query for async state
* Reuse shared components

### ❌ Don’t

* Use `useEffect` for data fetching
* Mix API calls inside components
* Hardcode routes or endpoints
* Put business logic in UI components

---

## Definition of Done

A task is complete when:

* Types are defined
* API is integrated via React Query
* No unnecessary `useEffect`
* Loading, error, and empty states handled
* UI uses shadcn components
* Code follows FSD structure