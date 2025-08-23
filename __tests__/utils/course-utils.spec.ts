import { Course, Difficulty, Section } from "@/generated/graphql";
import { calculateCourseCompletionPercent } from "@/utils/courseUtils";
import { stripHtml } from "@/utils/stripHtml";

// Mock the stripHtml function
jest.mock("../../src/utils/stripHtml", () => ({
  stripHtml: jest.fn((input: string) => input), // Mock to return input as-is for simplicity
}));

describe("calculateCourseCompletionPercent", () => {
  // Base course and section for tests
  const defaultCourse: Course = {
    title: "Test Course",
    subtitle: "Test Subtitle",
    slug: "test-course",
    description: "<p>Test Description</p>",
    whoIsThisFor: "<p>For everyone</p>",
    requirements: "<p>No requirements</p>",
    category: "Programming",
    difficulty: Difficulty.Beginner,
    thumbnail: { publicId: "thumbnail123" },
    price: { amount: 99.99 },
  };

  const defaultSection: Section = {
    lessonId: ["lesson1"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 100% for a fully completed course", () => {
    const result = calculateCourseCompletionPercent(defaultCourse, [
      defaultSection,
    ]);
    expect(result).toBe(100);
  });

  test("should return 0% for an empty course with no sections", () => {
    const emptyCourse: Course = {
      title: "",
      subtitle: "",
      slug: "",
      description: "",
      whoIsThisFor: "",
      requirements: "",
      category: "",
      difficulty: "",
      thumbnail: null,
      price: null,
    };
    const result = calculateCourseCompletionPercent(emptyCourse, []);
    expect(result).toBe(0);
  });

  test("should calculate partial completion correctly", () => {
    const partialCourse: Course = {
      title: "Test Course",
      subtitle: "",
      slug: "test-course",
      description: "<p>Test Description</p>",
      whoIsThisFor: "",
      requirements: "",
      category: "Programming",
      difficulty: "",
      thumbnail: null,
      price: null,
    };
    const result = calculateCourseCompletionPercent(partialCourse, []);
    // Checklist: title (true), subtitle (false), slug (true), description (true),
    // whoIsThisFor (false), requirements (false), category (true), difficulty (false),
    // thumbnail (false), sections (false), hasLessons (false), price (false)
    // 4/12 = 33.33% rounded to 33
    expect(result).toBe(33);
  });

  test("should handle sections without lessons", () => {
    const sectionWithoutLessons: Section = {
      lessonId: [],
    };
    const result = calculateCourseCompletionPercent(defaultCourse, [
      sectionWithoutLessons,
    ]);
    // All fields true except hasLessons (false): 11/12 = 91.67% rounded to 92
    expect(result).toBe(92);
  });

  test("should handle null or undefined fields", () => {
    const courseWithNulls: Course = {
      title: null,
      subtitle: undefined,
      slug: "test-course",
      description: null,
      whoIsThisFor: undefined,
      requirements: "",
      category: "Programming",
      difficulty: null,
      thumbnail: null,
      price: { amount: null },
    };
    const result = calculateCourseCompletionPercent(courseWithNulls, [
      defaultSection,
    ]);
    // Checklist: title (false), subtitle (false), slug (true), description (false),
    // whoIsThisFor (false), requirements (false), category (true), difficulty (false),
    // thumbnail (false), sections (true), hasLessons (true), price (false)
    // 3/12 = 25% rounded
    expect(result).toBe(25);
  });

  test("should handle stripHtml returning empty string", () => {
    (stripHtml as jest.Mock).mockImplementation(() => "");
    const course: Course = {
      ...defaultCourse,
      description: "<p>Test</p>",
      whoIsThisFor: "<p>Test</p>",
      requirements: "<p>Test</p>",
    };
    const result = calculateCourseCompletionPercent(course, [defaultSection]);
    // All fields true except description, whoIsThisFor, requirements (false): 9/12 = 75%
    expect(result).toBe(75);
  });

  test("should handle numeric price correctly", () => {
    const courseWithZeroPrice: Course = {
      ...defaultCourse,
      price: { amount: 0 },
    };
    const result = calculateCourseCompletionPercent(courseWithZeroPrice, [
      defaultSection,
    ]);
    expect(result).toBe(100); // 0 is a valid number, so price is considered completed
  });
});
