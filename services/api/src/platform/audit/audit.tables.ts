import { index, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Audit log behind `audit.log(actor, action, target)` (seam register: SOC 2 controls). */
export const auditSchema = pgSchema("audit");

/** Append-only; enforced by a trigger (migration 0001). Actor IDs are pseudonymous (ADR-002). */
export const auditLog = auditSchema.table(
  "log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull(),
    actorId: uuid("actor_id").notNull(),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("log_tenant_at_idx").on(t.tenantId, t.at)],
);
