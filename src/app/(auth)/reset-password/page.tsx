// src/app/reset-password/page.tsx
"use client";

import { Toaster } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Globe, KeyRound, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (!data.email) {
          toast.error("Token буруу эсвэл хугацаа дууссан.");
          router.push("/login");
        }
      } catch (error) {
        console.error("Алдаа гарлаа:", error);
        toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    };

    verifyToken();
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    if (!password) {
      setFormError("Нууц үг шаардлагатай.");
      setIsLoading(false);
      return;
    } else if (password.length < 8) {
      setFormError("Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Нууц үгүүд хоорондоо тохирохгүй байна.");
      setIsLoading(false);
      return;
    }

    if (!token) {
      toast.warning("Токен олдсонгүй.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Алдаа гарлаа. Дахин оролдоно уу.");
        toast.error(data.error || "Алдаа гарлаа. Дахин оролдоно уу.");
      } else {
        setSuccess(true);
        toast.success("Нууц үг амжилттай шинэчлэгдсэн.");

        // Redirect to login after success
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Сүлжээний алдаа гарлаа:", err);
      setFormError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
      toast.error("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <main className="flex min-h-svh flex-col items-center gap-6 bg-muted px-4 md:p-10">
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

          <Card className="min-w-[500px] max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground/80">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-purple-500 bg-purple-200">
                  <KeyRound className="h-6 w-6 stroke-[2.5] text-purple-600" />
                  <span className="sr-only">reset password</span>
                </div>
                <p>Нууц үгээ шинэчлэх</p>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Токеныг шалгаж байна гэсэн төлөв */}
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader className="h-8 w-8 animate-spin text-purple-600" />
                <p className="text-sm text-gray-500">Токеныг шалгаж байна...</p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center">
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
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-col items-center gap-6 bg-muted px-4 md:p-10">
      <Toaster richColors position="top-center" />
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

        <Card className="min-w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground/80 md:text-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-purple-500 bg-purple-200">
                <KeyRound className="h-6 w-6 stroke-[2.5] text-purple-600" />
                <span className="sr-only">reset password</span>
              </div>
              <p>Нууц үгээ шинэчлэх</p>
            </CardTitle>
          </CardHeader>

          {!success ? (
            <>
              <CardContent className="pb-3">
                <form onSubmit={handleSubmit}>
                  <p className="mb-4 text-sm text-gray-500">
                    Шинэ нууц үгээ оруулна уу. Нууц үг нь хамгийн багадаа 8
                    тэмдэгттэй байх ёстой.
                  </p>
                  <div className="grid w-full items-center gap-4">
                    <PasswordInput
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label="Шинэ нууц үг"
                      placeholder="••••••••"
                    />

                    <PasswordInput
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      label="Шинэ нууц үг давтах"
                      placeholder="••••••••"
                    />
                  </div>

                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-2 font-semibold text-red-500"
                    >
                      <AlertCircle size={16} />
                      <span className="text-sm">{formError}</span>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="mt-5 w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        Нууц үг шинэчилж байна...
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      "Нууц үг шинэчлэх"
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Нэвтрэх хуудас руу буцах
                </Button>
              </CardFooter>
            </>
          ) : (
            <motion.div>
              <div className="-mt-9 p-6 sm:mx-auto sm:w-full sm:max-w-md">
                <div
                  className="relative rounded border-2 border-green-400 bg-green-100 px-4 py-3 text-center text-green-700"
                  role="alert"
                >
                  <strong className="font-bold">Амжилттай!</strong>
                  <span className="block sm:inline">
                    {" "}
                    Таны нууц үг амжилттай шинэчлэгдлээ. Одоо нэвтрэх боломжтой.
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </main>
  );
}
