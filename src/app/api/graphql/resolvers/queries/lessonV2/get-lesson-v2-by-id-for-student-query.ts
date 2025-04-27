import { Role, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { EnrollmentModel, LessonV2Model } from "../../../models";

export const getLessonV2byIdForStudent = async (
  _: unknown,
  { _id }: { _id: string },
  context: { user?: User },
) => {
  const { user } = context;
  await requireAuthAndRoles(user, [Role.Student]);

  if (!_id) {
    throw new GraphQLError("Lesson ID is required", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  try {
    const lesson = await LessonV2Model.findById(_id).populate({
      path: "sectionId",
      model: "Section",
      populate: {
        path: "courseId",
        model: "Course",
      },
    });

    if (!lesson) {
      throw new GraphQLError("Lesson not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const courseId = lesson.sectionId?.courseId?._id;
    if (!courseId) {
      throw new GraphQLError("Course ID not found in lesson", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }

    // Enrollment шалгах
    const enrollment = await EnrollmentModel.findOne({
      userId: user?._id,
      courseId: courseId,
      status: { $in: ["ACTIVE", "COMPLETED"] },
      isDeleted: { $ne: true },
    });

    if (!enrollment) {
      throw new GraphQLError("User is not enrolled in this course", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    return lesson;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Failed to load lesson", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
