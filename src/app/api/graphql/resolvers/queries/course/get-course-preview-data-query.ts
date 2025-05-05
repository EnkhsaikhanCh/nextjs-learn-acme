import { GraphQLError } from "graphql";
import { CourseModel, LessonV2Model, SectionModel } from "../../../models";
import { GetCoursePreviewDataResponse } from "@/generated/graphql";

export const getCoursePreviewData = async (
  _: unknown,
  { slug }: { slug: string },
): Promise<GetCoursePreviewDataResponse> => {
  try {
    if (!slug) {
      throw new GraphQLError("Course slug is required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const course = await CourseModel.findOne({ slug });

    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
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
      course: course,
      totalSections,
      totalLessons,
      totalAllLessonsVideosHours: totalHours,
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
