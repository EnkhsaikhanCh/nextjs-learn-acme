import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SideNav } from "@/components/dashboard/sidebar/SideNav";
import { SidebarProvider } from "@/components/ui/sidebar";

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("SideNav", () => {
  test("renders the user information", () => {
    render(
      <SidebarProvider>
        <SideNav />
      </SidebarProvider>,
    );

    const userName = screen.getByText(/shadcn/i);
    const userEmail = screen.getByText(/m@example.com/i);

    expect(userName).toBeInTheDocument();
    expect(userEmail).toBeInTheDocument();
  });

  test("renders the NavLinks component", () => {
    render(
      <SidebarProvider>
        <SideNav />
      </SidebarProvider>,
    );

    const navLinks = screen.getByText(/Invoices/i);

    expect(navLinks).toBeInTheDocument();
  });
});
