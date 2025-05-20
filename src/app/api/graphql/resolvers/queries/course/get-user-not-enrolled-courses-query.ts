import { UserV2, UserV2Role } from "@/generated/graphql";
import { GraphQLError } from "graphql";
import { CourseModel, EnrollmentV2Model } from "../../../models";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";

export const getUserNotEnrolledCourses = async (
  _: unknown,
  { userId }: { userId: string },
  context: { user?: UserV2 },
) => {
  try {
    const { user } = context;
    await requireAuthAndRolesV2(user, [UserV2Role.Student]);

    // Хэрэглэгчийн enroll хийсэн курсүүдийг авах
    const enrollments = await EnrollmentV2Model.find({
      userId,
      status: ["ACTIVE", "COMPLETED"],
      isDeleted: false,
    });
    const enrolledCourseIds = enrollments.map(
      (enrollment) => enrollment.courseId,
    );

    // Рольд тулгуурласан статус filter
    const statusFilter = user?.role === "ADMIN" ? {} : { status: "PUBLISHED" };

    // enrolledCourseIds.length === 0 үед богино query
    const query = enrolledCourseIds.length
      ? { _id: { $nin: enrolledCourseIds }, ...statusFilter }
      : { ...statusFilter };

    const coursesNotEnrolled = await CourseModel.find(query).populate({
      path: "createdBy",
      model: "UserV2",
    });

    return coursesNotEnrolled;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
