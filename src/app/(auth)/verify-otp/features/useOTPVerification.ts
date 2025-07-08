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
import { useUserStore } from "@/store/UserStoreState";

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
  const { setUser, clearUser } = useUserStore.getState();

  const [sendOTP] = useSendOtpMutation();
  const [verifyOTP] = useVerifyOtpMutation();

  // Хэрэглэгчийг гаргах функц
  const handleSignOut = async () => {
    clearUser();
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

    fetchEmail({ variables: { token: tempToken } }).finally(() => {
      setIsLoading(false);
    });
  }, [fetchEmail]);

  // When email query returns, update state or sign out if error
  useEffect(() => {
    if (loading) {
      return; // Query ажиллаж байгаа үед юу ч хийхгүй
    }

    // Зөв имэйл ирсэн бол
    if (data?.getEmailFromToken?.email) {
      setEmail(data.getEmailFromToken.email);
      return;
    }

    // Хэрэв fetch хийгдэж дууссан ч email ирээгүй бол sign out хийх
    if (!loading && data && !data.getEmailFromToken?.email) {
      toast.error("Имэйл олдсонгүй");
      handleSignOut();
      return;
    }

    // Хэрэв GraphQL error байвал
    if (getEmailError) {
      toast.error(getEmailError.message);
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
      const { data } = await verifyOTP({
        variables: { email: email as string, otp },
      });

      if (!data?.verifyOTP?.success) {
        toast.error(data?.verifyOTP?.message);
        setError(data?.verifyOTP?.message || "Код буруу байна.");
        return;
      } else {
        setSuccess(true);
        setOtp("");
        toast.success("Имэйл амжилттай баталгаажлаа!");

        // Use signInToken to sign in
        const result = await signIn("credentials", {
          redirect: false,
          email,
          signInToken: data?.verifyOTP.signInToken,
        });

        if (result?.error) {
          toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
          router.push("/login");
          return;
        } else {
          localStorage.removeItem("tempToken");
          localStorage.removeItem("resendExpiry");

          const session = await getSession();
          if (session?.user) {
            setUser({
              _id: session.user._id,
              email: session.user.email,
              role: session.user.role,
              isVerified: session.user.isVerified,
            });
          }

          const userRole = session?.user.role.toUpperCase();

          // Define role types for clarity.
          type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

          // Map each allowed role to its default destination.
          const roleRedirectMap: Record<Role, string> = {
            ADMIN: "/admin",
            INSTRUCTOR: "/instructor",
            STUDENT: "/dashboard",
          };

          // Fallback destination in case of unknown role.
          const fallbackRedirect = "/";

          // Redirect based on role.
          if (userRole === "ADMIN") {
            router.push(roleRedirectMap.ADMIN);
          } else if (userRole === "INSTRUCTOR") {
            router.push(roleRedirectMap.INSTRUCTOR);
          } else if (userRole === "STUDENT") {
            router.push(roleRedirectMap.STUDENT);
          } else {
            // In case of an unexpected role, use fallback.
            router.push(fallbackRedirect);
          }
        }
      }
    } catch {
      setError("Баталгаажуулалт явцад алдаа гарлаа. Дахин оролдоно уу.");
      toast.error("Баталгаажуулалт амжилтгүй боллоо. Дахин оролдоно уу.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Код дахин илгээх
  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      return;
    }

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
    } catch {
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
