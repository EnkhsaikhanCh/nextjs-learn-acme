import {
  UpdateLessonV2Response,
  UpdateLessonV2VideoInput,
  User,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { LessonV2Model } from "../../../models";

export const updateLessonV2Video = async (
  _: unknown,
  { _id, input }: { _id: string; input: UpdateLessonV2VideoInput },
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

    const updatable: (keyof UpdateLessonV2VideoInput)[] = [
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
