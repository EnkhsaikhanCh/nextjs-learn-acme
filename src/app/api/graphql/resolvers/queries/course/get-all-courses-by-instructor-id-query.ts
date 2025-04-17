import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { CourseModel } from "../../../models";
import { GraphQLError } from "graphql";

export const getAllCoursesByInstructurId = async (
  _: unknown,
  _args: unknown,
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

    const courses = await CourseModel.find({ createdBy: user?._id });

    return courses;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
