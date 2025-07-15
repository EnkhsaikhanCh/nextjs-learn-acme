// src/app/login/page.ts
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionButton } from "@/components/ActionButton";
import { BaseInput } from "@/components/BaseInput";
import { cn } from "@/lib/utils";
import { LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";
import { useHandleLoginV2 } from "./features/useHandleLoginV2";

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    isSubmitting,
    handleLogin,
  } = useHandleLoginV2();

  return (
    <div className={cn("flex flex-col gap-3")}>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-foreground/80 flex items-center gap-3 text-2xl font-bold">
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
                label="Имэйл"
                placeholder="welcome@mail.com"
                error={errors.email}
                autoComplete="email"
                tabIndex={1}
                disabled={isSubmitting}
              />

              <PasswordInput
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({});
                }}
                errorMessage={errors.password}
                actionLink={{
                  href: "/forgot-password",
                  label: "Нууц үгээ мартсан уу?",
                }}
                disabled={isSubmitting}
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
  );
}
