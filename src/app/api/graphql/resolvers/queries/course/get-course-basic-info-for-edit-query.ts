import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models/course.model";

export const getCourseBasicInfoForEdit = async (
  _: unknown,
  { slug }: { slug: string },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

    if (!slug) {
      throw new GraphQLError("Course slug is required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    const course = await CourseModel.findOne({ slug });
    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    const isAdmin = user?.role.includes("ADMIN");
    const isOwner = String(course.createdBy) === String(user?._id);

    if (!isOwner && !isAdmin) {
      throw new GraphQLError("Access denied: You are not the course owner", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    await course.populate({ path: "createdBy", model: "User" });

    return course;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
