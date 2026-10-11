// Checks the Drizzle table definitions themselves (the source the migrations are generated from).
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import * as assessment from "../modules/assessment/assessment.tables.js";
import * as content from "../modules/content/content.tables.js";
import * as gamification from "../modules/gamification/gamification.tables.js";
import * as identity from "../modules/identity/identity.tables.js";
import * as notification from "../modules/notification/notification.tables.js";
import * as reporting from "../modules/reporting/reporting.tables.js";
import * as roster from "../modules/roster/roster.tables.js";
import * as session from "../modules/session/session.tables.js";
import * as audit from "../platform/audit/audit.tables.js";
import * as outbox from "../platform/outbox/outbox.tables.js";

const owners = { identity, roster, content, assessment, session, gamification, notification, reporting, audit, outbox };

const tables = Object.entries(owners).flatMap(([owner, exports]) =>
  Object.values(exports)
    .filter((value): value is PgTable => value instanceof PgTable)
    .map((table) => ({ owner, config: getTableConfig(table) })),
);

describe("table definitions", () => {
  it("define the tables step 0.5 requires", () => {
    expect(tables.map(({ config }) => `${config.schema}.${config.name}`).sort()).toEqual([
      "audit.log",
      "identity.consent_ledger",
      "outbox.events",
    ]);
  });

  it.each(tables.map((t) => [`${t.config.schema}.${t.config.name}`, t] as const))(
    "%s lives in the schema of the module that defines it (ADR-001)",
    (_name, { owner, config }) => {
      expect(config.schema).toBe(owner);
    },
  );

  it.each(tables.map((t) => [`${t.config.schema}.${t.config.name}`, t] as const))(
    "%s has a NOT NULL uuid tenant_id (ADR-006)",
    (_name, { config }) => {
      const tenant = config.columns.find((c) => c.name === "tenant_id");
      expect(tenant?.notNull).toBe(true);
      expect(tenant?.getSQLType()).toBe("uuid");
    },
  );

  it("never reference another module's tables with a foreign key (ADR-010)", () => {
    for (const { config } of tables) expect(config.foreignKeys).toEqual([]);
  });
});
