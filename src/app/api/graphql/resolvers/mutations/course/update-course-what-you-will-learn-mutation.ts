import { UpdateCourseWhatYouWillLearnInput, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";

export const updateCourseWhatYouWillLearn = async (
  _: unknown,
  {
    courseId,
    input,
  }: { courseId: string; input: UpdateCourseWhatYouWillLearnInput },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["INSTRUCTOR"]);

    if (!courseId) {
      throw new GraphQLError("Course ID is required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    const isOwner = String(course.createdBy) === String(user?._id);
    if (!isOwner) {
      throw new GraphQLError(
        "Access denied: You are not authorized to update this course",
        {
          extensions: { code: "FORBIDDEN" },
        },
      );
    }

    course.whatYouWillLearn = input.points ?? [];

    await course.save();

    return course;
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
