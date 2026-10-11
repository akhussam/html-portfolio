import { describe, expect, it } from "vitest";
import { Placeholder } from "./Placeholder";

describe("Placeholder", () => {
  it("renders the title as a heading", () => {
    const el = Placeholder({ title: "Guide" });
    expect(el.type).toBe("h1");
    expect(el.props.children).toBe("Guide");
  });
});
