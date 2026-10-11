import { describe, expect, it } from "vitest";
import { LearningEngineService, RecommendReason } from "../src/index.js";

describe("engine.proto (ADR-004)", () => {
  it("defines the three RPCs from the seam register", () => {
    expect(LearningEngineService.typeName).toBe("engine.v1.LearningEngineService");
    expect(Object.keys(LearningEngineService.method).sort()).toEqual(["planDay", "recommendNext", "updateMastery"]);
  });

  it("puts tenant_id and student_id first on every request (ADR-002, ADR-006)", () => {
    for (const method of LearningEngineService.methods) {
      const fields = method.input.fields.map((f) => f.name);
      expect(fields.slice(0, 2)).toEqual(["tenant_id", "student_id"]);
    }
  });

  it("supports the prerequisite fallback", () => {
    expect(RecommendReason.PREREQUISITE_FALLBACK).toBe(2);
  });
});
