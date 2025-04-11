import { getAllCoursesByInstructurId } from "@/app/api/graphql/resolvers/queries/course/get-all-courses-by-instructor-id-query";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { CourseModel } from "@/app/api/graphql/models";
import { GraphQLError } from "graphql";
import { Role, User } from "@/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  CourseModel: {
    find: jest.fn(),
  },
}));

describe("getAllCoursesByInstructurId", () => {
  const adminUser: User = {
    _id: "admin-id",
    email: "admin@example.com",
    role: Role.Admin,
    studentId: "admin-student-id",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const instructorUser: User = {
    _id: "instructor-id",
    email: "instructor@example.com",
    role: Role.Instructor,
    studentId: "instructor-student-id",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Throws an error if requireAuthAndRoles fails.
  it("throws an error if requireAuthAndRoles fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthorized", {
        extensions: { code: "UNAUTHORIZED" },
      }),
    );

    await expect(
      getAllCoursesByInstructurId(null, {}, { user: adminUser }),
    ).rejects.toThrow("Unauthorized");
  });

  // 2. Returns courses for an ADMIN user.
  it("returns courses created by the admin user", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeCourses = [
      { _id: "course-1", title: "Course 1", createdBy: adminUser._id },
      { _id: "course-2", title: "Course 2", createdBy: adminUser._id },
    ];
    (CourseModel.find as jest.Mock).mockResolvedValue(fakeCourses);

    const result = await getAllCoursesByInstructurId(
      null,
      {},
      { user: adminUser },
    );

    expect(requireAuthAndRoles).toHaveBeenCalledWith(adminUser, [
      "ADMIN",
      "INSTRUCTOR",
    ]);
    expect(CourseModel.find).toHaveBeenCalledWith({ createdBy: adminUser._id });
    expect(result).toEqual(fakeCourses);
  });

  // 3. Returns courses for an INSTRUCTOR user.
  it("returns courses created by the instructor user", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeCourses = [
      { _id: "course-3", title: "Course 3", createdBy: instructorUser._id },
    ];
    (CourseModel.find as jest.Mock).mockResolvedValue(fakeCourses);

    const result = await getAllCoursesByInstructurId(
      null,
      {},
      { user: instructorUser },
    );

    expect(requireAuthAndRoles).toHaveBeenCalledWith(instructorUser, [
      "ADMIN",
      "INSTRUCTOR",
    ]);
    expect(CourseModel.find).toHaveBeenCalledWith({
      createdBy: instructorUser._id,
    });
    expect(result).toEqual(fakeCourses);
  });

  // 4. Throws INTERNAL_SERVER_ERROR if CourseModel.find fails.
  it("throws INTERNAL_SERVER_ERROR if CourseModel.find fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(
      getAllCoursesByInstructurId(null, {}, { user: adminUser }),
    ).rejects.toMatchObject({
      message: "Internal server error",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
