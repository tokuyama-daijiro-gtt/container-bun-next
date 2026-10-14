import { GreetingForm } from "./greeting-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-100 px-6 text-zinc-950">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Next.js + Hono
        </h1>
        <p className="mt-3 text-zinc-600">
          The API is called only through a Server Action.
        </p>
      </div>
      <GreetingForm />
    </main>
  );
}
