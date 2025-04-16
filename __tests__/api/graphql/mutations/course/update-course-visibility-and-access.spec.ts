import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import {
  UpdateCourseVisibilityAndAccessInput,
  CourseStatus,
  Role,
  User,
} from "@/generated/graphql";
import { updateCourseVisibilityAndAccess } from "@/app/api/graphql/resolvers/mutations/course/update-course-visibility-and-access-mutation";
import { CourseModel } from "@/app/api/graphql/models";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: {
    findById: jest.fn(),
  },
}));

describe("updateCourseVisibilityAndAccess", () => {
  const ownerId = "owner-1";
  const instructorUser: User = {
    _id: ownerId,
    email: "inst@example.com",
    role: Role.Instructor,
    studentId: "stud-1",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const otherUser: User = {
    _id: "other-2",
    email: "other@example.com",
    role: Role.Instructor,
    studentId: "stud-2",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validInput: UpdateCourseVisibilityAndAccessInput = {
    courseId: "course-123",
    status: CourseStatus.Published,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws if user is not authenticated or lacks role", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
    await expect(
      updateCourseVisibilityAndAccess(
        null,
        { input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow("Unauthenticated");
  });

  it("throws BAD_USER_INPUT if status is invalid", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const badInput = {
      courseId: "course-123",
      status: "invalid-status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    await expect(
      updateCourseVisibilityAndAccess(
        null,
        { input: badInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseVisibilityAndAccess(
        null,
        { input: badInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Invalid input for course visibility");
  });

  it("throws COURSE_NOT_FOUND if no course is found", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      updateCourseVisibilityAndAccess(
        null,
        { input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseVisibilityAndAccess(
        null,
        { input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Course not found");
  });

  it("throws FORBIDDEN if user is not the owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = { createdBy: ownerId, save: jest.fn() };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);
    await expect(
      updateCourseVisibilityAndAccess(
        null,
        { input: validInput },
        { user: otherUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseVisibilityAndAccess(
        null,
        { input: validInput },
        { user: otherUser },
      ),
    ).rejects.toHaveProperty(
      "message",
      "Access denied: You are not authorized to update this course",
    );
  });

  it("updates status and returns course on success", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      status: CourseStatus.Draft,
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    const result = await updateCourseVisibilityAndAccess(
      null,
      { input: validInput },
      { user: instructorUser },
    );

    expect(fakeCourse.status).toBe(validInput.status);
    expect(fakeCourse.save).toHaveBeenCalled();
    expect(result).toBe(fakeCourse);
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected save error", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      status: CourseStatus.Draft,
      save: jest.fn().mockRejectedValue(new Error("DB error")),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    await expect(
      updateCourseVisibilityAndAccess(
        null,
        { input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseVisibilityAndAccess(
        null,
        { input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
