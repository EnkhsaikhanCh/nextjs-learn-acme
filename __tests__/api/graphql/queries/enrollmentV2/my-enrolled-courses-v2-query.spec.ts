// __tests__/api/graphql/queries/enrollmentV2/my-enrolled-courses.spec.ts
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { EnrollmentV2Model } from "@/app/api/graphql/models/enrollmentV2.model";
import { EnrollmentV2Status, UserV2Role, UserV2 } from "@/generated/graphql";
import { myEnrolledCoursesV2 } from "@/app/api/graphql/resolvers/queries/enrollmentV2/my-enrolled-courses-v2-query";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock(
  "../../../../../src/app/api/graphql/models/enrollmentV2.model",
  () => ({
    EnrollmentV2Model: { find: jest.fn() },
  }),
);

describe("myEnrolledCourses", () => {
  const student: UserV2 = {
    _id: "u1",
    email: "s@example.com",
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
      new Error("no auth"),
    );
    await expect(
      myEnrolledCoursesV2(null, null, { user: student }),
    ).rejects.toThrow("no auth");
  });

  it("returns enrollments on successful query", async () => {
    const fakeEnrollments = [{ _id: "e1" }, { _id: "e2" }];
    const sortMock = { populate: jest.fn().mockResolvedValue(fakeEnrollments) };
    (EnrollmentV2Model.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue(sortMock),
    });

    const result = await myEnrolledCoursesV2(null, null, { user: student });

    expect(requireAuthAndRolesV2).toHaveBeenCalledWith(student, [
      UserV2Role.Student,
    ]);
    expect(EnrollmentV2Model.find).toHaveBeenCalledWith({
      userId: student._id,
      isDeleted: false,
      status: {
        $in: [EnrollmentV2Status.Active, EnrollmentV2Status.Completed],
      },
    });
    expect(sortMock.populate).toHaveBeenCalledWith({
      path: "courseId",
      model: "Course",
    });
    expect(result).toEqual({
      success: true,
      message: "Enrolled courses fetched successfully",
      enrollments: fakeEnrollments,
    });
  });

  it("returns failure when underlying query throws", async () => {
    (EnrollmentV2Model.find as jest.Mock).mockImplementation(() => {
      throw new Error("DB error");
    });

    const result = await myEnrolledCoursesV2(null, null, { user: student });

    expect(result).toEqual({
      success: false,
      message: "Failed to fetch enrolled courses",
      enrollments: [],
    });
  });
});
