import { sql } from "drizzle-orm";
import { bigint, index, integer, jsonb, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Transactional outbox (ADR-003). Rows are written in the same transaction as the state change. */
export const outboxSchema = pgSchema("outbox");

export const outboxEvents = outboxSchema.table(
  "events",
  {
    /** Event ID from the envelope; consumers drop duplicates by it. */
    id: uuid("id").primaryKey(),
    /** Publish and replay order. */
    seq: bigint("seq", { mode: "bigint" }).generatedAlwaysAsIdentity().notNull().unique(),
    tenantId: uuid("tenant_id").notNull(),
    type: text("type").notNull(),
    version: integer("version").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    /** Validated against packages/contracts/events before insert. */
    payload: jsonb("payload").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (t) => [index("events_unpublished_idx").on(t.seq).where(sql`${t.publishedAt} is null`)],
);
