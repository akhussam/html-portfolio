# Step 0.2 — Decisions

No ADR filed yet: ADR numbers 001–008 are reserved for step 0.3. The tooling choices below will be written up as **ADR-009 (build tooling)** right after 0.3, unless @Hussam objects.

| # | Decision | Why |
|---|---|---|
| T1 | Boundary lint uses **dependency-cruiser**, one root config | Works across TS apps, services and packages with path rules; each rule is tested |
| T2 | API modules may import each other **only through `modules/<x>/index.ts`** | Modular monolith (ADR-001): modules talk via public API, never internals |
| T3 | Internal packages ship **TypeScript source** (no build step) | Fewer moving parts; Next `transpilePackages` and Metro compile them |
| T4 | **TypeScript 6.0.3**, not 7 | typescript-eslint 8.71 supports `<6.1` |
| T5 | **React 19.2.3** everywhere | Version pinned by Expo SDK 57 |
| T6 | Python engine managed by **uv** (ruff, mypy strict, pytest); its `package.json` wraps uv so Turborepo runs it | One `turbo run` covers both languages |
| T7 | Turborepo's auto-written `AGENTS.md` disabled (`agentGuidance: false`) | `CLAUDE.md` stays the single standing-instruction file (plan §0.1) |
| T8 | Monorepo lives in `akhussam/html-portfolio` next to the old portfolio files, which are untouched | That's the repo this session has; moving to a dedicated repo is a follow-up |
