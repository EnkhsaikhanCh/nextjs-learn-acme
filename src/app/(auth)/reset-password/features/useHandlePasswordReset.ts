import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useHandlePasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const controller = new AbortController();
    const verifyToken = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          signal: controller.signal,
        });

        const data = (await response.json()) as {
          email?: string;
          error?: string;
        };

        if (!data.email) {
          toast.error("Token буруу эсвэл хугацаа дууссан.");
          router.push("/login");
        }
      } catch {
        toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    };

    verifyToken();
    return () => controller.abort();
  }, [token, router]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.replace("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    if (!password) {
      setFormError("Нууц үг шаардлагатай.");
      setIsLoading(false);
      return;
    } else if (password.length < 8) {
      setFormError("Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Нууц үгүүд хоорондоо тохирохгүй байна.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormError(data.error || "Алдаа гарлаа. Дахин оролдоно уу.");
      } else {
        setSuccess(true);
        toast.success("Нууц үг амжилттай шинэчлэгдсэн.");
      }
    } catch {
      setFormError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
