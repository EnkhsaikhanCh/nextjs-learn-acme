import { GraphQLError } from "graphql";
import { LessonModel } from "../../../models";
import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const deleteLesson = async (
  _: unknown,
  { _id }: { _id: string },
  context: { user?: User },
) => {
  const { user } = context;

  await requireAuthAndRoles(user, ["ADMIN"]);

  if (!_id) {
    throw new GraphQLError("Lesson ID is required", {
      extensions: { code: "BAD_REQUEST" },
    });
  }

  try {
    const existingLesson = await LessonModel.findById(_id);

    if (!existingLesson) {
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
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
