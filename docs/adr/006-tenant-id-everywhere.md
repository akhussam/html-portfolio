# ADR-006: Tenant ID on every table

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md §3 ("Not seams"), §4 Postgres, steps 0.5, 0.9, 5.1

## Context
The pilot has one school, but Phase 5 adds multi-school tenancy with enforced row-level security. Adding a tenant column to every table and query after the fact is a rewrite, so the plan makes it **not a seam**.

## Decision
- **Every table** in every module schema has `tenant_id NOT NULL`, including the outbox, audit and consent tables. It is part of the relevant indexes and unique keys.
- **The JWT carries the tenant** (step 0.9). The API takes the tenant from the token, never from request parameters.
- **Every repository query filters by tenant.** Data access goes through module repositories that require a tenant ID.
- **Every event** (ADR-003) and every engine RPC message (ADR-004) carries `tenantId`.
- **The pilot runs as a single tenant** (Omar Academy). Postgres row-level security is turned on in step 5.1. The column and filters are there from day one, so that step only adds policies.

## Consequences
- One extra column and filter everywhere, which costs little in a 20-student pilot.
- Adding a second school needs no schema migration.
- Step 0.5 should include a migration check that fails if any table lacks `tenant_id`.
