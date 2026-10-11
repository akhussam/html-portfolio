# Runbook: hosting (step 0.6)

How to bring the platform up **from nothing**, on your PC (pilot phase) or on the Oracle always-free VM. The Compose stack is the same in both places. Only the machine underneath changes.

What runs (`infra/compose/compose.yaml`):

| Service | What | Reachable at |
|---|---|---|
| postgres | Postgres 17, data in the `pgdata` volume | internal only |
| migrate | applies `services/api/migrations`, then exits | (one-shot) |
| engine | learning engine (FastAPI, Connect-RPC) | internal only (`engine:8000`) |
| api | NestJS API | `127.0.0.1:API_PORT` |
| staff | staff app (`/guide`, `/admin`, `/ops`, `/parent`) | `127.0.0.1:STAFF_PORT` |
| student | student web app | `127.0.0.1:STUDENT_PORT` |
| cloudflared | Cloudflare Tunnel (only with `--profile tunnel`) | public hostnames you set in Cloudflare |

Staging and prod are two Compose projects (`-p platform-staging`, `-p platform-prod`). They have separate databases and separate ports.

---

## A. On your PC

**You need:**
- Docker Desktop (Windows/macOS) or Docker Engine with the Compose plugin (Linux);
- git;
- optionally SOPS + age, if you want encrypted env files (section C).

1. **Get the code:** `git clone https://github.com/akhussam/html-portfolio && cd html-portfolio`
2. **Quick check that everything builds and runs:** `infra/compose/smoke-test.sh`. It builds all images, starts the stack on an empty database, checks every service, then removes it all. It ends with `SMOKE TEST PASSED`. On Windows, run it from Git Bash or WSL.
3. **Create the staging env file:** `cp infra/compose/env/staging.env.example infra/compose/env/staging.env`. Set a strong `POSTGRES_PASSWORD`; the file is gitignored.
4. **Start staging:**
   ```sh
   docker compose -f infra/compose/compose.yaml -p platform-staging \
     --env-file infra/compose/env/staging.env up -d --build --wait
   ```
5. **Open the apps:**
   - staff app: http://127.0.0.1:3100/guide
   - student app: http://127.0.0.1:8180
   - API health check: http://127.0.0.1:3101/health
6. **Prod works the same way** with `prod.env` and `-p platform-prod` (ports 3000 / 8080 / 3001).

**Recreate from scratch** (this deletes that environment's data):
```sh
docker compose -f infra/compose/compose.yaml -p platform-staging --env-file infra/compose/env/staging.env down -v
docker compose -f infra/compose/compose.yaml -p platform-staging --env-file infra/compose/env/staging.env up -d --build --wait
```

**Let devices on the school network reach your PC:** set `BIND_ADDRESS=0.0.0.0` in the env file and allow the ports in your PC's firewall. Better still, use the tunnel (section B, step 5), which needs no open ports.

---

## B. On the Oracle always-free VM

**You need:**
- an Oracle Cloud account (upgraded to pay-as-you-go but staying inside the free limits, so the VM isn't reclaimed when idle);
- `oci setup config` done on your PC;
- Terraform ≥ 1.6;
- a Cloudflare account with your domain.

1. **Set your variables:** `cd infra/terraform/oci && cp terraform.tfvars.example terraform.tfvars`. Fill in the compartment OCID, your SSH public key, and `admin_cidr` (your IP/32).
2. **Create the server:**
   ```sh
   terraform init
   terraform apply
   ```
   It creates the network, the VM (2 OCPU / 12 GB Arm, encrypted volume, SSH open only to `admin_cidr`) and a private, versioned backup bucket. Commit the generated `.terraform.lock.hcl`.
   - If you get "Out of host capacity": try another availability domain or region (`region = "me-riyadh-1"`), or retry later. Arm free capacity is often short.
3. **Check the server:** `ssh ubuntu@$(terraform output -raw server_public_ip)` and wait for cloud-init to finish (`cloud-init status --wait`). Then check `docker --version`, `sops --version` and `age --version`.
4. **Start the platform:** on the server, clone the repo and run steps A3–A4. The images build for Arm on the server. From step 0.7, CI builds multi-arch images and the server only pulls them.
5. **Cloudflare Tunnel:**
   - In the Cloudflare dashboard, go to Zero Trust → Networks → Tunnels and create a tunnel. Copy its token into `CLOUDFLARE_TUNNEL_TOKEN` in the env file.
   - Add public hostnames: e.g. `staff.<domain>` → `http://staff:3000`, `app.<domain>` → `http://student:80`, `api.<domain>` → `http://api:3001`.
   - Start it with `--profile tunnel` added to the `up` command.
   - No inbound web ports are open on the VM; all traffic comes through the tunnel.

**Recreate from scratch (the step 0.6 "Done when"):**
- `terraform destroy && terraform apply`;
- repeat steps 3–5;
- restore the database from the backup bucket. Backup and restore are added and drilled in step 2.11.

---

## C. Secrets with SOPS + age

1. **Make a key, once:** `age-keygen -o ~/.config/sops/age/keys.txt`. Back this file up somewhere safe; without it the encrypted files can't be read.
2. **Register the public key:** put the `age1...` public key it prints into `.sops.yaml` (replacing the placeholder) and commit that.
3. **Encrypt for the repo:** `sops --encrypt infra/compose/env/staging.env > infra/compose/env/staging.enc.env`, then commit the `.enc.env` file. The plain `.env` stays gitignored.
4. **Decrypt on a host:** copy the key file to the host (`~/.config/sops/age/keys.txt`), then run `sops --decrypt infra/compose/env/staging.enc.env > infra/compose/env/staging.env`.
