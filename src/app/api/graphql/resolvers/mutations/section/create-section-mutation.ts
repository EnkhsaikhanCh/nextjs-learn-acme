import { GraphQLError } from "graphql";
import { CourseModel, SectionModel } from "../../../models";
import { CreateSectionInput } from "@/generated/graphql";

export const createSection = async (
  _: unknown,
  { input }: { input: CreateSectionInput },
) => {
  const { courseId, title } = input;

  if (!courseId || !title) {
    throw new GraphQLError("Invalid input data", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new GraphQLError("Course not found", {
      extensions: { code: "COURSE_NOT_FOUND" },
    });
  }

  let maxOrder = 0;
  if (courseId) {
    const lastSection = await SectionModel.findOne({ courseId })
      .sort({ order: -1 })
      .exec();

    maxOrder = lastSection ? lastSection.order : 0;
  }

  try {
    const newSection = await SectionModel.create({
      courseId,
      title,
      order: maxOrder + 1,
    });

    await CourseModel.findByIdAndUpdate(courseId, {
      $push: { sectionId: newSection._id },
    });

    const populatedSection = await SectionModel.findById(newSection._id)
      .populate({ path: "courseId", model: "Course" })
      .populate({ path: "lessonId", model: "Lesson" });

    if (!populatedSection) {
      throw new GraphQLError("Failed to retrieve the created section", {
        extensions: { code: "DATABASE_ERROR" },
      });
    }

    return populatedSection;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;
    throw new GraphQLError(`Internal server error: ${message}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
