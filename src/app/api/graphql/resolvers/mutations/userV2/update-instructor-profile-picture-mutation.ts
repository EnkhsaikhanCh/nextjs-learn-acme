import {
  UpdateUserV2Response,
  UploadProfilePictureInput,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { z } from "zod";
import { UserV2Model } from "../../../models";
import { cloudinary } from "@/lib/cloudinary";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";

const ProfilePictureSchema = z.object({
  publicId: z.string().min(5).max(255),
  width: z.number().positive(),
  height: z.number().positive(),
  format: z.enum(["jpg", "jpeg", "png"]),
});

export const updateInstructorProfilePicture = async (
  _: unknown,
  { _id, input }: { _id: string; input: UploadProfilePictureInput },
  context: { user?: UserV2 },
): Promise<UpdateUserV2Response> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Instructor]);

  if (!_id) {
    return {
      success: false,
      message: "User ID is missing.",
    };
  }

  // Validate input
  const validation = ProfilePictureSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0]?.message,
    };
  }

  try {
    const existingUser = await UserV2Model.findById(_id);
    if (!existingUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Ensure owner
    if (existingUser._id !== user!._id) {
      return {
        success: false,
        message: "Access denied: cannot update another instructor’s picture.",
      };
    }

    if (
      existingUser.profilePicture?.publicId &&
      existingUser.profilePicture.publicId !== input.publicId
    ) {
      try {
        await cloudinary.uploader.destroy(existingUser.profilePicture.publicId);
      } catch {
        return {
          success: false,
          message: "Failed to delete previous thumbnail.",
        };
      }
    }

    existingUser.profilePicture = {
      publicId: input.publicId,
      width: input.width,
      height: input.height,
      format: input.format,
    };

    await existingUser.save();

    return {
      success: true,
      message: "Profile picture updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal error: " + (error as Error).message,
    };
  }
};
