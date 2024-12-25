import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ActionButton } from "../src/components/ActionButton";

describe("ActionButton", () => {
  test("renders the button with the correct label", () => {
    render(<ActionButton label="Click Me" />);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("renders the button with a different label", () => {
    render(<ActionButton label="Submit" />);
    const buttonElement = screen.getByText(/Submit/i);
    expect(buttonElement).toBeInTheDocument();
  });
});
