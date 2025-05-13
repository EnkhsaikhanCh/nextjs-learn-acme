// __tests__/api/graphql/queries/course/get-course-preview-data.spec.ts

import { getCoursePreviewData } from "@/app/api/graphql/resolvers/queries/course/get-course-preview-data-query";
import {
  CourseModel,
  SectionModel,
  LessonV2Model,
} from "../../../../../src/app/api/graphql/models";
import { GetCoursePreviewDataResponse } from "@/generated/graphql";

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  CourseModel: { findOne: jest.fn() },
  SectionModel: { find: jest.fn() },
  LessonV2Model: { find: jest.fn() },
}));

describe("getCoursePreviewData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns error when slug is missing", async () => {
    const result = await getCoursePreviewData(null, { slug: "" });
    expect(result).toEqual<GetCoursePreviewDataResponse>({
      success: false,
      message: "Course slug is required.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalLessonDurationSeconds: null,
      totalLessonDurationHours: null,
    });
  });

  it("returns error when course not found", async () => {
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });
    const result = await getCoursePreviewData(null, { slug: "slug1" });
    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug: "slug1" });
    expect(result).toEqual<GetCoursePreviewDataResponse>({
      success: false,
      message: "Course not found.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalLessonDurationSeconds: null,
      totalLessonDurationHours: null,
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

    const result = await getCoursePreviewData(null, {
      slug: "slug-null-durations",
    });

    expect(result).toEqual({
      success: true,
      message: "Course preview data fetched successfully.",
      course: { _id: "cid", sectionId: ["sec1"] },
      totalSections: 1,
      totalLessons: 2,
      totalLessonDurationSeconds: 0,
      totalLessonDurationHours: 0,
    });
  });

  it("returns correct preview data for published lessons", async () => {
    const fakeCourseDoc = {
      _id: "cid",
      sectionId: ["sec1", "sec2"],
      populate: jest.fn().mockResolvedValue({
        _id: "cid",
        sectionId: ["sec1", "sec2"],
      }),
    };
    (CourseModel.findOne as jest.Mock).mockReturnValue(fakeCourseDoc);

    const fakeSections = [{}, {}];
    (SectionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(fakeSections),
      }),
    });

    const fakeLessons = [
      { duration: "01:00:00", isPublished: true },
      { duration: "00:30:00", isPublished: false },
      { duration: "05:30", isPublished: true },
    ];
    (LessonV2Model.find as jest.Mock).mockReturnValue({
      lean: jest
        .fn()
        .mockResolvedValue(fakeLessons.filter((l) => l.isPublished)),
    });

    const result = await getCoursePreviewData(null, { slug: "slug1" });

    expect(fakeCourseDoc.populate).toHaveBeenCalledWith([
      { path: "createdBy", model: "UserV2" },
      {
        path: "sectionId",
        model: "Section",
        populate: {
          path: "lessonId",
          model: "LessonV2",
        },
      },
    ]);
    expect(SectionModel.find).toHaveBeenCalledWith({ courseId: "cid" });
    expect(LessonV2Model.find).toHaveBeenCalledWith({
      sectionId: { $in: ["sec1", "sec2"] },
      isPublished: true,
    });

    const expectedSeconds = 3600 + 330; // 1h + 5m30s
    expect(result).toEqual({
      success: true,
      message: "Course preview data fetched successfully.",
      course: { _id: "cid", sectionId: ["sec1", "sec2"] },
      totalSections: 2,
      totalLessons: 2,
      totalLessonDurationSeconds: expectedSeconds,
      totalLessonDurationHours: Math.floor(expectedSeconds / 3600),
    });
  });

  it("handles unexpected errors gracefully", async () => {
    (CourseModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("DB fail");
    });
    const result = await getCoursePreviewData(null, { slug: "slug1" });
    expect(result).toEqual<GetCoursePreviewDataResponse>({
      success: false,
      message: "Unexpected server error.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalLessonDurationSeconds: null,
      totalLessonDurationHours: null,
    });
  });
});
