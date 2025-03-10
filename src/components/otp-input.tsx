import React from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

export function OTPInput({ length, onComplete, disabled }: OTPInputProps) {
  return (
    <InputOTP
      maxLength={length}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      onComplete={(otp) => onComplete(otp)} // Callback when OTP is fully entered
      aria-label="OTP input"
      className={disabled ? "pointer-events-none opacity-50" : ""}
    >
      <InputOTPGroup className="flex w-full justify-between">
        {Array.from({ length }, (_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="h-12 w-12 rounded-sm text-lg font-semibold ring-teal-100 md:h-14 md:w-14 md:text-xl"
            autoFocus={index === 0}
            inputMode="numeric"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
