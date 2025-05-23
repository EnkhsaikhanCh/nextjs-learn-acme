import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { EnrollmentV2Model } from "../../../models";

export const getUserEnrolledCourses = async (
  _: unknown,
  { userId }: { userId: string },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["STUDENT", "ADMIN"]);

    if (user?.role !== "ADMIN" && user?._id !== userId) {
      throw new GraphQLError("Та зөвхөн өөрийн хичээлүүдийг харах боломжтой");
    }

    // Хэрэглэгчийн enroll хийсэн хичээлүүдийг олох:
    // - isDeleted: false гэдэг нь устгасан мэдээллийг гаргаахгүй.
    // - status: ACTIVE эсвэл COMPLETED гэсэн фильтр тавиад зөвхөн идэвхтэй буюу дууссан курсуудыг авах.
    const enrollments = await EnrollmentV2Model.find({
      userId,
      isDeleted: false,
      status: { $in: ["ACTIVE", "COMPLETED"] },
    }).populate({ path: "courseId", model: "Course" });

    return enrollments;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
