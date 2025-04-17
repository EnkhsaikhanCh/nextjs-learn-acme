import { getCourseDetailsForInstructor } from "@/app/api/graphql/resolvers/queries/course/get-course-details-for-instructor-query";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import {
  CourseModel,
  EnrollmentModel,
  SectionModel,
} from "@/app/api/graphql/models";
import { GraphQLError } from "graphql";
import { Role, User } from "@/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  CourseModel: {
    findOne: jest.fn(),
  },
  EnrollmentModel: {
    countDocuments: jest.fn(),
  },
  SectionModel: {
    find: jest.fn(),
  },
}));

describe("getCourseDetailsForInstructor", () => {
  const fakeSlug = "course-slug";
  const ownerId = "owner-123";
  const adminUser: User = {
    _id: "admin-1",
    email: "admin@example.com",
    role: Role.Admin,
    studentId: "admin-student-id",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const instructorUser: User = {
    _id: ownerId,
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

  it("throws BAD_USER_INPUT error if slug is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    await expect(
      getCourseDetailsForInstructor(null, { slug: "" }, { user: adminUser }),
    ).rejects.toThrow("Course slug required");
  });

  it("throws COURSE_NOT_FOUND error if course is not found", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      getCourseDetailsForInstructor(
        null,
        { slug: fakeSlug },
        { user: adminUser },
      ),
    ).rejects.toThrow("Coures not found");
  });

  it("throws FORBIDDEN error if user is neither admin nor owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      _id: "course-1",
      slug: fakeSlug,
      createdBy: "different-owner",
      populate: jest.fn().mockResolvedValue({
        /* populated course */
      }),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourse);

    // Provide instructorUser whose _id does not match fakeCourse.createdBy
    await expect(
      getCourseDetailsForInstructor(
        null,
        { slug: fakeSlug },
        { user: instructorUser },
      ),
    ).rejects.toThrow("Access denied: You are not the course owner");
  });

  it("returns course details successfully for the course owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Create a fake course object with a populate method.
    const fakeCourseData = {
      _id: "course-1",
      slug: fakeSlug,
      createdBy: ownerId,
      // Other course fields as needed...
      populate: jest.fn().mockResolvedValue({
        _id: "course-1",
        slug: fakeSlug,
        createdBy: { _id: ownerId, email: "instructor@example.com" },
      }),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourseData);

    // Fake sections with lessons:
    // For example, first section has 2 lessons, second section has 1 lesson.
    const fakeSections = [
      { _id: "sec-1", lessons: [{ _id: "les-1" }, { _id: "les-2" }] },
      { _id: "sec-2", lessons: [{ _id: "les-3" }] },
    ];
    // Simulate SectionModel.find chainable populate; here we simply resolve to fakeSections.
    (SectionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeSections),
    });

    // Fake total enrollment: e.g. 5 enrollments.
    (EnrollmentModel.countDocuments as jest.Mock).mockResolvedValue(5);

    const result = await getCourseDetailsForInstructor(
      null,
      { slug: fakeSlug },
      { user: instructorUser },
    );

    expect(requireAuthAndRoles).toHaveBeenCalledWith(instructorUser, [
      "ADMIN",
      "INSTRUCTOR",
    ]);
    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug: fakeSlug });
    expect(fakeCourseData.populate).toHaveBeenCalledWith({
      path: "createdBy",
      model: "User",
    });
    expect(SectionModel.find).toHaveBeenCalledWith({
      courseId: fakeCourseData._id,
    });
    expect(EnrollmentModel.countDocuments).toHaveBeenCalledWith({
      courseId: fakeCourseData._id,
    });

    // totalSections should equal fakeSections.length (2).
    // totalLessons: 2 + 1 = 3.
    // totalEnrollment: 5.
    expect(result).toEqual({
      course: {
        _id: "course-1",
        slug: fakeSlug,
        createdBy: { _id: ownerId, email: "instructor@example.com" },
      },
      totalSections: 2,
      totalLessons: 3,
      totalEnrollment: 5,
    });
  });

  it("calculates totalLessons correctly even when some sections have no lessons property", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    // Fake course (as returned by CourseModel.findOne) with a populate method.
    const fakeCourseData = {
      _id: "course-1",
      slug: "course-slug",
      createdBy: ownerId,
      populate: jest.fn().mockResolvedValue({
        _id: "course-1",
        slug: "course-slug",
        createdBy: { _id: ownerId, email: "instructor@example.com" },
      }),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourseData);

    // Fake sections: first section has 1 lesson; second section has no lessons property.
    const fakeSections = [
      { _id: "sec-1", lessons: [{ _id: "les-1" }] },
      { _id: "sec-2" }, // lessons is undefined → treated as 0
    ];
    // Mock SectionModel.find to return a chainable mock with a populate method.
    (SectionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeSections),
    });

    // Enrollment count (for totalEnrollment) is not used in totalLessons calculation.
    (EnrollmentModel.countDocuments as jest.Mock).mockResolvedValue(5);

    // Assume instructorUser (the course owner) for this test:
    const instructorUser: User = {
      _id: ownerId,
      email: "instructor@example.com",
      role: Role.Instructor,
      studentId: "instructor-student-id",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await getCourseDetailsForInstructor(
      null,
      { slug: "course-slug" },
      { user: instructorUser },
    );

    // totalSections should be 2 (fakeSections.length)
    // totalLessons should equal 1 (only first section has one lesson, second contributes 0)
    expect(result.totalSections).toBe(2);
    expect(result.totalLessons).toBe(1);
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

    await expect(
      getCourseDetailsForInstructor(
        null,
        { slug: fakeSlug },
        { user: adminUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      getCourseDetailsForInstructor(
        null,
        { slug: fakeSlug },
        { user: adminUser },
      ),
    ).rejects.toMatchObject({
      message: "Internal server error",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
