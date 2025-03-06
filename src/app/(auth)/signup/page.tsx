"use client";

import {
  CheckIcon,
  Eye,
  EyeOff,
  Globe,
  LoaderCircle,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { escape } from "validator";
import { useCreateUserMutation } from "@/generated/graphql";
import { signIn } from "next-auth/react";
import { BaseInput } from "@/components/BaseInput";
import { ActionButton } from "@/components/ActionButton";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";

export default function SignUp() {
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

        // Auth.js ашиглан Sign In хийх
        const result = await signIn("credentials", {
          email: sanitizedEmail,
          password: password,
          redirect: false, // OTP баталгаажуулах хуудас руу дамжуулах тул redirect-г false болгоно
        });

        if (result?.error) {
          toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
          setIsSubmitting(false);
          return;
        }

        // OTP баталгаажуулах хуудас руу дамжуулах
        router.push(`/verify-otp?email=${encodeURIComponent(sanitizedEmail)}`);
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
      <div className="relative hidden md:block">
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

      <div className="flex items-center justify-center p-4 sm:p-8">
        <Toaster position="top-right" richColors expand={false} />
        <div className="w-full max-w-md space-y-8">
          <div className="flex w-full flex-col justify-center space-y-8">
            <div className="flex flex-col space-y-2 text-center">
              <Link
                href="/"
                className="mb-3 flex items-center justify-center gap-2 text-lg font-semibold md:hidden"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Globe className="h-4 w-4" />
                </div>
                OXON
              </Link>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Шинэ бүртгэл үүсгэх
              </h1>
              <p className="text-sm text-muted-foreground">
                Доорх мэдээллийг бөглөж бүртгэлээ үүсгэнэ үү
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 md:gap-7"
            >
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

              <div className="space-y-1">
                <Label htmlFor="password" className="font-semibold">
                  Нууц үг
                </Label>
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
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="password"
                  >
                    {isVisible ? (
                      <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
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
                <ul className="mt-2 space-y-1.5">
                  {strength.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs">
                      {req.valid ? (
                        <CheckIcon size={16} className="text-emerald-500" />
                      ) : (
                        <XIcon size={16} className="text-muted-foreground/80" />
                      )}
                      <span
                        className={
                          req.valid
                            ? "text-emerald-600"
                            : "text-muted-foreground"
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
                className="rounded-2xl"
                label={isSubmitting ? "" : "Бүртгэл үүсгэх"}
                icon={
                  isSubmitting ? (
                    <LoaderCircle className="animate-spin font-semibold" />
                  ) : null
                }
              />
            </form>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Бүртгэлтэй хэрэглэгч үү?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-500"
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
