import { SectionModel } from "../../../models";
import { GraphQLError } from "graphql";
import { UpdateSectionInput, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

const validateInput = (input: UpdateSectionInput) => {
  const { title, description, order } = input;

  if (title !== undefined) {
    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      title.length > 100
    ) {
      throw new GraphQLError(
        "Title must be a non-empty string and less than 100 characters",
        {
          extensions: { code: "BAD_REQUEST" },
        },
      );
    }
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw new GraphQLError("Description must be a string", {
        extensions: { code: "BAD_REQUEST" },
      });
    }
  }

  if (order !== undefined) {
    if (typeof order !== "number" || order < 0) {
      throw new GraphQLError("Order must be a non-negative number", {
        extensions: { code: "BAD_REQUEST" },
      });
    }
  }
};

export const updateSection = async (
  _: unknown,
  { _id, input }: { _id: string; input: UpdateSectionInput },
  context: { user?: User },
) => {
  const { user } = context;

  // Authentication and authorization check
  await requireAuthAndRoles(user, ["ADMIN"]);

  // Validate Section ID
  if (!_id) {
    throw new GraphQLError("Section ID is required", {
      extensions: { code: "BAD_REQUEST" },
    });
  }

  try {
    // Find the existing section
    const existingSection = await SectionModel.findById(_id);
    if (!existingSection) {
      throw new GraphQLError("Section not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    // Validate input
    validateInput(input);

    // Update fields only if provided
    const { title, description, order } = input;
    if (title !== undefined) existingSection.title = title;
    if (description !== undefined) existingSection.description = description;
    if (order !== undefined) existingSection.order = order;

    // Save the updated section
    const updatedSection = await existingSection.save();
    return updatedSection;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
