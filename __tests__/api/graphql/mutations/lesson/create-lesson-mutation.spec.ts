import { createLesson } from "../../../../../src/app/api/graphql/resolvers/mutations/lesson/create-lesson-mutation";
import {
  LessonModel,
  SectionModel,
} from "../../../../../src/app/api/graphql/models";
import { requireAuthAndRoles } from "../../../../../src/lib/auth-utils";
import { GraphQLError } from "graphql";
import {
  CreateLessonInput,
  Role,
  User,
} from "../../../../../src/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  SectionModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  LessonModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

describe("createLesson", () => {
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

    const input: CreateLessonInput = {
      sectionId: "section-id",
      title: "Lesson Title",
    };

    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Unauthenticated");
  });

  // 2. Input Validation Tests
  it("throws BAD_USER_INPUT if sectionId is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const input: CreateLessonInput = { sectionId: "", title: "Lesson Title" };

    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Invalid input data");
  });

  it("throws BAD_USER_INPUT if title is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const input: CreateLessonInput = { sectionId: "section-id", title: "" };

    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Invalid input data");
  });

  // 3. Section Not Found Test
  it("throws SECTION_NOT_FOUND if section does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue(null);

    const input: CreateLessonInput = {
      sectionId: "section-id",
      title: "Lesson Title",
    };

    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Section not found");
  });

  // 4. Successful creation when no previous lesson exists (maxOrder = 0)
  it("creates lesson successfully with valid input when no previous lesson exists", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Section exists
    (SectionModel.findById as jest.Mock).mockResolvedValue({
      _id: "section-id",
      title: "Test Section",
    });
    // No last lesson found: simulate chain of findOne().sort().exec()
    (LessonModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    // Simulate lesson creation: order should be 1 (0 + 1)
    const newLesson = {
      _id: "new-lesson-id",
      sectionId: "section-id",
      title: "Lesson Title",
      order: 1,
    };
    (LessonModel.create as jest.Mock).mockResolvedValue(newLesson);
    (SectionModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    // Simulate population: LessonModel.findById returns populated lesson
    const populatedLesson = {
      ...newLesson,
      sectionId: { _id: "section-id", title: "Test Section" },
    };
    (LessonModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue(Promise.resolve(populatedLesson)),
    });

    const input: CreateLessonInput = {
      sectionId: "section-id",
      title: "Lesson Title",
    };

    const result = await createLesson(null, { input }, { user: mockUser });

    expect(LessonModel.create).toHaveBeenCalledWith({
      sectionId: "section-id",
      title: "Lesson Title",
      order: 1,
    });
    expect(SectionModel.findByIdAndUpdate).toHaveBeenCalledWith("section-id", {
      $push: { lessonId: "new-lesson-id" },
    });
    expect(result).toEqual(populatedLesson);
  });

  // 5. Successful creation when previous lesson exists (maxOrder > 0)
  it("creates lesson successfully with valid input when previous lesson exists", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Section exists
    (SectionModel.findById as jest.Mock).mockResolvedValue({
      _id: "section-id",
      title: "Test Section",
    });
    // Last lesson exists with order = 3
    (LessonModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ order: 3 }),
      }),
    });
    // New lesson: order should be 4
    const newLesson = {
      _id: "new-lesson-id",
      sectionId: "section-id",
      title: "Lesson Title",
      order: 4,
    };
    (LessonModel.create as jest.Mock).mockResolvedValue(newLesson);
    (SectionModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    const populatedLesson = {
      ...newLesson,
      sectionId: { _id: "section-id", title: "Test Section" },
    };
    (LessonModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue(Promise.resolve(populatedLesson)),
    });

    const input: CreateLessonInput = {
      sectionId: "section-id",
      title: "Lesson Title",
    };

    const result = await createLesson(null, { input }, { user: mockUser });

    expect(LessonModel.create).toHaveBeenCalledWith({
      sectionId: "section-id",
      title: "Lesson Title",
      order: 4,
    });
    expect(result).toEqual(populatedLesson);
  });

  // 6. Population Failure Test
  it("throws DATABASE_ERROR if populated lesson cannot be retrieved", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue({
      _id: "section-id",
      title: "Test Section",
    });
    (LessonModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    const newLesson = {
      _id: "new-lesson-id",
      sectionId: "section-id",
      title: "Lesson Title",
      order: 1,
    };
    (LessonModel.create as jest.Mock).mockResolvedValue(newLesson);
    (SectionModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    // Simulate failure to retrieve populated lesson: LessonModel.findById returns null
    (LessonModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue(Promise.resolve(null)),
    });

    const input: CreateLessonInput = {
      sectionId: "section-id",
      title: "Lesson Title",
    };

    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty(
      "message",
      "Failed to retrieve the created lesson",
    );
  });

  // 7. Unexpected Error Test
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (SectionModel.findById as jest.Mock).mockResolvedValue({
      _id: "section-id",
      title: "Test Section",
    });
    (LessonModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    (LessonModel.create as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const input: CreateLessonInput = {
      sectionId: "section-id",
      title: "Lesson Title",
    };

    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createLesson(null, { input }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
