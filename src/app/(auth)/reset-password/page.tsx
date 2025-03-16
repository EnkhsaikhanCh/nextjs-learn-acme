// src/app/reset-password/page.tsx
"use client";

import { Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Globe, KeyRound, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";
import { useHandlePasswordReset } from "./features/useHandlePasswordReset";
import { SuccessMessage } from "./components/SuccessMessage";
import { CardLoader } from "./components/CardLoader";

export default function ResetPassword() {
  const router = useRouter();

  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    formError,
    setFormError,
    success,
    isChecking,
    handlePasswordReset,
  } = useHandlePasswordReset();

  return (
    <main className="flex min-h-svh flex-col items-center gap-6 bg-muted px-4 md:p-10">
      <Toaster richColors position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Globe className="h-4 w-4" />
          </div>
          OXON
        </Link>

        <Card className="min-w-full max-w-md shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground/80 md:text-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-purple-500 bg-purple-200">
                <KeyRound className="h-6 w-6 stroke-[2.5] text-purple-600" />
                <span className="sr-only">reset password</span>
              </div>
              <p>Нууц үгээ шинэчлэх</p>
            </CardTitle>
          </CardHeader>

          {!success ? (
            <>
              <CardContent>
                <form onSubmit={handlePasswordReset}>
                  <div className="grid w-full items-center gap-4">
                    {!isChecking ? (
                      <>
                        <p className="mb-4 text-sm text-gray-500">
                          Шинэ нууц үгээ оруулна уу. Нууц үг нь хамгийн багадаа
                          8 тэмдэгттэй байх ёстой.
                        </p>
                        <div className="grid w-full items-center gap-4">
                          <PasswordInput
                            id="password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setFormError(null);
                            }}
                            label="Шинэ нууц үг"
                            placeholder="••••••••"
                          />
                          <PasswordInput
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setFormError(null);
                            }}
                            label="Шинэ нууц үг давтах"
                            placeholder="••••••••"
                          />
                        </div>
                        {formError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 flex items-center gap-2 font-semibold text-red-500"
                          >
                            <AlertCircle size={16} />
                            <span className="text-sm">{formError}</span>
                          </motion.div>
                        )}

                        <Button
                          type="submit"
                          className="mt-5 w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              Нууц үг шинэчилж байна...
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                            </>
                          ) : (
                            "Нууц үг шинэчлэх"
                          )}
                        </Button>
                      </>
                    ) : (
                      <CardLoader />
                    )}
                  </div>
                </form>
              </CardContent>
            </>
          ) : (
            <SuccessMessage />
          )}

          {/* Only display the footer (login button) when not checking and form is active */}
          {!isChecking && !success && (
            <CardFooter className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Нэвтрэх хуудас руу буцах
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </main>
  );
}
