// src/app/api/graphql/resolver/queries/user/get-all-users.ts
import { User } from "@/generated/graphql";
import { UserModel } from "../../../models";
import { GraphQLError } from "graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const getAllUser = async (
  _: unknown,
  __: unknown,
  context: {
    user?: User;
  },
) => {
  const { user } = context;

  await requireAuthAndRoles(user, ["ADMIN"]);

  try {
    const users = await UserModel.find();
    return users;
  } catch {
    throw new GraphQLError("Failed to fetch users", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
