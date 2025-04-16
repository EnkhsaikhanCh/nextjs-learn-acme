import { updateCourseThumbnail } from "@/app/api/graphql/resolvers/mutations/course/update-course-thumbnail-mutation";
import { CourseModel } from "../../../../../src/app/api/graphql/models/course.model";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { cloudinary } from "@/lib/cloudinary";
import { GraphQLError } from "graphql";
import { ThumbnailInput, Role, User } from "@/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: {
    findById: jest.fn(),
  },
}));

jest.mock("../../../../../src/lib/cloudinary", () => ({
  cloudinary: {
    uploader: {
      destroy: jest.fn(),
    },
  },
}));

describe("updateCourseThumbnail", () => {
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
  const nonOwnerUser: User = {
    _id: "other-456",
    email: "other@example.com",
    role: Role.Instructor,
    studentId: "stud-456",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validInput: ThumbnailInput = {
    publicId: "validId",
    width: 100,
    height: 200,
    format: "png",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws if not authenticated/authorized", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated"),
    );
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow("Unauthenticated");
  });

  it("throws BAD_USER_INPUT if courseId is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Course ID is required");
  });

  it("throws BAD_USER_INPUT for invalid input", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const badInput = {
      publicId: "a",
      width: -5,
      height: 0,
      format: "gif",
    };
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: badInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: badInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Invalid thumbnail input");
  });

  it("throws COURSE_NOT_FOUND if course does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Course not found");
  });

  it("throws FORBIDDEN if user is not the owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = { createdBy: ownerId, save: jest.fn() };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: validInput },
        { user: nonOwnerUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: validInput },
        { user: nonOwnerUser },
      ),
    ).rejects.toHaveProperty(
      "message",
      "Access denied: You are not authorized to update this course",
    );
  });

  it("deletes old thumbnail and updates to new one", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      thumbnail: { publicId: "oldId", width: 50, height: 50, format: "jpg" },
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);
    (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({});

    const result = await updateCourseThumbnail(
      null,
      { courseId: "course-1", input: validInput },
      { user: instructorUser },
    );

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("oldId");
    expect(fakeCourse.thumbnail).toEqual(validInput);
    expect(fakeCourse.save).toHaveBeenCalled();
    expect(result).toBe(fakeCourse);
  });

  it("skips destroy if same publicId and updates", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      thumbnail: { ...validInput },
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    const result = await updateCourseThumbnail(
      null,
      { courseId: "course-1", input: validInput },
      { user: instructorUser },
    );

    expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
    expect(fakeCourse.save).toHaveBeenCalled();
    expect(result).toBe(fakeCourse);
  });

  it("throws CLOUDINARY_ERROR if destroy fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      thumbnail: { publicId: "oldId", width: 50, height: 50, format: "jpg" },
      save: jest.fn(),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);
    (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
      new Error("fail"),
    );

    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Failed to delete previous thumbnail");
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected save error", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      thumbnail: null,
      save: jest.fn().mockRejectedValue(new Error("DB fail")),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCourseThumbnail(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
