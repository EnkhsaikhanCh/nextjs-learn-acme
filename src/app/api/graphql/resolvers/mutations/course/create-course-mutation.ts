import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { CreateCourseInput, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { generateUniqueSlug } from "@/utils/generate-unique-slug";
import { generateNextCourseCode } from "@/utils/generate-next-course-code";

export const createCourse = async (
  _: unknown,
  { input }: { input: CreateCourseInput },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

    const { title } = input;

    if (!title) {
      throw new GraphQLError("Missing required title field", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const uniqueSlug = await generateUniqueSlug(title, CourseModel);

    const newCourseCode = await generateNextCourseCode();

    const newCourse = new CourseModel({
      title,
      createdBy: user?._id,
      slug: uniqueSlug,
      courseCode: newCourseCode,
    });

    const savedCourse = await newCourse.save();

    return savedCourse;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
