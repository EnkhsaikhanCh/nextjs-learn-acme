"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { OTPInput } from "@/components/otp-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader, RectangleEllipsis } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VerifyOtpForm() {
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Access the query parameters
    setEmail(params.get("email")); // Get the 'email' parameter and set it in state
  }, []);

  // Resend OTP
  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend OTP. Please try again.");
      }

      toast.success("OTP code has been resent to your email.");
    } catch (error) {
      console.error(error);
      toast.error("Error resending OTP.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsVerifying(true);
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be a 6-digit numeric code.");
      setIsVerifying(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid OTP or verification failed.");
        toast.error(data.error || "Verification failed. Please try again.");
      } else {
        setSuccess(true);
        toast.success("Email verified successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while verifying OTP. Please try again.");
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!email) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="min-w-full max-w-md sm:w-[460px]">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <RectangleEllipsis className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Verify Your OTP
              </CardTitle>
              <CardDescription className="mt-2 text-center text-sm text-gray-600">
                We have sent a 6-digit code to your email
              </CardDescription>
            </CardHeader>
            <div className="mx-5 mb-5 rounded-md border-2 border-dashed border-yellow-300 bg-yellow-100 px-3 py-2 text-center font-semibold text-yellow-600">
              <p>Email not provided. Please try again.</p>
            </div>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="min-w-full max-w-md sm:w-[460px]">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <RectangleEllipsis className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your OTP
          </CardTitle>
          <CardDescription className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to your email address.
          </CardDescription>
        </CardHeader>
        {!success ? (
          <>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <OTPInput length={6} onComplete={(value) => setOtp(value)} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={isVerifying} className="w-full">
                  {isVerifying ? (
                    <>
                      Verifying...
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>Verify OTP</>
                  )}
                </Button>
              </form>
              <div className="mt-3 text-center text-sm">
                Did not receive the code?{" "}
                <Button
                  variant="link"
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={handleResendOTP}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      Resending...
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>Resend OTP</>
                  )}
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col p-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                <div
                  className="relative rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
                  role="alert"
                >
                  <strong className="font-bold">Амжилттай!</strong>
                  <span className="block sm:inline">
                    {" "}
                    Таны имайл хаяг амжилттай баталгаажлаа. Одоо та нэвтрэх
                    боломжтой.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
