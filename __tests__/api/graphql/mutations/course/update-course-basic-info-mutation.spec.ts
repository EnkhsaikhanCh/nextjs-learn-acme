import { updateCourseBasicInfo } from "@/app/api/graphql/resolvers/mutations/course/update-course-basic-info-mutation";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { CourseModel } from "@/app/api/graphql/models/course.model";
import { GraphQLError } from "graphql";
import {
  CourseBasicInfoInput,
  Difficulty,
  Role,
  User,
} from "@/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: {
    findById: jest.fn(),
  },
}));

describe("updateCourseBasicInfo", () => {
  const ownerId = "owner-123";
  const fakeCourseId = "course-1";
  const instructorUser: User = {
    _id: ownerId,
    email: "instructor@example.com",
    role: Role.Instructor,
    studentId: "instr-123",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const nonOwnerUser: User = {
    _id: "other-456",
    email: "other@example.com",
    role: Role.Instructor,
    studentId: "other-456",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // An example valid input for updating the course basic info.
  const validInput: CourseBasicInfoInput = {
    title: "New Course Title",
    subtitle: "New Course Subtitle",
    description: "New description",
    requirements: "New requirements",
    category: "Programming",
    difficulty: Difficulty.Intermediate,
    whoIsThisFor: "Developers",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws BAD_USER_INPUT if courseId is not provided", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    await expect(
      updateCourseBasicInfo(
        null,
        { courseId: "", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow("Course ID is required");
  });

  it("throws COURSE_NOT_FOUND if course is not found", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateCourseBasicInfo(
        null,
        { courseId: fakeCourseId, input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow("Course not found");
  });

  it("throws FORBIDDEN if the user is not the course owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Return a fake course with a createdBy value that does not match the user's _id.
    const fakeCourse = {
      _id: fakeCourseId,
      createdBy: "different-owner",
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    await expect(
      updateCourseBasicInfo(
        null,
        { courseId: fakeCourseId, input: validInput },
        { user: nonOwnerUser },
      ),
    ).rejects.toThrow(
      "Access denied: You are not authorized to update this course",
    );
  });

  it("throws an error if requireAuthAndRoles fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthorized"),
    );

    await expect(
      updateCourseBasicInfo(
        null,
        { courseId: fakeCourseId, input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow("Unauthorized");
  });

  it("uses default values when optional fields are missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Create a fake course with initial values.
    const fakeCourse = {
      _id: fakeCourseId,
      createdBy: ownerId,
      title: "Old Title",
      subtitle: "Should be overwritten",
      description: "Old Description",
      requirements: "Old Requirements",
      category: "Old Category",
      difficulty: "INTERMEDIATE", // some preset value
      whoIsThisFor: "Old info",
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    // Provide an input with undefined values for the optional properties.
    const partialInput: Partial<CourseBasicInfoInput> = {
      title: "New Title",
      subtitle: undefined,
      description: undefined,
      requirements: undefined,
      category: undefined,
      difficulty: undefined,
      whoIsThisFor: undefined,
    };

    const result = await updateCourseBasicInfo(
      null,
      { courseId: fakeCourseId, input: partialInput as CourseBasicInfoInput },
      { user: instructorUser },
    );

    expect(result.title).toBe("New Title");
    expect(result.subtitle).toBe("");
    expect(result.description).toBe("");
    expect(result.requirements).toBe("");
    expect(result.category).toBe("");
    expect(result.difficulty).toBe("BEGINNER");
    expect(result.whoIsThisFor).toBe("");
    expect(fakeCourse.save).toHaveBeenCalled();
  });

  it("successfully updates course details for the course owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Create a fake course object with initial values.
    const fakeCourse = {
      _id: fakeCourseId,
      createdBy: ownerId,
      title: "Old Title",
      subtitle: "Old Subtitle",
      description: "Old Description",
      requirements: "Old Requirements",
      category: "Old Category",
      difficulty: "BEGINNER",
      whoIsThisFor: "Old info",
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    const result = await updateCourseBasicInfo(
      null,
      { courseId: fakeCourseId, input: validInput },
      { user: instructorUser },
    );

    // Assert that the course fields were updated.
    expect(fakeCourse.title).toBe(validInput.title);
    expect(fakeCourse.subtitle).toBe(validInput.subtitle);
    expect(fakeCourse.description).toBe(validInput.description);
    expect(fakeCourse.requirements).toBe(validInput.requirements);
    expect(fakeCourse.category).toBe(validInput.category);
    expect(fakeCourse.difficulty).toBe(validInput.difficulty);
    expect(fakeCourse.whoIsThisFor).toBe(validInput.whoIsThisFor);
    expect(fakeCourse.save).toHaveBeenCalled();
    // The resolver returns the updated course.
    expect(result).toBe(fakeCourse);
  });

  it("throws INTERNAL_SERVER_ERROR if course.save fails unexpectedly", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      _id: fakeCourseId,
      createdBy: ownerId,
      title: "Old Title",
      subtitle: "Old Subtitle",
      description: "Old Description",
      requirements: "Old Requirements",
      category: "Old Category",
      difficulty: "BEGINNER",
      whoIsThisFor: "Old info",
      save: jest.fn().mockRejectedValue(new Error("DB error")),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    await expect(
      updateCourseBasicInfo(
        null,
        { courseId: fakeCourseId, input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow("Internal server error");
  });
});
