import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { CourseModel, EnrollmentModel } from "../../../models";

export const getUserNotEnrolledCourses = async (
  _: unknown,
  { userId }: { userId: string },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["STUDENT", "ADMIN"]);

    // Зөвхөн өөрийн эсвэл ADMIN хэрэглэгч харах боломжтой
    if (user?.role !== "ADMIN" && user?._id !== userId) {
      throw new GraphQLError("Та зөвхөн өөрийн хичээлүүдийг харах боломжтой");
    }

    // Хэрэглэгчийн enroll хийсэн курсүүдийг авах
    const enrollments = await EnrollmentModel.find({ userId });
    const enrolledCourseIds = enrollments.map(
      (enrollment) => enrollment.courseId,
    );

    // Рольд тулгуурласан статус filter
    const statusFilter = user?.role === "ADMIN" ? {} : { status: "PUBLISHED" };

    // enrolledCourseIds.length === 0 үед богино query
    const query = enrolledCourseIds.length
      ? { _id: { $nin: enrolledCourseIds }, ...statusFilter }
      : { ...statusFilter };

    const coursesNotEnrolled = await CourseModel.find(query);

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
