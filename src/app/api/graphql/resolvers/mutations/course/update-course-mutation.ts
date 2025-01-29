import { GraphQLError } from "graphql";
import { UpdateCourseInput } from "../../../schemas/course.schema";
import { CourseModel, Course } from "../../../models";
import { sanitizeInput } from "@/utils/sanitize";

export const updateCourse = async (
  _: unknown,
  { input }: { input: UpdateCourseInput },
) => {
  try {
    const { _id } = input;

    // 1. Course ID байх эсэхийг шалгах
    if (!_id) {
      throw new GraphQLError("Course ID is required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // 2. Partial update хийхэд ашиглах обьект
    const updateData: Partial<Course> = {};

    // title
    if (typeof input.title === "string") {
      updateData.title = sanitizeInput(input.title);
    }

    // description
    if (typeof input.description === "string") {
      updateData.description = sanitizeInput(input.description);
    }

    // price
    if (input.price !== undefined) {
      updateData.price = input.price;
    }

    // duration
    if (input.duration !== undefined) {
      updateData.duration = input.duration;
    }

    // createdBy
    if (typeof input.createdBy === "string") {
      updateData.createdBy = sanitizeInput(input.createdBy);
    }

    // categories
    if (Array.isArray(input.categories)) {
      updateData.categories = input.categories.map((c) => sanitizeInput(c));
    }

    // tags
    if (Array.isArray(input.tags)) {
      updateData.tags = input.tags.map((t) => sanitizeInput(t));
    }

    // status
    if (typeof input.status === "string") {
      const sanitizedStatus = sanitizeInput(input.status);
      if (sanitizedStatus === "active" || sanitizedStatus === "archived") {
        updateData.status = sanitizedStatus;
      } else {
        throw new GraphQLError("Invalid status value", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
    }

    // thumbnail
    if (typeof input.thumbnail === "string") {
      updateData.thumbnail = input.thumbnail;
    }

    // whatYouWillLearn
    if (Array.isArray(input.whatYouWillLearn)) {
      updateData.whatYouWillLearn = input.whatYouWillLearn;
    }

    // whyChooseOurCourse
    if (Array.isArray(input.whyChooseOurCourse)) {
      updateData.whyChooseOurCourse = input.whyChooseOurCourse;
    }

    // pricingDetails (илүү нарийн шалгалтуудыг энд хийж болох талтай)
    if (input.pricingDetails) {
      const { planTitle, description, price, details } = input.pricingDetails;
      updateData.pricingDetails = {
        planTitle: planTitle || "",
        description: description || "",
        price: price || "",
        details: details || [],
      };
    }

    // 4. findByIdAndUpdate ашиглан шууд update хийх
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      _id,
      { $set: updateData }, // Partial Update
      { new: true }, // шинэчлэгдсэн баримтыг буцаана
    );

    // 5. Олдсон эсэхийг шалгах
    if (!updatedCourse) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    // 6. Амжилттай шинэчилсэн баримтыг буцаах
    return updatedCourse;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    console.error("Update course error:", error);

    throw new GraphQLError("Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        ...(process.env.NODE_ENV === "development" && {
          originalError: error instanceof Error ? error.message : String(error),
        }),
      },
    });
  }
};
