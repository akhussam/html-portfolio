# Step 0.4 — Demo

## Contracts (all in `packages/contracts`)
| Contract | File | Generated typed client / stubs | Used by |
|---|---|---|---|
| Lesson-player REST (OpenAPI 3.1) | `openapi/lesson-player.yaml` | `src/gen/lesson-player.ts` → `openapi-fetch` client in `apps/student/src/api/client.ts` | student app |
| Panels GraphQL | `graphql/schema.graphql` | `apps/staff/gql/` (graphql-codegen client preset) for the operations in `apps/staff/lib/operations.ts` | staff app |
| Learning engine (Connect-RPC) | `proto/engine/v1/engine.proto` | TS: `src/gen/engine/v1/engine_pb.ts` → client in `services/api/src/engine/engine.client.ts`. Python: `services/learning-engine/src/engine/v1/` (server + client) | API → engine |
| Events (JSON Schema 2020-12) | `events/{response.scored,session.started,session.ended,skill.mastered}.schema.json` + `envelope.schema.json` | `src/gen/schemas.types.ts` (types), `src/gen/schemas.ts` (schemas for runtime validation) | API (EventPublisher, step 0.5+) |
| Item (JSON Schema, ADR-007) | `schemas/item.schema.json` | same as events | content module (1.1) |

`pnpm generate` rebuilds all generated code. CI fails if the result differs from what is committed.

## The engine speaks gRPC and plain HTTP/JSON from one `.proto`
```
$ curl -s localhost:8765/health
{"status":"ok"}

$ curl -s -X POST localhost:8765/engine.v1.LearningEngineService/PlanDay -H "Content-Type: application/json" \
    -d '{"tenantId":"6f1c2c1e-5b1a-4f3e-9a51-0c8d7c1b2a01","studentId":"0b6f3a52-8d0e-4f6b-a1d2-3c4b5a6f7e80","date":"2026-10-11"}'
{"code": "unimplemented", "message": "Not implemented"}
HTTP 501        ← reached the PlanDay handler (BKT comes in step 1.4)

$ curl -s -X POST localhost:8765/engine.v1.LearningEngineService/NoSuchRpc -H "Content-Type: application/json" -d "{}"
HTTP 404        ← an RPC that isn't in the contract doesn't exist
```

## Cross-language proof
- `services/api/src/engine/engine.interop.test.ts` starts the real Python engine and calls all three RPCs with the TypeScript client generated from the same `.proto`. Each call reaches its Python handler.
- `services/learning-engine/tests/test_engine_rpc.py` adds a full round trip against a fake engine that returns real messages.

## Contract tests (39, in `packages/contracts/test/`)
- **OpenAPI:**
  - valid 3.1, with a bearer JWT on every operation and unique operationIds;
  - every endpoint the plan names exists;
  - `PresentedItem` carries no answers or hints;
  - submissions are keyed by `clientResponseId`.
- **Events:**
  - one schema per exported event type, with the envelope fields required (including `tenantId`);
  - valid examples pass;
  - a missing `tenantId`, an extra payload field (e.g. a name) or a non-UUID student ID is rejected.
- **Item:** all three types are accepted; exactly 2 hints are required; an unknown type or a zero denominator is rejected.
- **Proto:** the 3 RPCs exist, and every request starts with `tenant_id` and `student_id`.
- **GraphQL:**
  - `roomUpdates(roomId)`, `weeklyReport(studentId)` and the six panel mutations exist;
  - the staff operations validate against the schema;
  - a field that isn't in the schema is rejected.
- **Typed clients:** a wrong REST path, a wrong body type or a missing GraphQL variable is a compile error. These are written as `@ts-expect-error` lines in the tests and enforced by `pnpm typecheck`.
