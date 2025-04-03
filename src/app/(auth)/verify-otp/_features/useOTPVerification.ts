// _features/useOTPVerification.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSession, signIn, signOut } from "next-auth/react";
import {
  useGetEmailFromTokenLazyQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/generated/graphql";

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

  const [sendOTP] = useSendOtpMutation();
  const [verifyOTP] = useVerifyOtpMutation();

  // Хэрэглэгчийг гаргах функц
  const handleSignOut = async () => {
    localStorage.removeItem("tempToken");
    localStorage.removeItem("resendExpiry");
    await signOut({ callbackUrl: "/login" });
  };

  // Имэйл авах
  const [fetchEmail, { data, loading, error: getEmailError }] =
    useGetEmailFromTokenLazyQuery();

  useEffect(() => {
    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken) {
      handleSignOut();
      return;
    }
    setIsLoading(true);
    fetchEmail({ variables: { token: tempToken } });
  }, [fetchEmail]);

  // When email query returns, update state or sign out if error
  useEffect(() => {
    if (data?.getEmailFromToken?.email) {
      setEmail(data.getEmailFromToken.email);
    } else if (!loading && (getEmailError || !data?.getEmailFromToken?.email)) {
      const errorMessage = getEmailError?.message || "Имэйл олдсонгүй";
      toast.error(errorMessage);
      handleSignOut();
    }
  }, [data, loading, getEmailError]);

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

  // OTP verification
  const handleSubmit = async () => {
    setIsVerifying(true);
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("И-мэйл баталгаажуулах 6 оронтой тоо байх ёстой.");
      setIsVerifying(false);
      return;
    }

    try {
      const verifyResult = await verifyOTP({
        variables: { email: email as string, otp },
      });

      if (!verifyResult.data?.verifyOTP?.signInToken) {
        const errorMessage = "Код буруу байна. Дахин оролдоно уу.";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      } else {
        setSuccess(true);
        setOtp("");
        toast.success("Имэйл амжилттай баталгаажлаа!");

        // Use signInToken to sign in
        const result = await signIn("credentials", {
          redirect: false,
          email,
          signInToken: verifyResult.data.verifyOTP.signInToken,
        });

        if (result?.error) {
          toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
          router.push("/login");
          return;
        } else {
          localStorage.removeItem("tempToken");
          localStorage.removeItem("resendExpiry");

          const session = await getSession();
          const userRole = session?.user.role;
          if (userRole?.toUpperCase() === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/dashboard/courses");
          }
        }
      }
    } catch (err) {
      console.error(err);
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
      const otpResponse = await sendOTP({
        variables: { email: email as string },
      });
      if (!otpResponse) {
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
