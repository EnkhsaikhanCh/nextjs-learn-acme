import { GraphQLError } from "graphql";
import { SectionModel } from "../../../models";

export const getSectionsByCourseId = async (
  _: unknown,
  { courseId }: { courseId: string },
) => {
  if (!courseId) {
    throw new GraphQLError("Course ID is required", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  try {
    const sections = await SectionModel.find({ courseId }).populate({
      path: "lessonId",
      model: "Lesson",
    });

    if (!sections.length) {
      throw new GraphQLError("No sections found for this course", {
        extensions: {
          code: "NOT_FOUND",
        },
      });
    }

    return sections;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;
    throw new GraphQLError(`Failed to fetch lesson: ${message}`, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
