# Step 0.5 — Decisions

**ADR-010 (Data access and migrations)** records the decisions of this step:
- Drizzle + drizzle-kit, not Prisma.
- Tables are defined in the module that owns them, one Postgres schema each.
- No foreign keys across schemas.
- Plain SQL migrations, checked for drift in CI.
- Postgres 17 everywhere.
- The audit log and the consent ledger are append-only, enforced by triggers.
- Migration tests run on real Postgres in CI, with a PGlite fallback locally.

Other choices made while building, within the plan:

| # | Choice | Why |
|---|---|---|
| D1 | Each of the 8 modules gets its own Postgres schema now, even with no tables yet | ADR-001: data ownership is real from day one |
| D2 | `outbox` and `audit` are their own schemas, outside any module | Both are shared platform services (ADR-003; `audit.log(actor, action, target)` in the seam register) |
| D3 | The consent ledger lives in `identity` | Plan §4: identity owns the consent ledger |
| D4 | Consent table columns: student, guardian, granted/withdrawn, policy version, recorded by, recorded at | The minimum a ledger needs. The form and flows are designed in step 2.8 |
| D5 | Outbox rows have both an event `id` (for dropping duplicates) and a `seq` (for publish and replay order) | ADR-003; the ops panel replays "from event ID" (contract `replayOutbox`) |
| D6 | No `tenants` or `persons` tables yet | Steps 0.9 (identity) and 2.7 (school setup) create them |

`compose.dev.yaml` gives Postgres 17 for local development.
