// src/app/api/graphql/resolver/queries/user/get-all-users.ts
import { UserModel } from "../../../models";

export const getAllUser = async () => {
  const users = await UserModel.find();
  return users;
};
