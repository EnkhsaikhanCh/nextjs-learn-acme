import { updateLesson } from "../../../../../src/app/api/graphql/resolvers/mutations/lesson/update-lesson-mutation";
import { LessonModel } from "../../../../../src/app/api/graphql/models";
import { requireAuthAndRoles } from "../../../../../src/lib/auth-utils";
import { validateLessonInput } from "../../../../../src/utils/validateLessonInput";
import { GraphQLError } from "graphql";
import {
  UpdateLessonInput,
  Role,
  User,
} from "../../../../../src/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  LessonModel: {
    findById: jest.fn(),
  },
}));

jest.mock("../../../../../src/utils/validateLessonInput", () => ({
  validateLessonInput: jest.fn(),
}));

describe("updateLesson", () => {
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

  // Authentication Test
  it("throws an error if user is not authenticated", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );

    const input: UpdateLessonInput = {
      title: "Title",
      content: "Content",
      videoUrl: "http://example.com",
      order: 1,
      isPublished: false,
    };

    await expect(
      updateLesson(null, { _id: "lesson-id", input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateLesson(null, { _id: "lesson-id", input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Unauthenticated");
  });

  // Missing Lesson ID Test
  it("throws BAD_REQUEST if lesson id is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const input: UpdateLessonInput = {
      title: "Title",
      content: "Content",
      videoUrl: "http://example.com",
      order: 1,
      isPublished: false,
    };

    await expect(
      updateLesson(null, { _id: "", input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateLesson(null, { _id: "", input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Invalid or missing Lesson ID");
  });

  // Lesson Not Found Test
  it("throws NOT_FOUND if lesson is not found", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (LessonModel.findById as jest.Mock).mockResolvedValue(null);
    (validateLessonInput as jest.Mock).mockReturnValue({
      validatedTitle: "New Title",
      validatedContent: "New Content",
      validatedVideoUrl: "http://new-url.com",
      validatedOrder: 2,
      validatedIsPublished: true,
    });

    const input: UpdateLessonInput = {
      title: "Title",
      content: "Content",
      videoUrl: "http://example.com",
      order: 1,
      isPublished: false,
    };

    await expect(
      updateLesson(null, { _id: "lesson-id", input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateLesson(null, { _id: "lesson-id", input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Lesson not found");
  });

  // Successful Update Test
  it("updates lesson successfully with valid input", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (validateLessonInput as jest.Mock).mockReturnValue({
      validatedTitle: "New Title",
      validatedContent: "New Content",
      validatedVideoUrl: "http://new-url.com",
      validatedOrder: 2,
      validatedIsPublished: true,
    });

    const mockLesson = {
      _id: "lesson-id",
      title: "Old Title",
      content: "Old Content",
      videoUrl: "http://old-url.com",
      order: 1,
      isPublished: false,
      save: jest.fn(),
    };

    (LessonModel.findById as jest.Mock).mockResolvedValue(mockLesson);

    const updatedLesson = {
      _id: "lesson-id",
      title: "New Title",
      content: "New Content",
      videoUrl: "http://new-url.com",
      order: 2,
      isPublished: true,
    };

    mockLesson.save.mockResolvedValue(updatedLesson);

    const input: UpdateLessonInput = {
      title: "Title",
      content: "Content",
      videoUrl: "http://example.com",
      order: 1,
      isPublished: false,
    };

    const result = await updateLesson(
      null,
      { _id: "lesson-id", input },
      { user: mockUser },
    );

    expect(result).toEqual(updatedLesson);
    expect(mockLesson.title).toBe("New Title");
    expect(mockLesson.content).toBe("New Content");
    expect(mockLesson.videoUrl).toBe("http://new-url.com");
    expect(mockLesson.order).toBe(2);
    expect(mockLesson.isPublished).toBe(true);
  });

  // Save Failure Test
  it("throws DATABASE_ERROR if updated lesson is null", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (validateLessonInput as jest.Mock).mockReturnValue({
      validatedTitle: "New Title",
      validatedContent: "New Content",
      validatedVideoUrl: "http://new-url.com",
      validatedOrder: 2,
      validatedIsPublished: true,
    });

    const mockLesson = {
      _id: "lesson-id",
      title: "Old Title",
      content: "Old Content",
      videoUrl: "http://old-url.com",
      order: 1,
      isPublished: false,
      save: jest.fn(),
    };

    (LessonModel.findById as jest.Mock).mockResolvedValue(mockLesson);
    mockLesson.save.mockResolvedValue(null);

    const input: UpdateLessonInput = {
      title: "Title",
      content: "Content",
      videoUrl: "http://example.com",
      order: 1,
      isPublished: false,
    };

    await expect(
      updateLesson(null, { _id: "lesson-id", input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateLesson(null, { _id: "lesson-id", input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Failed to update the lesson");
  });

  // Unexpected Error Test
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (validateLessonInput as jest.Mock).mockReturnValue({
      validatedTitle: "New Title",
      validatedContent: "New Content",
      validatedVideoUrl: "http://new-url.com",
      validatedOrder: 2,
      validatedIsPublished: true,
    });
    (LessonModel.findById as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const input: UpdateLessonInput = {
      title: "Title",
      content: "Content",
      videoUrl: "http://example.com",
      order: 1,
      isPublished: false,
    };

    await expect(
      updateLesson(null, { _id: "lesson-id", input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateLesson(null, { _id: "lesson-id", input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
