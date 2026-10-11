import { readFileSync } from "node:fs";
import { join } from "node:path";
import SwaggerParser from "@apidevtools/swagger-parser";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const file = join(import.meta.dirname, "..", "openapi", "lesson-player.yaml");
const doc = parse(readFileSync(file, "utf8"));
const operations = Object.entries(doc.paths as Record<string, Record<string, { operationId?: string }>>).flatMap(
  ([path, ops]) => Object.entries(ops).map(([method, op]) => ({ path, method, op })),
);

describe("lesson-player OpenAPI", () => {
  it("is a valid OpenAPI 3.1 document", async () => {
    await expect(SwaggerParser.validate(file)).resolves.toBeTruthy();
  });

  it("requires a bearer JWT on every operation (tenant + pseudonymous ID come from it)", () => {
    expect(doc.security).toEqual([{ bearerAuth: [] }]);
    for (const { op } of operations) expect(op).not.toHaveProperty("security");
  });

  it("gives every operation a unique operationId", () => {
    const ids = operations.map(({ op }) => op.operationId);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("serves the endpoints the plan names", () => {
    const routes = operations.map(({ method, path }) => `${method.toUpperCase()} ${path}`);
    expect(routes).toEqual(
      expect.arrayContaining([
        "GET /skills/{skillId}/prereqs",
        "GET /lessons/{lessonId}",
        "GET /sessions/{sessionId}/next",
        "POST /sync/outbox",
        "POST /placement/{subject}/start",
        "POST /placement/{subject}/next",
        "POST /placement/{subject}/finish",
        "POST /help/{itemId}",
      ]),
    );
  });

  it("never sends answers or hints to the student app (ADR-007)", () => {
    const presented = JSON.stringify(doc.components.schemas.PresentedItem);
    for (const leak of ["correctChoiceId", "answer", "numerator", "denominator", "hints"]) {
      expect(presented).not.toContain(`"${leak}"`);
    }
  });

  it("makes response submission idempotent by clientResponseId (ADR-003)", () => {
    expect(doc.components.schemas.ResponseSubmission.required).toContain("clientResponseId");
  });
});
