// src/app/api/graphql/resolvers/mutations/enrollment/create-enrollemnt.ts
import { GraphQLError } from "graphql";
import { CourseModel, EnrollmentModel, UserModel } from "../../../models";
import { CreateEnrollmentInput } from "@/generated/graphql";

export const createEnrollment = async (
  _: unknown,
  { input }: { input: CreateEnrollmentInput },
) => {
  try {
    const { userId, courseId } = input;

    if (!userId || !courseId) {
      throw new GraphQLError("Invalid input data", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Validate user and course existence
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    const existingEnrollment = await EnrollmentModel.findOne({
      userId,
      courseId,
    });
    if (existingEnrollment) {
      throw new GraphQLError("User is already enrolled in this course", {
        extensions: { code: "DUPLICATE_ENROLLMENT" },
      });
    }

    // Create the enrollment
    const enrollment = new EnrollmentModel({
      userId,
      courseId,
      progress: 0,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
      history: [
        {
          status: "ACTIVE",
          progress: 0,
          updatedAt: new Date(),
        },
      ],
    });

    const savedEnrollment = await enrollment.save();

    await CourseModel.findByIdAndUpdate(courseId, {
      $push: { enrollmentId: savedEnrollment._id },
    });

    // Populate references before returning
    const populatedEnrollment = await EnrollmentModel.findById(
      savedEnrollment._id,
    )
      .populate({ path: "userId", model: "User" })
      .populate({ path: "courseId", model: "Course" });

    if (!populatedEnrollment) {
      throw new Error("Failed to populate enrollment data");
    }

    return populatedEnrollment;
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
