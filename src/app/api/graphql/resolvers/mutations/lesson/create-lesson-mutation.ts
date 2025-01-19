import { GraphQLError } from "graphql";
import { CreateLessonInput } from "../../../schemas/lesson.schema";
import { LessonModel, SectionModel } from "../../../models";

export const createLesson = async (
  _: unknown,
  { input }: { input: CreateLessonInput },
) => {
  const { sectionId, title, content, videoUrl, order } = input;

  if (!sectionId || !title || !content || !videoUrl || !order) {
    throw new GraphQLError("Invalid input data", {
      extensions: { Code: "BAD_USER_INPUT" },
    });
  }

  const section = await SectionModel.findById(sectionId);
  if (!section) {
    throw new GraphQLError("Section not found", {
      extensions: { code: "SECTION_NOT_FOUND" },
    });
  }

  try {
    const newLesson = await LessonModel.create({
      sectionId,
      title,
      content,
      videoUrl,
      order,
    });
    const populatedLesson = await LessonModel.findById(newLesson._id).populate({
      path: "sectionId",
      model: "Section",
    });

    if (!populatedLesson) {
      throw new GraphQLError("Failed to retrieve the created lesson", {
        extensions: { code: "DATABASE_ERROR" },
      });
    }

    return populatedLesson;
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
