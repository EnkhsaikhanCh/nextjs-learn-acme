import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { OTPInput } from "@/components/OTPInput";

// Mocking the UI components so we can intercept props and simplify rendering.
jest.mock("../../src/components/ui/input-otp", () => ({
  InputOTP: jest.fn(({ children, ...props }) => (
    <div data-testid="input-otp" {...props}>
      {children}
    </div>
  )),
  InputOTPGroup: jest.fn(({ children, ...props }) => (
    <div data-testid="input-otp-group" {...props}>
      {children}
    </div>
  )),
  InputOTPSlot: jest.fn((props) => (
    <input data-testid="input-otp-slot" {...props} />
  )),
}));

describe("OTPInput Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders correct number of OTP slots", () => {
    const length = 4;
    render(<OTPInput length={length} onComplete={jest.fn()} />);
    // Ensure that InputOTPSlot is rendered "length" times.
    const slots = screen.getAllByTestId("input-otp-slot");
    expect(slots).toHaveLength(length);
  });

  test("applies disabled styling when disabled prop is true", () => {
    render(<OTPInput length={4} onComplete={jest.fn()} disabled />);
    // The InputOTP container should have the disabled styling classes.
    const otpInput = screen.getByTestId("input-otp");
    expect(otpInput).toHaveClass("pointer-events-none opacity-50");
  });

  test("calls onChange when OTP changes", () => {
    const handleChange = jest.fn();
    render(
      <OTPInput length={4} onComplete={jest.fn()} onChange={handleChange} />,
    );
    // Get the props passed to the mocked InputOTP component.
    const { InputOTP } = require("../../src/components/ui/input-otp");
    const otpInputProps = InputOTP.mock.calls[0][0];
    // Simulate an OTP change by calling the onChange callback.
    otpInputProps.onChange("1234");
    expect(handleChange).toHaveBeenCalledWith("1234");
  });

  test("calls onComplete when OTP is complete", () => {
    const handleComplete = jest.fn();
    render(<OTPInput length={4} onComplete={handleComplete} />);
    // Get the props passed to the mocked InputOTP component.
    const { InputOTP } = require("../../src/components/ui/input-otp");
    const otpInputProps = InputOTP.mock.calls[0][0];
    // Simulate the OTP being complete.
    otpInputProps.onComplete("1234");
    expect(handleComplete).toHaveBeenCalledWith("1234");
  });
});
