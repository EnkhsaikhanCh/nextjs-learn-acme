import { GraphQLError } from "graphql";
import { CourseModel } from "../../../../../src/app/api/graphql/models/course.model";
import { getAllCourse } from "../../../../../src/app/api/graphql/resolvers/queries/course/get-all-course";

jest.mock("../../../../../src/app/api/graphql/models/course.model");

describe("getAllCourse", () => {
  it("should return all courses when the database query is successful", async () => {
    const mockCourses = [
      {
        enrollmentId: {
          userId: { _id: "user1", email: "user1@example.com", role: "student" },
          courseId: {
            _id: "course1",
            title: "Course 1",
            price: 100,
            createdBy: "admin",
          },
        },
      },
    ];

    // Mock the Mongoose Query chain
    const mockPopulate = jest.fn().mockResolvedValue(mockCourses);
    (CourseModel.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

    const result = await getAllCourse();
    expect(result).toEqual(mockCourses);
    expect(CourseModel.find).toHaveBeenCalledTimes(1);
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

  it("should throw a GraphQLError when an instance of GraphQLError is encountered", async () => {
    const mockError = new GraphQLError("Custom GraphQLError");
    const mockPopulate = jest.fn().mockRejectedValue(mockError);
    (CourseModel.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

    await expect(getAllCourse()).rejects.toThrow(GraphQLError);
    await expect(getAllCourse()).rejects.toThrow("Custom GraphQLError");
  });

  it("should throw a generic GraphQLError for unexpected errors", async () => {
    const mockError = new Error("Unexpected error");
    const mockPopulate = jest.fn().mockRejectedValue(mockError);
    (CourseModel.find as jest.Mock).mockReturnValue({ populate: mockPopulate });

    await expect(getAllCourse()).rejects.toThrow(GraphQLError);
    await expect(getAllCourse()).rejects.toThrow(
      "Internal server error: Unexpected error",
    );
  });
});
