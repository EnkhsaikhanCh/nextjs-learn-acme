import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { CourseModel, SectionModel, LessonModel } from "../../../models";
import {
  CreateLessonInput,
  CreateLessonResponse,
  User,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const createLesson = async (
  _: unknown,
  { input }: { input: CreateLessonInput },
  context: { user?: User },
): Promise<CreateLessonResponse> => {
  const { user } = context;
  const { sectionId, title } = input;

  await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

  if (!sectionId || !title.trim()) {
    throw new GraphQLError("Invalid input data", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 1. Load section
      const section = await SectionModel.findById(sectionId).session(session);
      if (!section) {
        throw new GraphQLError("Section not found", {
          extensions: { code: "SECTION_NOT_FOUND" },
        });
      }

      // 2. Load parent course and check ownership
      const course = await CourseModel.findById(section.courseId).session(
        session,
      );
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

      // 3. Determine new lesson order
      const lastLesson = await LessonModel.findOne({ sectionId })
        .sort({ order: -1 })
        .session(session);
      const nextOrder = (lastLesson?.order ?? 0) + 1;

      // 4. Create the lesson
      const [newLesson] = await LessonModel.create(
        [
          {
            sectionId,
            title,
            order: nextOrder,
          },
        ],
        { session },
      );

      // 6. Push into section.lessonId
      await SectionModel.updateOne(
        { _id: sectionId },
        { $push: { lessonId: newLesson._id } },
        { session },
      );
    });

    return {
      success: true,
      message: "Lesson successfully created!",
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
