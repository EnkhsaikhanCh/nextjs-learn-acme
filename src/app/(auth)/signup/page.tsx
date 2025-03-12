"use client";

import { CheckIcon, Globe, LoaderCircle, User, XIcon } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { escape } from "validator";
import { useCreateUserMutation } from "@/generated/graphql";
import { BaseInput } from "@/components/BaseInput";
import { ActionButton } from "@/components/ActionButton";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const [createUser] = useCreateUserMutation();

  const passwordRequirements = [
    { regex: /.{8,}/, text: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой" },
  ];

  const strength = passwordRequirements.map((req) => ({
    valid: req.regex.test(password),
    text: req.text,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: { email?: string; password?: string } = {};

    // Имэйл болон нууц үг шалгах
    if (!sanitizedEmail) {
      newErrors.email = "Имэйл хаяг шаардлагатай.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Имэйл хаяг буруу байна.";
    }

    if (!password) {
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
      // Бүртгэл үүсгэх
      const { data } = await createUser({
        variables: {
          input: { email: sanitizedEmail, password },
        },
      });

      if (data?.createUser?.user) {
        // OTP илгээх
        const otpResponse = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: sanitizedEmail }),
        });

        if (!otpResponse.ok) {
          throw new Error("OTP илгээхэд алдаа гарлаа.");
        }

        toast.success("OTP код амжилттай илгээгдлээ!");

        localStorage.setItem("userEmail", sanitizedEmail);
        router.push("/verify-otp");
      } else {
        toast.error(
          data?.createUser?.message || "Серверээс буруу хариу ирлээ.",
        );
      }
    } catch (error) {
      console.error("Бүртгэл үүсгэхэд алдаа гарлаа:", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-700 to-zinc-600" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-20 flex h-full flex-col items-center justify-between p-8 text-white">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold">
            <Globe className="h-6 w-6" />
            OXON
          </Link>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome to Nomad Tech</h2>
            <p className="mt-2 text-lg">Your journey starts here</p>
          </div>
          <p className="text-sm"></p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 bg-gray-50 p-4 sm:p-8">
        <Toaster position="top-right" richColors expand={false} />

        <Link
          href="/"
          className="mb-3 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Globe className="h-4 w-4" />
          </div>
          OXON
        </Link>

        <Card className="w-full max-w-md shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-green-500 bg-green-200">
                <User className="h-6 w-6 stroke-[2.5] text-green-600" />
                <span className="sr-only">Sing up</span>
              </div>
              <p>Шинэ бүртгэл үүсгэх</p>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Доорх мэдээллийг бөглөж бүртгэлээ үүсгэнэ үү
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              method="POST"
              className="flex flex-col gap-5 md:gap-7"
            >
              <BaseInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Имэйл"
                error={errors.email}
                autoComplete="email"
                placeholder="welcome@email.com"
              />

              <div className="space-y-2">
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  errorMessage={errors.password}
                  autoComplete="new-password"
                />

                <ul className="">
                  {strength.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs">
                      {req.valid ? (
                        <CheckIcon size={16} className="text-green-500" />
                      ) : (
                        <XIcon size={16} className="text-muted-foreground/80" />
                      )}
                      <span
                        className={
                          req.valid ? "text-green-500" : "text-muted-foreground"
                        }
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <ActionButton
                type="submit"
                disabled={isSubmitting}
                label={isSubmitting ? "" : "Бүртгэл үүсгэх"}
                icon={
                  isSubmitting ? (
                    <LoaderCircle className="animate-spin font-semibold" />
                  ) : null
                }
              />
            </form>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md shadow-none">
          <CardContent className="py-4">
            <div className="flex justify-center gap-2 text-center font-semibold">
              <p className="text-foreground/80">Бүртгэлтэй хэрэглэгч үү?</p>
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-500 hover:underline"
              >
                Нэвтрэх
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
