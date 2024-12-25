import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AcmeLogo } from "../src/components/AcmeLogo";

describe("AcmeLogo", () => {
  test("renders the logo with the correct text", () => {
    render(<AcmeLogo />);
    const logoText = screen.getByText(/Acme/i);
    expect(logoText).toBeInTheDocument();
  });

  test("renders the Globe icon", () => {
    render(<AcmeLogo />);
    const globeIcon = screen.getByTestId("logo-icon");
    expect(globeIcon).toBeInTheDocument();
  });
});
