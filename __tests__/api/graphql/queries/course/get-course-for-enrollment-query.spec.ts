import { CourseModel } from "@/app/api/graphql/models/course.model";
import { EnrollmentV2Model } from "@/app/api/graphql/models/enrollmentV2.model";
import { getCourseForEnrollment } from "@/app/api/graphql/resolvers/queries/course/get-course-for-enrollment-query";
import {
  EnrollmentStatus,
  StudentUserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: { findOne: jest.fn() },
}));
jest.mock(
  "../../../../../src/app/api/graphql/models/enrollmentV2.model",
  () => ({
    EnrollmentV2Model: { findOne: jest.fn() },
  }),
);

describe("getCourseForEnrollment", () => {
  const studentUser: StudentUserV2 = {
    _id: "user1",
    email: "stu@example.com",
    role: UserV2Role.Student,
    studentId: "stud1",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRolesV2 as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws if authentication fails", async () => {
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(
      new Error("No auth"),
    );
    await expect(
      getCourseForEnrollment(null, { slug: "abc" }, { user: studentUser }),
    ).rejects.toThrow("No auth");
  });

  it("returns error when slug is missing", async () => {
    const res = await getCourseForEnrollment(
      null,
      { slug: "" },
      { user: studentUser },
    );
    expect(res).toEqual({
      success: false,
      message: "Course slug is required.",
      fullContent: null,
    });
  });

  it("returns error when course not found", async () => {
    (CourseModel.findOne as jest.Mock).mockResolvedValue(null);
    const res = await getCourseForEnrollment(
      null,
      { slug: "slug1" },
      { user: studentUser },
    );
    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug: "slug1" });
    expect(res).toEqual({
      success: false,
      message: "Course not found.",
      fullContent: null,
    });
  });

  it("returns error when enrollment is missing", async () => {
    const fakeCourse = {
      _id: "cid",
      populate: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourse);
    (EnrollmentV2Model.findOne as jest.Mock).mockResolvedValue(null);
    const res = await getCourseForEnrollment(
      null,
      { slug: "slug1" },
      { user: studentUser },
    );
    expect(fakeCourse.populate).toHaveBeenCalled();
    expect(res).toEqual({
      success: false,
      message: "Your enrollment has expired or is invalid.",
      fullContent: null,
    });
  });

  it("returns error when enrollment status is Expired", async () => {
    const fakeCourse = {
      _id: "cid",
      populate: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourse);
    (EnrollmentV2Model.findOne as jest.Mock).mockResolvedValue({
      status: EnrollmentStatus.Expired,
      expiryDate: undefined,
    });
    const res = await getCourseForEnrollment(
      null,
      { slug: "slug1" },
      { user: studentUser },
    );
    expect(res.message).toBe("Your enrollment has expired or is invalid.");
  });

  it("returns error when enrollment has passed expiryDate", async () => {
    const fakeCourse = {
      _id: "cid",
      populate: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourse);
    (EnrollmentV2Model.findOne as jest.Mock).mockResolvedValue({
      status: EnrollmentStatus.Active,
      expiryDate: new Date(Date.now() - 1000),
    });
    const res = await getCourseForEnrollment(
      null,
      { slug: "slug1" },
      { user: studentUser },
    );
    expect(res.message).toBe("Your enrollment has expired or is invalid.");
  });

  it("returns course when enrollment is valid", async () => {
    const fakeCourse = {
      _id: "cid",
      populate: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourse);
    (EnrollmentV2Model.findOne as jest.Mock).mockResolvedValue({
      status: EnrollmentStatus.Active,
      expiryDate: new Date(Date.now() + 100000),
    });
    const res = await getCourseForEnrollment(
      null,
      { slug: "slug1" },
      { user: studentUser },
    );
    expect(res).toEqual({
      success: true,
      message: "Course fetched successfully.",
      fullContent: fakeCourse,
    });
  });

  it("handles unexpected errors gracefully", async () => {
    (CourseModel.findOne as jest.Mock).mockRejectedValue(new Error("fail"));
    const res = await getCourseForEnrollment(
      null,
      { slug: "slug1" },
      { user: studentUser },
    );
    expect(res).toEqual({
      success: false,
      message: "An error occurred while fetching the course.",
      fullContent: null,
    });
  });
});
