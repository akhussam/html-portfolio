# ADR-004: Connect-RPC for the learning engine

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md §3 (learning engine seam), steps 0.4, 1.4, 2.3

## Context
The learning engine is a Python service (ADR-001) that the NestJS API calls on the hot path (choosing the next item). It needs a typed contract shared by TypeScript and Python. The contract must not change when the model behind it moves from hand-set BKT to fitted BKT, then DKT.

## Decision
- The engine's interface is **`engine.proto`** in `packages/contracts`, with three RPCs:
  - `UpdateMastery`
  - `RecommendNext`
  - `PlanDay`
- It is served over **Connect-RPC**: one `.proto` serves gRPC and plain HTTP/JSON, so it can be debugged with `curl` and called from TypeScript with generated clients.
- Typed clients and server stubs are **generated** from the `.proto` (step 0.4 "Done when").
- Messages carry `tenantId` and pseudonymous student IDs only (ADR-002, ADR-006).
- Changes to the `.proto` must be backward-compatible (add fields, never renumber or reuse them). Breaking changes need a new service version.

## Consequences
- Moving to fitted BKT, then DKT (plan §3), happens behind the same RPCs, with the §0.4 empty-contract-diff proof.
- **Risk to check in step 0.4:** Python support for Connect-RPC is younger than TypeScript's. Step 0.4 confirms that the Python server library generates and serves the three RPCs. If it can't, that step stops and presents options before anything changes.
