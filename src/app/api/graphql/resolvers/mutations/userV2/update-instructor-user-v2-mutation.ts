import {
  UpdateInstructorUserV2Input,
  UpdateUserV2Response,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { UserV2Model } from "../../../models";
import { z } from "zod";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";

const updateInstructorUserV2Schema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Instructor full name is required." })
    .max(100, {
      message: "Instructor full name must be less than 100 characters.",
    })
    .optional(),
  bio: z
    .string()
    .min(1, { message: "Instructor profile bio is required." })
    .max(1000, { message: "Instructor bio must be less than 1000 characters." })
    .optional(),
});

export const updateInstructorUserV2 = async (
  _: unknown,
  { input }: { input: UpdateInstructorUserV2Input },
  context: { user?: UserV2 },
): Promise<UpdateUserV2Response> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Instructor]);

  const validation = updateInstructorUserV2Schema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0]?.message,
    };
  }

  try {
    const existingUser = await UserV2Model.findById(user?._id);
    if (!existingUser) {
      return {
        success: false,
        message: "User not found.",
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
