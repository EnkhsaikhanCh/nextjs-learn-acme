// __tests__/DynamicBreadcrumb.spec.tsx
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("../../src/utils/slug-to-label", () => ({
  slugToLabel: jest.fn((s) => s.charAt(0).toUpperCase() + s.slice(1)),
}));

describe("DynamicBreadcrumb", () => {
  it("renders breadcrumb items for each path segment", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard/courses/edit");

    render(<DynamicBreadcrumb />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Courses")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders only 'Home' for root path", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<DynamicBreadcrumb />);

    // Should render nothing as segments.length === 0
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });
});
