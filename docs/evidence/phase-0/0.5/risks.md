# Step 0.5 — Risks / deferred items

| Item | Trigger / when |
|---|---|
| Privacy delete and data retention (step 2.8) can't delete from the append-only tables | Step 2.8 designs an approved path for those tables and records it in an ADR |
| No row-level security yet; tenant filtering is by convention in repositories | Step 5.1 (ADR-006) |
| The learning engine's own mastery tables are not created yet | Step 1.4, in an `engine` schema with the same tenant_id rule |
| Local Postgres was not available in this cloud session: Docker Hub returned 429 and the ECR mirror is blocked by the network policy. Locally the tests ran on PGlite; the real-server run is CI | Run `compose.dev.yaml` on a normal machine |
| `trace.json` N/A (OTel arrives in 0.7); `deploy.txt` N/A (no staging until 0.6–0.7) | Steps 0.6–0.7 |
