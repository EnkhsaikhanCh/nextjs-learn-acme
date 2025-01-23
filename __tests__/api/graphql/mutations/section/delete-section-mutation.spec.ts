import { SectionModel } from "../../../../../src/app/api/graphql/models/section.model";
import { deleteSection } from "../../../../../src/app/api/graphql/resolvers/mutations";
import { LessonModel } from "../../../../../src/app/api/graphql/models/lesson.model";
import { GraphQLError } from "graphql";

jest.mock("../../../../../src/app/api/graphql/models/section.model", () => ({
  SectionModel: {
    findById: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

jest.mock("../../../../../src/app/api/graphql/models/lesson.model", () => ({
  LessonModel: {
    deleteMany: jest.fn(),
  },
}));

describe("deleteSection", () => {
  const mockFindById = SectionModel.findById as jest.Mock;
  const mockDeleteOne = SectionModel.deleteOne as jest.Mock;
  const mockDeleteMany = LessonModel.deleteMany as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if _id is not provided", async () => {
    await expect(deleteSection({}, { _id: "" })).rejects.toThrowError(
      new GraphQLError("Section ID is required", {
        extensions: { code: "BAD_REQUEST" },
      }),
    );
  });

  it("should throw an error if section is not found", async () => {
    mockFindById.mockResolvedValueOnce(null); // Simulate section not found

    await expect(deleteSection({}, { _id: "invalid_id" })).rejects.toThrowError(
      new GraphQLError("Section not found", {
        extensions: { code: "NOT_FOUND" },
      }),
    );

    expect(mockFindById).toHaveBeenCalledWith("invalid_id");
  });

  it("should delete the section and return success message", async () => {
    mockFindById.mockResolvedValueOnce({ _id: "valid_id" });
    mockDeleteOne.mockResolvedValueOnce({ acknowledged: true });

    const result = await deleteSection({}, { _id: "valid_id" });

    expect(mockFindById).toHaveBeenCalledWith("valid_id");
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: "valid_id" });
    expect(result).toEqual({
      success: true,
      message: "Section deleted successfully",
    });
  });

  it("should delete the section and its lessons successfully", async () => {
    mockFindById.mockResolvedValueOnce({ _id: "valid_id" }); // Simulate section found
    mockDeleteOne.mockResolvedValueOnce({ deletedCount: 1 });
    mockDeleteMany.mockResolvedValueOnce({ deletedCount: 5 });

    const result = await deleteSection({}, { _id: "valid_id" });

    expect(result).toEqual({
      success: true,
      message: "Section deleted successfully",
    });

    expect(mockFindById).toHaveBeenCalledWith("valid_id");
    expect(mockDeleteMany).toHaveBeenCalledWith({ sectionId: "valid_id" });
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: "valid_id" });
  });

  it("should throw an internal server error if delete fails", async () => {
    mockFindById.mockResolvedValueOnce({ _id: "valid_id" });
    mockDeleteOne.mockRejectedValueOnce(new Error("Database error"));

    await expect(deleteSection({}, { _id: "valid_id" })).rejects.toThrowError(
      new GraphQLError("Internal server error: Database error", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      }),
    );

    expect(mockFindById).toHaveBeenCalledWith("valid_id");
    expect(mockDeleteOne).toHaveBeenCalledWith({ _id: "valid_id" });
  });
});
