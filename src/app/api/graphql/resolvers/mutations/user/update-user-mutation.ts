import { UserModel } from "../../../models";
import { UpdateInput } from "../../../schemas/user.schema";

export const updateUser = async (
  _: unknown,
  { input, _id }: { input: UpdateInput; _id: string },
) => {
  const updatedUser = await UserModel.findByIdAndUpdate(_id, input, {
    new: true,
  });

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};
