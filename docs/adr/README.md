# Architecture decision records

An architecture decision record (ADR) captures one significant technical decision: what was decided, what else was considered, and why. ADRs are never edited after acceptance; a later ADR supersedes an earlier one instead.

## Writing a new ADR

1. Copy [TEMPLATE.md](TEMPLATE.md) to `NNNN-short-title.md`, using the next free number.
2. Fill it in and set the status to `Proposed`.
3. Open it in a pull request with the change it describes. It becomes `Accepted` when merged.
4. If it replaces an earlier decision, set the earlier ADR's status to `Superseded by ADR-NNNN`.

## Index

| ADR                                                            | Decision                                       | Status   |
| -------------------------------------------------------------- | ---------------------------------------------- | -------- |
| [0001](0001-verified-facts-only.md)                            | Verified facts only                            | Accepted |
| [0002](0002-next-js-on-cloudflare-workers-through-opennext.md) | Next.js on Cloudflare Workers through OpenNext | Accepted |
