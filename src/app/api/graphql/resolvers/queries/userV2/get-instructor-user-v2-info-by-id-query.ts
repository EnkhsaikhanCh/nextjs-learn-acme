import { InstructorUserV2, UserV2, UserV2Role } from "@/generated/graphql";
import { UserV2Model } from "../../../models";
import { GraphQLError } from "graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";

export const getInstructorUserV2InfoById = async (
  _: unknown,
  { _id }: { _id: string },
  context: { user?: UserV2 },
): Promise<InstructorUserV2> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Instructor]);

  try {
    const existingInstructor = await UserV2Model.findById(_id);

    if (!existingInstructor) {
      throw new GraphQLError("Instructor not found.", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    if (user?._id !== existingInstructor._id) {
      throw new GraphQLError("Access denied.", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    return existingInstructor;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch instructor.", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
