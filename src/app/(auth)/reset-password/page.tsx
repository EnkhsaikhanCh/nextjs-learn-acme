// src/app/reset-password/page.tsx
"use client";

export const dynamic = "force-dynamic";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Loader, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import Link from "next/link";

function ResetPasswordForm({
  token,
  setSuccess,
}: {
  token: string | null;
  setSuccess: (value: boolean) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Нууц үгүүд хоорондоо тохирохгүй байна.");
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
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Алдаа гарлаа. Дахин оролдоно уу.");
        toast.error(data.error || "Алдаа гарлаа. Дахин оролдоно уу.");
      } else {
        setSuccess(true);
        toast.success("Нууц үг амжилттай шинэчлэгдсэн.");
      }
    } catch (err) {
      console.error("Сүлжээний алдаа гарлаа:", err);
      setError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
      toast.error("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="mx-5 mb-5 rounded-md border border-yellow-300 bg-yellow-100 py-1 text-center font-semibold text-yellow-600">
        <p>Токен байхгүй байна. Холбоосыг шалгана уу.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent>
        <div className="grid w-full items-center gap-6">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password" className="font-semibold">
              Шинэ нууц үг
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Шинэ нууц үгээ оруулна уу"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="confirmPassword" className="font-semibold">
              Шинэ нууц үгээ баталгаажуулна уу
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Шинэ нууц үгээ давтаж оруулна уу"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-red-500"
          >
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          className="group relative flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
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
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/login")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Нэвтрэх хуудас руу буцах
        </Button>
      </CardFooter>
    </form>
  );
}

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-2 py-12 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <Suspense fallback={<div>Ачааллаж байна...</div>}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="min-w-full max-w-md sm:w-[460px]">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Нууц үгээ шинэчлэх
              </CardTitle>
              <CardDescription className="mt-2 text-center text-sm text-gray-600">
                Доорх талбарт шинэ нууц үгээ оруулна уу.
              </CardDescription>
            </CardHeader>
            {!success ? (
              <ResetPasswordForm token={token} setSuccess={setSuccess} />
            ) : (
              <div className="flex flex-col p-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button className="flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
                    <Link href={"/login"}>Нэвтрэх</Link>
                  </Button>
                </motion.div>
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
                        Таны нууц үг амжилттай шинэчлэгдлээ. Одоо нэвтрэх
                        боломжтой.
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </Card>
        </motion.div>
      </Suspense>
    </main>
  );
}
