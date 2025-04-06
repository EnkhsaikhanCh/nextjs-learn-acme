import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ErrorUI } from "@/components/ErrorUI";

describe("ErrorUI", () => {
  it("renders error UI with correct text", () => {
    render(<ErrorUI />);

    // Check title text
    expect(screen.getByText("Имэйл баталгаажуулалт")).toBeInTheDocument();

    // Check error message
    expect(
      screen.getByText("И-мэйл хаяг оруулаагүй байна. Дахин оролдоно уу."),
    ).toBeInTheDocument();

    // Check hidden "Sign up" label for accessibility
    expect(screen.getByText("Sing up")).toBeInTheDocument();
    expect(screen.getByText("Sing up")).toHaveClass("sr-only");
  });
});
