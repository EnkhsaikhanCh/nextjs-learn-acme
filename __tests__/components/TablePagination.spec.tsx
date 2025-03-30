// TablePagination.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TablePagination } from "@/components/TablePagination";

describe("TablePagination component", () => {
  const totalCount = 50;
  const limit = 10;

  it("disables the previous button on the first page and displays correct pagination text", () => {
    const handlePageChange = jest.fn();
    render(
      <TablePagination
        offset={0}
        limit={limit}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />,
    );

    // The component renders two buttons: first for "previous", second for "next".
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled(); // previous should be disabled when offset is 0
    expect(buttons[1]).not.toBeDisabled();
    expect(screen.getByText("Showing 1–10 of 50")).toBeInTheDocument();
  });

  it("disables the next button on the last page and displays correct pagination text", () => {
    const handlePageChange = jest.fn();
    // When offset + limit equals totalCount, you're on the last page.
    render(
      <TablePagination
        offset={40}
        limit={limit}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).not.toBeDisabled();
    expect(buttons[1]).toBeDisabled(); // next should be disabled when no more pages exist
    expect(screen.getByText("Showing 41–50 of 50")).toBeInTheDocument();
  });

  it("calls onPageChange with the correct offset when buttons are clicked", () => {
    const handlePageChange = jest.fn();
    // Set offset to 10 so that both buttons are enabled.
    render(
      <TablePagination
        offset={10}
        limit={limit}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />,
    );

    const buttons = screen.getAllByRole("button");

    // Clicking the previous button should subtract limit (Math.max ensures no negative value).
    fireEvent.click(buttons[0]);
    expect(handlePageChange).toHaveBeenCalledWith(0); // 10 - 10 = 0

    // Clicking the next button should add limit.
    fireEvent.click(buttons[1]);
    expect(handlePageChange).toHaveBeenCalledWith(20); // 10 + 10 = 20
  });
});
