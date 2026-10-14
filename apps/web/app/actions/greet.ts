"use server";

import {
  apiErrorSchema,
  greetingRequestSchema,
  greetingResponseSchema,
} from "@repo/shared";

export type GreetingActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialGreetingState: GreetingActionState = {
  status: "idle",
  message: "",
};

export async function greet(
  _previousState: GreetingActionState,
  formData: FormData,
): Promise<GreetingActionState> {
  const request = greetingRequestSchema.safeParse({
    name: formData.get("name"),
  });

  if (!request.success) {
    return {
      status: "error",
      message:
        request.error.issues[0]?.message ?? "入力内容を確認してください",
    };
  }

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL ?? "http://127.0.0.1:3001"}/greetings`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(request.data),
        cache: "no-store",
      },
    );
    const body: unknown = await response.json();

    if (!response.ok) {
      const error = apiErrorSchema.safeParse(body);
      return {
        status: "error",
        message: error.success ? error.data.error : "API request failed",
      };
    }

    const greeting = greetingResponseSchema.safeParse(body);
    if (!greeting.success) {
      return {
        status: "error",
        message: "API returned an invalid response",
      };
    }

    return { status: "success", message: greeting.data.message };
  } catch {
    return { status: "error", message: "API is unavailable" };
  }
}
