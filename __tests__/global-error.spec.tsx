// __tests__/global-error.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import * as Sentry from "@sentry/nextjs";
import GlobalError from "@/app/global-error";

// Mock Sentry
jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));

// Mock NextError to render a simple fallback
jest.mock("next/error", () => {
  return function MockNextError({ statusCode }: { statusCode: number }) {
    return <div>Mocked NextError with status: {statusCode}</div>;
  };
});

describe("GlobalError", () => {
  it("should call Sentry.captureException with the error", () => {
    const testError = new Error("Test error");

    render(<GlobalError error={testError} />);

    expect(Sentry.captureException).toHaveBeenCalledWith(testError);
  });

  it("should render the NextError component", () => {
    const { getByText } = render(<GlobalError error={new Error("Oops")} />);
    expect(getByText(/Mocked NextError/)).toBeInTheDocument();
  });
});
