import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { SuccessMessage } from "@/components/SuccessMessage";

describe("SuccessMessage", () => {
  it("renders the success message with description", () => {
    const testDescription = "Таны бүртгэл амжилттай боллоо!";
    render(<SuccessMessage description={testDescription} />);

    // Checks static success text
    expect(screen.getByText("Амжилттай!")).toBeInTheDocument();

    // Checks dynamic description
    expect(screen.getByText(testDescription)).toBeInTheDocument();

    // Optional: check the alert role exists
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
