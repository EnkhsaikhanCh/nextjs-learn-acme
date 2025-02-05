// src/app/api/graphql/resolver/mutation/user/update-user-mutation.ts
import { UpdateInput } from "@/generated/graphql";
import { UserModel } from "../../../models";

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
