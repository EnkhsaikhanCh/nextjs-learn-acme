// src/app/forgot-password/page.tsx
"use client";

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
import Link from "next/link";
import { useSendPasswordResetToken } from "./features/useSendPasswordResetToken";
import { SuccessMessage } from "@/components/SuccessMessage";
import { BaseInput } from "@/components/BaseInput";

export default function ForgotPassword() {
  const {
    email,
    setEmail,
    isLoading,
    formError,
    setFormError,
    success,
    sendPasswordResetToken,
  } = useSendPasswordResetToken();

  return (
    <Card className="max-w-md min-w-full">
      <CardHeader>
        <CardTitle className="text-foreground/80 flex items-center gap-3 text-2xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-amber-500 bg-amber-200">
            <KeyRound className="h-6 w-6 stroke-[2.5] text-amber-600" />
            <span className="sr-only">forgot password</span>
          </div>
          <p>Нууц үгээ мартсан уу?</p>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-3">
        {success ? (
          <SuccessMessage description="Таны и-мэйл хаяг руу холбоос амжилттай илгээгдлээ." />
        ) : (
          <form onSubmit={sendPasswordResetToken}>
            <BaseInput
              label="Имэйл"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="hello@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError(null);
              }}
            />
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2 font-semibold text-red-500"
                aria-live="polite"
              >
                <AlertCircle size={16} className="w-10" />
                <span className="text-sm">{formError}</span>
              </motion.div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Имэйл хаягаа оруулна уу. Бид таны имэйл рүү нууц үг сэргээх
              холбоос илгээх болно.
            </p>
            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={isLoading}
              aria-label={isLoading ? "Холбоос илгээж байна" : "Холбоос илгээх"}
            >
              {isLoading ? (
                <>
                  Холбоос илгээж байна...
                  <Loader className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Холбоос илгээх"
              )}
            </Button>
          </form>
        )}
      </CardContent>

      {!success && (
        <CardFooter className="flex flex-col gap-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Нэвтрэх хуудас руу буцах
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
