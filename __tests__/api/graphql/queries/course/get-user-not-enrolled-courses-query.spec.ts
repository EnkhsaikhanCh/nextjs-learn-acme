// __tests__/api/graphql/queries/course/get-user-not-enrolled-courses-query.spec.ts

import { requireAuthAndRoles } from "@/lib/auth-utils";
import { EnrollmentModel, CourseModel } from "@/app/api/graphql/models";
import { Role, User } from "@/generated/graphql";
import { getUserNotEnrolledCourses } from "@/app/api/graphql/resolvers/queries/course/get-user-not-enrolled-courses-query";

jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  EnrollmentModel: { find: jest.fn() },
  CourseModel: { find: jest.fn() },
}));

describe("getUserNotEnrolledCourses", () => {
  const admin: User = {
    _id: "u1",
    email: "a@x.com",
    role: Role.Admin,
    studentId: "s1",
    isVerified: true,
  };
  const student: User = {
    _id: "u2",
    email: "b@x.com",
    role: Role.Student,
    studentId: "s2",
    isVerified: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws if auth fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new Error("Internal server error"),
    );
    await expect(
      getUserNotEnrolledCourses(null, { userId: "u2" }, { user: admin }),
    ).rejects.toThrow("Internal server error");
  });

  it("throws if student tries to view another user's courses", async () => {
    await expect(
      getUserNotEnrolledCourses(null, { userId: "u3" }, { user: student }),
    ).rejects.toThrow("Та зөвхөн өөрийн хичээлүүдийг харах боломжтой");
  });

  it("returns not-enrolled courses for admin when enrollments exist", async () => {
    (EnrollmentModel.find as jest.Mock).mockResolvedValue([
      { courseId: "c1" },
      { courseId: "c2" },
    ]);
    const fakeFind = {
      populate: jest.fn().mockResolvedValue([{ _id: "c3" }, { _id: "c4" }]),
    };
    (CourseModel.find as jest.Mock).mockReturnValue(fakeFind);

    const result = await getUserNotEnrolledCourses(
      null,
      { userId: "uX" },
      { user: admin },
    );

    expect(EnrollmentModel.find).toHaveBeenCalledWith({
      userId: "uX",
      status: "ACTIVE",
    });
    expect(CourseModel.find).toHaveBeenCalledWith({
      _id: { $nin: ["c1", "c2"] },
    });
    expect(fakeFind.populate).toHaveBeenCalledWith({
      path: "createdBy",
      model: "UserV2",
    });
    expect(result).toEqual([{ _id: "c3" }, { _id: "c4" }]);
  });

  it("returns not-enrolled courses for student viewing own courses", async () => {
    (EnrollmentModel.find as jest.Mock).mockResolvedValue([{ courseId: "x" }]);
    const chain = {
      populate: jest.fn().mockResolvedValue(["A", "B"]),
    };
    (CourseModel.find as jest.Mock).mockReturnValue(chain);

    const res = await getUserNotEnrolledCourses(
      null,
      { userId: student._id },
      { user: student },
    );

    expect(CourseModel.find).toHaveBeenCalledWith({
      _id: { $nin: ["x"] },
      status: "PUBLISHED",
    });
    expect(res).toEqual(["A", "B"]);
  });

  it("returns all published courses when no enrollments", async () => {
    (EnrollmentModel.find as jest.Mock).mockResolvedValue([]);
    const chain = { populate: jest.fn().mockResolvedValue(["C"]) };
    (CourseModel.find as jest.Mock).mockReturnValue(chain);

    const res = await getUserNotEnrolledCourses(
      null,
      { userId: student._id },
      { user: student },
    );
    expect(CourseModel.find).toHaveBeenCalledWith({ status: "PUBLISHED" });
    expect(res).toEqual(["C"]);
  });

  it("throws INTERNAL_SERVER_ERROR if CourseModel.find throws", async () => {
    (EnrollmentModel.find as jest.Mock).mockResolvedValue([]);
    (CourseModel.find as jest.Mock).mockImplementation(() => {
      throw new Error("db");
    });

    await expect(
      getUserNotEnrolledCourses(null, { userId: admin._id }, { user: admin }),
    ).rejects.toMatchObject({
      message: "Internal server error",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
