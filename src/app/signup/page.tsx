"use client";

import { Globe, Loader } from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { escape } from "validator";
import { useCreateUserMutation } from "@/generated/graphql";
import { signIn } from "next-auth/react";
import { BaseInput } from "@/components/BaseInput";
import { ActionButton } from "@/components/ActionButton";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

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
        toast.success("Бүртгэл амжилттай үүсгэлээ!");

        const result = await signIn("credentials", {
          email: sanitizedEmail,
          password: sanitizedPassword,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
        } else {
          router.push("/dashboard");
        }
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
    <main className="grid h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative m-4 hidden rounded-2xl bg-zinc-900 p-6 text-white sm:m-6 sm:p-8 md:block">
        <div className="absolute inset-0 z-10 rounded-2xl bg-zinc-900" />
        <div className="relative z-20 items-center text-lg font-medium">
          <Link href={"/"} className="flex items-center gap-3">
            <Globe />
            Nomad Tech Inc.
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-8">
        <Toaster position="top-right" richColors expand={false} />
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Шинэ бүртгэл үүсгэх
              </h1>
              <p className="text-sm text-muted-foreground">
                Доорх мэдээллийг бөглөж бүртгэлээ үүсгэнэ үү
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <BaseInput
                id="email"
                type="email"
                placeholder="welcome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Имэйл"
                error={errors.email}
                autoComplete="email"
              />

              <BaseInput
                id="password"
                type="password"
                placeholder="Нууц үгээ оруулна уу"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Нууц үг"
                error={errors.password}
                description="Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой"
              />

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-xs font-medium text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Би{" "}
                  <Link href="/terms" className="underline hover:text-primary">
                    Үйлчилгээний нөхцөл
                  </Link>{" "}
                  болон{" "}
                  <Link
                    href="/privacy"
                    className="underline hover:text-primary"
                  >
                    Нууцлалын бодлого
                  </Link>
                  -г зөвшөөрч байна.
                </label>
              </div>

              <ActionButton
                type="submit"
                disabled={isSubmitting}
                label={
                  isSubmitting ? "Бүртгэл үүсгэж байна..." : "Бүртгэл үүсгэх"
                }
                icon={
                  isSubmitting ? (
                    <Loader className="animate-spin font-semibold" />
                  ) : null
                }
              />
            </form>
            <div className="text-center text-sm">
              Бүртгэлтэй хэрэглэгч үү?{" "}
              <Link
                href="/login"
                className="text-blue-600 underline underline-offset-4 hover:text-blue-700"
              >
                Нэвтрэх
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
