import { GraphQLError } from "graphql";
import { LessonModel } from "../../../models";

export const deleteLesson = async (_: unknown, { _id }: { _id: string }) => {
  if (!_id) {
    throw new GraphQLError("Lesson ID is required", {
      extensions: { code: "BAD_REQUEST" },
    });
  }

  try {
    const lesson = await LessonModel.findById(_id);

    if (!lesson) {
      throw new GraphQLError("Lesson not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    await LessonModel.deleteOne({ _id });

    return {
      success: true,
      message: "Lesson deleted successfully",
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;

    throw new GraphQLError(`Internal server error: ${message}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
