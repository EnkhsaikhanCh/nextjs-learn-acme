import { CourseModel } from "@/app/api/graphql/models";
import { generateNextCourseCode } from "@/utils/generate-next-course-code";

jest.mock("../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: { findOne: jest.fn() },
}));

describe("generateNextCourseCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns '001' when no courses exist", async () => {
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });
    const code = await generateNextCourseCode();
    expect(code).toBe("001");
    expect(CourseModel.findOne).toHaveBeenCalled();
  });

  it("returns '001' when lastCourse has no courseCode", async () => {
    const lastCourse = { courseCode: undefined };
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(lastCourse),
    });
    const code = await generateNextCourseCode();
    expect(code).toBe("001");
  });

  it("throws GraphQLError for invalid numeric format", async () => {
    const lastCourse = { courseCode: "abc" };
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(lastCourse),
    });
    await expect(generateNextCourseCode()).rejects.toMatchObject({
      message: "Invalid course code format in database",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });

  it("increments valid courseCode correctly", async () => {
    const lastCourse = { courseCode: "009" };
    (CourseModel.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(lastCourse),
    });
    const code = await generateNextCourseCode();
    expect(code).toBe("010");
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (CourseModel.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("DB fail");
    });
    await expect(generateNextCourseCode()).rejects.toMatchObject({
      message: "Failed to generate next course code",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
