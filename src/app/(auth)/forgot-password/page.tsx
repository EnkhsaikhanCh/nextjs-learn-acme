// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Globe, KeyRound, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { sanitizeInput } from "@/utils/sanitize";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    // Sanitize and validate email
    const sanitizedEmail = sanitizeInput(email);
    if (!sanitizedEmail) {
      setFormError("Имэйл хаяг шаардлагатай.");
      setIsLoading(false);
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      setFormError("Имэйл хаяг буруу байна.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Алдаа гарлаа. Дахин оролдоно уу.");
      } else {
        setSuccess(true);
        toast.success("Таны и-мэйл хаяг руу холбоос амжилттай илгээгдлээ.");
      }
    } catch (error) {
      toast.error(`Сүлжээний алдаа гарлаа: ${error}`);
      setFormError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Card */}
        <Card className="min-w-full max-w-md">
          {/* Card Header */}
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-amber-500 bg-amber-200">
                <KeyRound className="h-6 w-6 stroke-[2.5] text-amber-600" />
                <span className="sr-only">forgot password</span>
              </div>
              <p>Нууц үгээ мартсан уу?</p>
            </CardTitle>
          </CardHeader>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="font-semibold">
                    Имэйл
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="hello@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Имэйл хаягаа оруулна уу. Бид таны имэйл рүү нууц үг сэргээх
                    холбоос илгээх болно.
                  </p>
                </div>
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
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Холбоос илгээж байна...
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Холбоос илгээх"
                )}
              </Button>
              <Link href="/login" className="w-full">
                <Button type="button" variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Нэвтрэх хуудас руу буцах
                </Button>
              </Link>
            </CardFooter>
          </form>
          {success && (
            <motion.div>
              <div className="-mt-9 p-6 sm:mx-auto sm:w-full sm:max-w-md">
                <div
                  className="relative rounded border-2 border-green-400 bg-green-100 px-4 py-3 text-center text-green-700"
                  role="alert"
                >
                  <strong className="font-bold">Амжилттай!</strong>
                  <span className="block sm:inline">
                    {" "}
                    Таны и-мэйл хаяг руу холбоос амжилттай илгээгдлээ.
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
