"use client";

import { CheckIcon, Globe, LoaderCircle, User, XIcon } from "lucide-react";
import { BaseInput } from "@/components/BaseInput";
import { ActionButton } from "@/components/ActionButton";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHandleRegisterV2 } from "../features/useHandleRegisterV2";
import { siteConfig } from "@/config/site";

export default function SignUp() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    errors,
    setErrors,
    handleRegister,
    strength,
  } = useHandleRegisterV2();

  return (
    <main className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-stone-700 to-zinc-600" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-20 flex h-full flex-col items-center justify-between p-8 text-white">
          <Link href="/" className="flex items-center gap-3 text-lg font-bold">
            <Globe className="h-6 w-6" />
            {siteConfig.name}
          </Link>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome to {siteConfig.name}</h2>
            <p className="mt-2 text-lg">Your journey starts here</p>
          </div>
          <p className="text-sm"></p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 bg-gray-50 p-4 sm:p-8">
        <Link
          href="/"
          className="mb-3 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <Globe className="h-4 w-4" />
          </div>
          {siteConfig.name}
        </Link>

        <Card className="w-full max-w-md shadow-none">
          <CardHeader>
            <CardTitle className="text-foreground/80 flex items-center gap-3 text-2xl font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-green-500 bg-green-200">
                <User className="h-6 w-6 stroke-[2.5] text-green-600" />
                <span className="sr-only">Sing up</span>
              </div>
              <p>Шинэ бүртгэл үүсгэх</p>
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Доорх мэдээллийг бөглөж бүртгэлээ үүсгэнэ үү
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleRegister}
              method="POST"
              className="flex flex-col gap-5 md:gap-7"
            >
              <BaseInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                label="Имэйл"
                error={errors.email}
                autoComplete="email"
                placeholder="welcome@email.com"
              />

              <div className="space-y-2">
                <PasswordInput
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({});
                  }}
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
