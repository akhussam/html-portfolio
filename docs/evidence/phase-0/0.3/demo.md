# Step 0.3 — Demo

ADRs in `docs/adr/` (index: `docs/adr/README.md`):

| # | Decision in one line |
|---|---|
| 001 | One NestJS API with 8 modules; each owns its Postgres schema; modules talk only via `index.ts` or events; engine is a separate Python service |
| 002 | Random UUID v4 per person; only identity maps it to PII; everything else (events, logs, traces, JWT) uses the ID |
| 003 | Events written to an outbox table in the same transaction, relayed via `EventPublisher.publish`; JSON-Schema-validated; at-least-once with idempotent consumers; client-side outbox with idempotent IDs |
| 004 | `engine.proto` with UpdateMastery / RecommendNext / PlanDay over Connect-RPC; generated clients; additive changes only |
| 005 | Every shortcut is a registered seam behind a permanent interface; new seams need approval first; upgrades prove an empty contract diff + unmodified tests |
| 006 | `tenant_id NOT NULL` on every table; tenant from JWT only; on every event and RPC; RLS switched on in step 5.1 |
| 007 | One versioned item JSON Schema in `packages/contracts`, owned by content; Sanity format never leaves content; additive changes |
| 008 | From Phase 3: no prod deploys 07:00–15:00 Asia/Riyadh, enforced by the deploy job; every pilot change behind a flag |
| 009 | Build tooling from step 0.2 (Turborepo, dependency-cruiser, TS 6, React 19.2.3, uv) |

`pnpm test:adr` (in CI and `pnpm check`) checks numbering, title, status, date, the three sections, and that the index matches.
