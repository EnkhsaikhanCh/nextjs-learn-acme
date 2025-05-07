import { CourseModel, LessonV2Model, SectionModel } from "../../../models";
import { GetCoursePreviewDataResponse } from "@/generated/graphql";

export const getCoursePreviewData = async (
  _: unknown,
  { slug }: { slug: string },
): Promise<GetCoursePreviewDataResponse> => {
  try {
    if (!slug) {
      return {
        success: false,
        message: "Course slug is required.",
        course: null,
        totalSections: null,
        totalLessons: null,
        totalAllLessonsVideosHours: null,
      };
    }

    const course = await CourseModel.findOne({ slug });
    if (!course) {
      return {
        success: false,
        message: "Course not found.",
        course: null,
        totalSections: null,
        totalLessons: null,
        totalAllLessonsVideosHours: null,
      };
    }

    await course.populate([
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

    const sections = await SectionModel.find({ courseId: course._id })
      .populate({ path: "lessonId", model: "LessonV2" })
      .lean();

    const totalSections = sections.length;

    const lessons = await LessonV2Model.find({
      sectionId: { $in: course.sectionId },
      isPublished: true,
    });

    const totalLessons = lessons.length;

    const totalVideosDuration = lessons.reduce((total, lesson) => {
      if (lesson.duration) {
        const [minutes, seconds] = lesson.duration.split(":").map(Number);
        return total + minutes * 60 + seconds;
      }
      return total;
    }, 0);
    const totalHours = Math.floor(totalVideosDuration / 3600);

    return {
      success: true,
      message: "Course preview data fetched successfully.",
      course,
      totalSections,
      totalLessons,
      totalAllLessonsVideosHours: totalHours,
    };
  } catch {
    return {
      success: false,
      message: "Unexpected server error.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalAllLessonsVideosHours: null,
    };
  }
};
