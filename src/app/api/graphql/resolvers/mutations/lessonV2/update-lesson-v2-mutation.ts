import { GraphQLError } from "graphql";
import { LessonV2Model } from "../../../models";
import {
  User,
  UpdateLessonV2Response,
  UpdateLessonV2Input,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const updateLessonV2 = async (
  _: unknown,
  { _id, input }: { _id: string; input: UpdateLessonV2Input },
  context: { user?: User },
): Promise<UpdateLessonV2Response> => {
  const { user } = context;
  await requireAuthAndRoles(user, ["INSTRUCTOR"]);

  if (!_id) {
    throw new GraphQLError("Lesson ID is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  try {
    const lesson = await LessonV2Model.findById(_id).populate({
      path: "sectionId",
      populate: {
        path: "courseId",
        select: "createdBy",
      },
    });

    if (!lesson) {
      throw new GraphQLError("Lesson not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const course = lesson.sectionId?.courseId;
    if (String(course?.createdBy) !== String(user?._id)) {
      throw new GraphQLError("Access denied: Not your course", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    // Only update fields that were passed in
    const updatable: (keyof UpdateLessonV2Input)[] = [
      "title",
      "content",
      "fileUrl",
      "quizQuestions",
      "assignmentDetails",
      "order",
      "isPublished",
      "isFree",
      "passthrough",
      "status",
      "duration",
      "muxUploadId",
      "muxAssetId",
      "muxPlaybackId",
    ];

    updatable.forEach((field) => {
      if (input[field] !== undefined) {
        lesson[field] = input[field];
      }
    });

    await lesson.save();

    return {
      success: true,
      message: "Lesson updated successfully",
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to update lesson", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
