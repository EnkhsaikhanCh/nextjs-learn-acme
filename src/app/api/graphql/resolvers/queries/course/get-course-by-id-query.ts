import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";

export const getCourseById = async (_: unknown, { _id }: { _id: string }) => {
  try {
    const course = await CourseModel.findById(_id).populate({
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

    throw new GraphQLError("Failed to fetch user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
