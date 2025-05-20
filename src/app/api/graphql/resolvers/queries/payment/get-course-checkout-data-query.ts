import {
  EnrollmentV2Status,
  GetCourseCheckoutDataResponse,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import {
  CourseModel,
  EnrollmentV2Model,
  PaymentModel,
  UserV2Model,
} from "../../../models";

export const getCourseCheckoutData = async (
  _: unknown,
  { slug }: { slug: string },
  context: { user?: UserV2 },
): Promise<GetCourseCheckoutDataResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Student]);

  if (!slug) {
    return {
      success: false,
      message: "Slug is required",
      course: null,
      user: null,
      isPaid: null,
      isEnrolled: null,
    };
  }

  try {
    const course = await CourseModel.findOne({ slug });
    if (!course) {
      return {
        success: false,
        message: "Course not found",
        course: null,
        user: null,
        isPaid: null,
        isEnrolled: false,
      };
    }

    const existingUser = await UserV2Model.findById(user?._id);
    if (!user) {
      return {
        success: false,
        message: "User not found",
        course: null,
        user: null,
        isPaid: null,
        isEnrolled: null,
      };
    }

    const isPaid = await PaymentModel.exists({
      userId: existingUser._id,
      courseId: course._id,
      status: "PENDING",
    });

    const isEnrolled = await EnrollmentV2Model.exists({
      userId: existingUser._id,
      courseId: course._id,
      status: EnrollmentV2Status.Active,
    });

    return {
      success: true,
      message: "Course data fetched successfully",
      course,
      user: existingUser,
      isPaid: Boolean(isPaid),
      isEnrolled: Boolean(isEnrolled),
    };
  } catch {
    return {
      success: false,
      message: "Error fetching course data",
      course: null,
      user: null,
      isEnrolled: null,
    };
  }
};
