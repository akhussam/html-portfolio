import { createClient, type Client } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { LearningEngineService } from "@platform/contracts";

export type EngineClient = Client<typeof LearningEngineService>;

/** Typed client for the learning engine, generated from engine.proto (ADR-004). */
export function createEngineClient(baseUrl: string): EngineClient {
  return createClient(LearningEngineService, createConnectTransport({ baseUrl, httpVersion: "1.1" }));
}
