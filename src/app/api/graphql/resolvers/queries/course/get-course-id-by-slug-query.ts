import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";

export const getCourseIdBySlug = async (
  _: unknown,
  { slug }: { slug: string },
) => {
  try {
    const course = await CourseModel.findOne({ slug });

    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: {
          code: "COURSE_NOT_FOUND",
        },
      });
    }

    return course;
  } catch {
    throw new GraphQLError("Failed to fetch user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
