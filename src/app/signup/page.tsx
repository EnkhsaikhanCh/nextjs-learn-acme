"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BaseInput } from "@/components/BaseInput";
import { ActionButton } from "@/components/ActionButton";
import { cn } from "@/lib/utils";
import { Globe, Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { escape } from "validator";
import { useCreateUserMutation } from "@/generated/graphql";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const router = useRouter();

  const sanitizeInput = (input: string) => {
    return escape(input);
  };

  // Input-ыг ариутгах
  const sanitizedEmail = sanitizeInput(email);
  const sanitizedPassword = sanitizeInput(password);
  const [createUser] = useCreateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
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
      const { data } = await createUser({
        variables: {
          input: { email: sanitizedEmail, password: sanitizedPassword },
        },
      });

      if (data?.createUser?.user) {
        toast.success("Account created successfully!");

        // Нэвтрэх функц
        const result = await signIn("credentials", {
          email: sanitizedEmail,
          password: sanitizedPassword,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Login failed after sign up. Please try logging in.");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(
          data?.createUser?.message || "Unexpected response from server.",
        );
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("An error occurred. Please try again.");
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
