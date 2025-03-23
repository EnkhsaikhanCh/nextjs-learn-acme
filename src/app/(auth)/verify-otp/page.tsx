// src/app/(auth)/verify-otp/page.tsx
"use client";

import { Toaster } from "sonner";
import { LoadingUI } from "./_components/LoadingUI";
import { ErrorUI } from "./_components/ErrorUI";
import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Loader, MailCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPInput } from "@/components/OTPInput";
import { ResendSection } from "./_components/ResendSection";
import { SuccessMessage } from "./_components/SuccessMessage";
import { useOTPVerification } from "./_features/useOTPVerification";

export default function VerifyOTP() {
  const {
    email,
    otp,
    setOtp,
    error,
    setError,
    isLoading,
    isVerifying,
    isResending,
    success,
    resendTimer,
    handleSubmit,
    handleResendOTP,
  } = useOTPVerification();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-2 py-12 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Globe className="h-4 w-4" />
          </div>
          OXON
        </Link>
        {isLoading && <LoadingUI />}
        {!email && !isLoading && <ErrorUI />}

        {email && (
          <>
            <Card className="min-w-full max-w-md shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground/80">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-teal-500 bg-teal-200">
                    <MailCheck className="h-6 w-6 stroke-[2.5] text-teal-600" />
                    <span className="sr-only">Sing up</span>
                  </div>
                  <p>Имэйл баталгаажуулалт</p>
                </CardTitle>
              </CardHeader>
              {!success ? (
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                      {!isVerifying ? (
                        <OTPInput
                          length={6}
                          onComplete={(value) => {
                            setOtp(value);
                            handleSubmit();
                          }}
                          disabled={isVerifying}
                          isError={!!error}
                          onChange={(value) => {
                            setOtp(value);
                            setError("");
                          }}
                          value={otp}
                        />
                      ) : (
                        <div className="flex h-14 items-center justify-center">
                          <Loader className="h-8 w-8 animate-spin text-teal-600" />
                        </div>
                      )}
                    </div>
                  </form>
                  <p className="mt-4 text-center text-sm text-foreground/60">
                    6 оронтой код таны <strong>{email}</strong> хаяг руу
                    илгээгдсэн. Код 5 минутын дотор хүчинтэй.
                  </p>
                </CardContent>
              ) : (
                <SuccessMessage />
              )}
            </Card>

            {!success && (
              <ResendSection
                resendTimer={resendTimer}
                onResend={handleResendOTP}
                isResending={isResending}
              />
            )}
          </>
        )}
      </motion.div>
    </main>
  );
}
