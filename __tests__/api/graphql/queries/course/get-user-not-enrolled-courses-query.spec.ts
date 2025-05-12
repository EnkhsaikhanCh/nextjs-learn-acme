import { getUserNotEnrolledCourses } from "@/app/api/graphql/resolvers/queries/course/get-user-not-enrolled-courses-query";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { EnrollmentModel, CourseModel } from "@/app/api/graphql/models";
import { GraphQLError } from "graphql";
import { Role, User } from "@/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  EnrollmentModel: {
    find: jest.fn(),
  },
  CourseModel: {
    find: jest.fn(),
  },
}));

describe("getUserNotEnrolledCourses", () => {
  const testUserId = "user123";
  const adminUser: User = {
    _id: "admin-id",
    email: "admin@example.com",
    role: Role.Admin,
    studentId: "admin-student-id",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const studentUser: User = {
    _id: testUserId,
    email: "student@example.com",
    role: Role.Student,
    studentId: "student-123",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Throws error if requireAuthAndRoles fails.
  it("throws an error if requireAuthAndRoles fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );

    await expect(
      getUserNotEnrolledCourses(
        null,
        { userId: testUserId },
        { user: adminUser },
      ),
    ).rejects.toThrow("Unauthenticated");
  });

  // 2. Throws error if a non-admin tries to view another user's enrollments.
  it("throws an error if a non-admin user tries to view another user's enrollments", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    // For a student, if the context user ID does not match the provided userId, throw an error.
    await expect(
      getUserNotEnrolledCourses(
        null,
        { userId: "differentUser" },
        { user: studentUser },
      ),
    ).rejects.toThrow("Та зөвхөн өөрийн хичээлүүдийг харах боломжтой");
  });

  // 3. Returns courses not enrolled for an ADMIN user when enrollments exist
  it("returns courses not enrolled for an admin user when enrollments exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeEnrollments = [
      { _id: "enroll-1", courseId: "course-1" },
      { _id: "enroll-2", courseId: "course-2" },
    ];
    (EnrollmentModel.find as jest.Mock).mockResolvedValue(fakeEnrollments);

    // For admin users, statusFilter is an empty object.
    // So query becomes: { _id: { $nin: ["course-1", "course-2"] } }
    const fakeCourses = [
      { _id: "course-3", title: "Course 3" },
      { _id: "course-4", title: "Course 4" },
    ];
    // Instead of returning a chainable object, simply resolve with the fake courses.
    (CourseModel.find as jest.Mock).mockResolvedValue(fakeCourses);

    const result = await getUserNotEnrolledCourses(
      null,
      { userId: testUserId },
      { user: adminUser },
    );

    expect(EnrollmentModel.find).toHaveBeenCalledWith({
      userId: testUserId,
      status: "ACTIVE",
    });
    expect(CourseModel.find).toHaveBeenCalledWith({
      _id: { $nin: ["course-1", "course-2"] },
    });
    expect(result).toEqual(fakeCourses);
  });

  // 4. Returns courses not enrolled for a STUDENT viewing their own courses when enrollments exist
  it("returns courses not enrolled for a student viewing their own courses", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeEnrollments = [
      { _id: "enroll-1", courseId: "course-1" },
      { _id: "enroll-2", courseId: "course-2" },
    ];
    (EnrollmentModel.find as jest.Mock).mockResolvedValue(fakeEnrollments);

    // For STUDENT (non-admin), statusFilter is { status: "PUBLISHED" }.
    // So query becomes: { _id: { $nin: ["course-1", "course-2"] }, status: "PUBLISHED" }
    const fakeCourses = [
      { _id: "course-3", title: "Course 3" },
      { _id: "course-4", title: "Course 4" },
    ];
    (CourseModel.find as jest.Mock).mockResolvedValue(fakeCourses);

    const result = await getUserNotEnrolledCourses(
      null,
      { userId: testUserId },
      { user: studentUser },
    );

    expect(EnrollmentModel.find).toHaveBeenCalledWith({
      userId: testUserId,
      status: "ACTIVE",
    });
    expect(CourseModel.find).toHaveBeenCalledWith({
      _id: { $nin: ["course-1", "course-2"] },
      status: "PUBLISHED",
    });
    expect(result).toEqual(fakeCourses);
  });

  // 5. Returns courses not enrolled for a STUDENT when there are no enrollments.
  it("returns courses not enrolled for a student when there are no enrollments", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Simulate an empty array of enrollments.
    (EnrollmentModel.find as jest.Mock).mockResolvedValue([]);

    // For a student, query becomes simply: { status: "PUBLISHED" }
    const fakeCourses = [
      { _id: "course-5", title: "Course 5" },
      { _id: "course-6", title: "Course 6" },
    ];
    (CourseModel.find as jest.Mock).mockResolvedValue(fakeCourses);

    const result = await getUserNotEnrolledCourses(
      null,
      { userId: testUserId },
      { user: studentUser },
    );

    expect(EnrollmentModel.find).toHaveBeenCalledWith({
      userId: testUserId,
      status: "ACTIVE",
    });
    expect(CourseModel.find).toHaveBeenCalledWith({ status: "PUBLISHED" });
    expect(result).toEqual(fakeCourses);
  });

  // 6. Throws INTERNAL_SERVER_ERROR if the course query fails
  it("throws INTERNAL_SERVER_ERROR if CourseModel.find fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Simulate enrollments found
    (EnrollmentModel.find as jest.Mock).mockResolvedValue([
      { _id: "enroll-1", courseId: "course-1" },
    ]);
    // Simulate a database error in CourseModel.find
    (CourseModel.find as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(
      getUserNotEnrolledCourses(
        null,
        { userId: testUserId },
        { user: adminUser },
      ),
    ).rejects.toMatchObject({
      message: "Internal server error",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
