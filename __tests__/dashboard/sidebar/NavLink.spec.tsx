import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NavLinks } from "@/components/dashboard/sidebar/NavLinks";

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

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("NavLinks", () => {
  test("renders the correct links", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    render(
      <SidebarProvider>
        <NavLinks />
      </SidebarProvider>,
    );

    const dashboardLink = screen.getByText(/Dashboard/i);
    const invoicesLink = screen.getByText(/Invoices/i);
    const costumersLink = screen.getByText(/Costumers/i);

    expect(dashboardLink).toBeInTheDocument();
    expect(invoicesLink).toBeInTheDocument();
    expect(costumersLink).toBeInTheDocument();
  });

  test("applies active class to the current path", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard/invoices");

    render(
      <SidebarProvider>
        <NavLinks />
      </SidebarProvider>,
    );

    const invoicesLink = screen.getByTestId("sidebar-menu-button Invoices");

    expect(invoicesLink).toHaveClass(
      "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
    );
  });

  test("applies hover class to non-active links", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    render(
      <SidebarProvider>
        <NavLinks />
      </SidebarProvider>,
    );

    const invoicesLink = screen.getByTestId("sidebar-menu-button Invoices");

    expect(invoicesLink).toBeInTheDocument();
  });
});
