import { instructorCourseOverview } from "@/app/api/graphql/resolvers/queries/course/instructor-course-overview-query";
import {
  CourseModel,
  EnrollmentV2Model,
  SectionModel,
} from "@/app/api/graphql/models";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { GraphQLError } from "graphql";
import { Course, UserV2Role } from "@/generated/graphql";
import { calculateCourseCompletionPercent } from "@/utils/courseUtils";

// Mocks
jest.mock("../../../../../src/lib/auth-userV2-utils");
jest.mock("../../../../../src/app/api/graphql/models");
jest.mock("../../../../../src/utils/courseUtils");

const mockRequireAuth = requireAuthAndRolesV2 as jest.Mock;
const mockCourseModel = CourseModel;
const mockSectionModel = SectionModel;
const mockEnrollmentModel = EnrollmentV2Model;
const mockCalculateCompletion = calculateCourseCompletionPercent as jest.Mock;

const baseUser = {
  _id: "user-1",
  email: "example-base@email.com",
  isVerified: true,
  role: UserV2Role.Instructor,
};

const mockFindOnePopulated = (course: Course) => ({
  populate: () => Promise.resolve(course),
});

describe("instructorCourseOverview resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue(undefined);
  });

  it("returns course overview for instructor owner", async () => {
    mockRequireAuth.mockResolvedValueOnce(true);
    (mockCourseModel.findOne as jest.Mock).mockReturnValueOnce(
      mockFindOnePopulated({
        _id: "course-1",
        slug: "course-slug",
        createdBy: { _id: "user-1" },
      }),
    );

    (mockSectionModel.find as jest.Mock).mockReturnValueOnce({
      populate: () => ({
        lean: () =>
          Promise.resolve([
            { _id: "s1", lessonId: [{}, {}] },
            { _id: "s2", lessonId: [{}] },
          ]),
      }),
    });

    (mockEnrollmentModel.countDocuments as jest.Mock).mockResolvedValueOnce(5);
    mockCalculateCompletion.mockReturnValueOnce(85);

    const result = await instructorCourseOverview(
      {},
      { slug: "course-slug" },
      { user: baseUser },
    );

    expect(result.totalSections).toBe(2);
    expect(result.totalLessons).toBe(3);
    expect(result.totalEnrollment).toBe(5);
    expect(result.completionPercent).toBe(85);
  });

  it("allows access for admin even if not owner", async () => {
    const adminUser = { _id: "admin-1", role: UserV2Role.Admin };

    mockRequireAuth.mockResolvedValueOnce(true);
    (mockCourseModel.findOne as jest.Mock).mockReturnValueOnce(
      mockFindOnePopulated({
        _id: "course-1",
        slug: "course-slug",
        createdBy: { _id: "someone-else" },
      }),
    );

    (mockSectionModel.find as jest.Mock).mockReturnValueOnce({
      populate: () => ({
        lean: () => Promise.resolve([{ _id: "s1", lessonId: [{}] }]),
      }),
    });

    (mockEnrollmentModel.countDocuments as jest.Mock).mockResolvedValueOnce(2);
    mockCalculateCompletion.mockReturnValueOnce(42);

    const result = await instructorCourseOverview(
      {},
      { slug: "course-slug" },
      { user: adminUser },
    );

    expect(result.totalSections).toBe(1);
    expect(result.totalLessons).toBe(1);
    expect(result.totalEnrollment).toBe(2);
    expect(result.completionPercent).toBe(42);
  });

  it("normalizes malformed section lessonId and _id", async () => {
    mockRequireAuth.mockResolvedValueOnce(true);
    (mockCourseModel.findOne as jest.Mock).mockReturnValueOnce(
      mockFindOnePopulated({
        _id: "course-1",
        slug: "course-slug",
        createdBy: { _id: "user-1" },
      }),
    );

    (mockSectionModel.find as jest.Mock).mockReturnValueOnce({
      populate: () => ({
        lean: () =>
          Promise.resolve([{ _id: { toString: () => "s1" }, lessonId: {} }]),
      }),
    });

    (mockEnrollmentModel.countDocuments as jest.Mock).mockResolvedValueOnce(0);
    mockCalculateCompletion.mockReturnValueOnce(0);

    const result = await instructorCourseOverview(
      {},
      { slug: "course-slug" },
      { user: baseUser },
    );

    expect(result.totalSections).toBe(1);
    expect(result.totalLessons).toBe(0);
    expect(result.totalEnrollment).toBe(0);
    expect(result.completionPercent).toBe(0);
  });

  it("handles course with no sections", async () => {
    mockRequireAuth.mockResolvedValueOnce(true);
    (mockCourseModel.findOne as jest.Mock).mockReturnValueOnce(
      mockFindOnePopulated({
        _id: "course-1",
        slug: "course-slug",
        createdBy: { _id: "user-1" },
      }),
    );

    (mockSectionModel.find as jest.Mock).mockReturnValueOnce({
      populate: () => ({
        lean: () => Promise.resolve([]),
      }),
    });

    (mockEnrollmentModel.countDocuments as jest.Mock).mockResolvedValueOnce(0);
    mockCalculateCompletion.mockReturnValueOnce(0);

    const result = await instructorCourseOverview(
      {},
      { slug: "course-slug" },
      { user: baseUser },
    );

    expect(result.totalSections).toBe(0);
    expect(result.totalLessons).toBe(0);
    expect(result.totalEnrollment).toBe(0);
    expect(result.completionPercent).toBe(0);
  });

  it("throws FORBIDDEN when user is not allowed", async () => {
    mockRequireAuth.mockRejectedValueOnce(
      new GraphQLError("Forbidden", { extensions: { code: "FORBIDDEN" } }),
    );

    await expect(
      instructorCourseOverview({}, { slug: "course-slug" }, { user: baseUser }),
    ).rejects.toThrow("Forbidden");
  });

  it("throws BAD_USER_INPUT when slug is missing", async () => {
    mockRequireAuth.mockResolvedValueOnce(true);

    await expect(
      instructorCourseOverview({}, { slug: "" }, { user: baseUser }),
    ).rejects.toThrow("Course slug is required");
  });

  it("throws COURSE_NOT_FOUND if course is missing", async () => {
    mockRequireAuth.mockResolvedValueOnce(true);
    (mockCourseModel.findOne as jest.Mock).mockReturnValueOnce({
      populate: () => Promise.resolve(null),
    });

    await expect(
      instructorCourseOverview({}, { slug: "missing" }, { user: baseUser }),
    ).rejects.toThrow("Course not found");
  });

  it("throws FORBIDDEN if not owner or admin", async () => {
    mockRequireAuth.mockResolvedValueOnce(true);
    (mockCourseModel.findOne as jest.Mock).mockReturnValueOnce(
      mockFindOnePopulated({
        _id: "course-1",
        slug: "course-slug",
        createdBy: { _id: "other-user" },
      }),
    );

    await expect(
      instructorCourseOverview({}, { slug: "course-slug" }, { user: baseUser }),
    ).rejects.toThrow("Access denied: You are not the course owner");
  });

  it("throws INTERNAL_SERVER_ERROR on unknown error", async () => {
    mockRequireAuth.mockImplementationOnce(() => {
      throw new Error("Unexpected failure");
    });

    await expect(
      instructorCourseOverview({}, { slug: "course-slug" }, { user: baseUser }),
    ).rejects.toThrow("Internal Server Error");
  });
});
