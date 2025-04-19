import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { CourseModel, SectionModel } from "../../../models";
import {
  UpdateSectionInput,
  UpdateSectionResponse,
  User,
} from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const updateSection = async (
  _: unknown,
  { _id, input }: { _id: string; input: UpdateSectionInput },
  context: { user?: User },
): Promise<UpdateSectionResponse> => {
  const { user } = context;
  await requireAuthAndRoles(user, ["INSTRUCTOR"]);

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 1. Load the section
      const section = await SectionModel.findById(_id).session(session);
      if (!section) {
        throw new GraphQLError("Section not found", {
          extensions: { code: "SECTION_NOT_FOUND" },
        });
      }

      // 2. Load its parent course
      const course = await CourseModel.findById(section.courseId).session(
        session,
      );
      if (!course) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "COURSE_NOT_FOUND" },
        });
      }

      // 3. Ownership check
      const isOwner = String(course.createdBy) === String(user?._id);
      if (!isOwner) {
        throw new GraphQLError("Access denied: You do not own this course", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      // 4. Perform the update
      await SectionModel.updateOne(
        { _id },
        { $set: input },
        { session, runValidators: true },
      );
    });

    return {
      success: true,
      message: "Section successfully updated!",
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
