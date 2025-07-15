import { fallbackRedirect, roleRedirectMap } from "@/config/roleRedirectMap";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/generated/graphql";
import { useUserStore } from "@/store/UserStoreState";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OTP_LENGTH = 6;
const RESEND_TIMEOUT_MS = 60_000;
const RESEND_TIMEOUT_SEC = RESEND_TIMEOUT_MS / 1000;

export const useOTPVerificationV2 = () => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);

  const { setUser, user } = useUserStore();
  const [sendOTP] = useSendOtpMutation();
  const [verifyOTP] = useVerifyOtpMutation();
  const router = useRouter();

  // Initialize resend timer from localStorage
  useEffect(() => {
    const expiry = Number(localStorage.getItem("resendExpiry") || 0);
    const remaining = Math.ceil((expiry - Date.now()) / 1000);
    setResendTimer(remaining > 0 ? remaining : 0);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer > 0]);

  const handleSubmit = async () => {
    setIsVerifying(true);
    setError("");

    if (!user || !user.email || !/^\S+@\S+\.\S+$/.test(user.email)) {
      setError("Хэрэглэгчийн имэйл алга байна эсвэл буруу байна.");
      setIsVerifying(false);
      return;
    }

    if (!/^\d{${OTP_LENGTH}}$/.test(otp)) {
      setError(`И-мэйл баталгаажуулах ${OTP_LENGTH} оронтой тоо байх ёстой.`);
      setIsVerifying(false);
      return;
    }

    try {
      const { data } = await verifyOTP({
        variables: { email: user.email, otp },
      });

      const result = data?.verifyOTP;

      if (!result?.success) {
        const message = result?.message || "Код буруу байна.";
        toast.error(message);
        setError(message);
        return;
      }

      if (!result.user || !result.signInToken) {
        throw new Error(
          "OTP амжилттай баталгаажсан ч шаардлагатай өгөгдөл алга.",
        );
      }

      await signIn("credentials", {
        redirect: false,
        email: result.user.email,
        signInToken: result.signInToken,
      });

      setUser(result.user);
      setSuccess(true);
      setOtp("");
      toast.success("Имэйл амжилттай баталгаажлаа!");
      localStorage.removeItem("resendExpiry"); // Clear timer on lagged out

      const redirectTo = roleRedirectMap[result.user.role] || fallbackRedirect;

      router.push(redirectTo);
    } catch {
      setError("OTP баталгаажуулахад алдаа гарлаа.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      return;
    }

    if (!user?.email || !/^\S+@\S+\.\S+$/.test(user.email)) {
      toast.error("Хэрэглэгчийн имэйл буруу байна.");
      return;
    }

    setIsResending(true);

    try {
      const expiryTime = Date.now() + RESEND_TIMEOUT_MS;
      localStorage.setItem("resendExpiry", String(expiryTime));
      setResendTimer(RESEND_TIMEOUT_SEC);

      const { data } = await sendOTP({
        variables: { email: user.email },
      });

      if (!data?.sendOTP?.success) {
        throw new Error(data?.sendOTP?.message || "Дахин илгээж чадсангүй.");
      }

      toast.success(
        "И-мэйл баталгаажуулах код таны имэйл рүү дахин илгээгдлээ.",
      );
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("И-мэйл дахин илгээхэд алдаа гарлаа.");
    } finally {
      setIsResending(false);
    }
  };

  return {
    otp,
    setOtp,
    error,
    setError,
    isVerifying,
    success,
    isResending,
    resendTimer,
    handleSubmit,
    handleResendOTP,
  };
};
