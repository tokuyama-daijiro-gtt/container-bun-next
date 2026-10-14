import { afterEach, describe, expect, it, vi } from "vitest";
import { greet, initialGreetingState } from "./greet";

function form(name: string) {
  const data = new FormData();
  data.set("name", name);
  return data;
}

describe("greet Server Action", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns a validated greeting", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ message: "Hello, Ada!" })),
    );

    await expect(greet(initialGreetingState, form("Ada"))).resolves.toEqual({
      status: "success",
      message: "Hello, Ada!",
    });
  });

  it("rejects invalid form data without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect((await greet(initialGreetingState, form(""))).status).toBe("error");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces API and connection failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ error: "Bad request" }, { status: 400 }),
        ),
    );
    await expect(greet(initialGreetingState, form("Ada"))).resolves.toEqual({
      status: "error",
      message: "Bad request",
    });

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(greet(initialGreetingState, form("Ada"))).resolves.toEqual({
      status: "error",
      message: "API is unavailable",
    });
  });
});
