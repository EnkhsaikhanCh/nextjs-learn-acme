import mongoose from "mongoose";
import { createSection } from "../../../../../src/app/api/graphql/resolvers/mutations/section/create-section-mutation";
import {
  CourseModel,
  SectionModel,
} from "../../../../../src/app/api/graphql/models";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import {
  CreateSectionInput,
  CreateSectionResponse,
  Role,
  User,
} from "@/generated/graphql";

jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("mongoose", () => ({
  startSession: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  CourseModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
  SectionModel: {
    create: jest.fn(),
  },
}));

describe("createSection mutation", () => {
  const adminUser: User = {
    _id: "admin-1",
    email: "admin@example.com",
    role: Role.Admin,
    studentId: "stud-1",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const instructorUser: User = { ...adminUser, role: Role.Instructor };

  const validInput: CreateSectionInput = {
    courseId: "course-1",
    title: "New Section",
  };

  let session: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    withTransaction: (fn: any) => Promise<void>;
    endSession: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    session = {
      withTransaction: jest.fn().mockImplementation(async (fn) => fn()),
      endSession: jest.fn(),
    };
    (mongoose.startSession as jest.Mock).mockResolvedValue(session);
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
  });

  it("calls session.endSession after successful transaction", async () => {
    const fakeCourse = { createdBy: instructorUser._id, sectionCount: 1 };
    const updatedCourse = { ...fakeCourse, sectionCount: 2 };
    const newSection = { _id: "section-1" };

    (CourseModel.findById as jest.Mock).mockReturnValue({
      session: () => Promise.resolve(fakeCourse),
    });
    (CourseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
      updatedCourse,
    );
    (SectionModel.create as jest.Mock).mockResolvedValue([newSection]);
    (CourseModel.updateOne as jest.Mock).mockResolvedValue({});

    const result = await createSection(
      null,
      { input: validInput },
      { user: instructorUser },
    );

    expect(result.success).toBe(true);
    expect(session.endSession).toHaveBeenCalled(); // ⬅️ FINALLY reached
  });

  it("ensures session.endSession is called even if transaction throws", async () => {
    (session.withTransaction as jest.Mock).mockImplementation(async () => {
      throw new GraphQLError("Simulated error");
    });

    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "Simulated error");

    expect(mongoose.startSession).toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalled();
  });

  it("calls session.endSession even if transaction throws", async () => {
    (session.withTransaction as jest.Mock).mockImplementation(async () => {
      throw new GraphQLError("Transaction failed");
    });

    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "Transaction failed");

    expect(session.endSession).toHaveBeenCalled();
  });

  it("throws BAD_USER_INPUT if input is invalid", async () => {
    await expect(
      createSection(
        null,
        { input: { courseId: "", title: "" } },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(
        null,
        { input: { courseId: "", title: "" } },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Invalid input data");
  });

  it("throws error if requireAuthAndRoles fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockImplementation(() => {
      throw new GraphQLError("UNAUTHORIZED");
    });

    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "UNAUTHORIZED");

    expect(session.endSession).not.toHaveBeenCalled();
  });

  it("throws FORBIDDEN if user is not owner", async () => {
    (CourseModel.findById as jest.Mock).mockReturnValue({
      session: () => Promise.resolve({ createdBy: "other-user" }),
    });
    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    expect(session.endSession).toHaveBeenCalled();
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (CourseModel.findById as jest.Mock).mockImplementation(() => {
      throw new Error("DB fail");
    });
    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    expect(session.endSession).toHaveBeenCalled();
  });

  it("calls session.endSession when transaction explicitly fails", async () => {
    (CourseModel.findById as jest.Mock).mockReturnValue({
      session: () => Promise.resolve({ createdBy: instructorUser._id }),
    });
    (session.withTransaction as jest.Mock).mockRejectedValue(
      new Error("Transaction failed"),
    );

    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    expect(session.endSession).toHaveBeenCalled();
  });

  it("throws BAD_USER_INPUT if title is missing", async () => {
    await expect(
      createSection(
        null,
        { input: { courseId: validInput.courseId, title: "" } },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Invalid input data");
  });

  it("throws BAD_USER_INPUT if courseId is missing", async () => {
    await expect(
      createSection(
        null,
        { input: { courseId: "", title: validInput.title } },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Invalid input data");
  });

  it("throws COURSE_NOT_FOUND if course does not exist", async () => {
    (CourseModel.findById as jest.Mock).mockReturnValue({
      session: () => Promise.resolve(null),
    });

    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "Course not found");

    expect(session.endSession).toHaveBeenCalled();
  });

  it("throws FORBIDDEN if user is not owner", async () => {
    const fakeCourse = { createdBy: "other-user" };
    (CourseModel.findById as jest.Mock).mockReturnValue({
      session: () => Promise.resolve(fakeCourse),
    });

    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toHaveProperty(
      "message",
      "Access denied: You do not own this course",
    );

    expect(session.endSession).toHaveBeenCalled();
  });

  it("throws COURSE_NOT_FOUND if findByIdAndUpdate returns null", async () => {
    const fakeCourse = { createdBy: instructorUser._id };
    (CourseModel.findById as jest.Mock).mockReturnValue({
      session: () => Promise.resolve(fakeCourse),
    });
    (CourseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "Course not found");

    expect(session.endSession).toHaveBeenCalled();
  });

  it("creates section successfully and returns success response", async () => {
    const fakeCourse = { createdBy: instructorUser._id, sectionCount: 1 };
    (CourseModel.findById as jest.Mock).mockReturnValue({
      session: () => Promise.resolve(fakeCourse),
    });
    const updatedCourse = { ...fakeCourse, sectionCount: 2 };
    (CourseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
      updatedCourse,
    );
    const newSection = { _id: "section-1" };
    (SectionModel.create as jest.Mock).mockResolvedValue([newSection]);
    (CourseModel.updateOne as jest.Mock).mockResolvedValue({});

    const result = await createSection(
      null,
      { input: validInput },
      { user: instructorUser },
    );

    expect(mongoose.startSession).toHaveBeenCalled();
    expect(session.withTransaction).toHaveBeenCalled();
    expect(SectionModel.create).toHaveBeenCalledWith(
      [
        {
          courseId: validInput.courseId,
          title: validInput.title,
          order: updatedCourse.sectionCount,
        },
      ],
      { session },
    );
    expect(CourseModel.updateOne).toHaveBeenCalledWith(
      { _id: validInput.courseId },
      { $push: { sectionId: newSection._id } },
      { session },
    );
    expect(session.endSession).toHaveBeenCalled();
    expect(result).toEqual<Partial<CreateSectionResponse>>({
      success: true,
      message: "Section амжилттай үүслээ!",
    });
  });

  it("ensures session.endSession is called even if transaction throws", async () => {
    (session.withTransaction as jest.Mock).mockImplementation(async () => {
      throw new GraphQLError("Simulated failure");
    });

    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "Simulated failure");

    expect(mongoose.startSession).toHaveBeenCalled();
    expect(session.endSession).toHaveBeenCalled();
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (CourseModel.findById as jest.Mock).mockImplementation(() => {
      throw new Error("DB fail");
    });

    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createSection(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "Internal server error");
    expect(session.endSession).toHaveBeenCalled();
  });
});
