import { deleteSection } from "../../../../../src/app/api/graphql/resolvers/mutations/section/delete-section-mutation";
import {
  SectionModel,
  LessonModel,
} from "../../../../../src/app/api/graphql/models";
import { requireAuthAndRoles } from "../../../../../src/lib/auth-utils";
import { GraphQLError } from "graphql";
import { Role, User } from "../../../../../src/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  SectionModel: {
    findById: jest.fn(),
    deleteOne: jest.fn(),
  },
  LessonModel: {
    deleteMany: jest.fn(),
  },
}));

describe("deleteSection", () => {
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

  // ✅ 1. Not authenticated
  it("throws UNAUTHENTICATED if user is not authenticated", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );

    await expect(
      deleteSection(null, { _id: "some-id" }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);

    await expect(
      deleteSection(null, { _id: "some-id" }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Unauthenticated");
  });

  // ✅ 2. Missing _id
  it("throws BAD_REQUEST if _id is not provided", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    await expect(
      deleteSection(null, { _id: "" }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);

    await expect(
      deleteSection(null, { _id: "" }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Section ID is required");
  });

  // ✅ 3. Section not found
  it("throws NOT_FOUND if section does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      deleteSection(null, { _id: "some-id" }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);

    await expect(
      deleteSection(null, { _id: "some-id" }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Section not found");
  });

  // ✅ 4. Successful deletion
  it("deletes section and related lessons successfully", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue({
      _id: "some-id",
      title: "Test Section",
    });

    (LessonModel.deleteMany as jest.Mock).mockResolvedValue({
      deletedCount: 3,
    });
    (SectionModel.deleteOne as jest.Mock).mockResolvedValue({
      deletedCount: 1,
    });

    const result = await deleteSection(
      null,
      { _id: "some-id" },
      { user: mockUser },
    );

    expect(LessonModel.deleteMany).toHaveBeenCalledWith({
      sectionId: "some-id",
    });
    expect(SectionModel.deleteOne).toHaveBeenCalledWith({ _id: "some-id" });
    expect(result).toEqual({
      success: true,
      message: "Section deleted successfully",
    });
  });

  // ✅ 5. Unexpected error
  it("throws INTERNAL_SERVER_ERROR on unexpected error", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockRejectedValue(
      new Error("Something went wrong"),
    );

    await expect(
      deleteSection(null, { _id: "some-id" }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);

    await expect(
      deleteSection(null, { _id: "some-id" }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
