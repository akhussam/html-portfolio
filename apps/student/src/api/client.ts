import createClient from "openapi-fetch";
import type { LessonPlayerPaths } from "@platform/contracts";

export type LessonPlayerClient = ReturnType<typeof createLessonPlayerClient>;

/**
 * Typed client for the lesson-player REST API, generated from
 * packages/contracts/openapi/lesson-player.yaml. Paths, params and bodies are checked at compile time.
 */
export function createLessonPlayerClient(options: {
  baseUrl: string;
  getToken: () => string | undefined;
  fetch?: typeof globalThis.fetch;
}) {
  const client = createClient<LessonPlayerPaths>({ baseUrl: options.baseUrl, fetch: options.fetch });
  client.use({
    onRequest({ request }) {
      const token = options.getToken();
      if (token) request.headers.set("Authorization", `Bearer ${token}`);
      return request;
    },
  });
  return client;
}
