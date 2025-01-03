import { UserModel } from "../../../models";

export const getAllUser = async () => {
  const users = await UserModel.find();
  return users;
};
