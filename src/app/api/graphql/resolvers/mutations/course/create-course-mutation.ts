import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { CreateCourseInput } from "../../../schemas/course.schema";

export const createCourse = async (
  _: unknown,
  { input }: { input: CreateCourseInput },
) => {
  try {
    if (!input.title || !input.description || !input.price) {
      throw new GraphQLError(
        "Missing required fields: title, description, or price",
        {
          extensions: { code: "BAD_USER_INPUT" },
        },
      );
    }

    const lastCourse = await CourseModel.findOne().sort({ courseCode: -1 });

    let newCourseCode = "001"; // Default эхний код
    if (lastCourse && lastCourse.courseCode) {
      const lastCode = parseInt(lastCourse.courseCode, 10);
      newCourseCode = String(lastCode + 1).padStart(3, "0"); // 3 оронтой формат
    }

    const newCourse = new CourseModel({
      ...input,
      courseCode: newCourseCode,
    });

    const savedCourse = await newCourse.save();

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
