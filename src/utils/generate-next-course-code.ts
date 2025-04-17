// src/utils/generate-next-course-code.ts

import { CourseModel } from "@/app/api/graphql/models";
import { GraphQLError } from "graphql";

export const generateNextCourseCode = async (): Promise<string> => {
  try {
    const lastCourse = await CourseModel.findOne().sort({ courseCode: -1 });

    if (!lastCourse || !lastCourse.courseCode) {
      return "001";
    }

    const lastCode = parseInt(lastCourse.courseCode, 10);

    if (isNaN(lastCode)) {
      throw new GraphQLError("Invalid course code format in database", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }

    return String(lastCode + 1).padStart(3, "0");
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to generate next course code", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
