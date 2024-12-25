import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ActionButton } from "../src/components/ActionButton";
import { ArrowRight } from "lucide-react";

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

  test("renders the button with an icon", () => {
    render(<ActionButton label="Click Me" icon={<ArrowRight />} />);
    const iconElement = screen.getByTestId("button-icon");
    expect(iconElement).toBeInTheDocument();
  });

  test("applies the correct className", () => {
    render(<ActionButton label="Click Me" className="custom-class" />);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toHaveClass("custom-class");
  });

  test("renders as a link when href id provided", () => {
    render(<ActionButton label="Click Me" href="/login" />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/login");
  });

  test("calls the onClick function when clicked", () => {
    const onClick = jest.fn();
    render(<ActionButton label="Click Me" onClick={onClick} />);
    const buttonElement = screen.getByText(/Click Me/i);
    fireEvent.click(buttonElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("disables the button when disabled is true", () => {
    render(<ActionButton label="Click Me" disabled />);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeDisabled();
  });
});
