# Step 0.6 — Risks / deferred items

| Item | Trigger / when |
|---|---|
| **"Done when" not yet met.** `terraform apply` + `docker compose up` from scratch needs @Hussam's Oracle account (or his PC, see H1). Built and checked in CI so far: images, stack smoke test, `terraform validate` | @Hussam runs `docs/runbook/hosting.md` and records the output in `deploy.txt` |
| Pilot host undecided: PC or Oracle VM (decisions H1) | Before step 0.7 (deploys need a target) |
| Arm always-free capacity is often unavailable in a region | Retry, or another availability domain or region (runbook B2) |
| No `.terraform.lock.hcl` committed (the provider registry is blocked in the build session) | Commit it after the first `terraform init` on @Hussam's PC |
| `cloudflare/cloudflared` image tag defaults to `latest` | Pin `CLOUDFLARED_VERSION` at the first real deploy |
| Images are built for the host's architecture only. Multi-arch (amd64 + arm64) builds and the GHCR push come in step 0.7 | Step 0.7 |
| Backup job and timed restore drill not built yet; only the bucket exists | Step 2.11 (hardening) |
| Images could not be built in the build session (Docker Hub rate limit), so they are built in CI | — |
| `trace.json` N/A (OTel arrives in 0.7) | Step 0.7 |
