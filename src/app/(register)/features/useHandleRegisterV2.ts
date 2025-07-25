import {
  useGenerateTempTokenMutation,
  useRegisterUserV2Mutation,
  useSendOtpMutation,
} from "@/generated/graphql";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { escape } from "validator";

export const useHandleRegisterV2 = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const router = useRouter();

  const sanitizeInput = (input: string) => {
    return escape(input);
  };

  // Input-ыг ариутгах
  const sanitizedEmail = sanitizeInput(email);

  //   const [createUser] = useCreateUserMutation();
  const [createUserV2] = useRegisterUserV2Mutation();
  const [generateTempToken] = useGenerateTempTokenMutation();
  const [sendOTP] = useSendOtpMutation();

  const passwordRequirements = [
    { regex: /.{8,}/, text: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой" },
  ];

  const strength = passwordRequirements.map((req) => ({
    valid: req.regex.test(password),
    text: req.text,
  }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: { email?: string; password?: string } = {};

    // Имэйл болон нууц үг шалгах
    if (!sanitizedEmail) {
      newErrors.email = "Имэйл хаяг шаардлагатай.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Имэйл хаяг буруу байна.";
    }

    if (!password) {
      newErrors.password = "Нууц үг шаардлагатай.";
    } else if (password.length < 8) {
      newErrors.password = "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Бүртгэл үүсгэх
      const { data } = await createUserV2({
        variables: {
          input: { email: sanitizedEmail, password },
        },
      });

      if (data?.registerUserV2.success === true) {
        const tempTokenResponse = await generateTempToken({
          variables: { email: data.registerUserV2.userV2?.email as string },
        });

        const token = tempTokenResponse.data?.generateTempToken.token;
        if (!token) {
          throw new Error("Токен хүлээн авахад алдаа гарлаа.");
        }

        localStorage.setItem("tempToken", token);

        // OTP илгээх
        const otpResponse = await sendOTP({
          variables: { email: sanitizedEmail },
        });
        if (!otpResponse) {
          throw new Error("OTP илгээхэд алдаа гарлаа");
        }

        toast.success("OTP код амжилттай илгээгдлээ!");

        router.push("/verify-otp");
      } else {
        toast.error(data?.registerUserV2.message);
      }
    } catch (error) {
      // Check if it's the specific email exists error
      const message = (error as Error).message;
      if (message === "A user with this email already exists.") {
        setErrors({ email: "Энэ бүртгэлтэй имэйл хаяг байна." });
      } else {
        toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    errors,
    setErrors,
    handleRegister,
    strength,
  };
};
