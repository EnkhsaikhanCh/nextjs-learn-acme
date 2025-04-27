import { getInstructorCourseContent } from "@/app/api/graphql/resolvers/queries/instructor/get-instructor-course-content-query";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { CourseModel } from "@/app/api/graphql/models/course.model";
import { GraphQLError } from "graphql";
import { Role, User } from "@/generated/graphql";

jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: {
    findOne: jest.fn(),
  },
}));

describe("getInstructorCourseContent", () => {
  const instructor: User = {
    _id: "instr-1",
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

  it("throws UNAUTHENTICATED if authorization fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
    await expect(
      getInstructorCourseContent(null, { slug: "slug" }, { user: instructor }),
    ).rejects.toMatchObject({ message: "Unauthenticated" });
  });

  it("throws BAD_USER_INPUT if slug is missing", async () => {
    await expect(
      getInstructorCourseContent(null, { slug: "" }, { user: instructor }),
    ).rejects.toMatchObject({
      message: "Course slug is required",
      extensions: { code: "BAD_USER_INPUT" },
    });
  });

  it("throws COURSE_NOT_FOUND if course not found", async () => {
    const populateMock = jest.fn().mockResolvedValue(null);
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    await expect(
      getInstructorCourseContent(null, { slug: "slug" }, { user: instructor }),
    ).rejects.toMatchObject({
      message: "Course not found",
      extensions: { code: "COURSE_NOT_FOUND" },
    });
    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug: "slug" });
    expect(populateMock).toHaveBeenCalledWith({
      path: "sectionId",
      model: "Section",
      populate: {
        path: "lessonId",
        model: "LessonV2",
        populate: {
          path: "sectionId",
          model: "Section",
          populate: {
            path: "courseId",
            model: "Course",
            select: "slug",
          },
        },
      },
    });
  });

  it("throws FORBIDDEN if user is not the owner", async () => {
    const fakeCourse = { createdBy: "other-user" };
    const populateMock = jest.fn().mockResolvedValue(fakeCourse);
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    await expect(
      getInstructorCourseContent(null, { slug: "slug" }, { user: instructor }),
    ).rejects.toMatchObject({
      message: "Access denied: You are not authorized to get this course",
      extensions: { code: "FORBIDDEN" },
    });
  });

  it("returns course when user is owner", async () => {
    const fakeCourse = { createdBy: instructor._id, data: "ok" };
    const populateMock = jest.fn().mockResolvedValue(fakeCourse);
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    const result = await getInstructorCourseContent(
      null,
      { slug: "slug" },
      { user: instructor },
    );

    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug: "slug" });
    expect(populateMock).toHaveBeenCalled();
    expect(result).toBe(fakeCourse);
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (CourseModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("DB error");
    });
    await expect(
      getInstructorCourseContent(null, { slug: "slug" }, { user: instructor }),
    ).rejects.toMatchObject({
      message: "Failed to fetch user",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
