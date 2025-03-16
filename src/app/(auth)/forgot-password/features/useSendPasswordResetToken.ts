// src/app/(auth)/forgot-password/features/useSendPasswordResetToken.ts
import { useState } from "react";
import { sanitizeInput } from "@/utils/sanitize";
import validator from "validator";
import { toast } from "sonner";

export const useSendPasswordResetToken = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const sendPasswordResetToken = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    const sanitizedEmail = sanitizeInput(email);

    if (!sanitizedEmail) {
      setFormError("Имэйл хаяг шаардлагатай.");
      setIsLoading(false);
      return;
    } else if (!validator.isEmail(sanitizedEmail)) {
      setFormError("Имэйл хаяг буруу байна.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    try {
      const response = await fetch("/api/auth/reset-password-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sanitizedEmail }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Алдаа гарлаа. Дахин оролдоно уу.";
        setFormError(errorMessage);
      } else {
        setSuccess(true);
        toast.success("Таны и-мэйл хаяг руу холбоос амжилттай илгээгдлээ.");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") return;
        const errorMessage = `Сүлжээний алдаа гарлаа: ${error.message}`;
        console.error(`Сүлжээний алдаа гарлаа: ${error.message}`);
        toast.error(errorMessage);
        setFormError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
      } else {
        const errorMessage = "Тодорхойгүй алдаа гарлаа.";
        toast.error(errorMessage);
        setFormError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    formError,
    setFormError,
    success,
    sendPasswordResetToken,
  };
};
