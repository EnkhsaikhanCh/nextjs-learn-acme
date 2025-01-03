import { UserModel } from "../../../models";

export const getUserById = async (_: unknown, { id }: { id: string }) => {
  const user = await UserModel.findById(id);
  return user;
};
