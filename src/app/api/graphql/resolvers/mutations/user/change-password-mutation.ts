import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import { ChangePasswordInput, Context } from "../../../schemas/user.schema";
import argon2 from "argon2";
import { validationPassword } from "@/utils/validation";
import { requireUser } from "../../../auth";

export const changePassword = async (
  _: unknown,
  { input, _id }: { input: ChangePasswordInput; _id: string },
  context: Context,
) => {
  try {
    requireUser(context);

    // Step 1: Check if user exists
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    // Step 2: Check if current password is correct
    const isMatch = await argon2.verify(user.password, input.currentPassword);
    if (!isMatch) {
      throw new GraphQLError("Invalid credentials", {
        extensions: { code: "INVALID_CREDENTIALS" },
      });
    }

    // Step 3: Validate new password
    if (!validationPassword(input.newPassword)) {
      throw new GraphQLError(
        `Password must:
        - Be at least 8 characters long,
        - Not exceed 128 characters,
        - Include at least one uppercase letter,
        - Include at least one lowercase letter,
        - Include at least one number,
        - Include at least one special character.`,
        { extensions: { code: "BAD_USER_INPUT" } },
      );
    }

    // Step 4: Prevent reuse of old password
    const isNewPasswordSame = await argon2.verify(
      user.password,
      input.newPassword,
    );
    if (isNewPasswordSame) {
      throw new GraphQLError(
        "New password cannot be the same as the old password",
        {
          extensions: { code: "BAD_USER_INPUT" },
        },
      );
    }

    // Step 5: Hash and save new password
    const hashedPassword = await argon2.hash(input.newPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    user.password = hashedPassword;

    // Step 6: Save user
    await user.save();

    // Step 7: Return success message
    return {
      message: "Password updated successfully",
    };
  } catch (error) {
    const message = (error as Error).message;
    throw new GraphQLError(message, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
