import { GraphQLError } from "graphql";
import { updateCourse } from "../../../../../src/app/api/graphql/resolvers/mutations/course/update-course-mutation";
import { CourseModel } from "../../../../../src/app/api/graphql/models/course.model";
import { UpdateCourseInput } from "@/app/api/graphql/schemas/course.schema";

jest.mock("../../../../../src/app/api/graphql/models/course.model");

describe("updateCourse - Full Coverage", () => {
  const mockFindById = CourseModel.findById as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test each optional field
  const fields = [
    { field: "title", value: "New Title" },
    { field: "description", value: "New Description" },
    { field: "price", value: 100 },
    { field: "duration", value: 120 },
    { field: "createdBy", value: "user123" },
    { field: "categories", value: ["category1", "category2"] },
    { field: "tags", value: ["tag1", "tag2"] },
    { field: "status", value: "published" },
    { field: "thumbnail", value: "http://example.com/image.png" },
  ];

  fields.forEach(({ field, value }) => {
    it("should throw an error if the course ID is missing", async () => {
      const input: Partial<UpdateCourseInput> = {
        title: "New Title",
      };

      await expect(
        updateCourse({}, { input: input as UpdateCourseInput }),
      ).rejects.toThrow("Course ID is required");
    });

    it("should throw an error if the course is not found", async () => {
      mockFindById.mockResolvedValue(null);

      const input = {
        _id: "123",
        title: "New Title",
      };

      await expect(updateCourse({}, { input })).rejects.toThrow(
        "Course not found",
      );

      expect(mockFindById).toHaveBeenCalledWith("123");
    });

    it("should rethrow a GraphQLError if caught", async () => {
      const error = new GraphQLError("Test GraphQL error");
      mockFindById.mockImplementation(() => {
        throw error;
      });

      const input = {
        _id: "123",
        title: "New Title",
      };

      await expect(updateCourse({}, { input })).rejects.toThrow(
        "Test GraphQL error",
      );

      expect(mockFindById).toHaveBeenCalledWith("123");
    });

    it("should throw an internal server error if a generic error is caught", async () => {
      const error = new Error("Database error");
      mockFindById.mockImplementation(() => {
        throw error;
      });

      const input = {
        _id: "123",
        title: "New Title",
      };

      await expect(updateCourse({}, { input })).rejects.toThrow(
        "Internal server error: Database error",
      );

      expect(mockFindById).toHaveBeenCalledWith("123");
    });

    it(`should update the ${field} field if provided`, async () => {
      const mockCourse = {
        _id: "123",
        [field]: "Old Value",
        save: jest.fn().mockResolvedValue({
          _id: "123",
          [field]: value,
        }),
      };

      mockFindById.mockResolvedValue(mockCourse);

      const input = {
        _id: "123",
        [field]: value,
      };

      const result = await updateCourse({}, { input });

      expect(mockFindById).toHaveBeenCalledWith("123");
      // Instead of `toBe`, do:
      expect(mockCourse[field]).toStrictEqual(value);
      expect(mockCourse.save).toHaveBeenCalled();
      expect(result).toEqual({
        _id: "123",
        [field]: value,
      });
    });
  });

  // Test updating multiple fields
  it("should update multiple fields if provided", async () => {
    const mockCourse = {
      _id: "123",
      title: "Old Title",
      description: "Old Description",
      save: jest.fn().mockResolvedValue({
        _id: "123",
        title: "New Title",
        description: "New Description",
      }),
    };

    mockFindById.mockResolvedValue(mockCourse);

    const input = {
      _id: "123",
      title: "New Title",
      description: "New Description",
    };

    const result = await updateCourse({}, { input });

    expect(mockFindById).toHaveBeenCalledWith("123");
    expect(mockCourse.title).toBe("New Title");
    expect(mockCourse.description).toBe("New Description");
    expect(mockCourse.save).toHaveBeenCalled();
    expect(result).toEqual({
      _id: "123",
      title: "New Title",
      description: "New Description",
    });
  });

  // Test no fields updated
  it("should not update any fields if no optional fields are provided", async () => {
    const mockCourse = {
      _id: "123",
      title: "Old Title",
      save: jest.fn().mockResolvedValue({
        _id: "123",
        title: "Old Title",
      }),
    };

    mockFindById.mockResolvedValue(mockCourse);

    const input = {
      _id: "123",
    };

    const result = await updateCourse({}, { input });

    expect(mockFindById).toHaveBeenCalledWith("123");
    expect(mockCourse.title).toBe("Old Title");
    expect(mockCourse.save).toHaveBeenCalled();
    expect(result).toEqual({
      _id: "123",
      title: "Old Title",
    });
  });
});
