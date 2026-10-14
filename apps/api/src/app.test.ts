import { greetingResponseSchema } from "@repo/shared";
import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("POST /greetings", () => {
  it("returns a contract-compliant greeting", async () => {
    const response = await app.request("/greetings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Ada" }),
    });

    expect(response.status).toBe(200);
    expect(greetingResponseSchema.parse(await response.json())).toEqual({
      message: "Hello, Ada!",
    });
  });

  it.each([
    ["invalid JSON", "{"],
    ["invalid input", JSON.stringify({ name: "" })],
  ])("returns 400 for %s", async (_label, body) => {
    const response = await app.request("/greetings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toHaveProperty("error");
  });
});
