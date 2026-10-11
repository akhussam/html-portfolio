# ADR-005: Seam policy

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md §1 rule 2, §3, §0.4; CLAUDE.md rule 2

## Context
The pilot runs on free tiers with a solo developer, so many parts start as simpler stand-ins for the target architecture. Without a rule, those stand-ins become hacks that callers depend on, and upgrading them later means rewrites.

## Decision
1. **Every shortcut is a seam**: a stand-in implementation behind a **permanent interface** that callers use. A shortcut without a permanent interface is not allowed.
2. **Every seam has a row in the seam register** (BUILD_PLAN.md §3), listing:
   - the architecture target;
   - the pilot implementation;
   - the permanent interface;
   - the upgrade trigger.
3. **A new seam needs its row first, approved by @Hussam**, before any code that uses it.
4. **Upgrades happen when the trigger fires, not before.**
5. **Every upgrade proves the interface held** (plan §0.4):
   - the contract diff before and after is empty;
   - all existing tests pass without being modified.

   Both go in the upgrade's evidence bundle.
6. **Some things are never seams**, because retrofitting them is a rewrite. These are built properly from day one:
   - pseudonymous IDs (ADR-002);
   - the consent ledger;
   - module boundaries (ADR-001);
   - event schemas and the client event outbox (ADR-003);
   - the item JSON schema (ADR-007);
   - tenant ID on every table (ADR-006).

## Consequences
- Each step's kickoff names the seam row it uses (CLAUDE.md session procedure).
- Interfaces live in `packages/contracts` or as named TypeScript interfaces (e.g. `QueueStore`, `Cache`, `EmailProvider`). Callers depend on those, never on the implementation.
- A free-tier provider that turns out to be blocked or too small can be swapped behind its interface without touching callers.
