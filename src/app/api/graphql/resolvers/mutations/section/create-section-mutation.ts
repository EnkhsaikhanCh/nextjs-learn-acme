import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { CourseModel, SectionModel } from "../../../models";
import {
  CreateSectionInput,
  CreateSectionResponse,
  User,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const createSection = async (
  _: unknown,
  { input }: { input: CreateSectionInput },
  context: { user?: User },
): Promise<CreateSectionResponse> => {
  const { user } = context;
  const { courseId, title } = input;

  await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

  if (!courseId || !title) {
    throw new GraphQLError("Invalid input data", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const course = await CourseModel.findById(courseId).session(session);
      if (!course) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "COURSE_NOT_FOUND" },
        });
      }

      const isOwner = String(course.createdBy) === String(user?._id);
      if (!isOwner) {
        throw new GraphQLError("Access denied: You do not own this course", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const updatedCourse = await CourseModel.findByIdAndUpdate(
        courseId,
        { $inc: { sectionCount: 1 } },
        { new: true, runValidators: true, session },
      );
      if (!updatedCourse) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "COURSE_NOT_FOUND" },
        });
      }

      const [newSection] = await SectionModel.create(
        [
          {
            courseId,
            title,
            order: updatedCourse.sectionCount,
          },
        ],
        { session },
      );

      await CourseModel.updateOne(
        { _id: courseId },
        { $push: { sectionId: newSection._id } },
        { session },
      );
    });

    return {
      success: true,
      message: "Section амжилттай үүслээ!",
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
