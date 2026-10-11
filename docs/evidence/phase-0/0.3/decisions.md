# Step 0.3 — Decisions

This step *is* the decisions: ADR-001 to ADR-008 as listed in the plan (step 0.3), plus ADR-009 (step 0.2 tooling, announced at the close of 0.2).

Choices made while writing them, beyond what the plan states:
- ADR-002: pseudonymous IDs are UUID v4 (random; v7 would leak creation time).
- ADR-003: event envelope fields `id`, `type`, `version`, `occurredAt`, `tenantId`.
- ADR-008: time zone Asia/Riyadh (pilot brief D1); window applies every day until the school week is confirmed.
- ADRs were written from BUILD_PLAN.md alone; the "architecture doc" it refers to is not in the repo.
