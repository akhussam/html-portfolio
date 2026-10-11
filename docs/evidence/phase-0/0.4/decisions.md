# Step 0.4 — Decisions

ADR-002, 003, 004, 006 and 007 are applied here; no new ADR. The choices below were made while drafting and are **for @Hussam's contract review**:

| # | Choice | Why / alternative |
|---|---|---|
| C1 | Responses can be submitted two ways, both keyed by `clientResponseId`: `POST /responses` (online, immediate feedback) and `POST /sync/outbox` (offline batch) | The plan names `/sync/outbox`. Immediate correctness needs the server, because answers never go to the client |
| C2 | The student app gets `PresentedItem` (no answers, no hints). Hints come only through `POST /help/{itemId}` | ADR-007; hint flow from plan §12 |
| C3 | The engine holds no content: `RecommendNext` receives candidate items and prerequisite skill IDs from the caller | Content owns items (ADR-001); the engine owns mastery |
| C4 | `RecommendNext` returns a reason: practice, prerequisite fallback, or ready for quiz | Plan 1.4 "prerequisite fallback"; quiz gate in 1.3 |
| C5 | Session endpoints are nested: `POST /sessions`, `GET /sessions/{id}/next` | The plan says `GET /next`; nesting makes the session explicit |
| C6 | Mastery quiz endpoints: `POST /skills/{id}/quiz`, `POST /quizzes/{id}/finish` | Plan 1.3 names the quiz but not its endpoints |
| C7 | Item schema v1: prompt, 2 hints, review status, and one body per type (multiple choice: choices + correct ID; numeric: answer; fraction: answer + `acceptEquivalent`) | Pulled forward from "before 1.1" because the lesson API needs it |
| C8 | GraphQL `overridePlacement` sets mastered true/false per skill | Plan 2.6 names the action only |
| C9 | The contracts package now builds to `dist/` (ESM), and the API switched to ESM | Node services can't run TypeScript source from a package |
| C10 | Code generation tools:<br>• buf + protoc-gen-es (TypeScript)<br>• grpcio-tools + protoc-gen-connect-python (Python)<br>• openapi-typescript + openapi-fetch<br>• graphql-codegen client preset<br>• json-schema-to-typescript<br>Generated code is committed and diff-checked in CI | Builds don't need generators at runtime, and reviews see generated changes |
