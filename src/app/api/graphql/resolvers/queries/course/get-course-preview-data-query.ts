import { parseDurationToSeconds } from "@/utils/parseDurationToSeconds";
import {
  CourseModel,
  EnrollmentV2Model,
  LessonV2Model,
  SectionModel,
} from "../../../models";
import {
  GetCoursePreviewDataResponse,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";

export const getCoursePreviewData = async (
  _: unknown,
  { slug }: { slug: string },
  context: { user?: UserV2 },
): Promise<GetCoursePreviewDataResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [
    UserV2Role.Admin,
    UserV2Role.Instructor,
    UserV2Role.Student,
  ]);

  if (!slug) {
    return {
      success: false,
      message: "Course slug is required.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalLessonDurationSeconds: null,
      totalLessonDurationHours: null,
      isEnrolled: null,
    };
  }

  try {
    const course = await CourseModel.findOne({ slug }).populate([
      { path: "createdBy", model: "UserV2" },
      {
        path: "sectionId",
        model: "Section",
        populate: {
          path: "lessonId",
          model: "LessonV2",
        },
      },
    ]);

    if (!course) {
      return {
        success: false,
        message: "Course not found.",
        course: null,
        totalSections: null,
        totalLessons: null,
        totalLessonDurationSeconds: null,
        totalLessonDurationHours: null,
        isEnrolled: null,
      };
    }

    const isEnrolled = await EnrollmentV2Model.exists({
      courseId: course._id,
      userId: user?._id,
      status: "ACTIVE",
    });

    const sections = await SectionModel.find({ courseId: course._id })
      .populate({ path: "lessonId", model: "LessonV2" })
      .lean();

    const totalSections = sections.length;

    const lessons = await LessonV2Model.find({
      sectionId: { $in: course.sectionId },
      isPublished: true,
    }).lean();

    const totalLessons = lessons.length;

    const totalLessonDurationSeconds = lessons.reduce((sum, lesson) => {
      return (
        sum + (lesson.duration ? parseDurationToSeconds(lesson.duration) : 0)
      );
    }, 0);

    const totalLessonDurationHours = Math.floor(
      totalLessonDurationSeconds / 3600,
    );

    return {
      success: true,
      message: "Course preview data fetched successfully.",
      course,
      totalSections,
      totalLessons,
      totalLessonDurationSeconds,
      totalLessonDurationHours,
      isEnrolled: Boolean(isEnrolled),
    };
  } catch {
    return {
      success: false,
      message: "Unexpected server error.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalLessonDurationSeconds: null,
      totalLessonDurationHours: null,
      isEnrolled: null,
    };
  }
};
