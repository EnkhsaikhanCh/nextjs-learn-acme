// src/app/login/page.ts
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/ActionButton";
import { BaseInput } from "@/components/BaseInput";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Globe, LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { escape } from "validator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";

interface ErrorState {
  email?: string;
  password?: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorState>({});
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const router = useRouter();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Имэйл хаяг шаардлагатай.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Имэйл хаяг буруу байна.";
    }

    if (!password.trim()) {
      newErrors.password = "Нууц үг шаардлагатай.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Тавтай морил! Амжилттай нэвтэрлээ 😊");
        router.push("/dashboard/courses");
      }
    } catch (error) {
      console.log("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.", error);
      toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted md:p-10">
      <Toaster position="top-center" expand={false} richColors />
      <div className="flex w-full max-w-sm flex-col gap-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Globe className="h-4 w-4" />
          </div>
          Nomad Tech Inc.
        </Link>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="gap-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <LogIn className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-3xl">Тавтай морил</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-6">
                  <BaseInput
                    id="email"
                    type="email"
                    placeholder="hello@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    error={errors.email}
                    autoComplete="email"
                    tabIndex={1}
                  />

                  {/* Password талбарыг боловсруулах */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <Label htmlFor="password" className="font-bold">
                        Password{" "}
                      </Label>
                      <div className="text-sm">
                        <Link
                          href="/forgot-password"
                          className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-500"
                        >
                          Нууц үг сэргээх үү?
                        </Link>
                      </div>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        className={`border bg-gray-50 pe-9 ${errors.password ? "border-red-500" : ""}`}
                        type={isVisible ? "text" : "password"}
                        placeholder="Нууц үгээ оруулна уу"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className={`absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border ${errors.password ? "border-y-red-500 border-r-red-500" : ""} bg-background text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50`}
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
                          <EyeOff
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        ) : (
                          <Eye size={16} strokeWidth={2} aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {errors.password && (
                        <motion.div
                          className="mt-1 w-full rounded-sm bg-red-100 px-2 py-1 text-sm font-semibold text-red-500"
                          role="alert"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 100 }}
                        >
                          {errors.password}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <ActionButton
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-2xl"
                    label={isSubmitting ? "" : "Нэвтрэх"}
                    icon={
                      isSubmitting && (
                        <LoaderCircle className="animate-spin font-semibold" />
                      )
                    }
                  />
                </div>
                <div className="mt-6 text-center text-sm">
                  Шинэ хэрэглэгч үү?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-500"
                  >
                    Бүртгүүлэх
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
