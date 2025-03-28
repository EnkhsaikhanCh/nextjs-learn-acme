// SortSelect.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { SortSelect } from "@/components/SortSelect";

describe("SortSelect component", () => {
  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  it("renders the placeholder when no value is selected", () => {
    render(
      <SortSelect
        value=""
        onChange={jest.fn()}
        options={options}
        placeholder="Sort by"
      />,
    );
    expect(screen.getByText("Sort by")).toBeInTheDocument();
  });

  it("displays all options when the select is triggered", () => {
    render(
      <SortSelect
        value=""
        onChange={jest.fn()}
        options={options}
        placeholder="Sort by"
      />,
    );
    const trigger = screen.getByTestId("sort-select-trigger");
    fireEvent.click(trigger);

    // Check that each option is rendered
    options.forEach((opt) => {
      expect(screen.getByText(opt.label)).toBeInTheDocument();
    });
  });

  it("calls onChange with the correct value when an option is selected", () => {
    const handleChange = jest.fn();
    render(
      <SortSelect
        value=""
        onChange={handleChange}
        options={options}
        placeholder="Sort by"
      />,
    );
    const trigger = screen.getByTestId("sort-select-trigger");
    fireEvent.click(trigger);

    // Simulate clicking on the first option
    fireEvent.click(screen.getByText("Option 1"));
    expect(handleChange).toHaveBeenCalledWith("option1");
  });
});
