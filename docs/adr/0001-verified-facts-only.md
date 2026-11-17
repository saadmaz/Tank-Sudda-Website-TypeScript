# ADR-0001: Verified facts only

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-10-12 |

## Decision

Never publish an unconfirmed phone number, price, area, review, photo or certification. Unknown values are stored as `null` and hidden in production; development shows an "Owner to confirm" marker.

## Alternatives considered

Placeholder content to be replaced later.

## Rationale

The previous site shipped placeholder details that customers took as real. Hiding unknowns protects trust and keeps structured data accurate for search engines.
