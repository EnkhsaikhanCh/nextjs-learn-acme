import {
  useGenerateTempTokenMutation,
  useSendOtpMutation,
} from "@/generated/graphql";
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

        const userRole = session.user.role;

        toast.success("Амжилттай нэвтэрлээ", {
          description: "Таныг системд нэвтрүүлж байна...",
          duration: 3000,
        });

        if (userRole.toUpperCase() === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard/courses");
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
