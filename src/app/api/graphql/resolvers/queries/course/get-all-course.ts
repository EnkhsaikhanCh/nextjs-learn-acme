import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";

export const getAllCourse = async () => {
  try {
    const courses = await CourseModel.find().populate({
      path: "sectionId",
      model: "Section",
    });
    return courses;
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
