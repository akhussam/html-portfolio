import { pgSchema } from "drizzle-orm/pg-core";

/** Postgres schema owned by the gamification module (ADR-001). Tables arrive with the module's steps. */
export const gamificationSchema = pgSchema("gamification");
