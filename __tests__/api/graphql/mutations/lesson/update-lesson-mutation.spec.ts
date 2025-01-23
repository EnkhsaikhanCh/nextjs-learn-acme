import { updateLesson } from "../../../../../src/app/api/graphql/resolvers/mutations";
import { sanitizeInput } from "../../../../../src/utils/sanitize";
import { LessonModel } from "../../../../../src/app/api/graphql/models";
import { GraphQLError } from "graphql";

jest.mock("../../../../../src/utils/sanitize", () => ({
  sanitizeInput: jest.fn((input) => input),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  LessonModel: {
    findById: jest.fn(),
  },
}));

describe("updateLesson", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if _id is not provided", async () => {
    await expect(updateLesson(null, { _id: "", input: {} })).rejects.toThrow(
      "Lesson ID is required",
    );
  });

  it("should throw a GraphQLError if the lesson is not found", async () => {
    (LessonModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateLesson(null, { _id: "123", input: {} })).rejects.toThrow(
      GraphQLError,
    );

    expect(LessonModel.findById).toHaveBeenCalledWith("123");
  });

  it("should update the lesson with sanitized input", async () => {
    const mockLesson = {
      save: jest.fn().mockResolvedValue({
        _id: "123",
        title: "Updated Title",
        content: "Updated Content",
        videoUrl: "http://example.com",
        order: 1,
        isPublished: true,
      }),
    };

    (LessonModel.findById as jest.Mock).mockResolvedValue(mockLesson);

    const input = {
      title: "Updated Title",
      content: "Updated Content",
      videoUrl: "http://example.com",
      order: 1,
      isPublished: true,
    };

    const result = await updateLesson(null, { _id: "123", input });

    expect(LessonModel.findById).toHaveBeenCalledWith("123");
    expect(sanitizeInput).toHaveBeenCalledWith(input.title);
    expect(sanitizeInput).toHaveBeenCalledWith(input.content);
    expect(sanitizeInput).toHaveBeenCalledWith(input.videoUrl);
    expect(mockLesson.save).toHaveBeenCalled();
    expect(result).toEqual({
      _id: "123",
      title: "Updated Title",
      content: "Updated Content",
      videoUrl: "http://example.com",
      order: 1,
      isPublished: true,
    });
  });

  it("should handle internal server errors", async () => {
    (LessonModel.findById as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(updateLesson(null, { _id: "123", input: {} })).rejects.toThrow(
      GraphQLError,
    );
  });
});
