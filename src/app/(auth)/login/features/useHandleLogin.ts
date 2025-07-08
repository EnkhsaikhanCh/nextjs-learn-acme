import {
  useGenerateTempTokenMutation,
  useSendOtpMutation,
} from "@/generated/graphql";
import { useUserStore } from "@/store/UserStoreState";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ErrorState {
  email?: string;
  password?: string;
}

const validateForm = (email: string, password: string): ErrorState => {
  const errors: ErrorState = {};

  if (!email.trim()) {
    errors.email = "Имэйл хаяг шаардлагатай.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Имэйл хаяг буруу байна.";
  }

  if (!password.trim()) {
    errors.password = "Нууц үг шаардлагатай.";
  }

  return errors;
};

export const useHandleLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorState>({});
  const { setUser } = useUserStore.getState();

  const [generateTempToken] = useGenerateTempTokenMutation();
  const [sendOTP] = useSendOtpMutation();

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Имэйл эсвэл нууц үг буруу байна.");
      } else {
        const session = await getSession();

        if (!session || !session.user?.role) {
          toast.error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
          return;
        }

        if (session?.user) {
          setUser({
            _id: session.user._id,
            email: session.user.email,
            role: session.user.role,
            isVerified: session.user.isVerified,
          });
        }

        // Баталгаажаагүй эсэхийг шалгах
        if (!session.user.isVerified) {
          // Токен үүсгэх
          const tempTokenResponse = await generateTempToken({
            variables: { email: email },
          });

          const token = tempTokenResponse.data?.generateTempToken.token;
          if (!token) {
            throw new Error("Токен хүлээн авахад алдаа гарлаа.");
          }

          localStorage.setItem("tempToken", token);

          // OTP илгээх
          const otpResponse = await sendOTP({
            variables: { email: email },
          });
          if (!otpResponse) {
            throw new Error("OTP илгээхэд алдаа гарлаа");
          }

          toast.success("OTP код амжилттай илгээгдлээ!");
          router.push("/verify-otp");
          return; // Эндээс гарах
        }

        // User is verified. Determine redirection based on role.
        const userRole = session.user.role.toUpperCase();

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

        // Show a success message.
        toast.success("Амжилттай нэвтэрлээ", {
          description: "Таныг системд нэвтрүүлж байна...",
        });

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
    } catch {
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
