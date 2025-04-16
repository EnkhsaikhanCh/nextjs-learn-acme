import { requireAuthAndRoles } from "@/lib/auth-utils";
import { CourseModel } from "../../../../../src/app/api/graphql/models";
import { GraphQLError } from "graphql";
import { CreateCourseInput, Role, User } from "@/generated/graphql";
import { generateUniqueSlug } from "@/utils/generate-unique-slug";
import { generateNextCourseCode } from "@/utils/generate-next-course-code";
import { createCourse } from "@/app/api/graphql/resolvers/mutations";

// --- Mocks ---
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/utils/generate-unique-slug", () => ({
  generateUniqueSlug: jest.fn(),
}));

jest.mock("../../../../../src/utils/generate-next-course-code", () => ({
  generateNextCourseCode: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: jest.fn(),
}));

const MockCourseModel = CourseModel as jest.MockedClass<typeof CourseModel>;

describe("createCourse", () => {
  const instructorUser: User = {
    _id: "instructor-123",
    email: "instructor@example.com",
    role: Role.Instructor,
    studentId: "instructor-student",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validInput: CreateCourseInput = {
    title: "My Awesome Course",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws an error if requireAuthAndRoles fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthorized"),
    );
    await expect(
      createCourse(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toThrow("Unauthorized");
  });

  it("throws an error if input.title is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const input = { ...validInput, title: "" };
    await expect(
      createCourse(null, { input }, { user: instructorUser }),
    ).rejects.toThrow("Missing required title field");
  });

  describe("Slug and Course Code Generation", () => {
    it("successfully creates a course when no last course exists", async () => {
      (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
      // Mock helper functions:
      (generateUniqueSlug as jest.Mock).mockResolvedValue("my-awesome-course");
      (generateNextCourseCode as jest.Mock).mockResolvedValue("001");

      // Create a fake saved course that our instance's save() will resolve to.
      const fakeSavedCourse = {
        _id: "new-course-id",
        title: validInput.title,
        createdBy: instructorUser._id,
        slug: "my-awesome-course",
        courseCode: "001",
      };

      // Override the CourseModel constructor.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      MockCourseModel.mockImplementationOnce((data: any) => {
        return {
          ...data,
          save: jest.fn().mockResolvedValue(fakeSavedCourse),
        };
      });

      const result = await createCourse(
        null,
        { input: validInput },
        { user: instructorUser },
      );

      // Validate that helper functions were called.
      expect(generateUniqueSlug).toHaveBeenCalledWith(
        validInput.title,
        MockCourseModel,
      );
      expect(generateNextCourseCode).toHaveBeenCalled();
      // Validate that the new instance was created with the correct values.
      expect(MockCourseModel).toHaveBeenCalledWith({
        title: validInput.title,
        createdBy: instructorUser._id,
        slug: "my-awesome-course",
        courseCode: "001",
      });
      // And that the result is as expected.
      expect(result).toEqual(fakeSavedCourse);
    });

    it("successfully creates a course when a last course exists", async () => {
      (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
      // Return a generated slug.
      (generateUniqueSlug as jest.Mock).mockResolvedValue("my-awesome-course");
      // Simulate that a last course exists with courseCode "005", so new code becomes "006".
      (generateNextCourseCode as jest.Mock).mockResolvedValue("006");

      const fakeSavedCourse = {
        _id: "new-course-id",
        title: validInput.title,
        createdBy: instructorUser._id,
        slug: "my-awesome-course",
        courseCode: "006",
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      MockCourseModel.mockImplementationOnce((data: any) => {
        return {
          ...data,
          save: jest.fn().mockResolvedValue(fakeSavedCourse),
        };
      });

      const result = await createCourse(
        null,
        { input: validInput },
        { user: instructorUser },
      );
      expect(generateUniqueSlug).toHaveBeenCalledWith(
        validInput.title,
        MockCourseModel,
      );
      expect(generateNextCourseCode).toHaveBeenCalled();
      expect(MockCourseModel).toHaveBeenCalledWith({
        title: validInput.title,
        createdBy: instructorUser._id,
        slug: "my-awesome-course",
        courseCode: "006",
      });
      expect(result).toEqual(fakeSavedCourse);
    });
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    MockCourseModel.mockImplementationOnce(() => {
      throw new Error("DB error");
    });
    await expect(
      createCourse(null, { input: validInput }, { user: instructorUser }),
    ).rejects.toThrow("Internal server error");
  });
});
