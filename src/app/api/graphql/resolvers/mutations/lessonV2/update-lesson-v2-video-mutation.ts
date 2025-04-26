import {
  UpdateLessonV2Response,
  UpdateLessonV2VideoInput,
  User,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { LessonV2Model } from "../../../models";

export const updateLessonV2Video = async (
  _: unknown,
  { _id, input }: { _id: string; input: UpdateLessonV2VideoInput },
  context: { user?: User },
): Promise<UpdateLessonV2Response> => {
  const { user } = context;
  await requireAuthAndRoles(user, ["INSTRUCTOR"]);

  if (!_id) {
    return {
      success: false,
      message: "Lesson ID is required",
    };
  }

  try {
    const lesson = await LessonV2Model.findById(_id).populate({
      path: "sectionId",
      populate: { path: "courseId", select: "createdBy" },
    });

    if (!lesson) {
      return {
        success: false,
        message: "Lesson not found",
      };
    }

    const course = lesson.sectionId?.courseId;
    if (String(course?.createdBy) !== String(user?._id)) {
      return {
        success: false,
        message: "Access denied: Not your course",
      };
    }

    if (input.passthrough) {
      lesson.passthrough = input.passthrough;
    }
    if (input.status) {
      lesson.status = input.status;
    }
    if (input.duration) {
      lesson.duration = input.duration;
    }
    if (input.muxUploadId) {
      lesson.muxUploadId = input.muxUploadId;
    }
    if (input.muxAssetId) {
      lesson.muxAssetId = input.muxAssetId;
    }
    if (input.muxPlaybackId) {
      lesson.muxPlaybackId = input.muxPlaybackId;
    }

    await lesson.save();

    return {
      success: true,
      message: "Lesson updated successfully",
    };
  } catch (error) {
    console.error("[updateLessonV2Video] Unexpected error:", error);
    return {
      success: false,
      message: "Internal error: " + (error as Error).message,
    };
  }
};
