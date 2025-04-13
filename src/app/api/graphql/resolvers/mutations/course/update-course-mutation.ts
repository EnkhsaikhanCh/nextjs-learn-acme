import { GraphQLError } from "graphql";
import { CourseModel } from "../../../models";
import { UpdateCourseInput } from "@/generated/graphql";

export const updateCourse = async (
  _: unknown,
  { input }: { input: UpdateCourseInput },
) => {
  try {
    const { _id } = input;

    // Course ID байх эсэхийг шалгах
    if (!_id) {
      throw new GraphQLError("Course ID is required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Оруулах утгуудыг зөвхөн дамжуулсан утгаар шинэчлэх
    const updateFields: Partial<UpdateCourseInput> = {};

    if (input.title !== undefined) {
      updateFields.title = input.title;
    }

    if (input.description !== undefined) {
      updateFields.description = input.description;
    }

    if (input.difficulty !== undefined) {
      updateFields.difficulty = input.difficulty;
    }

    if (input.thumbnail !== undefined) {
      updateFields.thumbnail = input.thumbnail;
    }

    if (input.price !== undefined) {
      updateFields.price = input.price;
    }

    if (input.category !== undefined) {
      updateFields.category = input.category;
    }

    if (input.tags !== undefined) {
      updateFields.tags = input.tags;
    }

    if (input.status !== undefined) {
      updateFields.status = input.status;
    }

    if (input.whatYouWillLearn !== undefined) {
      updateFields.whatYouWillLearn = input.whatYouWillLearn;
    }

    // findByIdAndUpdate ашиглан шинэчлэх
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      _id,
      updateFields,
      { new: true },
    );

    // Амжилттай шинэчилсэн баримтыг буцаах
    return updatedCourse;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

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
