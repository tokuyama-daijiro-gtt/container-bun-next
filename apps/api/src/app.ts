import {
  apiErrorSchema,
  greetingRequestSchema,
  greetingResponseSchema,
} from "@repo/shared";
import { Hono } from "hono";

export const app = new Hono();

app.post("/greetings", async (context) => {
  const body = await context.req.json().catch(() => null);
  const request = greetingRequestSchema.safeParse(body);

  if (!request.success) {
    return context.json(
      apiErrorSchema.parse({
        error: request.error.issues[0]?.message ?? "Invalid request",
      }),
      400,
    );
  }

  return context.json(
    greetingResponseSchema.parse({
      message: `Hello, ${request.data.name}!`,
    }),
  );
});
