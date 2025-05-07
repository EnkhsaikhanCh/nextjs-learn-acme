// __tests__/api/graphql/queries/course/get-course-preview-data.spec.ts

import { getCoursePreviewData } from "@/app/api/graphql/resolvers/queries/course/get-course-preview-data-query";
import {
  CourseModel,
  SectionModel,
  LessonV2Model,
} from "../../../../../src/app/api/graphql/models";

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
    const res = await getCoursePreviewData(null, { slug: "" });
    expect(res).toEqual({
      success: false,
      message: "Course slug is required.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalAllLessonsVideosHours: null,
    });
  });

  it("returns error when course not found", async () => {
    (CourseModel.findOne as jest.Mock).mockResolvedValue(null);
    const res = await getCoursePreviewData(null, { slug: "abc" });
    expect(CourseModel.findOne).toHaveBeenCalledWith({ slug: "abc" });
    expect(res).toEqual({
      success: false,
      message: "Course not found.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalAllLessonsVideosHours: null,
    });
  });

  it("returns preview data correctly", async () => {
    const fakeCourse = {
      _id: "cid",
      sectionId: ["s1", "s2"],
      populate: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findOne as jest.Mock).mockResolvedValue(fakeCourse);
    const fakeSections = [
      { _id: "s1", lessonId: ["l1"] },
      { _id: "s2", lessonId: ["l2", "l3"] },
    ];
    (SectionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(fakeSections),
    });
    const fakeLessons = [
      { duration: "10:00" },
      { duration: "20:30" },
      { duration: undefined },
    ];
    (LessonV2Model.find as jest.Mock).mockResolvedValue(fakeLessons);

    const res = await getCoursePreviewData(null, { slug: "abc" });

    expect(fakeCourse.populate).toHaveBeenCalledWith([
      { path: "createdBy", model: "UserV2" },
      {
        path: "sectionId",
        model: "Section",
        populate: { path: "lessonId", model: "LessonV2" },
      },
    ]);
    expect(SectionModel.find).toHaveBeenCalledWith({ courseId: "cid" });
    expect(LessonV2Model.find).toHaveBeenCalledWith({
      sectionId: { $in: ["s1", "s2"] },
      isPublished: true,
    });

    expect(res).toEqual({
      success: true,
      message: "Course preview data fetched successfully.",
      course: fakeCourse,
      totalSections: 2,
      totalLessons: 3,
      totalAllLessonsVideosHours: Math.floor((10 * 60 + 20 * 60 + 30) / 3600),
    });
  });

  it("handles unexpected errors", async () => {
    (CourseModel.findOne as jest.Mock).mockRejectedValue(new Error("oops"));
    const res = await getCoursePreviewData(null, { slug: "x" });
    expect(res).toEqual({
      success: false,
      message: "Unexpected server error.",
      course: null,
      totalSections: null,
      totalLessons: null,
      totalAllLessonsVideosHours: null,
    });
  });
});
