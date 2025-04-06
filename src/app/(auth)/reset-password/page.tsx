// src/app/reset-password/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, KeyRound, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/PasswordInput";
import { useHandlePasswordReset } from "./features/useHandlePasswordReset";
import { SuccessMessage } from "@/components/SuccessMessage";

const CardLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <Loader className="h-8 w-8 animate-spin text-purple-600" />
      <p className="text-sm text-gray-500">
        Бид таны хүсэлтийн шалгаж байна, та түр хүлээнэ үү...
      </p>
    </div>
  );
};

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
    <Card className="max-w-md min-w-full shadow-none">
      <CardHeader>
        <CardTitle className="text-foreground/80 flex items-center gap-3 text-xl font-bold md:text-2xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-purple-500 bg-purple-200">
            <KeyRound className="h-6 w-6 stroke-[2.5] text-purple-600" />
            <span className="sr-only">reset password</span>
          </div>
          <p>Нууц үгээ шинэчлэх</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        {success ? (
          <>
            <SuccessMessage description="Таны нууц үг амжилттай шинэчлэгдлээ. Одоо нэвтрэх боломжтой." />
          </>
        ) : (
          <form onSubmit={handlePasswordReset}>
            <div className="grid w-full items-center gap-4">
              {!isChecking ? (
                <>
                  <p className="text-sm text-gray-500">
                    Шинэ нууц үгээ оруулна уу. Нууц үг нь хамгийн багадаа 8
                    тэмдэгттэй байх ёстой.
                  </p>
                  <div className="grid w-full items-center gap-4">
                    <PasswordInput
                      id="new-password"
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
                      className="flex items-center gap-2 font-semibold text-red-500"
                    >
                      <AlertCircle size={16} />
                      <span className="text-sm">{formError}</span>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="mt-3 w-full"
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
        )}
      </CardContent>

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
  );
}
