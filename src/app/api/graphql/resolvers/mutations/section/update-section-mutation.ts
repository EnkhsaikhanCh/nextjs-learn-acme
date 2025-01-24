import { sanitizeInput } from "@/utils/sanitize";
import { UpdateSectionInput } from "../../../schemas/section.schema";
import { SectionModel } from "../../../models";
import { GraphQLError } from "graphql";

export const updateSection = async (
  _: unknown,
  { _id, input }: { _id: string; input: UpdateSectionInput },
) => {
  const { title, description, order } = input;

  if (!_id) {
    throw new Error("Section ID is required");
  }

  const sanitizedTitle = sanitizeInput(title || "");
  const sanitizedDescription = sanitizeInput(description || "");
  const sanitizedOrder = order !== undefined ? order : 0; // Default to 0 or another value

  try {
    const section = await SectionModel.findById(_id);

    if (!section) {
      throw new GraphQLError("Section not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (title) {
      section.title = sanitizedTitle;
    }

    if (description) {
      section.description = sanitizedDescription;
    }

    if (order) {
      section.order = sanitizedOrder;
    }

    const updatedSection = await section.save();

    return updatedSection;
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
