import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BaseInput } from "../../src/components/BaseInput";

describe("BaseInput", () => {
  test("render the input with correct label", () => {
    render(<BaseInput label="Input" />);

    const inputElement = screen.getByText(/Input/i);
    expect(inputElement).toBeInTheDocument();
  });

  test("renders the input as required when the required prop is true", () => {
    render(<BaseInput label="Password" required />);
    const inputElement = screen.getByLabelText(/Password/i);
    expect(inputElement).toBeRequired();

    const requiredIndicator = screen.getByText("*");
    expect(requiredIndicator).toBeInTheDocument();
  });

  test("displays an error message when the error prop is provided", () => {
    render(<BaseInput label="Email" error="Invalid email address" />);
    const errorMessage = screen.getByText(/Invalid email address/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
