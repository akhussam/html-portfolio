import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

export const MIGRATIONS_FOLDER = join(import.meta.dirname, "..", "..", "migrations");

/** A brand-new, empty database for one test file. */
export interface TestDatabase {
  readonly engine: "postgres" | "pglite";
  migrate(): Promise<void>;
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  close(): Promise<void>;
}

/**
 * With DATABASE_URL (CI, or local Postgres 17 from compose.dev.yaml): creates a uniquely named
 * database on that server and drops it on close. Without it: an in-process PGlite (Postgres
 * compiled to WebAssembly). CI must always use the real server.
 */
export async function createTestDatabase(): Promise<TestDatabase> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    if (process.env.CI) throw new Error("DATABASE_URL must be set in CI: migration tests run on real Postgres");
    return createPgliteDatabase();
  }
  return createPostgresDatabase(url);
}

async function createPostgresDatabase(url: string): Promise<TestDatabase> {
  const name = `test_${randomUUID().replaceAll("-", "")}`;
  const admin = new pg.Client({ connectionString: url });
  await admin.connect();
  await admin.query(`CREATE DATABASE "${name}"`);
  const testUrl = new URL(url);
  testUrl.pathname = `/${name}`;
  const pool = new pg.Pool({ connectionString: testUrl.toString(), max: 2 });
  return {
    engine: "postgres",
    migrate: () => migratePg(drizzlePg(pool), { migrationsFolder: MIGRATIONS_FOLDER, migrationsSchema: "drizzle" }),
    query: async <T>(sql: string, params?: unknown[]) => (await pool.query(sql, params)).rows as T[],
    async close() {
      await pool.end();
      await admin.query(`DROP DATABASE "${name}"`);
      await admin.end();
    },
  };
}

async function createPgliteDatabase(): Promise<TestDatabase> {
  const client = new PGlite();
  return {
    engine: "pglite",
    migrate: () =>
      migratePglite(drizzlePglite(client), { migrationsFolder: MIGRATIONS_FOLDER, migrationsSchema: "drizzle" }),
    query: async <T>(sql: string, params?: unknown[]) => (await client.query<T>(sql, params)).rows,
    close: () => client.close(),
  };
}
