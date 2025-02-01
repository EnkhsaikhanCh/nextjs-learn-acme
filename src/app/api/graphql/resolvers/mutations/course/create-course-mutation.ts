import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { CreateCourseInput } from "@/generated/graphql";

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
) => {
  try {
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
      slug: uniqueSlug,
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
