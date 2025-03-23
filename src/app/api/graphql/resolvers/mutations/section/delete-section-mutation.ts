import { GraphQLError } from "graphql";
import { LessonModel, SectionModel } from "../../../models";
import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const deleteSection = async (
  _: unknown,
  { _id }: { _id: string },
  context: { user?: User },
) => {
  const { user } = context;

  await requireAuthAndRoles(user, ["ADMIN"]);

  if (!_id) {
    throw new GraphQLError("Section ID is required", {
      extensions: { code: "BAD_REQUEST" },
    });
  }

  try {
    const existingSection = await SectionModel.findById(_id);
    if (!existingSection) {
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
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
