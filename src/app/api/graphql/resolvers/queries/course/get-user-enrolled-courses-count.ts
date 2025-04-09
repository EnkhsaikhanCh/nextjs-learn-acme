import { requireAuthAndRoles } from "@/lib/auth-utils";
import { EnrollmentModel } from "../../../models";
import { GraphQLError } from "graphql";
import { User } from "@/generated/graphql";

export const getUserEnrolledCoursesCount = async (
  _: unknown,
  { userId }: { userId: string },
  context: { user?: User },
) => {
  try {
    const user = context?.user;
    await requireAuthAndRoles(user, ["STUDENT", "ADMIN"]);

    // inProgressCount: "ACTIVE" статустай курсүүд
    // completedCount: "COMPLETED" статустай курсүүд
    const [inProgressCount, completedCount] = await Promise.all([
      EnrollmentModel.countDocuments({
        userId,
        status: "ACTIVE",
        isDeleted: false,
      }),
      EnrollmentModel.countDocuments({
        userId,
        status: "COMPLETED",
        isDeleted: false,
      }),
    ]);

    const totalCourses = inProgressCount + completedCount;

    // Calculate the course completion percentage.
    const courseCompletionPercentage =
      totalCourses > 0
        ? parseFloat(((completedCount / totalCourses) * 100).toFixed(2))
        : 0;

    return {
      totalCourses,
      completedCount,
      inProgressCount,
      courseCompletionPercentage,
    };
  } catch {
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
