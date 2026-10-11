import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("student app config", () => {
  const config = JSON.parse(readFileSync(join(__dirname, "app.json"), "utf8"));

  it("targets the web for the pilot (React Native Web seam)", () => {
    expect(config.expo.platforms).toContain("web");
  });
});
