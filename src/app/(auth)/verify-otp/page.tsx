// src/app/(auth)/verify-otp/page.tsx
"use client";

import { Toaster } from "sonner";
import { VerifyOtpForm } from "./_components/VerifyOtpForm";

export default function VerifyOTP() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-2 py-12 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <VerifyOtpForm />
    </main>
  );
}
