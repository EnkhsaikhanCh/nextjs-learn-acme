// src/app/login/page.ts
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/ActionButton";
import { BaseInput } from "@/components/BaseInput";
import { cn } from "@/lib/utils";
import { Globe, LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/PasswordInput";

interface ErrorState {
  email?: string;
  password?: string;
}

const validateForm = (email: string, password: string): ErrorState => {
  const errors: ErrorState = {};

  if (!email.trim()) {
    errors.email = "Имэйл хаяг шаардлагатай.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Имэйл хаяг буруу байна.";
  }

  if (!password.trim()) {
    errors.password = "Нууц үг шаардлагатай.";
  }

  return errors;
};

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorState>({});

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
        toast.error("Имэйл эсвэл нууц үг буруу байна.");
        console.error(result.error);
      } else {
        const session = await getSession();

        if (!session || !session.user?.role) {
          toast.error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
          return;
        }

        // Баталгаажаагүй эсэхийг шалгах
        if (!session.user.isVerified) {
          // Токен үүсгэх
          const tokenResponse = await fetch("/api/auth/generate-temp-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
          });

          if (!tokenResponse.ok) {
            throw new Error("Токен үүсгэхэд алдаа гарлаа.");
          }

          const { token } = await tokenResponse.json();
          localStorage.setItem("tempToken", token);

          // OTP илгээх
          const otpResponse = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
          });

          if (!otpResponse.ok) {
            throw new Error("OTP илгээхэд алдаа гарлаа.");
          }

          toast.success("OTP код амжилттай илгээгдлээ!");
          router.push("/verify-otp");
          return; // Эндээс гарах
        }

        const userRole = session.user.role;

        toast.success("Амжилттай нэвтэрлээ", {
          description: "Таныг системд нэвтрүүлж байна...",
          duration: 3000,
        });

        if (userRole.toUpperCase() === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard/courses");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center gap-6 bg-muted px-4 md:p-10">
      <Toaster position="top-center" expand={false} richColors />
      <div className="flex w-full max-w-sm flex-col gap-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-semibold text-foreground/90"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Globe className="h-4 w-4" />
          </div>
          OXON
        </Link>
        <div className={cn("flex flex-col gap-3")}>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground/80">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-blue-500 bg-blue-200">
                  <LogIn className="h-5 w-5 stroke-[2.5] text-blue-600" />
                  <span className="sr-only">Log in</span>
                </div>
                <p>Нэвтрэх</p>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-6">
                  <BaseInput
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Имэйл"
                    placeholder="welcome@mail.com"
                    error={errors.email}
                    autoComplete="email"
                    tabIndex={1}
                  />

                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    errorMessage={errors.password}
                  />

                  <ActionButton
                    type="submit"
                    disabled={isSubmitting}
                    label={isSubmitting ? "" : "Нэвтрэх"}
                    icon={
                      isSubmitting && (
                        <LoaderCircle className="animate-spin font-semibold" />
                      )
                    }
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="py-4">
              <div className="flex justify-center gap-2 text-center font-semibold">
                <p className="text-foreground/80">Шинэ хэрэглэгч үү?</p>
                <Link
                  href="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
