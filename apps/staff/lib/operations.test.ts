import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import type { ResultOf, VariablesOf } from "@graphql-typed-document-node/core";
import { buildSchema, parse, validate } from "graphql";
import { describe, expect, it } from "vitest";
import * as operations from "./operations";

const require = createRequire(import.meta.url);
const schema = buildSchema(readFileSync(require.resolve("@platform/contracts/graphql/schema.graphql"), "utf8"));

describe("panel GraphQL operations (generated typed client)", () => {
  it.each(Object.entries(operations))("%s is valid against the contract schema", (_name, doc) => {
    expect(validate(schema, doc)).toEqual([]);
  });

  it("rejects an operation that asks for a field the contract does not have", () => {
    const errors = validate(schema, parse("query { room(roomId: \"r\") { id studentName } }"));
    expect(errors[0]?.message).toMatch(/studentName/);
  });

  it("types results and variables from the schema", () => {
    // Never called: these lines exist for `pnpm typecheck`.
    const compileOnly = (result: ResultOf<typeof operations.RoomGridQuery>) => {
      const status: "WORKING" | "IDLE" | "OFF_TASK" | "HAND_RAISED" | "OFFLINE" | undefined = result.room?.students[0]?.status;
      const vars: VariablesOf<typeof operations.NudgeMutation> = { studentId: "s", message: "Keep going!" };
      // @ts-expect-error roomId is required
      const bad: VariablesOf<typeof operations.RoomGridQuery> = {};
      return [status, vars, bad];
    };
    expect(compileOnly).toBeTypeOf("function");
  });
});
