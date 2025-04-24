import { getLessonV2ByIdForInstructor } from "@/app/api/graphql/resolvers/queries/lessonV2/get-lesson-v2-by-id-for-instructor-query";
import { LessonV2Model } from "@/app/api/graphql/models";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { Role, User } from "@/generated/graphql";

jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  LessonV2Model: {
    findById: jest.fn(),
  },
}));

describe("getLessonV2ByIdForInstructor", () => {
  const instructorUser: User = {
    _id: "inst-1",
    email: "inst@example.com",
    role: Role.Instructor,
    studentId: "stud-1",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws BAD_USER_INPUT if id is missing", async () => {
    await expect(
      getLessonV2ByIdForInstructor(null, { _id: "" }, { user: instructorUser }),
    ).rejects.toMatchObject({ message: "Lesson ID is required" });
  });

  it("throws UNAUTHENTICATED if authorization fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
    await expect(
      getLessonV2ByIdForInstructor(
        null,
        { _id: "lesson-1" },
        { user: instructorUser },
      ),
    ).rejects.toMatchObject({ message: "Unauthenticated" });
  });

  it("throws NOT_FOUND if lesson not found", async () => {
    (LessonV2Model.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });
    await expect(
      getLessonV2ByIdForInstructor(
        null,
        { _id: "lesson-1" },
        { user: instructorUser },
      ),
    ).rejects.toMatchObject({ message: "Lesson not found" });
  });

  it("throws INTERNAL_SERVER_ERROR if ownership data is missing", async () => {
    const fakeLesson = { sectionId: {} };
    (LessonV2Model.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeLesson),
    });
    await expect(
      getLessonV2ByIdForInstructor(
        null,
        { _id: "lesson-1" },
        { user: instructorUser },
      ),
    ).rejects.toMatchObject({ message: "Missing course ownership data" });
  });

  it("throws FORBIDDEN if user is not course owner", async () => {
    const fakeLesson = {
      sectionId: { courseId: { createdBy: "other-user" } },
    };
    (LessonV2Model.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeLesson),
    });
    await expect(
      getLessonV2ByIdForInstructor(
        null,
        { _id: "lesson-1" },
        { user: instructorUser },
      ),
    ).rejects.toMatchObject({ message: "Access denied: Not your course" });
  });

  it("returns lesson when user is owner", async () => {
    const fakeLesson = {
      _id: "lesson-1",
      sectionId: { courseId: { createdBy: instructorUser._id } },
    };
    const populateMock = jest.fn().mockResolvedValue(fakeLesson);
    (LessonV2Model.findById as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    const result = await getLessonV2ByIdForInstructor(
      null,
      { _id: "lesson-1" },
      { user: instructorUser },
    );

    expect(LessonV2Model.findById).toHaveBeenCalledWith("lesson-1");
    expect(populateMock).toHaveBeenCalledWith({
      path: "sectionId",
      model: "Section",
      populate: {
        path: "courseId",
        model: "Course",
        select: "_id slug createdBy",
      },
    });
    expect(result).toBe(fakeLesson);
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected error", async () => {
    (LessonV2Model.findById as jest.Mock).mockImplementation(() => {
      throw new Error("DB error");
    });
    await expect(
      getLessonV2ByIdForInstructor(
        null,
        { _id: "lesson-1" },
        { user: instructorUser },
      ),
    ).rejects.toMatchObject({ message: "Failed to load lesson" });
  });
});
