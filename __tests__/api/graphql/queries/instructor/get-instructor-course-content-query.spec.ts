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
  const instructorId = "instr-1";
  const instructorUser: User = {
    _id: instructorId,
    email: "inst@example.com",
    role: Role.Instructor,
    studentId: "stud-1",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const slug = "course-slug";
  const fakeCourse = {
    _id: "course-1",
    slug,
    createdBy: instructorId,
    sectionId: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws if user not authenticated/authorized", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
    await expect(
      getInstructorCourseContent(null, { slug }, { user: instructorUser }),
    ).rejects.toThrow("Unauthenticated");
  });

  it("throws BAD_USER_INPUT if slug is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    await expect(
      getInstructorCourseContent(null, { slug: "" }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      getInstructorCourseContent(null, { slug: "" }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "Course slug is required");
  });

  it("throws COURSE_NOT_FOUND if course does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const populateMock = jest.fn().mockResolvedValue(null);
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    await expect(
      getInstructorCourseContent(null, { slug }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      getInstructorCourseContent(null, { slug }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "Course not found");
  });

  it("throws FORBIDDEN if user is not the owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const otherId = "other-2";
    const courseObj = { ...fakeCourse, createdBy: otherId };
    const populateMock = jest.fn().mockResolvedValue(courseObj);
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    await expect(
      getInstructorCourseContent(null, { slug }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      getInstructorCourseContent(null, { slug }, { user: instructorUser }),
    ).rejects.toHaveProperty(
      "message",
      "Access denied: You are not authorized to get this course",
    );
  });

  it("returns course when owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const populateMock = jest.fn().mockResolvedValue(fakeCourse);
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    const result = await getInstructorCourseContent(
      null,
      { slug },
      { user: instructorUser },
    );

    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug });
    expect(populateMock).toHaveBeenCalledWith({
      path: "sectionId",
      model: "Section",
      populate: { path: "lessonId", model: "Lesson" },
    });
    expect(result).toBe(fakeCourse);
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("DB fail");
    });

    await expect(
      getInstructorCourseContent(null, { slug }, { user: instructorUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      getInstructorCourseContent(null, { slug }, { user: instructorUser }),
    ).rejects.toHaveProperty("message", "Failed to fetch user");
  });
});
