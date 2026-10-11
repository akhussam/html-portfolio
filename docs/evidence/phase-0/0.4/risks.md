# Step 0.4 — Risks / deferred items

| Item | Trigger / when |
|---|---|
| Contracts are a **draft until @Hussam reviews them** (CLAUDE.md: "get @Hussam's check before building") | Before step 0.5 builds on them |
| connect-python is at 0.9 (pre-1.0) | Pinned in uv.lock. The ADR-004 risk is retired for now, since all 3 RPCs are served and called from TypeScript. Re-check on upgrade |
| `buf breaking` is not in CI yet (no baseline on `main`) | Add once the contracts are merged to `main` |
| dependency-cruiser doesn't follow imports into `packages/contracts/dist` (excluded). The contracts source is still checked by `contracts-standalone` | Revisit if packages start importing each other's builds |
| `trace.json` N/A (OTel arrives in 0.7); `deploy.txt` N/A (no staging until 0.6–0.7) | Steps 0.6–0.7 |
| Item schema fields may change once the content reviewer starts (week 6) | Additive changes only, per ADR-007 |
