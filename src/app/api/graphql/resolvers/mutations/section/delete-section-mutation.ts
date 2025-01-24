import { GraphQLError } from "graphql";
import { LessonModel, SectionModel } from "../../../models";

export const deleteSection = async (_: unknown, { _id }: { _id: string }) => {
  if (!_id) {
    throw new GraphQLError("Section ID is required", {
      extensions: { code: "BAD_REQUEST" },
    });
  }

  try {
    const section = await SectionModel.findById(_id);

    if (!section) {
      throw new GraphQLError("Section not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    await LessonModel.deleteMany({ sectionId: _id });

    await SectionModel.deleteOne({ _id });

    return {
      success: true,
      message: "Section deleted successfully",
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;

    throw new GraphQLError(`Internal server error: ${message}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
