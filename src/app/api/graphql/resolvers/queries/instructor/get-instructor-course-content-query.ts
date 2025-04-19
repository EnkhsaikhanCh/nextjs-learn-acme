import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";

export const getInstructorCourseContent = async (
  _: unknown,
  { slug }: { slug: string },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["INSTRUCTOR"]);

    if (!slug) {
      throw new GraphQLError("Course slug is required", {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    }

    const course = await CourseModel.findOne({ slug }).populate({
      path: "sectionId",
      model: "Section",
      populate: {
        path: "lessonId",
        model: "LessonV2",
      },
    });

    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    const isOwner = String(course.createdBy) === String(user?._id);
    if (!isOwner) {
      throw new GraphQLError(
        "Access denied: You are not authorized to get this course",
        {
          extensions: { code: "FORBIDDEN" },
        },
      );
    }

    return course;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to fetch user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
