import { GraphQLError } from "graphql";
import { EnrollmentModel } from "../../../models";

export const checkEnrollment = async (
  _: unknown,
  { courseId, userId }: { courseId: string; userId: string },
) => {
  try {
    if (!courseId || !userId) {
      throw new GraphQLError("Course ID and User ID are required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Fetch enrollment
    const enrollment = await EnrollmentModel.findOne({ courseId, userId })
      .populate({ path: "courseId", model: "Course" })
      .populate({ path: "userId", model: "User" });

    if (!enrollment) {
      return null;
    }

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
