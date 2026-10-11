# Step 0.2 — Risks / deferred items

| Item | Trigger / when |
|---|---|
| `trace.json` — N/A: no OTel yet | Step 0.7 wires OTel; first trace in that bundle |
| `deploy.txt` — N/A: no staging server yet | Steps 0.6–0.7 (hosting + deploy pipeline) |
| Apps' page code has no unit coverage (0/0); it is proven by `next build` and `expo export` | Phase 1 adds component + e2e tests per DoD for UI steps |
| `packages/ui` Placeholder renders a DOM `<h1>`, which won't work in React Native | Step 0.8 replaces it with RN-Web components usable by both apps |
| Repo is shared with the old HTML portfolio files at the root | Decide whether to move to a dedicated repo before Gate 0 |
| Python version: `.python-version` = 3.12; container default is 3.13 | Pin the same version in the engine Docker image in step 0.6 |
