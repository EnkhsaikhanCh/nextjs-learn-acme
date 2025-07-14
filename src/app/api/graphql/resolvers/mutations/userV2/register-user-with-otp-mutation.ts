import {
  RegisterUserWithOtpInput,
  RegisterUserWithOtpResponse,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { UserV2Model } from "../../../models/userV2.model";
import { sendOtpService } from "@/lib/services/sendOtpService";
import { generateTempTokenService } from "@/lib/services/generateTempTokenService";
import { createUserService } from "@/lib/services/createUserService";
import { registerSchema } from "@/lib/validation/userSchemas";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";

export const registerUserWithOtp = async (
  _: unknown,
  { input }: { input: RegisterUserWithOtpInput },
): Promise<RegisterUserWithOtpResponse> => {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0].message,
      userV2: null,
    };
  }

  const { email, password } = parsed.data;

  const session = await mongoose.startSession();
  let tempToken: string | null = null;
  let user: UserV2 | null = null;

  try {
    await session.withTransaction(async () => {
      const existingUser = await UserV2Model.findOne({ email }).session(
        session,
      );
      if (existingUser) {
        throw new GraphQLError(
          "Энэ имэйл хаягтай хэрэглэгч аль хэдийн бүртгэлтэй байна.",
          {
            extensions: { code: "BAD_USER_INPUT" },
          },
        );
      }

      user = await createUserService(
        email,
        password,
        UserV2Role.Student,
        session,
      );
      if (!user) {
        throw new GraphQLError("User creation failed.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    });

    await sendOtpService(email);
    tempToken = await generateTempTokenService(email);

    return {
      success: true,
      message: "Бүртгэл амжилттай. Баталгаажуулах код илгээгдлээ.",
      userV2: user,
      tempToken,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    console.error("Error during user registration:", error);

    return {
      success: false,
      message: "Бүртгэлийн явцад алдаа гарлаа. Та дараа дахин оролдоно уу.",
      userV2: null,
    };
  } finally {
    await session.endSession();
  }
};
