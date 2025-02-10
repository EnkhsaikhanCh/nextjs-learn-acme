// src/app/login/page.ts
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/ActionButton";
import { BaseInput } from "@/components/BaseInput";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Globe, Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { escape } from "validator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const sanitizeInput = (input: string) => {
    return escape(input);
  };

  // Input-ыг ариутгах
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPassword = sanitizeInput(password);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form validation
    const newErrors: { email?: string; password?: string } = {};

    if (!sanitizedEmail) {
      newErrors.email = "Имэйл хаяг шаардлагатай.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Имэйл хаяг буруу байна.";
    }

    if (!sanitizedPassword) {
      newErrors.password = "Нууц үг шаардлагатай.";
    } else if (password.length < 8) {
      newErrors.password = "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.";
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
        redirect: false, // Redirect хийхгүй
      });

      if (result?.error) {
        toast.error(`${result.error}`);
      } else {
        toast.success("Тавтай морил! Та амжилттай нэвтэрлээ 😊");
        router.push("/dashboard");
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
      <div className="flex w-full max-w-sm flex-col gap-6">
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
          <Card className="rounded-none sm:rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Нэвтрэх</CardTitle>
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

                  {/* Password field */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <Label htmlFor={password} className="font-bold">
                        Password{" "}
                      </Label>
                      <div className="text-sm">
                        <Link
                          href="/forgot-password"
                          className="cursor-pointer text-sm underline underline-offset-4 hover:text-blue-600"
                        >
                          Нууц үг сэргээх үү?
                        </Link>
                      </div>
                    </div>
                    <div className="relative">
                      <Input
                        id={password}
                        className="border bg-gray-50 pe-9"
                        type={isVisible ? "text" : "password"}
                        placeholder="Нууц үгээ оруулна уу"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
                  </div>

                  <ActionButton
                    type="submit"
                    disabled={isSubmitting}
                    label={
                      isSubmitting
                        ? "Нэвтрэхийг баталгаажуулж байна..."
                        : "Нэвтрэх"
                    }
                    icon={
                      isSubmitting ? (
                        <Loader className="animate-spin font-semibold" />
                      ) : null
                    }
                  />
                </div>
                <div className="mt-4 text-center text-sm">
                  Шинэ хэрэглэгч үү?{" "}
                  <Link
                    href="/signup"
                    className="underline underline-offset-4 hover:text-blue-600"
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
