import {
  EnrollmentV2Status,
  MyEnrolledCoursesResponse,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { EnrollmentV2Model } from "../../../models/enrollmentV2.model";

export const myEnrolledCoursesV2 = async (
  _: unknown,
  __: unknown,
  context: { user?: UserV2 },
): Promise<MyEnrolledCoursesResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Student]);

  try {
    const enrollments = await EnrollmentV2Model.find({
      userId: user?._id,
      isDeleted: false,
      status: {
        $in: [EnrollmentV2Status.Active, EnrollmentV2Status.Completed],
      },
    })
      .sort({ updatedAt: -1 })
      .populate({ path: "courseId", model: "Course" });

    return {
      success: true,
      message: "Enrolled courses fetched successfully",
      enrollments,
    };
  } catch {
    return {
      success: false,
      message: "Failed to fetch enrolled courses",
      enrollments: [],
    };
  }
};
