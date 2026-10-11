# Step 0.6 — Decisions

No new ADR yet. The work follows the hosting and Postgres seams in plan §3. One open question decides whether an ADR is needed (H1).

| # | Choice | Why |
|---|---|---|
| H1 | **Open:** @Hussam will run the pilot "on my PC". The Compose stack runs the same on a PC or on the Oracle VM. | If the PC becomes the pilot host instead of the VM, the hosting seam's pilot implementation changes. That needs an ADR and a seam-register update, written when @Hussam confirms |
| H2 | One Compose file; staging and prod are separate Compose projects (`-p platform-staging` / `-p platform-prod`) with their own env files, databases and ports | Plan 0.6: "Docker Compose with staging and prod projects" |
| H3 | A one-shot `migrate` service runs `node dist/db/migrate.js` (Drizzle migrator, no dev tools) before the API starts | Production images carry no drizzle-kit. CI's migration tests call the same `runMigrations()` |
| H4 | Docker images built from the repo root with `turbo prune --docker`, then `pnpm deploy --prod`; non-root users; health checks on every service | Small images that contain only what each app needs |
| H5 | Staff runs as a Next.js standalone server; student is the Expo web export served by nginx | Plan §3 (React Native Web seam) |
| H6 | Only the web services publish ports, bound to `127.0.0.1` by default. Postgres and the engine stay on the internal network. Public access is through Cloudflare Tunnel (`--profile tunnel`) | No inbound web ports on the host |
| H7 | Terraform (OCI): VCN, public subnet with SSH open only to `admin_cidr`, A1.Flex 2 OCPU / 12 GB Ubuntu 24.04 Arm, in-transit volume encryption, private versioned backup bucket. Default region me-jeddah-1 | Plan 0.6; pilot country Saudi Arabia (pilot brief D1) |
| H8 | Cloudflare Tunnel is created in the dashboard (token-based), not in Terraform | Fewer providers and credentials. The token reconnects after a rebuild |
| H9 | Secrets: plain env files are gitignored; SOPS + age encrypt them for the repo (`.sops.yaml`) | Plan 0.6: "secrets with SOPS" |
