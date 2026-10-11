# Step 0.6 — Demo (what is proven so far)

CI run for commit c693cc0: https://github.com/akhussam/html-portfolio/actions/runs/38144591294 (all 3 jobs: success)

## Docker images + Compose smoke test (`infra/compose/smoke-test.sh`)
The script does four things:
1. Builds all four images (api, engine, staff, student).
2. Starts the stack from nothing: an empty Postgres 17, then migrate, engine, api, staff and student.
3. Checks every service.
4. Tears the stack down.

End of the CI log:
```
== Database schemas (ADR-001, ADR-010)
assessment
audit
content
drizzle
gamification
identity
notification
outbox
public
reporting
roster
session

== API reaches the engine over the internal network
{"status":"ok"}

== Engine serves its Connect-RPC contract (UNIMPLEMENTED until step 1.4)
ok   PlanDay -> 501 unimplemented

== Only the web ports are published, and only on 127.0.0.1
api  [{127.0.0.1 3001 3001 tcp}]
engine  [{ 8000 0 tcp}]
postgres  [{ 5432 0 tcp}]
staff  [{127.0.0.1 3000 3000 tcp}]
student  [{127.0.0.1 80 8080 tcp}]

SMOKE TEST PASSED
```
- Earlier in the same log, the API `/health`, staff `/guide` and the student app all answered.
- The one-shot `migrate` container exited with code 0.
- The engine and Postgres have no published ports; they are reachable only on the internal network.

## Terraform (`infra/terraform/oci`)
`terraform fmt -check`, `terraform init -backend=false` and `terraform validate`: success, with the real `oracle/oci` provider.

## Not yet proven (needs @Hussam)
`terraform apply` on a real Oracle account, plus `docker compose up` on that VM or on @Hussam's PC (runbook: `docs/runbook/hosting.md`). The output goes into `deploy.txt`.
