# ADR-0002: Next.js on Cloudflare Workers through OpenNext

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-10-13 |

## Decision

Deploy the Next.js application to Cloudflare Workers with `@opennextjs/cloudflare`, keeping non-secret settings in `wrangler.jsonc` and secrets in the Cloudflare dashboard.

## Alternatives considered

A Node.js host; a pure static export.

## Rationale

Server Actions for booking and contact need a runtime, and Workers give global edge delivery without managing servers. Keeping variables in `wrangler.jsonc` stops deploys from wiping them.
