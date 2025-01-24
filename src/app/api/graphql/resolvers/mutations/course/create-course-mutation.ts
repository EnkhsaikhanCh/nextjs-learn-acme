import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { CreateCourseInput } from "../../../schemas/course.schema";

export const createCourse = async (
  _: unknown,
  { input }: { input: CreateCourseInput },
) => {
  try {
    // Validate input
    if (!input.title || !input.description || !input.price) {
      throw new GraphQLError(
        "Missing required fields: title, description, or price",
        {
          extensions: { code: "BAD_USER_INPUT" },
        },
      );
    }

    const savedCourse = await CourseModel.create(input);

    return savedCourse;
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
