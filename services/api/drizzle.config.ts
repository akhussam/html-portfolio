import { defineConfig } from "drizzle-kit";

// Each module owns its tables in src/modules/<name>/<name>.tables.ts (ADR-001, ADR-010);
// platform tables (outbox, audit) live in src/platform/*/*.tables.ts.
export default defineConfig({
  dialect: "postgresql",
  schema: ["./src/modules/*/*.tables.ts", "./src/platform/*/*.tables.ts"],
  out: "./migrations",
  dbCredentials: { url: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/platform" },
  migrations: { schema: "drizzle" },
  strict: true,
});
