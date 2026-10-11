import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { describe, expect, it } from "vitest";
import { EVENT_TYPES, itemSchema, responseScoredEventSchema } from "../src/index.js";

const root = join(import.meta.dirname, "..");
const load = (dir: string, f: string) => JSON.parse(readFileSync(join(root, dir, f), "utf8"));
const ajv = new Ajv2020.default({ strict: true, allErrors: true });
addFormats.default(ajv);

const eventFiles = readdirSync(join(root, "events")).filter(
  (f) => f.endsWith(".schema.json") && f !== "envelope.schema.json",
);
const envelope = load("events", "envelope.schema.json");

const TENANT = "6f1c2c1e-5b1a-4f3e-9a51-0c8d7c1b2a01";
const STUDENT = "0b6f3a52-8d0e-4f6b-a1d2-3c4b5a6f7e80";
const SESSION = "1d2c3b4a-5f6e-4d7c-8b9a-0a1b2c3d4e5f";

const validEvents: Record<string, unknown> = {
  "response.scored": {
    responseId: "2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d",
    clientResponseId: "3b4c5d6e-7f8a-4b9c-8d0e-1f2a3b4c5d6e",
    sessionId: SESSION,
    studentId: STUDENT,
    itemId: "item-1",
    skillId: "skill-1",
    correct: true,
    durationMs: 4200,
    hintsUsed: 1,
  },
  "session.started": { sessionId: SESSION, studentId: STUDENT },
  "session.ended": { sessionId: SESSION, studentId: STUDENT },
  "skill.mastered": {
    studentId: STUDENT,
    skillId: "skill-1",
    quizId: "4c5d6e7f-8a9b-4c0d-9e1f-2a3b4c5d6e7f",
    scorePct: 90,
  },
};

const event = (type: string, payload: unknown) => ({
  id: "5d6e7f8a-9b0c-4d1e-8f2a-3b4c5d6e7f8a",
  type,
  version: 1,
  occurredAt: "2026-10-11T09:00:00Z",
  tenantId: TENANT,
  payload,
});

describe("event schemas (ADR-003)", () => {
  it("cover exactly the event types the contracts export", () => {
    expect(eventFiles.map((f) => f.replace(".schema.json", "")).sort()).toEqual([...EVENT_TYPES].sort());
  });

  for (const file of eventFiles) {
    const schema = load("events", file);
    const type = file.replace(".schema.json", "");
    const validate = ajv.compile(schema);

    describe(type, () => {
      it("requires every envelope field, including tenantId (ADR-006)", () => {
        expect(schema.required).toEqual(expect.arrayContaining(envelope.required));
        expect(schema.properties.type.const).toBe(type);
      });

      it("accepts a valid event", () => {
        expect(validate(event(type, validEvents[type])), JSON.stringify(validate.errors)).toBe(true);
      });

      it("rejects an event without tenantId", () => {
        const withoutTenant: Record<string, unknown> = event(type, validEvents[type]);
        delete withoutTenant.tenantId;
        expect(validate(withoutTenant)).toBe(false);
      });

      it("rejects extra payload fields (no PII can slip in, ADR-002)", () => {
        const payload = { ...(validEvents[type] as object), studentName: "Sara" };
        expect(validate(event(type, payload))).toBe(false);
      });

      it("uses pseudonymous UUIDs for studentId", () => {
        const payload = { ...(validEvents[type] as object), studentId: "sara@example.com" };
        expect(validate(event(type, payload))).toBe(false);
      });
    });
  }

  it("exports the same schema the file defines", () => {
    expect(responseScoredEventSchema).toEqual(load("events", "response.scored.schema.json"));
  });
});

describe("item schema (ADR-007)", () => {
  const validate = ajv.compile(itemSchema);
  const base = {
    schemaVersion: 1,
    id: "item-1",
    skillId: "skill-1",
    reviewStatus: "approved",
    prompt: "What is 3 × 4?",
    hints: ["Think of 3 groups of 4.", "Count 4, 8, 12."],
  };

  it.each([
    ["multiple choice", { type: "multiple_choice", choices: [{ id: "a", text: "12" }, { id: "b", text: "7" }], correctChoiceId: "a" }],
    ["numeric", { type: "numeric", answer: 12 }],
    ["fraction", { type: "fraction", numerator: 1, denominator: 2, acceptEquivalent: true }],
  ])("accepts a %s item", (_name, body) => {
    expect(validate({ ...base, body }), JSON.stringify(validate.errors)).toBe(true);
  });

  it("requires exactly two hints", () => {
    expect(validate({ ...base, hints: ["only one"], body: { type: "numeric", answer: 12 } })).toBe(false);
  });

  it("rejects an unknown item type", () => {
    expect(validate({ ...base, body: { type: "drag_drop" } })).toBe(false);
  });

  it("rejects a zero denominator", () => {
    expect(validate({ ...base, body: { type: "fraction", numerator: 1, denominator: 0, acceptEquivalent: false } })).toBe(false);
  });
});
