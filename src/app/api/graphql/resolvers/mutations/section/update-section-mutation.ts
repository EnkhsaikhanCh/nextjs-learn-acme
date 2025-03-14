import { SectionModel } from "../../../models";
import { GraphQLError } from "graphql";
import { UpdateSectionInput } from "@/generated/graphql";

export const updateSection = async (
  _: unknown,
  { _id, input }: { _id: string; input: UpdateSectionInput },
) => {
  const { title, description, order } = input;

  if (!_id) {
    throw new Error("Section ID is required");
  }

  const sanitizedOrder = order !== undefined ? order : 0; // Default to 0 or another value

  try {
    const section = await SectionModel.findById(_id);

    if (!section) {
      throw new GraphQLError("Section not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (title) {
      section.title = title;
    }

    if (description) {
      section.description = description;
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
