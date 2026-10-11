# ADR-010: Data access and migrations

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md step 0.5, §3 (RDS Postgres seam; "Not seams": consent ledger, tenant ID); ADR-001, ADR-003, ADR-006

## Context
Step 0.5 needs Postgres schemas per module, migrations, an outbox table, an audit table and a consent ledger. The plan leaves the tool open ("Prisma or Drizzle"). The database must also move to RDS later by `pg_dump` / restore (seam register), so plain SQL migrations are an advantage.

## Decision
- **Drizzle ORM + drizzle-kit, not Prisma.** Reasons:
  - Drizzle defines tables in TypeScript next to the module that owns them.
  - It supports one Postgres schema per module (`pgSchema`).
  - Its migrations are plain SQL files that we commit and review.
  - It has no separate query engine binary, which matters on the small Arm VM.
- **Where tables live:** each module defines its tables in `services/api/src/modules/<name>/<name>.tables.ts`, in its own Postgres schema. Platform tables (`outbox`, `audit`) live in `src/platform/*/`.
- **No foreign keys across schemas.** A module refers to another module's data only by ID (ADR-001).
- **Migrations:**
  - They live in `services/api/migrations/`.
  - drizzle-kit generates them from the table definitions; hand-written SQL is allowed only for things it can't express (triggers).
  - `pnpm db:migrate` applies them.
  - `pnpm generate` re-runs the generator, and CI fails if the committed migrations don't match the table definitions.
- **Postgres 17** everywhere: CI, local development (`compose.dev.yaml`) and the VM (step 0.6). This is the same major version as the RDS target.
- **Append-only tables:** the audit log and the consent ledger reject UPDATE, DELETE and TRUNCATE with a trigger. A correction or a change of consent is a new row.
- **Tests:**
  - The migration tests run on a brand-new database.
  - In CI that is real Postgres 17. Locally without `DATABASE_URL` they fall back to PGlite (Postgres compiled to WebAssembly).
  - CI refuses to run without `DATABASE_URL`, so the fallback can never stand in for the real server there.
  - A test checks that every table has a non-null `tenant_id`, so ADR-006 is enforced for every future table too.

## Consequences
- Moving to RDS (step 4.0) is a `pg_dump` / restore. Nothing in the migrations is specific to this host.
- Step 2.8 (privacy delete, data retention) can't delete rows from the append-only tables. It will need its own approved path for those tables, recorded in a new ADR at that time.
- Cross-module reports read from the `analytics` schema built by dbt (plan §3), never by joining module schemas.
