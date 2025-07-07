import { myEnrollmentV2ForCourse } from "@/app/api/graphql/resolvers/queries/enrollmentV2/my-enrollment-v2-for-course-query";
import { EnrollmentV2Model } from "@/app/api/graphql/models";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { UserV2, UserV2Role } from "@/generated/graphql";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models", () => ({
  EnrollmentV2Model: { findOne: jest.fn() },
}));

describe("myEnrollmentV2ForCourse", () => {
  const student: UserV2 = {
    _id: "u1",
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
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(
      new Error("Not authenticated"),
    );

    await expect(
      myEnrollmentV2ForCourse(
        null,
        { courseId: "course123" },
        { user: student },
      ),
    ).rejects.toThrow("Not authenticated");
  });

  it("returns failure if no enrollment found", async () => {
    const populateMock = jest.fn().mockResolvedValue(null);
    (EnrollmentV2Model.findOne as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    const res = await myEnrollmentV2ForCourse(
      null,
      { courseId: "course123" },
      { user: student },
    );

    expect(EnrollmentV2Model.findOne).toHaveBeenCalledWith({
      userId: student._id,
      courseId: "course123",
      isDeleted: false,
    });

    expect(res).toEqual({
      success: false,
      message: "No enrollment found for the specified course",
      enrollment: null,
    });
  });

  it("returns success if enrollment found", async () => {
    const fakeEnrollment = { _id: "e1", courseId: { _id: "course123" } };
    const populateMock = jest.fn().mockResolvedValue(fakeEnrollment);
    (EnrollmentV2Model.findOne as jest.Mock).mockReturnValue({
      populate: populateMock,
    });

    const res = await myEnrollmentV2ForCourse(
      null,
      { courseId: "course123" },
      { user: student },
    );

    expect(res).toEqual({
      success: true,
      message: "Enrollment fetched successfully",
      enrollment: fakeEnrollment,
    });
  });

  it("returns failure on unexpected DB error", async () => {
    (EnrollmentV2Model.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("DB error");
    });

    const res = await myEnrollmentV2ForCourse(
      null,
      { courseId: "course123" },
      { user: student },
    );

    expect(res).toEqual({
      success: false,
      message: "Failed to fetch enrollment",
      enrollment: null,
    });
  });
});
