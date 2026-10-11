import { describe, expect, it } from "vitest";
import { AdminHome } from "./index";

describe("AdminHome", () => {
  it("renders the admin panel placeholder", () => {
    expect(AdminHome().props.title).toBe("Admin");
  });
});
