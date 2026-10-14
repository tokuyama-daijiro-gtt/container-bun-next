import { z } from "zod";

export const greetingRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "名前を入力してください")
    .max(80, "名前は80文字以内で入力してください"),
});

export const greetingResponseSchema = z.object({
  message: z.string(),
});

export const apiErrorSchema = z.object({
  error: z.string(),
});

export type GreetingRequest = z.infer<typeof greetingRequestSchema>;
export type GreetingResponse = z.infer<typeof greetingResponseSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
