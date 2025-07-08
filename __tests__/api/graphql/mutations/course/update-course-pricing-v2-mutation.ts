// __tests__/api/graphql/mutations/course/update-course-pricing-v2-mutation.spec.ts
import { updateCoursePricingV2 } from "../../../../../src/app/api/graphql/resolvers/mutations/course/update-course-pricing-v2-mutation";
import { CourseModel } from "../../../../../src/app/api/graphql/models";
import { requireAuthAndRolesV2 } from "../../../../../src/lib/auth-userV2-utils";
import { Currency, UserV2, UserV2Role } from "@/generated/graphql";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models", () => ({
  CourseModel: { findById: jest.fn() },
}));

describe("updateCoursePricingV2", () => {
  const instructor: UserV2 = {
    _id: "inst1",
    email: "i@example.com",
    role: UserV2Role.Instructor,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRolesV2 as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws if not authenticated", async () => {
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(
      new Error("Auth fail"),
    );
    await expect(
      updateCoursePricingV2(
        null,
        { courseId: "cid", input: { amount: 0, currency: Currency.Mnt } },
        { user: instructor },
      ),
    ).rejects.toThrow("Auth fail");
  });

  it("returns validation error when amount is negative", async () => {
    const res = await updateCoursePricingV2(
      null,
      { courseId: "cid", input: { amount: -5, currency: Currency.Mnt } },
      { user: instructor },
    );
    expect(res).toEqual({
      success: false,
      message: "Amount must be at least 0.",
    });
  });

  it("returns error when courseId is missing", async () => {
    const res = await updateCoursePricingV2(
      null,
      { courseId: "", input: { amount: 0, currency: Currency.Mnt } },
      { user: instructor },
    );
    expect(res).toEqual({
      success: false,
      message: "Course ID is required.",
    });
  });

  it("returns error when course not found", async () => {
    (CourseModel.findById as jest.Mock).mockResolvedValue(null);
    const res = await updateCoursePricingV2(
      null,
      { courseId: "cid", input: { amount: 0, currency: Currency.Mnt } },
      { user: instructor },
    );
    expect(res).toEqual({
      success: false,
      message: "Course not found.",
    });
  });

  it("returns error when user is not owner", async () => {
    const fakeCourse = { createdBy: "other", save: jest.fn() };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);
    const res = await updateCoursePricingV2(
      null,
      { courseId: "cid", input: { amount: 10, currency: Currency.Mnt } },
      { user: instructor },
    );
    expect(res).toEqual({
      success: false,
      message: "Access denied: You are not authorized to update this course.",
    });
  });

  it("updates course price and returns success", async () => {
    const fakeCourse = {
      createdBy: instructor._id,
      save: jest.fn().mockResolvedValue(undefined),
      price: {},
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);
    const input = {
      planTitle: "Pro",
      description: ["Desc1", "Desc2"],
      amount: 100,
      currency: Currency.Mnt,
    };
    const res = await updateCoursePricingV2(
      null,
      { courseId: "cid", input },
      { user: instructor },
    );
    expect(fakeCourse.price).toEqual(input);
    expect(fakeCourse.save).toHaveBeenCalled();
    expect(res).toEqual({
      success: true,
      message: "Course pricing successfully updated.",
    });
  });

  it("sets default empty array for description if not provided", async () => {
    const fakeCourse = {
      createdBy: instructor._id,
      save: jest.fn().mockResolvedValue(undefined),
      price: {},
    };
    (CourseModel.findById as jest.Mock).mockResolvedValue(fakeCourse);
    const input = {
      planTitle: "Basic",
      amount: 50,
      currency: Currency.Mnt,
      // description is intentionally omitted
    };
    const res = await updateCoursePricingV2(
      null,
      { courseId: "cid", input },
      { user: instructor },
    );
    expect(fakeCourse.price).toEqual({
      planTitle: "Basic",
      description: [],
      amount: 50,
      currency: Currency.Mnt,
    });
    expect(fakeCourse.save).toHaveBeenCalled();
    expect(res).toEqual({
      success: true,
      message: "Course pricing successfully updated.",
    });
  });

  it("handles unexpected errors gracefully", async () => {
    (CourseModel.findById as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );
    const res = await updateCoursePricingV2(
      null,
      { courseId: "cid", input: { amount: 0, currency: Currency.Mnt } },
      { user: instructor },
    );
    expect(res).toEqual({
      success: false,
      message: "Internal error: DB error",
    });
  });
});
