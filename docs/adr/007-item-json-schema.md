# ADR-007: Item JSON schema

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md §3 ("Not seams": the item JSON schema; authoring studio seam), steps 1.1, 1.2, 2.1

## Context
Items (practice and quiz questions) are written in Sanity Studio for the pilot. They will move to a custom authoring panel later (step 4.9) and are read by the content module, the item renderer in `@platform/ui`, and the assessment module's scoring. If each of them used its own idea of an item, swapping the authoring tool or adding item types would break all three.

## Decision
- **One versioned JSON Schema for items**, in `packages/contracts`. It is the only definition of an item that code depends on.
- **The content module owns it.** Sanity documents are converted to this schema behind the content module's API, so Sanity's own format never leaves that module.
- **Pilot item types** (step 1.2): multiple choice, numeric, fraction input.
- **Every item records:**
  - its stable ID;
  - its skill ID;
  - its type and the answer data needed to score it;
  - its review status;
  - two authored hints (plan §3, AI tutor seam: `POST /help/{itemId}` serves them).
- The exact fields are written as the schema itself, with tests, in the contract step before step 1.1 builds on it.
- **Changes are additive.** A new item type adds a variant. Changing an existing field means a new schema version and a migration of stored items.

## Consequences
- The renderer, scoring and authoring can each be swapped independently (Sanity → custom panel in step 4.9) without changing the others.
- Content QA (step 2.1: at least 8 items per skill, all reviewed) can be checked by validating items against the schema.
