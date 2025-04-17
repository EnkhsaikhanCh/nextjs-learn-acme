import { getCourseBasicInfoForEdit } from "@/app/api/graphql/resolvers/queries/course/get-course-basic-info-for-edit-query";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { CourseModel } from "@/app/api/graphql/models/course.model";
import { Role, User } from "@/generated/graphql";

// Mock the dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: {
    findOne: jest.fn(),
  },
}));

describe("getCourseBasicInfoForEdit", () => {
  const fakeSlug = "course-slug";
  const ownerId = "owner-123";
  const adminUser: User = {
    _id: "admin-456",
    email: "admin@example.com",
    role: Role.Admin,
    studentId: "admin-student",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const instructorUser: User = {
    _id: ownerId,
    email: "instructor@example.com",
    role: Role.Instructor,
    studentId: "instructor-student",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const nonOwnerUser: User = {
    _id: "user-789",
    email: "user@example.com",
    role: Role.Instructor,
    studentId: "user-student",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Throws an error if slug is missing.
  it("throws an error if slug is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    await expect(
      getCourseBasicInfoForEdit(null, { slug: "" }, { user: instructorUser }),
    ).rejects.toThrow("Course slug is required");
  });

  // 2. Throws an error if course is not found.
  it("throws an error if course is not found", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      getCourseBasicInfoForEdit(
        null,
        { slug: fakeSlug },
        { user: instructorUser },
      ),
    ).rejects.toThrow("Course not found");
  });

  // 3. Throws an error if a non-admin (and non-owner) user tries to access a course they do not own.
  it("throws an error if non-admin user tries to access a course not owned by them", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Simulate a found course that was created by the owner.
    const fakeCourse = {
      _id: "course-1",
      slug: fakeSlug,
      createdBy: ownerId,
      populate: jest.fn().mockResolvedValue("populated-course"),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourse);

    await expect(
      getCourseBasicInfoForEdit(
        null,
        { slug: fakeSlug },
        { user: nonOwnerUser },
      ),
    ).rejects.toThrow("Access denied: You are not the course owner");
  });

  // 4. Returns course details for the course owner.
  // Example test case for course owner
  it("returns course details when course is found and user is the owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakePopulatedCourse = {
      _id: "course-1",
      slug: fakeSlug,
      createdBy: { _id: "owner-123", email: "instructor@example.com" },
    };
    // Create a fake course object; note that the `populate` method will mutate the object.
    interface FakeCourse {
      _id: string;
      slug: string;
      createdBy: string | { _id: string; email: string };
      populate: (options: {
        path: string;
        model: string;
      }) => Promise<FakeCourse>;
    }

    const fakeCourse: FakeCourse = {
      _id: "course-1",
      slug: fakeSlug,
      createdBy: ownerId, // initially not populated
      populate: jest.fn().mockImplementation(async () => {
        // Simulate in-place population by updating the createdBy field.
        fakeCourse.createdBy = {
          _id: "owner-123",
          email: "instructor@example.com",
        };
        return fakeCourse;
      }),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourse);

    const result = await getCourseBasicInfoForEdit(
      null,
      { slug: fakeSlug },
      { user: instructorUser },
    );
    expect(requireAuthAndRoles).toHaveBeenCalledWith(instructorUser, [
      "ADMIN",
      "INSTRUCTOR",
    ]);
    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug: fakeSlug });
    expect(fakeCourse.populate).toHaveBeenCalledWith({
      path: "createdBy",
      model: "User",
    });

    // Remove the populate function from the returned object before comparing.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { populate, ...resultData } = result;
    expect(resultData).toEqual(fakePopulatedCourse);
  });

  // 5. Returns course details for an ADMIN user (regardless of course ownership).
  // Test for ADMIN access, simulating population in-place.
  it("returns course details when course is found and user is admin", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    // Create a fake course object that has a populate method which mutates the course.
    interface FakeCourse {
      _id: string;
      slug: string;
      createdBy: string | { _id: string; email: string };
      populate: (options: {
        path: string;
        model: string;
      }) => Promise<FakeCourse>;
    }

    const fakeCourse: FakeCourse = {
      _id: "course-2",
      slug: fakeSlug,
      createdBy: "some-owner", // Not populated yet.
      populate: jest.fn().mockImplementation(async () => {
        // Simulate in-place population: update createdBy to an object.
        fakeCourse.createdBy = {
          _id: "some-owner",
          email: "owner@example.com",
        };
        return fakeCourse;
      }),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourse);

    const result = await getCourseBasicInfoForEdit(
      null,
      { slug: fakeSlug },
      { user: adminUser },
    );

    expect(requireAuthAndRoles).toHaveBeenCalledWith(adminUser, [
      "ADMIN",
      "INSTRUCTOR",
    ]);
    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug: fakeSlug });
    expect(fakeCourse.populate).toHaveBeenCalledWith({
      path: "createdBy",
      model: "User",
    });

    // Remove the populate property from the result before comparing.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { populate, ...resultData } = result;
    const expected = {
      _id: "course-2",
      slug: fakeSlug,
      createdBy: { _id: "some-owner", email: "owner@example.com" },
    };

    expect(resultData).toEqual(expected);
  });

  // 6. Throws INTERNAL_SERVER_ERROR if an unexpected error occurs.
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(
      getCourseBasicInfoForEdit(null, { slug: fakeSlug }, { user: adminUser }),
    ).rejects.toMatchObject({
      message: "Internal server error",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
