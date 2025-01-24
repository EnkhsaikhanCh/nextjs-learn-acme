import { sanitizeInput } from "@/utils/sanitize";
import { UpdateLessonInput } from "../../../schemas/lesson.schema";
import { LessonModel } from "../../../models";
import { GraphQLError } from "graphql";

export const updateLesson = async (
  _: unknown,
  { _id, input }: { _id: string; input: UpdateLessonInput },
) => {
  const { title, content, videoUrl, order, isPublished } = input;

  if (!_id) {
    throw new Error("Lesson ID is required");
  }

  const sanitizedTitle = sanitizeInput(title || "");
  const sanitizedContent = sanitizeInput(content || "");
  const sanitizedOrder = order !== undefined ? order : 0; // Default to 0 or another value
  const sanitizedIsPublished = isPublished !== undefined ? isPublished : false; // Default to false or another value

  try {
    const lesson = await LessonModel.findById(_id);

    if (!lesson) {
      throw new GraphQLError("Lesson not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (title) {
      lesson.title = sanitizedTitle;
    }

    if (content) {
      lesson.content = sanitizedContent;
    }

    if (videoUrl) {
      lesson.videoUrl = videoUrl;
    }

    if (order !== undefined) {
      lesson.order = sanitizedOrder;
    }

    if (isPublished !== undefined) {
      lesson.isPublished = sanitizedIsPublished;
    }

    const updatedLesson = await lesson.save();

    return updatedLesson;
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
