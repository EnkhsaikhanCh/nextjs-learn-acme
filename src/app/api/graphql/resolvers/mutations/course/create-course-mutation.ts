import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { CreateCourseInput, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

const slugify = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9а-яөү]/g, " ") // Тусгай тэмдэгтүүдийг устгах
    .trim()
    .replace(/\s+/g, "-"); // Сул зайг "-" болгох
};

export const createCourse = async (
  _: unknown,
  { input }: { input: CreateCourseInput },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

    if (!input.title) {
      throw new GraphQLError("Missing required title field", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const generatedSlug = slugify(input.title);

    // slug давхцах эсэхийг шалгах
    let uniqueSlug = generatedSlug;
    let count = 1;
    while (await CourseModel.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${generatedSlug}-${count}`;
      count++;
    }

    const lastCourse = await CourseModel.findOne().sort({ courseCode: -1 });

    let newCourseCode = "001"; // Default эхний код
    if (lastCourse && lastCourse.courseCode) {
      const lastCode = parseInt(lastCourse.courseCode, 10);
      newCourseCode = String(lastCode + 1).padStart(3, "0"); // 3 оронтой формат
    }

    const newCourse = new CourseModel({
      ...input,
      createdBy: user?._id,
      slug: uniqueSlug,
      courseCode: newCourseCode,
    });

    const savedCourse = await newCourse.save();

    await savedCourse.populate({ path: "createdBy", model: "User" });

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
