# ADR-009: Build tooling and boundary enforcement

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md step 0.2; evidence `docs/evidence/phase-0/0.2/decisions.md`

## Context
Step 0.2 made tooling choices that the plan does not specify. They were presented to @Hussam at the close of step 0.2 with "ADR-009 after 0.3 unless you object", and the next step was approved ("go").

## Decision
- **Monorepo:** Turborepo + pnpm workspaces (`apps/*`, `services/*`, `packages/*`), as the plan specifies.
- **Boundary lint:** dependency-cruiser with one root config (`.dependency-cruiser.cjs`). Every rule is proven by `pnpm test:boundaries`, which writes a violating import and expects it to be rejected. API modules import each other only through `modules/<x>/index.ts` (ADR-001).
- **Internal packages ship TypeScript source.** Next.js (`transpilePackages`) and Metro compile them; there is no separate build step.
- **Pinned versions:**
  - TypeScript 6.0.x, because typescript-eslint supports `<6.1`;
  - React 19.2.3 everywhere, the version Expo SDK 57 requires;
  - Node 22.
- **Python engine:** managed by uv, checked with ruff, mypy (strict) and pytest. Its `package.json` wraps uv so `turbo run` covers both languages. Turborepo passes `UV_*` variables through.
- **Single instruction file:** Turborepo's generated `AGENTS.md` is turned off (`agentGuidance: false`) so `CLAUDE.md` stays the only standing-instruction file (plan §0.1).

## Consequences
- `pnpm check` and CI run the same checks.
- Moving to TypeScript 7 waits until typescript-eslint supports it.
- Upgrading Expo SDK means moving React everywhere at the same time.
