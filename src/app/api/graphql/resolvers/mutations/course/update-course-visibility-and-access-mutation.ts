import {
  CourseStatus,
  UpdateCourseVisibilityAndAccessInput,
  User,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { z } from "zod";

// Zod schema for validation
const UpdateVisibilitySchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  status: z.nativeEnum(CourseStatus),
});

export const updateCourseVisibilityAndAccess = async (
  _: unknown,
  { input }: { input: UpdateCourseVisibilityAndAccessInput },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["INSTRUCTOR"]);

    // Validate input using zod
    const validated = UpdateVisibilitySchema.safeParse(input);
    if (!validated.success) {
      throw new GraphQLError("Invalid input for course visibility", {
        extensions: {
          code: "BAD_USER_INPUT",
          details: validated.error.flatten(),
        },
      });
    }

    const course = await CourseModel.findById(input.courseId);
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

    course.status = input.status;

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
