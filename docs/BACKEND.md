# Backend roadmap

<!-- nav -->

<sub><a href="../README.md">Project README</a> · <a href="README.md">Documentation index</a></sub>

The public site is ready for a database-backed system without changing its page architecture.
Today, leads are **delivered** (email/webhook) but **not stored**. No admin area exists, and none
should be added without authentication.

## Integration boundary

- `src/server/leads/types.ts` — `Lead` model and the `LeadRepository` interface (`save(lead)`).
- `src/server/leads/submit.ts` — the single pipeline used by both forms. Persistence slots in
  after validation and before notification: save first, then notify.
- Validation schemas in `src/lib/validation` are shared with the client and reusable by an API.

## Recommended stack

One PostgreSQL database (e.g. Neon, Supabase or RDS) with **Drizzle ORM**. Authentication via
Auth.js or the host's identity provider, restricted to staff accounts.

### Proposed tables

| Table                | Key columns                                                                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `leads`              | id, reference (unique), kind, status (`new` → `contacted` → `quoted` → `scheduled` → `completed` / `cancelled`), customer name, phone, email, payload (jsonb), marketing_consent, created_at |
| `lead_events`        | id, lead_id, type (status_change, note, message_sent), body, actor_id, created_at — communication history                                                                                    |
| `appointments`       | id, lead_id, scheduled_for, time_window, crew, confirmed_at                                                                                                                                  |
| `services`, `prices` | Move `src/data/services.ts` / `pricing.ts` here once staff need to edit them                                                                                                                 |
| `service_areas`      | Move `src/data/areas.ts` here; publish only `confirmed`                                                                                                                                      |
| `users`              | Staff accounts and roles                                                                                                                                                                     |

## Future capabilities

1. **Booking records and status management** — implement `LeadRepository` with Drizzle; an
   authenticated `/admin` (server-side session checks in every route and action, `noindex`,
   excluded from the sitemap and robots).
2. **Scheduling** — only show "confirmed" to customers after an appointment row exists.
3. **Service, pricing and area administration** — swap data modules for DB queries; pages keep
   their props, so components do not change. Revalidate pages on edit (`revalidatePath`).
4. **Blog CMS** — feed the existing `parseArticle`/front-matter schema from a headless CMS.
5. **Customer communication history** — `lead_events`.
6. **Reporting and conversion analytics** — counts by status/source from `leads`; add a
   privacy-friendly analytics tool only after updating the cookie page and consent.

Avoid microservices and multiple databases; a single Next.js app plus PostgreSQL is sufficient.
