# ADR-001: Modular monolith

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md §1 rule 3, §4, §12

## Context
One developer builds the pilot for 20 students, so a fleet of microservices would cost more to run than it gives back. But the plan requires the architecture's boundaries (modules, contracts, data ownership, event schemas) to be real from day one, so that growing later swaps implementations without rewrites.

## Decision
- **One NestJS API (`services/api`)** holds all backend modules as separate Nest modules under `src/modules/<name>/`: identity, roster, content, assessment, session, gamification, notification, reporting.
- **Each module owns its data.** It gets its own Postgres schema (step 0.5). No module reads or writes another module's schema.
- **Modules talk to each other only through:**
  1. the other module's public API, exported from `modules/<name>/index.ts`; or
  2. events through `EventPublisher` (ADR-003).

  Deep imports into another module's internals are forbidden.
- **The learning engine is a separate Python service** (`services/learning-engine`) because of its language and runtime. It is reached only over its RPC contract (ADR-004).
- **Apps** (`apps/student`, `apps/staff`) reach the backend only over contracts: REST, GraphQL and subscriptions.
- **Enforcement:** dependency-cruiser rules (ADR-009) fail CI on any boundary violation.

## Consequences
- One deployable API, one database and one deploy pipeline, which fits the free-tier VM (plan §3, hosting seam).
- A module can later be extracted into its own service without changing its callers, because they already depend only on its public API or its events.
- Cross-module queries (e.g. a report joining roster and session data) must go through module APIs or the `analytics` schema built by dbt (plan §3), never through direct SQL joins across schemas.
