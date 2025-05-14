import {
  CourseForEnrollmentResponse,
  EnrollmentStatus,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { CourseModel, EnrollmentModel } from "../../../models";

export const getCourseForEnrollment = async (
  _: unknown,
  { slug }: { slug: string },
  context: { user?: UserV2 },
): Promise<CourseForEnrollmentResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Student]);

  if (!slug) {
    return {
      success: false,
      message: "Course slug is required.",
      fullContent: null,
    };
  }

  try {
    const courseDoc = await CourseModel.findOne({ slug });
    if (!courseDoc) {
      return {
        success: false,
        message: "Course not found.",
        fullContent: null,
      };
    }

    await courseDoc.populate({
      path: "sectionId",
      model: "Section",
      populate: {
        path: "lessonId",
        model: "LessonV2",
        match: { isPublished: true },
      },
    });

    const enrollment = await EnrollmentModel.findOne({
      courseId: courseDoc._id,
      userId: user?._id,
    });

    if (
      !enrollment ||
      enrollment.status === EnrollmentStatus.Expired ||
      (!!enrollment.expiryDate && enrollment.expiryDate < new Date())
    ) {
      return {
        success: false,
        message: "Your enrollment has expired or is invalid.",
        fullContent: null,
      };
    }

    return {
      success: true,
      message: "Course fetched successfully.",
      fullContent: courseDoc,
    };
  } catch {
    return {
      success: false,
      message: "An error occurred while fetching the course.",
      fullContent: null,
    };
  }
};
