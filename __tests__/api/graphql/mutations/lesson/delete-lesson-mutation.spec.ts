import { LessonModel } from "@/app/api/graphql/models";
import { deleteLesson } from "@/app/api/graphql/resolvers/mutations";
import { GraphQLError } from "graphql";

jest.mock("../../../../../src/app/api/graphql/models/lesson.model", () => ({
  LessonModel: {
    findById: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe("deleteLesson", () => {
  const mockFindById = LessonModel.findById as jest.Mock;
  const mockDeleteOne = LessonModel.deleteOne as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if _id is not provided", async () => {
    await expect(deleteLesson({}, { _id: "" })).rejects.toThrowError(
      new GraphQLError("Lesson ID is required", {
        extensions: { code: "BAD_REQUEST" },
      }),
    );
  });

  it("should throw an error if lesson is not found", async () => {
    mockFindById.mockResolvedValueOnce(null); // Simulate lesson not found

    await expect(deleteLesson({}, { _id: "invalid_id" })).rejects.toThrowError(
      new GraphQLError("Lesson not found", {
        extensions: { code: "NOT_FOUND" },
      }),
    );

    expect(mockFindById).toHaveBeenCalledWith("invalid_id");
  });

  it("should delete the lesson and return success message", async () => {
    mockFindById.mockResolvedValueOnce({ _id: "valid_id" });
    mockDeleteOne.mockResolvedValueOnce({ acknowledged: true });

    const result = await deleteLesson({}, { _id: "valid_id" });

    expect(mockFindById).toHaveBeenCalledWith("valid_id");
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: "valid_id" });
    expect(result).toEqual({
      success: true,
      message: "Lesson deleted successfully",
    });
  });

  it("should throw an error if an internal server error occurs", async () => {
    mockFindById.mockRejectedValueOnce(new Error("Something went wrong"));

    await expect(deleteLesson({}, { _id: "valid_id" })).rejects.toThrowError(
      new GraphQLError("Internal server error: Something went wrong", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      }),
    );

    expect(mockFindById).toHaveBeenCalledWith("valid_id");
  });
});
