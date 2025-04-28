import {
  UpdateInstructorUserV2Input,
  UpdateUserV2Response,
  User,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { UserV2Model } from "../../../models";

export const updateInstructorUserV2 = async (
  _: unknown,
  { input }: { input: UpdateInstructorUserV2Input },
  context: { user?: User },
): Promise<UpdateUserV2Response> => {
  const { user } = context;
  await requireAuthAndRoles(user, [UserV2Role.Instructor]);

  try {
    if (!user?._id) {
      return {
        success: false,
        message: "User ID is missing from context.",
      };
    }

    const existingUser = await UserV2Model.findById(user._id);
    if (!existingUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (existingUser.role !== UserV2Role.Instructor) {
      return {
        success: false,
        message: "User is not an instructor.",
      };
    }

    const fields: (keyof UpdateInstructorUserV2Input)[] = ["fullName", "bio"];

    for (const field of fields) {
      if (input[field] !== undefined) {
        existingUser[field] = input[field];
      }
    }

    await existingUser.save();

    return {
      success: true,
      message: "Instructor profile updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal error: " + (error as Error).message,
    };
  }
};
