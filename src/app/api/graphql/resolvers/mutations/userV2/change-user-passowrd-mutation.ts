import { z } from "zod";
import {
  ChangePasswordInput,
  ChangePasswordResponse,
  User,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { UserV2Model } from "../../../models";
import argon2 from "argon2";

const ChangePasswordSchema = z.object({
  oldPassword: z
    .string()
    .nonempty("Old password is required.")
    .min(8, "Old password must be at least 8 characters."),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters.")
    .max(64),
});

export const changeUserPassword = async (
  _: unknown,
  { input }: { input: ChangePasswordInput },
  context: { user?: User },
): Promise<ChangePasswordResponse> => {
  const { user } = context;
  await requireAuthAndRoles(user, [
    UserV2Role.Admin,
    UserV2Role.Instructor,
    UserV2Role.Student,
  ]);

  const { oldPassword, newPassword } = input;

  const parsed = ChangePasswordSchema.safeParse({ oldPassword, newPassword });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0].message,
    };
  }

  try {
    const existingUser = await UserV2Model.findById(user?._id).select(
      "+password",
    );
    if (!existingUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (existingUser._id !== user!._id) {
      return {
        success: false,
        message: "You can only update your own password.",
      };
    }

    const isOldPasswordCorrect = await argon2.verify(
      existingUser.password,
      oldPassword,
    );

    if (!isOldPasswordCorrect) {
      return {
        success: false,
        message: "Old password is incorrect.",
      };
    }

    const hashedPassword = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    existingUser.password = hashedPassword;

    await existingUser.save();

    return {
      success: true,
      message: "Password updated successfully. Please log in again.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal error: " + (error as Error).message,
    };
  }
};
