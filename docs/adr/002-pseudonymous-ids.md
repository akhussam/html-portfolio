# ADR-002: Pseudonymous student IDs

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md §3 ("Not seams"), §4 identity, step 0.9, Definition of Done ("No PII outside identity")

## Context
The platform stores children's learning data. The plan lists pseudonymous student IDs as **not a seam**: retrofitting them later would mean a rewrite. Privacy law is out of scope for this phase (pilot brief D2), but this is an architecture rule, not a legal one, so it stands.

## Decision
- Every person (student, guide, parent, admin, author, ops) gets a **random, opaque pseudonymous ID** (UUID v4) when created.
- **Only the identity module** stores the mapping from that ID to personally identifying information (name, email, login identifiers, picture password), in its own schema.
- **Everywhere else** (other modules' tables, events, logs, traces, metrics, the learning engine, analytics) uses only the pseudonymous ID. That includes:
  - the JWT claims (step 0.9);
  - the event payloads (ADR-003);
  - the RPC messages (ADR-004).
- Screens that must show a name (the guide's room grid, admin roster) get it **from the identity module's API at display time**. They do not copy it into their own data.
- The ID is never derived from PII (no hashing of names or emails), so it can't be reversed.

## Consequences
- The "No PII outside identity" check in the Definition of Done can be tested: scan logs, events and traces for anything that isn't a pseudonymous ID.
- Privacy export and delete (step 2.8) only have to touch the identity module to remove someone's identity; learning data left behind is already pseudonymous.
- Showing names costs one extra lookup to identity. It can be cached behind the `Cache` interface (plan §3) if needed.
