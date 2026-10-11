import { describe, expect, it } from "vitest";
import { OpsHome } from "./index";

describe("OpsHome", () => {
  it("renders the ops panel placeholder", () => {
    expect(OpsHome().props.title).toBe("Ops");
  });
});
