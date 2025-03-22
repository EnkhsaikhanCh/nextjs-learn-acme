import { createSection } from "../../../../../src/app/api/graphql/resolvers/mutations/section/create-section-mutation";
import {
  CourseModel,
  SectionModel,
} from "../../../../../src/app/api/graphql/models";
import { requireAuthAndRoles } from "../../../../../src/lib/auth-utils";
import { GraphQLError } from "graphql";
import {
  CreateSectionInput,
  Role,
  User,
} from "../../../../../src/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  CourseModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  SectionModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

describe("createSection", () => {
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

    const input: CreateSectionInput = {
      courseId: "course-id",
      title: "Section Title",
    };

    await expect(
      createSection(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Unauthenticated");
  });

  // Input Validation Test
  it("throws BAD_USER_INPUT if courseId or title is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    // Missing courseId
    const input1: CreateSectionInput = { courseId: "", title: "Section Title" };
    await expect(
      createSection(null, { input: input1 }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(null, { input: input1 }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Invalid input data");

    // Missing title
    const input2: CreateSectionInput = { courseId: "course-id", title: "" };
    await expect(
      createSection(null, { input: input2 }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(null, { input: input2 }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Invalid input data");
  });

  // Course Not Found Test
  it("throws COURSE_NOT_FOUND if course does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findById as jest.Mock).mockResolvedValue(null);

    const input: CreateSectionInput = {
      courseId: "course-id",
      title: "Section Title",
    };

    await expect(
      createSection(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Course not found");
  });

  // Successful creation when no previous section exists (maxOrder = 0)
  it("creates section successfully with valid input when no previous section exists", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Course exists
    (CourseModel.findById as jest.Mock).mockResolvedValue({
      _id: "course-id",
      title: "Course Title",
    });
    // No last section found => maxOrder remains 0
    (SectionModel.findOne as jest.Mock).mockReturnValue({
      sort: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    });
    // Simulate section creation: order should be 1 (0 + 1)
    const newSection = {
      _id: "new-section-id",
      courseId: "course-id",
      title: "Section Title",
      order: 1,
    };
    (SectionModel.create as jest.Mock).mockResolvedValue(newSection);
    (CourseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    // Simulate population: SectionModel.findById returns populated section
    const populatedSection = {
      ...newSection,
      courseId: { _id: "course-id", title: "Course Title" },
      lessonId: [],
    };
    (SectionModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(populatedSection),
      }),
    });

    const input: CreateSectionInput = {
      courseId: "course-id",
      title: "Section Title",
    };

    const result = await createSection(null, { input }, { user: mockUser });

    expect(SectionModel.create).toHaveBeenCalledWith({
      courseId: "course-id",
      title: "Section Title",
      order: 1,
    });
    expect(CourseModel.findByIdAndUpdate).toHaveBeenCalledWith("course-id", {
      $push: { sectionId: "new-section-id" },
    });
    expect(result).toEqual(populatedSection);
  });

  // Successful creation when previous section exists (maxOrder > 0)
  it("creates section successfully with valid input when previous section exists", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Course exists
    (CourseModel.findById as jest.Mock).mockResolvedValue({
      _id: "course-id",
      title: "Course Title",
    });
    // Last section exists with order = 3
    (SectionModel.findOne as jest.Mock).mockReturnValue({
      sort: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue({ order: 3 }) }),
    });
    // New section creation: order should be 4
    const newSection = {
      _id: "new-section-id",
      courseId: "course-id",
      title: "Section Title",
      order: 4,
    };
    (SectionModel.create as jest.Mock).mockResolvedValue(newSection);
    (CourseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    const populatedSection = {
      ...newSection,
      courseId: { _id: "course-id", title: "Course Title" },
      lessonId: [],
    };
    (SectionModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(populatedSection),
      }),
    });

    const input: CreateSectionInput = {
      courseId: "course-id",
      title: "Section Title",
    };

    const result = await createSection(null, { input }, { user: mockUser });

    expect(SectionModel.create).toHaveBeenCalledWith({
      courseId: "course-id",
      title: "Section Title",
      order: 4,
    });
    expect(result).toEqual(populatedSection);
  });

  // Population Failure Test
  it("throws DATABASE_ERROR if created section cannot be retrieved", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findById as jest.Mock).mockResolvedValue({
      _id: "course-id",
      title: "Course Title",
    });
    (SectionModel.findOne as jest.Mock).mockReturnValue({
      sort: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    });
    const newSection = {
      _id: "new-section-id",
      courseId: "course-id",
      title: "Section Title",
      order: 1,
    };
    (SectionModel.create as jest.Mock).mockResolvedValue(newSection);
    (CourseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    // Simulate failure to retrieve populated section
    (SectionModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    const input: CreateSectionInput = {
      courseId: "course-id",
      title: "Section Title",
    };

    await expect(
      createSection(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty(
      "message",
      "Failed to retrieve the created section",
    );
  });

  // Unexpected Error Test
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findById as jest.Mock).mockResolvedValue({
      _id: "course-id",
      title: "Course Title",
    });
    (SectionModel.findOne as jest.Mock).mockReturnValue({
      sort: jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    });
    (SectionModel.create as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const input: CreateSectionInput = {
      courseId: "course-id",
      title: "Section Title",
    };

    await expect(
      createSection(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
