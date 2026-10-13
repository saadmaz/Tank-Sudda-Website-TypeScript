# Tank Sudda website

Marketing website, knowledge centre and booking-request system for **Tank Sudda**, a water tank
and sump cleaning business in Sri Lanka.

Built with Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, MDX, React Hook
Form and Zod. Package manager: **Bun**.

## Prerequisites

- Node.js 20.9 or later (22 LTS recommended)
- [Bun](https://bun.sh) 1.3 or later

## Quick start

```bash
bun install
cp .env.example .env.local   # optional — see docs/CONFIGURATION.md
bun run dev                  # http://localhost:3000
```

| Command             | Purpose                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `bun run dev`       | Development server (drafts and unverified areas visible)                                                                               |
| `bun run build`     | Production build                                                                                                                       |
| `bun run start`     | Serve the production build                                                                                                             |
| `bun run typecheck` | Route type generation + `tsc --noEmit`                                                                                                 |
| `bun run lint`      | ESLint (Next.js core-web-vitals + TypeScript rules)                                                                                    |
| `bun run format`    | Prettier (with Tailwind class sorting)                                                                                                 |
| `bun run test`      | Unit tests (Vitest)                                                                                                                    |
| `bun run test:e2e`  | End-to-end, link, 404 and axe accessibility tests (Playwright; run `bun run build` first, and `bunx playwright install chromium` once) |
| `bun run check`     | Typecheck, lint, unit tests and build                                                                                                  |

## Important rule: verified facts only

The site never shows invented phone numbers, prices, coverage areas, reviews, photos or
certifications. Anything not yet confirmed by the owner is stored as `null` / empty and hidden in
production (a dashed "Owner to confirm" marker appears in development only). See
**[docs/OWNER-CHECKLIST.md](docs/OWNER-CHECKLIST.md)** for everything that still needs input.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — structure, routes, data flow, adding languages
- [docs/CONTENT.md](docs/CONTENT.md) — publishing articles, editing site data and photos, SEO and content checklist
- [docs/CONFIGURATION.md](docs/CONFIGURATION.md) — environment variables, form delivery, hosting, post-deployment checks, Search Console
- [docs/BACKEND.md](docs/BACKEND.md) — planned database, admin and reporting
- [docs/OWNER-CHECKLIST.md](docs/OWNER-CHECKLIST.md) — information needed before launch
- [docs/GROWTH-PLAN.md](docs/GROWTH-PLAN.md) — launch, local SEO, trust and marketing plan
- [docs/SEO-PLAN.md](docs/SEO-PLAN.md) — keyword research findings, keyword-to-page map and phased SEO plan
