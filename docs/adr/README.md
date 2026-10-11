# Architecture Decision Records

One file per decision, numbered sequentially from 001 (`CLAUDE.md`, repo conventions).
Each ADR has the sections **Status**, **Context**, **Decision**, **Consequences**.
`pnpm test:adr` checks the numbering, the sections and this index.

| # | Title | Status |
|---|---|---|
| [001](001-modular-monolith.md) | Modular monolith | Accepted |
| [002](002-pseudonymous-ids.md) | Pseudonymous student IDs | Accepted |
| [003](003-outbox-events.md) | Transactional outbox for events | Accepted |
| [004](004-connect-rpc.md) | Connect-RPC for the learning engine | Accepted |
| [005](005-seam-policy.md) | Seam policy | Accepted |
| [006](006-tenant-id-everywhere.md) | Tenant ID on every table | Accepted |
| [007](007-item-json-schema.md) | Item JSON schema | Accepted |
| [008](008-no-school-hours-deploys.md) | No school-hours deploys | Accepted |
| [009](009-build-tooling.md) | Build tooling and boundary enforcement | Accepted |

## Template
```markdown
# ADR-NNN: Title

- **Status:** Proposed | Accepted | Superseded by ADR-XXX
- **Date:** YYYY-MM-DD
- **Plan refs:** BUILD_PLAN.md §…

## Context
## Decision
## Consequences
```
