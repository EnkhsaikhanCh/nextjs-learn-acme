// src/app/(auth)/verify-otp/page.tsx
"use client";

import { Loader, MailCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OTPInput } from "@/components/OTPInput";
import { useOTPVerification } from "./features/useOTPVerification";
import { SuccessMessage } from "@/components/SuccessMessage";
import { LoadingUI } from "@/components/LoadingUI";
import { ErrorUI } from "@/components/ErrorUI";
import { Button } from "@/components/ui/button";

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
    return <LoadingUI />;
  }

  if (!email) {
    return <ErrorUI />;
  }

  return (
    <>
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
                6 оронтой код таны <strong>{email}</strong> хаяг руу илгээгдсэн.
                Код 5 минутын дотор хүчинтэй.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {!success && (
        <Card className="mt-4 text-center shadow-none">
          <CardHeader className="py-4 pt-4 pb-0">
            <CardTitle className="text-md text-foreground/80 font-semibold">
              Баталгаажуулах код хүлээн аваагүй байна уу?
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <Button
              variant="link"
              type="button"
              size={"sm"}
              className={`text-blue-600 transition-opacity hover:underline ${
                isResending || resendTimer > 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              onClick={handleResendOTP}
              disabled={isResending || resendTimer > 0}
            >
              {isResending ? (
                <>
                  Код дахин илгээж байна...
                  <Loader className="h-4 w-4 animate-spin" />
                </>
              ) : resendTimer > 0 ? (
                <>Кодыг дахин илгээх ({resendTimer} сек)</>
              ) : (
                <>Кодыг дахин илгээх</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
