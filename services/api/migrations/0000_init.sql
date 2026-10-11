CREATE SCHEMA "assessment";
--> statement-breakpoint
CREATE SCHEMA "content";
--> statement-breakpoint
CREATE SCHEMA "gamification";
--> statement-breakpoint
CREATE SCHEMA "identity";
--> statement-breakpoint
CREATE SCHEMA "notification";
--> statement-breakpoint
CREATE SCHEMA "reporting";
--> statement-breakpoint
CREATE SCHEMA "roster";
--> statement-breakpoint
CREATE SCHEMA "session";
--> statement-breakpoint
CREATE SCHEMA "audit";
--> statement-breakpoint
CREATE SCHEMA "outbox";
--> statement-breakpoint
CREATE TYPE "identity"."consent_action" AS ENUM('granted', 'withdrawn');--> statement-breakpoint
CREATE TABLE "identity"."consent_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"guardian_id" uuid NOT NULL,
	"action" "identity"."consent_action" NOT NULL,
	"policy_version" text NOT NULL,
	"recorded_by" uuid NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit"."log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outbox"."events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"seq" bigint GENERATED ALWAYS AS IDENTITY (sequence name "outbox"."events_seq_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"tenant_id" uuid NOT NULL,
	"type" text NOT NULL,
	"version" integer NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"payload" jsonb NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "events_seq_unique" UNIQUE("seq")
);
--> statement-breakpoint
CREATE INDEX "consent_ledger_student_idx" ON "identity"."consent_ledger" USING btree ("tenant_id","student_id","recorded_at");--> statement-breakpoint
CREATE INDEX "log_tenant_at_idx" ON "audit"."log" USING btree ("tenant_id","at");--> statement-breakpoint
CREATE INDEX "events_unpublished_idx" ON "outbox"."events" USING btree ("seq") WHERE "outbox"."events"."published_at" is null;