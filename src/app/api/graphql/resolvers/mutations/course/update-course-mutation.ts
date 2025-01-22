import { GraphQLError } from "graphql";
import { UpdateCourseInput } from "../../../schemas/course.schema";
import { CourseModel } from "../../../models";
import { sanitizeInput } from "@/utils/sanitize";

export const updateCourse = async (
  _: unknown,
  { input }: { input: UpdateCourseInput },
) => {
  const {
    _id,
    title,
    description,
    price,
    duration,
    createdBy,
    categories,
    tags,
    status,
    thumbnail,
  } = input;

  if (!_id) {
    throw new Error("Course ID is required");
  }

  const sanitizedTitle = sanitizeInput(title || "");
  const sanitizedDescription = sanitizeInput(description || "");
  const sanitizedPrice = price !== undefined ? price : 0; // Default to 0 or another value
  const sanitizedDuration = duration !== undefined ? duration : 0; // Default to 0 or another value
  const sanitizedCreatedBy = sanitizeInput(createdBy || "");
  const sanitizedCategories = categories
    ? categories.map((category) => sanitizeInput(category))
    : [];
  const sanitizedTags = tags ? tags.map((tag) => sanitizeInput(tag)) : [];
  const sanitizedStatus = sanitizeInput(status || "");

  try {
    const course = await CourseModel.findById(_id);

    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (title) {
      course.title = sanitizedTitle;
    }

    if (description) {
      course.description = sanitizedDescription;
    }

    if (price) {
      course.price = sanitizedPrice;
    }

    if (duration) {
      course.duration = sanitizedDuration;
    }

    if (createdBy) {
      course.createdBy = sanitizedCreatedBy;
    }

    if (categories) {
      course.categories = sanitizedCategories;
    }

    if (tags) {
      course.tags = sanitizedTags;
    }

    if (status) {
      course.status = sanitizedStatus;
    }

    if (thumbnail) {
      course.thumbnail = thumbnail;
    }

    const updatedCourse = await course.save();

    return updatedCourse;
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
