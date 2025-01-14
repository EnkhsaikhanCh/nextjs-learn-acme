// src/app/api/graphql/resolver/queries/user/get-user-by-id.ts
import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";

export const getUserById = async (_: unknown, { _id }: { _id: string }) => {
  try {
    const user = await UserModel.findById(_id);

    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: {
          code: "USER_NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    return user;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Failed to fetch user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
