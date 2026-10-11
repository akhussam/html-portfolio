import { describe, expect, it } from "vitest";
import { AuthorHome } from "./index";

describe("AuthorHome", () => {
  it("renders the author panel placeholder", () => {
    expect(AuthorHome().props.title).toBe("Author");
  });
});
