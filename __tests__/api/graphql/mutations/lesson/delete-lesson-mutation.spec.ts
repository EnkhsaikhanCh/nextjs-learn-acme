import { deleteLesson } from "../../../../../src/app/api/graphql/resolvers/mutations/lesson/delete-lesson-mutation";
import { LessonModel } from "../../../../../src/app/api/graphql/models";
import { requireAuthAndRoles } from "../../../../../src/lib/auth-utils";
import { GraphQLError } from "graphql";
import { Role, User } from "../../../../../src/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  LessonModel: {
    findById: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe("deleteLesson", () => {
  const mockUser: User = {
    _id: "admin-id",
    email: "admin@example.com",
    role: Role.Admin,
    studentId: "admin-id-123",
    isVerified: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Authentication Test
  it("throws an error if user is not authenticated", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );

    await expect(
      deleteLesson(null, { _id: "lesson-id" }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      deleteLesson(null, { _id: "lesson-id" }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Unauthenticated");
  });

  // 2. Missing Lesson ID Test
  it("throws BAD_REQUEST if lesson id is not provided", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    await expect(
      deleteLesson(null, { _id: "" }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      deleteLesson(null, { _id: "" }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Lesson ID is required");
  });

  // 3. Lesson Not Found Test
  it("throws NOT_FOUND if lesson is not found", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (LessonModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      deleteLesson(null, { _id: "lesson-id" }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      deleteLesson(null, { _id: "lesson-id" }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Lesson not found");
  });

  // 4. Successful Deletion Test
  it("deletes lesson successfully with valid id", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (LessonModel.findById as jest.Mock).mockResolvedValue({
      _id: "lesson-id",
      title: "Test Lesson",
    });
    (LessonModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    const result = await deleteLesson(
      null,
      { _id: "lesson-id" },
      { user: mockUser },
    );

    expect(LessonModel.deleteOne).toHaveBeenCalledWith({ _id: "lesson-id" });
    expect(result).toEqual({
      success: true,
      message: "Lesson deleted successfully",
    });
  });

  // 5. Unexpected Error Test
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (LessonModel.findById as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      deleteLesson(null, { _id: "lesson-id" }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      deleteLesson(null, { _id: "lesson-id" }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
