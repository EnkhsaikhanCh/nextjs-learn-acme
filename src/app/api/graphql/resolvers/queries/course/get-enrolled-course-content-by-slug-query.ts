import { GraphQLError } from "graphql";
import { CourseModel, EnrollmentModel } from "../../../models";

export const getEnrolledCourseContentBySlug = async (
  _: unknown,
  { slug }: { slug: string },
  context: { user?: { id: string } },
) => {
  try {
    const { user } = context;

    if (!user) {
      throw new GraphQLError("Authentication required", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }

    // Курсыг slug-аар хайна
    const course = await CourseModel.findOne({ slug });
    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: {
          code: "COURSE_NOT_FOUND",
        },
      });
    }

    // Бүртгэлийг шалгана
    const enrollment = await EnrollmentModel.findOne({
      userId: user.id,
      courseId: course._id,
    });

    if (!enrollment) {
      throw new GraphQLError("You are not enrolled in this course", {
        extensions: {
          code: "FORBIDDEN",
          http: { status: 403 },
        },
      });
    }

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
