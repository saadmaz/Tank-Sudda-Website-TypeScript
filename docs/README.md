# Documentation

Every STTPS repository uses the same documentation layout. Start with the core documents, then the decision records and runbooks.

## Core

| Document                             | Covers                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)   | How the system is built, its components and how data flows                  |
| [CONFIGURATION.md](CONFIGURATION.md) | Environment variables, configuration files and where each value lives       |
| [DEPLOYMENT.md](DEPLOYMENT.md)       | Hosting, the delivery pipeline, first-time setup and post-deployment checks |
| [CONTENT.md](CONTENT.md)             | How to update copy, business data, imagery and articles                     |

## Decisions and operations

| Document                        | Covers                          |
| ------------------------------- | ------------------------------- |
| [adr/](adr/README.md)           | Architecture decision records   |
| [runbooks/](runbooks/README.md) | Release and rollback procedures |

## Product and reference

| Document                                 | Covers                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| [BACKEND.md](BACKEND.md)                 | Planned database, admin and reporting                                                 |
| [GROWTH-PLAN.md](GROWTH-PLAN.md)         | Launch, local SEO, trust and marketing plan                                           |
| [OWNER-CHECKLIST.md](OWNER-CHECKLIST.md) | Business information still needed                                                     |
| [SEO-PLAN.md](SEO-PLAN.md)               | Keyword research and phased SEO plan                                                  |
| [marketing/](marketing/)                 | Marketing kit: company profile, listings, reviews, social media and WhatsApp Business |

## Conventions

- Top-level documents use `UPPER-KEBAB-CASE.md`; documents inside folders use `lower-kebab-case.md`.
- Update the relevant document in the same pull request as the change it describes.
- Record significant technical decisions as ADRs rather than editing older documents.
