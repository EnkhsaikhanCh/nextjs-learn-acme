"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { OTPInput } from "@/components/otp-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Loader, MailCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function VerifyOtpForm() {
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const router = useRouter();

  // Хуудас ачаалахад tempToken-оос имэйлийг авах
  useEffect(() => {
    const tempToken = localStorage.getItem("tempToken");
    if (tempToken) {
      setIsLoading(true);
      fetch("/api/auth/get-email-from-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tempToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            setEmail(data.email);
          } else {
            localStorage.removeItem("tempToken");
            router.push("/login");
          }
        })
        .catch(() => router.push("/login"))
        .finally(() => setIsLoading(false));
    } else {
      router.push("/login");
    }
  }, [router]);

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

  const handleSubmit = async () => {
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
        setError(data.error || "Код буруу байна.");
        toast.error(data.error || "Баталгаажуулалт амжилтгүй боллоо.");
      } else {
        setSuccess(true);
        setOtp("");
        toast.success("Имэйл амжилттай баталгаажлаа!");

        // Use signInToken to sign in
        const result = await signIn("credentials", {
          redirect: false,
          email,
          signInToken: data.signInToken,
        });

        if (result?.error) {
          toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
          router.push("/login");
          setIsVerifying(false);
          return;
        } else {
          localStorage.removeItem("tempToken");
          localStorage.removeItem("resendExpiry");
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Баталгаажуулалт явцад алдаа гарлаа. Дахин оролдоно уу.");
      toast.error("Баталгаажуулалт амжилтгүй боллоо. Дахин оролдоно уу.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Ачаалж байгаа төлөв
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
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
        <Card className="min-w-full max-w-md sm:w-[460px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-teal-500 bg-teal-200">
                <MailCheck className="h-6 w-6 stroke-[2.5] text-teal-600" />
                <span className="sr-only">Sing up</span>
              </div>
              <p>Имэйл баталгаажуулалт</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-teal-600" />
              <p className="ml-2 text-foreground/60">Ачаалж байна...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!email) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
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
          <Card className="min-w-full max-w-md sm:w-[460px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground/80">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-teal-500 bg-teal-200">
                  <MailCheck className="h-6 w-6 stroke-[2.5] text-teal-600" />
                  <span className="sr-only">Sing up</span>
                </div>
                <p>Имэйл баталгаажуулалт</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border-2 border-dashed border-yellow-500 bg-yellow-200 px-3 py-2 text-center font-semibold text-yellow-600">
                <p>И-мэйл хаяг оруулаагүй байна. Дахин оролдоно уу.</p>
              </div>
            </CardContent>
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
      <Link
        href="/"
        className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Globe className="h-4 w-4" />
        </div>
        OXON
      </Link>
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
              <strong>{email}</strong> хаяг руу 6 оронтой баталгаажуулах код
              илгээсэн.
            </p>
          </CardContent>
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

      {!success && (
        <Card className="mt-4 text-center shadow-none">
          <CardHeader className="py-4 pb-0 pt-4">
            <CardTitle className="text-md font-semibold text-foreground/80">
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
    </motion.div>
  );
}
