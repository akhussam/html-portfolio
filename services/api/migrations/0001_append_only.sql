-- The audit log and the consent ledger are append-only (ADR-010): rows are never
-- updated, deleted or truncated. A correction or a change of consent is a new row.
CREATE FUNCTION "audit"."forbid_change"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '%.% is append-only (% not allowed)', TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP
    USING ERRCODE = 'insufficient_privilege';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER "log_append_only" BEFORE UPDATE OR DELETE ON "audit"."log"
  FOR EACH ROW EXECUTE FUNCTION "audit"."forbid_change"();
--> statement-breakpoint
CREATE TRIGGER "log_no_truncate" BEFORE TRUNCATE ON "audit"."log"
  FOR EACH STATEMENT EXECUTE FUNCTION "audit"."forbid_change"();
--> statement-breakpoint
CREATE FUNCTION "identity"."forbid_change"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '%.% is append-only (% not allowed)', TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP
    USING ERRCODE = 'insufficient_privilege';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER "consent_ledger_append_only" BEFORE UPDATE OR DELETE ON "identity"."consent_ledger"
  FOR EACH ROW EXECUTE FUNCTION "identity"."forbid_change"();
--> statement-breakpoint
CREATE TRIGGER "consent_ledger_no_truncate" BEFORE TRUNCATE ON "identity"."consent_ledger"
  FOR EACH STATEMENT EXECUTE FUNCTION "identity"."forbid_change"();
