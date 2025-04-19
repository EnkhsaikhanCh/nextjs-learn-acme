import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { LessonV2Model, SectionModel, CourseModel } from "../../../models";
import {
  CreateLessonV2Input,
  CreateLessonV2Response,
  User,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const createLessonV2 = async (
  _: unknown,
  { input }: { input: CreateLessonV2Input },
  context: { user?: User },
): Promise<CreateLessonV2Response> => {
  const { user } = context;
  const { sectionId, title, type, order: overrideOrder } = input;

  await requireAuthAndRoles(user, ["ADMIN", "INSTRUCTOR"]);

  if (!sectionId || !title.trim()) {
    throw new GraphQLError("Section, title and type are required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const section = await SectionModel.findById(sectionId).session(session);
      if (!section) {
        throw new GraphQLError("Section not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const course = await CourseModel.findById(section.courseId).session(
        session,
      );
      if (!course) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (String(course.createdBy) !== String(user?._id)) {
        throw new GraphQLError("Forbidden", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const last = await LessonV2Model.findOne({ sectionId })
        .sort({ order: -1 })
        .session(session);
      const nextOrder = overrideOrder ?? (last?.order ?? 0) + 1;

      const [stub] = await LessonV2Model.create(
        [
          {
            sectionId,
            title,
            type,
            order: nextOrder,
          },
        ],
        { session },
      );

      await SectionModel.updateOne(
        { _id: sectionId },
        { $push: { lessonId: stub._id } },
        { session },
      );
    });

    return {
      success: true,
      message: "Lesson stub created. Fill in details with updateLessonV2.",
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
