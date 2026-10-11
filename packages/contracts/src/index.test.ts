import { describe, expect, it } from "vitest";
import { CONTRACTS_VERSION } from "./index";

describe("contracts", () => {
  it("exposes a version", () => {
    expect(CONTRACTS_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
