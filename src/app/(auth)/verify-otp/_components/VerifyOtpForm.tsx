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

  // OTP дахин илгээх
  const handleResendOTP = async () => {
    setIsResending(true);
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
          <CardTitle className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Имэйл баталгаажуулалт
          </CardTitle>
          <CardDescription className="mt-2 text-center text-sm text-gray-600">
            Баталгаажуулах кодыг оруулна уу.
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
                      Баталгаажуулж байна...
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>Имэйл баталгаажуулах</>
                  )}
                </Button>
              </form>
              <div className="mt-3 text-center text-sm">
                Баталгаажуулах код хүлээн аваагүй байна уу?{" "}
                <Button
                  variant="link"
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={handleResendOTP}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      Дахин илгээж байна...
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>Дахин илгээх</>
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
