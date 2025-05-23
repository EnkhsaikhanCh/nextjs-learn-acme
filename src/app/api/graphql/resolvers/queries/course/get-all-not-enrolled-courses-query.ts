import { CoursesQueryResponse, UserV2, UserV2Role } from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { CourseModel, EnrollmentV2Model } from "../../../models";

export const getAllNotEnrolledCourses = async (
  _: unknown,
  __: unknown,
  context: { user?: UserV2 },
): Promise<CoursesQueryResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Student]);

  try {
    // Хэрэглэгчийн enroll хийсэн курсүүдийг авах
    const enrollments = await EnrollmentV2Model.find({
      userId: user?._id,
      status: ["ACTIVE", "COMPLETED"],
      isDeleted: false,
    });

    const enrolledCourseIds = enrollments.map((e) => e.courseId);

    // Хэрэглэгч элсээгүй курсүүдийг авах query
    const query = enrolledCourseIds.length
      ? {
          _id: { $nin: enrolledCourseIds },
          status: "PUBLISHED",
        }
      : {
          status: "PUBLISHED",
        };

    const courses = await CourseModel.find(query).populate({
      path: "createdBy",
      model: "UserV2",
    });

    return {
      success: true,
      message: "Successfully fetched courses not enrolled by user",
      courses,
    };
  } catch {
    return {
      success: false,
      message: "Failed to fetch not enrolled courses",
      courses: [],
    };
  }
};
