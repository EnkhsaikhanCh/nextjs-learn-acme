import { GraphQLError } from "graphql";
import { LessonModel, SectionModel } from "../../../models";
import { CreateLessonInput, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const createLesson = async (
  _: unknown,
  { input }: { input: CreateLessonInput },
  context: { user?: User },
) => {
  const { user } = context;
  const { sectionId, title } = input;

  await requireAuthAndRoles(user, ["ADMIN"]);

  if (!sectionId || !title) {
    throw new GraphQLError("Invalid input data", {
      extensions: { Code: "BAD_USER_INPUT" },
    });
  }

  const section = await SectionModel.findById(sectionId);
  if (!section) {
    throw new GraphQLError("Section not found", {
      extensions: { code: "SECTION_NOT_FOUND" },
    });
  }

  const lastLesson = await LessonModel.findOne({ sectionId })
    .sort({ order: -1 })
    .exec();
  const maxOrder = lastLesson ? lastLesson.order : 0;

  try {
    const newLesson = await LessonModel.create({
      sectionId,
      title,
      order: maxOrder + 1,
    });

    await SectionModel.findByIdAndUpdate(sectionId, {
      $push: { lessonId: newLesson._id },
    });

    const populatedLesson = await LessonModel.findById(newLesson._id).populate({
      path: "sectionId",
      model: "Section",
    });

    if (!populatedLesson) {
      throw new GraphQLError("Failed to retrieve the created lesson", {
        extensions: { code: "DATABASE_ERROR" },
      });
    }

    return populatedLesson;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
