// src/app/api/graphql/resolvers/mutations/enrollment/mark-lesson-as-completed-mutation.ts
import { GraphQLError } from "graphql";
import { CourseModel, EnrollmentV2Model } from "../../../models";
import { MarkLessonAsCompletedInput } from "@/generated/graphql";

type Section = {
  lessonId: string[];
};

export const markLessonAsCompleted = async (
  _: unknown,
  { input }: { input: MarkLessonAsCompletedInput },
) => {
  try {
    const { enrollmentId, lessonId } = input;

    if (!enrollmentId || !lessonId) {
      throw new GraphQLError("Invalid input data", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Fetch and validate the enrollment
    const enrollment = await EnrollmentV2Model.findById(enrollmentId);
    if (!enrollment) {
      throw new GraphQLError("Enrollment not found", {
        extensions: {
          code: "NOT_FOUND",
          enrollmentId,
        },
      });
    }

    // Check if the lesson is already completed
    if (enrollment.completedLessons.includes(lessonId)) {
      return enrollment;
    }

    // Add lesson to completedLessons
    enrollment.completedLessons.push(lessonId);
    enrollment.lastAccessedAt = new Date();

    // Fetch the associated course
    const course = await CourseModel.findById(enrollment.courseId).populate({
      path: "sectionId",
      populate: { path: "lessonId" },
    });

    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: {
          code: "COURSE_NOT_FOUND",
        },
      });
    }

    // Calculate the total lessons
    const totalLessons = course.sectionId.reduce(
      (total: number, section: Section) => total + section.lessonId.length,
      0,
    );

    if (totalLessons === 0) {
      throw new GraphQLError("No lessons found in the course sections", {
        extensions: {
          code: "NO_LESSONS",
          courseId: enrollment.courseId,
        },
      });
    }

    // Update progress
    enrollment.progress =
      (enrollment.completedLessons.length / totalLessons) * 100;

    // Mark status as COMPLETED if progress reaches 100%
    if (enrollment.progress >= 100) {
      enrollment.status = "COMPLETED";
    }

    // Save the enrollment changes
    await enrollment.save();

    return enrollment;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
