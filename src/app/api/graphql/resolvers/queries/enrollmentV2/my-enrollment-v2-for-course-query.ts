import {
  MyEnrollmentV2ForCourseResponse,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { EnrollmentV2Model } from "../../../models";

export const myEnrollmentV2ForCourse = async (
  _: unknown,
  { courseId }: { courseId: string },
  context: { user?: UserV2 },
): Promise<MyEnrollmentV2ForCourseResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Student]);

  try {
    const enrollment = await EnrollmentV2Model.findOne({
      userId: user?._id,
      courseId,
      isDeleted: false,
    }).populate({ path: "courseId", model: "Course" });

    if (!enrollment) {
      return {
        success: false,
        message: "No enrollment found for the specified course",
        enrollment: null,
      };
    }

    return {
      success: true,
      message: "Enrollment fetched successfully",
      enrollment,
    };
  } catch {
    return {
      success: false,
      message: "Failed to fetch enrollment",
      enrollment: null,
    };
  }
};
