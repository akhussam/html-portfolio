# Step 0.4 — Risks / deferred items

| Item | Trigger / when |
|---|---|
| Contract review | Done: approved by @Hussam on 2026-10-11 |
| connect-python is at 0.9 (pre-1.0) | Pinned in uv.lock. The ADR-004 risk is retired for now, since all 3 RPCs are served and called from TypeScript. Re-check on upgrade |
| `buf breaking` is not in CI yet (no baseline on `main`) | Add once the contracts are merged to `main` |
| dependency-cruiser doesn't follow imports into `packages/contracts/dist` (excluded). The contracts source is still checked by `contracts-standalone` | Revisit if packages start importing each other's builds |
| `trace.json` N/A (OTel arrives in 0.7); `deploy.txt` N/A (no staging until 0.6–0.7) | Steps 0.6–0.7 |
| Item schema fields may change once the content reviewer starts (week 6) | Additive changes only, per ADR-007 |
| First CI run failed: the engine could not import generated code from `gen/` when started by uvicorn in CI (pytest worked through its own `pythonpath`). It wasn't reproducible locally. Fixed by generating into `src/engine/`, which is on the path the same way as `learning_engine` | Done (this step) |
