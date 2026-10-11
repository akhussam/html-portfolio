import { index, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Postgres schema owned by the identity module (ADR-001). Only identity holds PII (ADR-002). */
export const identitySchema = pgSchema("identity");

export const consentAction = identitySchema.enum("consent_action", ["granted", "withdrawn"]);

/**
 * Consent ledger (plan §3 "not a seam"; step 2.8): append-only. A change of mind is a new row,
 * never an update; the latest row per student wins. Enforced by a trigger (migration 0001).
 */
export const consentLedger = identitySchema.table(
  "consent_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull(),
    studentId: uuid("student_id").notNull(),
    guardianId: uuid("guardian_id").notNull(),
    action: consentAction("action").notNull(),
    policyVersion: text("policy_version").notNull(),
    recordedBy: uuid("recorded_by").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("consent_ledger_student_idx").on(t.tenantId, t.studentId, t.recordedAt)],
);
