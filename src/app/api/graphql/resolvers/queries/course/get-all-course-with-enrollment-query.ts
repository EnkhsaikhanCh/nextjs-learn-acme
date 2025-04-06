import { GraphQLError } from "graphql";
import { CourseModel, EnrollmentModel } from "../../../models";
import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const getAllCourseWithEnrollment = async (
  _: unknown,
  __: unknown,
  context: { user?: User },
) => {
  try {
    const user = context?.user;

    await requireAuthAndRoles(user, ["STUDENT", "ADMIN"]);

    const filter = user?.role === "STUDENT" ? { status: "PUBLISHED" } : {};

    const courses = await CourseModel.find(filter).lean();

    // Хэрэглэгчийн бүртгэлтэй курсүүдийг олж авах
    const enrollments = await EnrollmentModel.find({
      userId: user!._id,
    }).select("courseId");

    const enrolledCourseIds = new Set(
      enrollments.map((e) => e.courseId.toString()),
    );

    // Курс бүрт isEnrolled property-г нэмэх
    const coursesWithEnrollment = courses.map((course) => ({
      ...course,
      isEnrolled: enrolledCourseIds.has((course._id as string).toString()),
    }));

    return coursesWithEnrollment;
  } catch {
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
