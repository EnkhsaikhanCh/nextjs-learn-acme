import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { LessonV2Model } from "../../../models";

export const getLessonV2ById = async (
  _: unknown,
  { _id }: { _id: string },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["INSTRUCTOR"]);

    if (!_id) {
      throw new GraphQLError("Lesson ID is required", {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    }

    const lesson = await LessonV2Model.findById(_id).populate({
      path: "sectionId",
      model: "Section",
      populate: {
        path: "courseId",
        model: "Course",
        select: "_id slug createdBy",
      },
    });

    if (!lesson) {
      throw new GraphQLError("Lesson not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const course = lesson.sectionId?.courseId;
    const isOwner = String(course?.createdBy) === String(user?._id);
    if (!isOwner) {
      throw new GraphQLError("Access denied: Not your course", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    return lesson;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to load lesson", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
