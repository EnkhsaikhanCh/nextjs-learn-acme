// src/app/reset-password/page.tsx
"use client";

import { Toaster } from "sonner";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-2 py-12 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <ResetPasswordForm />
    </main>
  );
}
