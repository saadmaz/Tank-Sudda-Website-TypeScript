<div align="center">

# Tank Sudda

**Clean tanks. Done properly.**

The official website, knowledge centre and booking system for Tank Sudda, a professional water tank and sump cleaning service in Sri Lanka.

[![Website](https://img.shields.io/badge/website-tanksudda.com-0EA5E9?style=flat-square&labelColor=0B1728)](https://tanksudda.com)
[![CI](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/actions/workflows/ci.yml/badge.svg)](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-proprietary-0B1728?style=flat-square)

[**tanksudda.com**](https://tanksudda.com) · [Report a bug](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/issues/new?template=bug_report.yml) · [Request a change](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/issues/new?template=feature_request.yml)

</div>

---

## Contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Verified facts only](#verified-facts-only)
- [Quality checks](#quality-checks)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Releases and versioning](#releases-and-versioning)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## About

Tank Sudda cleans domestic, commercial and institutional water tanks and sumps across Sri Lanka. This repository powers [tanksudda.com](https://tanksudda.com): service and pricing information, a knowledge centre on safe water storage, and the online booking flow, in English, Sinhala and Tamil.

|                  |                                                                   |
| ---------------- | ----------------------------------------------------------------- |
| **Organisation** | Tank Sudda (Pvt) Ltd                                              |
| **Website**      | [tanksudda.com](https://tanksudda.com)                            |
| **Contact**      | [info@tanksudda.com](mailto:info@tanksudda.com) · +94 74 100 4296 |
| **Maintainer**   | [Saad Mazhar](https://github.com/saadmaz)                         |

## Features

- **Services:** Water tank deep cleaning, sump cleaning, and commercial and institutional tank cleaning, each with a step-by-step method.
- **Booking wizard:** A three-step booking request with server-side validation, rate limiting, branded notification emails and an optional customer confirmation email. Falls back to WhatsApp if delivery fails.
- **Knowledge centre:** MDX articles with categories, tags, search, curated guides, a table of contents and related content.
- **Three languages:** English, Sinhala (`/si`) and Tamil (`/ta`), each with its own fonts and root layout.
- **Static first:** Public pages are prerendered; only search and the booking acknowledgement render on request.
- **SEO and AI readiness:** Per-page metadata, JSON-LD, a generated sitemap, Markdown versions of every public page, and `llms.txt` / `llms-full.txt`.
- **Accessibility:** Automated axe checks, keyboard-friendly forms and WCAG AA contrast, covered by Playwright.
- **Privacy-aware analytics:** Google Analytics or Plausible, switched on by environment variable.

## Tech stack

| Layer     | Technology                                                                       |
| --------- | -------------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router, Server Components, Server Actions) |
| Language  | TypeScript (strict)                                                              |
| Styling   | Tailwind CSS 4                                                                   |
| Content   | MDX articles in `src/content/blog`                                               |
| Forms     | React Hook Form + Zod, shared by client and server                               |
| Email     | Resend, plus an optional signed webhook                                          |
| Hosting   | Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare)            |
| Tooling   | Bun, Vitest, Playwright, axe-core, ESLint, Prettier                              |

## Getting started

### Prerequisites

- Node.js 20.9 or later (22 LTS recommended)
- [Bun](https://bun.sh) 1.4 or later

### Install and run

```sh
git clone https://github.com/saadmaz/Tank-Sudda-Website-TypeScript.git
cd Tank-Sudda-Website-TypeScript
bun install
cp .env.example .env.local   # optional; see docs/CONFIGURATION.md
bun run dev                  # http://localhost:3000
```

### Scripts

| Command                           | Description                                                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `bun run dev`                     | Development server (drafts and unverified areas visible)                                                                     |
| `bun run build`                   | Production build                                                                                                             |
| `bun run start`                   | Serve the production build                                                                                                   |
| `bun run typecheck`               | Route type generation and `tsc --noEmit`                                                                                     |
| `bun run lint`                    | ESLint (Next.js core-web-vitals and TypeScript rules)                                                                        |
| `bun run format` / `format:check` | Format with Prettier, or check without writing                                                                               |
| `bun run test`                    | Unit tests (Vitest)                                                                                                          |
| `bun run test:e2e`                | End-to-end, link, 404 and axe accessibility tests (Playwright; build first, and run `bunx playwright install chromium` once) |
| `bun run check`                   | Type check, lint, unit tests and build                                                                                       |
| `bun run cf:preview`              | Build for Cloudflare and preview in the Workers runtime                                                                      |
| `bun run cf:deploy`               | Build for Cloudflare and deploy                                                                                              |

## Verified facts only

The site never shows invented phone numbers, prices, coverage areas, reviews, photos or certifications. Anything not yet confirmed by the owner is stored as `null` or left empty, and is hidden in production. In development a dashed "Owner to confirm" marker shows where it will appear. [docs/OWNER-CHECKLIST.md](docs/OWNER-CHECKLIST.md) lists everything still waiting for input.

## Quality checks

Every push and pull request to `main` runs the [CI workflow](.github/workflows/ci.yml):

1. **Verify:** type check, lint, formatting, unit tests and a production build.
2. **End-to-end:** the full Playwright suite (routing, 404s, internal links, forms, layout and axe accessibility) on desktop and mobile viewports.

Run the same checks locally before opening a pull request:

```sh
bun run check && bun run test:e2e
```

## Deployment

tanksudda.com runs on **Cloudflare Workers**, built with `@opennextjs/cloudflare`. Configuration lives in [`wrangler.jsonc`](wrangler.jsonc). Non-secret settings are kept in `vars`; secrets (`RESEND_API_KEY`, `LEAD_WEBHOOK_SECRET`) are set in the Cloudflare dashboard and never committed.

Deploy from your machine with:

```sh
npx wrangler login   # once
bun run cf:deploy
```

Or connect the repository in Cloudflare Workers Builds to deploy every push to `main`. Hosting, DNS, email routing and the post-deployment checklist are covered in [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

## Documentation

| Document                                      | Covers                                                                                             |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)       | Structure, routes, data flow, Markdown versions, adding languages                                  |
| [CONTENT.md](docs/CONTENT.md)                 | Publishing articles, editing site data and photos, SEO checklist                                   |
| [CONFIGURATION.md](docs/CONFIGURATION.md)     | Environment variables, form delivery, analytics, hosting, DNS, Search Console                      |
| [BACKEND.md](docs/BACKEND.md)                 | Planned database, admin and reporting                                                              |
| [OWNER-CHECKLIST.md](docs/OWNER-CHECKLIST.md) | Business information still needed                                                                  |
| [GROWTH-PLAN.md](docs/GROWTH-PLAN.md)         | Launch, local SEO, trust and marketing plan                                                        |
| [SEO-PLAN.md](docs/SEO-PLAN.md)               | Keyword research, keyword-to-page map and phased SEO plan                                          |
| [marketing/](docs/marketing/README.md)        | Company profile, Google Business Profile, directories, reviews, social media and WhatsApp Business |

## Releases and versioning

The project follows [Semantic Versioning](https://semver.org). Each release is tagged `vX.Y.Z` and published on the [Releases](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/releases) page. Notable changes are recorded in [CHANGELOG.md](CHANGELOG.md).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the branching model, commit conventions and pull request checklist. All participants are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Please do not report security issues in public issues. See [SECURITY.md](SECURITY.md) for how to report a vulnerability privately.

## License

Copyright © 2026 Tank Sudda (Pvt) Ltd. All rights reserved.

This is proprietary software. No permission is granted to use, copy, modify or distribute it without prior written consent. See [LICENSE](LICENSE).
