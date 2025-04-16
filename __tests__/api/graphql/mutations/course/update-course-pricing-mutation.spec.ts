import { updateCoursePricing } from "@/app/api/graphql/resolvers/mutations/course/update-course-pricing-mutation";
import { CourseModel } from "@/app/api/graphql/models/course.model";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import {
  UpdateCoursePricingInput,
  Role,
  User,
  Currency,
} from "@/generated/graphql";

// Mock dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/course.model", () => ({
  CourseModel: {
    findById: jest.fn(),
  },
}));

describe("updateCoursePricing", () => {
  const ownerId = "owner-123";
  const instructorUser: User = {
    _id: ownerId,
    email: "instr@example.com",
    role: Role.Instructor,
    studentId: "stud-123",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const nonOwnerUser: User = {
    _id: "other-456",
    email: "other@example.com",
    role: Role.Instructor,
    studentId: "stud-456",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const validInput: UpdateCoursePricingInput = {
    planTitle: "Pro Plan",
    description: "Full access",
    amount: 4999,
    currency: Currency.Mnt,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws if not authenticated or authorized", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
    await expect(
      updateCoursePricing(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCoursePricing(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Unauthenticated");
  });

  it("throws BAD_USER_INPUT if courseId is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    await expect(
      updateCoursePricing(
        null,
        { courseId: "", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCoursePricing(
        null,
        { courseId: "", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Course ID is required");
  });

  it("throws COURSE_NOT_FOUND if course does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (CourseModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateCoursePricing(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCoursePricing(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Course not found");
  });

  it("throws FORBIDDEN if user is not the owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = { createdBy: ownerId, save: jest.fn() };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    await expect(
      updateCoursePricing(
        null,
        { courseId: "course-1", input: validInput },
        { user: nonOwnerUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCoursePricing(
        null,
        { courseId: "course-1", input: validInput },
        { user: nonOwnerUser },
      ),
    ).rejects.toHaveProperty(
      "message",
      "Access denied: You are not authorized to update this course",
    );
  });

  it("updates pricing successfully when valid and owner", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      price: {},
      save: jest.fn().mockResolvedValue(undefined),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    const result = await updateCoursePricing(
      null,
      { courseId: "course-1", input: validInput },
      { user: instructorUser },
    );

    // Expect price to be updated
    expect(fakeCourse.price).toEqual({
      planTitle: validInput.planTitle,
      description: validInput.description,
      amount: validInput.amount,
      currency: validInput.currency,
    });
    expect(fakeCourse.save).toHaveBeenCalled();
    expect(result).toBe(fakeCourse);
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected save error", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const fakeCourse = {
      createdBy: ownerId,
      save: jest.fn().mockRejectedValue(new Error("DB fail")),
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);

    await expect(
      updateCoursePricing(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updateCoursePricing(
        null,
        { courseId: "course-1", input: validInput },
        { user: instructorUser },
      ),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
