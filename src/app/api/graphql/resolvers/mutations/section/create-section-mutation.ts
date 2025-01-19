import { GraphQLError } from "graphql";
import { CreateSectionInput } from "../../../schemas/section.schema";
import { CourseModel, SectionModel } from "../../../models";

export const createSection = async (
  _: unknown,
  { input }: { input: CreateSectionInput },
) => {
  const { courseId, title, description, order } = input;

  if (!courseId || !title || !order) {
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

  try {
    const newSection = await SectionModel.create({
      courseId,
      title,
      description,
      order,
    });

    const populatedSection = await SectionModel.findById(
      newSection._id,
    ).populate({ path: "courseId", model: "Course" });

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
