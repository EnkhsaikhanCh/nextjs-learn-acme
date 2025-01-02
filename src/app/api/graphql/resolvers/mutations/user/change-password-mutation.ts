import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import { ChangePasswordInput } from "../../../schemas/user.schema";
import bcrypt from "bcrypt";

const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export const changePassword = async (
  _: unknown,
  { input, _id }: { input: ChangePasswordInput; _id: string },
) => {
  try {
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(input.currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    if (!strongPasswordRegex.test(input.newPassword)) {
      throw new Error(
        "Password must be at least 8 characters long and include letters and numbers.",
      );
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return {
      message: "Password updated successfully",
    };
  } catch (error) {
    const message = (error as Error).message;
    throw new GraphQLError(message);
  }
};
