import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Plan §12: one staff app carries these surfaces as route groups.
const ROUTES = ["guide", "admin", "author", "ops", "parent"];

describe("staff app routes", () => {
  it.each(ROUTES)("mounts /%s", (route) => {
    expect(existsSync(join(__dirname, route, "page.tsx"))).toBe(true);
  });
});
