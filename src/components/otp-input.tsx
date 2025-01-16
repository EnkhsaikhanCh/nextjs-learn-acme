import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
}

export function OTPInput({ length, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    element: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (isNaN(Number(element.target.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.target.value.substring(
      element.target.value.length - 1,
    );
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (element.target.value !== "" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((v) => v !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < length && !isNaN(Number(pastedData[i]))) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    if (newOtp.every((v) => v !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {otp.map((digit, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Input
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(input) => {
              inputRefs.current[index] = input;
            }}
            className="h-14 w-14 text-center text-2xl font-bold"
            aria-label={`Digit ${index + 1}`}
          />
        </motion.div>
      ))}
    </div>
  );
}
