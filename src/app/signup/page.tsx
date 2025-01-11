"use client";

import { ActionButton } from "@/components/ActionButton";
import { BaseInput } from "@/components/BaseInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Globe, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignUp() {
  const { signup, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form validation
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Имэйл оруулах шаардлагатай.";
    }
    if (!password) {
      newErrors.password = "Нууц үг оруулах шаардлагатай.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const isSuccess = await signup(email, password);
      if (isSuccess) {
        toast.success("Бүртгэл амжилттай үүсгэгдлээ!");
        router.push("dashboard");
      }
    } catch (error) {
      toast.error(`Алдаа гарлаа. Дахин оролдоно уу: ${error}`);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
              <CardTitle className="text-xl">Бүртгэл үүсгэх</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    {/* Email Input */}
                    <BaseInput
                      id="email"
                      type="email"
                      placeholder="hello@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      label="Email"
                      error={errors.email}
                      autoComplete="email"
                    />

                    {/* Password Input */}
                    <BaseInput
                      id="password"
                      type="password"
                      placeholder="Нууц үгээ оруулна уу"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label="Password"
                      error={errors.password}
                      description="Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой"
                    />

                    {/* Sign up button */}
                    <ActionButton
                      type="submit"
                      disabled={isSubmitting}
                      label={
                        isSubmitting
                          ? "Бүртгэл үүсгэж байна..."
                          : "Бүртгэл үүсгэх"
                      }
                      icon={
                        isSubmitting ? (
                          <Loader className="animate-spin font-semibold" />
                        ) : null
                      }
                    />
                  </div>

                  {/* Signin */}
                  <div className="text-center text-sm">
                    Бүртгэлтэй хэрэглэгч үү?{" "}
                    <Link
                      href="/login"
                      className="underline underline-offset-4"
                    >
                      Нэвтрэх
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
