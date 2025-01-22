import { GraphQLError } from "graphql";
import { LessonModel } from "../../../models";

export const getLessonById = async (_: unknown, { _id }: { _id: string }) => {
  try {
    const lesson = await LessonModel.findById(_id);

    if (!lesson) {
      throw new GraphQLError("Lesson not found", {
        extensions: {
          code: "LESSON_NOT_FOUND",
        },
      });
    }

    return lesson;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Failed to fetch lesson", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
