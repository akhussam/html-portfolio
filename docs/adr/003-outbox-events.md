# ADR-003: Transactional outbox for events

- **Status:** Accepted
- **Date:** 2026-10-11
- **Plan refs:** BUILD_PLAN.md §3 (event stream seam; "Not seams": event schemas, client event outbox), steps 0.4, 0.5, 1.3, 1.5

## Context
The architecture target is a streaming platform (Kinesis/Kafka). The pilot needs reliable events (e.g. `response.scored`, `session.*`, `skill.mastered`) without running a broker, and must never lose a student's response, including when the device is offline.

## Decision
- **Server outbox (a seam, per the plan's register):**
  - A module that changes state also writes its event to an `outbox` table **in the same Postgres transaction**.
  - A relay worker reads unpublished rows and publishes them to an in-process bus.
  - Callers use only `EventPublisher.publish(event)`.
- **Event schemas (not a seam):** every event type has a JSON Schema in `packages/contracts/events`. Events are validated on publish. Every event carries:
  - an event `id`;
  - a `type` and a schema `version`;
  - `occurredAt`;
  - `tenantId` (ADR-006);
  - pseudonymous subject IDs only (ADR-002).
- **Delivery is at least once.** Consumers must be idempotent, using the event `id` to drop duplicates.
- **Client outbox (not a seam):**
  - The student app queues each response locally with a client-generated idempotent ID.
  - It sends the queue through `POST /sync/outbox`.
  - The server drops duplicates by that ID.
- **Upgrade trigger** (plan §3): more than 50 events/s sustained, or a second consumer service. The relay then targets Kinesis and `EventPublisher` does not change.

## Consequences
- There is no broker to run on the free VM, and an event and its state change can never disagree.
- The ops panel can replay the outbox (step 2.7) by re-publishing rows.
- Event schemas are permanent contracts. Changing one means a new `version`, never a silent edit.
