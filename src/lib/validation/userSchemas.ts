import { z } from "zod";
import validator from "validator";

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .max(255, { message: "Имэйл 255 тэмдэгтээс ихгүй байх ёстой." })
    .transform(
      (val) => validator.normalizeEmail(val, { all_lowercase: true }) || "",
    )
    .refine((val) => validator.isEmail(val), {
      message: "Буруу имэйл хаяг.",
    }),
  password: z
    .string()
    .min(8, { message: "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой." })
    .max(255, { message: "Нууц үг 255 тэмдэгтээс ихгүй байх ёстой." }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Имэйл хаяг шаардлагатай.")
    .email("Буруу имэйл хаяг."),
  password: z.string().min(1, "Нууц үг шаардлагатай."),
});
