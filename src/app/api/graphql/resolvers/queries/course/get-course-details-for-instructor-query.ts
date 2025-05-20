import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { CourseModel, EnrollmentV2Model, SectionModel } from "../../../models";

export const getCourseDetailsForInstructor = async (
  _: unknown,
  { slug }: { slug: string },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

    if (!slug) {
      throw new GraphQLError("Course slug required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const course = await CourseModel.findOne({ slug });

    if (!course) {
      throw new GraphQLError("Coures not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    const isAdmin = user?.role.includes("ADMIN");
    const isOwner = String(course.createdBy) === String(user?._id);

    if (!isOwner && !isAdmin) {
      throw new GraphQLError("Access denied: You are not the course owner", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    const populatedCourse = await course.populate({
      path: "createdBy",
      model: "User",
    });

    const sections = await SectionModel.find({ courseId: course._id })
      .populate({ path: "lessonId", model: "LessonV2" })
      .lean();

    const totalSections = sections.length;

    const totalLessons = sections.reduce((sum, section) => {
      return sum + (section.lessonId?.length || 0);
    }, 0);

    const totalEnrollment = await EnrollmentV2Model.countDocuments({
      courseId: course._id,
    });

    return {
      course: populatedCourse,
      totalSections,
      totalLessons,
      totalEnrollment,
    };
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
