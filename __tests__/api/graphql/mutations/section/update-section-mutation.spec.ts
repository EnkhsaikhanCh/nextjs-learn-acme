import { updateSection } from "../../../../../src/app/api/graphql/resolvers/mutations/section/update-section-mutation";
import { SectionModel } from "../../../../../src/app/api/graphql/models/section.model";
import { requireAuthAndRoles } from "../../../../../src/lib/auth-utils";
import { GraphQLError } from "graphql";
import { Role, User } from "../../../../../src/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/section.model", () => ({
  SectionModel: {
    findById: jest.fn(),
  },
}));

describe("updateSection", () => {
  const mockUser: User = {
    _id: "mock-id",
    email: "mock@example.com",
    role: Role.Admin,
    studentId: "mock-student-id",
    isVerified: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Authentication and Authorization Tests**
  it("throws an error if user is not authenticated", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );

    await expect(
      updateSection(null, { _id: "some-id", input: {} }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateSection(null, { _id: "some-id", input: {} }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Unauthenticated");
  });

  // Input Validation Tests**
  it("throws BAD_REQUEST if _id is not provided", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    await expect(
      updateSection(null, { _id: "", input: {} }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateSection(null, { _id: "", input: {} }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Section ID is required");
  });

  it("throws NOT_FOUND if section does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateSection(null, { _id: "some-id", input: {} }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateSection(null, { _id: "some-id", input: {} }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Section not found");
  });

  it("throws BAD_REQUEST if title is empty", async () => {
    const mockSection = {
      _id: "some-id",
      title: "Original Title",
      description: "Original Description",
      order: 0,
      save: jest.fn(),
    };
    mockSection.save.mockResolvedValue(mockSection); // avoid self-reference at declaration

    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(mockSection);

    const input = { title: "" };

    await expect(
      updateSection(null, { _id: "some-id", input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);

    await expect(
      updateSection(null, { _id: "some-id", input }, { user: mockUser }),
    ).rejects.toHaveProperty(
      "message",
      "Title must be a non-empty string and less than 100 characters",
    );
  });

  it("throws BAD_REQUEST if description is not a string", async () => {
    const mockSection = {
      _id: "some-id",
      title: "Original Title",
      description: "Original Description",
      order: 0,
      save: jest.fn(),
    };
    mockSection.save.mockResolvedValue(mockSection);

    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(mockSection);

    const input = { description: 123 };

    await expect(
      updateSection(
        null,
        { _id: "some-id", input: input as any },
        { user: mockUser },
      ),
    ).rejects.toThrow(GraphQLError);

    await expect(
      updateSection(
        null,
        { _id: "some-id", input: input as any },
        { user: mockUser },
      ),
    ).rejects.toHaveProperty("message", "Description must be a string");
  });

  it("updates description successfully when it's a valid string", async () => {
    const mockSection = {
      _id: "some-id",
      title: "Original Title",
      description: "Original Description",
      order: 0,
      save: jest.fn(),
    };
    mockSection.save.mockResolvedValue({
      ...mockSection,
      description: "Updated description",
    });

    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(mockSection);

    const input = { description: "Updated description" };

    const result = await updateSection(
      null,
      { _id: "some-id", input },
      { user: mockUser },
    );

    expect(result.description).toBe("Updated description");
    expect(mockSection.save).toHaveBeenCalled();
  });

  it("throws BAD_REQUEST if order is negative", async () => {
    const mockSection = {
      _id: "some-id",
      title: "Original Title",
      description: "Original Description",
      order: 0,
      save: jest.fn(),
    };
    mockSection.save.mockResolvedValue(mockSection);

    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(mockSection);

    const input = { order: -1 };

    await expect(
      updateSection(null, { _id: "some-id", input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);

    await expect(
      updateSection(null, { _id: "some-id", input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Order must be a non-negative number");
  });

  it("throws BAD_REQUEST if order is not a number", async () => {
    const mockSection = {
      _id: "some-id",
      title: "Original Title",
      description: "Original Description",
      order: 0,
      save: jest.fn(),
    };
    mockSection.save.mockResolvedValue(mockSection);

    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(mockSection);

    const input = { order: "not-a-number" };

    await expect(
      updateSection(
        null,
        { _id: "some-id", input: input as any },
        { user: mockUser },
      ),
    ).rejects.toThrow(GraphQLError);

    await expect(
      updateSection(
        null,
        { _id: "some-id", input: input as any },
        { user: mockUser },
      ),
    ).rejects.toHaveProperty("message", "Order must be a non-negative number");
  });

  it("updates order successfully when given a valid non-negative number", async () => {
    const mockSection = {
      _id: "some-id",
      title: "Original Title",
      description: "Original Description",
      order: 0,
      save: jest.fn(),
    };
    mockSection.save.mockResolvedValue({
      ...mockSection,
      order: 2,
    });

    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(mockSection);

    const input = { order: 2 };

    const result = await updateSection(
      null,
      { _id: "some-id", input },
      { user: mockUser },
    );

    expect(result.order).toBe(2);
    expect(mockSection.save).toHaveBeenCalled();
  });

  it("updates only the provided fields without affecting others", async () => {
    const mockSection = {
      _id: "some-id",
      title: "Original Title",
      description: "Original Description",
      order: 0,
      save: jest.fn(),
    };
    mockSection.save.mockResolvedValue({
      ...mockSection,
      title: "Updated Title",
    });

    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(mockSection);

    const input = { title: "Updated Title" };

    const result = await updateSection(
      null,
      { _id: "some-id", input },
      { user: mockUser },
    );

    expect(result.title).toBe("Updated Title");
    expect(result.description).toBe("Original Description");
    expect(result.order).toBe(0);
    expect(mockSection.save).toHaveBeenCalled();
  });

  // Successful Update Test**
  it("updates section successfully with valid input", async () => {
    const mockSection = {
      _id: "some-id",
      title: "Original Title",
      description: "Original Description",
      order: 0,
      save: jest.fn(),
    };
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(mockSection);
    mockSection.save.mockResolvedValue(mockSection);

    const input = { title: "New Title" };
    const result = await updateSection(
      null,
      { _id: "some-id", input },
      { user: mockUser },
    );

    expect(result.title).toBe("New Title");
    expect(result.description).toBe("Original Description");
    expect(result.order).toBe(0);
    expect(mockSection.save).toHaveBeenCalled();
  });

  // Error Handling Test**
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      updateSection(null, { _id: "some-id", input: {} }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateSection(null, { _id: "some-id", input: {} }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
