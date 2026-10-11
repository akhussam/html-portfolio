// Step 0.5 "Done when": the migrations build a clean database. Runs every migration on a
// brand-new database, then checks the rules from ADR-001, ADR-003, ADR-006 and ADR-010.
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestDatabase, type TestDatabase } from "./test-database.js";

const MODULE_SCHEMAS = ["identity", "roster", "content", "assessment", "session", "gamification", "notification", "reporting"];
const PLATFORM_SCHEMAS = ["outbox", "audit"];
const OWNED_SCHEMAS = [...MODULE_SCHEMAS, ...PLATFORM_SCHEMAS];

const tenant = randomUUID();
let db: TestDatabase;

beforeAll(async () => {
  db = await createTestDatabase();
  await db.migrate();
}, 60_000);

afterAll(async () => {
  await db?.close();
});

const rejects = async (sql: string, params?: unknown[]) => {
  const error = await db.query(sql, params).then(
    () => undefined,
    (e: unknown) => e as Error,
  );
  expect(error, `expected to fail: ${sql}`).toBeInstanceOf(Error);
  return error!.message;
};

describe(`migrations on a clean database`, () => {
  it("create one schema per module plus outbox and audit (ADR-001)", async () => {
    const rows = await db.query<{ schema_name: string }>(
      "select schema_name from information_schema.schemata where schema_name = any($1)",
      [OWNED_SCHEMAS],
    );
    expect(rows.map((r) => r.schema_name).sort()).toEqual([...OWNED_SCHEMAS].sort());
  });

  it("create the outbox, audit log and consent ledger tables", async () => {
    const rows = await db.query<{ t: string }>(
      "select table_schema || '.' || table_name as t from information_schema.tables where table_type = 'BASE TABLE' and table_schema = any($1)",
      [OWNED_SCHEMAS],
    );
    expect(rows.map((r) => r.t)).toEqual(
      expect.arrayContaining(["outbox.events", "audit.log", "identity.consent_ledger"]),
    );
  });

  it("give every table a NOT NULL uuid tenant_id (ADR-006)", async () => {
    const tables = await db.query<{ t: string }>(
      "select table_schema || '.' || table_name as t from information_schema.tables where table_type = 'BASE TABLE' and table_schema = any($1)",
      [OWNED_SCHEMAS],
    );
    const withTenant = await db.query<{ t: string }>(
      `select table_schema || '.' || table_name as t from information_schema.columns
       where table_schema = any($1) and column_name = 'tenant_id' and data_type = 'uuid' and is_nullable = 'NO'`,
      [OWNED_SCHEMAS],
    );
    expect(tables.length).toBeGreaterThan(0);
    expect(withTenant.map((r) => r.t).sort()).toEqual(tables.map((r) => r.t).sort());
  });

  it("are idempotent: running them again changes nothing", async () => {
    const before = await db.query<{ n: number }>("select count(*)::int as n from drizzle.__drizzle_migrations");
    await db.migrate();
    const after = await db.query<{ n: number }>("select count(*)::int as n from drizzle.__drizzle_migrations");
    expect(after[0]!.n).toBe(before[0]!.n);
    expect(before[0]!.n).toBeGreaterThanOrEqual(2);
  });
});

describe("audit.log is append-only (ADR-010)", () => {
  let id: string;

  beforeAll(async () => {
    const [row] = await db.query<{ id: string }>(
      "insert into audit.log (tenant_id, actor_id, action, target_type, target_id) values ($1, $2, 'user.lookup', 'user', 'u-1') returning id",
      [tenant, randomUUID()],
    );
    id = row!.id;
  });

  it("accepts inserts", async () => {
    const rows = await db.query("select * from audit.log where id = $1", [id]);
    expect(rows).toHaveLength(1);
  });

  it.each([
    ["update", "update audit.log set action = 'x' where id = $1"],
    ["delete", "delete from audit.log where id = $1"],
  ])("rejects %s", async (_op, sql) => {
    expect(await rejects(sql, [id])).toMatch(/append-only/);
  });

  it("rejects truncate", async () => {
    expect(await rejects("truncate audit.log")).toMatch(/append-only/);
  });
});

describe("identity.consent_ledger is append-only (ADR-010)", () => {
  const student = randomUUID();
  let id: string;

  beforeAll(async () => {
    const [row] = await db.query<{ id: string }>(
      `insert into identity.consent_ledger (tenant_id, student_id, guardian_id, action, policy_version, recorded_by)
       values ($1, $2, $3, 'granted', 'v1', $3) returning id`,
      [tenant, student, randomUUID()],
    );
    id = row!.id;
  });

  it("records a withdrawal as a new row, not an edit", async () => {
    await db.query(
      `insert into identity.consent_ledger (tenant_id, student_id, guardian_id, action, policy_version, recorded_by)
       values ($1, $2, $3, 'withdrawn', 'v1', $3)`,
      [tenant, student, randomUUID()],
    );
    const rows = await db.query("select action from identity.consent_ledger where student_id = $1", [student]);
    expect(rows).toHaveLength(2);
  });

  it("rejects an unknown action", async () => {
    await rejects(
      `insert into identity.consent_ledger (tenant_id, student_id, guardian_id, action, policy_version, recorded_by)
       values ($1, $2, $2, 'maybe', 'v1', $2)`,
      [tenant, randomUUID()],
    );
  });

  it.each([
    ["update", "update identity.consent_ledger set action = 'withdrawn' where id = $1"],
    ["delete", "delete from identity.consent_ledger where id = $1"],
  ])("rejects %s", async (_op, sql) => {
    expect(await rejects(sql, [id])).toMatch(/append-only/);
  });

  it("rejects truncate", async () => {
    expect(await rejects("truncate identity.consent_ledger")).toMatch(/append-only/);
  });
});

describe("outbox.events (ADR-003)", () => {
  const insert = (id: string) =>
    db.query<{ seq: string }>(
      `insert into outbox.events (id, tenant_id, type, version, occurred_at, payload)
       values ($1, $2, 'session.started', 1, now(), '{}'::jsonb) returning seq`,
      [id, tenant],
    );

  it("orders events by an increasing seq", async () => {
    const [a] = await insert(randomUUID());
    const [b] = await insert(randomUUID());
    expect(BigInt(b!.seq)).toBeGreaterThan(BigInt(a!.seq));
  });

  it("rejects a second event with the same id", async () => {
    const id = randomUUID();
    await insert(id);
    expect(await rejects(
      `insert into outbox.events (id, tenant_id, type, version, occurred_at, payload)
       values ($1, $2, 'session.started', 1, now(), '{}'::jsonb)`,
      [id, tenant],
    )).toMatch(/duplicate key|unique/i);
  });

  it("starts events unpublished", async () => {
    const rows = await db.query<{ n: number }>("select count(*)::int as n from outbox.events where published_at is not null");
    expect(rows[0]!.n).toBe(0);
  });
});
