# Alpha-Like School Platform

Adaptive math learning platform pilot (20 students, grades 4–5). Start with [`CLAUDE.md`](CLAUDE.md) and [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md).

## Develop
Requires Node 22+, pnpm 10, and [uv](https://docs.astral.sh/uv/) for the Python engine.

```sh
pnpm install
pnpm check          # lint, typecheck, test, build, boundary lint, boundary tests
```

| Path | What |
|---|---|
| `apps/student` | Expo + React Native Web student app |
| `apps/staff` | Next.js staff app (`/guide`, `/admin`, `/author`, `/ops`, `/parent`) |
| `services/api` | NestJS modular monolith |
| `services/learning-engine` | Python FastAPI learning engine |
| `packages/contracts` | API, RPC and event contracts |
| `packages/ui` | `@platform/ui` design system |
| `packages/panel-*` | Staff control panels |

The old HTML portfolio files (`index.html`, `solution.html`, `assets/`, `public/`) are kept as-is.
