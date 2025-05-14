// __tests__/api/graphql/queries/course/get-course-preview-data-v2-query.spec.ts
import {
  CourseModel,
  SectionModel,
  LessonV2Model,
  EnrollmentModel,
} from "@/app/api/graphql/models";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import {
  UserV2Role,
  GetCoursePreviewDataResponse,
  UserV2,
} from "@/generated/graphql";
import { getCoursePreviewData } from "@/app/api/graphql/resolvers/queries/course/get-course-preview-data-query";

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  CourseModel: { findOne: jest.fn() },
  SectionModel: { find: jest.fn() },
  LessonV2Model: { find: jest.fn() },
  EnrollmentModel: { exists: jest.fn() },
}));

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));

describe("getCoursePreviewData (v2)", () => {
  const mockUser: UserV2 = {
    _id: "user-1",
    email: "u@example.com",
    role: UserV2Role.Student,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRolesV2 as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws if not authorized", async () => {
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(new Error("nope"));
    await expect(
      getCoursePreviewData(null, { slug: "s" }, { user: mockUser }),
    ).rejects.toThrow("nope");
  });

  it("returns error when slug is missing", async () => {
    const res = await getCoursePreviewData(
      null,
      { slug: "" },
      { user: mockUser },
    );
    expect(res).toEqual<GetCoursePreviewDataResponse>({
      success: false,
      message: "Course slug is required.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalLessonDurationSeconds: null,
      totalLessonDurationHours: null,
      isEnrolled: null,
    });
  });

  it("returns error when course not found", async () => {
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });
    const res = await getCoursePreviewData(
      null,
      { slug: "abc" },
      { user: mockUser },
    );
    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug: "abc" });
    expect(res).toEqual<GetCoursePreviewDataResponse>({
      success: false,
      message: "Course not found.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalLessonDurationSeconds: null,
      totalLessonDurationHours: null,
      isEnrolled: null,
    });
  });

  it("handles published lessons with no duration", async () => {
    const fakeCourseDoc = {
      _id: "cid",
      sectionId: ["sec1"],
      populate: jest.fn().mockResolvedValue({
        _id: "cid",
        sectionId: ["sec1"],
      }),
    };
    (CourseModel.findOne as jest.Mock).mockReturnValue(fakeCourseDoc);

    const fakeSections = [{}];
    (SectionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(fakeSections),
      }),
    });

    const fakeLessons = [
      { duration: null, isPublished: true }, // <- no duration
      { isPublished: true }, // <- undefined duration
    ];
    (LessonV2Model.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(fakeLessons),
    });

    const res = await getCoursePreviewData(
      null,
      { slug: "abc" },
      { user: mockUser },
    );

    expect(res).toEqual({
      success: true,
      message: "Course preview data fetched successfully.",
      course: { _id: "cid", sectionId: ["sec1"] },
      totalSections: 1,
      totalLessons: 2,
      totalLessonDurationSeconds: 0,
      totalLessonDurationHours: 0,
      isEnrolled: false,
    });
  });

  it("returns correct preview data including enrollment and durations", async () => {
    const fakeCourse = {
      _id: "cid",
      sectionId: ["sec1", "sec2"],
      populate: jest.fn().mockResolvedValue({
        _id: "cid",
        sectionId: ["sec1", "sec2"],
      }),
    };
    (CourseModel.findOne as jest.Mock).mockReturnValue(fakeCourse);
    (EnrollmentModel.exists as jest.Mock).mockResolvedValue({ _id: "e1" });
    const mockSections = [{}, {}, {}];
    (SectionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSections),
      }),
    });
    const mockLessons = [
      { duration: "01:00:00", isPublished: true },
      { duration: "00:30:00", isPublished: false },
      { duration: "02:15", isPublished: true },
    ];
    (LessonV2Model.find as jest.Mock).mockReturnValue({
      lean: jest
        .fn()
        .mockResolvedValue(mockLessons.filter((l) => l.isPublished)),
    });

    const res = await getCoursePreviewData(
      null,
      { slug: "abc" },
      { user: mockUser },
    );

    expect(requireAuthAndRolesV2).toHaveBeenCalledWith(mockUser, [
      UserV2Role.Admin,
      UserV2Role.Instructor,
      UserV2Role.Student,
    ]);
    expect(fakeCourse.populate).toHaveBeenCalledWith([
      { path: "createdBy", model: "UserV2" },
      {
        path: "sectionId",
        model: "Section",
        populate: { path: "lessonId", model: "LessonV2" },
      },
    ]);
    expect(EnrollmentModel.exists).toHaveBeenCalledWith({
      courseId: "cid",
      userId: "user-1",
      status: "ACTIVE",
    });
    expect(SectionModel.find).toHaveBeenCalledWith({ courseId: "cid" });
    expect(LessonV2Model.find).toHaveBeenCalledWith({
      sectionId: { $in: ["sec1", "sec2"] },
      isPublished: true,
    });

    // durations: 3600 + 135 seconds = 3735 total, hours = 1
    expect(res).toEqual({
      success: true,
      message: "Course preview data fetched successfully.",
      course: { _id: "cid", sectionId: ["sec1", "sec2"] },
      totalSections: 3,
      totalLessons: 2,
      totalLessonDurationSeconds: 3735,
      totalLessonDurationHours: 1,
      isEnrolled: true,
    });
  });

  it("handles unexpected errors gracefully", async () => {
    (CourseModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("fail");
    });
    const res = await getCoursePreviewData(
      null,
      { slug: "abc" },
      { user: mockUser },
    );
    expect(res).toEqual<GetCoursePreviewDataResponse>({
      success: false,
      message: "Unexpected server error.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalLessonDurationSeconds: null,
      totalLessonDurationHours: null,
      isEnrolled: null,
    });
  });
});
