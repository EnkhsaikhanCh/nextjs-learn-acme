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
  const [resendTimer, setResendTimer] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Access the query parameters
    setEmail(params.get("email")); // Get the 'email' parameter and set it in state
  }, []);

  // Хуудас дахин ачаалах үед үлдсэн цагийг тооцоолох (expiry timestamp-г ашиглан)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const expiry = localStorage.getItem("resendExpiry");
      if (expiry) {
        const remainingTime = Math.ceil((Number(expiry) - Date.now()) / 1000);
        setResendTimer(remainingTime > 0 ? remainingTime : 0);
      }
    }
  }, []);

  // Countdown хийх: 1 секунд тутамд үлдсэн цагийг шинэчилнэ
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (typeof window !== "undefined") {
              localStorage.removeItem("resendExpiry");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // OTP дахин илгээх
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    // 60 секундийн хугацаатай дуусах цагийг тооцоолоод хадгална
    const expiryTime = Date.now() + 60000;
    localStorage.setItem("resendExpiry", String(expiryTime));
    setResendTimer(60);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(
          "И-мэйл баталгаажуулах кодыг дахин илгээж чадсангүй. Дахин оролдоно уу.",
        );
      }

      toast.success(
        "И-мэйл баталгаажуулах код таны имэйл рүү дахин илгээгдлээ.",
      );
    } catch (error) {
      console.error(error);
      toast.error("И-мэйл баталгаажуулах код дахин илгээхэд алдаа гарлаа.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsVerifying(true);
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("И-мэйл баталгаажуулах 6 оронтой тоо байх ёстой.");
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
        setError(
          data.error || "Код буруу эсвэл баталгаажуулалт амжилтгүй боллоо.",
        );
        toast.error(
          data.error || "Баталгаажуулалт амжилтгүй боллоо. Дахин оролдоно уу.",
        );
      } else {
        setSuccess(true);
        toast.success("Имэйл амжилттай баталгаажлаа!");
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (error) {
      console.error(error);
      setError("Баталгаажуулалт явцад алдаа гарлаа. Дахин оролдоно уу.");
      toast.error("Баталгаажуулалт амжилтгүй боллоо. Дахин оролдоно уу.");
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
                Имэйл баталгаажуулалт
              </CardTitle>
              <CardDescription className="mt-2 text-center text-sm text-gray-600">
                Таны и-мэйл рүү баталгаажуулах код илгээгдсэн.
              </CardDescription>
            </CardHeader>
            <div className="mx-5 mb-5 rounded-md border-2 border-dashed border-yellow-300 bg-yellow-100 px-3 py-2 text-center font-semibold text-yellow-600">
              <p>И-мэйл хаяг оруулаагүй байна. Дахин оролдоно уу.</p>
            </div>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Нэвтрэх хуудас руу буцах
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
          <CardTitle className="mt-6 text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            Имэйл баталгаажуулалт
          </CardTitle>
          <CardDescription className="mt-2 text-center text-sm text-gray-600">
            Таны и-мэйл хаяг руу баталгаажуулах код илгээгдсэн байна.
          </CardDescription>
        </CardHeader>
        {!success ? (
          <>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-center text-center">
                  <OTPInput
                    length={6}
                    onComplete={(value) => setOtp(value)}
                    disabled={isVerifying}
                  />
                </div>
                {error && (
                  <p className="flex items-center justify-center rounded-md border border-yellow-500 bg-yellow-200 px-2 py-2 text-center text-sm font-semibold text-yellow-600">
                    {error}
                  </p>
                )}
                <Button type="submit" disabled={isVerifying} className="w-full">
                  {isVerifying ? (
                    <>
                      Баталгаажуулж байна...
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>Имэйл баталгаажуулах</>
                  )}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Баталгаажуулах код хүлээн аваагүй байна уу?
                <div>
                  <Button
                    variant="link"
                    type="button"
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
                </div>
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
