// src/app/(auth)/verify-otp/page.tsx
"use client";

import { LoadingUI } from "./_components/LoadingUI";
import { ErrorUI } from "./_components/ErrorUI";
import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Loader, MailCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPInput } from "@/components/OTPInput";
import { ResendSection } from "./_components/ResendSection";
import { useOTPVerification } from "./_features/useOTPVerification";
import { SuccessMessage } from "@/components/SuccessMessage";

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

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-2 py-12 sm:px-6 lg:px-8">
        <LoadingUI />
      </main>
    );
  }

  if (!email) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-2 py-12 sm:px-6 lg:px-8">
        <ErrorUI />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-2 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <Globe className="h-4 w-4" />
          </div>
          OXON
        </Link>

        <Card className="max-w-md min-w-full shadow-none">
          <CardHeader>
            <CardTitle className="text-foreground/80 flex items-center gap-3 text-2xl font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-teal-500 bg-teal-200">
                <MailCheck className="h-6 w-6 stroke-[2.5] text-teal-600" />
                <span className="sr-only">Sign up</span>
              </div>
              <p>Имэйл баталгаажуулалт</p>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {success ? (
              <SuccessMessage description="Таны баталгаажуулалт амжилттай боллоо. Тун удахгүй таныг удирдлагын самбар руу шилжүүлнэ..." />
            ) : (
              <>
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
                <p className="text-foreground/60 mt-4 text-center text-sm">
                  6 оронтой код таны <strong>{email}</strong> хаяг руу
                  илгээгдсэн. Код 5 минутын дотор хүчинтэй.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {!success && (
          <ResendSection
            resendTimer={resendTimer}
            onResend={handleResendOTP}
            isResending={isResending}
          />
        )}
      </motion.div>
    </main>
  );
}
