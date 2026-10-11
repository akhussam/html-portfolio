import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildSchema } from "graphql";
import { describe, expect, it } from "vitest";

const schema = buildSchema(readFileSync(join(import.meta.dirname, "..", "graphql", "schema.graphql"), "utf8"));

describe("panels GraphQL schema", () => {
  it("has the subscription and query the seam register names", () => {
    expect(schema.getSubscriptionType()?.getFields().roomUpdates?.args.map((a) => a.name)).toEqual(["roomId"]);
    expect(schema.getQueryType()?.getFields().weeklyReport?.args.map((a) => a.name)).toEqual(["studentId"]);
  });

  it("has the panel mutations from plan §12", () => {
    const mutations = Object.keys(schema.getMutationType()?.getFields() ?? {});
    expect(mutations).toEqual(
      expect.arrayContaining(["nudge", "overridePlacement", "importEnrollments", "inviteParent", "setFeatureFlag", "replayOutbox"]),
    );
  });
});
