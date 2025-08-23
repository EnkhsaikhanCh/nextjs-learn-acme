import {
  InstructorCourseOverview,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { GraphQLError } from "graphql";
import { CourseModel, EnrollmentV2Model, SectionModel } from "../../../models";
import { calculateCourseCompletionPercent } from "@/utils/courseUtils";

export const instructorCourseOverview = async (
  _: unknown,
  { slug }: { slug: string },
  context: { user?: UserV2 },
): Promise<InstructorCourseOverview> => {
  try {
    const { user } = context;

    // 🔒 Role check
    await requireAuthAndRolesV2(user, [
      UserV2Role.Admin,
      UserV2Role.Instructor,
    ]);

    const trimmedSlug = slug?.trim();
    if (!trimmedSlug) {
      throw new GraphQLError("Course slug is required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // 📘 Fetch course + createdBy user
    const course = await CourseModel.findOne({ slug }).populate({
      path: "createdBy",
      model: "UserV2",
    });

    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    const isOwner = String(course.createdBy?._id) === String(user?._id);
    const isAdmin = user?.role === UserV2Role.Admin;

    if (!isOwner && !isAdmin) {
      throw new GraphQLError("Access denied: You are not the course owner", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    // 🧠 Fetch sections and total enrollment in parallel
    const [sectionsRaw, totalEnrollment] = await Promise.all([
      SectionModel.find({ courseId: course._id })
        .populate({ path: "lessonId", model: "LessonV2" })
        .lean(),
      EnrollmentV2Model.countDocuments({ courseId: course._id }),
    ]);

    const sections = sectionsRaw.map((section) => ({
      ...section,
      _id: String(section._id),
      lessonId: Array.isArray(section.lessonId) ? section.lessonId : [],
    }));

    const totalSections = sections.length;
    const totalLessons = sections.reduce(
      (sum, section) => sum + (section.lessonId?.length || 0),
      0,
    );

    const completionPercent = calculateCourseCompletionPercent(
      course,
      sections,
    );

    return {
      course,
      totalSections,
      totalLessons,
      totalEnrollment,
      completionPercent,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError(`Internal Server Error ${error}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
