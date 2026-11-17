<div align="center">

# Tank Sudda

**Clean tanks. Done properly.**

The website, knowledge centre and booking system for Tank Sudda, a professional water tank and sump cleaning service in Sri Lanka.

[![Website](https://img.shields.io/badge/website-tanksudda.com-374151?style=flat-square&labelColor=111827)](https://tanksudda.com)
[![CI](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/actions/workflows/ci.yml/badge.svg)](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-v1.0.0-374151?style=flat-square&labelColor=111827)](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/releases)
![License](https://img.shields.io/badge/license-proprietary-374151?style=flat-square&labelColor=111827)

[**tanksudda.com**](https://tanksudda.com) · [Documentation](docs/README.md) · [Report a bug](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/issues/new?template=bug_report.yml) · [Request a change](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/issues/new?template=feature_request.yml)

</div>

---

## Contents

- [About](#about)
- [Features](#features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Project structure](#project-structure)
- [Quality checks](#quality-checks)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Releases and versioning](#releases-and-versioning)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## About

Tank Sudda cleans domestic, commercial and institutional water tanks and sumps across Sri Lanka. This repository powers [tanksudda.com](https://tanksudda.com): service and pricing information, a knowledge centre on safe water storage, and online booking, in English, Sinhala and Tamil.

**Verified facts only.** The site never shows an unconfirmed phone number, price, area, review, photo or certification. Unknown values are stored as `null` and hidden in production; [docs/OWNER-CHECKLIST.md](docs/OWNER-CHECKLIST.md) lists what is still needed.

|                  |                                                                   |
| ---------------- | ----------------------------------------------------------------- |
| **Organisation** | Tank Sudda (Pvt) Ltd                                              |
| **Status**       | Live                                                              |
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

## Architecture

A Next.js App Router application on Cloudflare Workers via OpenNext. Public pages are prerendered; booking and contact run as Server Actions with validation, rate limiting and email or webhook delivery. Business facts live in typed modules under `src/data` and articles in MDX.

The full picture, with diagrams, is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Significant decisions are recorded as [ADRs](docs/adr/README.md).

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

## Configuration

Form delivery (Resend and an optional signed webhook), analytics, indexing and the canonical origin are set by environment variables. Non-secret values live in `wrangler.jsonc`; secrets are set in the Cloudflare dashboard.

Every variable, where it is set and which are secret: [docs/CONFIGURATION.md](docs/CONFIGURATION.md). How to update content is in [docs/CONTENT.md](docs/CONTENT.md).

## Project structure

```
.
├── .github/              # CI, issue and pull request templates
├── docs/                 # Architecture, configuration, deployment, content, ADRs, runbooks, plans
├── public/               # Static files
├── scripts/              # Article index, illustrations, email icons and brand asset generators
├── src/
│   ├── app/              # App Router: (en) English routes, (intl)/[lang] Sinhala and Tamil, metadata files
│   ├── components/       # Layout, page views, sections, booking and form components, SEO
│   ├── content/blog/     # Knowledge-centre articles in MDX
│   ├── data/             # Business facts, services, pricing, areas, FAQs and i18n dictionaries
│   ├── lib/              # Content loading, Markdown versions, SEO builders, validation, i18n
│   └── server/           # Server Actions, lead pipeline, notifications and rate limiting
├── tests/                # Vitest unit tests and Playwright end-to-end tests
├── open-next.config.ts   # OpenNext adapter configuration
└── wrangler.jsonc        # Cloudflare Workers configuration
```

## Quality checks

Every push and pull request to `main` runs the [CI workflow](.github/workflows/ci.yml): type check, lint, formatting, unit tests and a production build, followed by the full Playwright end-to-end and accessibility suite. Run the same checks locally before opening a pull request:

```sh
bun run lint && bun run format:check && bun run typecheck && bun run test && bun run build
bun run test:e2e
```

## Deployment

Deployed to Cloudflare Workers with `bun run cf:deploy` or through Workers Builds connected to this repository.

Setup, secrets and post-deployment checks are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). To release or roll back, follow the [runbooks](docs/runbooks/README.md).

## Documentation

All documentation lives in [`docs/`](docs/README.md), using the same layout in every STTPS repository.

| Document                                  | Covers                                              |
| ----------------------------------------- | --------------------------------------------------- |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)   | How the system is built and how data flows          |
| [CONFIGURATION.md](docs/CONFIGURATION.md) | Environment variables and configuration files       |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md)       | Hosting, the delivery pipeline and first-time setup |
| [CONTENT.md](docs/CONTENT.md)             | Updating copy, business data, imagery and articles  |
| [adr/](docs/adr/README.md)                | Architecture decision records                       |
| [runbooks/](docs/runbooks/README.md)      | Release and rollback procedures                     |

Product and reference documents for this project are listed in the [documentation index](docs/README.md).

## Releases and versioning

The project follows [Semantic Versioning](https://semver.org). Each release is tagged `vX.Y.Z` and published on the [Releases](https://github.com/saadmaz/Tank-Sudda-Website-TypeScript/releases) page. Notable changes are recorded in [CHANGELOG.md](CHANGELOG.md), and the release procedure is in [docs/runbooks/release.md](docs/runbooks/release.md).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the branching model, commit conventions and pull request checklist. All participants are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Please do not report security issues in public issues. See [SECURITY.md](SECURITY.md) for how to report a vulnerability privately.

## License

Copyright © 2026 Tank Sudda (Pvt) Ltd. All rights reserved.

This is proprietary software. No permission is granted to use, copy, modify or distribute it without prior written consent. See [LICENSE](LICENSE).
