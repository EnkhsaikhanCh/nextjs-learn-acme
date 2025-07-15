import { useRegisterUserWithOtpMutation } from "@/generated/graphql";
import { registerSchema } from "@/lib/validation/userSchemas";
import { useUserStore } from "@/store/UserStoreState";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useHandleRegisterV3 = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const setUser = useUserStore((state) => state.setUser);
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

    const input = { email: email.trim(), password };
    const parsed = registerSchema.safeParse(input);

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

      // Бүртгэл үүсгэх
      const { data } = await registerUserWithOtp({
        variables: {
          input: {
            email: normalizedEmail,
            password: validPassword,
          },
        },
      });

      const result = data?.registerUserWithOtp;
      if (!result || !result.success) {
        setErrors({ email: "Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу." });
        return;
      }

      const signInResult = await signIn("credentials", {
        email: normalizedEmail,
        password: validPassword,
        redirect: false,
      });
      if (signInResult?.error) {
        setErrors({ email: "Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу." });
        return;
      }

      if (result.userV2) {
        setUser(result.userV2);
      }

      router.push("/verify-otp");
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
