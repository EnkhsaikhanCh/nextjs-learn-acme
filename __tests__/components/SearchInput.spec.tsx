import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "../../src/components/SearchInput";

describe("SearchInput", () => {
  test("renders without crashing", () => {
    render(<SearchInput value="" onChange={() => {}} />);
    const inputElement = screen.getByPlaceholderText("Search...");
    expect(inputElement).toBeInTheDocument();
  });

  test("renders with custom placeholder", () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
        placeholder="Custom search..."
      />,
    );
    const inputElement = screen.getByPlaceholderText("Custom search...");
    expect(inputElement).toBeInTheDocument();
  });

  test("renders search icon", () => {
    const { container } = render(<SearchInput value="" onChange={() => {}} />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const { container } = render(
      <SearchInput value="" onChange={() => {}} className="custom-class" />,
    );
    const divElement = container.firstChild;
    expect(divElement).toHaveClass("custom-class");
  });

  test("displays the correct value", () => {
    render(<SearchInput value="initial value" onChange={() => {}} />);
    const inputElement = screen.getByPlaceholderText("Search...");
    expect(inputElement).toHaveValue("initial value");
  });

  test("handles input change", async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState("");
      return <SearchInput value={value} onChange={setValue} />;
    };
    render(<TestComponent />);
    const inputElement = screen.getByPlaceholderText("Search...");
    await user.type(inputElement, "test");
    expect(inputElement).toHaveValue("test");
  });
});
