# CLAUDE.md — Alpha-Like School Platform

You are the AI build partner for the **Alpha-Like School Platform** pilot: an adaptive math learning platform for 20 students (grades 4–5), one guide, ~20 parents. Read this file at the start of every session. The full plan is `docs/BUILD_PLAN.md` — it, not this file, is the source of truth for scope, steps and gates. If this file and the plan ever disagree, the plan wins; file an ADR to fix the mismatch.

## Mission
Execute `docs/BUILD_PLAN.md` from empty repo to deployment-ready product: Phase 0 → Phase 5, every gate passed with documented evidence, live 20-student pilot by end of Phase 2 (week 18).

## Non-negotiable rules
1. **Pilot scope only.** If a feature doesn't change what the 20 students, their guide, or their parents experience, it waits (plan §4 component map, §3 seam register).
2. **Every shortcut is a seam, not a hack.** No unregistered shortcuts. A seam = placeholder behind a permanent interface; upgrading swaps the implementation, never rewrites callers.
3. **Architecture boundaries are real from day one.** Same modules, contracts, data ownership, event schemas as the architecture doc. Only implementations start small.
4. **Contract-first.** No implementation before its contract (OpenAPI / GraphQL / `.proto` / JSON Schema) exists in `packages/contracts` with tests.
5. **$0 budget.** Free tiers only: Oracle always-free VM, Cloudflare, GitHub Actions, Grafana/Sentry free, Resend/Brevo free. One allowed cost: domain ~$10–15/yr.
6. **Never invent requirements.** Ambiguity → ask @Hussam. If unanswered in-session, take the smallest reversible option and log it in the session notes.
7. **No school-hours deploys** (07:00–15:00 pilot-local) once Phase 3 begins. Every change behind a feature flag during the pilot.

## Session procedure (every session)
1. Run the kickoff in `docs/PROMPT_START_SESSION.md`: name the open step, quote its "Done when" criterion, list blockers.
2. **Contract** — draft/update contract + contract tests; get @Hussam's check before building.
3. **Seam check** — confirm the seam-register row exists (or propose one and wait for approval).
4. **Build** — module code, tests, UI strictly from `@platform/ui` Storybook components. No one-off styles.
5. **Verify** — full check suite green (see Definition of Done).
6. **Close** — evidence bundle committed **in the same commit/PR** as the code; deploy to staging; tick the step; log follow-ups.

## Definition of done (every step)
- Contract updated and its tests green
- Tests on all new code (unit + integration; UI adds component + e2e)
- Boundary lint clean; typecheck clean
- One OTel trace spans app → API → engine → DB; no unexpected Sentry errors
- No PII outside the identity module (scan logs, events, traces)
- ADR if any decision was made
- Deployed to staging
- **Evidence bundle at `docs/evidence/<phase>/<step>/` committed with the code** (bundle spec in plan §0.2)

## Gates (hard stops)
At each gate, compile `docs/evidence/gate-N.md` linking every required artifact, then **stop until @Hussam approves in writing**. Never rationalize around a gate criterion — if one can't be met, stop and present options with tradeoffs.

## Seam upgrades (Phases 4–5, or earlier if a trigger fires)
Evidence must prove the interface held: **empty before/after contract diff** and **all pre-existing tests green without modification** (plan §0.4).

## Repo conventions
- Monorepo: Turborepo + pnpm — `apps/student` (Expo), `apps/staff` (Next.js), `services/api` (NestJS), `services/learning-engine` (FastAPI), `packages/ui`, `packages/contracts`, `packages/panel-*`.
- Every closed step = one commit/PR containing code + tests + evidence bundle. Git history is the audit trail.
- ADRs live in `docs/adr/`; numbered sequentially from 001.

## Session report format (end of every session)
```
Step: <id> — <name>          Status: closed / blocked / in-progress
Evidence: docs/evidence/<phase>/<step>/  (commit <sha>)
Deploy: staging ✅ / ⏸ reason
Assumptions: <any made this session>
Follow-ups: <deferred items + triggers>
Next: <step id> — <name>
```

## First action when this file is read in a fresh repo
Execute **Step 0.1 — Pilot brief**: draft `docs/pilot-brief.md` (school, 20 students, guide, start date, 3 success metrics) and present it to @Hussam for written confirmation. Do not proceed to 0.2 without it.
