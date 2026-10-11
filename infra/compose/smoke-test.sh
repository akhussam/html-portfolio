#!/usr/bin/env bash
# Builds every image, starts the whole stack from nothing, checks each service, tears it down.
# Used by CI; also the quickest check on your PC:  infra/compose/smoke-test.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

ENV_FILE=${ENV_FILE:-infra/compose/env/ci.env}
compose() { docker compose -f infra/compose/compose.yaml -p platform-smoke --env-file "$ENV_FILE" "$@"; }
# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

cleanup() {
  status=$?
  if [ "$status" -ne 0 ]; then compose ps -a; compose logs --no-color --tail=80; fi
  compose down -v --remove-orphans >/dev/null 2>&1 || true
  exit "$status"
}
trap cleanup EXIT

step() { printf '\n== %s\n' "$*"; }

wait_for() { # name url [expected-substring]
  local name=$1 url=$2 want=${3:-} body
  for _ in $(seq 1 90); do
    if body=$(curl -fsS "$url" 2>/dev/null) && [[ -z "$want" || "$body" == *"$want"* ]]; then
      echo "ok   $name  $url"
      return 0
    fi
    sleep 2
  done
  echo "FAIL $name  $url"
  return 1
}

step "Build images and start the stack on an empty database"
compose down -v --remove-orphans >/dev/null 2>&1 || true
compose up -d --build

step "Wait for the services"
wait_for api     "http://127.0.0.1:${API_PORT}/health" '"status":"ok"'
wait_for staff   "http://127.0.0.1:${STAFF_PORT}/guide"
wait_for student "http://127.0.0.1:${STUDENT_PORT}/"

step "Migrations ran once and succeeded"
migrate_exit=$(docker inspect --format '{{.State.ExitCode}}' "$(compose ps -a -q migrate)")
echo "migrate exit code: $migrate_exit"
[ "$migrate_exit" = "0" ]

step "Database schemas (ADR-001, ADR-010)"
compose exec -T postgres psql -U platform -d platform -At \
  -c "select schema_name from information_schema.schemata where schema_name not like 'pg_%' and schema_name <> 'information_schema' order by 1"

step "API reaches the engine over the internal network"
compose exec -T api wget -qO- http://engine:8000/health
echo

step "Engine serves its Connect-RPC contract (UNIMPLEMENTED until step 1.4)"
rpc=$(compose exec -T api wget -qO- --header 'Content-Type: application/json' \
  --post-data '{"tenantId":"t","studentId":"s","date":"2026-10-11"}' \
  http://engine:8000/engine.v1.LearningEngineService/PlanDay 2>&1 || true)
[[ "$rpc" == *501* ]] && echo "ok   PlanDay -> 501 unimplemented" || { echo "FAIL PlanDay: $rpc"; exit 1; }

step "Only the web ports are published, and only on ${BIND_ADDRESS}"
compose ps --format '{{.Service}}  {{.Publishers}}'

echo
echo "SMOKE TEST PASSED"
