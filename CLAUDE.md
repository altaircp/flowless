# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Does

Flowless is a queue management SaaS — customers join queues (walk-in, kiosk, or online booking), staff call and serve them from counters, and managers monitor analytics. Astro 6 + Preact, deployed to Cloudflare Pages.

## Commands

- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Production build to `./dist/`
- `npm run preview` — Build and preview locally via Wrangler
- `npm run deploy` — Build and deploy to Cloudflare Pages
- `npx astro check` — TypeScript + Astro type checking (runs in pre-commit hook)

## Architecture

- **Framework:** Astro 6 with strict TypeScript, Preact islands, Tailwind CSS v4
- **Runtime:** Cloudflare Pages with `nodejs_compat` flag
- **Build tool:** Vite 7 (pinned override), Node >=22.12.0
- **State:** Nanostores for client-side state, MockDataStore for server-side data

## Source Structure

- `src/pages/` — 9 route groups: index, join, book, ticket, feedback, kiosk, signage, staff, admin, dashboard
- `src/components/` — 60+ components by feature (queue, staff, admin, dashboard, kiosk, signage, appointment, feedback, landing, layout, ui)
- `src/layouts/` — 5 layouts: Layout (base), AppLayout (authenticated), PublicLayout, KioskLayout, SignageLayout
- `src/data/` — Domain types, enums, MockDataStore, and seed data (13 entity types)
- `src/stores/` — Nanostores atoms: queue.ts (join flow), counter.ts (staff), ticket.ts (tracking)
- `src/lib/` — Pure helpers: analytics, constants, format, queue-logic, time-slots
- `src/assets/` — Static assets processed by Astro
- `public/` — Static files served as-is

## Key Files (how they connect)

1. `src/data/types.ts` — 13 domain interfaces (Branch, Service, Ticket, Queue, Counter, etc.)
2. `src/data/enums.ts` — Status enums used across all components (TicketStatus, QueueState, etc.)
3. `src/data/store.ts` — `MockDataStore` class + singleton `dataStore`; all pages import this for queries and mutations
4. `src/stores/queue.ts` — Client atoms ($selectedBranchId, $currentTicket) for join-queue Preact islands
5. `src/components/queue/JoinQueueForm.tsx` — Core customer flow: select branch/service, join queue
6. `src/components/staff/CounterPanel.tsx` — Staff calls next ticket, completes service
7. `src/components/dashboard/KPICards.tsx` — Manager dashboard reads aggregated stats from dataStore
8. `src/layouts/AppLayout.astro` — Wraps all authenticated views (sidebar + navbar)
9. `astro.config.mjs` — Astro + Cloudflare adapter + Preact + Tailwind config
10. `wrangler.jsonc` — Cloudflare Pages deployment config

## Known Risks

- **MockDataStore is in-memory only** — data resets on server restart, no persistence layer
- **No authentication** — all routes are publicly accessible
- **No error boundaries** — Preact island runtime errors crash the component tree
- **No tests** — no unit, integration, or e2e test framework configured

## Tracking Files

- **WORK-PENDING.md** — Known bugs, fixes needed, planned features. Read before starting new work.
- **fix-history.md** — Log of bugs found and fixed. Read before editing a file mentioned there.

## AI Rules

1. Make one change at a time. Verify it works before making the next change.
2. Read fix-history.md before editing a file — check if it has been fixed before.
3. Read WORK-PENDING.md before starting new work — avoid duplicating effort.
4. After editing a file, read it back to confirm the change is correct.
5. Commit messages explain WHY, not WHAT.

## Notes

- Cloudflare bindings (KV, D1, R2) can be added in `wrangler.jsonc` and typed via `npm run generate-types`.
- Environment variables go in `.dev.vars` locally (gitignored) and Cloudflare dashboard for production.
- Path aliases: `@/*`, `@components/*`, `@layouts/*`, `@data/*`, `@stores/*`, `@lib/*`.
