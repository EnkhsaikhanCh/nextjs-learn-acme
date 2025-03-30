import { escape, isLength } from "validator";
import isURL from "validator/lib/isURL";
import { GraphQLError } from "graphql";
import { UpdateLessonInput } from "@/generated/graphql";

// Helper function to sanitize input
export const sanitizeInput = (
  input: string | undefined | null,
  maxLength: number = 255,
): string => {
  if (!input) return "";
  const trimmedInput = input.trim();
  if (!isLength(trimmedInput, { max: maxLength })) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }
  return escape(trimmedInput);
};

// Helper function to throw validation errors
const throwValidationError = (message: string) => {
  throw new GraphQLError(message, { extensions: { code: "BAD_REQUEST" } });
};

// Main validation function
export const validateLessonInput = (input: UpdateLessonInput) => {
  const { title, content, videoUrl, order, isPublished } = input;

  let validatedTitle: string | undefined;
  let validatedContent: string | undefined;
  let validatedVideoUrl: string | undefined;
  let validatedOrder: number | undefined;
  let validatedIsPublished: boolean | undefined;

  try {
    // Validate and sanitize title (max 255 characters)
    validatedTitle = title ? sanitizeInput(title, 255) : undefined;

    // Validate and sanitize content (max 10,000 characters)
    validatedContent = content ? sanitizeInput(content, 10000) : undefined;

    // Validate video URL if provided
    if (videoUrl) {
      if (!isURL(videoUrl)) {
        throwValidationError("Invalid video URL format");
      }
      validatedVideoUrl = videoUrl;
    }

    // Validate order (must be an integer if provided)
    if (order !== undefined) {
      if (typeof order !== "number" || !Number.isInteger(order)) {
        throwValidationError("Order must be an integer");
      }
      validatedOrder = order !== null ? order : undefined;
    }

    // Validate isPublished (must be a boolean if provided)
    if (isPublished !== undefined) {
      if (typeof isPublished !== "boolean") {
        throwValidationError("isPublished must be a boolean");
      }
      validatedIsPublished = isPublished !== null ? isPublished : undefined;
    }
  } catch (error) {
    if (error instanceof Error) {
      throwValidationError(error.message);
    }
    throwValidationError("Input validation failed");
  }

  return {
    validatedTitle,
    validatedContent,
    validatedVideoUrl,
    validatedOrder,
    validatedIsPublished,
  };
};
