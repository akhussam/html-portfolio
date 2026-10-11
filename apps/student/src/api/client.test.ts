import { describe, expect, it, vi } from "vitest";
import { createLessonPlayerClient } from "./client";

function fakeFetch(body: unknown, status = 200) {
  return vi.fn<typeof globalThis.fetch>(
    async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

describe("lesson-player client (generated from OpenAPI)", () => {
  it("sends the bearer token and fills path params", async () => {
    const fetch = fakeFetch({ id: "l1", skillId: "s1", title: "Equivalent fractions", items: [] });
    const api = createLessonPlayerClient({ baseUrl: "https://api.test/api/v1", getToken: () => "jwt", fetch });

    const { data } = await api.GET("/lessons/{lessonId}", { params: { path: { lessonId: "l1" } } });

    const request = fetch.mock.calls[0]![0] as Request;
    expect(request.url).toBe("https://api.test/api/v1/lessons/l1");
    expect(request.headers.get("Authorization")).toBe("Bearer jwt");
    expect(data?.title).toBe("Equivalent fractions");
  });

  it("posts queued responses to the outbox sync endpoint", async () => {
    const fetch = fakeFetch({ accepted: ["3b4c5d6e-7f8a-4b9c-8d0e-1f2a3b4c5d6e"], duplicates: [] });
    const api = createLessonPlayerClient({ baseUrl: "https://api.test/api/v1", getToken: () => undefined, fetch });

    const { data } = await api.POST("/sync/outbox", {
      body: {
        responses: [
          {
            clientResponseId: "3b4c5d6e-7f8a-4b9c-8d0e-1f2a3b4c5d6e",
            sessionId: "1d2c3b4a-5f6e-4d7c-8b9a-0a1b2c3d4e5f",
            itemId: "i1",
            answer: { type: "fraction", numerator: 1, denominator: 2 },
            answeredAt: "2026-10-11T09:00:00Z",
            durationMs: 5000,
            hintsUsed: 0,
          },
        ],
      },
    });

    const request = fetch.mock.calls[0]![0] as Request;
    expect(request.method).toBe("POST");
    expect(request.url).toBe("https://api.test/api/v1/sync/outbox");
    expect(request.headers.has("Authorization")).toBe(false);
    expect(data?.accepted).toHaveLength(1);
  });

  it("rejects a wrong path or body at compile time", () => {
    // Never called: these lines exist for `pnpm typecheck`, where each must stay an error.
    const compileOnly = (api: ReturnType<typeof createLessonPlayerClient>) => {
      // @ts-expect-error unknown path
      void api.GET("/lesson/{lessonId}", { params: { path: { lessonId: "l1" } } });
      // @ts-expect-error hintsUsed must be a number
      void api.POST("/responses", { body: { clientResponseId: "x", sessionId: "y", itemId: "i", answer: { type: "numeric", value: 1 }, answeredAt: "t", durationMs: 1, hintsUsed: "two" } });
    };
    expect(compileOnly).toBeTypeOf("function");
  });
});
