import {
  EnrollmentV2MutationResponse,
  UpdateLessonCompletionStatusInput,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { CourseModel, EnrollmentV2Model } from "../../../models";

type Section = {
  lessonId: string[];
};

export const updateLessonCompletionStatus = async (
  _: unknown,
  { input }: { input: UpdateLessonCompletionStatusInput },
  context: { user?: UserV2 },
): Promise<EnrollmentV2MutationResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Student]);

  const { enrollmentId, lessonId, completed } = input;
  if (!enrollmentId?.trim() || !lessonId?.trim()) {
    return {
      success: false,
      message: "Enrollment ID and Lesson ID are required",
    };
  }

  try {
    const enrollment = await EnrollmentV2Model.findById(enrollmentId);
    if (!enrollment) {
      return {
        success: false,
        message: "Enrollment not found",
      };
    }

    if (enrollment.userId.toString() !== user?._id) {
      return {
        success: false,
        message: "You are not authorized to update this enrollment",
      };
    }

    const course = await CourseModel.findById(enrollment.courseId).populate({
      path: "sectionId",
      populate: {
        path: "lessonId",
        model: "LessonV2",
        match: { isPublished: true },
      },
    });
    if (!course) {
      return {
        success: false,
        message: "Course not found",
      };
    }

    const totalLessons = course.sectionId.reduce(
      (total: number, section: Section) => total + section.lessonId.length,
      0,
    );

    const now = new Date();
    const alreadyCompleted = enrollment.completedLessons.includes(lessonId);

    if (completed && !alreadyCompleted) {
      enrollment.completedLessons.push(lessonId);
    } else if (!completed && alreadyCompleted) {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id: string) => id !== lessonId,
      );
    }

    enrollment.progress = Math.min(
      (enrollment.completedLessons.length / totalLessons) * 100,
      100,
    );
    enrollment.updatedAt = now;
    enrollment.lastAccessedAt = now;
    enrollment.history.push({
      status: completed ? "MARKED_COMPLETED" : "UNMARKED_COMPLETED",
      progress: enrollment.progress,
      updatedAt: now,
    });

    await enrollment.save();

    return {
      success: true,
      message: completed
        ? "Lesson marked as completed successfully"
        : "Lesson unmarked as completed successfully",
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};
