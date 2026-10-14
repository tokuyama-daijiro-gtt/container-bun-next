// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GreetingForm, GreetingStatus } from "./greeting-form";

describe("GreetingForm", () => {
  it("renders the Server Action form", () => {
    render(<GreetingForm />);

    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByRole("button", { name: "Say hello" })).toBeEnabled();
  });

  it.each([
    ["success", "Hello, Ada!"],
    ["error", "API is unavailable"],
  ] as const)("renders the %s state", (status, message) => {
    render(<GreetingStatus state={{ status, message }} />);

    expect(screen.getByText(message)).toBeVisible();
  });
});
