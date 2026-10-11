# Step 0.2 — Demo

## 1. The monorepo
```
apps/student            Expo + React Native Web (web export builds)
apps/staff              Next.js: /guide /admin /author /ops /parent
services/api            NestJS modular monolith: identity, roster, content, assessment,
                        session, gamification, notification, reporting
services/learning-engine FastAPI (uv, ruff, mypy, pytest)
packages/contracts      empty until step 0.4
packages/ui             placeholder until step 0.8
packages/panel-{guide,admin,author,ops}
```
`pnpm check` runs everything below in one command.

## 2. A cross-module import is blocked
A roster file importing identity's internals:
```
$ echo 'export * from "../identity/identity.module.js";' > services/api/src/modules/roster/__probe__.ts
$ pnpm exec depcruise services/api/src/modules/roster/__probe__.ts --config .dependency-cruiser.cjs

  error api-module-boundary: services/api/src/modules/roster/__probe__.ts → services/api/src/modules/identity/identity.module.ts

x 1 dependency violations (1 errors, 0 warnings). 2 modules, 1 dependencies cruised.
```
The same import through identity's public `index.ts` passes.

## 3. Every rule is proven, not just configured
`pnpm test:boundaries` (`tools/boundaries/boundaries.test.mjs`) writes one violating file per rule, checks dependency-cruiser rejects it under that rule's name, and checks that the allowed path (`modules/<x>/index.ts`) passes. Result: 11/11 pass (see `tests.txt`).

| Rule | Blocks |
|---|---|
| api-module-boundary | API module → another module's internals |
| panel-isolation | panel-X → panel-Y |
| apps-not-into-services / services-not-into-apps | app ↔ service imports |
| apps-isolated / services-isolated | app → other app, service → other service |
| packages-not-into-apps-or-services | shared package → app/service |
| student-app-no-panels, ui-no-panels | staff panels leaking into student app or ui |
| contracts-standalone | contracts importing any other workspace code |
| no-unresolvable | imports of undeclared packages |
| no-circular | dependency cycles |

## 4. CI
`.github/workflows/ci.yml` runs install → lint → typecheck → test → build → boundary lint → boundary tests on every push to `main`/`claude/**` and on PRs. Green run: https://github.com/akhussam/html-portfolio/actions/runs/38129979631 (details in `ci.txt`).
