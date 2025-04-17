import { ThumbnailInput, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { z } from "zod";
import { cloudinary } from "@/lib/cloudinary";

// Zod schema for validation
const ThumbnailSchema = z.object({
  publicId: z.string().min(5).max(255),
  width: z.number().positive(),
  height: z.number().positive(),
  format: z.enum(["jpg", "jpeg", "png"]),
});

export const updateCourseThumbnail = async (
  _: unknown,
  { courseId, input }: { courseId: string; input: ThumbnailInput },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["INSTRUCTOR"]);

    if (!courseId) {
      throw new GraphQLError("Course ID is required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const validatedInput = ThumbnailSchema.safeParse(input);
    if (!validatedInput.success) {
      throw new GraphQLError("Invalid thumbnail input", {
        extensions: {
          code: "BAD_USER_INPUT",
          details: validatedInput.error.flatten(),
        },
      });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    const isOwner = String(course.createdBy) === String(user?._id);
    if (!isOwner) {
      throw new GraphQLError(
        "Access denied: You are not authorized to update this course",
        {
          extensions: { code: "FORBIDDEN" },
        },
      );
    }

    // delete old thumbnail
    if (
      course.thumbnail?.publicId &&
      course.thumbnail.publicId !== input.publicId
    ) {
      try {
        await cloudinary.uploader.destroy(course.thumbnail.publicId);
      } catch {
        throw new GraphQLError("Failed to delete previous thumbnail", {
          extensions: { code: "CLOUDINARY_ERROR" },
        });
      }
    }

    course.thumbnail = {
      publicId: input.publicId,
      width: input.width,
      height: input.height,
      format: input.format,
    };

    await course.save();

    return course;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
