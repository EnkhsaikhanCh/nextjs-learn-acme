import { EnrollmentModel } from "@/app/api/graphql/models/enrollment.model";
import { getUserEnrolledCoursesCount } from "@/app/api/graphql/resolvers/queries/course/get-user-enrolled-courses-count";
import { Role, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";

// Mock the required modules
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/enrollment.model", () => ({
  EnrollmentModel: {
    countDocuments: jest.fn(),
  },
}));

describe("getUserEnrolledCoursesCount", () => {
  const testUserId = "user123";
  const adminUser: User = {
    _id: "admin-1",
    email: "admin@example.com",
    role: Role.Admin,
    studentId: "student-1",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns correct counts and course completion percentage when enrollments exist", async () => {
    // Simulate 3 active (in-progress) courses and 2 completed courses.
    const activeCount = 3;
    const completedCount = 2;
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (EnrollmentModel.countDocuments as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve(activeCount))
      .mockImplementationOnce(() => Promise.resolve(completedCount));

    const result = await getUserEnrolledCoursesCount(
      null,
      { userId: testUserId },
      { user: adminUser },
    );

    const totalCourses = activeCount + completedCount; // 5
    const courseCompletionPercentage = parseFloat(
      ((completedCount / totalCourses) * 100).toFixed(2),
    ); // 40.00

    expect(result).toEqual({
      totalCourses,
      completedCount,
      inProgressCount: activeCount,
      courseCompletionPercentage,
    });
  });

  it("returns zero completion percentage when no courses are enrolled", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (EnrollmentModel.countDocuments as jest.Mock)
      .mockResolvedValueOnce(0) // active courses
      .mockResolvedValueOnce(0); // completed courses

    const result = await getUserEnrolledCoursesCount(
      null,
      { userId: testUserId },
      { user: adminUser },
    );

    expect(result).toEqual({
      totalCourses: 0,
      completedCount: 0,
      inProgressCount: 0,
      courseCompletionPercentage: 0,
    });
  });

  it("throws INTERNAL_SERVER_ERROR if requireAuthAndRoles fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new Error("Unauthorized"),
    );

    await expect(
      getUserEnrolledCoursesCount(
        null,
        { userId: testUserId },
        { user: adminUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      getUserEnrolledCoursesCount(
        null,
        { userId: testUserId },
        { user: adminUser },
      ),
    ).rejects.toMatchObject({
      message: "Internal server error",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });

  it("throws INTERNAL_SERVER_ERROR if countDocuments fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (EnrollmentModel.countDocuments as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );

    await expect(
      getUserEnrolledCoursesCount(
        null,
        { userId: testUserId },
        { user: adminUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      getUserEnrolledCoursesCount(
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
