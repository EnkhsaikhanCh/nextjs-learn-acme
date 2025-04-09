import { EnrollmentModel } from "@/app/api/graphql/models/enrollment.model";
import { getUserEnrolledCourses } from "@/app/api/graphql/resolvers/queries/enrollment/get-user-enrolled-courses-query";
import { Role, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";

// Mock the required modules
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/enrollment.model", () => ({
  EnrollmentModel: {
    find: jest.fn(),
  },
}));

describe("getUserEnrolledCourses", () => {
  const testUserId = "user123";
  const adminUser: User = {
    _id: "admin-1",
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

  // 1. Throws an error if requireAuthAndRoles fails
  it("throws an error if requireAuthAndRoles fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );

    await expect(
      getUserEnrolledCourses(null, { userId: testUserId }, { user: adminUser }),
    ).rejects.toThrow("Unauthenticated");
  });

  // 2. Throws an error if a non-admin user tries to view another user's enrollments
  it("throws an error if a non-admin user tries to view another user's enrollments", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // studentUser is not ADMIN and _id does not match provided userId
    await expect(
      getUserEnrolledCourses(
        null,
        { userId: "anotherUser" },
        { user: studentUser },
      ),
    ).rejects.toThrow("Та зөвхөн өөрийн хичээлүүдийг харах боломжтой");
  });

  // 3. Returns enrollments for an ADMIN user
  it("returns enrollments for an admin user", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeEnrollments = [
      { _id: "enroll-1", courseId: { title: "Course 1" } },
      { _id: "enroll-2", courseId: { title: "Course 2" } },
    ];

    // Create a chainable mock for EnrollmentModel.find that includes a populate function.
    const findMock = {
      populate: jest.fn().mockResolvedValue(fakeEnrollments),
    };
    (EnrollmentModel.find as jest.Mock).mockReturnValue(findMock);

    const result = await getUserEnrolledCourses(
      null,
      { userId: testUserId },
      { user: adminUser },
    );

    expect(requireAuthAndRoles).toHaveBeenCalledWith(adminUser, [
      "STUDENT",
      "ADMIN",
    ]);
    expect(EnrollmentModel.find).toHaveBeenCalledWith({
      userId: testUserId,
      isDeleted: false,
      status: { $in: ["ACTIVE", "COMPLETED"] },
    });
    expect(findMock.populate).toHaveBeenCalledWith({
      path: "courseId",
      model: "Course",
    });
    expect(result).toEqual(fakeEnrollments);
  });

  // 4. Returns enrollments for a STUDENT viewing their own courses
  it("returns enrollments for a student viewing their own courses", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeEnrollments = [
      { _id: "enroll-1", courseId: { title: "Course 1" } },
      { _id: "enroll-2", courseId: { title: "Course 2" } },
    ];
    const findMock = {
      populate: jest.fn().mockResolvedValue(fakeEnrollments),
    };
    (EnrollmentModel.find as jest.Mock).mockReturnValue(findMock);

    const result = await getUserEnrolledCourses(
      null,
      { userId: testUserId },
      { user: studentUser },
    );

    expect(EnrollmentModel.find).toHaveBeenCalledWith({
      userId: testUserId,
      isDeleted: false,
      status: { $in: ["ACTIVE", "COMPLETED"] },
    });
    expect(findMock.populate).toHaveBeenCalledWith({
      path: "courseId",
      model: "Course",
    });
    expect(result).toEqual(fakeEnrollments);
  });

  // 5. Throws INTERNAL_SERVER_ERROR if EnrollmentModel.find or populate fails
  it("throws INTERNAL_SERVER_ERROR if the enrollment query fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (EnrollmentModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await expect(
      getUserEnrolledCourses(null, { userId: testUserId }, { user: adminUser }),
    ).rejects.toMatchObject({
      message: "Internal server error",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
