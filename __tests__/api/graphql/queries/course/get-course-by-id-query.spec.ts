import { GraphQLError } from "graphql";
import { CourseModel } from "../../../../../src/app/api/graphql/models/course.model";
import { getCourseById } from "../../../../../src/app/api/graphql/resolvers/queries/course/get-course-by-id-query";

jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: {
    findById: jest.fn(),
  },
}));

describe("getCourseById", () => {
  it("should return the course when a valid ID is provided", async () => {
    const mockCourse = {
      _id: "course1",
      enrollmentId: {
        userId: { _id: "user1", email: "user1@example.com", role: "student" },
        courseId: {
          _id: "course1",
          title: "Course 1",
          description: "Description 1",
          price: 100,
          createdBy: "admin",
        },
      },
    };

    const mockPopulate = jest.fn().mockResolvedValue(mockCourse);
    (CourseModel.findById as jest.Mock).mockReturnValue({
      populate: mockPopulate,
    });

    const result = await getCourseById(null, { _id: "course1" });
    expect(result).toEqual(mockCourse);
    expect(CourseModel.findById).toHaveBeenCalledWith("course1");
    expect(mockPopulate).toHaveBeenCalledWith({
      path: "enrollmentId",
      model: "Enrollment",
      populate: [
        {
          path: "userId",
          select: "_id email studentId role isVerified",
        },
        {
          path: "courseId",
          select:
            "_id title description price duration createdBy categories tags status thumbnail",
        },
      ],
    });
  });

  it("should throw a GraphQLError with code 'COURSE_NOT_FOUND' when the course does not exist", async () => {
    const mockPopulate = jest.fn().mockResolvedValue(null);
    (CourseModel.findById as jest.Mock).mockReturnValue({
      populate: mockPopulate,
    });

    await expect(getCourseById(null, { _id: "invalidId" })).rejects.toThrow(
      GraphQLError,
    );
    await expect(getCourseById(null, { _id: "invalidId" })).rejects.toThrow(
      "Course not found",
    );
  });

  it("should throw a generic GraphQLError for unexpected errors", async () => {
    const mockError = new Error("Unexpected error");
    const mockPopulate = jest.fn().mockRejectedValue(mockError);
    (CourseModel.findById as jest.Mock).mockReturnValue({
      populate: mockPopulate,
    });

    await expect(getCourseById(null, { _id: "course1" })).rejects.toThrow(
      GraphQLError,
    );
    await expect(getCourseById(null, { _id: "course1" })).rejects.toThrow(
      "Failed to fetch user",
    );
  });
});
