// Cross-language contract test: the TypeScript client generated from engine.proto calls the
// real Python engine (services/learning-engine) over Connect. Needs uv on PATH (as in CI).
import { spawn, type ChildProcess } from "node:child_process";
import { join } from "node:path";
import { Code, ConnectError } from "@connectrpc/connect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createEngineClient, type EngineClient } from "./engine.client.js";

const engineDir = join(import.meta.dirname, "..", "..", "..", "learning-engine");
let engine: ChildProcess;
let client: EngineClient;

beforeAll(async () => {
  engine = spawn(
    "uv",
    ["run", "--frozen", "uvicorn", "learning_engine.main:app", "--host", "127.0.0.1", "--port", "0"],
    { cwd: engineDir, stdio: ["ignore", "ignore", "pipe"] },
  );
  const baseUrl = await new Promise<string>((resolve, reject) => {
    let log = "";
    engine.stderr?.on("data", (chunk: Buffer) => {
      log += chunk.toString();
      const match = log.match(/Uvicorn running on (http:\/\/127\.0\.0\.1:\d+)/);
      if (match?.[1]) resolve(match[1]);
    });
    engine.on("exit", (code) => reject(new Error(`engine exited (${code}):\n${log}`)));
  });
  client = createEngineClient(baseUrl);
}, 60_000);

afterAll(() => {
  engine?.kill();
});

const ids = {
  tenantId: "6f1c2c1e-5b1a-4f3e-9a51-0c8d7c1b2a01",
  studentId: "0b6f3a52-8d0e-4f6b-a1d2-3c4b5a6f7e80",
};

describe("engine RPCs from TypeScript to Python", () => {
  it.each([
    ["updateMastery", () => client.updateMastery({ ...ids, skillId: "s1", itemId: "i1", correct: true })],
    ["recommendNext", () => client.recommendNext({ ...ids, skillId: "s1", candidates: [{ itemId: "i1", skillId: "s1" }] })],
    ["planDay", () => client.planDay({ ...ids, date: "2026-10-11" })],
  ])("%s reaches the Python handler", async (_name, call) => {
    // Until step 1.4 the engine answers UNIMPLEMENTED with the handler's own message;
    // a wrong route would also be UNIMPLEMENTED, but without that message.
    const err = await call().then(
      () => undefined,
      (e: unknown) => ConnectError.from(e),
    );
    expect(err?.code).toBe(Code.Unimplemented);
    expect(err?.rawMessage).toBe("Not implemented");
  });
});
