import "reflect-metadata";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";
import { AppModule } from "./app.module.js";
import { HealthController } from "./health.controller.js";

describe("AppModule", () => {
  it("boots with every module and answers health", async () => {
    const ref = await Test.createTestingModule({ imports: [AppModule] }).compile();
    expect(ref.get(HealthController).check()).toEqual({ status: "ok" });
    await ref.close();
  });
});
