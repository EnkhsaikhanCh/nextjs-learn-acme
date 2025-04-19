import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { LessonV2Model, SectionModel, CourseModel } from "../../../models";
import { DeleteLessonV2Response, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const deleteLessonV2 = async (
  _: unknown,
  { _id }: { _id: string },
  context: { user?: User },
): Promise<DeleteLessonV2Response> => {
  const { user } = context;
  await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

  if (!_id) {
    throw new GraphQLError("Lesson ID is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 1. Load the lesson
      const lesson = await LessonV2Model.findById(_id).session(session);
      if (!lesson) {
        throw new GraphQLError("Lesson not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // 2. Load its section
      const section = await SectionModel.findById(lesson.sectionId).session(
        session,
      );
      if (!section) {
        throw new GraphQLError("Parent section not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // 3. Load the course to check ownership
      const course = await CourseModel.findById(section.courseId).session(
        session,
      );
      if (!course) {
        throw new GraphQLError("Parent course not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const isOwner = String(course.createdBy) !== String(user?._id);
      if (isOwner) {
        throw new GraphQLError("Access denied: not your course", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      // 4. Remove the lesson reference from the section
      await SectionModel.updateOne(
        { _id: section._id },
        { $pull: { lessonId: lesson._id } },
        { session },
      );

      // 5. Delete the lesson doc itself
      await LessonV2Model.deleteOne({ _id: lesson._id }).session(session);
    });

    return {
      success: true,
      message: "Lesson deleted successfully.",
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
