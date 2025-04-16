import { updateCourseWhatYouWillLearn } from "../../../../../src/app/api/graphql/resolvers/mutations/course/update-course-what-you-will-learn-mutation";
import { CourseModel } from "../../../../../src/app/api/graphql/models/course.model";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import {
  UpdateCourseWhatYouWillLearnInput,
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

describe("updateCourseWhatYouWillLearn", () => {
  const ownerId = "owner-123";
  const instructorUser: User = {
    _id: ownerId,
    email: "instr@example.com",
    role: Role.Instructor,
    studentId: "stud-123",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const otherUser: User = {
    _id: "other-456",
    email: "other@example.com",
    role: Role.Instructor,
    studentId: "stud-456",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validInput: UpdateCourseWhatYouWillLearnInput = {
    points: ["Point A", "Point B"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws if user is not authenticated/authorized", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
    await expect(
      updateCourseWhatYouWillLearn(
        null,
        { courseId: "course-1", input: { points: [] } },
        { user: instructorUser },
      ),
    ).rejects.toThrow("Unauthenticated");
  });

  it("throws BAD_USER_INPUT if courseId is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    await expect(
      updateCourseWhatYouWillLearn(
        null,
        { courseId: "", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseWhatYouWillLearn(
        null,
        { courseId: "", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Course ID is required");
  });

  it("throws COURSE_NOT_FOUND if course does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      updateCourseWhatYouWillLearn(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseWhatYouWillLearn(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Course not found");
  });

  it("throws FORBIDDEN if user is not the owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      whatYouWillLearn: [],
      save: jest.fn(),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);
    await expect(
      updateCourseWhatYouWillLearn(
        null,
        { courseId: "course-1", input: validInput },
        { user: otherUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseWhatYouWillLearn(
        null,
        { courseId: "course-1", input: validInput },
        { user: otherUser },
      ),
    ).rejects.toHaveProperty(
      "message",
      "Access denied: You are not authorized to update this course",
    );
  });

  it("sets whatYouWillLearn to empty array if input.points is undefined", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      whatYouWillLearn: ["Old point"],
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    const result = await updateCourseWhatYouWillLearn(
      null,
      { courseId: "course-1", input: {} as UpdateCourseWhatYouWillLearnInput },
      { user: instructorUser },
    );

    expect(fakeCourse.whatYouWillLearn).toEqual([]);
    expect(result).toBe(fakeCourse);
  });

  it("updates points successfully when valid and owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      whatYouWillLearn: [],
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    const result = await updateCourseWhatYouWillLearn(
      null,
      { courseId: "course-1", input: validInput },
      { user: instructorUser },
    );

    expect(fakeCourse.whatYouWillLearn).toEqual(validInput.points);
    expect(fakeCourse.save).toHaveBeenCalled();
    expect(result).toBe(fakeCourse);
  });

  it("defaults to empty array when input.points undefined", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      whatYouWillLearn: ["X"],
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    const result = await updateCourseWhatYouWillLearn(
      null,
      { courseId: "course-1", input: { points: [] } },
      { user: instructorUser },
    );

    expect(fakeCourse.whatYouWillLearn).toEqual([]);
    expect(fakeCourse.save).toHaveBeenCalled();
    expect(result).toBe(fakeCourse);
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected save error", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      whatYouWillLearn: [],
      save: jest.fn().mockRejectedValue(new Error("DB error")),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    await expect(
      updateCourseWhatYouWillLearn(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseWhatYouWillLearn(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
