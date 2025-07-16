import { fallbackRedirect, roleRedirectMap } from "@/config/roleRedirectMap";
import { useSendOtpMutation } from "@/generated/graphql";
import { loginSchema } from "@/lib/validation/userSchemas";
import { useUserStore } from "@/store/UserStoreState";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ErrorState {
  email?: string;
  password?: string;
}

export const useHandleLoginV2 = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorState>({});

  const setUser = useUserStore((state) => state.setUser);
  const [sendOTP] = useSendOtpMutation();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const input = { email: email.trim(), password };
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { email: normalizedEmail, password: validPassword } = parsed.data;

      const result = await signIn("credentials", {
        email: normalizedEmail,
        password: validPassword,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Имэйл эсвэл нууц үг буруу байна.");
        return;
      }

      // Wait briefly to ensure session is updated
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const session = await getSession();

      const user = session?.user;
      if (!user || !user.role) {
        toast.error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
        return;
      }

      setUser({
        _id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });

      if (!user.isVerified) {
        const otpRes = await sendOTP({ variables: { email } });
        const otpSuccess = otpRes.data?.sendOTP?.success;
        if (!otpSuccess) {
          throw new Error("OTP код илгээхэд алдаа гарлаа.");
        }

        toast.success("OTP амжилттай илгээгдлээ!");
        router.push("/verify-otp");
        return;
      }

      const redirectTo = roleRedirectMap[user.role] || fallbackRedirect;

      toast.success("Амжилттай нэвтэрлээ", {
        description: "Таныг системд нэвтрүүлж байна...",
      });
      router.push(redirectTo);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    isSubmitting,
    handleLogin,
  };
};
