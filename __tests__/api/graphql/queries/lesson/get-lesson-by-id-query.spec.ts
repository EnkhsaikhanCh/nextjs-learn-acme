import { LessonModel } from "@/app/api/graphql/models/lesson.model";
import { getLessonById } from "@/app/api/graphql/resolvers/queries/lesson/get-lesson-by-id-query";
import { GraphQLError } from "graphql";

jest.mock("../../../../../src/app/api/graphql/models/lesson.model", () => ({
  LessonModel: {
    findById: jest.fn(),
  },
}));

describe("getLessonById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the lesson if found", async () => {
    const mockLesson = { _id: "123", name: "Test Lesson" };
    (LessonModel.findById as jest.Mock).mockResolvedValue(mockLesson);

    const result = await getLessonById({}, { _id: "123" });

    expect(LessonModel.findById).toHaveBeenCalledWith("123");
    expect(result).toEqual(mockLesson);
  });

  it("should throw a LESSON_NOT_FOUND error if lesson is not found", async () => {
    (LessonModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(getLessonById({}, { _id: "123" })).rejects.toThrow(
      GraphQLError,
    );
    await expect(getLessonById({}, { _id: "123" })).rejects.toThrow(
      "Lesson not found",
    );

    expect(LessonModel.findById).toHaveBeenCalledWith("123");
  });

  it("should throw an INTERNAL_SERVER_ERROR if an unexpected error occurs", async () => {
    (LessonModel.findById as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(getLessonById({}, { _id: "123" })).rejects.toThrow(
      GraphQLError,
    );
    await expect(getLessonById({}, { _id: "123" })).rejects.toThrow(
      "Failed to fetch lesson",
    );

    expect(LessonModel.findById).toHaveBeenCalledWith("123");
  });
});
