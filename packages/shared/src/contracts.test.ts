import { describe, expect, it } from "vitest";
import { greetingRequestSchema, greetingResponseSchema } from "./contracts";

describe("greeting contract", () => {
  it("trims and accepts a valid name", () => {
    expect(greetingRequestSchema.parse({ name: "  Ada  " })).toEqual({
      name: "Ada",
    });
  });

  it("rejects empty and overlong names", () => {
    expect(greetingRequestSchema.safeParse({ name: "   " }).success).toBe(
      false,
    );
    expect(
      greetingRequestSchema.safeParse({ name: "a".repeat(81) }).success,
    ).toBe(false);
  });

  it("defines the response shape", () => {
    expect(
      greetingResponseSchema.parse({ message: "Hello, Ada!" }),
    ).toEqual({ message: "Hello, Ada!" });
  });
});
