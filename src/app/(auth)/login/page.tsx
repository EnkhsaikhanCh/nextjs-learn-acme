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
import { signIn } from "next-auth/react";
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
      } else {
        toast.success("Тавтай морил! Амжилттай нэвтэрлээ 😊");
        router.push("/dashboard/courses");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center gap-6 bg-muted md:p-10">
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
              <CardTitle className="text-2xl font-bold text-foreground/80 md:text-3xl">
                Тавтай морил
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
                    error={errors.email}
                    autoComplete="email"
                    tabIndex={1}
                  />

                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    errorMessage={errors.password}
                    resetPassword={true}
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
