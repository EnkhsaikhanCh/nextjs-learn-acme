import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";

export const getAllCourse = async () => {
  try {
    const courses = await CourseModel.find()
      .populate({ path: "sectionId", model: "Section" })
      .populate({
        path: "enrollmentId",
        model: "Enrollment",
        populate: [
          {
            path: "userId", // `Enrollment` модел дотор `userId` байх ёстой
            select: "_id email studentId role isVerified",
          },
          {
            path: "courseId", // `Enrollment` модел дотор `courseId` байх ёстой
            select:
              "_id title description price duration createdBy categories tags status thumbnail",
          },
        ],
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
