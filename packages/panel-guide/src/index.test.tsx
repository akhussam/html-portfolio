import { describe, expect, it } from "vitest";
import { GuideHome } from "./index";

describe("GuideHome", () => {
  it("renders the guide panel placeholder", () => {
    expect(GuideHome().props.title).toBe("Guide");
  });
});
