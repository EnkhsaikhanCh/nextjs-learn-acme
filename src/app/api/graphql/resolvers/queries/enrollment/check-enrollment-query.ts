import { GraphQLError } from "graphql";
import { CourseModel, EnrollmentV2Model } from "../../../models";
import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const checkEnrollment = async (
  _: unknown,
  { courseId }: { courseId: string },
  context: { user?: User },
) => {
  const { user } = context;
  await requireAuthAndRoles(user, ["STUDENT", "ADMIN"]);

  const currentUserId = user?._id;

  if (!courseId) {
    throw new GraphQLError("Course are required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const existingCourse = await CourseModel.findById(courseId);
  if (!existingCourse) {
    throw new GraphQLError("Course not found", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  try {
    // Fetch enrollment
    const enrollment = await EnrollmentV2Model.findOne({
      courseId,
      userId: currentUserId,
    })
      .populate({ path: "courseId", model: "Course" })
      .populate({ path: "userId", model: "User" });

    if (
      enrollment.expiryDate &&
      enrollment.expiryDate < new Date() &&
      enrollment.status !== "EXPIRED"
    ) {
      enrollment.status = "EXPIRED";
      await enrollment.save();
    }

    return enrollment;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;
    throw new GraphQLError(`Failed to check enrollment: ${message}`, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
