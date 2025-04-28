import { GraphQLError } from "graphql";
import { UserV2Model } from "../../../models";
import { User, UserV2Role } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const getUserV2ById = async (
  _: unknown,
  { _id }: { _id: string },
  context: { user?: User },
) => {
  const { user } = context;
  await requireAuthAndRoles(user, [
    UserV2Role.Student,
    UserV2Role.Instructor,
    UserV2Role.Admin,
  ]);

  try {
    const existingUser = await UserV2Model.findById(_id);

    if (!existingUser) {
      throw new GraphQLError("User not found.", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (user?._id !== existingUser._id) {
      throw new GraphQLError("Access denied.", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    return existingUser;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch user.", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
