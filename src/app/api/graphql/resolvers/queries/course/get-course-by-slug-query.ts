import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";

export const getCourseBySlug = async (
  _: unknown,
  { slug }: { slug: string },
) => {
  try {
    const course = await CourseModel.findOne({ slug }).populate({
      path: "sectionId",
      model: "Section",
      populate: [
        {
          path: "lessonId",
          select: "_id title isPublished",
        },
      ],
    });

    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: {
          code: "COURSE_NOT_FOUND",
        },
      });
    }

    return course;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Failed to fetch course", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
