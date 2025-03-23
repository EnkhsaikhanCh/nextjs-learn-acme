import { LessonModel } from "../../../models";
import { GraphQLError } from "graphql";
import { UpdateLessonInput, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { validateLessonInput } from "@/utils/validateLessonInput";

export const updateLesson = async (
  _: unknown,
  { _id, input }: { _id: string; input: UpdateLessonInput },
  context: { user?: User },
) => {
  // Ensure the user is authenticated and has ADMIN role
  await requireAuthAndRoles(context.user, ["ADMIN"]);

  // Validate the lesson ID
  if (!_id) {
    throw new GraphQLError("Invalid or missing Lesson ID", {
      extensions: { code: "BAD_REQUEST" },
    });
  }

  // Validate and sanitize the input
  const {
    validatedTitle,
    validatedContent,
    validatedVideoUrl,
    validatedOrder,
    validatedIsPublished,
  } = validateLessonInput(input);

  try {
    // Find the existing lesson
    const existingLesson = await LessonModel.findById(_id);
    if (!existingLesson) {
      throw new GraphQLError("Lesson not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    // Update fields if they are provided
    if (validatedTitle) existingLesson.title = validatedTitle;
    if (validatedContent) existingLesson.content = validatedContent;
    if (validatedVideoUrl) existingLesson.videoUrl = validatedVideoUrl;
    if (validatedOrder !== undefined) existingLesson.order = validatedOrder;
    if (validatedIsPublished !== undefined)
      existingLesson.isPublished = validatedIsPublished;

    // Save the updated lesson
    const updatedLesson = await existingLesson.save();

    if (!updatedLesson) {
      throw new GraphQLError("Failed to update the lesson", {
        extensions: { code: "DATABASE_ERROR" },
      });
    }

    return updatedLesson;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
