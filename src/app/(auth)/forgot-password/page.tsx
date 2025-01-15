// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Loader, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Алдаа гарлаа. Дахин оролдоно уу.");
      } else {
        setSuccess(true);
      }
    } catch (error) {
      toast.error(`Алдаа гарлаа. Дахин оролдоно уу: ${error}`);
      setError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-2 py-12 sm:px-6 md:px-4 lg:px-8">
        <Toaster richColors position="top-center" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-mds w-full">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Нууц үгээ мартсан уу?
              </CardTitle>
              <CardDescription className="mt-2 text-center text-sm text-gray-600">
                Таны и-мэйл хаяг руу нууц үг сэргээх холбоос илгээх болно.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email" className="font-semibold">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="Таны и-мэйл хаяг"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 font-semibold text-red-500"
                  >
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      Холбоос илгээж байна...
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Холбоос илгээх"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex w-full flex-col"
                >
                  <Link
                    href={"/login"}
                    className="flex flex-row items-center justify-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Нэвтрэх хуудас руу буцах
                  </Link>
                </Button>
              </CardFooter>
            </form>
            {success && (
              <motion.div>
                <div className="-mt-5 p-6 sm:mx-auto sm:w-full sm:max-w-md">
                  <div
                    className="relative rounded border-2 border-dashed border-green-400 bg-green-100 px-4 py-3 text-center text-green-700"
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
    </>
  );
}
