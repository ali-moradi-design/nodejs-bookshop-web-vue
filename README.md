# nodejs-bookshop-web-vue

**Vite + Vue 3 + TypeScript SPA** bookstore frontend for the layered Mongo API  
[`nodejs-bookshop-layered`](https://github.com/ali-moradi-design/nodejs-bookshop-layered).

Idiomatic Vue port of the React FSD storefront  
[`nodejs-bookshop-web-vite-fsd`](https://github.com/ali-moradi-design/nodejs-bookshop-web-vite-fsd).

## Stack

- **Vite** · Vue 3 (Composition API) · TypeScript · Vue Router · Pinia
- Feature-Sliced Design (`src/app`, `src/pages`, `src/widgets`, `src/features`, `src/entities`, `src/shared`)
- Tailwind CSS v4 · vue-i18n (`en` + `fa`, RTL) · Inter / Vazirmatn
- Themes: Pine / Amethyst / Terracotta × light/dark
- Fetch client with `credentials: 'include'` + cookie refresh interceptor
- Vitest

## Prerequisites

1. Run the layered backend on `http://localhost:4000`.
2. Seed admin: `admin@bookstore.local` / `Admin123!`

Local `pnpm dev` uses the **Vite proxy** (`/api` and `/uploads` → `http://localhost:4000`), so leave `VITE_API_URL` empty to avoid CORS.

## Setup

```bash
pnpm install
cp .env.example .env
# Leave VITE_API_URL empty to use the Vite proxy (recommended).
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Run with layered backend

```bash
# terminal 1 — API
cd ../nodejs-bookshop-layered
npm run dev

# terminal 2 — this Vue SPA
cd ../nodejs-bookshop-web-vue
pnpm install && pnpm dev
```

## Scripts

| Script         | Description                |
| -------------- | -------------------------- |
| `pnpm dev`     | Vite dev server (port 5173)|
| `pnpm build`   | Typecheck + production build |
| `pnpm preview` | Preview production build   |
| `pnpm typecheck` | `vue-tsc -b`             |
| `pnpm test`    | Vitest unit tests          |

## Auth & API

- All API calls use `credentials: 'include'` (httpOnly `accessToken` / `refreshToken` cookies).
- Client refresh interceptor retries once on `401` via `POST /api/v1/auth/refresh`.
- Env: `VITE_API_URL` — leave empty in local `pnpm dev` for same-origin proxy paths.

## Surfaces

- **Storefront**: home (featured), catalog (search/filters/pagination), book detail + reviews, cart, checkout
- **User panel** (`/panel`): dashboard, profile, orders (+ pay), favorites, my reviews, issue report
- **Admin** (`/admin`): dashboard KPIs, books CRUD, orders status, users, roles, permissions, discounts, issue reports, analytics

## FSD layout

```
src/
  app/          # Vue app, router, layouts, global styles
  pages/        # route-level pages
  widgets/      # header, footer, shells, book grid, hero
  features/     # auth, cart, filters, theme/locale
  entities/     # book, cart, order, user, …
  shared/       # api client, ui kit, i18n, lib, config
```

## Gaps vs React FSD

- No Storybook / Playwright / husky in this initial port
- Admin CRUD is leaner (lists + essential mutations; no cover upload UI yet)
- No TanStack Query — Pinia + `useAsync` / local page state instead
- Charts / advanced admin analytics visualizations are tabular
