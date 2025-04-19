import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { CourseModel, SectionModel } from "../../../models";
import { DeleteSectionResponse, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const deleteSection = async (
  _: unknown,
  { _id }: { _id: string },
  context: { user?: User },
): Promise<DeleteSectionResponse> => {
  const { user } = context;

  await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

  if (!_id) {
    throw new GraphQLError("Invalid input data", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 1. Find section
      const section = await SectionModel.findById(_id).session(session);
      if (!section) {
        throw new GraphQLError("Section not found", {
          extensions: { code: "SECTION_NOT_FOUND" },
        });
      }

      // 2. Find parent course
      const course = await CourseModel.findById(section.courseId).session(
        session,
      );
      if (!course) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "COURSE_NOT_FOUND" },
        });
      }

      // 3. Check ownership
      const isOwner = String(course.createdBy) === String(user?._id);
      if (!isOwner) {
        throw new GraphQLError("Access denied: You do not own this course", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      // 4. Delete the section
      await SectionModel.findByIdAndDelete(_id).session(session);

      // 5. Remove sectionId from course and decrement sectionCount
      await CourseModel.updateOne(
        { _id: course._id },
        {
          $pull: { sectionId: _id },
          $inc: { sectionCount: -1 },
        },
        { session },
      );
    });

    return {
      success: true,
      message: "Section амжилттай устлаа!",
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  } finally {
    session.endSession();
  }
};
