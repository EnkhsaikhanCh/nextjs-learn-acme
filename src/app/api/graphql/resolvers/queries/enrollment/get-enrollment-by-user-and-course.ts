import { GraphQLError } from "graphql";
import { EnrollmentV2Model } from "../../../models";

export const getEnrollmentByUserAndCourse = async (
  _: unknown,
  { userId, courseId }: { userId: string; courseId: string },
) => {
  try {
    const enrollment = await EnrollmentV2Model.findOne({ userId, courseId });

    if (!enrollment) {
      throw new GraphQLError("Course not found", {
        extensions: {
          code: "COURSE_NOT_FOUND",
        },
      });
    }

    return enrollment;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Failed to fetch enrollment", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
