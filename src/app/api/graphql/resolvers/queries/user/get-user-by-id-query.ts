// src/app/api/graphql/resolver/queries/user/get-user-by-id.ts
import { GraphQLError } from "graphql";
import { requireUser } from "../../../auth";
import { UserModel } from "../../../models";
import { Context } from "../../../schemas/user.schema";

export const me = async (_: unknown, __: unknown, context: Context) => {
  // context.user байхгүй бол null буцаана
  if (!context.user) return null;

  try {
    const user = await UserModel.findById(context.user._id);
    return user;
  } catch (error) {
    const message = (error as Error).message;
    throw new GraphQLError(`Failed to fetch user: ${message}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};

export const getUserById = async (
  _: unknown,
  { _id }: { _id: string },
  context: Context,
) => {
  try {
    requireUser(context);

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
    // Handle known GraphQL errors
    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;
    throw new GraphQLError(`Failed to fetch user: ${message}`, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
