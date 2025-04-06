import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { LoadingUI } from "@/components/LoadingUI";

describe("LoadingUI", () => {
  it("renders the loading UI correctly", () => {
    render(<LoadingUI />);

    // Verify header text is rendered
    expect(screen.getByText("Имэйл баталгаажуулалт")).toBeInTheDocument();

    // Verify the accessibility text for the icon is rendered (even if visually hidden)
    expect(screen.getByText("Sing up")).toBeInTheDocument();
    expect(screen.getByText("Sing up")).toHaveClass("sr-only");

    // Verify the loading message is rendered
    expect(screen.getByText("Ачаалж байна...")).toBeInTheDocument();
  });
});
