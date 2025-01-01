import { UserModel } from "../../../models";
import { RegisterInput } from "../../../schemas/user.schema";
import bcrypt from "bcrypt";

export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
) => {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await UserModel.create({ ...input, password: hashedPassword });

  return user.toObject();
};
