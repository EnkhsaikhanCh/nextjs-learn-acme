// __tests__/api/graphql/queries/course/get-all-not-enrolled-courses-query.spec.ts
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { EnrollmentV2Model, CourseModel } from "@/app/api/graphql/models";
import { UserV2Role, UserV2 } from "@/generated/graphql";
import { getAllNotEnrolledCourses } from "@/app/api/graphql/resolvers/queries/course/get-all-not-enrolled-courses-query";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models", () => ({
  EnrollmentV2Model: { find: jest.fn() },
  CourseModel: { find: jest.fn() },
}));

describe("getAllNotEnrolledCourses", () => {
  const student: UserV2 = {
    _id: "student-1",
    email: "student@example.com",
    role: UserV2Role.Student,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRolesV2 as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws if authentication fails", async () => {
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(new Error("nope"));
    await expect(
      getAllNotEnrolledCourses(null, null, { user: student }),
    ).rejects.toThrow("nope");
  });

  it("fetches with _id nin when enrollments exist", async () => {
    const fakeEnrolls = [{ courseId: "c1" }, { courseId: "c2" }];
    (EnrollmentV2Model.find as jest.Mock).mockResolvedValue(fakeEnrolls);

    const fakeCourses = [{ _id: "c3" }, { _id: "c4" }];
    const findMock = { populate: jest.fn().mockResolvedValue(fakeCourses) };
    (CourseModel.find as jest.Mock).mockReturnValue(findMock);

    const res = await getAllNotEnrolledCourses(null, null, { user: student });

    expect(EnrollmentV2Model.find).toHaveBeenCalledWith({
      userId: student._id,
      status: ["ACTIVE", "COMPLETED"],
      isDeleted: false,
    });
    expect(CourseModel.find).toHaveBeenCalledWith({
      _id: { $nin: ["c1", "c2"] },
      status: "PUBLISHED",
    });
    expect(findMock.populate).toHaveBeenCalledWith({
      path: "createdBy",
      model: "UserV2",
    });
    expect(res).toEqual({
      success: true,
      message: "Successfully fetched courses not enrolled by user",
      courses: fakeCourses,
    });
  });

  it("fetches all published when no enrollments", async () => {
    (EnrollmentV2Model.find as jest.Mock).mockResolvedValue([]);
    const fakeCourses = [{ _id: "c5" }];
    const findMock = { populate: jest.fn().mockResolvedValue(fakeCourses) };
    (CourseModel.find as jest.Mock).mockReturnValue(findMock);

    const res = await getAllNotEnrolledCourses(null, null, { user: student });

    expect(CourseModel.find).toHaveBeenCalledWith({ status: "PUBLISHED" });
    expect(res.courses).toBe(fakeCourses);
  });

  it("returns failure when an exception is thrown", async () => {
    (EnrollmentV2Model.find as jest.Mock).mockRejectedValue(new Error("db"));
    const res = await getAllNotEnrolledCourses(null, null, { user: student });
    expect(res).toEqual({
      success: false,
      message: "Failed to fetch not enrolled courses",
      courses: [],
    });
  });
});
