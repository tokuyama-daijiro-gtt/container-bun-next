"use client";

import { useActionState } from "react";
import {
  greet,
  type GreetingActionState,
  initialGreetingState,
} from "./actions/greet";

export function GreetingStatus({ state }: { state: GreetingActionState }) {
  if (!state.message) return null;

  return (
    <p
      aria-live="polite"
      className={
        state.status === "error" ? "text-red-700" : "text-emerald-700"
      }
    >
      {state.message}
    </p>
  );
}

export function GreetingForm() {
  const [state, formAction, isPending] = useActionState(
    greet,
    initialGreetingState,
  );

  return (
    <form
      action={formAction}
      className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-8 shadow-sm"
    >
      <label className="flex flex-col gap-2 font-medium" htmlFor="name">
        Name
        <input
          className="rounded-lg border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-zinc-600"
          id="name"
          name="name"
          maxLength={80}
          required
        />
      </label>
      <button
        className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Sending..." : "Say hello"}
      </button>
      <GreetingStatus state={state} />
    </form>
  );
}
