import { pgSchema } from "drizzle-orm/pg-core";

/** Postgres schema owned by the notification module (ADR-001). Tables arrive with the module's steps. */
export const notificationSchema = pgSchema("notification");
