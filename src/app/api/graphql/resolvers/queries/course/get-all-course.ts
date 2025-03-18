import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const getAllCourse = async (
  _: unknown,
  __: unknown,
  context: { user?: User },
) => {
  try {
    const user = context?.user;

    // Хэрэглэгчийн эрхийг шалгах
    await requireAuthAndRoles(user, ["STUDENT", "ADMIN"]);

    // STUDENT бол зөвхөн PUBLISHED курсуудыг авах
    const filter = user?.role === "STUDENT" ? { status: "PUBLISHED" } : {};

    // Курсүүдийг авах
    const courses = await CourseModel.find(filter).populate({
      path: "sectionId",
      model: "Section",
    });

    return courses;
  } catch {
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
