import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const getEnrolledCourseContentBySlug = async (
  _: unknown,
  { slug }: { slug: string },
  context: {
    user?: User;
  },
) => {
  try {
    const { user } = context;

    // Курсыг slug-аар хайна
    const course = await CourseModel.findOne({ slug });
    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: {
          code: "COURSE_NOT_FOUND",
        },
      });
    }

    // Төвлөрсөн шалгалт хийнэ
    await requireAuthAndRoles(user, ["STUDENT", "ADMIN"], {
      requireEnrollment: true,
      courseId: course._id,
    });

    // Курсийн агуулгыг populate хийж буцаана
    const populatedCourse = await CourseModel.findOne({ slug }).populate({
      path: "sectionId",
      model: "Section",
      populate: [
        {
          path: "lessonId",
          model: "Lesson",
        },
      ],
    });

    return populatedCourse;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Failed to fetch enrolled course content", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
