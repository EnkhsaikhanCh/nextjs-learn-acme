import { createCourse } from "../../../../../src/app/api/graphql/resolvers/mutations/course/create-course-mutation";
import { CourseModel } from "../../../../../src/app/api/graphql/models/course.model";
import { GraphQLError } from "graphql";
import { CreateCourseInput } from "@/app/api/graphql/schemas/course.schema";

jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: {
    create: jest.fn(),
  },
}));

describe("createCourse", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should create a course successfully", async () => {
    const input = {
      _id: "101",
      title: "HTML, CSS, and JavaScript for Beginners",
      description:
        "Learn the basics of web development with this comprehensive course on HTML, CSS, and JavaScript. Perfect for beginners!",
      price: 100000,
      duration: 24,
      createdBy: "122133",
      categories: ["Web Development", "Frontend"],
      tags: ["HTML", "CSS", "JavaScript", "Beginners", "Web Development"],
      enrollments: ["user1-id", "user2-id"],
      thumbnail: "https://example.com/path-to-thumbnail.jpg",
    };

    const mockCourse = {
      _id: "101",
      title: "HTML, CSS, and JavaScript for Beginners",
      description:
        "Learn the basics of web development with this comprehensive course on HTML, CSS, and JavaScript. Perfect for beginners!",
      price: 100000,
      duration: 24,
      createdBy: "122133",
      categories: ["Web Development", "Frontend"],
      tags: ["HTML", "CSS", "JavaScript", "Beginners", "Web Development"],
      enrollments: ["user1-id", "user2-id"],
      thumbnail: "https://example.com/path-to-thumbnail.jpg",
    };

    (CourseModel.create as jest.Mock).mockResolvedValue(input);

    const result = await createCourse({}, { input });

    expect(CourseModel.create).toHaveBeenCalledWith({
      _id: "101",
      title: "HTML, CSS, and JavaScript for Beginners",
      description:
        "Learn the basics of web development with this comprehensive course on HTML, CSS, and JavaScript. Perfect for beginners!",
      price: 100000,
      duration: 24,
      createdBy: "122133",
      categories: ["Web Development", "Frontend"],
      tags: ["HTML", "CSS", "JavaScript", "Beginners", "Web Development"],
      enrollments: ["user1-id", "user2-id"],
      thumbnail: "https://example.com/path-to-thumbnail.jpg",
    });

    // Correcting the result assertion
    expect(result).toEqual(mockCourse);
  });

  it("should throw a BAD_USER_INPUT error for missing title, description, and price", async () => {
    const input: CreateCourseInput = {
      _id: "101",
      title: "",
      description: "",
      price: 0,
    };

    await expect(createCourse({}, { input })).rejects.toThrow(GraphQLError);
    await expect(createCourse({}, { input })).rejects.toThrow(
      "Missing required fields: title, description, or price",
    );
  });

  it("should throw a new GraphQLError with INTERNAL_SERVER_ERROR for non-GraphQLError", async () => {
    const input = {
      _id: "101",
      title: "Test Course",
      description: "A test description",
      price: 100,
      duration: 24,
    };

    const mockError = new Error("A non-GraphQL error");

    (CourseModel.create as jest.Mock).mockImplementation(() => {
      throw mockError; // Simulate throwing a regular error
    });

    await expect(createCourse({}, { input })).rejects.toThrow(GraphQLError);
    await expect(createCourse({}, { input })).rejects.toThrow(
      "Internal server error: A non-GraphQL error",
    );
  });
});
