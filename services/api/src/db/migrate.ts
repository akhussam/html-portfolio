// Applies services/api/migrations to DATABASE_URL. Runs in the `migrate` container before the
// API starts (infra/compose). Same files and journal as `pnpm db:migrate` (drizzle-kit), but
// without dev dependencies, so it works from the production image.
import { join } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

export async function runMigrations(databaseUrl: string, migrationsFolder: string): Promise<void> {
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  try {
    await migrate(drizzle(pool), { migrationsFolder, migrationsSchema: "drizzle" });
  } finally {
    await pool.end();
  }
}

if (process.argv[1] === import.meta.filename) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  await runMigrations(url, join(import.meta.dirname, "..", "..", "migrations"));
  console.log("migrations applied");
}
