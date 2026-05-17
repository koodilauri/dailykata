# dailykata

A daily coding kata app. Solve small TypeScript challenges in the browser, track your streak and XP, and level up over time.

**[dailykata.lako.workers.dev](https://dailykata.lako.workers.dev)**

## Stack

- **Framework:** TanStack Start (React SSR on Cloudflare Workers)
- **Routing:** TanStack Router (file-based)
- **Database:** PostgreSQL via Supabase + Drizzle ORM
- **Auth:** better-auth (GitHub OAuth)
- **Editor:** CodeMirror 6
- **Styling:** Tailwind CSS
- **Deploy:** Cloudflare Workers

## Getting started

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` and fill in the required values:

```
DATABASE_URL=
DIRECT_DATABASE_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
VITE_BETTER_AUTH_URL=http://localhost:3000
BETA_PASSWORD=
BETA_SECRET=
```

## Access control

The app has a beta gate at `/gate`. Three access levels:

| Cookie | Access |
|--------|--------|
| `better-auth.session_token` | Full app (signed in) |
| `beta_access` | Full app (logged out, entered beta password) |
| `demo_access` | `/demo/*` only — hard-coded katas, localStorage progress |

Demo mode uses no database. Progress (XP, streak, completions) is stored in localStorage only.

## Development

```bash
pnpm dev        # start dev server
pnpm build      # production build
pnpm test       # unit tests
pnpm test:e2e   # end-to-end tests (Playwright)
```

## Database

```bash
pnpm db:generate   # generate migrations from schema changes
pnpm db:migrate    # apply migrations
pnpm db:studio     # open Drizzle Studio
```

## Deploy

```bash
pnpm build
wrangler deploy
```

Set production secrets:

```bash
wrangler secret put BETA_PASSWORD
wrangler secret put BETA_SECRET
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GITHUB_CLIENT_SECRET
```
