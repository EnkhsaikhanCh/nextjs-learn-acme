import { useRegisterUserWithOtpMutation } from "@/generated/graphql";
import { registerSchema } from "@/lib/validation/userSchemas";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useHandleRegisterV3 = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const router = useRouter();

  const [registerUserWithOtp] = useRegisterUserWithOtpMutation();

  const passwordRequirements = [
    {
      regex: /.{8,}/,
      text: "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой",
    },
  ];

  const passwordStrength = passwordRequirements.map((req) => ({
    valid: req.regex.test(password),
    text: req.text,
  }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const input = {
      email: email.trim(),
      password,
    };

    const parsed = registerSchema.safeParse(input);

    if (!parsed.success) {
      const newErrors: { email?: string; password?: string } = {};
      const zodError = parsed.error.flatten().fieldErrors;

      if (zodError.email) {
        newErrors.email = zodError.email[0];
      }

      if (zodError.password) {
        newErrors.password = zodError.password[0];
      }

      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const { email: normalizedEmail, password: validPassword } = parsed.data;

      // Бүртгэл үүсгэх
      const { data } = await registerUserWithOtp({
        variables: {
          input: {
            email: normalizedEmail,
            password: validPassword,
          },
        },
      });

      if (data?.registerUserWithOtp?.success === true) {
        const token = data.registerUserWithOtp.tempToken;
        if (!token) {
          throw new Error("Токен хүлээн авахад алдаа гарлаа.");
        }

        localStorage.setItem("tempToken", token);

        // Бүртгэл амжилттай бол otp баталгаажуулах хуудсанд шилжих
        router.push("/verify-otp");
      } else {
        setErrors({
          email: data?.registerUserWithOtp?.message || "Алдаа гарлаа",
        });
      }
    } catch {
      setErrors({ email: "Бүртгэхэд алдаа гарлаа. Дахин оролдоно уу." });
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
    passwordStrength,
    handleRegister,
  };
};
