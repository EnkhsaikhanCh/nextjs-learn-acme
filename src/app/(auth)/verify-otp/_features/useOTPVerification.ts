// _features/useOTPVerification.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn, signOut } from "next-auth/react";

export const useOTPVerification = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const router = useRouter();

  // Хэрэглэгчийг гаргах функц
  const handleSignOut = async () => {
    localStorage.removeItem("tempToken");
    localStorage.removeItem("resendExpiry");
    await signOut({ callbackUrl: "/login" });
  };

  // Имэйл авах
  useEffect(() => {
    const fetchEmail = async () => {
      const tempToken = localStorage.getItem("tempToken");
      if (!tempToken) {
        await handleSignOut();
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/get-email-from-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tempToken }),
        });
        const data = await response.json();

        if (data.email) {
          setEmail(data.email);
        } else {
          await handleSignOut(); // Имэйл байхгүй бол гаргана
        }
      } catch (error) {
        console.error(error);
        await handleSignOut();
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmail();
  }, []);

  // Таймер удирдах
  useEffect(() => {
    const expiry = localStorage.getItem("resendExpiry");
    if (expiry) {
      const remaining = Math.ceil((Number(expiry) - Date.now()) / 1000);
      setResendTimer(remaining > 0 ? remaining : 0);
    }
    if (resendTimer > 0) {
      const timer = setInterval(
        () => setResendTimer((prev) => (prev > 1 ? prev - 1 : 0)),
        1000,
      );
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // OTP баталгаажуулах
  const handleSubmit = async () => {
    setIsVerifying(true);
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("И-мэйл баталгаажуулах 6 оронтой тоо байх ёстой.");
      setIsVerifying(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Код буруу байна.");
        toast.error(data.error || "Баталгаажуулалт амжилтгүй боллоо.");
      } else {
        setSuccess(true);
        setOtp("");
        toast.success("Имэйл амжилттай баталгаажлаа!");

        // Use signInToken to sign in
        const result = await signIn("credentials", {
          redirect: false,
          email,
          signInToken: data.signInToken,
        });

        if (result?.error) {
          toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
          router.push("/login");
          setIsVerifying(false);
          return;
        } else {
          localStorage.removeItem("tempToken");
          localStorage.removeItem("resendExpiry");
          setTimeout(() => router.push("/dashboard"), 2000);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Баталгаажуулалт явцад алдаа гарлаа. Дахин оролдоно уу.");
      toast.error("Баталгаажуулалт амжилтгүй боллоо. Дахин оролдоно уу.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Код дахин илгээх
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    const expiryTime = Date.now() + 60000;
    localStorage.setItem("resendExpiry", String(expiryTime));
    setResendTimer(60);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(
          "И-мэйл баталгаажуулах кодыг дахин илгээж чадсангүй. Дахин оролдоно уу.",
        );
      }

      toast.success(
        "И-мэйл баталгаажуулах код таны имэйл рүү дахин илгээгдлээ.",
      );
    } catch (error) {
      console.error(error);
      toast.error("И-мэйл баталгаажуулах код дахин илгээхэд алдаа гарлаа.");
    } finally {
      setIsResending(false);
    }
  };

  return {
    email,
    otp,
    setOtp,
    error,
    setError,
    isLoading,
    isVerifying,
    isResending,
    success,
    resendTimer,
    handleSubmit,
    handleResendOTP,
    handleSignOut,
  };
};
